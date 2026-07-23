function Button({
  type = "button",
  onClick,
  children,
  disabled = false,
  loading = false,
  variant = "primary",
  className = ""
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variants = {
    primary: "bg-ocean text-white hover:bg-cyan-700 focus-visible:ring-cyan-600 disabled:bg-cyan-400",
    secondary: "bg-slate-900 text-white hover:bg-slate-700 focus-visible:ring-slate-600 disabled:bg-slate-500",
    ghost: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 disabled:bg-rose-400"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
