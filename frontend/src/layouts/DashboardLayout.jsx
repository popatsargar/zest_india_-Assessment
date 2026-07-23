function DashboardLayout({ title, subtitle, actions, children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dbeafe,_#f8fafc_45%,_#fff7ed)] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/70 glass p-5 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink md:text-3xl">{title}</h1>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        </header>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
