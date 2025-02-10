export default function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.error(
        "IndexedDB is not supported. To perform better with our aplicattion we recommend another browser"
      );
      reject("IndexDB not supported");
      return;
    }

    const dbName = "PomoHour";
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("Error while openning IndexDB:", event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("offlineSettings")) {
        const settingsStore = db.createObjectStore("offlineSettings", {
          keyPath: "setting",
        });

        const initialData = [
          { setting: "timer", value: 25 },
          { setting: "shortBreak", value: 5 },
          { setting: "longBreak", value: 15 },
          { setting: "longInterval", value: 4 },
          { setting: "alarmVolume", value: 50 },
          { setting: "alarmRepeat", value: 1 },
          { setting: "alarmSound", value: "Digital clock" },
        ];

        const transaction = event.target.transaction;
        const store = transaction.objectStore("offlineSettings");

        initialData.forEach((item) => {
          store.add(item);
        });
      }

      if (!db.objectStoreNames.contains("offlineTasks")) {
        const tasksStore = db.createObjectStore("offlineTasks", {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains("offlineSession")) {
        const tasksStore = db.createObjectStore("offlineSession", {
          keyPath: "key",
        });

        const initialData = [{ key: "currentTask", value: "none" }];

        const transaction = event.target.transaction;
        const store = transaction.objectStore("offlineSession");

        initialData.forEach((item) => {
          store.add(item);
        });
      }
    };
  });
}
