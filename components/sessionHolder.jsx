"use client";
import React, { useEffect, useState } from "react";
import openDB from "../db/db";

export const TimerSession = ({ children, session }) => {
  const [sessionData, setSessionData] = useState({});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const runDB = async () => {
      try {
        const db = await openDB();
        const transaction = db.transaction("offlineSession", "readonly");
        const store = transaction.objectStore("offlineSession");
        const request = store.getAll();

        request.onsuccess = (event) => {
          const sessionData = event.target.result;
          const treatedSessionData = sessionData.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});
          setSessionData(treatedSessionData);
        };
        request.onerror = () => {
          console.error("Error while loading session data");
        };
      } catch (error) {
        console.error("Error accessing database", error);
      }
    };

    const getSessionData = async () => {
      const response = await fetch("api/pomodoroSession");

      if (!response.ok)
        throw new Error("Error while retriving pomodoro session");

      const data = await response.json();
      setSessionData(data);
    };

    session === null ? runDB() : getSessionData();
  }, [session]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const db = await openDB();
        const transaction = db.transaction("offlineTasks", "readonly");
        const store = transaction.objectStore("offlineTasks");
        const tasksRequest = store.getAll();

        tasksRequest.onsuccess = function () {
          const loadedTasks = tasksRequest.result;

          const sortedTasks = loadedTasks.sort((a, b) => a.order - b.order);
          setTasks(sortedTasks);
        };
      } catch (error) {
        console.error("Error while loading tasks from IndexDB:", error);
      }
    };

    const getTasks = async () => {
      const response = await fetch("api/tasks");

      if (!response.ok) throw new Error("Error while retriving tasks");

      const data = await response.json();

      const sortedTasks = data.sort((a, b) => a.order - b.order);
      setTasks([...sortedTasks]);
    };

    session === null ? loadTasks() : getTasks();
  }, [session]);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          sessionData,
          setSessionData,
          tasks,
          setTasks,
          session,
        })
      )}
    </>
  );
};

export default TimerSession;
