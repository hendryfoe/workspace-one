import useSWRImmutable from 'swr/immutable';

import { BinanceTrades } from '@/components/market-trade';
import { BinanceGetTradesParams, FetchBinanceAPIKey, fetchBinanceAPI } from '@/utils/api';

export function useTrades(params: BinanceGetTradesParams) {
  const { data, error, isLoading } = useSWRImmutable<BinanceTrades, any, FetchBinanceAPIKey>(
    {
      path: '/api/v3/trades',
      params
    },
    fetchBinanceAPI
  );

  return {
    data,
    isLoading,
    isError: error
  };
}
