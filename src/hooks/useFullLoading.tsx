// hooks/useGlobalLoading.ts
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LoadingOptions {
  tip?: string;
  delay?: number; // 延迟显示（防闪烁）
}

class LoadingStore {
  private callbacks: ((state: LoadingState) => void)[] = [];
  private count = 0;
  private _visible = false;
  private _tip = "请稍后..."; // 默认提示
  private timeoutId: any = null;

  get state() {
    return {
      visible: this._visible,
      tip: this._tip,
    };
  }

  subscribe(callback: (state: { visible: boolean; tip: string }) => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback as any);
      if (index > -1) this.callbacks.splice(index, 1);
    };
  }

  show(options?: string | LoadingOptions) {
    let tip = "请稍后...";
    let delay = 0;

    if (typeof options === "string") {
      tip = options;
    } else if (options) {
      tip = options.tip ?? tip;
      delay = options.delay ?? 0;
    }

    this.count++;

    // 如果有延迟，先不清除之前的 timeout（防竞态）
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (delay > 0) {
      this.timeoutId = setTimeout(() => {
        this._tip = tip;
        this._visible = true;
        this.notify();
      }, delay);
    } else {
      this._tip = tip;
      this._visible = true;
      this.notify();
    }
  }

  hide() {
    this.count--;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.count <= 0) {
      this.count = 0;
      this._visible = false;
      // tip 不重置，避免闪变（可选）
      this.notify();
    }
  }

  private notify() {
    this.callbacks.forEach((cb) => cb(this.state));
  }
}

const store = new LoadingStore();

// 导出函数
export const fullLoading = (flag = true, options?: string | LoadingOptions) =>
  flag ? store.show(options) : store.hide();

// React Hook
export interface LoadingState {
  visible: boolean;
  tip: string;
}

export const useGlobalLoading = (): LoadingState => {
  const [state, setState] = useState(store.state);

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
};

export const FullLoadingHolder = () => {
  const { visible, tip } = useGlobalLoading();
  if (!visible) return null;
  return createPortal(<Spin className="z-[999999]" fullscreen description={tip} />, document.body);
};
