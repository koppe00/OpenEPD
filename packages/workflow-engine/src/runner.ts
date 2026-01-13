import { Kafka } from 'kafkajs'
import fs from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'
import axios from 'axios'

export async function runWorkflow(processName = 'acs') {
  const kafka = new Kafka({ clientId: 'workflow-engine', brokers: ['localhost:9092'] })
  const producer = kafka.producer()
  await producer.connect()

  const bpmnPath = path.resolve(__dirname, `../processes/${processName}.bpmn`)
  if (!fs.existsSync(bpmnPath)) throw new Error(`Process not found: ${processName}`)
  const xml = fs.readFileSync(bpmnPath, 'utf-8')
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
  const doc = parser.parse(xml)

  // Load service registry (maps BPMN serviceTask ids to HTTP endpoints)
  const registryPath = path.resolve(__dirname, '../serviceRegistry.json')
  let registry: Record<string, string> = {}
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
    console.log('[registry] loaded', Object.keys(registry))
  } catch (e) {
    console.warn('[registry] no registry found or invalid JSON')
  }

  const proc = doc['bpmn:definitions'] && doc['bpmn:definitions']['bpmn:process']
  const serviceTasks = proc && proc['bpmn:serviceTask']
    ? (Array.isArray(proc['bpmn:serviceTask']) ? proc['bpmn:serviceTask'] : [proc['bpmn:serviceTask']])
    : []

  console.log(`Found ${serviceTasks.length} service tasks in BPMN`) 

  const published: any[] = []
  for (const task of serviceTasks) {
    const id = task.id || task['@_id'] || task['@id'] || 'unknown'
    const name = task.name || task['@_name'] || task['@name'] || ''
    console.log(`Executing service task: ${id} (${name})`)

    // Simulate behavior for a known serviceTask
    const event = {
      orderId: `order-${Date.now()}`,
      patientId: 'UUID456',
      type: id === 'orderECG' ? 'ECG' : 'serviceTask',
      taskId: id,
      priority: 'STAT',
      timestamp: new Date().toISOString()
    }

    // publish to Kafka for backwards compatibility for certain tasks
    if (id === 'orderECG') {
      await producer.send({ topic: 'order-created', messages: [{ value: JSON.stringify(event) }] })
      console.log('[producer] published order-created', event)
      published.push({ topic: 'order-created', event })
    }

    // If a mapped webhook exists, POST the event to it
    const endpoint = registry[id]
    if (endpoint) {
      try {
        const res = await axios.post(endpoint, event, { timeout: 5000 })
        console.log(`[webhook] POST ${endpoint} -> ${res.status}`)
      } catch (err: any) {
        console.error(`[webhook] POST ${endpoint} failed:`, err.message || err)
      }
    }

    // small delay to emulate processing
    await new Promise((r) => setTimeout(r, 400))
  }

  await producer.disconnect()
  return { ok: true, published }
}

export function readRegistry() {
  const registryPath = path.resolve(__dirname, '../serviceRegistry.json')
  try {
    return JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
  } catch (e) {
    return {}
  }
}

export function writeRegistry(obj: Record<string, string>) {
  const registryPath = path.resolve(__dirname, '../serviceRegistry.json')
  fs.writeFileSync(registryPath, JSON.stringify(obj, null, 2), 'utf-8')
}
