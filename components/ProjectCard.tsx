import DeviceFrame from "./DeviceFrame";
import CoverCard from "./CoverCard";
import Tag from "./Tag";
import styles from "./ProjectCard.module.css";

export interface ProjectCardData {
  device: "laptop" | "phone";
  imageSrc?: string;
  /** Extra stills for phone projects (tap edges after peek). */
  imageSrcs?: string[];
  videoSrc?: string;
  imageAlt: string;
  coverTitle: string;
  coverLabel: string;
  company: string;
  dateRange: string;
  title: string;
  description: string;
  description2?: string;
  tags: string[];
  link?: { href: string; label: string };
}

interface ProjectCardProps {
  data: ProjectCardData;
  variant: "compact" | "detailed";
  mediaFirst?: boolean;
}

export default function ProjectCard({ data, variant, mediaFirst = true }: ProjectCardProps) {
  const media = (
    <div className={styles.media}>
      <DeviceFrame variant={data.device}>
        <CoverCard
          imageSrc={data.imageSrc}
          imageSrcs={data.imageSrcs}
          videoSrc={data.videoSrc}
          imageAlt={data.imageAlt}
          title={data.coverTitle}
          label={data.coverLabel}
        />
      </DeviceFrame>
    </div>
  );

  const text = (
    <div className={styles.text}>
      <div className={styles.metaRow}>
        <span className={styles.company}>{data.company}</span>
        <span className={styles.dateRange}>{data.dateRange}</span>
      </div>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{data.title}</h3>
        {variant === "compact" && data.link && (
          <a
            className={styles.link}
            href={data.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.link.label}
          </a>
        )}
      </div>
      <p className={styles.description}>{data.description}</p>
      {data.description2 && <p className={styles.descriptionSecondary}>{data.description2}</p>}
      <div className={styles.tags}>
        {data.tags.map((tag, i) => (
          <Tag key={tag} colorIndex={i}>
            {tag}
          </Tag>
        ))}
      </div>
      {variant === "detailed" && data.link && (
        <div className={styles.detailedLink}>
          <a
            className={styles.link}
            href={data.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.link.label}
          </a>
        </div>
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <div className={styles.compact}>
        {media}
        {text}
      </div>
    );
  }

  return (
    <div className={mediaFirst ? styles.detailed : `${styles.detailed} ${styles.detailedReverse}`}>
      {media}
      {text}
    </div>
  );
}
