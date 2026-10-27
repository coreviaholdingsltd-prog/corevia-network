import type { Metadata } from "next";
import ManageGigsClient from "./manage-gigs-client";

export const metadata: Metadata = {
  title: "My Gigs & Applications | Corevia Rise",
  description: "Manage your Corevia Rise gig listings, review applications and track the gigs you applied for.",
};

export default function ManageGigsPage() {
  return <ManageGigsClient />;
}
