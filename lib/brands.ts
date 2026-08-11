import type { ThemeKey } from "./theme";
import type { ShapeId } from "./flowers";

export interface RingFlower {
  time: ThemeKey;
  shape: ShapeId;
}

export interface Brand {
  id: string;
  name: string;
  shortName: string;
  handle: string;
  handleHref: string;
  /** Hex accent used for the ring border + inline avatar border (from the design mockup). */
  ringColor: string;
  /** Which flower-stamp asset stands in for this brand's "logo" ring/avatar. */
  ringFlower: RingFlower;
  description: string;
  tags: string[];
}

/**
 * Ring order matches the approved design layout: cdl -> airess -> becca ->
 * joyce -> shea -> lion -> crafts. Colors and flower stamps are pulled
 * directly from the design mockup's per-brand ring borders and img srcs.
 */
export const BRANDS: Brand[] = [
  {
    id: "cdl",
    name: "Casa Di Luce",
    shortName: "cdl",
    handle: "@casadiluce",
    handleHref: "https://www.instagram.com/casadiluce/",
    ringColor: "#C9903D",
    ringFlower: { time: "golden_hour", shape: "shape_01" },
    description:
      "Stories and posts for the lighting showroom, refined and sophisticated like the site: product features, series spotlights, three a week.",
    tags: ["Stories", "Posts"],
  },
  {
    id: "airess",
    name: "airess",
    shortName: "airess",
    handle: "@joinairess",
    handleHref: "https://www.instagram.com/joinairess/",
    ringColor: "#8C7FA8",
    ringFlower: { time: "dusk", shape: "shape_02" },
    description:
      "Full-scale content: brand identity, posts, reels, and video shooting and editing for monthly meetups of women building AI. Soft, approachable, welcoming, and attendance grew with it.",
    tags: ["Reels", "Stories", "Video"],
  },
  {
    id: "becca",
    name: "Becca Pino",
    shortName: "becca",
    handle: "@beccapino",
    handleHref: "https://www.instagram.com/beccapino/",
    ringColor: "#A24E82",
    ringFlower: { time: "golden_hour", shape: "shape_02" },
    description:
      "Reels edited and long-form video repurposed into LinkedIn clips, then everything tightened into a cohesive design system pulled from her existing content. Effortlessly wealthy, worldly, cool-aunt energy.",
    tags: ["Video", "Editing", "Identity"],
  },
  {
    id: "joyce",
    name: "Joyce Cheng Realty",
    shortName: "joyce",
    handle: "@joycechengrealty",
    handleHref: "https://www.instagram.com/joycechengrealty/",
    ringColor: "#C85A3D",
    ringFlower: { time: "late_afternoon", shape: "shape_02" },
    description:
      "A full client suite: custom signature, business cards, pitch decks, and a buyer & seller guide. Plus carousel, reel cover, and story templates for listings and monthly housing reports. High-end, like her site.",
    tags: ["Identity", "Print", "Stories"],
  },
  {
    id: "shea",
    name: "That Good Good Shea",
    shortName: "good shea",
    handle: "@thatgoodgoodshea",
    handleHref: "https://www.instagram.com/thatgoodgoodshea/",
    ringColor: "#D2703F",
    ringFlower: { time: "dusk", shape: "shape_01" },
    description:
      "Published story series and a launch carousel with the luxury feel of shea: Monday motivation, hydration reminders, glowing skin.",
    tags: ["Stories", "Social"],
  },
  {
    id: "lion",
    name: "Lionheart the Label",
    shortName: "lionheart",
    handle: "@lionheartlabel",
    handleHref: "https://www.instagram.com/lionheartlabel/",
    ringColor: "#4B4A8F",
    ringFlower: { time: "dark_mode", shape: "shape_02" },
    description:
      "Holiday story series in the label's minimal, classic style: order deadlines, an eight-days-of-gifting advent calendar, gifts with purchase.",
    tags: ["Stories", "Social"],
  },
  {
    id: "crafts",
    name: "Toronto Crafts",
    shortName: "toronto crafts",
    handle: "torontocrafts.ca",
    handleHref: "https://www.torontocrafts.ca/",
    ringColor: "#2178AE",
    ringFlower: { time: "dark_mode", shape: "shape_01" },
    description:
      "A whimsical website and brand for a new hobby workshop: playful Lego energy, an invitation to all ages and skill sets. Workshops, gallery, and a book-a-class flow.",
    tags: ["Web", "Identity"],
  },
];
