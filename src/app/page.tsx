'use client';

import React from 'react';

import { ChartSection, transformToTVChartData } from '@/components/chart-section';
import { BinanceTrades, MarketTrade, TRADES_LIMIT, transformToTradeTableData } from '@/components/market-trade';
import { Navbar } from '@/components/navbar';
import { Spinner } from '@/components/spinner';
import { BinanceUiKLines } from '@/models/binance';
import { useTrades } from '@/queries/use-trades.query';
import { useUIKLines } from '@/queries/use-ui-kline.query';
import { FETCH_ITEMS_LIMIT, getTradesBinanceAPI, getUiKLinesBinanceAPI } from '@/utils/api';

async function getData() {
  const promises = [
    getUiKLinesBinanceAPI({
      symbol: 'BTCUSDT',
      endTime: Date.now().toString(),
      interval: '1d',
      limit: FETCH_ITEMS_LIMIT
    }),
    getTradesBinanceAPI({
      symbol: 'BTCUSDT',
      limit: TRADES_LIMIT.toString()
    })
  ];
  const [uiKLinesResult, tradesData] = await Promise.all(promises);
  const chartData = transformToTVChartData(uiKLinesResult as BinanceUiKLines);
  const tradesTableData = transformToTradeTableData(tradesData as BinanceTrades);

  return {
    chartData,
    tradesTableData
  };
}

const defaultWSPayload = {
  method: 'SUBSCRIBE',
  params: ['btcusdt@trade', 'btcusdt@kline_1d'],
  id: Math.floor(Math.random() * 1000)
};

export default function Page() {
  const time = React.useRef(Date.now().toString());

  const {
    data: UIKLineData,
    isLoading: UIKLineIsLoading,
    isError: UIKLineIsError
  } = useUIKLines({
    symbol: 'BTCUSDT',
    endTime: time.current,
    interval: '1d',
    limit: FETCH_ITEMS_LIMIT
  });
  const chartData = transformToTVChartData(UIKLineData);

  const {
    data: tradesData,
    isLoading: tradesIsLoading,
    isError: tradesIsError
  } = useTrades({
    symbol: 'BTCUSDT',
    limit: TRADES_LIMIT.toString()
  });
  const tradesTableData = transformToTradeTableData(tradesData);

  if (UIKLineIsLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full h-screen">
      <Navbar />

      <main className="mt-4 px-7 w-full container mx-auto pb-[200px]">
        <section className="grid grid-flow-row grid-cols-1 lg:grid-flow-col lg:grid-cols-[calc(100%-430px)_430px] gap-4">
          <section>
            {UIKLineIsLoading ? (
              <Spinner />
            ) : (
              <ChartSection
                candlesticks={chartData.candlesticks}
                areas={chartData.areas}
                wsPayload={defaultWSPayload}
              />
            )}
          </section>
          <section>
            {tradesIsLoading ? <Spinner /> : <MarketTrade tableData={tradesTableData} wsPayload={defaultWSPayload} />}
          </section>
        </section>
      </main>
    </div>
  );
}
