import useSWRImmutable from 'swr/immutable';

import { BinanceUiKLines } from '@/models/binance';
import { BinanceGetUiKLinesParams, FetchBinanceAPIKey, fetchBinanceAPI } from '@/utils/api';

export function useUIKLines(params: BinanceGetUiKLinesParams) {
  const { data, error, isLoading } = useSWRImmutable<BinanceUiKLines, any, FetchBinanceAPIKey>(
    {
      path: '/api/v3/uiKlines',
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
