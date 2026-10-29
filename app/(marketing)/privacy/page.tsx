import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { privacySections } from "@/lib/legal";
import { getProfile } from "@/lib/store";

export const metadata: Metadata = { title: "Privacy" };
export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  const profile = getProfile();
  return (
    <LegalDocument
      kicker="Legal"
      title="Privacy notice"
      intro="What we collect, why we keep it, and how to ask us about it. This site does not sell personal information."
      sections={privacySections(profile)}
    />
  );
}
