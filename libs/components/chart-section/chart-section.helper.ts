import { BinanceUiKLineInterval, BinanceUiKLines } from '@/models/binance';
import { FETCH_ITEMS_LIMIT, getUiKLinesBinanceAPI } from '@/utils/api';
import { formatSimpleDatetime, timeToTz } from '@/utils/utils';

import {
  CandlestickData,
  ChartOptions,
  ColorType,
  DeepPartial,
  HistogramData,
  TickMarkType,
  Time,
  UTCTimestamp
} from 'lightweight-charts';

export type TVChartData = {
  candlesticks: Array<CandlestickData>;
  areas: Array<HistogramData>;
};

export const msByInterval: Record<Partial<BinanceUiKLineInterval>, number> = {
  '1s': 1,
  '1m': 1 * 60,
  '5m': 1 * 60 * 5,
  '15m': 1 * 60 * 15,
  '30m': 1 * 60 * 30,
  '1h': 1 * 60 * 60,
  '2h': 1 * 60 * 60 * 2,
  '4h': 1 * 60 * 60 * 4,
  '6h': 1 * 60 * 60 * 6,
  '8h': 1 * 60 * 60 * 8,
  '12h': 1 * 60 * 60 * 12,
  '1d': 1 * 60 * 60 * 24,
  '3d': 1 * 60 * 60 * 24 * 3,
  '1w': 1 * 60 * 60 * 24 * 7,
  '3m': 1 * 60 * 60 * 24 * 7 * 3,
  '1M': 1 * 60 * 60 * 24 * 7 * 4
};

function tickMarkFormatter(time: Time, tickMarkType: TickMarkType, locale: string): string {
  const formatOptions: Intl.DateTimeFormatOptions = {};

  switch (tickMarkType) {
    case TickMarkType.Year:
      formatOptions.year = 'numeric';
      break;

    case TickMarkType.Month:
      formatOptions.month = 'short';
      break;

    case TickMarkType.DayOfMonth:
      formatOptions.day = 'numeric';
      break;

    case TickMarkType.Time:
      formatOptions.hour12 = false;
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
      break;

    case TickMarkType.TimeWithSeconds:
      formatOptions.hour12 = false;
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
      formatOptions.second = '2-digit';
      break;
  }

  return new Date((time as number) * 1000).toLocaleString(locale, formatOptions);
}

export const chartDefaultOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  height: 400,
  rightPriceScale: {
    scaleMargins: {
      top: 0.2,
      bottom: 0.25
    },
    borderVisible: false
  },
  timeScale: {
    fixRightEdge: true,
    lockVisibleTimeRangeOnResize: false,
    timeVisible: true,
    ticksVisible: true,
    minBarSpacing: 10,
    tickMarkFormatter
  },
  localization: {
    timeFormatter: (time: Time) => {
      if (typeof time === 'number') {
        return formatSimpleDatetime(new Date(time * 1000));
      }
      return time;
    },
    locale: 'en-ID'
  },
  layout: { textColor: 'black', background: { type: ColorType.Solid, color: 'white' } }
};

export function transformToTVChartData(data: BinanceUiKLines | undefined) {
  const result: TVChartData = {
    candlesticks: [],
    areas: []
  };

  if (data == null) {
    return result;
  }

  data.forEach((data) => {
    const [openTime, open, high, low, close, volume] = data;
    const time = (timeToTz(openTime, 'Asia/Jakarta') / 1000) as UTCTimestamp;

    result.candlesticks.push({
      time,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close)
    });

    result.areas.push({
      time,
      value: Number(volume),
      color: Number(close) > Number(open) ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255,82,82, 0.8)'
    });
  });

  return result;
}

export async function getData(params: { endTime?: string; interval: BinanceUiKLineInterval }) {
  const uiKLinesResult = await getUiKLinesBinanceAPI({
    symbol: 'BTCUSDT',
    limit: FETCH_ITEMS_LIMIT,
    ...params
  });
  const result = transformToTVChartData(uiKLinesResult as BinanceUiKLines);

  return result;
}

export async function getDataByBeforeEndTime(endTime: number, interval: BinanceUiKLineInterval) {
  const timestamp = (endTime - msByInterval[interval]) * 1000;
  const result = await getData({ endTime: String(timestamp), interval });
  return result;
}

export async function getDataLatest(interval: BinanceUiKLineInterval) {
  const result = await getData({ interval });
  return result;
}
