'use client';

import React from 'react';

import { ChartSection, transformToTVChartData } from '@/components/chart-section';
import { BinanceTrades, MarketTrade, TRADES_LIMIT, transformToTradeTableData } from '@/components/market-trade';
import { Navbar } from '@/components/navbar';
import { Spinner } from '@/components/spinner';
import { BinanceUiKLines } from '@/models/binance';
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

export default function Page() {
  // const data = await getData();
  const [data, setData] = React.useState<Awaited<ReturnType<typeof getData>>>({
    chartData: {
      areas: [],
      candlesticks: []
    },
    tradesTableData: []
  });

  React.useEffect(() => {
    let isCancel = false;

    getData().then((result) => {
      if (!isCancel) {
        setData(result);
      }
    });
    return () => {
      isCancel = true;
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <Navbar />

      {data.chartData.candlesticks.length === 0 && (
        <div className="h-full mt-52">
          <Spinner />
        </div>
      )}
      {data.chartData.candlesticks.length > 0 && (
        <main className="mt-4 container mx-auto">
          <section className="w-full grid grid-cols-[1fr_minmax(300px,400px)] gap-4">
            <section>
              <ChartSection data={data.chartData} />
            </section>
            <section>
              <MarketTrade tableData={data.tradesTableData} />
            </section>
          </section>
        </main>
      )}
    </div>
  );
}
