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

  let tasks = await prisma.task.findMany({
    where: { userId: user.id },
  });

  if (!tasks || tasks.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(tasks);
}

export async function POST(req) {
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

  if (
    !body.title ||
    body.totalPomodoros === undefined ||
    body.order === undefined
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newTask = await prisma.task.create({
    data: {
      userId: user.id,
      title: body.title,
      totalPomodoros: body.totalPomodoros,
      order: body.order,
      finishedPomodoros: 0,
      todos: body.todos ?? [],
    },
  });

  return NextResponse.json(newTask, { status: 201 });
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

  if (body.changeOrder) {
    if (!Array.isArray(body.tasks)) {
      return NextResponse.json(
        { error: "Missing or invalid tasks array" },
        { status: 400 }
      );
    }

    try {
      const updatePromises = body.tasks.map((task) =>
        prisma.task.update({
          where: { id: task.id },
          data: { order: task.order },
        })
      );

      await Promise.all(updatePromises);

      return NextResponse.json(
        { message: "Tasks order updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating tasks order:", error);
      return NextResponse.json(
        { error: "Failed to update tasks order" },
        { status: 500 }
      );
    }
  }

  if (body.finishTodo) {
    if (typeof body.id === "undefined" || typeof body.todos === "undefined") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.task.update({
      where: { id: body.id },
      data: {
        todos: body.todos,
      },
    });
    return NextResponse.json(
      { message: "A task was finished" },
      { status: 200 }
    );
  }

  if (body.finishTask) {
    if (
      typeof body.id === "undefined" ||
      typeof body.finishedPomodoros === "undefined"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.task.update({
      where: { id: body.id },
      data: {
        finishedPomodoros: body.finishedPomodoros,
      },
    });
    return NextResponse.json(
      { message: "A task was finished" },
      { status: 200 }
    );
  }

  if (body.clearTasks) {
    console.log("teste");
    await prisma.task.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        finishedPomodoros: 0,
      },
    });

    return NextResponse.json(
      { message: "All task have been cleared" },
      { status: 200 }
    );
  }

  if (
    !body.title ||
    typeof body.totalPomodoros === "undefined" ||
    typeof body.order === "undefined" ||
    typeof body.todos === "undefined" ||
    typeof body.id === "undefined" ||
    typeof body.finishedPomodoros === "undefined"
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newTask = await prisma.task.update({
    where: { id: body.id },
    data: {
      userId: user.id,
      title: body.title,
      totalPomodoros: body.totalPomodoros,
      order: body.order,
      finishedPomodoros: body.finishedPomodoros,
      todos: body.todos ?? [],
    },
  });

  return NextResponse.json(newTask, { status: 200 });
}

export async function DELETE(req) {
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

  if (body.deleteAll) {
    await prisma.task.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ message: "All tasks deleted" }, { status: 200 });
  }

  if (typeof body.id === "undefined") {
    return NextResponse.json(
      { error: "Missing required field" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: body.id, userId: user.id },
  });

  if (!task || task.userId !== user.id) {
    return NextResponse.json(
      { error: "Task not found or not authorized" },
      { status: 404 }
    );
  }

  const deletedTask = await prisma.task.delete({
    where: { id: body.id },
  });

  return NextResponse.json(deletedTask, { status: 200 });
}
