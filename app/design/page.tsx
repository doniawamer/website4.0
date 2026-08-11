import type { Metadata } from "next";
import DesignSocial from "./DesignSocial";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design & Social",
};

export default function DesignPage() {
  return (
    <>
      <div className={styles.intro}>
        <div className={styles.eyebrow}>design &amp; social</div>
        <p className={styles.subtitle}>
          Alongside engineering, I design. Brand identities, short-form video, and social content,
          mostly for cafés, small shops, and founders. This page collects that work in one place.
        </p>
      </div>
      <div className={styles.brandsSection}>
        <div className={styles.brandsLabel}>brands i&rsquo;ve worked with</div>
        <DesignSocial />
      </div>
    </>
  );
}
