"use client";
import openDB from "@/db/db";
import React, { useState, useEffect } from "react";
import { v4 as randomID } from "uuid";
import TodoEdit from "./todoEditing";
import Todo from "./todo";

function Task({
  id,
  title = "Task",
  totalPomodoros,
  finishedPomodoros,
  todos = [],
  updateTasks,
  selectTask,
  sessionData,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(() => ({
    id,
    title,
    totalPomodoros,
    finishedPomodoros,
    todos,
  }));

  useEffect(() => {
    setEditedTask({
      id,
      title,
      totalPomodoros,
      finishedPomodoros,
      todos,
    });
  }, [title, totalPomodoros, finishedPomodoros, todos]);

  const originalTask = {
    id,
    title,
    totalPomodoros,
    finishedPomodoros,
    todos,
  };

  const updateTask = async function () {
    try {
      const db = await openDB();
      const transaction = db.transaction("offlineTasks", "readwrite");
      const store = transaction.objectStore("offlineTasks");

      const request = store.get(id);
      store.put(editedTask);
      setIsEditing(!isEditing);
      transaction.oncomplete = function () {
        console.log("Todo Transaction completed successfully.");
        updateTasks((tasks) =>
          tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                ...editedTask,
                todos: editedTask.todos,
              };
            }
            return task;
          })
        );
        db.close();
      };
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = function () {
    const todoRandomID = randomID();

    if (!editedTask.todos || editedTask.todos === null) {
      const updatedTodo = {
        ...editedTask,
        todos: [{ completed: false, todoName: "Task 1", todoId: todoRandomID }],
      };

      setEditedTask(updatedTodo);
    } else {
      const updatedTodo = {
        ...editedTask,
        todos: [
          ...editedTask.todos,
          {
            completed: false,
            todoName: `Task ${editedTask.todos.length + 1}`,
            todoId: todoRandomID,
          },
        ],
      };

      setEditedTask(updatedTodo);
    }
  };

  const deleteTask = async function () {
    const db = await openDB();
    const transaction = db.transaction("offlineTasks", "readwrite");
    const store = transaction.objectStore("offlineTasks");

    const deleteId = store.delete(id);

    deleteId.onsuccess = function () {
      updateTasks((tasks) => tasks.filter((task) => task.id !== id));
    };

    transaction.oncomplete = function () {
      db.close();
    };
  };

  if (!isEditing) {
    return (
      <div
        className={`p-6 bg-mainColor text-white rounded-lg shadow-custom-buttonShadow overflow-hidden w-full cursor-pointer ${
          sessionData.currentTask == id ? "bg-opacity-100" : "bg-opacity-40"
        }`}
        onClick={() => {
          selectTask(id);
        }}
      >
        <div className={`flex gap-4 text-white w-full`}>
          <p className="break-words w-10/12 text-lg">{title}</p>
          <span className="ml-auto self-center">
            {finishedPomodoros}/{totalPomodoros}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5001 9.32C13.6901 9.32 14.6601 8.35 14.6601 7.16C14.6601 5.97 13.6901 5 12.5001 5C11.3101 5 10.3401 5.97 10.3401 7.16C10.3401 8.35 11.3101 9.32 12.5001 9.32Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.28988 19C8.47988 19 9.44988 18.03 9.44988 16.84C9.44988 15.65 8.47988 14.68 7.28988 14.68C6.09988 14.68 5.12988 15.65 5.12988 16.84C5.12988 18.03 6.08988 19 7.28988 19Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.71 19C18.9 19 19.87 18.03 19.87 16.84C19.87 15.65 18.9 14.68 17.71 14.68C16.52 14.68 15.55 15.65 15.55 16.84C15.55 18.03 16.52 19 17.71 19Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {todos.length >= 1 ? (
          <div className="mt-2 opacity-50">
            {todos.map((item) => (
              <Todo
                done={item.completed}
                title={item.todoName}
                id={item.todoId}
                key={item.todoId}
                updateTasks={updateTasks}
                taskId={id}
                editTask={setEditedTask}
              />
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  } else {
    return (
      <>
        <div
          id="taskEditOverlay"
          className="fixed inset-0 flex items-center justify-center z-0"
          onClick={() => {
            if (JSON.stringify(originalTask) === JSON.stringify(editedTask)) {
              setIsEditing(!isEditing);
              return;
            }

            const wantToCancel = confirm(
              `You're going to lose the task edit, are you sure about that?`
            );

            if (wantToCancel) {
              setEditedTask(() => ({
                id,
                title,
                totalPomodoros,
                finishedPomodoros,
                todos,
              }));
              setIsEditing(!isEditing);
            } else {
              return;
            }
          }}
        ></div>
        <div className="flex flex-col justify-center items-center p-6 bg-mainColor text-white rounded-lg shadow-custom-buttonShadow overflow-hidden w-full relative z-10">
          <div className="flex max-[600px]:justify-start justify-center items-center gap-4 text-white rounded-lg w-full max-[600px]:flex-wrap">
            <input
              type="text"
              className="break-words flex-grow basis-3/4 max-[350px]:basis-2/4 text-lg bg-transparent outline-none border-none max-w-full"
              value={editedTask.title}
              onChange={(e) => {
                setEditedTask((task) => ({ ...task, title: e.target.value }));
              }}
            />
            <div className="rounded-lg shadow-custom-buttonShadow overflow-hidden flex justify-center items-center gap-2 p-3 max-w-28 relative flex-grow min-w-24">
              <span className="absolute top-0 left-2 text-xs opacity-25">
                Done
              </span>
              <input
                type="text"
                name=""
                id=""
                className="block w-full grow-0 bg-mainColor text-white border-none outline-none"
                placeholder="Acts"
                value={editedTask.finishedPomodoros}
                onChange={(e) => {
                  const regex = /^\d*$/;
                  const test = regex.test(e.target.value);

                  if (test)
                    setEditedTask((task) => ({
                      ...task,
                      finishedPomodoros: Number(e.target.value),
                    }));
                }}
              />
              <button
                className=""
                onClick={() => {
                  if (
                    !editedTask.finishedPomodoros ||
                    editedTask.finishedPomodoros === 0
                  )
                    setEditedTask((task) => ({
                      ...task,
                      finishedPomodoros: 1,
                    }));
                  else
                    setEditedTask((task) => ({
                      ...task,
                      finishedPomodoros: task.finishedPomodoros + 1,
                    }));
                }}
              >
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.05994 11.7875L7.94994 6.89748C8.52744 6.31998 9.47244 6.31998 10.0499 6.89748L14.9399 11.7875"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className=""
                onClick={() => {
                  if (
                    !editedTask.finishedPomodoros ||
                    editedTask.finishedPomodoros === 0
                  )
                    return;
                  else
                    setEditedTask((task) => ({
                      ...task,
                      finishedPomodoros: task.finishedPomodoros - 1,
                    }));
                }}
              >
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.9401 7.21252L10.0501 12.1025C9.47256 12.68 8.52756 12.68 7.95006 12.1025L3.06006 7.21252"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="rounded-lg shadow-custom-buttonShadow overflow-hidden flex justify-center items-center gap-2 p-3 max-w-28 relative flex-grow min-w-24">
              <span className="absolute top-0 left-2 text-xs opacity-25">
                Total
              </span>
              <input
                type="text"
                name=""
                id=""
                className="block w-full grow-0 bg-mainColor text-white border-none outline-none"
                placeholder="Acts"
                value={editedTask.totalPomodoros}
                onChange={(e) => {
                  const regex = /^\d*$/;
                  const test = regex.test(e.target.value);

                  if (test)
                    setEditedTask((task) => ({
                      ...task,
                      totalPomodoros: Number(e.target.value),
                    }));
                }}
              />
              <button
                className=""
                onClick={() => {
                  if (
                    !editedTask.totalPomodoros ||
                    editedTask.totalPomodoros === 0
                  )
                    setEditedTask((task) => ({
                      ...task,
                      totalPomodoros: 1,
                    }));
                  else
                    setEditedTask((task) => ({
                      ...task,
                      totalPomodoros: task.totalPomodoros + 1,
                    }));
                }}
              >
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.05994 11.7875L7.94994 6.89748C8.52744 6.31998 9.47244 6.31998 10.0499 6.89748L14.9399 11.7875"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className=""
                onClick={() => {
                  if (
                    !editedTask.totalPomodoros ||
                    editedTask.totalPomodoros === 0
                  )
                    return;
                  else
                    setEditedTask((task) => ({
                      ...task,
                      totalPomodoros: task.totalPomodoros - 1,
                    }));
                }}
              >
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.9401 7.21252L10.0501 12.1025C9.47256 12.68 8.52756 12.68 7.95006 12.1025L3.06006 7.21252"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            className="self-start opacity-50 mt-3"
            onClick={() => {
              addTodo();
            }}
          >
            +Add todo
          </button>
          {editedTask.todos && editedTask.todos.length !== 0 ? (
            <div className="mb-4 self-start opacity-50 w-full flex flex-col gap-1">
              {editedTask.todos.map((item) => {
                return (
                  <TodoEdit
                    done={item.completed}
                    title={item.todoName}
                    id={item.todoId}
                    key={item.todoId}
                    editTask={setEditedTask}
                    editedTask={editedTask}
                    taskId={id}
                    updateTasks={updateTasks}
                  />
                );
              })}
            </div>
          ) : (
            ""
          )}
          <div className="flex w-full gap-2 py-2 rounded-lg bg-opacity-5">
            <button
              onClick={() => {
                deleteTask();
              }}
              type="button"
              className="rounded-lg text-white py-2"
            >
              Delete
            </button>

            <button
              onClick={() => {
                if (
                  JSON.stringify(originalTask) === JSON.stringify(editedTask)
                ) {
                  setIsEditing(!isEditing);
                  return;
                }

                const wantToCancel = confirm(
                  `You're going to lose the task edit, are you sure about that?`
                );

                if (wantToCancel) {
                  setEditedTask(() => ({
                    id,
                    title,
                    totalPomodoros,
                    finishedPomodoros,
                    todos,
                  }));
                  setIsEditing(!isEditing);
                } else {
                  return;
                }
              }}
              type="button"
              className="bg-mainColor rounded-lg shadow-custom-buttonShadow overflow-hidden text-white p-2 ml-auto"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                updateTask();
              }}
              type="button"
              className="bg-mainColor rounded-lg shadow-custom-buttonShadow overflow-hidden text-white p-2"
            >
              Save
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Task;
