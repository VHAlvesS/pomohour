import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

export async function GET(req) {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!session) {
    return NextResponse.json({ error: "Auth needed" }, { status: 401 });
  }

  const settings = await prisma.settings.findUnique({
    where: { userId: user.id },
  });

  if (!settings) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }

  return NextResponse.json(settings);
}

export async function PATCH(req) {
  const authData = await auth();
  console.log("abriu pelo menos");

  if (!authData) {
    return NextResponse.json({ error: "Auth needed" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: authData.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body.timer === "undefined" ||
    typeof body.shortBreak === "undefined" ||
    typeof body.longBreak === "undefined" ||
    typeof body.longIntervals === "undefined" ||
    typeof body.alarmVolume === "undefined" ||
    typeof body.alarmRepeat === "undefined" ||
    typeof body.alarmSound === "undefined"
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const settings = await prisma.settings.findUnique({
    where: { userId: user.id },
  });

  if (!settings) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }

  const updatedSettings = await prisma.settings.update({
    where: { userId: user.id },
    data: {
      timer: body.timer,
      shortBreak: body.shortBreak,
      longBreak: body.longBreak,
      longInterval: body.longIntervals,
      alarmVolume: body.alarmVolume,
      alarmRepeat: body.alarmRepeat,
      alarmSound: body.alarmSound,
    },
  });

  return NextResponse.json(updatedSettings, { status: 200 });
}
