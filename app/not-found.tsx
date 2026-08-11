import type { Metadata } from "next";
import NotFoundContent from "./NotFoundContent";

export const metadata: Metadata = {
  title: {
    absolute: "oops",
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
