import React from 'react';

import { BinanceWSPayload } from '@/models/binance';

const AppContext = React.createContext<{
  webSocket: WebSocket | undefined;
  messages: any;
  send: (msg: BinanceWSPayload) => void;
}>(null!);
AppContext.displayName = 'AppContext';

type AppProviderProps = ChildrenProps & {
  defaultWSQueries: BinanceWSPayload;
};
export function AppProvider(props: AppProviderProps) {
  const [webSocket, setWebSocket] = React.useState<WebSocket>();
  const [messages, setMessages] = React.useState(null);
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

  React.useEffect(() => {
    let webSocketInstance: WebSocket;

    function connect(message: BinanceWSPayload) {
      const binanceWS = new WebSocket(`wss://stream.binance.com:443/ws`);
      binanceWS.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        setMessages(data);
      };
      binanceWS.onerror = (evt) => {
        console.error('WS Error', evt);
      };
      binanceWS.onopen = (evt) => {
        setWebSocket(binanceWS);
        binanceWS.send(JSON.stringify(message));
      };
      binanceWS.onclose = (evt) => {
        console.log('WS On Close result', evt);
        if (evt.code === 1008) {
          setTimeout(() => {
            let innerMessage = props.defaultWSQueries;
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
    webSocketInstance = connect(props.defaultWSQueries);

    return () => {
      webSocketInstance.close();
    };
  }, [props.defaultWSQueries]);

  const contextValue = React.useMemo(() => ({ webSocket, messages, send }), [webSocket, messages, send]);

  return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
}

export function useAppProvider() {
  const context = React.useContext(AppContext);
  if (context == null) {
    throw new Error('<AppProvider> should be defined!');
  }
  return context;
}
