import Image from "next/image";
import type { DeckImage } from "@/lib/designMedia";
import styles from "./ScrollDeck.module.css";

interface ScrollDeckProps {
  images: DeckImage[];
  label: string;
}

/** Scrollable stack of deck/board/card pages, like flipping through a printed deck. */
export default function ScrollDeck({ images, label }: ScrollDeckProps) {
  return (
    <div className={styles.outer}>
      <div className={styles.frame}>
        <div className={styles.scroll} data-hidescroll role="group" aria-label={label}>
          {images.map((img, i) => (
            <div key={i} className={styles.page}>
              <Image
                src={img.src}
                alt={img.label}
                width={img.width}
                height={img.height}
                className={styles.pageImg}
                sizes="240px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
