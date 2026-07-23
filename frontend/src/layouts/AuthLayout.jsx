function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#cffafe,_#f8fafc_40%,_#fff7ed)] px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/60 glass p-8 shadow-soft">
        <h1 className="font-heading text-3xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
