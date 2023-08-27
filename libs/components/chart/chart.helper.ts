import { ChartOptions, DeepPartial, IChartApi, createChart } from 'lightweight-charts';
import React from 'react';

export type CreateChartContextResult<T> = {
  getInstance(): T;
  init: VoidFunction;
  remove: VoidFunction;
};

export function createChartContextRef<T>(
  initialize: () => T,
  remove: (instance: T) => void
): CreateChartContextResult<T> {
  let instance: T | null = null;

  return {
    getInstance() {
      if (instance == null) {
        instance = initialize();
      }
      return instance;
    },
    init() {
      this.getInstance();
    },
    remove() {
      if (instance != null) {
        remove(instance);
      }
      instance = null;
    }
  };
}

export type ChartContextValue<T> = {
  update(params: T): void;
  remove(): void;
  isDestroyed(): boolean;
};

export type ChartContextResult = ChartContextValue<DeepPartial<ChartOptions>> & {
  getInstance(): IChartApi;
};

export const ChartContext = React.createContext<(() => ChartContextResult) | null>(null);

export function useChartContext() {
  const context = React.useContext(ChartContext);
  if (context == null) {
    throw new Error('<ChartContext> should be defined!');
  }
  return context;
}

export type ChartContainerProps = ChildrenProps & {
  options: DeepPartial<ChartOptions>;
  container: HTMLDivElement;
};

export function createChartContainerInstance(props: ChartContainerProps): ChartContextResult {
  let chart = createChart(props.container, props.options);
  let destroyed = false;

  return {
    getInstance() {
      return chart;
    },
    remove() {
      chart.remove();
      destroyed = true;
    },
    update(params) {
      chart.applyOptions(params);
    },
    isDestroyed() {
      return destroyed;
    }
  };
}
