// app/quiz/page.tsx
import { prisma } from '../utils/db'
import QuizClient from './quiz-client'

export default async function QuizPage() {
  const sampleQuestions = await prisma.question.findMany()

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-50 p-6">
      <QuizClient questions={sampleQuestions} />
    </div>
  )
}
