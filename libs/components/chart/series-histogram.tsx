'use client';

import React, { ForwardedRef } from 'react';

import { ISeriesApi, SeriesType } from 'lightweight-charts';

import { DefaultSeriesProps, SeriesContext, useSeries } from './series.helper';

type SeriesHistogramProps = DefaultSeriesProps<'Histogram'> & {
  children?: React.ReactNode;
};
export const SeriesHistogram = React.forwardRef(function SeriesHistogram(
  props: SeriesHistogramProps,
  forwardedRef: ForwardedRef<ISeriesApi<'Histogram'>>
) {
  const ref = useSeries({ ...props, type: 'Histogram' }, forwardedRef as ForwardedRef<ISeriesApi<SeriesType>>);

  return <SeriesContext.Provider value={ref.current.getInstance}>{props.children}</SeriesContext.Provider>;
});
