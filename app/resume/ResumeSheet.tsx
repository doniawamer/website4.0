"use client";

import { useTheme } from "@/components/SiteChrome";
import InkButton from "@/components/InkButton";
import styles from "./page.module.css";

const WORK_HISTORY: {
  company: string;
  dates: string;
  body: string;
  layoffNote?: boolean;
}[] = [
  {
    company: "Wattpad",
    dates: "Dec 2024 – Present",
    body: "Led frontend epics and small teams, shipping new user-facing features and driving a legacy-to-modern framework migration to improve scalability and long-term maintainability.",
  },
  {
    company: "Laguna Games",
    dates: "May 2023 – Aug 2024",
    layoffNote: true,
    body: "Architected a Web3 rewards leaderboard with wallet-signature-verified redemption, backend-validated point tracking, and Firestore-backed progression, driving a 25% increase in engagement.",
  },
  {
    company: "AppCentrica",
    dates: "Aug 2022 – May 2023",
    body: "Built the USG Partner App, an offline-first React Native app for partners in the field to check into services and shifts, manage daily and period tasks, and upload proof of completed work. Nearly everything works without a signal and syncs when one returns.",
  },
  {
    company: "InVision",
    dates: "Jun 2022 – Aug 2022",
    layoffNote: true,
    body: "Quickly ramped up on React micro-frontend architecture, collaborating with the team on bug fixes and improvements.",
  },
  {
    company: "KOHO",
    dates: "May 2021 – May 2022",
    body: "Delivered critical React features for the web application, focusing on responsive design, and implemented patterns that reduced development cycles.",
  },
  {
    company: "Deloitte Digital",
    dates: "Aug 2019 – May 2021",
    body: "Consulted across the stack for clients in a range of industries. Most memorably: a config-driven form system for a public sector client that encoded submissions into positionally-parsed QR codes, with a single source of truth keeping UI and serialization in sync despite no access to the receiving system.",
  },
  {
    company: "IBM",
    dates: "May 2017 – Aug 2018",
    body: "Drove site build efficiency and repository management, implementing automated testing workflows.",
  },
];

export default function ResumeSheet() {
  const { timeKey } = useTheme();
  const pdfHref = `/pdfs/resume-${timeKey.replace(/_/g, "-")}.pdf`;

  return (
    <div className={styles.wrap}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <div>
            <div className={styles.hi}>hi, my name is</div>
            <div className={styles.name}>donia amer</div>
            <div className={styles.role}>Senior Front-End Engineer</div>
            <div className={styles.contactLine}>
              Toronto, Canada ·{" "}
              <a
                href="https://github.com/doniawamer"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                github
              </a>{" "}
              ·{" "}
              <a
                href="https://www.linkedin.com/in/donia-a-a6a270111/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                linkedin
              </a>
            </div>
          </div>
          <div className={styles.headerAction}>
            <InkButton href={pdfHref} download="Donia Amer Resume.pdf">
              download resume
            </InkButton>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <div className={styles.block}>
              <div className={styles.label}>a little about me</div>
              <p className={styles.body}>
                I&rsquo;m a design oriented software engineer based in Toronto, Canada. Fueled by
                the challenge of solving complex problems, I&rsquo;m always inspired to build
                products that start with the user and end with innovation.
              </p>
              <p className={styles.body}>
                For the past few years, I&rsquo;ve been intrigued by front-end development and all
                its inner workings. My current toolset includes React, Typescript, and other
                various technologies related to them.
              </p>
            </div>

            <div className={styles.block}>
              <div className={styles.label}>education</div>
              <div className={styles.school}>York University</div>
              <div className={styles.schoolDegree}>B.Eng. Spec. Hons, Computer Engineering</div>
            </div>

            <div className={styles.block}>
              <div className={styles.label}>how i can help</div>
              <div className={styles.skillGroup}>front-end</div>
              <div className={styles.skillBody}>
                Javascript/Typescript, React, NextJs, Gatsby, Angular, Redux, RxJs
              </div>
              <div className={styles.skillGroup}>back-end</div>
              <div className={styles.skillBody}>NodeJs, Express, SQL, NoSQL</div>
              <div className={styles.skillGroup}>other proficiencies</div>
              <div className={styles.skillBody}>Figma, Illustrator, Canva</div>
            </div>

            <div className={styles.block}>
              <div className={styles.label}>a few accomplishments</div>
              <p className={styles.body}>
                Ship features for Wattpad&rsquo;s 90 million monthly readers; most recently story
                series, a new way to group stories.
              </p>
              <p className={styles.body}>
                Shipped Codez, a Wordle-style Web3 game inside Telegram, built with the team behind
                Doodles; 21,394 games played at a 74% completion rate.
              </p>
              <p className={styles.body}>
                Delivered an offline-first React Native app for USG partners in the field, keeping
                shifts and tasks fully usable without a signal.
              </p>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.label}>where i&rsquo;ve worked</div>
            <div className={styles.workList}>
              {WORK_HISTORY.map((job) => (
                <div key={job.company}>
                  <div className={styles.workRow}>
                    <span className={styles.workCompany}>{job.company}</span>
                    <span className={styles.workDates}>
                      {job.dates}
                      {job.layoffNote && <sup className={styles.footnoteMark}>*</sup>}
                    </span>
                  </div>
                  <p className={styles.workBody}>{job.body}</p>
                </div>
              ))}
            </div>
            <div className={styles.footnote}>
              (*) Impacted by a mass layoff which was not based on performance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
