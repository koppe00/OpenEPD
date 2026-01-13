"use client"
import React, { useState } from 'react'

export default function WorkflowPage() {
  const [processName, setProcessName] = useState('acs')
  const [status, setStatus] = useState<string | null>(null)

  const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL || 'http://localhost:4003'

  async function startWorkflow(e: React.FormEvent) {
    e.preventDefault()
    setStatus('starting')
    try {
      const res = await fetch(`${WORKFLOW_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ process: processName })
      })
      const body = await res.json()
      setStatus(JSON.stringify(body, null, 2))
    } catch (err: any) {
      setStatus('error: ' + (err.message || String(err)))
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Start workflow</h1>
      <form onSubmit={startWorkflow}>
        <label>
          Process:
          <select value={processName} onChange={(e) => setProcessName(e.target.value)}>
            <option value="acs">acs</option>
          </select>
        </label>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Start</button>
        </div>
      </form>
      <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{status}</pre>
    </div>
  )
}
