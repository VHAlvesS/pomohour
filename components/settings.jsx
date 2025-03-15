"use client";
import React, { useContext, useState } from "react";
import { SettingsContext } from "../components/settingsWrapper";
import openDB from "../db/db";

function Settings({ setIsOverlayOpen, setOverlay, session }) {
  const { settings, setSettings } = useContext(SettingsContext);

  const [pomodoros, setPomodoros] = useState(settings.timer);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [longIntervals, setLongIntervals] = useState(settings.longInterval);
  const [alarmRepeat, setAlarmRepeat] = useState(settings.alarmRepeat);
  const [alarmVolume, setAlarmVolume] = useState(settings.alarmVolume);
  const [selectedOption, setSelectedOption] = useState(settings.alarmSound);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const saveChanges = async function () {
    try {
      if (session === null) {
        const db = await openDB();
        const transaction = db.transaction("offlineSettings", "readwrite");
        const store = transaction.objectStore("offlineSettings");

        const updatedSettings = [
          { setting: "timer", value: pomodoros },
          { setting: "shortBreak", value: shortBreak },
          { setting: "longBreak", value: longBreak },
          { setting: "longInterval", value: longIntervals },
          { setting: "alarmVolume", value: alarmVolume },
          { setting: "alarmRepeat", value: alarmRepeat },
          { setting: "alarmSound", value: selectedOption },
        ];

        for (const setting of updatedSettings) {
          await store.put(setting);
        }

        const treatedSettings = updatedSettings.reduce((acc, curr) => {
          acc[curr.setting] = curr.value;
          return acc;
        }, {});

        setSettings(treatedSettings);
        setIsOverlayOpen(false);
        setOverlay("none");
      }

      if (session !== null) {
        const response = await fetch("api/settings", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timer: pomodoros,
            shortBreak: shortBreak,
            longBreak: longBreak,
            longIntervals: longIntervals,
            alarmRepeat: alarmRepeat,
            alarmVolume: Number(alarmVolume),
            alarmSound: selectedOption,
          }),
        });

        if (!response.ok) {
          throw new Error("Error while trying to update settings");
        }
      }

      setSettings({
        alarmRepeat,
        alarmVolume,
        longBreak,
        shortBreak,
        timer: pomodoros,
        alarmSound: selectedOption,
        longInterval: longIntervals,
      });
      setIsOverlayOpen(false);
      setOverlay("none");
    } catch (error) {
      console.log("error while saving settings data");
    }
  };

  return (
    <div className="bg-white min-h-96 p-4 text-xl max-w-80 min-w-80 rounded-md">
      <h2 className="text-center font-bold text-black">Settings</h2>
      <br />
      <h3 className="mb-2 font-bold text-black">Timer</h3>
      <div className="flex flex-col max-w-full gap-2">
        <div className="flex max-w-full items-center">
          <label
            htmlFor="Pomodoro"
            className="flex-shrink-0 text-lg text-black"
          >
            Pomodoro
          </label>
          <div className="ml-auto p-1 px-2 rounded-md bg-gray-200 bg-opacity-70">
            <input
              type="text"
              name="Pomodoro"
              id="Pomodoro"
              className="w-10 text-black outline-none bg-transparent"
              placeholder=""
              value={pomodoros}
              onChange={(e) => {
                const regex = /^\d*$/;
                const test = regex.test(e.target.value);
                if (test) setPomodoros(Number(e.target.value));
              }}
            />
            <button
              className="p-1"
              onClick={() => {
                if (!pomodoros || pomodoros === 0) setPomodoros(1);
                else setPomodoros(pomodoros + 1);
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
                  stroke="black"
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
                if (!pomodoros || pomodoros === 0) return;
                else setPomodoros(pomodoros - 1);
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
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex max-w-full items-center">
          <label
            htmlFor="ShortBreak"
            className="flex-shrink-0 text-lg text-black"
          >
            Short breaks
          </label>
          <div className="ml-auto p-1 px-2 rounded-md bg-gray-200 bg-opacity-70">
            <input
              type="text"
              name="ShortBreak"
              id="ShortBreak"
              className="w-10 text-black outline-none bg-transparent"
              placeholder=""
              value={shortBreak}
              onChange={(e) => {
                const regex = /^\d*$/;
                const test = regex.test(e.target.value);
                if (test) setShortBreak(Number(e.target.value));
              }}
            />
            <button
              className="p-1"
              onClick={() => {
                if (!shortBreak || shortBreak === 0) setShortBreak(1);
                else setShortBreak(shortBreak + 1);
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
                  stroke="black"
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
                if (!shortBreak || shortBreak === 0) return;
                else setShortBreak(shortBreak - 1);
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
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex max-w-full items-center">
          <label
            htmlFor="LongBreak"
            className="flex-shrink-0 text-lg text-black"
          >
            Long break
          </label>
          <div className="ml-auto p-1 px-2 rounded-md bg-gray-200 bg-opacity-70">
            <input
              type="text"
              name="LongBreak"
              id="LongBreak"
              className="w-10 text-black outline-none bg-transparent"
              placeholder=""
              value={longBreak}
              onChange={(e) => {
                const regex = /^\d*$/;
                const test = regex.test(e.target.value);
                if (test) setLongBreak(Number(e.target.value));
              }}
            />
            <button
              className="p-1"
              onClick={() => {
                if (!longBreak || longBreak === 0) setLongBreak(1);
                else setLongBreak(longBreak + 1);
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
                  stroke="black"
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
                if (!longBreak || longBreak === 0) return;
                else setLongBreak(longBreak - 1);
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
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex max-w-full items-center">
          <label
            htmlFor="LongBreak"
            className="flex-shrink-0 text-lg text-black"
          >
            Long intervals
          </label>
          <div className="ml-auto p-1 px-2 rounded-md bg-gray-200 bg-opacity-70">
            <input
              type="text"
              name="LongBreak"
              id="LongBreak"
              className="w-10 text-black outline-none bg-transparent"
              placeholder=""
              value={longIntervals}
              onChange={(e) => {
                const regex = /^\d*$/;
                const test = regex.test(e.target.value);
                if (test) setLongIntervals(Number(e.target.value));
              }}
            />
            <button
              className="p-1"
              onClick={() => {
                if (!longIntervals || longIntervals === 0) setLongIntervals(1);
                else setLongIntervals(longIntervals + 1);
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
                  stroke="black"
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
                if (!longIntervals || longIntervals === 0) return;
                else setLongIntervals(longIntervals - 1);
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
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <br />
      <h3 className="mb-2 font-bold text-black">Alarm</h3>
      <div className="flex flex-col max-w-full gap-2">
        <div className="flex max-w-full items-center">
          <label
            htmlFor="AlarmRepeat"
            className="flex-shrink-0 text-lg text-black"
          >
            Repeat
          </label>
          <div className="ml-auto p-1 px-2 rounded-md bg-gray-200 bg-opacity-70">
            <input
              type="text"
              name="AlarmRepeat"
              id="AlarmRepeat"
              className="w-6 text-black outline-none bg-transparent"
              placeholder=""
              value={alarmRepeat}
              onChange={(e) => {
                const regex = /^\d*$/;
                const test = regex.test(e.target.value);
                if (test) setAlarmRepeat(Number(e.target.value));
              }}
            />
            <button
              className="p-1"
              onClick={() => {
                if (!alarmRepeat || alarmRepeat === 0) setAlarmRepeat(1);
                else setAlarmRepeat(alarmRepeat + 1);
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
                  stroke="black"
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
                if (!alarmRepeat || alarmRepeat === 0) return;
                else setAlarmRepeat(alarmRepeat - 1);
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
                  stroke="black"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex max-w-full flex-col">
          <label
            htmlFor="AlarmRepeat"
            className="flex-shrink-0 text-lg text-black text-left"
          >
            Volume ({alarmVolume})
          </label>
          <input
            type="range"
            id="vol"
            name="vol"
            min="0"
            max="100"
            className="w-auto"
            value={alarmVolume}
            onChange={(e) => {
              setAlarmVolume(e.target.value);
            }}
          />
        </div>
        <label className="text-mainColor flex items-center bg-none">
          Sound
          <select
            value={selectedOption}
            className="ml-auto block p-2 rounded-md !bg-gray-200 !bg-opacity-70"
            onChange={handleSelectChange}
          >
            <option value="Digital clock">Digital</option>
            <option value="Harp">Harp</option>
            <option value="Microwave">Microwave</option>
            <option value="Bell">Bell</option>
          </select>
        </label>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <button
          type="button"
          className="border-2 border-mainColor text-mainColor font-semibold p-2 rounded-lg hover:border-black hover:bg-black hover:text-white"
          onClick={() => {
            setIsOverlayOpen(false);
            setOverlay("none");
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="bg-mainColor p-2 rounded-lg hover:bg-black font-semibold"
          onClick={saveChanges}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Settings;
