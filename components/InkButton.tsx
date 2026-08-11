"use client";

import { useEffect, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { useTheme } from "./SiteChrome";
import { flowerAssets } from "@/lib/flowers";
import styles from "./InkButton.module.css";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
};

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; as?: "a" };

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; as?: "button" };

export default function InkButton(props: AnchorProps | ButtonProps) {
  const { timeKey, themeReady } = useTheme();
  const assets = flowerAssets(timeKey);
  const backgroundImage = `url(${assets.button})`;
  const [washReady, setWashReady] = useState(false);

  useEffect(() => {
    if (!themeReady) {
      setWashReady(false);
      return;
    }
    setWashReady(false);
    const img = new window.Image();
    img.onload = () => setWashReady(true);
    img.onerror = () => setWashReady(true);
    img.src = assets.button;
  }, [assets.button, themeReady]);

  const wash = (
    <span
      className={washReady ? `${styles.wash} ${styles.washReady}` : styles.wash}
      style={{ backgroundImage }}
      aria-hidden="true"
      data-theme-asset=""
    />
  );

  if ("href" in props && props.href !== undefined) {
    const { children, className, href, ...rest } = props as AnchorProps;
    return (
      <a
        href={href}
        className={[styles.button, className].filter(Boolean).join(" ")}
        {...rest}
      >
        {wash}
        <span className={styles.label}>{children}</span>
      </a>
    );
  }

  const { children, className, ...rest } = props as ButtonProps;
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {wash}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
