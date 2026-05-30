import { defineConfig } from 'orval';

export default defineConfig({
  verdictApi: {
    input: {
      target: 'http://localhost:3001/api/docs/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/endpoints.ts',
      schemas: 'src/api/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      baseUrl: {
        runtime: 'process.env.NEXT_PUBLIC_API_URL',
      },
      override: {
        query: {
          useQuery: true,
          useMutation: true,
          useSuspenseQuery: false,
          shouldExportQueryKey: true,
        },
        fetch: {
          forceSuccessResponse: true,
        },
      },
    },
  },
});
