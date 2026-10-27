import type { Metadata } from "next";
import PortfolioClient from "./portfolio-client";

export const metadata: Metadata = {
  title: "My Professional Portfolio | Corevia Network",
  description: "Build a professional skills profile and share your work samples with employers on Corevia Network.",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
