"use client";

interface Props {
  percent: number;
}

export default function ProgressBar({ percent }: Props) {
  const fill = Math.min(percent, 100);
  return (
    <div
      style={{
        width: "100%",
        height: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: "9999px",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${fill}%`,
          minWidth: fill > 0 ? "12px" : "0",
          backgroundColor: "#16B981",
          borderRadius: "9999px",
          boxShadow: "0 0 16px rgba(22, 185, 129, 0.5)",
          transition: "width 1000ms ease-out",
        }}
      />
    </div>
  );
}
