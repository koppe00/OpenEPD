import { Kafka } from 'kafkajs'
import { saveVitalsProjection } from '../supabase-client'

async function run() {
  const kafka = new Kafka({ clientId: 'projection-service', brokers: ['localhost:9092'] })
  const consumer = kafka.consumer({ groupId: 'projection-service-group' })
  const producer = kafka.producer()

  await consumer.connect()
  await producer.connect()

  await consumer.subscribe({ topic: 'order-created', fromBeginning: true })

  console.log('[projection] subscribed to order-created')

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const payload = JSON.parse(message.value!.toString())
        console.log('[projection] received', payload)

        // For ECG orders, simulate a projected vitals measurement and save
        if (payload.type === 'ECG' || payload.taskId === 'orderECG') {
          const ehr_id = payload.patientId || payload.ehr_id || 'unknown'
          const systolic = 128
          const diastolic = 80

          // Save projection to Supabase via existing helper
          await saveVitalsProjection(ehr_id, systolic, diastolic)

          // Publish a vitals-created event
          const vitalsEvent = { ehr_id, systolic, diastolic, recorded_at: new Date().toISOString() }
          await producer.send({ topic: 'vitals-created', messages: [{ value: JSON.stringify(vitalsEvent) }] })
          console.log('[projection] published vitals-created', vitalsEvent)
        }
      } catch (err) {
        console.error('[projection] failed to process message', err)
      }
    }
  })
}

run().catch(err => { console.error(err); process.exit(1) })
