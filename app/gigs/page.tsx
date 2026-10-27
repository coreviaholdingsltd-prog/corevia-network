import type { Metadata } from "next";
import GigsClient from "./gigs-client";

export const metadata: Metadata = {
  title: "Rise Gigs | Corevia Rise",
  description: "Find small jobs, post real projects and connect practical skills with paid work on Corevia Rise.",
};

export default function GigsPage() {
  return <GigsClient />;
}
