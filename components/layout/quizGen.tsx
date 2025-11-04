'use client'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

export default function QuizUploader() {
  const [quizJSON, setQuizJSON] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    setLoading(true)
    try {
      const parsed = JSON.parse(quizJSON)

      const res = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })

      const data = await res.json()
      alert(`✅ ${data.count} questions uploaded successfully`)
      console.log(data)
    } catch (err) {
      console.error(err)
      alert('❌ Invalid JSON or upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg w-[500px]">
      <h2 className="font-semibold mb-2">Upload Quiz JSON</h2>
      <Textarea
      className='h-[calc(100vh-9.8rem)]'
        rows={10}
        value={quizJSON}
        onChange={(e) => setQuizJSON(e.target.value)}
        placeholder="Paste your quiz JSON here..."
      />
      <Button onClick={handleUpload} disabled={loading} className="mt-2 w-full">
        {loading ? 'Uploading...' : 'Upload Quiz'}
      </Button>
    </div>
  )
}
