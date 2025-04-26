import { DefaultOptions, QueryClient } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
