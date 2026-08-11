import type { ProjectCardData } from "@/components/ProjectCard";

export const WATTPAD_PROJECT: ProjectCardData = {
  device: "laptop",
  imageSrc: "/projects/wattpad.webp",
  videoSrc: "/videos/demo_wattpad.mp4",
  imageAlt: "The Wattpad web app",
  coverTitle: "Ninety million readers.",
  coverLabel: "the wattpad web app",
  company: "Wattpad",
  dateRange: "Dec 2024 – Present",
  title: "The Wattpad web app",
  description:
    "Helping migrate the web app 90 million readers scroll through monthly, and shipping new reader features along the way.",
  description2:
    "Led epics and small pods end to end. Also hunted down a routing gap flooding production monitoring with noise: unmatched URLs now land on a clean 404.",
  tags: ["React", "Remix", "TypeScript"],
  link: { href: "https://www.wattpad.com/", label: "wattpad.com" },
};

export const CODEZ_PROJECT: ProjectCardData = {
  device: "phone",
  imageSrc: "/projects/codez.webp",
  videoSrc: "/videos/demo_codez.mp4",
  imageAlt: "Codez, a game inside Telegram",
  coverTitle: "Crack the daily code.",
  coverLabel: "codez, inside telegram",
  company: "Contract · with the Doodles team",
  dateRange: "2024 – 2025",
  title: "Codez, a game inside Telegram",
  description:
    "A Wordle-style Web3 number game living inside Telegram, built with the team behind Doodles: daily codes to crack, points, and streaks that keep players coming back.",
  description2: "21,394 games played, ~74% completion, and 756 finishing players averaging ~21 games each.",
  tags: ["React", "TypeScript", "Telegram Mini App"],
};

export const LAGUNA_PROJECT: ProjectCardData = {
  device: "laptop",
  imageSrc: "/projects/laguna.webp",
  videoSrc: "/videos/demo_laguna.mp4",
  imageAlt: "Crypto Unicorns board game",
  coverTitle: "Roll, complete, redeem.",
  coverLabel: "crypto unicorns board game",
  company: "Laguna Games",
  dateRange: "May 2023 – Sep 2024",
  title: "Crypto Unicorns",
  description:
    "An interactive rewards board game: in-game challenges, points, and customizable rewards to redeem.",
  description2:
    "Plus a gamified rewards leaderboard where players choose what to redeem: wallet-signature verified, every point backend-validated, engagement up 25%.",
  tags: ["TypeScript", "React", "Firebase", "MetaMask"],
  link: { href: "https://www.cryptounicorns.fun/", label: "cryptounicorns.fun" },
};

export const APPCENTRICA_PROJECT: ProjectCardData = {
  device: "phone",
  imageSrc: "/projects/usg-find-store.webp",
  imageSrcs: ["/projects/usg-find-store.webp", "/projects/usg-sync.webp"],
  imageAlt: "The USG Partner App",
  coverTitle: "Works without signal.",
  coverLabel: "the usg partner app",
  company: "AppCentrica",
  dateRange: "Aug 2022 – May 2023",
  title: "The USG Partner App",
  description:
    "Built with AppCentrica: an offline-first React Native app for partners in the field, managing and completing shifts and tasks whether or not there's a signal.",
  description2:
    "Construction sites don't promise connectivity, so offline is the default: local-first data that syncs in the background when a connection returns.",
  tags: ["React Native", "TypeScript", "Salesforce SDK"],
  link: {
    href: "https://play.google.com/store/apps/details?id=ca.unitedservicesgroup.partnermobileapp&hl=en_CA",
    label: "google play",
  },
};

export const ALL_PROJECTS: ProjectCardData[] = [
  WATTPAD_PROJECT,
  CODEZ_PROJECT,
  LAGUNA_PROJECT,
  APPCENTRICA_PROJECT,
];

export const HOME_PROJECTS: ProjectCardData[] = [WATTPAD_PROJECT, LAGUNA_PROJECT];
