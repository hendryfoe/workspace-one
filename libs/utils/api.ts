import { BinanceTrades } from '@/components/market-trade';

import { BinanceUiKLineInterval, BinanceUiKLines } from 'libs/models/binance';
import { buildURL, toQueryString } from './utils';

export const FETCH_ITEMS_LIMIT = '200';

export type BinanceGetUiKLinesParams = {
  symbol: string;
  interval: BinanceUiKLineInterval;
  startTime?: string;
  endTime?: string;
  limit?: string;
};
export async function getUiKLinesBinanceAPI(params: BinanceGetUiKLinesParams) {
  const endpoint = buildURL('https://api.binance.com/api/v3/uiKlines', toQueryString(params));

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw response;
  }
  const result = (await response.json()) as BinanceUiKLines;
  return result;
}

type BinanceGetTradesParams = {
  symbol: string;
  limit?: string;
};
export async function getTradesBinanceAPI(params: BinanceGetTradesParams) {
  const endpoint = buildURL('https://api.binance.com/api/v3/trades', toQueryString(params));

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw response;
  }
  const result = (await response.json()) as BinanceTrades;
  return result;
}
