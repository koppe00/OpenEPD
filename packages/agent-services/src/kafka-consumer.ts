import { Kafka, EachMessagePayload } from 'kafkajs'

function sendUrgentNotification(ehrId: string, message: string) {
  console.log(`🚨 URGENT: ${ehrId} - ${message}`)
}

async function run() {
  const kafka = new Kafka({ clientId: 'triage-agent', brokers: ['localhost:9092'] })
  const consumer = kafka.consumer({ groupId: 'triage-agent-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'vitals-created', fromBeginning: true })

  console.log('[triage] subscribed to vitals-created')

  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      const { topic, message } = payload
      try {
        const body = message.value ? message.value.toString() : '{}'
        const parsed = JSON.parse(body)
        console.log('[triage] received', parsed)

        const systolic = Number(parsed.systolic)
        const threshold = 120
        if (!isNaN(systolic) && systolic > threshold) {
          const msg = `Systolic ${systolic} mmHg at ${parsed.recorded_at}`
          sendUrgentNotification(parsed.ehr_id || parsed.patientId || 'unknown', msg)
        } else {
          console.log('[triage] no critical values')
        }
      } catch (err) {
        console.error('[triage] failed to process message', err)
      }
    }
  })
}

run().catch(err => { console.error(err); process.exit(1) })
