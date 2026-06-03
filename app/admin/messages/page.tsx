import Link from "next/link";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import MessageActions from "./message-actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const all = await db.select().from(messages).orderBy(desc(messages.createdAt));
  const unread = all.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-[#555] hover:text-[#d4f600] transition-colors">← Admin</Link>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl font-bold">Messages</h1>
          {unread > 0 && (
            <span className="rounded-full bg-[#d4f600] text-black px-2.5 py-0.5 text-xs font-bold">{unread} new</span>
          )}
        </div>
      </div>

      {all.length === 0 ? (
        <p className="text-[#555]">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {all.map((msg) => (
            <div key={msg.id} className={`rounded-2xl border p-5 space-y-3 transition-colors ${msg.read ? "border-[#1a1a1a] bg-[#0d0d0d]" : "border-[#d4f600]/30 bg-[#111]"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{msg.name}</span>
                    {!msg.read && <span className="rounded-full bg-[#d4f600]/10 border border-[#d4f600]/20 px-2 py-0.5 text-xs font-medium text-[#d4f600]">New</span>}
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-xs text-[#555] hover:text-[#d4f600] transition-colors">
                    {msg.email}
                  </a>
                  {msg.subject && <p className="text-sm font-medium text-[#888]">{msg.subject}</p>}
                  <p className="text-xs text-[#444]">{formatDate(msg.createdAt)}</p>
                </div>
                <MessageActions id={msg.id} read={msg.read} />
              </div>
              <p className="text-sm text-[#888] leading-relaxed whitespace-pre-wrap">{msg.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
