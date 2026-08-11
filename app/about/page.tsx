import type { Metadata } from "next";
import { AboutBackgroundFlower, AboutPhoto } from "./AboutArt";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
};

const ROLES = [
  { company: "Wattpad", title: "Senior Web Engineer", dates: "Dec 2024 – Present" },
  { company: "Laguna Games", title: "Software Engineer, contract", dates: "May 2023 – Sep 2024" },
  { company: "AppCentrica", title: "Software Engineer", dates: "Aug 2022 – Jun 2024" },
  { company: "InVision", title: "Senior Software Engineer", dates: "Jun 2022 – Jul 2022" },
  { company: "KOHO", title: "Software Developer II", dates: "May 2021 – Jun 2022" },
  { company: "Deloitte", title: "Frontend Engineer", dates: "Aug 2019 – May 2021" },
];

export default function AboutPage() {
  return (
    <div className={styles.wrap}>
      <AboutBackgroundFlower />
      <div className={styles.content}>
        <div className={styles.eyebrow}>about</div>
        <h1 className={styles.headline}>
          Games at Laguna Games, fintech at KOHO, and reading at Wattpad.
        </h1>

        <div className={styles.body}>
          <AboutPhoto />
          <p>
            Hey there! I&rsquo;m Donia, a software engineer based in Toronto, Canada. Fueled by
            the challenge of solving complex problems and lots of iced coffee, I&rsquo;m always
            inspired to build products that start with the user and end with innovation.
          </p>
          <p>
            I&rsquo;ve built on both sides of the industry: consulting with the front-end
            engineering team at Deloitte Digital, and startups of every size, from KOHO on a
            mission to democratize the financial industry to InVision making real-time
            collaboration better in a newly remote era!
          </p>
          <p>
            More recently I shipped a board game with Laguna Games, and these days I&rsquo;m a
            senior web engineer at Wattpad, helping migrate the web app 90 million people read on
            every month, and shipping fun features along the way, like letting readers group
            stories into series. Newest of all: this site, on its fifth remake. Give or take. I
            stopped counting at three.
          </p>
          <p>
            I currently specialize in front-end! My current toolset includes React, Angular,
            Typescript, and other various frameworks and libraries related to them.
          </p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineLabel}>where i&rsquo;ve been</div>
          <div className={styles.timelineGrid}>
            {ROLES.map((role) => (
              <div key={role.company}>
                <div className={styles.role}>{role.company}</div>
                <div className={styles.roleTitle}>{role.title}</div>
                <div className={styles.roleDates}>{role.dates}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
