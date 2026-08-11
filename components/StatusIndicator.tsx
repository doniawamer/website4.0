"use client";

import Image from "next/image";
import { useTheme } from "./SiteChrome";
import { flowerAssets } from "@/lib/flowers";
import styles from "./StatusIndicator.module.css";

export default function StatusIndicator() {
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);
  const isOpen = process.env.NEXT_PUBLIC_OPEN_TO_OPPORTUNITIES === "true";

  if (isOpen) {
    return (
      <div className={styles.wrap}>
        <Image src={assets.favicon} alt="" width={26} height={26} className={styles.favicon} />
        <span className={`${styles.label} ${styles.labelOpen}`}>
          In bloom, open to Senior Front-End Engineer roles
        </span>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.bud} aria-hidden="true" />
      <span className={`${styles.label} ${styles.labelClosed}`}>
        Still a bud. Not looking right now, but say hi anyway
      </span>
    </div>
  );
}
