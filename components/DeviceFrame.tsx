import styles from "./DeviceFrame.module.css";

interface DeviceFrameProps {
  variant: "laptop" | "phone";
  children: React.ReactNode;
}

export default function DeviceFrame({ variant, children }: DeviceFrameProps) {
  if (variant === "phone") {
    return (
      <div className={styles.phone}>
        <span className={styles.phoneNotch} aria-hidden="true" />
        <div className={styles.phoneViewport}>{children}</div>
      </div>
    );
  }

  return (
    <div className={styles.laptop}>
      <div className={styles.laptopScreen}>
        <div className={styles.laptopViewport}>{children}</div>
      </div>
      <div className={styles.laptopChin} aria-hidden="true" />
    </div>
  );
}
