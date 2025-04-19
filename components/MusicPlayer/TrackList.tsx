"use client"

import { useMusicPlayer, type Track } from "@/contexts/MusicPlayerContext"
import Image from "next/image"
import { motion } from "framer-motion"

type TrackListProps = {
  tracks: Track[]
}

export default function TrackList({ tracks }: TrackListProps) {
  const { currentTrack, selectTrack, explicitContent } = useMusicPlayer()

  return (
    <div className="p-2">
      {tracks.map((track) => (
        <motion.button
          key={track.id}
          onClick={() => selectTrack(track)}
          className={`w-full flex items-center p-2 rounded-md mb-2 hover:bg-gray-800 transition-colors ${
            currentTrack?.id === track.id ? "bg-gray-800 border-l-2 border-primary" : ""
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-10 h-10 mr-3 rounded overflow-hidden border border-gold/20">
            <Image src={track.cover || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center">
              <h4 className="text-white text-sm font-medium">{track.title}</h4>
              {track.explicit && (
                <span
                  className={`ml-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded ${
                    explicitContent ? "bg-red-600" : "bg-green-600"
                  }`}
                  title={explicitContent ? "Explicit Content" : "Clean Version"}
                >
                  {explicitContent ? "E" : "C"}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs">{track.artist}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
