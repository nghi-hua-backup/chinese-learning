"use client";

export default function ToneCoachingPanel() {
  return (
    <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
      <span className="text-lg mt-0.5">ℹ️</span>
      <div className="text-sm text-blue-800 space-y-1">
        <p className="font-semibold text-blue-900">Quy tắc phát âm Thanh 4</p>
        <p>• Thanh 4 + Thanh 0/1/2/3 → <span className="font-medium">Rướn giọng đọc thanh 4</span></p>
        <p>• Thanh 4 + Thanh 4 → <span className="font-medium">Thanh 4 sau đọc nhanh dứt khoát</span></p>
      </div>
    </div>
  );
}
