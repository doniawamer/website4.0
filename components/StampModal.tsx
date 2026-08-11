"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "./SiteChrome";
import InkButton from "./InkButton";
import { flowerAssets, NEUTRAL_ASSETS, INITIAL_PATTERN, type ShapeId } from "@/lib/flowers";
import { DAY_KEYS, TAG_COLORS, getDayKey, isDayKey, type DayKey } from "@/lib/theme";
import styles from "./StampModal.module.css";

interface StampModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { shapeId: ShapeId; colorKey: DayKey; initial: string }) => Promise<void>;
}

const PAPERS = [NEUTRAL_ASSETS.paper1, NEUTRAL_ASSETS.paper2, NEUTRAL_ASSETS.paper3];

function defaultPetalColor(themeKey: string): DayKey {
  // Prefer the active daylight theme; fall back to "now" only when opening from dark_mode.
  return isDayKey(themeKey) ? themeKey : getDayKey();
}

export default function StampModal({ open, onClose, onSubmit }: StampModalProps) {
  const { timeKey } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [shapeId, setShapeId] = useState<ShapeId>("shape_01");
  // Stable SSR/client default — never call getDayKey during the initial render.
  const [colorKey, setColorKey] = useState<DayKey>("first_light");
  const previewAssets = flowerAssets(colorKey);
  const [initial, setInitial] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paperSrc, setPaperSrc] = useState(PAPERS[0]);
  const [paperReady, setPaperReady] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  /** False until the open effect picks paper — prevents a stale ready-frame on reopen. */
  const [sheetPrepared, setSheetPrepared] = useState(false);
  const paperIndexRef = useRef(0);
  const revealGenRef = useRef(0);
  const contentRevealTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      revealGenRef.current += 1;
      if (contentRevealTimer.current) {
        window.clearTimeout(contentRevealTimer.current);
        contentRevealTimer.current = null;
      }
      setPaperReady(false);
      setContentReady(false);
      setSheetPrepared(false);
      setError(null);
      return;
    }

    const gen = ++revealGenRef.current;
    if (contentRevealTimer.current) {
      window.clearTimeout(contentRevealTimer.current);
      contentRevealTimer.current = null;
    }

    const next = paperIndexRef.current % PAPERS.length;
    paperIndexRef.current += 1;
    const nextPaper = PAPERS[next];

    setPaperReady(false);
    setContentReady(false);
    setSheetPrepared(false);
    setPaperSrc(nextPaper);
    setColorKey(defaultPetalColor(timeKey));
    setError(null);
    // Reveal layers only after this open session's paper src is committed.
    setSheetPrepared(true);

    // Fallback if the paper onLoad never fires (rare cache/edge cases).
    const fallback = window.setTimeout(() => {
      if (revealGenRef.current !== gen) return;
      setPaperReady(true);
      setContentReady(true);
    }, 1600);
    return () => window.clearTimeout(fallback);
  }, [open, timeKey]);

  useEffect(() => {
    return () => {
      if (contentRevealTimer.current) window.clearTimeout(contentRevealTimer.current);
    };
  }, []);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const handlePaperLoad = () => {
    const gen = revealGenRef.current;
    setPaperReady(true);
    if (contentRevealTimer.current) window.clearTimeout(contentRevealTimer.current);
    // Let the paper paint first, then ease the form in.
    contentRevealTimer.current = window.setTimeout(() => {
      if (revealGenRef.current !== gen) return;
      setContentReady(true);
    }, 420);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ shapeId, colorKey, initial });
      setInitial("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something wilted. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Keep the dialog mounted for reliable showModal()/close(); only mount the
  // heavy sheet while open so closed state stays cheap.
  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClick={handleBackdropClick}
      aria-labelledby="stamp-modal-heading"
    >
      {open && sheetPrepared ? (
        <div className={styles.card}>
          <Image
            key={paperSrc}
            src={paperSrc}
            alt=""
            aria-hidden="true"
            fill
            sizes="680px"
            priority
            className={paperReady ? `${styles.paperImg} ${styles.paperImgReady}` : styles.paperImg}
            style={{ objectFit: "fill" }}
            onLoad={handlePaperLoad}
          />
          <div
            key={`tint-${paperSrc}`}
            className={paperReady ? `${styles.paperTint} ${styles.paperLayerReady}` : styles.paperTint}
            style={{ WebkitMaskImage: `url(${paperSrc})`, maskImage: `url(${paperSrc})` }}
            aria-hidden="true"
          />
          <div
            key={`accent-${paperSrc}`}
            className={
              paperReady ? `${styles.paperAccent} ${styles.paperLayerReady}` : styles.paperAccent
            }
            style={{ WebkitMaskImage: `url(${paperSrc})`, maskImage: `url(${paperSrc})` }}
            aria-hidden="true"
          />

          <div
            className={contentReady ? `${styles.content} ${styles.contentReady}` : styles.content}
            aria-hidden={!contentReady}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              tabIndex={contentReady ? 0 : -1}
            >
              ×
            </button>
            <div className={styles.eyebrow}>leave a flower</div>
            <h2 id="stamp-modal-heading" className={styles.heading}>
              Pick a flower to leave behind.
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.sectionLabel}>petal</div>
              <div className={styles.shapes}>
                {(["shape_01", "shape_02"] as ShapeId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={
                      shapeId === id
                        ? `${styles.shapeButton} ${styles.shapeButtonActive}`
                        : styles.shapeButton
                    }
                    onClick={() => setShapeId(id)}
                    aria-pressed={shapeId === id}
                    tabIndex={contentReady ? 0 : -1}
                  >
                    <Image
                      src={id === "shape_01" ? previewAssets.stamp1 : previewAssets.stamp2}
                      alt={id === "shape_01" ? "Round petal" : "Pointed petal"}
                      width={54}
                      height={54}
                      className={styles.shapeImg}
                    />
                  </button>
                ))}
              </div>

              <div className={styles.sectionLabel}>color (stem and leaf stay ink)</div>
              <div className={styles.colors} role="radiogroup" aria-label="Petal color">
                {DAY_KEYS.map((key, i) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={colorKey === key}
                    aria-label={key.replace(/_/g, " ")}
                    className={
                      colorKey === key
                        ? `${styles.colorDot} ${styles.colorDotActive}`
                        : styles.colorDot
                    }
                    style={{ background: TAG_COLORS[i] }}
                    onClick={() => setColorKey(key)}
                    tabIndex={contentReady ? 0 : -1}
                  />
                ))}
              </div>

              <div className={styles.sectionLabel}>initial, optional</div>
              <div className={styles.fields}>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="DA"
                  value={initial}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase();
                    if (INITIAL_PATTERN.test(v)) setInitial(v);
                  }}
                  className={styles.input}
                  aria-label="Initial (up to 2 letters or numbers)"
                  tabIndex={contentReady ? 0 : -1}
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.actions}>
                <InkButton as="button" type="submit" disabled={submitting || !contentReady}>
                  {submitting ? "pressing…" : "press it on"}
                </InkButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
