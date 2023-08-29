'use client';

import React from 'react';

import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LogicalRangeChangeEventHandler,
  UTCTimestamp
} from 'lightweight-charts';

import { BinanceUiKLineInterval, BinanceUiKLineWS, BinanceWSPayload } from '@/models/binance';
import { useWebsocket } from '@/queries/use-webhook';
import { timeToTz } from '@/utils/utils';

import { Chart, SeriesCandlestick, SeriesHistogram } from '../chart';
import { BinanceEventType } from '../market-trade';
import { TVChartData, chartDefaultOptions, getDataByBeforeEndTime, getDataLatest } from './chart-section.helper';

type ChartTimeRangeProps = {
  interval: BinanceUiKLineInterval;
  onChangeTimeRange(time: BinanceUiKLineInterval): void;
};
export const ChartTimeRange = React.memo(function ChartTimeRange(props: ChartTimeRangeProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<BinanceUiKLineInterval>(props.interval);
  const timeRanges = ['1s', '1m', '5m', '15m', '30m', '1h', '6h', '12h', '1d', '1w'];

  function onHandleSelectedTimeRange(time: BinanceUiKLineInterval) {
    setSelectedTimeRange(time);
    props.onChangeTimeRange(time);
  }

  return (
    <div className="flex gap-4 text-sm">
      {timeRanges.map((time) => (
        <button
          key={time}
          className={`py-1 px-2${selectedTimeRange === time ? ' text-orange-500 font-bold' : ''}`}
          onClick={() => onHandleSelectedTimeRange(time as BinanceUiKLineInterval)}
          disabled={selectedTimeRange === time}
        >
          {time}
        </button>
      ))}
    </div>
  );
});

type ChartSectionProps = {
  candlesticks: TVChartData['candlesticks'];
  areas: TVChartData['areas'];
  wsPayload: BinanceWSPayload;
};
export function ChartSection(props: ChartSectionProps) {
  const [chartInterval, setChartInterval] = React.useState<BinanceUiKLineInterval>('1d');
  const [chartData, setChartData] = React.useState<TVChartData>(() => ({
    candlesticks: props.candlesticks,
    areas: props.areas
  }));

  const { data, send } = useWebsocket<any>('wss://stream.binance.com:443/ws', props.wsPayload);

  const onChangeTimeRange = React.useCallback(
    async (time: BinanceUiKLineInterval) => {
      const result = await getDataLatest(time);
      if (result.candlesticks.length > 0) {
        setChartData(result);
        send({
          method: 'UNSUBSCRIBE',
          params: [`btcusdt@kline_${chartInterval}`],
          id: Math.floor(Math.random() * 10)
        });
        send({
          method: 'SUBSCRIBE',
          params: [`btcusdt@kline_${time}`],
          id: Math.floor(Math.random() * 10)
        });
      }
      setChartInterval(time);
    },
    [chartInterval, send]
  );

  return (
    <>
      <section className="mb-2 pb-2 border-b w-full overflow-x-scroll p-30">
        <ChartTimeRange onChangeTimeRange={onChangeTimeRange} interval={chartInterval} />
      </section>
      <PlainChart
        candlesticks={chartData.candlesticks}
        areas={chartData.areas}
        chartInterval={chartInterval}
        wsData={data}
      />
    </>
  );
}

type PlainChartProps = {
  candlesticks: TVChartData['candlesticks'];
  areas: TVChartData['areas'];
  chartInterval: BinanceUiKLineInterval;
  wsData: any;
};
export function PlainChart(props: PlainChartProps) {
  const candlestickRef = React.useRef<ISeriesApi<'Candlestick'>>(null);
  const histogramRef = React.useRef<ISeriesApi<'Histogram'>>(null);
  const timeScaleRef = React.useRef<VoidFunction | null>(null);

  const [chartOptions] = React.useState<DeepPartial<ChartOptions>>(() => chartDefaultOptions);

  React.useEffect(() => {
    if (props.wsData && props.wsData.e === BinanceEventType.KLINE) {
      const parsedData: BinanceUiKLineWS = props.wsData;
      if (parsedData.k.i === props.chartInterval && candlestickRef.current && histogramRef.current) {
        const time = (timeToTz(parsedData.k.t, 'Asia/Jakarta') / 1000) as UTCTimestamp;
        candlestickRef.current!.update({
          time,
          open: Number(parsedData.k.o),
          high: Number(parsedData.k.h),
          low: Number(parsedData.k.l),
          close: Number(parsedData.k.c)
        });
        histogramRef.current!.update({
          time,
          value: Number(parsedData.k.v),
          color: Number(parsedData.k.c) > Number(parsedData.k.o) ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255,82,82, 0.8)'
        });
      }
    }
  }, [props.wsData, props.chartInterval]);

  const chartRef = React.useCallback(
    (chartInstance: IChartApi) => {
      if (chartInstance && histogramRef.current && candlestickRef.current) {
        let candlesticks = props.candlesticks;
        let histograms = props.areas;

        histogramRef.current.priceScale().applyOptions({
          scaleMargins: {
            top: 0.85,
            bottom: 0
          }
        });

        if (timeScaleRef.current) {
          timeScaleRef.current();
          timeScaleRef.current = null;
        }

        let isFetching = false;

        const listener: LogicalRangeChangeEventHandler = async (logicalRange) => {
          if (logicalRange && candlestickRef.current) {
            const barsInfo = candlestickRef.current.barsInLogicalRange(logicalRange);
            if (barsInfo != null && barsInfo.barsBefore < 50 && !isFetching) {
              isFetching = true;

              const result = await getDataByBeforeEndTime(candlesticks[0].time as number, props.chartInterval);

              histograms.unshift(...result.areas);
              candlesticks.unshift(...result.candlesticks);

              candlestickRef.current!.setData(candlesticks);
              histogramRef.current!.setData(histograms);

              isFetching = false;
            }
          }
        };

        if (timeScaleRef.current == null) {
          chartInstance.timeScale().subscribeVisibleLogicalRangeChange(listener);
          timeScaleRef.current = () => {
            chartInstance.timeScale().unsubscribeVisibleLogicalRangeChange(listener);
          };
        }
      }
    },
    [props.chartInterval, props.areas, props.candlesticks]
  );

  return (
    <Chart options={chartOptions} ref={chartRef}>
      <SeriesCandlestick ref={candlestickRef} data={props.candlesticks} />
      <SeriesHistogram
        ref={histogramRef}
        data={props.areas}
        options={{
          color: '#26a69a',
          priceFormat: {
            type: 'volume'
          },
          priceScaleId: ''
        }}
      />
    </Chart>
  );
}
