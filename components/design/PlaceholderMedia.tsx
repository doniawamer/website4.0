import styles from "./PlaceholderMedia.module.css";

interface PlaceholderMediaProps {
  label: string;
}

/** Soft accent fill for media slots without an image. */
export default function PlaceholderMedia({ label }: PlaceholderMediaProps) {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <span className={styles.label}>{label}</span>
    </div>
  );
}
