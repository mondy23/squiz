import QuizUploader from '@/components/layout/quizGen'
import { prisma } from '../utils/db'
import { Prisma } from '@prisma/client'

export default async function Home() {
  // Fetch all questions
  const questions: Prisma.QuestionGetPayload<{}>[] = await prisma.question.findMany()

  return (
    <div className="flex gap-6 p-6">
      <QuizUploader />

      <div className="border rounded-lg p-4 w-full h-[calc(100vh-3rem)] overflow-y-auto">
        {questions.length > 0 ? (
          <ul className="space-y-2">
            {questions.map((q: Prisma.QuestionGetPayload<{}>) => (
              <li key={q.id} className="border-b pb-1">
                <strong>{q.question}</strong>
                <br />
                <span className="text-sm text-gray-500">
                  Choices: {q.choices.join(', ')}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No questions yet.</p>
        )}
      </div>
    </div>
  )
}
