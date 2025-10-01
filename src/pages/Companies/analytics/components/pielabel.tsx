"use client";
import { PieLabelRenderProps } from "recharts";

export default function CustomPieLabel(props: PieLabelRenderProps) {
  const { x, y, name, percent } = props;

  // Convertendo percent para number
  const percentNumber = percent as number;

  if (percentNumber === undefined) return null;

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name} ${(percentNumber * 100).toFixed(0)}%`}
    </text>
  );
}
