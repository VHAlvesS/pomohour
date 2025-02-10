export default function PlayAlarm(volume = 100, name, repeat = 1) {
  const playNext = (currentRepeat = 0, audio) => {
    if (currentRepeat >= repeat) {
      return;
    }

    if (!audio) {
      switch (name) {
        case "Digital clock":
          audio = new Audio("/audios/Digitalclock.wav");
          break;
        case "Harp":
          audio = new Audio("/audios/harp.wav");
          break;
        case "Microwave":
          audio = new Audio("/audios/Microwave.wav");
          break;
        case "Bell":
          audio = new Audio("/audios/doorbell.wav");
          break;
        default:
          console.error("Audio not found");
          return;
      }
      audio.volume = volume / 100;
    }

    const endedHandler = () => {
      playNext(currentRepeat + 1, audio);
      audio.removeEventListener("ended", endedHandler);
    };

    audio
      .play()
      .then(() => {
        audio.addEventListener("ended", endedHandler);
      })
      .catch((error) => {
        console.error("Error while playing audio:", error);
      });
  };

  playNext();
}
