"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./SiteChrome";
import { flowerAssets } from "@/lib/flowers";
import { buildMailto } from "@/lib/mailto";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { href: "/about", label: "about", match: (p: string) => p === "/about" },
  { href: "/projects", label: "projects", match: (p: string) => p === "/projects" },
  { href: "/contact", label: "contact", match: (p: string) => p === "/contact" },
];

export default function Nav() {
  const { timeKey, cycleTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const assets = flowerAssets(timeKey);

  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const { overflow, position, top, width } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header} data-deadzone="true">
      <div className={styles.brand}>
        <button
          type="button"
          className={styles.faviconButton}
          onClick={cycleTheme}
          aria-label="Cycle time-of-day theme"
        >
          <Image src={assets.favicon} alt="" width={26} height={26} className={styles.favicon} />
        </button>
        <Link href="/" className={styles.wordmark}>
          donia amer
        </Link>
      </div>

      <nav className={styles.desktopNav} aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.match(pathname) ? `${styles.link} ${styles.linkActive}` : styles.link
            }
            aria-current={link.match(pathname) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
      >
        menu
      </button>

      {menuOpen && (
        <div className={styles.mobileOverlay} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={styles.mobileHeader}>
            <div className={styles.brand}>
              <button
                type="button"
                className={styles.faviconButton}
                onClick={cycleTheme}
                aria-label="Cycle time-of-day theme"
              >
                <Image
                  src={assets.favicon}
                  alt=""
                  width={22}
                  height={22}
                  className={styles.favicon}
                />
              </button>
              <Link href="/" className={styles.wordmark} onClick={() => setMenuOpen(false)}>
                donia amer
              </Link>
            </div>
            <button
              type="button"
              className={styles.mobileClose}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <nav className={styles.mobileNav} aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.match(pathname)
                    ? `${styles.mobileLink} ${styles.linkActive}`
                    : styles.mobileLink
                }
                aria-current={link.match(pathname) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={styles.mobileFooter}>
            <a href={buildMailto()}>email</a>
            <a href="https://github.com/doniawamer">github</a>
            <a href="https://www.linkedin.com/in/donia-a-a6a270111/">linkedin</a>
          </div>
        </div>
      )}
    </header>
  );
}
