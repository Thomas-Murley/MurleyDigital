import type { Profile } from "./types";
import { legalUpdated } from "./content";

export type LegalSection = { heading: string; paragraphs: string[] };

export function termsSections(profile: Profile): LegalSection[] {
  const who = profile.legalName || profile.name;
  const email = profile.email;
  return [
    {
      heading: "Agreement",
      paragraphs: [
        `These terms cover the public ${profile.name} website, project work we do for you, and hosting subscriptions billed through the client portal. Using the site, accepting a proposal, or accepting an invite means you agree to these terms.`,
        `If a signed proposal conflicts with these terms, the proposal wins for that project. Hosting still follows the billing terms and the amount shown on your invite.`,
      ],
    },
    {
      heading: "The studio",
      paragraphs: [
        `${who} ("we", "us") designs, builds, and hosts websites. The public contact is ${email}${profile.location ? `, ${profile.location}` : ""}.`,
        "The marketing pages describe how we work. They are not a quote. A project starts when both sides agree in writing, and email counts.",
      ],
    },
    {
      heading: "Projects",
      paragraphs: [
        "Scope, timeline, and price live in the proposal. Work outside that scope is a change, priced before we do it.",
        "Revision rounds are the number named in the package or proposal. Further rounds are billed at the hourly rate in the proposal. If none is stated, the rate is $150 an hour.",
        "You supply content, logins we need, and feedback in reasonable time. You confirm you have the rights to materials you send us. Delays on your side move the schedule.",
      ],
    },
    {
      heading: "Project fees",
      paragraphs: [
        "Unless the proposal says otherwise, you pay half to reserve the start date and the rest before launch. We may pause work if an invoice is overdue.",
        "Project fees are separate from monthly hosting. The client portal does not collect the build fee. We invoice that directly.",
        "If you stop a project after work has started, you pay for work done through the stop date. A deposit already earned against that work is not refunded. If we have not started, we return the deposit minus any third-party costs we already paid on your behalf.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "When the project is paid in full, you own the final visual design and the content created for you under the proposal. We keep ownership of pre-existing tools, starter code, and know-how, and we license those to you as part of the delivered site.",
        "Third-party fonts, software, and services stay under their own licenses. You are responsible for fees those vendors charge you directly.",
        "Until the project is paid in full, we retain the work and may withhold launch files and passwords.",
      ],
    },
    {
      heading: "Portfolio",
      paragraphs: [
        "We may show the finished work in our portfolio, talks, and proposals unless you tell us in writing, before launch, not to. We will not publish confidential numbers you marked as private.",
      ],
    },
    {
      heading: "Hosting subscriptions",
      paragraphs: [
        "Hosting is optional and quoted per site. We set the monthly amount from the cost of hosting and care. There is no public registration. We send a private invite link.",
        "The invite shows the site, the plan name, and the monthly amount. That amount is chosen by us. You do not pick a price on the sign-up page. Accepting the invite and adding a payment method authorizes us to charge that payment method each month for the amount shown, until the subscription ends.",
        "We may change the monthly amount if the hosting cost changes. We will email you at least 14 days before the next charge. The new amount appears in your portal. You may cancel before that charge.",
        "The first hosting period is charged when a payment method is added. Later charges fall on the monthly date shown in the portal.",
      ],
    },
    {
      heading: "Failed payments and suspension",
      paragraphs: [
        "If a charge fails, we will tell you and you can update the payment method. If the invoice is still unpaid 10 days after we notify you, we may suspend hosting. Suspension does not erase the amount due. We restore service after the balance is paid, unless we have already ended the subscription.",
      ],
    },
    {
      heading: "Cancellation",
      paragraphs: [
        "You may request cancellation in the portal or by email. Hosting continues through the period already paid. We do not refund a partial hosting month.",
        "Ask within 30 days after hosting ends and we will provide a reasonable export of the site files and content we hold. After that window we may delete hosting data. Backups we keep are a courtesy, not your only copy. Keep your own export.",
        "We may end hosting for nonpayment, abuse, or a serious breach of these terms. When it is reasonable, we will warn you first.",
      ],
    },
    {
      heading: "Domains",
      paragraphs: [
        "Your domain should stay in a registrar account you control. We can be a technical contact. We will not hold a domain hostage over a dispute about a future invoice. Transfer locks and registrar rules still apply.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "Do not use the site or the hosting for anything unlawful, for malware, or in a way that puts the infrastructure or other people at risk. We may remove content or suspend service if we have to.",
      ],
    },
    {
      heading: "Disclaimers",
      paragraphs: [
        "We do the work carefully. We do not guarantee a search ranking, a revenue number, or hosting with no interruptions at all. Scheduled maintenance and failures at upstream providers can take a site offline.",
        "The public marketing site is provided as is, without a warranty of uninterrupted access.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the extent the law allows, our total liability for a claim is limited to the fees you paid us for the project, or the hosting month, that gave rise to the claim. We are not liable for lost profits, lost data, or indirect damages.",
        "Some places do not allow these limits. In those places, our liability is limited to the smallest amount the law allows. Nothing in these terms limits liability for fraud or for anything else that cannot legally be limited.",
      ],
    },
    {
      heading: "Your responsibility for content",
      paragraphs: [
        "You will cover claims that come from content you supplied, from your products, or from your misuse of the site, except to the extent the claim was caused by our own negligence.",
      ],
    },
    {
      heading: "Law",
      paragraphs: [
        "These terms follow the laws of the United States and the state where the studio is established, without regard to conflict-of-law rules. The governing state is the one named in your proposal. If a proposal does not name one, ask us before you rely on a venue.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        `We can update these terms. The date at the top will change. The current date is ${legalUpdated}. If you have an active hosting subscription, we will email you about a material change to billing before it applies.`,
        "Continued use of hosting after an update means you accept the new terms for future periods. A project already under a proposal keeps the terms that were in effect when you accepted that proposal, unless we both agree otherwise.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about these terms: ${email}.`],
    },
  ];
}

export function privacySections(profile: Profile): LegalSection[] {
  const email = profile.email;
  return [
    {
      heading: "Who we are",
      paragraphs: [
        `${profile.legalName || profile.name} is the studio responsible for personal information collected through this website and the client portal. Contact ${email} for privacy requests.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "Contact form: your name, email, company, budget, timeline, the kind of work you need, and the message you write.",
        "Client account: name, email, company, and a hashed password. We never store the password itself.",
        "Billing: when card billing is in demonstration mode, we store the card brand, last four digits, expiry, name, and postal code. We do not store the full card number or the security code. When Stripe is connected, Stripe collects and stores the card, and we store the brand, last four, expiry, and Stripe's customer and subscription identifiers.",
        "Invoices: amounts, dates, and status, so both of us have a record.",
        "Technical data: the host may log IP address, browser, and the page requested, which is normal for running a site and investigating abuse.",
      ],
    },
    {
      heading: "How we use it",
      paragraphs: [
        "We use this information to answer inquiries, run your account, bill the hosting you authorized, keep invoices, and protect the service. We do not sell personal information. We do not use it for advertising profiles.",
      ],
    },
    {
      heading: "Who else sees it",
      paragraphs: [
        "Staff of the studio. The company that hosts this application. Stripe, if you are on live card billing. A professional advisor if we are required to share something for tax, legal, or security reasons. We do not pass your details to a marketing list.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "The portal uses one essential cookie to keep you signed in. It is httpOnly, which means page scripts cannot read it. We do not set advertising or analytics cookies on this site unless we later say so here.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "Inquiries stay until we no longer need them to follow up. Accounts stay while hosting is active. Invoices may be kept longer because tax rules require a record. You can ask us to delete an account. We may retain invoices and a minimal note of the request.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "Passwords are hashed. Invite links are long random secrets. Do not forward an invite. No method of storage is perfect. If we learn of a breach that affects you, we will tell you as required by law.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "This studio works with businesses. The site is not directed at children under 16, and we do not knowingly collect their information.",
      ],
    },
    {
      heading: "Your requests",
      paragraphs: [
        `Email ${email} to access, correct, or delete personal information we hold about you. We may need to confirm you are the account holder. If you are in a place with additional privacy rights, tell us where you are and what you are asking for, and we will respond in line with that law.`,
      ],
    },
    {
      heading: "International visitors",
      paragraphs: [
        "If you contact us from outside the United States, you understand the information will be processed in the United States, where we operate.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [`We update this notice by changing the date at the top. Current date: ${legalUpdated}.`],
    },
  ];
}

export function billingSections(profile: Profile): LegalSection[] {
  return [
    {
      heading: "Two different bills",
      paragraphs: [
        "The build is a project fee, invoiced directly, usually half to start and half before launch. Monthly hosting is a subscription in the client portal. Paying one does not pay the other.",
      ],
    },
    {
      heading: "Who sets the monthly amount",
      paragraphs: [
        `${profile.name} sets the monthly hosting amount from the cost of keeping that site online and the care included in the plan. You will see the exact figure on your private invite before you create a password. You cannot edit that figure. If it is wrong, do not add a card. Email ${profile.email} and we will send a corrected invite.`,
      ],
    },
    {
      heading: "What you authorize",
      paragraphs: [
        "Adding a payment method authorizes recurring monthly charges for the amount shown, in US dollars, until you cancel or we end the subscription. The cardholder name should be a person allowed to approve that charge.",
        "If the portal says card billing is not connected to a payment network, do not enter a real card. No bank charge is made in that mode. When Stripe is connected, Stripe processes the charge under its terms as well as ours.",
      ],
    },
    {
      heading: "Timing",
      paragraphs: [
        "The first period is charged when the payment method is added. The portal shows the next charge date. Each later charge covers the following month of hosting.",
        "Included edit time, if your plan has any, is described on the pricing page and in your proposal. Unused minutes do not roll over. Work beyond the included time is quoted first.",
      ],
    },
    {
      heading: "Updating a card",
      paragraphs: [
        "You can replace the card in the portal. Replacing a card does not charge an extra month. It does authorize the same monthly amount on the new card.",
      ],
    },
    {
      heading: "Price changes",
      paragraphs: [
        "If we need to change the monthly amount, we email you at least 14 days before the next charge and update the portal. The charge that is already paid does not change. You may cancel before the new amount is billed.",
      ],
    },
    {
      heading: "Failed charges",
      paragraphs: [
        "We will email you if a charge fails. Update the card in the portal. If the amount is still unpaid 10 days after notice, hosting may be suspended. You still owe the unpaid period. Service returns after the balance is paid, if the subscription has not been ended.",
      ],
    },
    {
      heading: "Cancellation and refunds",
      paragraphs: [
        "Request cancellation in the portal or by email before the next charge date. Hosting stays up through the period you already paid. We do not prorate or refund a partial hosting month.",
        "Project-fee refunds are covered in the terms of service, not here. Hosting refunds are not issued for a month that has started, except where the law requires it.",
      ],
    },
    {
      heading: "Taxes",
      paragraphs: [
        "Amounts are in US dollars and, unless a checkout screen adds tax, do not include sales tax or VAT. If we are required to collect tax, it will be shown before you are charged.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [`Billing questions: ${profile.email}. Include the site name on the account so we can find it.`],
    },
  ];
}
