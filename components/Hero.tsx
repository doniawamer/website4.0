"use client";

import Image from "next/image";
import { useTheme } from "./SiteChrome";
import { flowerAssets } from "@/lib/flowers";
import styles from "./Hero.module.css";

export default function Hero() {
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);

  return (
    <section className={styles.hero}>
      <Image
        src={assets.hero}
        alt="pressed flower cluster"
        width={1400}
        height={1400}
        className={styles.heroFlower}
        sizes="(min-width: 900px) 640px, 320px"
        priority
      />
      <div className={styles.content}>
        <div className={styles.titleWrap}>
          <Image src={assets.stamp1} alt="" width={116} height={116} className={styles.stampLeft} />
          <Image src={assets.master} alt="" width={108} height={108} className={styles.stampRight} />
          <Image src={assets.stamp2} alt="" width={76} height={76} className={styles.stampBottom} />
          <h1 className={styles.title}>donia amer</h1>
        </div>
        <div className={styles.role}>Senior Front-End Engineer</div>
        <p className={styles.tagline}>
          I build <em className={styles.taglineEm}>(and occasionally design)</em> things for the web
        </p>
        <p className={styles.description}>
          I&rsquo;m a design oriented software engineer that focuses on building immersive and
          accessible digital experiences
        </p>
      </div>
    </section>
  );
}
