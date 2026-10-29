import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { billingSections } from "@/lib/legal";
import { getProfile } from "@/lib/store";

export const metadata: Metadata = { title: "Billing terms" };
export const dynamic = "force-dynamic";

export default function BillingTermsPage() {
  const profile = getProfile();
  return (
    <LegalDocument
      kicker="Legal"
      title="Billing terms"
      intro="How monthly hosting is priced, authorized, and canceled. Project fees are invoiced separately and are covered in the terms of service."
      sections={billingSections(profile)}
    />
  );
}
