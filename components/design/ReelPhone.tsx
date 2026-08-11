"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import PlaceholderMedia from "./PlaceholderMedia";
import { playReelExclusive } from "@/lib/reelPlayback";
import chrome from "./PhoneChrome.module.css";
import styles from "./ReelPhone.module.css";

interface ReelPhoneProps {
  poster?: string;
  videoSrc?: string;
  label: string;
}

/** Reel phone: poster + play control; unmuted playback, one reel at a time. */
export default function ReelPhone({ poster, videoSrc, label }: ReelPhoneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    if (video.paused) {
      void playReelExclusive(video).then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const hasMedia = Boolean(videoSrc || poster);

  return (
    <div className={chrome.phone} role="group" aria-label={`${label} (reel)`}>
      <div className={chrome.viewport}>
        {videoSrc ? (
          <video
            ref={videoRef}
            data-reel-phone=""
            className={chrome.image}
            src={videoSrc}
            poster={poster}
            loop
            playsInline
            preload="auto"
            onLoadedData={(e) => {
              const v = e.currentTarget;
              if (v.paused && v.currentTime > 0.05) v.currentTime = 0;
            }}
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />
        ) : poster ? (
          <Image src={poster} alt={label} fill className={chrome.image} />
        ) : (
          <PlaceholderMedia label={label} />
        )}

        {hasMedia && (
          <button
            type="button"
            className={playing ? `${styles.playOverlay} ${styles.playOverlayPlaying}` : styles.playOverlay}
            onClick={videoSrc ? toggle : undefined}
            disabled={!videoSrc}
            aria-label={videoSrc ? (playing ? `Pause ${label}` : `Play ${label}`) : label}
          >
            <span
              className={playing ? `${styles.playButton} ${styles.playButtonPause}` : styles.playButton}
              aria-hidden="true"
            >
              {playing ? (
                <span className={styles.pauseIcon}>
                  <span />
                  <span />
                </span>
              ) : (
                <span className={styles.playTriangle} />
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
