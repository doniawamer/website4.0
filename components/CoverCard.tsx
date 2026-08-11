"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CoverCard.module.css";

interface CoverCardProps {
  imageSrc?: string;
  /** Optional extra stills (e.g. USG screens). Tap edges to flip once peeked. */
  imageSrcs?: string[];
  videoSrc?: string;
  imageAlt: string;
  title: string;
  label: string;
}

/** Title-card overlay: hover peeks, click reveals; click outside covers again. */
export default function CoverCard({
  imageSrc,
  imageSrcs,
  videoSrc,
  imageAlt,
  title,
  label,
}: CoverCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [page, setPage] = useState(0);
  // Never SSR a <video> — browsers normalize muted/playsInline attrs differently,
  // and missing demo files would flip to <Image> after hydrate.
  const [videoOk, setVideoOk] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const stills = (imageSrcs?.length ? imageSrcs : imageSrc ? [imageSrc] : []).filter(Boolean);
  const multi = stills.length > 1;

  useEffect(() => {
    if (!videoSrc) {
      setVideoOk(false);
      return;
    }
    let cancelled = false;
    fetch(videoSrc, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setVideoOk(r.ok);
      })
      .catch(() => {
        if (!cancelled) setVideoOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (revealed) {
      void video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [revealed]);

  useEffect(() => {
    if (!revealed) setPage(0);
  }, [revealed]);

  // Cover again when clicking anything outside this card (or pressing Escape).
  useEffect(() => {
    if (!revealed) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = wrapRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        setRevealed(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRevealed(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [revealed]);

  const reveal = () => setRevealed(true);
  const showVideo = Boolean(videoSrc && videoOk);
  const prev = () => setPage((i) => (i - 1 + stills.length) % stills.length);
  const next = () => setPage((i) => (i + 1) % stills.length);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      {showVideo ? (
        <video
          ref={videoRef}
          className={styles.media}
          src={videoSrc}
          poster={stills[0]}
          muted
          loop
          playsInline
          controls={revealed}
          aria-label={imageAlt}
        />
      ) : stills.length ? (
        stills.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === page ? imageAlt : ""}
            fill
            className={styles.image}
            style={{ opacity: i === page ? 1 : 0, zIndex: i === page ? 2 : 1 }}
            sizes="280px"
          />
        ))
      ) : (
        <div className={styles.placeholder} aria-hidden="true" />
      )}

      {multi && revealed && !showVideo && (
        <>
          <div className={styles.bars} aria-hidden="true">
            {stills.map((_, i) => (
              <span
                key={i}
                className={
                  i === page
                    ? `${styles.bar} ${styles.barCurrent}`
                    : i < page
                      ? `${styles.bar} ${styles.barPassed}`
                      : styles.bar
                }
              />
            ))}
          </div>
          <button
            type="button"
            className={`${styles.hitZone} ${styles.hitZonePrev}`}
            onClick={prev}
            aria-label="Previous screen"
          />
          <button
            type="button"
            className={`${styles.hitZone} ${styles.hitZoneNext}`}
            onClick={next}
            aria-label="Next screen"
          />
        </>
      )}

      <button
        type="button"
        className={revealed ? `${styles.overlay} ${styles.overlayHidden}` : styles.overlay}
        onClick={reveal}
        aria-pressed={revealed}
        aria-label={showVideo ? "Play the demo" : multi ? "Peek the screens" : "Peek underneath"}
      >
        <span className={styles.overlayTitle}>{title}</span>
        <span className={styles.overlayLabel}>{label}</span>
      </button>

      {!revealed && (
        <span className={styles.peekHint} aria-hidden="true">
          {showVideo ? "play the demo" : multi ? "peek the screens" : "peek underneath"}
        </span>
      )}
    </div>
  );
}
