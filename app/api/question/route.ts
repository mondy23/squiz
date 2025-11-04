import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.topic || !body.questions) {
      return NextResponse.json({ error: "Invalid quiz format" }, { status: 400 });
    }

    const questionsData = body.questions.map((q: any) => ({
      topicId: body.topic,
      question: q.question,
      choices: q.choices,
      answer: q.answer,
    }));

    const created = await prisma.question.createMany({
      data: questionsData,
    });

    return NextResponse.json({
      message: "Questions created successfully",
      count: created.count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create questions" }, { status: 500 });
  }
}
