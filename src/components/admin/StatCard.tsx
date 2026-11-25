export default function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl bg-paper border border-ink/10 p-5">
      <p className="text-[11px] uppercase tracking-[0.1em] text-ink/62">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      {sublabel && <p className="mt-1 text-[12.5px] text-ink/62">{sublabel}</p>}
    </div>
  );
}
