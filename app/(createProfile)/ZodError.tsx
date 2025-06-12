export function ZodErrors({ error }: { error?: string[] }) {
  if (!error || error.length === 0) return null;
  return (
    <div className="text-sm text-red-500 space-y-1">
      {error.map((e, i) => (
        <div key={i}>{e}</div>
      ))}
    </div>
  );
}
