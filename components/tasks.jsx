"use client";
import React, { useState } from "react";
import Task from "../components/task";
import CreateTaskInput from "../components/createTaskInput";
import openDB from "../db/db";

function Tasks({ sessionData, setSessionData, tasks, setTasks }) {
  const [draggedTask, setDraggedTask] = useState(null);

  const updateTasksInDB = async (newTasks) => {
    try {
      const db = await openDB();
      const transaction = db.transaction("offlineTasks", "readwrite");
      const store = transaction.objectStore("offlineTasks");
      await store.clear();
      newTasks.forEach((task) => store.put(task));
      transaction.oncomplete = () => db.close();
    } catch (error) {
      console.error("Erro ao atualizar IndexedDB:", error);
    }
  };

  const addTasks = (newTask) => {
    setTasks((oldtasks) => {
      return [...oldtasks, newTask];
    });
  };

  const selectTask = async (id) => {
    if (sessionData) {
      if (sessionData.isActive) {
        const wantToSwitch = confirm(
          "A pomodoro is active, do you want to switch it?"
        );
        if (!wantToSwitch) return;
      }
    }

    try {
      const db = await openDB();
      const transaction = db.transaction("offlineSession", "readwrite");
      const store = transaction.objectStore("offlineSession");

      const taskData = { key: "currentTask", value: id };

      store.put(taskData);

      transaction.oncomplete = function () {
        const newSessionData = { ...sessionData, currentTask: id };
        setSessionData(newSessionData);

        db.close();
      };
    } catch (error) {
      console.log(id);
      console.log(error);
    }
  };

  const handleDragStart = (index) => setDraggedTask(index);
  const handleTouchStart = (index) => setDraggedTask(index);

  const handleDragOver = (event) => event.preventDefault();

  const handleDrop = (index) => {
    if (draggedTask === null) return;

    let newTasks = [...tasks];
    const [removedTask] = newTasks.splice(draggedTask, 1);
    newTasks.splice(index, 0, removedTask);

    newTasks = newTasks.map((task, idx) => ({ ...task, order: idx }));

    setTasks(newTasks);
    updateTasksInDB(newTasks);
    setDraggedTask(null);
  };

  const handleTouchEnd = (index) => handleDrop(index);

  return (
    <div className="w-full p-4 bg-white bg-opacity-5 rounded-lg pb-16 flex flex-wrap max-w-2xl">
      <CreateTaskInput onAddTask={addTasks} setTasks={setTasks} tasks={tasks} />
      <div className="mt-6 flex flex-col gap-2 w-full">
        {tasks.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onTouchStart={() => handleTouchStart(index)}
            onTouchMove={(e) => e.preventDefault()}
            onTouchEnd={() => handleTouchEnd(index)}
            className="task-item"
          >
            <Task
              key={item.id}
              id={item.id}
              title={item.title}
              totalPomodoros={item.totalPomodoros}
              finishedPomodoros={item.finishedPomodoros}
              todos={item.todos}
              updateTasks={setTasks}
              selectTask={selectTask}
              sessionData={sessionData}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
