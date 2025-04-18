"use client"
import { useMusicPlayer, type Playlist } from "@/contexts/MusicPlayerContext"
import Image from "next/image"
import { motion } from "framer-motion"

type PlaylistSelectorProps = {
  playlists: Playlist[]
}

export default function PlaylistSelector({ playlists }: PlaylistSelectorProps) {
  const { currentPlaylist, selectPlaylist } = useMusicPlayer()

  return (
    <div className="p-2">
      {playlists.map((playlist) => (
        <motion.button
          key={playlist.id}
          onClick={() => selectPlaylist(playlist)}
          className={`w-full flex items-center p-2 rounded-md mb-2 hover:bg-gray-800 transition-colors ${
            currentPlaylist?.id === playlist.id ? "bg-gray-800 border-l-2 border-primary" : ""
          }`}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-12 h-12 mr-3 rounded overflow-hidden border border-gold/20">
            <Image src={playlist.cover || "/placeholder.svg"} alt={playlist.name} fill className="object-cover" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-white text-sm font-medium">{playlist.name}</h4>
            <p className="text-gray-400 text-xs truncate">{playlist.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
