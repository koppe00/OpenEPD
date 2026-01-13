import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

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

const port = Number(process.env.PORT || 4000)
app.listen(port, () => console.log(`[mock] webhook server listening on ${port}`))
