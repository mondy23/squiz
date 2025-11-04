import { prisma } from '@/app/utils/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { fullname, section, score, ip } = await req.json()

    const student = await prisma.student.create({
      data: {
        fullname,
        section,
        score: String(score),
        ip,
      },
    })

    return NextResponse.json({ success: true, student })
  } catch (error) {
    console.error('Error saving student:', error)
    return NextResponse.json({ success: false, error: 'Failed to save student' }, { status: 500 })
  }
}
