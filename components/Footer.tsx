"use client";

import Image from "next/image";
import { useTheme } from "./SiteChrome";
import { flowerAssets } from "@/lib/flowers";
import { buildMailto } from "@/lib/mailto";
import styles from "./Footer.module.css";

const SOCIAL_LINKS = [
  { href: buildMailto(), label: "email" },
  { href: "https://github.com/doniawamer", label: "github" },
  { href: "https://www.linkedin.com/in/donia-a-a6a270111/", label: "linkedin" },
  { href: "/resume", label: "resume" },
];

export default function Footer() {
  const { timeKey, themeLine, cycleTheme } = useTheme();
  const assets = flowerAssets(timeKey);

  return (
    <footer className={styles.footer} data-deadzone="true">
      <button type="button" className={styles.themeLine} onClick={cycleTheme}>
        {themeLine}
      </button>

      <div className={styles.footerRow}>
        <div className={styles.social}>
          {SOCIAL_LINKS.map((link, i) => (
            <span key={link.href} className={styles.socialLink}>
              <Image
                src={i % 2 === 0 ? assets.stamp1 : assets.stamp2}
                alt=""
                width={15}
                height={15}
                className={styles.stampA}
                data-theme-asset=""
              />
              <Image
                src={i % 2 === 0 ? assets.stamp2 : assets.stamp1}
                alt=""
                width={10}
                height={10}
                className={styles.stampB}
                data-theme-asset=""
              />
              <a
                href={link.href}
                className={styles.socialText}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        <button
          type="button"
          className={styles.faviconButton}
          onClick={cycleTheme}
          aria-label="Cycle time-of-day theme"
        >
          <Image
            src={assets.favicon}
            alt=""
            width={20}
            height={20}
            className={styles.footerFavicon}
            data-theme-asset=""
          />
        </button>
      </div>
    </footer>
  );
}
