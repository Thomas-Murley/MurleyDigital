import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { termsSections } from "@/lib/legal";
import { getProfile } from "@/lib/store";

export const metadata: Metadata = { title: "Terms of service" };
export const dynamic = "force-dynamic";

export default function TermsPage() {
  const profile = getProfile();
  return (
    <LegalDocument
      kicker="Legal"
      title="Terms of service"
      intro={`These terms cover the ${profile.name} website, project work, and monthly hosting. They are the working agreement unless a written proposal says otherwise.`}
      sections={termsSections(profile)}
    />
  );
}
