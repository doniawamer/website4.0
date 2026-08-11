"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderMedia from "./PlaceholderMedia";
import type { StorySlide } from "@/lib/designMedia";
import chrome from "./PhoneChrome.module.css";
import styles from "./StoryPhone.module.css";

interface StoryPhoneProps {
  pages: StorySlide[];
  /** Accessible label for the whole phone, e.g. brand + "story". */
  label: string;
}

/** IG-style story phone: crossfading pages, top progress bars, tap zones (loops). */
export default function StoryPhone({ pages, label }: StoryPhoneProps) {
  const [index, setIndex] = useState(0);
  const total = pages.length;
  const interactive = total > 1;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className={chrome.phone} role="group" aria-label={label}>
      <div className={chrome.viewport}>
        {pages.map((page, i) => (
          <div
            key={i}
            className={styles.page}
            style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 2 : 1 }}
          >
            {page.src ? (
              <Image src={page.src} alt={page.label} fill className={chrome.image} />
            ) : (
              <PlaceholderMedia label={page.label} />
            )}
          </div>
        ))}

        {interactive && (
          <>
            <div className={styles.bars}>
              {pages.map((_, i) => (
                <span
                  key={i}
                  className={
                    i === index
                      ? `${styles.bar} ${styles.barCurrent}`
                      : i < index
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
              aria-label={`Previous page, ${label}`}
            />
            <button
              type="button"
              className={`${styles.hitZone} ${styles.hitZoneNext}`}
              onClick={next}
              aria-label={`Next page, ${label}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
