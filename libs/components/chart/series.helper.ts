import React, { ForwardedRef } from 'react';

import {
  IChartApi,
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesOptions,
  SeriesPartialOptionsMap,
  SeriesType
} from 'lightweight-charts';

import { ChartContextResult, ChartContextValue, createChartContextRef, useChartContext } from './chart.helper';

export type DefaultSeriesProps<T extends SeriesType> = {
  options?: SeriesPartialOptionsMap[T];
  data: SeriesDataItemTypeMap[T][];
};

export type SeriesContextResult<T extends SeriesType> = ChartContextValue<SeriesOptions<T>> & {
  getInstance(): ISeriesApi<T>;
};

export const SeriesContext = React.createContext<(() => SeriesContextResult<SeriesType>) | null>(null);

export function useSeriesContext() {
  const context = React.useContext(SeriesContext);
  if (context == null) {
    throw new Error('<SeriesContext> should be defined!');
  }
  return context;
}

export function createSeries(chart: IChartApi, type: SeriesType, props: DefaultSeriesProps<SeriesType>) {
  switch (type) {
    case 'Area': {
      const series = chart.addAreaSeries(props.options);
      series.setData(props.data);
      return series;
    }
    case 'Bar': {
      const series = chart.addBarSeries(props.options);
      series.setData(props.data);
      return series;
    }
    case 'Candlestick': {
      const series = chart.addCandlestickSeries(props.options);
      series.setData(props.data);
      return series;
    }
    case 'Histogram': {
      const series = chart.addHistogramSeries(props.options);
      series.setData(props.data);
      return series;
    }
    case 'Line': {
      const series = chart.addLineSeries(props.options);
      series.setData(props.data);
      return series;
    }
    case 'Baseline': {
      const series = chart.addBaselineSeries(props.options);
      series.setData(props.data);
      return series;
    }
  }
}

export function createSeriesInstance<T extends SeriesType>(
  chartContext: () => ChartContextResult,
  type: T,
  props: DefaultSeriesProps<T>
) {
  let destroyed = false;

  const instance = createSeries(chartContext().getInstance(), type, props);

  return {
    getInstance() {
      return instance;
    },
    update(params: SeriesPartialOptionsMap[T]) {
      instance.applyOptions(params);
    },
    remove() {
      if (!chartContext().isDestroyed() && instance) {
        chartContext().getInstance().removeSeries(instance);
      }
      destroyed = true;
    },
    isDestroyed() {
      return destroyed;
    }
  };
}

type UseSeriesProps<T extends SeriesType> = DefaultSeriesProps<T> & {
  type: T;
};

export function useSeries<T extends SeriesType>(props: UseSeriesProps<T>, forwardedRef: ForwardedRef<ISeriesApi<T>>) {
  const { type, ...rest } = props;

  const chartContext = useChartContext();
  const ref = React.useRef(
    createChartContextRef(
      () => createSeriesInstance(chartContext, type, rest),
      (instance) => instance.remove()
    )
  );

  React.useLayoutEffect(() => {
    const currentRef = ref.current;
    currentRef.init();

    return () => {
      currentRef.remove();
    };
  }, []);

  React.useEffect(() => {
    ref.current.getInstance().getInstance().setData(props.data);
    const timeScale = chartContext().getInstance().timeScale();
    timeScale.setVisibleLogicalRange({
      from: props.data[0].time as number,
      to: Date.now() / 1000
    });
  }, [props.data, chartContext]);

  React.useEffect(() => {
    ref.current.getInstance().update(props.options ?? {});
  }, [props.options]);

  React.useImperativeHandle(forwardedRef, () => ref.current.getInstance().getInstance() as ISeriesApi<T>, []);

  return ref;
}
