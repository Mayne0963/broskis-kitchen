"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"

// Define types for our tracks and playlists
export type Track = {
  id: string
  title: string
  artist: string
  src: string
  cover: string
  explicit: boolean
  cleanVersion?: string // Path to clean version if available
}

export type Playlist = {
  id: string
  name: string
  description: string
  cover: string
  tracks: Track[]
  autoUpdate?: boolean
  lastUpdated?: Date
}

// Sample playlists data
const hiphopPlaylists: Playlist[] = [
  {
    id: "classic-hiphop",
    name: "Classic Hip-Hop",
    description: "The golden era classics that defined the culture",
    cover: "/music/playlists/classic-hiphop.jpg",
    tracks: [
      {
        id: "track1",
        title: "The Message",
        artist: "Grandmaster Flash",
        src: "/music/tracks/the-message.mp3",
        cover: "/music/covers/the-message.jpg",
        explicit: false,
      },
      {
        id: "track2",
        title: "Fight the Power",
        artist: "Public Enemy",
        src: "/music/tracks/fight-the-power.mp3",
        cover: "/music/covers/fight-the-power.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/fight-the-power-clean.mp3",
      },
      {
        id: "track3",
        title: "Juicy",
        artist: "The Notorious B.I.G.",
        src: "/music/tracks/juicy.mp3",
        cover: "/music/covers/juicy.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/juicy-clean.mp3",
      },
      {
        id: "track10",
        title: "California Love",
        artist: "2Pac ft. Dr. Dre",
        src: "/music/tracks/california-love.mp3",
        cover: "/music/covers/california-love.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/california-love-clean.mp3",
      },
      {
        id: "track11",
        title: "It Was A Good Day",
        artist: "Ice Cube",
        src: "/music/tracks/it-was-a-good-day.mp3",
        cover: "/music/covers/it-was-a-good-day.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/it-was-a-good-day-clean.mp3",
      },
      {
        id: "track12",
        title: "Nuthin' But A 'G' Thang",
        artist: "Dr. Dre ft. Snoop Dogg",
        src: "/music/tracks/nuthin-but-a-g-thang.mp3",
        cover: "/music/covers/nuthin-but-a-g-thang.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/nuthin-but-a-g-thang-clean.mp3",
      },
    ],
  },
  {
    id: "modern-hiphop",
    name: "Modern Beats",
    description: "Contemporary hip-hop sounds for the modern palate",
    cover: "/music/playlists/modern-hiphop.jpg",
    tracks: [
      {
        id: "track4",
        title: "HUMBLE.",
        artist: "Kendrick Lamar",
        src: "/music/tracks/humble.mp3",
        cover: "/music/covers/humble.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/humble-clean.mp3",
      },
      {
        id: "track5",
        title: "SICKO MODE",
        artist: "Travis Scott",
        src: "/music/tracks/sicko-mode.mp3",
        cover: "/music/covers/sicko-mode.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/sicko-mode-clean.mp3",
      },
      {
        id: "track6",
        title: "Alright",
        artist: "Kendrick Lamar",
        src: "/music/tracks/alright.mp3",
        cover: "/music/covers/alright.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/alright-clean.mp3",
      },
      {
        id: "track13",
        title: "DNA.",
        artist: "Kendrick Lamar",
        src: "/music/tracks/dna.mp3",
        cover: "/music/covers/dna.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/dna-clean.mp3",
      },
      {
        id: "track14",
        title: "Mask Off",
        artist: "Future",
        src: "/music/tracks/mask-off.mp3",
        cover: "/music/covers/mask-off.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/mask-off-clean.mp3",
      },
      {
        id: "track15",
        title: "ELEMENT.",
        artist: "Kendrick Lamar",
        src: "/music/tracks/element.mp3",
        cover: "/music/covers/element.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/element-clean.mp3",
      },
    ],
  },
  {
    id: "kitchen-vibes",
    name: "Kitchen Vibes",
    description: "The perfect soundtrack for your Broski's Kitchen experience",
    cover: "/music/playlists/kitchen-vibes.jpg",
    tracks: [
      {
        id: "track7",
        title: "Flavor in Your Ear",
        artist: "Craig Mack",
        src: "/music/tracks/flavor-in-your-ear.mp3",
        cover: "/music/covers/flavor-in-your-ear.jpg",
        explicit: false,
      },
      {
        id: "track8",
        title: "Gin and Juice",
        artist: "Snoop Dogg",
        src: "/music/tracks/gin-and-juice.mp3",
        cover: "/music/covers/gin-and-juice.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/gin-and-juice-clean.mp3",
      },
      {
        id: "track9",
        title: "Regulate",
        artist: "Warren G & Nate Dogg",
        src: "/music/tracks/regulate.mp3",
        cover: "/music/covers/regulate.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/regulate-clean.mp3",
      },
      {
        id: "track16",
        title: "Hypnotize",
        artist: "The Notorious B.I.G.",
        src: "/music/tracks/hypnotize.mp3",
        cover: "/music/covers/hypnotize.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/hypnotize-clean.mp3",
      },
      {
        id: "track17",
        title: "Dear Mama",
        artist: "2Pac",
        src: "/music/tracks/dear-mama.mp3",
        cover: "/music/covers/dear-mama.jpg",
        explicit: false,
      },
      {
        id: "track18",
        title: "C.R.E.A.M.",
        artist: "Wu-Tang Clan",
        src: "/music/tracks/cream.mp3",
        cover: "/music/covers/cream.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/cream-clean.mp3",
      },
    ],
  },
  {
    id: "golden-era",
    name: "Golden Era Legends",
    description: "Iconic tracks from hip-hop's most influential artists",
    cover: "/music/playlists/golden-era.jpg",
    tracks: [
      {
        id: "track19",
        title: "Changes",
        artist: "2Pac",
        src: "/music/tracks/changes.mp3",
        cover: "/music/covers/changes.jpg",
        explicit: false,
      },
      {
        id: "track20",
        title: "Big Poppa",
        artist: "The Notorious B.I.G.",
        src: "/music/tracks/big-poppa.mp3",
        cover: "/music/covers/big-poppa.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/big-poppa-clean.mp3",
      },
      {
        id: "track21",
        title: "Shook Ones, Pt. II",
        artist: "Mobb Deep",
        src: "/music/tracks/shook-ones.mp3",
        cover: "/music/covers/shook-ones.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/shook-ones-clean.mp3",
      },
      {
        id: "track22",
        title: "N.Y. State of Mind",
        artist: "Nas",
        src: "/music/tracks/ny-state-of-mind.mp3",
        cover: "/music/covers/ny-state-of-mind.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/ny-state-of-mind-clean.mp3",
      },
      {
        id: "track23",
        title: "93 'til Infinity",
        artist: "Souls of Mischief",
        src: "/music/tracks/93-til-infinity.mp3",
        cover: "/music/covers/93-til-infinity.jpg",
        explicit: false,
      },
      {
        id: "track24",
        title: "They Reminisce Over You",
        artist: "Pete Rock & CL Smooth",
        src: "/music/tracks/they-reminisce-over-you.mp3",
        cover: "/music/covers/they-reminisce-over-you.jpg",
        explicit: false,
      },
    ],
  },
  {
    id: "new-age-artists",
    name: "New-Age Artists",
    description: "What's hot right now in hip-hop",
    cover: "/music/playlists/new-age-artists.jpg",
    autoUpdate: true,
    lastUpdated: new Date(),
    tracks: [
      {
        id: "track25",
        title: "Drip Too Hard",
        artist: "Lil Baby & Gunna",
        src: "/music/tracks/drip-too-hard.mp3",
        cover: "/music/covers/drip-too-hard.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/drip-too-hard-clean.mp3",
      },
      {
        id: "track26",
        title: "ROCKSTAR",
        artist: "DaBaby ft. Roddy Ricch",
        src: "/music/tracks/rockstar.mp3",
        cover: "/music/covers/rockstar.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/rockstar-clean.mp3",
      },
      {
        id: "track27",
        title: "The Box",
        artist: "Roddy Ricch",
        src: "/music/tracks/the-box.mp3",
        cover: "/music/covers/the-box.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/the-box-clean.mp3",
      },
      {
        id: "track28",
        title: "SUGE",
        artist: "DaBaby",
        src: "/music/tracks/suge.mp3",
        cover: "/music/covers/suge.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/suge-clean.mp3",
      },
      {
        id: "track29",
        title: "WAP",
        artist: "Cardi B ft. Megan Thee Stallion",
        src: "/music/tracks/wap.mp3",
        cover: "/music/covers/wap.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/wap-clean.mp3",
      },
      {
        id: "track30",
        title: "RAPSTAR",
        artist: "Polo G",
        src: "/music/tracks/rapstar.mp3",
        cover: "/music/covers/rapstar.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/rapstar-clean.mp3",
      },
      {
        id: "track31",
        title: "WHATS POPPIN",
        artist: "Jack Harlow",
        src: "/music/tracks/whats-poppin.mp3",
        cover: "/music/covers/whats-poppin.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/whats-poppin-clean.mp3",
      },
      {
        id: "track32",
        title: "For The Night",
        artist: "Pop Smoke ft. Lil Baby & DaBaby",
        src: "/music/tracks/for-the-night.mp3",
        cover: "/music/covers/for-the-night.jpg",
        explicit: true,
        cleanVersion: "/music/tracks/clean/for-the-night-clean.mp3",
      },
    ],
  },
]

// Define the context type
type MusicPlayerContextType = {
  isPlaying: boolean
  currentTrack: Track | null
  currentPlaylist: Playlist | null
  volume: number
  progress: number
  duration: number
  isMinimized: boolean
  isOpen: boolean
  playlists: Playlist[]
  explicitContent: boolean
  togglePlay: () => void
  setVolume: (volume: number) => void
  nextTrack: () => void
  prevTrack: () => void
  selectTrack: (track: Track) => void
  selectPlaylist: (playlist: Playlist) => void
  toggleMinimize: () => void
  toggleOpen: () => void
  seekTo: (progress: number) => void
  toggleExplicitContent: () => void
  refreshTrendingPlaylist: () => void
}

// Create the context with default values
const MusicPlayerContext = createContext<MusicPlayerContextType>({
  isPlaying: false,
  currentTrack: null,
  currentPlaylist: null,
  volume: 0.7,
  progress: 0,
  duration: 0,
  isMinimized: false,
  isOpen: false,
  playlists: [],
  explicitContent: true,
  togglePlay: () => {},
  setVolume: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  selectTrack: () => {},
  selectPlaylist: () => {},
  toggleMinimize: () => {},
  toggleOpen: () => {},
  seekTo: () => {},
  toggleExplicitContent: () => {},
  refreshTrendingPlaylist: () => {},
})

// Pool of trending tracks for auto-update feature
const trendingTracksPool: Track[] = [
  {
    id: "trending1",
    title: "Back In Blood",
    artist: "Pooh Shiesty ft. Lil Durk",
    src: "/music/tracks/back-in-blood.mp3",
    cover: "/music/covers/back-in-blood.jpg",
    explicit: true,
    cleanVersion: "/music/tracks/clean/back-in-blood-clean.mp3",
  },
  {
    id: "trending2",
    title: "Tyler Herro",
    artist: "Jack Harlow",
    src: "/music/tracks/tyler-herro.mp3",
    cover: "/music/covers/tyler-herro.jpg",
    explicit: true,
    cleanVersion: "/music/tracks/clean/tyler-herro-clean.mp3",
  },
  {
    id: "trending3",
    title: "Lemonade",
    artist: "Internet Money ft. Don Toliver, Gunna & NAV",
    src: "/music/tracks/lemonade.mp3",
    cover: "/music/covers/lemonade.jpg",
    explicit: true,
    cleanVersion: "/music/tracks/clean/lemonade-clean.mp3",
  },
  {
    id: "trending4",
    title: "Laugh Now Cry Later",
    artist: "Drake ft. Lil Durk",
    src: "/music/tracks/laugh-now-cry-later.mp3",
    cover: "/music/covers/laugh-now-cry-later.jpg",
    explicit: true,
    cleanVersion: "/music/tracks/clean/laugh-now-cry-later-clean.mp3",
  },
]

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null)
  const [volume, setVolume] = useState(0.7)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>(hiphopPlaylists)
  const [explicitContent, setExplicitContent] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const autoUpdateTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    // Set up event listeners
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      if (audio) {
        setProgress(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      nextTrack()
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.pause()
    }
  }, [])

  // Set up auto-update for trending playlist
  useEffect(() => {
    // Set up auto-update timer for trending playlist
    autoUpdateTimerRef.current = setInterval(
      () => {
        refreshTrendingPlaylist()
      },
      60 * 60 * 1000,
    ) // Update every hour

    return () => {
      if (autoUpdateTimerRef.current) {
        clearInterval(autoUpdateTimerRef.current)
      }
    }
  }, [])

  // Update audio source when track changes or explicit content setting changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // Determine which version of the track to play
      let trackSrc = currentTrack.src
      if (!explicitContent && currentTrack.explicit && currentTrack.cleanVersion) {
        trackSrc = currentTrack.cleanVersion
      }

      audioRef.current.src = trackSrc
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
        })
      }
    }
  }, [currentTrack, explicitContent])

  // Update audio playback state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (!currentTrack && currentPlaylist && currentPlaylist.tracks.length > 0) {
      // If no track is selected but we have a playlist, play the first track
      selectTrack(currentPlaylist.tracks[0])
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const nextTrack = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex((track) => track.id === currentTrack.id)
      if (currentIndex < currentPlaylist.tracks.length - 1) {
        selectTrack(currentPlaylist.tracks[currentIndex + 1])
      } else {
        // Loop back to the first track
        selectTrack(currentPlaylist.tracks[0])
      }
    }
  }

  const prevTrack = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex((track) => track.id === currentTrack.id)
      if (currentIndex > 0) {
        selectTrack(currentPlaylist.tracks[currentIndex - 1])
      } else {
        // Loop to the last track
        selectTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1])
      }
    }
  }

  const selectTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const selectPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist)
    if (playlist.tracks.length > 0 && (!currentTrack || !isPlaying)) {
      selectTrack(playlist.tracks[0])
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const seekTo = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value
      setProgress(value)
    }
  }

  const toggleExplicitContent = () => {
    setExplicitContent(!explicitContent)
  }

  // Function to refresh the trending playlist with new tracks
  const refreshTrendingPlaylist = () => {
    setPlaylists((currentPlaylists) => {
      return currentPlaylists.map((playlist) => {
        if (playlist.id === "new-age-artists") {
          // Get current tracks
          const currentTracks = [...playlist.tracks]

          // Randomly select 2-3 tracks to replace
          const numTracksToReplace = Math.floor(Math.random() * 2) + 2
          const tracksToReplace = []

          for (let i = 0; i < numTracksToReplace; i++) {
            const randomIndex = Math.floor(Math.random() * currentTracks.length)
            tracksToReplace.push(randomIndex)
          }

          // Replace selected tracks with new ones from the pool
          tracksToReplace.forEach((index) => {
            // Find a track from the pool that's not already in the playlist
            const availableTracks = trendingTracksPool.filter(
              (poolTrack) => !currentTracks.some((track) => track.id === poolTrack.id),
            )

            if (availableTracks.length > 0) {
              const randomPoolIndex = Math.floor(Math.random() * availableTracks.length)
              currentTracks[index] = availableTracks[randomPoolIndex]
            }
          })

          return {
            ...playlist,
            tracks: currentTracks,
            lastUpdated: new Date(),
          }
        }
        return playlist
      })
    })
  }

  const value = {
    isPlaying,
    currentTrack,
    currentPlaylist,
    volume,
    progress,
    duration,
    isMinimized,
    isOpen,
    playlists,
    explicitContent,
    togglePlay,
    setVolume,
    nextTrack,
    prevTrack,
    selectTrack,
    selectPlaylist,
    toggleMinimize,
    toggleOpen,
    seekTo,
    toggleExplicitContent,
    refreshTrendingPlaylist,
  }

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)
