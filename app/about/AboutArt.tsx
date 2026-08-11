"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/SiteChrome";
import { flowerAssets, NEUTRAL_ASSETS } from "@/lib/flowers";
import styles from "./page.module.css";

export function AboutBackgroundFlower() {
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);
  return (
    <Image
      src={assets.master}
      alt=""
      width={220}
      height={220}
      className={styles.bgFlower}
      aria-hidden="true"
      data-theme-asset=""
    />
  );
}

export function AboutPhoto() {
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);
  const [bloomed, setBloomed] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);

  return (
    <div
      className={[styles.photoWrap, bloomed ? styles.photoBloomed : ""].filter(Boolean).join(" ")}
      onClick={() => setBloomed((open) => !open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setBloomed((open) => !open);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={bloomed ? "Hide flower bloom" : "Show flower bloom"}
    >
      <Image
        src={assets.stamp1}
        alt=""
        width={124}
        height={124}
        className={styles.photoBloomStamp1}
        data-theme-asset=""
      />
      <Image
        src={assets.stamp2}
        alt=""
        width={108}
        height={108}
        className={styles.photoBloomStamp2}
        data-theme-asset=""
      />
      <Image
        src={assets.favicon}
        alt=""
        width={86}
        height={86}
        className={styles.photoBloomFavicon}
        data-theme-asset=""
      />
      <div className={styles.photoFrame}>
        <div className={styles.photoInner}>
          <Image
            src={NEUTRAL_ASSETS.aboutPhoto}
            alt="Donia"
            fill
            sizes="(min-width: 900px) 250px, 200px"
            priority
            className={
              photoReady ? `${styles.photoImg} ${styles.photoImgReady}` : styles.photoImg
            }
            onLoad={() => setPhotoReady(true)}
          />
        </div>
      </div>
    </div>
  );
}
