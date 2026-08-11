"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTheme } from "@/components/SiteChrome";
import StampModal from "@/components/StampModal";
import {
  fetchFlowers,
  flowerAssets,
  isStampSafeZone,
  MAX_STORED,
  MAX_VISIBLE_MOBILE,
  postFlower,
  snapToStampZone,
  stampSrc,
  type Flower,
  type ShapeId,
} from "@/lib/flowers";
import { getVisitorToken } from "@/lib/visitorToken";
import type { DayKey } from "@/lib/theme";
import styles from "./ContactPressSurface.module.css";

const MOBILE_FLOOR_MQ = "(max-width: 899px)";

function hashOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

function isDeadZone(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("dialog") || target.nodeName === "DIALOG") return true;
  return Boolean(target.closest("[data-deadzone]"));
}

const ContactStampContext = createContext<() => void>(() => {});

export function useOpenStampModal() {
  return useContext(ContactStampContext);
}

interface ContactPressSurfaceProps {
  children: ReactNode;
}

/**
 * Whole contact page is a pressing surface. On fine pointers the system
 * cursor is hidden and replaced by a flower + "press a flower" label that
 * follows the mouse. Header/footer/postcard/modal are dead zones.
 * Desktop stamps land at the press (snapped to side/bottom gutters);
 * mobile flowers fall to the floor.
 */
export default function ContactPressSurface({ children }: ContactPressSurfaceProps) {
  const { timeKey } = useTheme();
  const cursorAssets = flowerAssets(timeKey);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(MAX_STORED);
  const [isMobile, setIsMobile] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const modalOpenRef = useRef(false);
  const pendingStampRef = useRef<{ x: number; y: number } | null>(null);
  const mounted = useRef(false);

  const openModal = useCallback(() => {
    pendingStampRef.current = null;
    setModalOpen(true);
  }, []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_FLOOR_MQ);
    const sync = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      setVisibleLimit(mobile ? MAX_VISIBLE_MOBILE : MAX_STORED);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    modalOpenRef.current = modalOpen;
    document.body.classList.toggle("stamp-modal-open", modalOpen);
    const el = cursorRef.current;
    if (el) el.style.opacity = "0";
    return () => document.body.classList.remove("stamp-modal-open");
  }, [modalOpen]);

  useEffect(() => {
    mounted.current = true;
    fetchFlowers()
      .then((data) => {
        if (mounted.current) setFlowers(data);
      })
      .catch(() => {});
    return () => {
      mounted.current = false;
    };
  }, []);

  const showCursorAt = useCallback((clientX: number, clientY: number) => {
    const el = cursorRef.current;
    if (!el || modalOpenRef.current) return;
    el.style.opacity = "1";
    el.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
  }, []);

  const hideCursor = useCallback(() => {
    const el = cursorRef.current;
    if (el) el.style.opacity = "0";
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (modalOpenRef.current) {
        hideCursor();
        return;
      }
      const surface = surfaceRef.current;
      if (!surface) return;
      const overSurface = surface.contains(e.target as Node);
      if (!overSurface || isDeadZone(e.target)) {
        hideCursor();
        surface.dataset.cursor = "system";
        return;
      }

      // Desktop: only show the press cursor in stampable gutters / bottom.
      if (!isMobile) {
        const rect = surface.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          if (!isStampSafeZone(x, y)) {
            hideCursor();
            surface.dataset.cursor = "system";
            return;
          }
        }
      }

      surface.dataset.cursor = "flower";
      showCursorAt(e.clientX, e.clientY);
    };

    const onLeaveWindow = () => hideCursor();

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [hideCursor, isMobile, showCursorAt]);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || modalOpenRef.current || isDeadZone(e.target)) return;
      const surface = surfaceRef.current;
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      // Title / center column isn't stampable — don't yank the press to a side.
      if (!isStampSafeZone(x, y)) return;
      pendingStampRef.current = snapToStampZone(x, y);
      hideCursor();
      setModalOpen(true);
    },
    [hideCursor, isMobile]
  );

  const handleSubmit = async (input: { shapeId: ShapeId; colorKey: DayKey; initial: string }) => {
    const press = pendingStampRef.current;
    const flower = await postFlower({
      ...input,
      visitorToken: getVisitorToken(),
      x: press?.x,
      y: press?.y,
    });
    pendingStampRef.current = null;
    setFlowers((prev) => [flower, ...prev].slice(0, MAX_STORED));
    setFreshIds((prev) => new Set(prev).add(flower.id));
    setModalOpen(false);
  };

  useEffect(() => {
    if (freshIds.size === 0) return;
    const id = [...freshIds].at(-1);
    if (!id) return;
    const timer = window.setTimeout(() => {
      surfaceRef.current
        ?.querySelector(`[data-flower-id="${id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [freshIds]);

  const visibleFlowers = flowers.slice(0, visibleLimit);

  const cursorNode = (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
      <Image
        src={cursorAssets.favicon}
        alt=""
        width={30}
        height={30}
        className={styles.cursorIcon}
        priority
        data-theme-asset=""
      />
      <span className={styles.cursorLabel}>press a flower</span>
    </div>
  );

  return (
    <ContactStampContext.Provider value={openModal}>
      <div
        ref={surfaceRef}
        className={styles.surface}
        data-cursor="flower"
        onClick={handlePress}
      >
        {children}

        {portalReady ? createPortal(cursorNode, document.body) : null}

        <div className={styles.floor} aria-hidden={visibleFlowers.length === 0}>
          {visibleFlowers.map((flower) => {
            const src = stampSrc(flower.colorKey, flower.shapeId);
            const h = hashOf(flower.id);
            const stamp = snapToStampZone(
              Number.isFinite(flower.x) ? flower.x : 6 + (h % 84),
              Number.isFinite(flower.y) ? flower.y : 18 + (h % 64),
              h
            );
            // Keep floor flowers inset on mobile so width + rotation can't force scroll.
            const mobileLeft = Math.min(
              78,
              Math.max(6, Number.isFinite(flower.x) ? flower.x : 6 + (h % 72))
            );
            const bottom = 8 + (h % 36);
            const width = isMobile ? 42 + (h % 28) : 48 + (h % 36);
            const rotate = Number.isFinite(flower.rotation) ? flower.rotation : (h % 21) - 10;
            const isFresh = freshIds.has(flower.id);
            const name = flower.initial?.trim() || "visitor";
            const city = flower.location?.trim();
            const meta = city ? `${name} · ${city}` : name;
            const className = [
              styles.flower,
              isMobile ? null : styles.flowerStamp,
              isFresh ? (isMobile ? styles.flowerFall : styles.flowerStampIn) : null,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={flower.id}
                data-flower-id={flower.id}
                className={className}
                style={
                  isMobile
                    ? {
                        left: `${mobileLeft}%`,
                        bottom,
                        width,
                        ["--fl-rotate" as string]: `${rotate}deg`,
                      }
                    : {
                        left: `${stamp.x}%`,
                        top: `${stamp.y}%`,
                        width,
                        ["--fl-rotate" as string]: `${rotate}deg`,
                      }
                }
                data-deadzone="true"
                onClick={(e) => e.stopPropagation()}
                title={meta}
              >
                <Image src={src} alt="" width={72} height={72} className={styles.flowerImg} />
                <span className={styles.flowerLabel}>{meta}</span>
              </div>
            );
          })}
        </div>

        <StampModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      </div>
    </ContactStampContext.Provider>
  );
}
