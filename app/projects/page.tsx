import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { ALL_PROJECTS } from "@/lib/projects";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <>
      <div className={styles.intro}>
        <div className={styles.eyebrow}>projects</div>
        <h1 className={styles.headline}>Selected work, pressed and kept.</h1>
        <p className={styles.subtitle}>
          Four projects from the last few years, built with teams at Wattpad, Laguna Games,
          AppCentrica, and Deloitte.
        </p>
      </div>
      <div className={styles.list}>
        {ALL_PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.title}
            data={project}
            variant="detailed"
            mediaFirst={i % 2 === 0}
          />
        ))}
      </div>
    </>
  );
}
