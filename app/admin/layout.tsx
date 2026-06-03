export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
        {children}
      </div>
    </div>
  );
}
