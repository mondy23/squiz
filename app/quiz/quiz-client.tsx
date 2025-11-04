'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function QuizClient({ questions }: { questions: any[] }) {
  const [fullName, setFullName] = useState('')
  const [section, setSection] = useState('')
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [cheatDetected, setCheatDetected] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [ipAddress, setIpAddress] = useState<string>('Fetching...')

  const question = questions[index]

  // 🧭 Fetch IP once quiz starts
  useEffect(() => {
    if (started) {
      fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((data) => setIpAddress(data.ip))
        .catch(() => setIpAddress('Unable to fetch IP'))
    }
  }, [started])

  // 🧭 Start quiz only when name and section entered
  const handleStart = () => {
    if (fullName.trim() === '' || section.trim() === '') {
      return alert('Please enter both your full name and section.')
    }
    setStarted(true)
  }

  // 🕒 Timer countdown
  useEffect(() => {
    if (!started || finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, started, finished])

  // 🚫 Anti-tab switching
  useEffect(() => {
    if (!started) return
    const handleBlur = () => setCheatDetected(true)
    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [started])

  // 📸 Anti-screenshot
  useEffect(() => {
    if (!started) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        alert('⚠️ Screenshot not allowed!')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [started])

  // 🖱 Disable right-click
  const disableContextMenu = (e: React.MouseEvent) => e.preventDefault()

  // ➡️ Handle next
  const handleNext = () => {
    if (!selected) return
    if (selected === question.answer) setScore((prev) => prev + 1)

    if (index < questions.length - 1) {
      setIndex(index + 1)
      setSelected(null)
      setTimeLeft(60)
    } else {
      setFinished(true)
    }
  }

  // ⬅️ Handle prev
  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1)
      setSelected(null)
      setTimeLeft(60)
    }
  }

  // 💾 Save result when finished
  useEffect(() => {
    if (finished) {
      fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: fullName,
          section,
          score,
          ip: ipAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log('✅ Student saved:', data))
        .catch((err) => console.error('❌ Failed to save student:', err))
    }
  }, [finished])

  // 🧭 Render States
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6 bg-white border rounded-xl shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Quiz</h1>
        <p className="text-gray-600 mb-4">Enter your details to begin:</p>

        <Input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mb-4 text-center"
        />
        <Input
          type="text"
          placeholder="Section (e.g. BSCS 3A)"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="mb-4 text-center"
        />

        <Button onClick={handleStart} className="w-full">
          Start Quiz
        </Button>
      </div>
    )
  }

  if (cheatDetected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-semibold text-red-600">🚫 Quiz Terminated</h1>
        <p className="text-gray-500 mt-2">
          You switched tabs or windows, {fullName} ({section}).
        </p>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <h1 className="text-2xl font-bold mb-2">
          {timeLeft <= 0 ? '⏰ Time’s Up!' : '🎉 Quiz Complete'}
        </h1>
        <p className="text-lg mb-1">Name: {fullName}</p>
        <p className="text-lg mb-1">Section: {section}</p>
        <p className="text-sm mb-4 text-gray-500">IP Address: {ipAddress}</p>
        <p className="text-lg mb-2">Your total score:</p>
        <p className="text-4xl font-bold text-blue-600">
          {score} / {questions.length}
        </p>
      </div>
    )
  }

  // 📋 Quiz question layout
  return (
    <div
      className="flex flex-col items-center justify-center w-full max-w-2xl border rounded-xl p-6 shadow-lg bg-white relative select-none min-h-screen mx-auto"
      onContextMenu={disableContextMenu}
    >
      <div className="flex justify-between w-full mb-4">
        <span className="font-semibold">
          {fullName} ({section}) — Question {index + 1}/{questions.length}
        </span>
        <span className="font-mono text-red-500">⏱ {timeLeft}s</span>
      </div>

      <h2 className="text-lg font-medium mb-4 text-center">{question.question}</h2>

      <div className="grid grid-cols-2 gap-3 w-full">
        {question.choices.map((choice: string, i: number) => (
          <Button
            key={i}
            variant={selected === choice ? 'default' : 'outline'}
            onClick={() => setSelected(choice)}
            className="w-full"
          >
            {choice}
          </Button>
        ))}
      </div>

      <div className="flex justify-between w-full mt-6">
        <Button onClick={handlePrev} disabled={index === 0}>
          Prev
        </Button>
        <Button onClick={handleNext}>
          {index === questions.length - 1 ? 'Finish ✅' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
