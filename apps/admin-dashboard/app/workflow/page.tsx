"use client"
import React, { useEffect, useState } from 'react'

export default function AdminWorkflowPage() {
  const [registry, setRegistry] = useState<Record<string,string> | null>(null)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  async function load() {
    try {
      const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL || 'http://localhost:4003'
      const res = await fetch(`${WORKFLOW_URL}/registry`)
      const body = await res.json()
      setRegistry(body)
      setText(JSON.stringify(body, null, 2))
    } catch (err: any) {
      setMsg('load error: ' + (err.message || String(err)))
    }
  }

  useEffect(() => { load() }, [])

  async function save() {
    try {
      const obj = JSON.parse(text)
      const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL || 'http://localhost:4003'
      const res = await fetch(`${WORKFLOW_URL}/registry`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj)
      })
      const body = await res.json()
      if (body.ok) setMsg('Saved')
      else setMsg('Save failed')
      load()
    } catch (err: any) {
      setMsg('save error: ' + (err.message || String(err)))
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Workflow registry</h1>
      <div style={{ marginBottom: 8 }}>
        <button onClick={load}>Reload</button>
        <button onClick={save} style={{ marginLeft: 8 }}>Save</button>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', height: 320 }} />
      <div style={{ marginTop: 8 }}>{msg}</div>
    </div>
  )
}
