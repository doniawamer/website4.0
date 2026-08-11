"use client";

import Image from "next/image";
import DownloadResumeButton from "@/components/DownloadResumeButton";
import InkButton from "@/components/InkButton";
import { useTheme } from "@/components/SiteChrome";
import { flowerAssets } from "@/lib/flowers";
import { buildMailto } from "@/lib/mailto";
import { useOpenStampModal } from "./ContactPressSurface";
import styles from "./page.module.css";

export default function ContactCta() {
  const openStampModal = useOpenStampModal();
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);

  return (
    <div className={styles.ctaRow} data-deadzone="true">
      <div className={styles.ctaDesktop}>
        <InkButton href={buildMailto()}>email me</InkButton>
        <a href="/resume" className={styles.ctaSecondary}>
          or see the resume
        </a>
      </div>

      <div className={styles.ctaMobile}>
        <DownloadResumeButton className={styles.ctaResume}>see the resume</DownloadResumeButton>
        <button type="button" className={styles.ctaLeave} onClick={openStampModal}>
          <Image
            src={assets.stamp1}
            alt=""
            width={16}
            height={16}
            className={styles.ctaLeaveIcon}
          />
          <span>leave a flower</span>
        </button>
      </div>
    </div>
  );
}
