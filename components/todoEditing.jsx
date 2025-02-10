"use client";
import openDB from "@/db/db";
import React from "react";

function Todo({ done = false, title, id, editTask, editedTask }) {
  return (
    <div className="flex items-center w-full">
      <input
        type="text"
        className="break-words bg-transparent outline-none border-none flex-grow pr-2 min-w-4"
        value={title}
        onChange={(e) => {
          const newTodoTaskArr = editedTask.todos.map((element) => {
            if (element.todoId === id) {
              element.todoName = e.target.value;
            }
            return element;
          });

          editTask(() => ({ ...editedTask, todos: newTodoTaskArr }));
        }}
      />
      <input
        type="checkbox"
        name="completeTodo"
        id=""
        checked={done}
        onChange={() => {
          const newTodoTaskArr = editedTask.todos.map((element) => {
            if (element.todoId === id) {
              element.completed = !element.completed;
            }
            return element;
          });

          editTask(() => ({ ...editedTask, todos: newTodoTaskArr }));
        }}
        className="relative appearance-none w-4 h-4 border-2 border-white rounded
        before:content-[''] before:block before:w-2 before:h-2 before:bg-center before:bg-no-repeat before:bg-contain
        before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2
        checked:before:bg-[url('/check.svg')] ml-auto"
      />
      <button
        className=" ml-2"
        type="button"
        onClick={() => {
          const updatedTodos = editedTask.todos.filter(
            (element) => element.todoId !== id
          );

          const newTask = { ...editedTask, todos: updatedTodos };

          editTask(newTask);
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
            d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.33 16.5H13.66"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 12.5H14.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default Todo;
