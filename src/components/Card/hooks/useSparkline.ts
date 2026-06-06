import { useMemo } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { SparklineType } from "../type";


export function useSparklineOption(
  type: SparklineType,
  data: number[],
  color: string,
): EChartsOption | null {
  return useMemo(() => {
    if (type === "progress") {
      const pct = data[0] ?? 0;
      return {
        animation: false,
        grid: { top: 0, bottom: 0, left: 0, right: 0 },
        xAxis: { show: false, max: 100 },
        yAxis: { show: false },
        series: [
          {
            type: "bar",
            data: [pct],
            barWidth: "100%",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color },
                { offset: 1, color: color + "80" },
              ]),
              borderRadius: 4,
            },
            label: { show: false },
            barGap: "-100%",
          },
        ],
      };
    }

    if (type === "bar") {
      return {
        animation: false,
        grid: { top: 2, bottom: 0, left: 0, right: 0 },
        xAxis: { show: false, data: data.map((_, i) => i) },
        yAxis: { show: false },
        series: [
          {
            type: "bar",
            data,
            barWidth: "60%",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color },
                { offset: 1, color: color + "40" },
              ]),
              borderRadius: [2, 2, 0, 0],
            },
          },
        ],
      };
    }

    // line
    return {
      animation: false,
      grid: { top: 4, bottom: 0, left: 0, right: 0 },
      xAxis: { show: false, data: data.map((_, i) => i) },
      yAxis: { show: false },
      series: [
        {
          type: "line",
          data,
          smooth: true,
          symbol: "none",
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color + "50" },
              { offset: 1, color: color + "05" },
            ]),
          },
        },
      ],
    };
  }, [type, data, color]);
}
