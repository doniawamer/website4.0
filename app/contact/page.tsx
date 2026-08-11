import type { Metadata } from "next";
import StatusIndicator from "@/components/StatusIndicator";
import ContactPostcard from "./ContactPostcard";
import ContactPressSurface from "./ContactPressSurface";
import ContactCta from "./ContactCta";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <ContactPressSurface>
      <div className={styles.content}>
        <div className={styles.eyebrow}>the old-fashioned way</div>
        <h1 className={styles.headline}>Drop me a line.</h1>
        <StatusIndicator />
        <p className={styles.subtitle}>Same inbox, nicer envelope.</p>

        <ContactPostcard />

        <ContactCta />
      </div>
    </ContactPressSurface>
  );
}
