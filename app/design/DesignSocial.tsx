"use client";

import { useState } from "react";
import Image from "next/image";
import Tag from "@/components/Tag";
import BrandRing from "@/components/design/BrandRing";
import StoryPhone from "@/components/design/StoryPhone";
import ReelPhone from "@/components/design/ReelPhone";
import ScrollDeck from "@/components/design/ScrollDeck";
import BoardCard from "@/components/design/BoardCard";
import LaptopCard from "@/components/design/LaptopCard";
import { flowerAssets } from "@/lib/flowers";
import { BRANDS } from "@/lib/brands";
import { DESIGN_MEDIA } from "@/lib/designMedia";
import styles from "./page.module.css";

export default function DesignSocial() {
  const [activeId, setActiveId] = useState(BRANDS[0].id);
  const active = BRANDS.find((b) => b.id === activeId) ?? BRANDS[0];
  const assets = flowerAssets(active.ringFlower.time);
  const icon = active.ringFlower.shape === "shape_01" ? assets.stamp1 : assets.stamp2;
  const devices = DESIGN_MEDIA[active.id] ?? [];

  return (
    <>
      <BrandRing brands={BRANDS} activeId={activeId} onSelect={setActiveId} />

      <div className={styles.panel}>
        <div>
          <div className={styles.panelHeader}>
            <span className={styles.panelAvatar} style={{ "--ring-color": active.ringColor } as React.CSSProperties}>
              <Image src={icon} alt="" width={40} height={40} className={styles.panelAvatarImg} />
            </span>
            <div>
              <div className={styles.panelName}>{active.name}</div>
              <a
                className={styles.panelHandle}
                href={active.handleHref}
                target={active.handleHref.startsWith("http") ? "_blank" : undefined}
                rel={active.handleHref.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {active.handle}
              </a>
            </div>
          </div>
          <p className={styles.panelBody}>{active.description}</p>
          <div className={styles.panelTags}>
            {active.tags.map((tag, i) => (
              <Tag key={tag} colorIndex={i}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <div className={styles.panelMedia}>
          {devices.map((device, i) => {
            switch (device.type) {
              case "story":
                return <StoryPhone key={i} pages={device.pages} label={`${active.name} story`} />;
              case "reel":
                return (
                  <ReelPhone
                    key={i}
                    poster={device.poster}
                    videoSrc={device.videoSrc}
                    label={device.label}
                  />
                );
              case "deck":
                return <ScrollDeck key={i} images={device.images} label={`${active.name} deck`} />;
              case "board":
                return <BoardCard key={i} src={device.src} label={device.label} />;
              case "laptop":
                return <LaptopCard key={i} src={device.src} label={device.label} />;
              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
}
