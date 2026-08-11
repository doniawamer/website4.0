import styles from "./Tag.module.css";

interface TagProps {
  children: React.ReactNode;
  /** Index used to pick two of the six daylight accents for the gradient border. */
  colorIndex?: number;
}

/** Map index → CSS tag tokens (fills track --color-bg on theme shifts). */
const TAG_VARS = ["1", "2", "3", "4", "5", "6"] as const;

export default function Tag({ children, colorIndex = 0 }: TagProps) {
  const a = `var(--tag-${TAG_VARS[colorIndex % TAG_VARS.length]})`;
  const b = `var(--tag-${TAG_VARS[(colorIndex + 3) % TAG_VARS.length]})`;
  const background = `linear-gradient(color-mix(in srgb, ${a} 9%, var(--color-bg)), color-mix(in srgb, ${b} 9%, var(--color-bg))) padding-box, linear-gradient(135deg, ${a}, ${b}) border-box`;

  return (
    <span className={styles.tag} style={{ background }}>
      {children}
    </span>
  );
}
