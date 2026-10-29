import type { Metadata } from "next";
import { shortDate } from "@/lib/format";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  const messages = getStore().messages;
  return (
    <div className="stack">
      <header>
        <p className="kicker">Messages</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>Inquiries</h1>
        <p className="lede">Notes from the contact form. Reply from your own email. This desk does not send mail.</p>
      </header>
      {messages.length === 0 ? (
        <p className="empty">No messages yet. They will land here from the contact page.</p>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>From</th>
                <th>Need</th>
                <th>Budget</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>
                    <a href={`/admin/messages/${message.id}`}>
                      {message.readAt ? null : <span className="badge">New</span>} {message.name}
                    </a>
                    <div className="fine">{message.email}</div>
                  </td>
                  <td>
                    {message.service}
                    <div className="fine">{message.company || message.timeline}</div>
                  </td>
                  <td>{message.budget}</td>
                  <td>{shortDate(message.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
