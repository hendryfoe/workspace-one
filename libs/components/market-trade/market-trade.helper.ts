import { formatSimpleCurrency, formatSimpleTime } from '@/utils/utils';

export const TRADES_LIMIT = 20;

export type BinanceTrade = {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
};
export type BinanceTrades = Array<BinanceTrade>;

export enum BinanceEventType {
  TRADE = 'trade',
  KLINE = 'kline'
}

export type BinanceTradeWS = {
  e: string; // "trade"      // Event type
  E: number; // 123456789    // Event time
  s: string; // "BNBBTC"     // Symbol
  t: number; // 12345        // Trade ID
  p: string; // "0.001"      // Price
  q: string; // "100"        // Quantity
  b: number; // 88           // Buyer order ID
  a: number; // 50           // Seller order ID
  T: number; // 123456785    // Trade time
  m: boolean; // true         // Is the buyer the market maker?
  M: boolean; // true         // Ignore
};

export type TradePriceColor = 'text-green-700' | 'text-red-700';

export type TradeTableData = {
  id: number;
  price: string;
  amount: string;
  total: string;
  time: string;
  priceColor: TradePriceColor;
};

export function getPriceColor(currentPrice: number, previousPrice: number, previousColor: TradePriceColor) {
  let color: TradePriceColor;

  if (currentPrice > previousPrice) {
    color = 'text-green-700';
  } else if (currentPrice < previousPrice) {
    color = 'text-red-700';
  } else {
    color = previousColor;
  }
  return color;
}

export function transformToTradeTableData(trades: BinanceTrades) {
  const result: Array<TradeTableData> = [];
  let priceChanged = false;

  trades.forEach((trade, i) => {
    const total = (Number(trade.price) * Number(trade.qty)).toString();
    const idx = Math.max(0, i - 1);
    const prevPrice = (trades[idx]?.price ?? '').replace(/,/g, '');
    const prevColor = result[idx]?.priceColor ?? 'text-green-700';

    if (priceChanged === false && i > 0) {
      if (prevPrice !== trade.price) {
        const changedPriceColor = trade.price > prevPrice ? 'text-red-700' : 'text-green-700';
        result.forEach((d) => {
          d.priceColor = changedPriceColor;
        });
        priceChanged = true;
      }
    }

    const color = getPriceColor(Number(trade.price), Number(prevPrice), prevColor);

    result.unshift({
      id: trade.id,
      priceColor: color,
      price: formatSimpleCurrency(trade.price),
      amount: Number(trade.qty).toFixed(5),
      total: formatSimpleCurrency(total, 5),
      time: formatSimpleTime(new Date(trade.time))
    });
  });

  return result;
}
