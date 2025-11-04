-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "block" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
