import { useEffect, useRef, useState } from "react";
import Slider from "@mui/material/Slider";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";

function App() {
  // ------------------- MUSIC-API
  let musicAPI = [
    {
      songName: "جاده یک طرفه",
      songArtist: "مرتضی پاشایی",
      songAvatar: "../public/image/Morteza_Pashaei.jpg",
      songSrc: "../public/music/Morteza Pashaei - Jade Yek Tarafe (320).mp3",
    },
    {
      songName: "بَری باخ",
      songArtist: "منصور",
      songAvatar: "../public/image/Mansor.jpg",
      songSrc: "../public/music/14 Bari Bakh.mp3",
    },
    {
      songName: "برو خوشبخت باشی",
      songArtist: "پویا بیاتی",
      songAvatar: "../public/image/Pouya-Bayati.jpg",
      songSrc: "../public/music/Pouya Bayati - Boro Khoshbakht Beshi.mp3",
    },
  ];
  // ------------------- VARIABLES
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const currentSong = musicAPI[currentSongIndex];
  const audioRef = useRef(null);

  // ------------------- useEffects
  useEffect(() => {
    const audioElement = audioRef.current;

    audioElement.addEventListener("loadeddata", () => {
      setDuration(audioElement.duration);
    });
  }, [audioRef]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (isPlaying) {
      audioElement.play();
    } else {
      audioElement.pause();
    }

    const handleTimeUpdate = () => {
      setPosition(audioElement.currentTime);
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.pause();
    };
  }, [isPlaying, audioRef]);

  // ------------------- PLAY-PAUSE-BUTTON
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current.pause();
    } else {
      setIsPlaying(true);
      audioRef.current.play();
    }
  };

  // ------------------- FORWARD-BUTTON
  const handleForward = () => {
    if (currentSongIndex === 0) {
      setCurrentSongIndex(musicAPI.length - 1);
    } else {
      setCurrentSongIndex(currentSongIndex - 1);
    }

    audioRef.current.pause(); // ???
    setIsPlaying(true);

    setShowSpinner(true);
    setTimeout(() => {
      audioRef.current.play();
      setShowSpinner(false);
    }, 1000);
  };

  // ------------------- BACKWARD-BUTTON
  const handleBackward = () => {
    if (currentSongIndex === musicAPI.length - 1) {
      setCurrentSongIndex(0);
    } else {
      setCurrentSongIndex(currentSongIndex + 1);
    }

    audioRef.current.pause(); // ???
    setIsPlaying(true);

    setShowSpinner(true);
    setTimeout(() => {
      audioRef.current.play();
      setShowSpinner(false);
    }, 1000);
  };

  // ------------------- DURATION
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const formatTime = (time) => {
    return formatDuration(time * 1000);
  };

  // ------------------- END-DURATION
  const handleEnded = () => {
    setIsPlaying(false);
  };

  // ------------------- CLICK-SONG
  const handleSongClick = (index) => {
    setCurrentSongIndex(index);

    setShowSpinner(true);

    setIsPlaying(true);
    setTimeout(() => {
      setShowSpinner(false);
      audioRef.current.play();
    }, 1000);
  };

  return (
    <div className="container">
      <div className="big-title"> پخش کننده موسیقی | Music Player </div>
      <div className="wrapper">
        <audio
          ref={audioRef}
          src={currentSong.songSrc}
          onEnded={handleEnded}
        ></audio>
        {/* ------- IMAGE ------- */}
        <div className="image-wrapper">
          <img src={currentSong.songAvatar} id="songAvatar" alt="song-avatar" />
        </div>
        {/* ------- SINGER-DETAILS ------- */}
        <div className="details-wrapper">
          <span className="song-name">{currentSong.songName}</span>
          <span className="singer">{currentSong.songArtist}</span>
        </div>
        {/* ------- PROGRESS ------- */}
        <div className="progress-wrapper">
          <div className="range-wrapper">
            <Slider
              aria-label="time-indicator"
              size="small"
              value={position}
              min={0}
              step={1}
              max={duration}
              onChange={(_, value) => {
                setPosition(value);
                audioRef.current.currentTime = value;
              }}
            />
          </div>
          <div className="time-wrapper">
            {showSpinner ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              <span className="time-bar time-end">{formatTime(duration)}</span>
            )}
            <span className="time-bar time-start">{formatTime(position)}</span>
          </div>
        </div>
        {/* ------- CONTROLS ------- */}
        <div className="controls-wrapper">
          <div className="controls">
            <i className="fa-solid fa-forward-step" onClick={handleForward}></i>
          </div>
          <div className="controls">
            <i
              className={`fa-solid ${
                isPlaying ? "fa-pause" : "fa-play"
              } playBtn`}
              onClick={handlePlayPause}
            ></i>
          </div>

          <div className="controls">
            <i
              className="fa-solid fa-backward-step"
              onClick={handleBackward}
            ></i>
          </div>
        </div>
      </div>
      <div className="recently-add">اخیرا اضافه شده: </div>
      <div className="music-wrapper">
        <ul className="music-items">
          {musicAPI.map((song, index) => (
            <li
              className={
                currentSongIndex === index ? "music-item playing" : "music-item"
              }
              key={index}
              onClick={() => {
                handleSongClick(index);
              }}
            >
              <div className="music-item-details">
                <span className="song-name">{song.songName}</span>
                <span className="singer">{song.songArtist}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
