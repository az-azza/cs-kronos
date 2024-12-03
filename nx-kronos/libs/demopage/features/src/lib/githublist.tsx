import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Suspense,
} from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { tv } from 'tailwind-variants';
import '@radix-ui/themes/styles.css';

import {
  Container,
  Spinner,
  Box,
  RadioCards,
  Flex,
  Text,
  Button,
} from '@radix-ui/themes';

import {
  useSuspenseInfiniteQuery,
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';

import { extractGHResponseHeaderLinkPagination } from '@kronos/extract-gh-response-header-link-pagination';

// import { ColorContextType, ColorContext } from '../context/ColorContext';

import { useInView } from 'react-intersection-observer';

import {
  TRepoItem,
  TQueryResult,
  EFetchSource,
  TFetchSource,
  ILoadingContext,
  IFetchSourceContext,
} from '@kronos/types';

import { KRepoCard } from '@kronos/ui';

const LoadingContext = createContext<ILoadingContext>({
  isLoading: false,
  setIsLoading: () => {
    return null;
  },
});

const FetchSourceContext = createContext<IFetchSourceContext>({
  fetchSource: EFetchSource.GHSearch,
  setFetchSource: () => {
    return null;
  },
});

const GitHubFetchListInfinite = ({ queryFunc }) => {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { ref, inView } = useInView();

  const { data, isError, error, isFetching, isPending, fetchNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['repos'],
      queryFn: queryFunc,
      getPreviousPageParam: (firstPage) => {
        return undefined;
      },
      getNextPageParam: (lastPage) => {
        return lastPage?.next ?? undefined;
      },
      initialPageParam: 0,
      maxPages: 10,
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 gap-6">
          {data &&
            data.pages &&
            data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {
                  page &&
                  page?.items:TRepoItem[] &&
                  page?.items.map((item: TRepoItem, j: number) => (
                    <KRepoCard item={item} key={j} />
                  ))}
              </React.Fragment>
            ))}
        </div>
        <div className="pt-10 pb-10" ref={ref}>
          {isLoading ? 'Updating...' : 'Done loading'}
        </div>
      </Container>
    </div>
  );
};

export const GitHubList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSource, setFetchSource] = useState<TFetchSource>(
    EFetchSource.GHSearch
  );

  const queryClient = new QueryClient();

  const queryFuncGHSearch = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<TQueryResult> => {
    const url =
      'https://api.github.com/search/repositories?q=language:typescript&sort=stars&order=desc&per_page=10' +
      `&page=${pageParam}`;
    const res = await fetch(url);
    const resj = await res.json();
    const hl = res.headers.has('link') ? res.headers.get('link') : undefined;
    return {
      ...resj,
      ...extractGHResponseHeaderLinkPagination(hl as string),
    };
  };

  const queryFuncAPIProxyTrending = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<TQueryResult> => {
    const url = 'http://localhost:3000/getGitHubTrendingDaily';
    const response = await fetch(url);
    const resj = await response.json();

    const hl = response.headers.has('link')
      ? response.headers.get('link')
      : undefined;
    return {
      ...resj,
      ...extractGHResponseHeaderLinkPagination(hl as string),
    };
  };

  const queryFuncAPIMock = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<TQueryResult> => {
    const url = 'http://localhost:3000/mockrepos';
    const response = await fetch(url);
    const resj = await response.json();

    const hl = response.headers.has('link')
      ? response.headers.get('link')
      : undefined;
    return {
      ...resj,
      ...extractGHResponseHeaderLinkPagination(hl as string),
    };
  };

  return (
    <Container>
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <FetchSourceContext.Provider value={{ fetchSource, setFetchSource }}>
          <Container>
            <Box maxWidth="100%" className="pt-10 pl-8 pr-8">
              <RadioCards.Root
                defaultValue="1"
                columns={{ initial: '1', sm: '3' }}
              >
                <RadioCards.Item
                  value="1"
                  onClick={() => {
                    setFetchSource(EFetchSource.GHSearch);
                  }}
                >
                  <Flex direction="column" width="100%">
                    <Text weight="bold" align="center">
                      Populate from GitHub Search
                    </Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item
                  value="2"
                  onClick={() => {
                    setFetchSource(EFetchSource.APIProxy);
                  }}
                >
                  <Flex direction="column" width="100%">
                    <Text weight="bold" align="center">
                      Populate from local API scrape
                    </Text>
                    <Text weight="light" align="center">
                      (needs server running)
                    </Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item
                  value="3"
                  onClick={() => {
                    setFetchSource(EFetchSource.APIMock);
                  }}
                >
                  <Flex direction="column" width="100%">
                    <Text weight="bold" align="center">
                      Populate from local API mock
                    </Text>
                    <Text weight="light" align="center">
                      (needs server running)
                    </Text>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </Box>
          </Container>
          <Container className="pt-10 pl-8 pr-8">
            <Suspense fallback={<Spinner size="3" />}>
              <QueryErrorResetBoundary>
                {({ reset }) => (
                  <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ resetErrorBoundary }) => (
                      <Container className="rt-r-max-w">
                        <Box>
                          <Text>
                            Error processing query request. Either GitHub public
                            search endpoint is limiting number of requests or
                            the dev API server is not running.
                          </Text>
                        </Box>
                        <Box className="pt-8">
                          <Button onClick={() => resetErrorBoundary()}>
                            Try again
                          </Button>
                        </Box>
                      </Container>
                    )}
                  >
                    <QueryClientProvider client={queryClient}>
                      {fetchSource === EFetchSource.GHSearch && (
                        <GitHubFetchListInfinite
                          queryFunc={queryFuncGHSearch}
                        />
                      )}

                      {fetchSource === EFetchSource.APIProxy && (
                        <GitHubFetchListInfinite
                          queryFunc={queryFuncAPIProxyTrending}
                        />
                      )}

                      {fetchSource === EFetchSource.APIMock && (
                        <GitHubFetchListInfinite queryFunc={queryFuncAPIMock} />
                      )}
                    </QueryClientProvider>
                  </ErrorBoundary>
                )}
              </QueryErrorResetBoundary>
            </Suspense>
          </Container>
        </FetchSourceContext.Provider>
      </LoadingContext.Provider>
    </Container>
  );
};

export default GitHubList;
