import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createExam(data: {
    title: string;
    timeLimit: number;
    communityId: string;
    questions: { text: string; options: string[]; answer: number }[];
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== "MENTOR" && dbUser?.role !== "ADMIN") {
        throw new Error("Only mentors can create exams");
    }

    const exam = await db.exam.create({
        data: {
            title: data.title,
            timeLimit: data.timeLimit,
            communityId: data.communityId,
            questions: {
                create: data.questions,
            },
        },
    });

    revalidatePath(`/dashboard/communities/${data.communityId}`);
    return exam;
}

export async function submitExamAttempt(data: {
    examId: string;
    answers: number[];
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const exam = await db.exam.findUnique({
        where: { id: data.examId },
        include: { questions: true },
    });

    if (!exam) throw new Error("Exam not found");

    let score = 0;
    exam.questions.forEach((q: any, index: number) => {
        if (q.answer === data.answers[index]) {
            score++;
        }
    });

    const percentage = Math.round((score / exam.questions.length) * 100);

    const attempt = await db.examAttempt.create({
        data: {
            examId: data.examId,
            userId: user.id,
            score: percentage,
            completed: true,
        },
    });

    return attempt;
}

export async function getExams(communityId: string) {
    return await db.exam.findMany({
        where: { communityId },
        include: {
            _count: { select: { questions: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}
