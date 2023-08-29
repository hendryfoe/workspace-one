import React from 'react';

import useSWRSubscription from 'swr/subscription';

import { BinanceWSPayload } from '@/models/binance';

export function useWebsocket<Data extends unknown>(
  url: string = `wss://stream.binance.com:443/ws`,
  message: BinanceWSPayload
) {
  const [webSocket, setWebSocket] = React.useState<WebSocket>();
  const lastMessage = React.useRef<BinanceWSPayload>();

  const send = React.useCallback(
    (message: BinanceWSPayload) => {
      lastMessage.current = message;
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(message));
      }
    },
    [webSocket]
  );

  const { data, error } = useSWRSubscription<Data, Error, string>(url, (url, { next }) => {
    let webSocketInstance: WebSocket;

    function connect(message: BinanceWSPayload) {
      const binanceWS = new WebSocket(url);
      binanceWS.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        next(null, data);
      };
      binanceWS.onerror = (evt) => {
        console.error('WS Error', evt);
        next(evt as any);
      };
      binanceWS.onopen = (evt) => {
        setWebSocket(binanceWS);
        binanceWS.send(JSON.stringify(message));
      };
      binanceWS.onclose = (evt) => {
        console.log('WS On Close result', evt, message);
        if (evt.code === 1008) {
          setTimeout(() => {
            let innerMessage = message;
            if (lastMessage.current) {
              lastMessage.current.params.push('btcusdt@trade');
              innerMessage = lastMessage.current;
            }
            webSocketInstance = connect(innerMessage);
          }, 50);
        }
      };

      return binanceWS;
    }

    webSocketInstance = connect(message);

    return () => {
      webSocketInstance.close();
    };
  });

  return { send, data, error };
}
