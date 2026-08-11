import Image from "next/image";
import { flowerAssets } from "@/lib/flowers";
import type { Brand } from "@/lib/brands";
import styles from "./BrandRing.module.css";

interface BrandRingProps {
  brands: Brand[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function BrandRing({ brands, activeId, onSelect }: BrandRingProps) {
  return (
    <div className={styles.ring}>
      {brands.map((brand) => {
        const isActive = brand.id === activeId;
        const assets = flowerAssets(brand.ringFlower.time);
        const icon = brand.ringFlower.shape === "shape_01" ? assets.stamp1 : assets.stamp2;
        return (
          <button
            key={brand.id}
            type="button"
            className={styles.item}
            onClick={() => onSelect(brand.id)}
            style={{ "--ring-color": brand.ringColor } as React.CSSProperties}
            aria-pressed={isActive}
          >
            <span className={isActive ? `${styles.avatar} ${styles.avatarActive}` : styles.avatar}>
              <span className={styles.avatarInner}>
                <Image src={icon} alt="" width={64} height={64} className={styles.icon} />
              </span>
            </span>
            <span className={isActive ? `${styles.name} ${styles.nameActive}` : styles.name}>
              {brand.shortName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
