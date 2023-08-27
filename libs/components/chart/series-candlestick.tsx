'use client';

import React, { ForwardedRef } from 'react';

import { ISeriesApi } from 'lightweight-charts';

import { DefaultSeriesProps, SeriesContext, useSeries } from './series.helper';

type SeriesCandlestickProps = DefaultSeriesProps<'Candlestick'> & {
  children?: React.ReactNode;
};
export const SeriesCandlestick = React.forwardRef(function SeriesCandlestick(
  props: SeriesCandlestickProps,
  forwardedRef: ForwardedRef<ISeriesApi<'Candlestick'>>
) {
  const ref = useSeries({ ...props, type: 'Candlestick' }, forwardedRef);

  return <SeriesContext.Provider value={ref.current.getInstance}>{props.children}</SeriesContext.Provider>;
});
