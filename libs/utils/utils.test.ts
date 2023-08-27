import { formatSimpleCurrency, formatSimpleDatetime, formatSimpleTime, padLeft, timeToTz } from './utils';

describe('Utils', () => {
  describe('timeToTz function', () => {
    const testsData = [
      {
        params: {
          timestamp: Date.UTC(2023, 0, 1, 0, 0, 0, 0),
          timezone: 'Asia/Jakarta'
        },
        expected: 1672556400000
      },
      {
        params: {
          timestamp: Date.UTC(2023, 0, 1, 0, 0, 0, 0),
          timezone: 'Europe/London'
        },
        expected: 1672531200000
      }
    ];

    testsData.forEach(({ params, expected }, i) => {
      it(`should get timeToTz successfully - ${i + 1}`, () => {
        const result = timeToTz(params.timestamp, params.timezone);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('padLeft function', () => {
    const testsData = [
      {
        params: {
          value: '1',
          length: 3,
          fillString: ' '
        },
        expected: '  1'
      },
      {
        params: {
          value: '1',
          length: 3,
          fillString: '0'
        },
        expected: '001'
      },
      {
        params: {
          value: '1',
          length: 3,
          fillString: ''
        },
        expected: '1'
      }
    ];

    testsData.forEach(({ params, expected }, i) => {
      it(`should get padLeft successfully - ${i + 1}`, () => {
        const result = padLeft(params.value, params.length, params.fillString);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('formatSimpleCurrency function', () => {
    const testsData = [
      {
        params: {
          value: '10000.0111',
          maximumFractionDigits: 3
        },
        expected: '10,000.011'
      },
      {
        params: {
          value: '10000.011',
          maximumFractionDigits: 2
        },
        expected: '10,000.01'
      }
    ];

    testsData.forEach(({ params, expected }, i) => {
      it(`should get formatSimpleCurrency successfully - ${i + 1}`, () => {
        const result = formatSimpleCurrency(params.value, params.maximumFractionDigits);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('formatSimpleDatetime function', () => {
    const testsData = [
      {
        params: new Date('2023-01-01T00:00:00Z'),
        expected: '2023/01/01 00:00:00'
      },
      {
        params: new Date('2023-01-01T20:00:00Z'),
        expected: '2023/01/01 20:00:00'
      },
      {
        params: new Date('2023-01-01T02:00:00Z'),
        expected: '2023/01/01 02:00:00'
      }
    ];

    testsData.forEach(({ params, expected }, i) => {
      it(`should get formatSimpleDatetime successfully - ${i + 1}`, () => {
        const result = formatSimpleDatetime(params);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('formatSimpleTime function', () => {
    const testsData = [
      {
        params: new Date('2023-01-01T00:00:00'),
        expected: '00:00:00'
      },
      {
        params: new Date('2023-01-01T20:00:00'),
        expected: '20:00:00'
      },
      {
        params: new Date('2023-01-01T02:00:00'),
        expected: '02:00:00'
      }
    ];

    testsData.forEach(({ params, expected }, i) => {
      it(`should get formatSimpleTime successfully - ${i + 1}`, () => {
        const result = formatSimpleTime(params);
        expect(result).toEqual(expected);
      });
    });
  });
});
