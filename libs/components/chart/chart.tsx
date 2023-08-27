'use client';

import React, { ForwardedRef } from 'react';

import { ChartOptions, DeepPartial, IChartApi } from 'lightweight-charts';

import { ChartContainerProps, ChartContext, createChartContainerInstance, createChartContextRef } from './chart.helper';

export type ChartProps = ChildrenProps & {
  options: DeepPartial<ChartOptions>;
};

export const Chart = React.forwardRef(function Chart(props: ChartProps, forwardRef: ForwardedRef<IChartApi>) {
  const [container, setContainer] = React.useState<HTMLDivElement>();
  const handleRef = React.useCallback((ref: HTMLDivElement) => {
    setContainer(ref);
  }, []);

  return (
    <div ref={handleRef}>
      {container && (
        <ChartContainer ref={forwardRef} options={props.options} container={container}>
          {props.children}
        </ChartContainer>
      )}
    </div>
  );
});

export const ChartContainer = React.forwardRef<IChartApi, ChartContainerProps>(
  function ChartContainer(props, forwardRef) {
    const ref = React.useRef(
      createChartContextRef(
        () => createChartContainerInstance(props),
        (instance) => {
          instance.remove();
        }
      )
    );

    React.useLayoutEffect(() => {
      const currentRef = ref.current;
      ref.current.init();

      return () => {
        currentRef.remove();
      };
    }, []);

    React.useLayoutEffect(() => {
      ref.current.getInstance().update(props.options);
    }, [props.options]);

    React.useImperativeHandle(forwardRef, () => ref.current.getInstance().getInstance(), []);

    return <ChartContext.Provider value={ref.current.getInstance}>{props.children}</ChartContext.Provider>;
  }
);
