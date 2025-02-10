"use client";
import openDB from "@/db/db";
import React, { useState, useEffect } from "react";
import { createContext } from "react";

export const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const getSettings = async function () {
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
    getSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
