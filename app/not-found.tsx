"use client";

import Image from "next/image";
import { useTheme } from "@/components/SiteChrome";
import InkButton from "@/components/InkButton";
import { flowerAssets } from "@/lib/flowers";
import styles from "./not-found.module.css";

export default function NotFound() {
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);

  return (
    <div className={styles.wrap}>
      <Image src={assets.wilted} alt="wilted pressed flower" width={330} height={330} className={styles.wilted} />
      <div className={styles.eyebrow}>404</div>
      <h1 className={styles.headline}>This page has wilted.</h1>
      <p className={styles.body}>
        Whatever grew here is gone. The link may be old, or the address mistyped.
      </p>
      <div className={styles.cta}>
        <InkButton href="/">back home</InkButton>
      </div>
    </div>
  );
}
