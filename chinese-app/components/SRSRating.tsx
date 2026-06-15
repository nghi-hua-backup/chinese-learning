"use client";

interface Props {
  onRate: (rating: number) => void;
  disabled?: boolean;
}

const RATINGS: { label: string; sublabel: string; rating: number; color: string }[] = [
  { label: "Lại", sublabel: "< 1 phút", rating: 1, color: "bg-red-500 hover:bg-red-600" },
  { label: "Khó", sublabel: "< 10 phút", rating: 2, color: "bg-orange-500 hover:bg-orange-600" },
  { label: "Tốt", sublabel: "vài ngày", rating: 3, color: "bg-green-500 hover:bg-green-600" },
  { label: "Dễ", sublabel: "tuần sau", rating: 4, color: "bg-blue-500 hover:bg-blue-600" },
];

export default function SRSRating({ onRate, disabled }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 mt-4">
      {RATINGS.map((r) => (
        <button
          key={r.rating}
          onClick={() => onRate(r.rating)}
          disabled={disabled}
          className={`${r.color} text-white rounded-xl py-3 px-2 flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-50`}
        >
          <span className="text-lg font-bold">{r.label}</span>
          <span className="text-xs opacity-80">{r.sublabel}</span>
        </button>
      ))}
    </div>
  );
}
