import Image from "next/image";
import PlaceholderMedia from "./PlaceholderMedia";
import styles from "./BoardCard.module.css";

interface BoardCardProps {
  src?: string;
  label: string;
}

/** Framed still card used for design-system boards and brand boards. */
export default function BoardCard({ src, label }: BoardCardProps) {
  return (
    <div className={styles.outer}>
      <div className={styles.frame}>
        <div className={styles.viewport}>
          {src ? (
            <Image src={src} alt={label} fill className={styles.image} />
          ) : (
            <PlaceholderMedia label={label} />
          )}
        </div>
      </div>
    </div>
  );
}
