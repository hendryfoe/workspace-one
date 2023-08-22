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
  if (value == null) {
    return value;
  }

  let stringValue = String(value) as string;

  while (stringValue.length !== length) {
    stringValue = `${fillString}${stringValue}`;
  }

  return stringValue;
}

export function chunk<T = unknown>(data: T[], size: number) {
  const length = Math.ceil(data.length / size);
  let index = 0;
  let result = [] as T[][];

  while (result.length !== length) {
    const chunkData = data.slice(index, index + size);
    index += size;
    result.push(chunkData);
  }

  return result;
}

export function numberFormat(value: string | number, delimiter = ',') {
  return value.toString().replace(/(\d)(?=(\d{3})+\b)/g, `$1${delimiter}`);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
