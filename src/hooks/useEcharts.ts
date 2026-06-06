import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption, ECharts } from "echarts";

export function useEcharts(
  options: EChartsOption | null,
): React.RefObject<HTMLDivElement | null> {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const instance = echarts.init(chartRef.current);
    instanceRef.current = instance;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        instance.resize();
      }, 100);
    };

    // 监听窗口 resize
    window.addEventListener("resize", handleResize);

    // 监听容器尺寸变化（解决侧边栏折叠、路由切换等场景）
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      instance.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!instanceRef.current || !options) return;
    instanceRef.current.setOption(options, { notMerge: true });
  }, [options]);

  return chartRef;
}
