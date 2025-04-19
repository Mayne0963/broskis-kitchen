"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useMusicPlayer } from "@/contexts/MusicPlayerContext"
import MusicPlayerControls from "./MusicPlayerControls"
import MusicPlayerProgress from "./MusicPlayerProgress"
import PlaylistSelector from "./PlaylistSelector"
import TrackList from "./TrackList"
import ContentFilterToggle from "./ContentFilterToggle"

export default function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPlaylists, setShowPlaylists] = useState(false)
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    currentTime,
    duration,
    setCurrentTime,
    volume,
    setVolume,
    currentPlaylist,
    playlists,
    selectPlaylist,
    tracks,
    selectTrack,
    showExplicitContent,
    toggleExplicitContent,
  } = useMusicPlayer()

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setShowPlaylists(false)
    }
  }

  const togglePlaylists = () => {
    setShowPlaylists(!showPlaylists)
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gold/30"
    >
      {/* Collapsed Player */}
      <div
        className={`px-4 py-2 flex items-center justify-between cursor-pointer ${
          isExpanded ? "border-b border-gold/30" : ""
        }`}
        onClick={toggleExpanded}
      >
        <div className="flex items-center flex-1">
          {currentTrack ? (
            <>
              <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={currentTrack.coverArt || "/placeholder.svg"}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover ${isPlaying ? "music-pulse" : ""}`}
                />
              </div>
              <div className="mr-4 flex-1 min-w-0">
                <p className="text-white font-medium truncate">{currentTrack.title}</p>
                <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
              </div>
            </>
          ) : (
            <div className="mr-4 flex-1">
              <p className="text-white font-medium">Select a track</p>
              <p className="text-gray-400 text-sm">Broski's Kitchen Playlist</p>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <MusicPlayerControls
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            nextTrack={nextTrack}
            prevTrack={prevTrack}
            compact={true}
          />
          <motion.div
            whileHover={{ y: -2 }}
            className="ml-2 text-white"
            onClick={(e) => {
              e.stopPropagation()
              toggleExpanded()
            }}
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </motion.div>
        </div>
      </div>

      {/* Expanded Player */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black text-white overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left: Current Track Info */}
              <div className="flex flex-col items-center md:items-start">
                {currentTrack ? (
                  <>
                    <div className="w-40 h-40 rounded-lg overflow-hidden mb-4 shadow-lg border border-gold/20">
                      <img
                        src={currentTrack.coverArt || "/placeholder.svg"}
                        alt={currentTrack.title}
                        className={`w-full h-full object-cover ${isPlaying ? "music-pulse" : ""}`}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{currentTrack.title}</h3>
                    <p className="text-gray-400 mb-4">{currentTrack.artist}</p>
                  </>
                ) : (
                  <div className="w-40 h-40 rounded-lg overflow-hidden mb-4 shadow-lg border border-gold/20 flex items-center justify-center bg-gray-900">
                    <p className="text-gray-400 text-center px-4">Select a track to start listening</p>
                  </div>
                )}

                <ContentFilterToggle
                  showExplicitContent={showExplicitContent}
                  toggleExplicitContent={toggleExplicitContent}
                />
              </div>

              {/* Center: Controls and Progress */}
              <div className="flex flex-col justify-center">
                <MusicPlayerControls
                  isPlaying={isPlaying}
                  togglePlay={togglePlay}
                  nextTrack={nextTrack}
                  prevTrack={prevTrack}
                  compact={false}
                />
                <MusicPlayerProgress
                  currentTime={currentTime}
                  duration={duration}
                  setCurrentTime={setCurrentTime}
                  volume={volume}
                  setVolume={setVolume}
                />
              </div>

              {/* Right: Playlist */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">
                    {showPlaylists ? "Playlists" : currentPlaylist?.name || "Current Playlist"}
                  </h3>
                  <button onClick={togglePlaylists} className="text-primary hover:text-primary/80 text-sm font-medium">
                    {showPlaylists ? "Back to Tracks" : "Change Playlist"}
                  </button>
                </div>

                {showPlaylists ? (
                  <PlaylistSelector
                    playlists={playlists}
                    currentPlaylist={currentPlaylist}
                    onSelect={(playlist) => {
                      selectPlaylist(playlist)
                      setShowPlaylists(false)
                    }}
                  />
                ) : (
                  <TrackList tracks={tracks} currentTrack={currentTrack} onSelect={selectTrack} isPlaying={isPlaying} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
