// components/hymnDetail/AudioPlayer.jsx
import { Play, Pause } from "lucide-react";

export default function AudioPlayer({
  audioRef,
  isPlaying,
  togglePlayPause,
  currentTime,
  duration,
  handleProgressClick,
}) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="mb-8 md:mb-10 bg-indigo-50 p-4 sm:p-5 md:p-6 rounded-xl">
      <h3 className="text-lg sm:text-xl font-serif font-semibold mb-3 md:mb-4 text-indigo-800 flex items-center">
        <Play size={20} className="mr-2" />
        Listen to Hymn
      </h3>
      <audio ref={audioRef} style={{ display: "none" }} />
      <div className="flex items-center mb-2 md:mb-4">
        <button
          onClick={togglePlayPause}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className="flex-1">
          <div
            className="bg-indigo-200 h-2 sm:h-3 rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div
              className="bg-indigo-600 h-2 sm:h-3 rounded-full absolute top-0 left-0"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1 sm:mt-2 text-indigo-600 text-xs sm:text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
