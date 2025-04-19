"use client"

import type React from "react"
import { useMusicPlayer } from "@/contexts/MusicPlayerContext"

export default function MusicPlayerProgress() {
  const { progress, duration, seekTo } = useMusicPlayer()

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(Number.parseFloat(e.target.value))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="mt-4">
      <div className="relative w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary"
          style={{ width: `${(progress / duration) * 100}%` }}
        ></div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress}
          onChange={handleProgressChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Seek"
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
