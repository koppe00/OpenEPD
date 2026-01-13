import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { runWorkflow, readRegistry, writeRegistry } from './runner'

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/registry', (req: Request, res: Response) => {
  const reg = readRegistry()
  res.json(reg)
})

app.post('/registry', (req: Request, res: Response) => {
  const body = req.body
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid body' })
  writeRegistry(body)
  res.json({ ok: true })
})

app.post('/start', async (req: Request, res: Response) => {
  const { process } = req.body || {}
  const proc = process || 'acs'
  try {
    const result = await runWorkflow(proc)
    res.json({ ok: true, result })
  } catch (err: any) {
    console.error('start error', err?.message || err)
    res.status(500).json({ error: err?.message || String(err) })
  }
})

// retain simple mock webhook endpoints for development convenience
app.post('/webhook/order-ecg', (req: Request, res: Response) => {
  console.log('[mock] /webhook/order-ecg', req.body)
  res.status(200).json({ ok: true })
})

app.post('/webhook/plan-pci', (req: Request, res: Response) => {
  console.log('[mock] /webhook/plan-pci', req.body)
  res.status(200).json({ ok: true })
})

app.post('/webhook/intake', (req: Request, res: Response) => {
  console.log('[mock] /webhook/intake', req.body)
  res.status(200).json({ ok: true })
})

const port = Number(process.env.PORT || 4002)
app.listen(port, () => console.log(`[workflow-engine] server listening on ${port}`))
