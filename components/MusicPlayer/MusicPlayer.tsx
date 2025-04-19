"use client"

import { useMusicPlayer } from "@/contexts/MusicPlayerContext"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Minimize2, Maximize2, RefreshCw } from "lucide-react"
import Image from "next/image"
import PlaylistSelector from "./PlaylistSelector"
import TrackList from "./TrackList"
import MusicPlayerControls from "./MusicPlayerControls"
import MusicPlayerProgress from "./MusicPlayerProgress"
import ContentFilterToggle from "./ContentFilterToggle"

export default function MusicPlayer() {
  const {
    isPlaying,
    currentTrack,
    currentPlaylist,
    playlists,
    isMinimized,
    isOpen,
    toggleMinimize,
    toggleOpen,
    refreshTrendingPlaylist,
  } = useMusicPlayer()
  const [activeTab, setActiveTab] = useState<"playlists" | "tracks">("playlists")

  // Variants for animations
  const playerVariants = {
    minimized: {
      height: "64px",
      width: isOpen ? "300px" : "64px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    expanded: {
      height: "500px",
      width: "300px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  }

  const contentVariants = {
    minimized: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
    expanded: {
      opacity: 1,
      transition: { duration: 0.3, delay: 0.1 },
    },
  }

  const iconVariants = {
    minimized: {
      rotate: 0,
      transition: { duration: 0.3 },
    },
    expanded: {
      rotate: 360,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-gray-900 rounded-lg shadow-xl overflow-hidden z-50 border border-gold/30"
      variants={playerVariants}
      animate={isMinimized ? "minimized" : "expanded"}
      initial="minimized"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-black/50 border-b border-gold/20">
        <div className="flex items-center">
          <motion.div variants={iconVariants} animate={isPlaying ? "expanded" : "minimized"} className="mr-2">
            <Music size={20} className="text-gold" />
          </motion.div>
          {(!isMinimized || isOpen) && (
            <motion.h3
              className="text-white font-medium text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Broski's Kitchen Music
            </motion.h3>
          )}
        </div>
        <div className="flex items-center">
          {!isMinimized && (
            <button
              onClick={toggleOpen}
              className="p-1 text-gray-400 hover:text-white mr-2"
              aria-label={isOpen ? "Collapse player" : "Expand player"}
            >
              {isOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
          <button
            onClick={toggleMinimize}
            className="p-1 text-gray-400 hover:text-white"
            aria-label={isMinimized ? "Expand player" : "Minimize player"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Minimized Player */}
      {isMinimized && (
        <div className="flex items-center p-2">
          {isOpen && currentTrack && (
            <div className="flex items-center flex-1 mr-2">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src={currentTrack.cover || "/placeholder.svg"}
                  alt={currentTrack.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="truncate">
                <p className="text-white text-xs font-medium truncate">{currentTrack.title}</p>
                <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
              </div>
            </div>
          )}
          <MusicPlayerControls minimal={true} />
        </div>
      )}

      {/* Expanded Player */}
      {!isMinimized && (
        <AnimatePresence>
          <motion.div
            variants={contentVariants}
            initial="minimized"
            animate="expanded"
            exit="minimized"
            className="flex flex-col h-full"
          >
            {/* Now Playing */}
            {currentTrack && (
              <div className="p-4 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4 rounded-md overflow-hidden border-2 border-gold/30">
                  <Image
                    src={currentTrack.cover || "/placeholder.svg"}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-white font-bold text-lg text-center">{currentTrack.title}</h3>
                <p className="text-gray-300 text-sm mb-2">{currentTrack.artist}</p>
                <MusicPlayerProgress />
                <MusicPlayerControls />
              </div>
            )}

            {/* Content Filter Toggle */}
            <ContentFilterToggle />

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "playlists" ? "text-gold border-b-2 border-gold" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("playlists")}
              >
                Playlists
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "tracks" ? "text-gold border-b-2 border-gold" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("tracks")}
                disabled={!currentPlaylist}
              >
                Tracks
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "playlists" ? (
                <div>
                  <div className="flex items-center justify-between p-2 border-b border-gray-800">
                    <h4 className="text-white text-sm font-medium">Available Playlists</h4>
                    <button
                      onClick={refreshTrendingPlaylist}
                      className="p-1 text-gray-400 hover:text-gold"
                      title="Refresh trending playlist"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <PlaylistSelector playlists={playlists} />
                </div>
              ) : (
                currentPlaylist && <TrackList tracks={currentPlaylist.tracks} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}
