"use client";
import React from "react";
import { useState } from "react";
import openDB from "../db/db";
import { v4 as randomID } from "uuid";
import { toast } from "react-toastify";

function CreateTaskInput({ onAddTask, setTasks, tasks, session }) {
  const [title, setTitle] = useState("");
  const [acts, setActs] = useState("");
  const [manageModal, setManageModal] = useState(false);

  const taskCreated = () =>
    toast.success("Task created!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const createTask = async function (title, acts) {
    if (!title || !acts || acts <= 0) {
      alert(
        "Something wrong... Provide a valid title and a acts number greater than 0"
      );
      return;
    }
    try {
      const id = randomID();
      const newTask = {
        title,
        totalPomodoros: acts,
        id,
        todos: [],
        finishedPomodoros: 0,
        order: tasks.length,
      };

      if (session === null) {
        const db = await openDB();
        const transaction = db.transaction("offlineTasks", "readwrite");
        const store = transaction.objectStore("offlineTasks");

        const request = store.add(newTask);

        request.onsuccess = function () {
          console.log("Task created successful!");
          setTitle("");
          setActs("");
          onAddTask(newTask);
          taskCreated();
        };

        request.onerror = function () {
          console.error("Error while creating task.");
        };
      }

      if (session !== null) {
        const response = await fetch("api/tasks", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            totalPomodoros: acts,
            order: tasks.length,
          }),
        });

        if (!response.ok) {
          throw new Error("Error while creating task");
        }

        const newTaskFromBackend = await response.json();

        setTitle("");
        setActs("");
        onAddTask(newTaskFromBackend);
        taskCreated();
      }
    } catch (error) {
      console.log("error while creating task:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <input
        type="text"
        name="createTaskName"
        id="createTaskName"
        className="flex-grow bg-mainColor rounded-lg shadow-custom-buttonShadow overflow-hidden py-2 px-3 text-white"
        placeholder="Add a new task ..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <div className="flex gap-2">
        <div className="bg-mainColor rounded-lg shadow-custom-buttonShadow overflow-hidden flex justify-center items-center gap-2">
          <input
            type="text"
            name=""
            id=""
            className="grow-0 w-14 bg-mainColor text-white py-1 px-2 border-none outline-none"
            placeholder="Acts"
            value={acts}
            onChange={(e) => {
              const regex = /^\d*$/;
              const test = regex.test(e.target.value);
              if (test) setActs(Number(e.target.value));
            }}
          />
          <button
            className="p-1"
            onClick={() => {
              if (!acts || acts === 0) setActs(1);
              else setActs(acts + 1);
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
            className="p-1"
            onClick={() => {
              if (!acts || acts === 0) return;
              else setActs(acts - 1);
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
        <button
          onClick={() => {
            createTask(title, acts);
          }}
          type="button"
          className="bg-mainColor rounded-lg shadow-custom-buttonShadow overflow-hidden text-white py-1 px-2"
        >
          Create
        </button>
      </div>
      <span className="flex -order-1 w-full relative">
        <h3 className="text-2xl">Tasks</h3>
        <button
          type="button"
          className="ml-auto justify-end"
          onClick={() => {
            setManageModal(!manageModal);
          }}
        >
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 10.5C3.9 10.5 3 11.4 3 12.5C3 13.6 3.9 14.5 5 14.5C6.1 14.5 7 13.6 7 12.5C7 11.4 6.1 10.5 5 10.5Z"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M19 10.5C17.9 10.5 17 11.4 17 12.5C17 13.6 17.9 14.5 19 14.5C20.1 14.5 21 13.6 21 12.5C21 11.4 20.1 10.5 19 10.5Z"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M12 10.5C10.9 10.5 10 11.4 10 12.5C10 13.6 10.9 14.5 12 14.5C13.1 14.5 14 13.6 14 12.5C14 11.4 13.1 10.5 12 10.5Z"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        <div className="">
          <div
            className={` z-10 absolute top-full mt-1 right-0 bg-white text-mainColor rounded-md p-3 ${
              manageModal ? "" : "hidden"
            }`}
          >
            <button
              type="button"
              className="flex justify-center items-center gap-1"
              onClick={() => {
                const deleteData = async function () {
                  const db = await openDB();
                  const transaction = db.transaction(
                    "offlineTasks",
                    "readwrite"
                  );
                  const store = transaction.objectStore("offlineTasks");

                  const deleteConfirm = confirm("Are you sure?");

                  if (!deleteConfirm) return;

                  const clearRequest = store.clear();

                  clearRequest.onsuccess = function () {
                    console.log("Tasks removed.");
                    setTasks([]);
                    setManageModal(false);
                  };

                  clearRequest.onerror = function () {
                    console.error(
                      "Error while deleting tasks:",
                      clearRequest.error
                    );
                  };
                };

                const deleteAsyncData = async function () {
                  const response = await fetch("api/tasks", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ deleteAll: true }),
                  });

                  if (!response.ok) {
                    throw new Error("Error while deleting task");
                  }

                  setTasks([]);
                };

                session === null ? deleteData() : deleteAsyncData();
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.33 16.5H13.66"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 12.5H14.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete all tasks
            </button>
            <button
              type="button"
              className="flex justify-center items-center gap-1"
              onClick={() => {
                const clearData = async function () {
                  const db = await openDB();
                  const transaction = db.transaction(
                    "offlineTasks",
                    "readwrite"
                  );
                  const store = transaction.objectStore("offlineTasks");

                  const tasksRequest = await store.getAll();
                  const tasks = await new Promise((resolve, reject) => {
                    tasksRequest.onsuccess = () => resolve(tasksRequest.result);
                    tasksRequest.onerror = () =>
                      reject("Error while retriving a task.");
                  });

                  const newTasks = tasks.map((task) => {
                    return { ...task, finishedPomodoros: 0 };
                  });

                  newTasks.forEach((element) => {
                    store.put(element);
                  });

                  const sortedNewTasks = newTasks
                    .sort((a, b) => a.order - b.order)
                    .map((task, idx) => ({ ...task, order: idx }));

                  setTasks(sortedNewTasks);
                };

                const clearAsyncData = async function () {
                  try {
                    const response = await fetch("api/tasks", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ clearTasks: true }),
                    });

                    if (!response.ok) {
                      throw new Error("Error while updating tasks");
                    }

                    setTasks((tasks) =>
                      tasks.map((task) => ({
                        ...task,
                        finishedPomodoros: 0,
                      }))
                    );
                  } catch (error) {
                    console.error("Failed to update tasks:", error);
                  }
                };

                session === null ? clearData() : clearAsyncData();
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
                  stroke="#1C1C1C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.8125 8.99994L7.935 11.1224L12.1875 6.87744"
                  stroke="#1C1C1C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Clear finished tasks
            </button>
          </div>

          <div
            id="taskOptionsOverlay"
            className={`fixed inset-0 flex items-center justify-center z-0 ${
              manageModal ? "" : "hidden"
            }`}
            onClick={() => {
              setManageModal(!manageModal);
            }}
          ></div>
        </div>
      </span>
    </div>
  );
}

export default CreateTaskInput;
