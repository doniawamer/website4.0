"use client";

import { useTheme } from "./SiteChrome";
import InkButton from "./InkButton";

type DownloadResumeButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function DownloadResumeButton({
  children = "download resume",
  className,
}: DownloadResumeButtonProps) {
  const { timeKey } = useTheme();
  const pdfHref = `/pdfs/resume-${timeKey.replace(/_/g, "-")}.pdf`;

  return (
    <InkButton href={pdfHref} download="Donia Amer Resume.pdf" className={className}>
      {children}
    </InkButton>
  );
}
