"use client";
import React from "react";
import openDB from "@/db/db";

function Todo({ done = false, title, id, updateTasks, taskId }) {
  return (
    <div className="flex items-center my-1 overflow-hidden">
      <input
        type="checkbox"
        name="completeTodo"
        id=""
        checked={done}
        onChange={(e) => {
          const updateTodo = async function () {
            try {
              const db = await openDB();
              const transaction = db.transaction("offlineTasks", "readwrite");
              const store = transaction.objectStore("offlineTasks");

              const taskRequest = await store.get(taskId);
              const task = await new Promise((resolve, reject) => {
                const taskRequest = store.get(taskId);
                taskRequest.onsuccess = () => resolve(taskRequest.result);
                taskRequest.onerror = () =>
                  reject("Error while requesting task.");
              });

              const updatedTodos = task.todos.map((todo) => {
                if (todo.todoId !== id) {
                  return todo;
                } else {
                  return { ...todo, completed: !todo.completed };
                }
              });
              const newTask = { ...task, todos: updatedTodos };
              store.put(newTask);

              transaction.oncomplete = function () {
                updateTasks((tasks) =>
                  tasks.map((task) => {
                    if (task.id !== taskId) {
                      return task;
                    } else {
                      return { ...task, todos: updatedTodos };
                    }
                  })
                );
              };
            } catch (error) {
              console.log(error);
            }
          };

          updateTodo();
        }}
        className="mr-1 relative appearance-none w-4 h-4 border-2 border-white rounded
        before:content-[''] before:block before:w-2 before:h-2 before:bg-center before:bg-no-repeat before:bg-contain
        before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2
        checked:before:bg-[url('/check.svg')] shrink-0"
      />
      <span>{title}</span>
    </div>
  );
}

export default Todo;
