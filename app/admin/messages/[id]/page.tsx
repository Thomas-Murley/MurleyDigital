import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkRead } from "@/components/mark-read";
import { longDate } from "@/lib/format";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Message" };

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = getStore().messages.find((item) => item.id === id);
  if (!message) notFound();
  const subject = encodeURIComponent(`Re: your note to Murley Digital`);
  return (
    <article className="stack" style={{ maxWidth: 760 }}>
      <MarkRead id={message.id} />
      <p className="kicker">
        <a href="/admin/messages">Messages</a>
      </p>
      <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}>{message.name}</h1>
      <p className="muted">
        <a href={`mailto:${encodeURIComponent(message.email)}?subject=${subject}`}>{message.email}</a>
        {message.company ? ` · ${message.company}` : ""} · {longDate(message.createdAt)}
      </p>
      <div className="stats">
        <div className="stat">
          <strong style={{ fontSize: "1.2rem" }}>{message.service}</strong>
          <span>What they need</span>
        </div>
        <div className="stat">
          <strong style={{ fontSize: "1.2rem" }}>{message.budget}</strong>
          <span>Budget</span>
        </div>
        <div className="stat">
          <strong style={{ fontSize: "1.2rem" }}>{message.timeline}</strong>
          <span>Timing</span>
        </div>
      </div>
      <section className="panel">
        <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{message.message}</p>
      </section>
      <a className="btn btn-solid" href={`mailto:${encodeURIComponent(message.email)}?subject=${subject}`}>
        Reply by email
      </a>
    </article>
  );
}
