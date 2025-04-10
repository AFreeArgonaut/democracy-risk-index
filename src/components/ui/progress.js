// components/ui/progress.js
import React from "react";

export function Progress({ percent }) {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${percent}%`,
          backgroundColor: percent < 25 ? "#22c55e" : percent < 50 ? "#facc15" : percent < 75 ? "#f97316" : percent < 90 ? "#dc2626" : "#000",
        }}
      ></div>
    </div>
  );
}