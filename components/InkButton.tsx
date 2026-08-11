"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
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
  const { timeKey } = useTheme();
  const assets = flowerAssets(timeKey);
  const backgroundImage = `url(${assets.button})`;

  if ("href" in props && props.href !== undefined) {
    const { children, className, href, ...rest } = props as AnchorProps;
    return (
      <a
        href={href}
        className={[styles.button, className].filter(Boolean).join(" ")}
        style={{ backgroundImage }}
        {...rest}
      >
        <span className={styles.label}>{children}</span>
      </a>
    );
  }

  const { children, className, ...rest } = props as ButtonProps;
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(" ")}
      style={{ backgroundImage }}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
}
