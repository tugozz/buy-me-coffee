// import { XCircle } from "lucide-react";

// export function ZodErrors({ error }: { error?: string[] }) {
//   if (!error) return null;

//   return error.map((error: string, index: number) => (
//     <div
//       className="text-red-500 text-[12px] flex gap-1  items-center"
//       key={index}
//     >
//       <XCircle className="w-3 h-3" />
//       {error}
//     </div>
//   ));
// }

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
