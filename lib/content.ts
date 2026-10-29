/**
 * Marketing copy, portfolio, and public prices.
 * Replace the sample projects with your own before you send this site to clients.
 * Package prices here are the public build fees. Monthly hosting is set per client
 * when you create an invite in the desk.
 */

export const legalUpdated = "October 29, 2026";

export const studioDefaults = {
  name: "Murley Digital",
  legalName: "Murley Digital",
  email: "hello@murleydigital.com",
  phone: "",
  location: "Working remotely",
  tagline: "Websites, built and hosted.",
};

export type Project = {
  slug: string;
  name: string;
  sector: string;
  year: string;
  services: string[];
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  scope: string[];
  metrics: { value: string; label: string }[];
  art: "harbor" | "lumen" | "calder" | "paperkite" | "sable" | "june";
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "harbor-and-rye",
    name: "Harbor & Rye",
    sector: "Hospitality",
    year: "2025",
    services: ["Marketing site", "Reservations", "Menus"],
    summary: "A two-room restaurant group needed the website to take the reservation, not just announce dinner.",
    challenge:
      "The old site was a slideshow with a phone number. Guests who wanted a table at 7 on a Friday gave up, and the host stand spent the evening on hold.",
    approach:
      "We built a quiet, type-led site. The reservation opens from every page. Menus are structured content, not PDFs, and each room has its own hours without looking like two brands.",
    outcome:
      "Reservation requests moved onto the site. The team edits specials themselves, and the phone is for the questions a form cannot answer.",
    scope: ["8 pages", "Editable menus", "Reservation handoff", "5 weeks"],
    metrics: [
      { value: "38%", label: "more reservation requests" },
      { value: "1.8s", label: "largest contentful paint" },
      { value: "2", label: "rooms, one system" },
    ],
    art: "harbor",
    featured: true,
  },
  {
    slug: "fieldglass",
    name: "Fieldglass",
    sector: "Architecture",
    year: "2025",
    services: ["Practice site", "Project index", "Awards"],
    summary: "An architecture studio wanted the work to be browsable, with drawings that stay sharp and a voice that stays dry.",
    challenge:
      "Years of projects lived in a template that cropped every photograph the same way. Awards were buried, and the index could not be filtered by type.",
    approach:
      "A project index with real categories, full-bleed drawings, and a typographic system borrowed from their title blocks. No stock city skylines.",
    outcome:
      "Prospects arrive at the first meeting having already read two projects. The studio adds a project without calling us.",
    scope: ["Project CMS", "12 case studies at launch", "Awards archive", "7 weeks"],
    metrics: [
      { value: "12", label: "projects published at launch" },
      { value: "0", label: "template themes used" },
      { value: "4", label: "practice areas" },
    ],
    art: "calder",
    featured: false,
  },
  {
    slug: "kestrel-supply",
    name: "Kestrel Supply",
    sector: "Commerce",
    year: "2024",
    services: ["Online store", "Catalog", "Care guide"],
    summary: "An outdoor shop with a point of view. The store had to feel like the paper catalog, and still check out cleanly.",
    challenge:
      "A generic theme made $400 jackets look like phone accessories. Sizing questions were flooding the inbox because the product pages said almost nothing.",
    approach:
      "Editorial product pages, a fit guide written with the buyer, and a cart that stays out of the way until it is needed. Shipping rules match how they actually pack boxes.",
    outcome:
      "The shop finally looks like the brand. Support questions about fit dropped, and returning customers land on the journal as often as the grid.",
    scope: ["Catalog", "Checkout", "Fit guide", "9 weeks"],
    metrics: [
      { value: "24%", label: "fewer sizing emails" },
      { value: "140", label: "products at launch" },
      { value: "1", label: "catalog, not a theme" },
    ],
    art: "lumen",
    featured: true,
  },
  {
    slug: "paper-and-pine",
    name: "Paper & Pine",
    sector: "Retail",
    year: "2024",
    services: ["Bookstore site", "Events", "Staff picks"],
    summary: "An independent bookstore needed events, staff picks, and a small shop that does not shout over the shelves.",
    challenge:
      "Event nights were announced on Instagram and nowhere else. The website was a holding page. Special orders had no front door.",
    approach:
      "A weekly events list the booksellers can update from a phone, staff picks with a byline, and a short shop for gift cards, totes, and signed copies.",
    outcome:
      "The events page is now the thing they put on the door. Special orders come in with the title spelled right.",
    scope: ["Events calendar", "Staff picks", "Small shop", "4 weeks"],
    metrics: [
      { value: "3", label: "events a week, on the site" },
      { value: "1", label: "place for special orders" },
      { value: "6", label: "staff voices" },
    ],
    art: "paperkite",
    featured: false,
  },
  {
    slug: "sable-route",
    name: "Sable Route",
    sector: "Logistics",
    year: "2025",
    services: ["Marketing site", "Lead qualification", "Service lines"],
    summary: "A freight company with four service lines and a site that treated them all as one vague promise.",
    challenge:
      "The homepage said 'solutions' and stopped. The right buyers could not tell who the company would take on, so the sales desk sorted a lot of poor-fit mail.",
    approach:
      "Four service lines with plain language, a short qualifier on the inquiry form, and a homepage that states the lanes they run. Photography from their yards, not a drone library.",
    outcome:
      "Inquiries name a lane. Sales spends the first call on timing and capacity, not on explaining what the company does.",
    scope: ["6 pages", "Qualified inquiry form", "Lane map", "5 weeks"],
    metrics: [
      { value: "4", label: "service lines, clearly named" },
      { value: "2x", label: "form completions worth a call" },
      { value: "6", label: "pages, no filler" },
    ],
    art: "sable",
    featured: false,
  },
  {
    slug: "the-june-room",
    name: "The June Room",
    sector: "Hospitality",
    year: "2026",
    services: ["Inn site", "Direct booking", "Seasonal pages"],
    summary: "A twelve-key inn wanted more stays booked on their own site, and a voice that sounds like the front desk.",
    challenge:
      "Booking links dumped guests onto a third-party grid with someone else's branding. The story of the house never survived the click.",
    approach:
      "A site that keeps the house in view: rooms, the week, the table. Direct booking sits in the same design. Seasonal pages swap without a rebuild.",
    outcome:
      "Guests understand the place before they pick a date. The inn tracks direct stays separately from the booking sites.",
    scope: ["Room index", "Direct booking", "Seasonal pages", "6 weeks"],
    metrics: [
      { value: "12", label: "rooms, described properly" },
      { value: "1", label: "booking flow in their brand" },
      { value: "4", label: "seasons, one template" },
    ],
    art: "june",
    featured: true,
  },
];

export const services = [
  {
    num: "01",
    title: "Marketing sites",
    text: "A site with a job: reservations, inquiries, recruiting, or a clear explanation of the work. Designed for the business, not assembled from a theme.",
    fit: "You are outgrowing a template, a page builder, or a site that has not been touched in years.",
    delivers: ["Positioning and site map", "Custom design", "Responsive build", "Forms that reach a person", "Basic on-page search setup", "Launch and a short handover"],
  },
  {
    num: "02",
    title: "Stores",
    text: "Catalogs and checkout for brands that care how a product is photographed and described. We set up shipping, tax, and the boring settings that make a shop trustworthy.",
    fit: "You sell a considered range and the current shop makes it look generic.",
    delivers: ["Product model", "Cart and checkout", "Shipping and tax setup", "Policies pages", "A way for you to add products"],
  },
  {
    num: "03",
    title: "Web tools",
    text: "Client portals, booking tools, and small applications when a marketing site is not the whole job. Scoped after a look at the workflow, not guessed from a homepage.",
    fit: "Staff or customers need to sign in and do a specific thing.",
    delivers: ["Workflow mapping", "Interface and engineering", "Accounts and roles", "A hosting plan sized to the tool"],
  },
  {
    num: "04",
    title: "Content systems",
    text: "An editor your team will actually open. Menus, projects, events, articles, or a shop, structured so a redesign later does not throw the words away.",
    fit: "More than one person needs to publish, or the content changes every week.",
    delivers: ["Content model", "Roles", "A short training session", "Written notes for the next editor"],
  },
  {
    num: "05",
    title: "Care and hosting",
    text: "After launch we keep the site online: deploys, certificates, backups, watching, and a set amount of small edits. The monthly rate is set from the real hosting cost, then billed from the client portal.",
    fit: "You want one studio responsible for the site after it launches.",
    delivers: ["Managed hosting", "SSL", "Backups", "Uptime checks", "Included edit time", "A private billing account"],
  },
  {
    num: "06",
    title: "Foundations",
    text: "Performance, accessibility, and the search basics that should ship with the site. We do not sell rankings. We do ship fast pages, readable type, and markup a crawler can follow.",
    fit: "This is part of every build, not a separate upsell.",
    delivers: ["Core Web Vitals pass", "Keyboard and contrast review", "Metadata and sharing cards", "Analytics, if you want them"],
  },
];

export type Package = {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  summary: string;
  timeline: string;
  featured?: boolean;
  items: string[];
};

export const packages: Package[] = [
  {
    id: "ledger",
    name: "Ledger",
    price: "$4,200",
    priceNote: "Fixed project fee",
    summary: "A sharp presence. The right choice when you need a few pages to explain the work and collect the next step.",
    timeline: "3 to 4 weeks",
    items: [
      "Up to 5 pages",
      "Custom design, mobile included",
      "Contact or inquiry form",
      "Basic search setup and metadata",
      "Two rounds of revisions",
      "Launch support",
    ],
  },
  {
    id: "atelier",
    name: "Atelier",
    price: "$9,200",
    priceNote: "Fixed project fee",
    summary: "A full marketing site with a content system, so the team can change the words without a developer on the thread.",
    timeline: "6 to 8 weeks",
    featured: true,
    items: [
      "Up to 12 pages",
      "Custom design and a small system",
      "CMS for ongoing edits",
      "Forms, analytics, performance pass",
      "Three rounds of revisions",
      "Two hours of editor training",
    ],
  },
  {
    id: "mercantile",
    name: "Mercantile",
    price: "$16,400",
    priceNote: "Fixed project fee",
    summary: "A shop with a point of view. Catalog, cart, checkout, and the policies a customer looks for before they pay.",
    timeline: "8 to 12 weeks",
    items: [
      "Storefront and content pages",
      "Catalog, cart, and checkout",
      "Shipping and tax configuration",
      "Product content model",
      "Three rounds of revisions",
      "Handover for the person who adds products",
    ],
  },
  {
    id: "commission",
    name: "Commission",
    price: "From $24,000",
    priceNote: "Scoped after discovery",
    summary: "Web applications, portals, and unusual structures. We start with a paid discovery week, credited if you continue.",
    timeline: "Scoped to the work",
    items: [
      "Discovery week at $1,800",
      "Written scope before build",
      "Accounts, roles, and integrations",
      "Staging and a launch plan",
      "Hosting sized to the application",
      "A rate for work beyond the scope",
    ],
  },
];

export const comparison: { label: string; cells: string[] }[] = [
  { label: "Pages", cells: ["Up to 5", "Up to 12", "Store + content", "Scoped"] },
  { label: "Custom design", cells: ["Yes", "Yes", "Yes", "Yes"] },
  { label: "Editable CMS", cells: ["No", "Yes", "Yes", "As needed"] },
  { label: "Checkout", cells: ["No", "No", "Yes", "As needed"] },
  { label: "Revision rounds", cells: ["2", "3", "3", "In the scope"] },
  { label: "Training", cells: ["Launch call", "2 hours", "2 hours", "In the scope"] },
  { label: "Hosting included", cells: ["Quoted separately", "Quoted separately", "Quoted separately", "Quoted separately"] },
];

export const hostingPresets = [
  {
    id: "care",
    label: "Care hosting",
    amount: "49.00",
    detail: "Managed hosting, SSL, backups, uptime checks, and 30 minutes of small edits a month.",
  },
  {
    id: "business",
    label: "Business hosting",
    amount: "96.00",
    detail: "Everything in Care, more room for traffic, and 60 minutes of edits.",
  },
  {
    id: "commerce",
    label: "Commerce hosting",
    amount: "160.00",
    detail: "Store hosting, checkout monitoring, backups, and 60 minutes of edits.",
  },
  {
    id: "platform",
    label: "Platform hosting",
    amount: "240.00",
    detail: "Application hosting, a database, uptime care, and 90 minutes of edits.",
  },
];

export const process = [
  {
    num: "01",
    title: "Intro",
    text: "A short call or a note through the contact form. We say quickly if we are the right studio.",
  },
  {
    num: "02",
    title: "Scope and price",
    text: "You get a written scope, a fixed fee or a range, and a timeline. Nothing starts on a handshake alone.",
  },
  {
    num: "03",
    title: "Design",
    text: "Structure first, then the visual language. You see the site in the browser, not only in a deck.",
  },
  {
    num: "04",
    title: "Build",
    text: "Engineering, content entry, and the unglamorous details: forms, metadata, speed, and the CMS.",
  },
  {
    num: "05",
    title: "Launch",
    text: "Domain, redirects, and a check on the day it goes live. The project fee is finished at launch.",
  },
  {
    num: "06",
    title: "Hosting invite",
    text: "If we are keeping the site, we send a private link. You set a password and add a card for the monthly rate we agreed.",
  },
];

export const reasons = [
  {
    title: "The template is finished",
    text: "It launched fast and now it looks like every other business in the category.",
  },
  {
    title: "The site has a job",
    text: "Bookings, applications, a shop, or a qualifier for sales. A brochure is not doing that job.",
  },
  {
    title: "Nobody is watching it",
    text: "The last developer is gone. Certificates, backups, and small edits have nowhere to go.",
  },
  {
    title: "The shop does not feel like the brand",
    text: "The product is considered. The theme is not. Customers can tell.",
  },
];

export const homeFaq = [
  {
    q: "Do you sell templates?",
    a: "No. Every build is designed for the business in front of us. We do reuse our own engineering habits. We do not reskin a $99 theme and call it custom.",
  },
  {
    q: "Who owns the site?",
    a: "After the project is paid, you own the final design and the content made for you. Your domain stays in your registrar. We keep the right to show the work unless we agree otherwise before launch.",
  },
  {
    q: "How does monthly hosting work?",
    a: "We set the amount from the real cost of hosting and care. There is no public sign-up. We email you a private link. You create a password and add a card. That card is charged the agreed amount each month until you cancel.",
  },
];

export const pricingFaq = [
  ...homeFaq,
  {
    q: "What is not in the project fee?",
    a: "Copywriting beyond a light edit, photography, paid fonts, advertising, and ongoing hosting. If you need those, we say so in the proposal instead of hiding them.",
  },
  {
    q: "When do we pay for the build?",
    a: "Half to start, half before launch, unless the proposal says otherwise. Project invoices are sent directly. The client portal is only for the monthly hosting subscription.",
  },
  {
    q: "Can the monthly rate change?",
    a: "Yes, if the hosting cost changes. We give at least 14 days' notice by email before the next charge, and the new amount shows in your portal. You can cancel before that charge.",
  },
  {
    q: "Can we cancel hosting?",
    a: "Yes. Request it in the portal before the renewal date. Service runs through the period you have already paid. We do not refund a partial month. Ask within 30 days of the end and we will export the site.",
  },
  {
    q: "How long does a build take?",
    a: "A small marketing site is often three to four weeks. A full site is six to eight. A shop is often eight to twelve. The clock starts when the deposit and the raw materials are in.",
  },
];

export const marquee = [
  "Strategy",
  "Interface design",
  "Engineering",
  "Content systems",
  "Commerce",
  "Hosting",
  "Care",
  "Accessibility",
  "Performance",
];

export const budgetOptions = ["Not sure yet", "Under $5,000", "$5,000 to $10,000", "$10,000 to $20,000", "$20,000 and up", "Hosting only"];

export const serviceOptions = ["New website", "Redesign", "Online store", "Web tool or portal", "Hosting and care", "Not sure yet"];

export const timelineOptions = ["As soon as you can", "This quarter", "Next quarter", "Just looking"];
