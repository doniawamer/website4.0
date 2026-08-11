import Image from "next/image";
import DeviceFrame from "@/components/DeviceFrame";
import PlaceholderMedia from "./PlaceholderMedia";
import styles from "./LaptopCard.module.css";

interface LaptopCardProps {
  src?: string;
  label: string;
}

export default function LaptopCard({ src, label }: LaptopCardProps) {
  return (
    <div className={styles.outer}>
      <DeviceFrame variant="laptop">
        {src ? (
          <Image src={src} alt={label} fill className={styles.image} />
        ) : (
          <PlaceholderMedia label={label} />
        )}
      </DeviceFrame>
    </div>
  );
}
