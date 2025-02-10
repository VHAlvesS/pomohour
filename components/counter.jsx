"use client";
import React, { useEffect, useState, useContext } from "react";
import { SettingsContext } from "../components/settingsWrapper";
import openDB from "../db/db";
import PlayAlarm from "@/utils/alarmAudios";

function Counter({ sessionData, setSessionData, tasks, setTasks }) {
  const { settings } = useContext(SettingsContext);
  const [isTimerOn, setTimerOn] = useState(false);
  const [seconds, setSecond] = useState(0);
  const [minutes, setMinute] = useState(25);
  const [pomodoroState, setPomodoroState] = useState("Pomodoro");

  const taskCounter = tasks.reduce(
    (acc, task) => acc + task.finishedPomodoros,
    0
  );

  const totalPomodoros = tasks.reduce(
    (acc, task) => acc + task.totalPomodoros,
    0
  );

  const totalTaskCounter =
    totalPomodoros < taskCounter
      ? taskCounter +
        tasks.reduce(
          (acc, task) =>
            acc + Math.max(task.totalPomodoros - task.finishedPomodoros, 0),
          0
        )
      : totalPomodoros;

  useEffect(() => {
    checkForFinish();

    if (isTimerOn) {
      const interval = setTimeout(() => {
        if (seconds === 0) {
          setMinute((previousMinute) => previousMinute - 1);
          setSecond(59);
        } else {
          setSecond((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [seconds, isTimerOn, minutes, settings.timer]);

  useEffect(() => {
    setMinute(settings.timer);
    setSecond(0);
  }, [settings.timer]);

  useEffect(() => {
    const manageSession = function () {
      if (!sessionData) return;

      if (sessionData && !sessionData.isActive) {
        console.log(sessionData);
        setSessionData((sessionData) => ({
          ...sessionData,
          isActive: isTimerOn,
        }));
      } else {
        setSessionData((sessionData) => {
          const newSessionData = { ...sessionData, isActive: isTimerOn };
          return newSessionData;
        });
      }
    };
    manageSession();
  }, [isTimerOn]);

  const finishPomodoro = async function () {
    try {
      const db = await openDB();
      const transaction = db.transaction("offlineTasks", "readwrite");
      const store = transaction.objectStore("offlineTasks");

      const selectedPomodoro = sessionData.currentTask;
      const pomodoroToUpdate = tasks.find(
        (element) => element.id === selectedPomodoro
      );
      const newPomodoroEntry = {
        ...pomodoroToUpdate,
        finishedPomodoros: (pomodoroToUpdate.finishedPomodoros || 0) + 1,
      };

      const updatePomodoro = store.put(newPomodoroEntry);

      updatePomodoro.onsuccess = function () {
        setTasks((tasks) =>
          tasks.map((task) => {
            if (task.id === selectedPomodoro) {
              return newPomodoroEntry;
            }
            return task;
          })
        );
      };

      setTimerOn(false);

      transaction.oncomplete = function () {
        db.close();
      };
    } catch (error) {
      console.log("error");
    }
  };

  const checkForFinish = function (skip) {
    if ((minutes === 0 && seconds === 0) || skip) {
      if (pomodoroState === "Pomodoro") {
        finishPomodoro();
        setSecond(0);

        if ((taskCounter + 1) % settings.longInterval === 0) {
          setMinute(settings.longBreak);
          setPomodoroState("Long break");
        } else {
          setMinute(settings.shortBreak);
          setPomodoroState("Short break");
        }

        PlayAlarm(
          settings.alarmVolume,
          settings.alarmSound,
          settings.alarmRepeat
        );
      } else if (
        pomodoroState === "Short break" ||
        pomodoroState === "Long break"
      ) {
        setMinute(settings.timer);
        setPomodoroState("Pomodoro");
        setSecond(0);
      }

      setTimerOn(false);
    }
  };

  return (
    <div className="min-h-80 border-2 border-dashed border-white flex items-center justify-center min-w-80 rounded-full flex-col m-auto">
      <div className="flex flex-col justify-center items-center">
        <span id="taskCounter" className="text-lg font-medium">
          {taskCounter ? taskCounter : "0 "} / {totalTaskCounter}
        </span>
        <span id="taskStatus" className="text-sm text-gray-400">
          {pomodoroState}
        </span>
      </div>
      <h2 className="text-6xl font-bold my-4 flex justify-center items-center w-full">
        {minutes < 10 ? "0" + `${minutes}` : minutes}:
        {seconds < 10 ? "0" + `${seconds}` : seconds}
      </h2>

      <div className="flex items-center justify-center w-full">
        <div className="px-4 py-2 bg-white flex justify-center items-center gap-2 rounded-lg text-mainColor tracking-wide">
          <button
            type="button"
            className=""
            onClick={() => {
              if (pomodoroState === "Pomodoro") {
                setMinute(settings.timer);
                setSecond(0);
              }
              if (pomodoroState === "Short break") {
                setMinute(settings.shortBreak);
                setSecond(0);
              }
              if (pomodoroState === "Long break") {
                setMinute(settings.longBreak);
                setSecond(0);
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56"
                stroke="black"
                strokeWidth="1.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="text-lg font-bold border-x-2 border-mainColor border-opacity-15 px-4"
            onClick={() => {
              setTimerOn((timer) => !timer);
              const newAudio = new Audio("/audios/UIButton1.wav");
              newAudio.load();
              newAudio.play();
            }}
          >
            {isTimerOn ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            className="rotate-180"
            onClick={() => {
              if (isTimerOn) {
                checkForFinish(true);
                const newAudio = new Audio("/audios/UIButton2.wav");
                newAudio.load();
                newAudio.play();
              }
            }}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M37.725 10.2L21.425 26.5C19.5 28.425 19.5 31.575 21.425 33.5L37.725 49.8"
                stroke="black"
                strokeWidth="2.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
