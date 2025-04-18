"use client"

import type React from "react"
import { useState } from "react"
import { useMusicPlayer } from "@/contexts/MusicPlayerContext"
import { Volume2, VolumeX, SkipBack, SkipForward, Pause, Play } from "lucide-react"
import { motion } from "framer-motion"

export default function MusicPlayerControls() {
  const { isPlaying, volume, togglePlay, setVolume, nextTrack, prevTrack } = useMusicPlayer()
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number.parseFloat(e.target.value))
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={prevTrack}
          className="text-gray-400 hover:text-primary transition-colors"
          whileTap={{ scale: 0.9 }}
          aria-label="Previous track"
        >
          <SkipBack className="h-5 w-5" />
        </motion.button>

        <motion.button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-primary rounded-full text-black"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </motion.button>

        <motion.button
          onClick={nextTrack}
          className="text-gray-400 hover:text-primary transition-colors"
          whileTap={{ scale: 0.9 }}
          aria-label="Next track"
        >
          <SkipForward className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="relative">
        <motion.button
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          className="text-gray-400 hover:text-primary transition-colors"
          whileTap={{ scale: 0.9 }}
          aria-label="Volume control"
        >
          {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </motion.button>

        {showVolumeSlider && (
          <div className="absolute bottom-full right-0 mb-2 p-2 bg-black border border-gold/20 rounded shadow-lg">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-primary"
              aria-label="Volume"
            />
          </div>
        )}
      </div>
    </div>
  )
}
