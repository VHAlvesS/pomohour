"use client";
import openDB from "../db/db";
import React, { useState, useEffect } from "react";
import { createContext } from "react";

export const SettingsContext = createContext();

function SettingsProvider({ children, session }) {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const getLocalSettings = async function () {
      const db = await openDB();
      const transaction = db.transaction("offlineSettings", "readonly");
      const store = transaction.objectStore("offlineSettings");
      const data = await new Promise((resolve, reject) => {
        const dataRequest = store.getAll();
        dataRequest.onsuccess = () => resolve(dataRequest.result);
        dataRequest.onerror = () => resolve("error while retriving settings");
      });
      const treatedData = data.reduce((acc, curr) => {
        acc[curr.setting] = curr.value;
        return acc;
      }, {});
      transaction.oncomplete = function () {
        setSettings(treatedData);
      };
    };

    const getSettings = async function () {
      const response = await fetch("api/settings");
      if (!response.ok) throw new Error("Error while retriving settings");

      const data = await response.json();
      setSettings(data);
      3;
    };

    session === null ? getLocalSettings() : getSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
