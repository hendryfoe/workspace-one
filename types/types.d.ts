declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_API_URL: string;
  }
}

type ErrorApiResponse = {
  status: number;
  message: string;
  sessionExpired?: boolean;
};

type ApiResponse<T = any> = {
  error?: ErrorApiResponse;
  session?: Session;
  data?: T;
};

type URLSearchParamsArg = ConstructorParameters<typeof URLSearchParams>[0];
type FetchInitRequest = RequestInit & { query?: URLSearchParamsArg };

interface ChildrenProps {
  children: React.ReactNode;
}
