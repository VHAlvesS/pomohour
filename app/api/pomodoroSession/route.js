import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

export async function GET(req) {
  const authData = await auth();

  if (!authData) {
    return NextResponse.json({ error: "Auth needed" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: authData.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const pomodoroSession = await prisma.pomodoroSession.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      currentTask: "none",
    },
  });

  return NextResponse.json(pomodoroSession);
}

export async function PATCH(req) {
  const authData = await auth();

  if (!authData) {
    return NextResponse.json({ error: "Auth needed" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: authData.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();

  if (typeof body.currentTask === "undefined") {
    return NextResponse.json(
      { error: "Missing required field" },
      { status: 400 }
    );
  }

  const newPomodoroSession = await prisma.pomodoroSession.update({
    where: { userId: user.id },
    data: {
      currentTask: body.currentTask,
    },
  });

  return NextResponse.json(newPomodoroSession, { status: 200 });
}
