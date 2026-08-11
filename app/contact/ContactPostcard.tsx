"use client";

import Image from "next/image";
import { useTheme } from "@/components/SiteChrome";
import { flowerAssets, NEUTRAL_ASSETS } from "@/lib/flowers";
import { buildMailto, CONTACT_EMAIL } from "@/lib/mailto";
import styles from "./page.module.css";

export default function ContactPostcard() {
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);

  return (
    <div className={styles.postcard} data-deadzone="true">
      <div className={styles.postcardInner}>
        <Image
          src={NEUTRAL_ASSETS.postcardPaper}
          alt=""
          fill
          sizes="880px"
          className={styles.postcardTexture}
        />

        <div className={styles.postcardLeft}>
          <div className={styles.postcardNote}>hey, you made it all the way down.</div>
          <p className={styles.postcardBody}>
            Whatever you are building, breaking, or reading, I want to hear about it. Roles, side
            quests, and good book recommendations all count.
          </p>
          <div style={{ flex: 1 }} />
          <div className={styles.postcardSignoff}>
            <span className={styles.postcardSignoffText}>warmly, donia</span>
            <Image
              src={assets.stamp2}
              alt=""
              width={38}
              height={38}
              className={styles.postcardStamp}
              data-theme-asset=""
            />
          </div>
        </div>

        <div className={styles.postcardDivider} aria-hidden="true" />

        <div className={styles.postcardRight}>
          <div className={styles.stampBox}>
            <div className={styles.stampBoxInner}>
              <Image
                src={assets.stamp1}
                alt=""
                width={64}
                height={64}
                style={{ width: "100%", height: "auto" }}
                data-theme-asset=""
              />
              <span className={styles.stampBoxLabel}>CANADA · $2</span>
            </div>
          </div>
          <div className={styles.addressBlock}>
            <div className={styles.addressRow}>
              <span className={styles.addressLabel}>to:</span>
              <span className={styles.addressName}>donia amer</span>
            </div>
            <div className={styles.addressRow}>
              <a href={buildMailto()} className={styles.addressEmail}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className={styles.addressRow}>
              <a
                href="https://github.com/doniawamer"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.addressEmail}
              >
                github
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://www.linkedin.com/in/donia-a-a6a270111/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.addressEmail}
              >
                linkedin
              </a>
            </div>
            <div className={styles.addressRow} style={{ border: "none" }}>
              <span className={styles.addressCity}>Toronto, Canada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
