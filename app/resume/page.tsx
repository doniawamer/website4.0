import type { Metadata } from "next";
import ResumeSheet from "./ResumeSheet";

export const metadata: Metadata = {
  title: "Resume",
};

export default function ResumePage() {
  return <ResumeSheet />;
}
