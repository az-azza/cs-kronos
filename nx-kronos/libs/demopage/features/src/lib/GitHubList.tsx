import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Suspense,
  useRef,
} from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useInView } from 'react-intersection-observer';

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

import ky from 'ky';

import { extractGHResponseHeaderLinkPagination } from '@kronos/util';

// import { ColorContextType, ColorContext } from '../context/ColorContext';

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

const GitHubFetchListInfinite = ({
  queryKey,
  queryFunc,
}: {
  queryKey: [string, number] | [string];
  queryFunc: any;
}) => {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { ref, inView } = useInView();
  const stargazersMinMax = useRef({});

  const { data, isFetching, fetchNextPage } = useSuspenseInfiniteQuery({
    queryKey: queryKey,
    queryFn: queryFunc,
    getPreviousPageParam: (firstPage) => {
      return undefined;
    },
    getNextPageParam: (lastPage: { next: number; items: [] }) => {
      return lastPage?.next ?? undefined;
    },
    initialPageParam: 0,
    maxPages: 10,
  });

  // const calcMinMaxGazers = (data:InfiniteData) => {
  //   const collectAll = Array<TRepoItem>;
  //   data.pages.map((page) => {
  //   page.items.map((item: TRepoItem) => {
  //       collectAll.push(item);
  //     });
  //   });

  //   const min = collectAll.reduce((v, item) => {
  //     return item.stargazers_count < v ? item.stargazers_count : v;
  //   }, collectAll[0].stargazers_count);
  //   const max = collectAll.reduce((v, item) => {
  //     return item.stargazers_count > v ? item.stargazers_count : v;
  //   }, collectAll[0].stargazers_count);
  //   return { min, max };
  // };

  // useEffect(() => {
  //   stargazersMinMax.current = calcMinMaxGazers(data);
  // }, [data]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching, setIsLoading]);

  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 gap-6">
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.items.map((item: TRepoItem, j: number) => (
                <KRepoCard
                  item={item}
                  key={j}
                />
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
    const res = await ky(url);
    const resj = await res.json<TQueryResult>();

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
    const response = await ky(url);
    const response_json = await response.json<TQueryResult>();

    const headers_link = response.headers.has('link')
      ? response.headers.get('link')
      : undefined;
    return {
      ...response_json,
      ...extractGHResponseHeaderLinkPagination(headers_link as string),
    };
  };

  const queryFuncAPIMock = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<TQueryResult> => {
    const url = 'http://localhost:3000/mockrepos';
    const response = await ky(url);
    const response_json = await response.json<TQueryResult>();

    const headers_link = response.headers.has('link')
      ? response.headers.get('link')
      : undefined;
    return {
      ...response_json,
      ...extractGHResponseHeaderLinkPagination(headers_link as string),
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
                          queryKey={[EFetchSource.GHSearch]}
                          queryFunc={queryFuncGHSearch}
                        />
                      )}

                      {fetchSource === EFetchSource.APIProxy && (
                        <GitHubFetchListInfinite
                          queryKey={[EFetchSource.APIProxy]}
                          queryFunc={queryFuncAPIProxyTrending}
                        />
                      )}

                      {fetchSource === EFetchSource.APIMock && (
                        <GitHubFetchListInfinite
                          queryKey={[EFetchSource.APIMock]}
                          queryFunc={queryFuncAPIMock}
                        />
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
