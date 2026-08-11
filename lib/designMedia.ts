/**
 * Media layout for each brand on the design & social page.
 * Slots with a `src` use /public/design assets; empty slots fall back to
 * PlaceholderMedia. Device structure matches the approved layout.
 */

export interface StorySlide {
  /** Path under /public; omit to show PlaceholderMedia. */
  src?: string;
  width?: number;
  height?: number;
  /** Alt text when a real image is present, or the placeholder's mono label. */
  label: string;
}

export interface DeckImage {
  src: string;
  width: number;
  height: number;
  label: string;
}

export type DeviceSpec =
  | { type: "story"; pages: StorySlide[] }
  | {
      type: "reel";
      poster?: string;
      videoSrc?: string;
      posterWidth?: number;
      posterHeight?: number;
      label: string;
    }
  | { type: "deck"; images: DeckImage[] }
  | { type: "laptop"; src?: string; width?: number; height?: number; label: string }
  | { type: "board"; src?: string; width?: number; height?: number; label: string };

export const DESIGN_MEDIA: Record<string, DeviceSpec[]> = {
  cdl: [
    {
      type: "story",
      pages: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
        src: `/design/cdl/clear-intentions/${n}.webp`,
        width: 1080,
        height: 1920,
        label: `Clear Intentions Glass · ${n}`,
      })),
    },
    {
      type: "story",
      pages: [1, 2, 3, 4, 5, 6].map((n) => ({
        src: `/design/cdl/gift-bojesen/${n}.webp`,
        width: 1080,
        height: 1920,
        label: `Gift Edition Bojesen · ${n}`,
      })),
    },
    {
      type: "story",
      pages: [1, 2, 3, 4, 5, 6].map((n) => ({
        src: `/design/cdl/brand-tradition/${n}.webp`,
        width: 1080,
        height: 1920,
        label: `Brand Highlight &Tradition · ${n}`,
      })),
    },
  ],
  airess: [
    {
      type: "story",
      pages: [
        {
          src: "/design/airess/feed.webp",
          width: 483,
          height: 813,
          label: "joinairess — profile feed",
        },
      ],
    },
    {
      type: "reel",
      videoSrc: "/design/airess/reel-advice-18.mp4",
      poster: "/design/airess/reel-advice-18-poster.jpg",
      label: "Advice to 18 Year Old Self",
    },
    {
      type: "reel",
      videoSrc: "/design/airess/reel-events-drop.mp4",
      poster: "/design/airess/reel-events-drop-poster.jpg",
      label: "Instagram Events Drop",
    },
  ],
  becca: [
    {
      type: "reel",
      videoSrc: "/design/becca/reel-pain-of-paying.mp4",
      poster: "/design/becca/reel-pain-of-paying-poster.jpg",
      posterWidth: 272,
      posterHeight: 480,
      label: "Pain of Paying — Frictionless Society",
    },
    {
      type: "reel",
      videoSrc: "/design/becca/reel-linkedin.mp4",
      poster: "/design/becca/reel-linkedin-poster.jpg",
      posterWidth: 640,
      posterHeight: 1138,
      label: "LinkedIn — Becca Pino",
    },
    {
      type: "board",
      src: "/design/becca/board.png",
      width: 870,
      height: 1024,
      label: "Becca Pino brand board",
    },
  ],
  joyce: [
    {
      type: "deck",
      images: [
        { src: "/design/joyce/deck/1.jpg", width: 1224, height: 1584, label: "Seller's Guide — cover" },
        { src: "/design/joyce/deck/2.jpg", width: 1224, height: 1584, label: "Seller's Guide — about me" },
        { src: "/design/joyce/deck/3.jpg", width: 1224, height: 1584, label: "Seller's Guide — bio" },
        { src: "/design/joyce/deck/4.jpg", width: 1224, height: 1584, label: "Seller's Guide — pricing" },
        { src: "/design/joyce/deck/5.jpg", width: 1224, height: 1584, label: "Seller's Guide — ten steps" },
        { src: "/design/joyce/deck/6.jpg", width: 1224, height: 1584, label: "Seller's Guide — preparing to sell" },
        { src: "/design/joyce/deck/7.jpg", width: 1224, height: 1584, label: "Seller's Guide — market research" },
        { src: "/design/joyce/deck/8.jpg", width: 1224, height: 1584, label: "Seller's Guide — establish a price" },
        { src: "/design/joyce/deck/9.jpg", width: 1224, height: 1584, label: "Seller's Guide — staging tips" },
        { src: "/design/joyce/deck/10.jpg", width: 1224, height: 1584, label: "Seller's Guide — testimonial" },
        { src: "/design/joyce/deck/11.jpg", width: 1224, height: 1584, label: "Seller's Guide — closing" },
      ],
    },
    {
      type: "story",
      pages: [
        {
          src: "/design/joyce/story/1.png",
          width: 576,
          height: 1024,
          label: "Leap Into Home Perfection",
        },
        {
          src: "/design/joyce/story/2.png",
          width: 576,
          height: 1024,
          label: "Refresh Your Nest",
        },
        {
          src: "/design/joyce/story/3.png",
          width: 576,
          height: 1024,
          label: "Master the Art of Organization",
        },
        {
          src: "/design/joyce/story/4.png",
          width: 576,
          height: 1024,
          label: "Light Up Your Living",
        },
      ],
    },
    {
      type: "reel",
      videoSrc: "/design/joyce/reel-may-achievements.mp4",
      poster: "/design/joyce/reel-may-achievements-poster.jpg",
      posterWidth: 1080,
      posterHeight: 1920,
      label: "May Achievements",
    },
  ],
  shea: [
    {
      type: "story",
      pages: [1, 2, 3, 4, 5, 6].map((n) => ({
        src: `/design/shea/products/${n}.jpg`,
        width: 1080,
        height: 1920,
        label: `Products Highlight · ${n}`,
      })),
    },
    {
      type: "story",
      pages: [
        {
          src: "/design/shea/ww4/1.jpg",
          width: 1080,
          height: 1920,
          label: "Wellness Wednesday — Skin Wisdom",
        },
        {
          src: "/design/shea/ww4/2.jpg",
          width: 1080,
          height: 1920,
          label: "Adapt with the Seasons",
        },
        {
          src: "/design/shea/ww4/3.jpg",
          width: 1080,
          height: 1920,
          label: "Skincare as Self-care",
        },
        {
          src: "/design/shea/ww4/4.jpg",
          width: 1080,
          height: 1920,
          label: "Power of Beauty Sleep",
        },
      ],
    },
  ],
  lion: [
    {
      type: "story",
      pages: [
        {
          src: "/design/lion/zodiac/1.png",
          width: 1080,
          height: 1920,
          label: "Find Your Cosmic Style",
        },
        {
          src: "/design/lion/zodiac/2.png",
          width: 1080,
          height: 1920,
          label: "Zodiac picks — Aries to Virgo",
        },
        {
          src: "/design/lion/zodiac/3.png",
          width: 1080,
          height: 1920,
          label: "Zodiac picks — Libra to Pisces",
        },
      ],
    },
    {
      type: "story",
      pages: [
        {
          src: "/design/lion/light/1.png",
          width: 576,
          height: 1024,
          label: "Pick Your Card — light",
        },
        {
          src: "/design/lion/light/2.png",
          width: 576,
          height: 1024,
          label: "The Lovers",
        },
        {
          src: "/design/lion/light/3.png",
          width: 576,
          height: 1024,
          label: "The Moon",
        },
        {
          src: "/design/lion/light/4.png",
          width: 576,
          height: 1024,
          label: "The High Priestess",
        },
        {
          src: "/design/lion/light/5.png",
          width: 576,
          height: 1024,
          label: "Triple the Fun — light",
        },
      ],
    },
  ],
  crafts: [
    {
      type: "laptop",
      src: "/design/crafts/website.png",
      width: 535,
      height: 317,
      label: "website — about",
    },
    {
      type: "board",
      src: "/design/crafts/board.png",
      width: 872,
      height: 1024,
      label: "Toronto Crafts brand board",
    },
  ],
};
