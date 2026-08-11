import Link from "next/link";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import DownloadResumeButton from "@/components/DownloadResumeButton";
import { HOME_PROJECTS } from "@/lib/projects";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="work" className={styles.work}>
        <div className={styles.workLabel}>selected work</div>
        <div className={styles.grid}>
          {HOME_PROJECTS.map((project) => (
            <ProjectCard key={project.title} data={project} variant="compact" />
          ))}
        </div>
        <div className={styles.allProjects}>
          <Link href="/projects" className={styles.allProjectsLink}>
            all projects
          </Link>
        </div>
      </section>

      <div className={styles.sendoff}>
        <div>
          <a
            href="https://open.spotify.com/track/6wNUBZNWFxdUGof6vkaykE?autoplay_ok=1"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sendoffLink}
          >
            one for the road?
          </a>
          <p className={styles.sendoffBody}>pressed, folded, and ready to go.</p>
        </div>
        <DownloadResumeButton>download resume</DownloadResumeButton>
      </div>
    </>
  );
}
