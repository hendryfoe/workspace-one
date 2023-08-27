export function timeToTz(originalTime: number, timeZone: string) {
  const zonedDate = new Date(new Date(originalTime).toLocaleString('en-US', { timeZone }));
  return zonedDate.getTime();
}

export function parseQueryStringFromURL(url: string): Record<string, any> {
  return Object.fromEntries(new URL(url).searchParams.entries());
}

export function toQueryString(queryStringObject: URLSearchParamsArg): string {
  if (queryStringObject == null || Object.keys(queryStringObject).length === 0) {
    return '';
  }

  const params = new URLSearchParams(queryStringObject);

  for (const [key, value] of [...Array.from(params)]) {
    if (value === 'undefined' || value === 'null') {
      params.delete(key);
    }
  }

  return `${params.toString()}`;
}

export function buildURL(url: string, params?: URLSearchParamsArg): string {
  const queryString = toQueryString(params);

  if (queryString == null || queryString === '') {
    return url;
  }

  return url + (url.indexOf('?') === -1 ? '?' : '&') + queryString;
}

export function padLeft(value: unknown, length: number, fillString: string = ' ') {
  if (value == null || fillString === '') {
    return value;
  }

  let stringValue = String(value) as string;

  while (stringValue.length !== length) {
    stringValue = `${fillString}${stringValue}`;
  }

  return stringValue;
}

export function formatSimpleCurrency(value: string, maximumFractionDigits = 2) {
  return formatCurrency(Number(value), {
    locales: 'en-US',
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits
  });
}

export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions & { locales: string | string[] } = {
    locales: 'en-US',
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }
) {
  const { locales, ...numberFormatOptions } = options;
  return new Intl.NumberFormat(locales, numberFormatOptions).format(value);
}

export function formatSimpleDate(date: Date) {
  const parts = formatDateToParts(date, { month: '2-digit' });

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatSimpleDatetime(date: Date) {
  const parts = formatDateToParts(date, {
    hour12: false,
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return `${parts.year}/${parts.month}/${parts.day} ${parts.hour === '24' ? '00' : parts.hour}:${parts.minute}:${
    parts.second
  }`;
}

export function formatSimpleTime(date: Date) {
  const parts = formatDateToParts(date, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return `${parts.hour === '24' ? '00' : parts.hour}:${parts.minute}:${parts.second}`;
}

export function formatDateToParts(date: Date, opts: Intl.DateTimeFormatOptions = {}) {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    ...opts
  };
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
  const dateParts = {} as Record<Exclude<Intl.DateTimeFormatPartTypes, 'literal'>, string>;
  parts
    .filter(({ type }) => type !== 'literal')
    .forEach((p) => {
      const type = p.type as Exclude<Intl.DateTimeFormatPartTypes, 'literal'>;
      dateParts[type] = p.value;
    });

  return dateParts;
}
