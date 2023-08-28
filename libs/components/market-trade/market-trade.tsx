'use client';

import React from 'react';

import { formatSimpleCurrency, formatSimpleTime } from '@/utils/utils';

import { useAppProvider } from '../app/provider';
import {
  BinanceEventType,
  BinanceTradeWS,
  TRADES_LIMIT,
  TradePriceColor,
  TradeTableData,
  getPriceColor
} from './market-trade.helper';

type MarketTradeProps = {
  tableData: Array<TradeTableData>;
};

export function MarketTrade(props: MarketTradeProps) {
  const [tradesTableData, setTradesTableData] = React.useState<Array<TradeTableData>>(props.tableData);
  const { messages } = useAppProvider();

  React.useEffect(() => {
    if (messages && messages.e === BinanceEventType.TRADE) {
      const parsedData: BinanceTradeWS = messages;
      setTradesTableData((previousData) => {
        const total = (Number(parsedData.p) * Number(parsedData.q)).toString();
        const prevPrice = (previousData[0].price ?? '').replace(/,/g, '');
        const prevColor: TradePriceColor = previousData[0].priceColor;
        const color = getPriceColor(Number(parsedData.p), Number(prevPrice), prevColor);
        const formattedData: TradeTableData = {
          id: parsedData.t,
          priceColor: color,
          price: formatSimpleCurrency(parsedData.p),
          amount: Number(parsedData.q).toFixed(5),
          total: formatSimpleCurrency(total, 5),
          time: formatSimpleTime(new Date(parsedData.T))
        };
        return [formattedData, ...previousData.slice(0, TRADES_LIMIT - 1)];
      });
    }
  }, [messages]);

  return (
    <>
      <h3 className="font-bold mb-2 pl-2">Market Trades</h3>
      <section className="overflow-x-auto h-[400px]">
        <table className="table-auto w-full border-separate border-spacing-0 bg-white text-left text-xs shadow-md">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="leading-relaxed">
              <th className="pl-2 pr-4 py-1 font-medium text-gray-900 border-b border-slate-200">Price</th>
              <th className="px-4 py-1 font-medium text-gray-900 border-b border-slate-200">Amount(BTC)</th>
              <th className="px-4 py-1 font-medium text-gray-900 border-b border-slate-200">Total(USDT)</th>
              <th className="px-4 py-1 font-medium text-gray-900 border-b border-slate-200">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {tradesTableData.map((trade) => {
              return (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="pl-2 pr-4 py-1.5 border-b border-slate-100">
                    <span className={trade.priceColor}>{trade.price}</span>
                  </td>
                  <td className="px-4 py-1.5 border-b border-slate-100">{trade.amount}</td>
                  <td className="px-4 py-1.5 border-b border-slate-100">{trade.total}</td>
                  <td className="px-4 py-1.5 border-b border-slate-100">{trade.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
