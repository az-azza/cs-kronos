import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Suspense,
} from 'react';
import { tv } from 'tailwind-variants';
import '@radix-ui/themes/styles.css';
import {
  Skeleton,
  Container,
  Spinner,
  Box,
  RadioCards,
  Flex,
  Text,
} from '@radix-ui/themes';

import { extractGHResponseHeaderLinkPagination } from '@kronos/extract-gh-response-header-link-pagination';

// import { ColorContextType, ColorContext } from '../context/ColorContext';

import { useInView } from 'react-intersection-observer';

import { KRepoCard } from '@kronos/ui';

import { TRepoItem } from '@kronos/types';

import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import styles from './githublist.module.css';

const LoadingContext = createContext(true);

const FetcherContext = createContext(0);

type QF = {
  items: Array<TRepoItem>;
  next: number;
  total_count: number;
};

const GitHubFetchListInfinite = ({ queryFunc }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { ref, inView } = useInView();

  const { data, error, isFetching, isPending, fetchNextPage } =
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

  if (isPending) return '';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 gap-6 p-8">
          {data &&
            data.pages &&
            data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page &&
                  page.items &&
                  page.items.map((item, j) => (
                    <KRepoCard item={item} key={j} />
                  ))}
              </React.Fragment>
            ))}
        </div>
        <div ref={ref}>{loading ? 'Updating...' : 'Done loading'}</div>
      </Container>
    </div>
  );
};

function Github() {
  //const [intervalMs, setIntervalMs] = useState(1000);
  //const { count, setCount } = useContext(CountContext);

  //const color = useContext(ColorContext);

  //const { loading, setLoading } = useContext(LoadingContext);

  const loading = false;
  const setLoading = (e) => {
    let x;
  };

  const { fetcherId, setFetcherId } = useContext(FetcherContext);

  //const [fetcherId, setFetcherId] = useState(0);

  let fetcher = undefined;

  let fid = fetcherId;

  switch (fid) {
    case 2:
      fetcher = fetch1;
      break;
    case 3:
      fetcher = fetch2;
      break;
    default:
      fetcher = fetch1;
      break;
  }

  type QF = {
    items: Array<TRepoItem>;
    next: number;
    total_count: number;
  };

  //const queryClient = useQueryClient();

  const queryFunc = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<QF> => {
    let rh = await fetch2(pageParam);
    let resp = await rh.json();

    const hl = rh.headers.has('link') ? rh.headers.get('link') : undefined;
    resp = {
      ...resp,
      ...extractGHResponseHeaderLinkPagination(hl as string),
    };
    return resp;
  };

  const { data, error, isFetching, isPending, fetchNextPage } =
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

  // useEffect(() => {
  //   if (inView) {
  //     fetchNextPage();
  //   }
  // }, [fetchNextPage, inView]);

  if (isPending) return '';

  if (error) return 'An error has occurred: ' + error.message;

  const card = tv({
    slots: {
      base: 'gap-4 bg-black-800 rounded-xl p-20',
      avatar: 'w-14 h-14 rounded-full mx-auto drop-shadow-lg',
      name: 'text-sm text-sky-500 dark:text-sky-400',
    },
    variants: {
      color: {
        option1: {
          base: 'bg-blue-100 shadow-blue-500/50',
        },
        option2: {
          base: 'bg-green-100 shadow-green-500/50',
        },
      },
    },
  });

  //const { base, avatar, name } = card({ color });

  setLoading(isFetching);

  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 gap-6 p-8">
          {data.pages.map((page) => (
            <React.Fragment key={page.next}>
              {page.items.map((item) => (
                <KRepoCard item={item} key={item.id} />
              ))}
            </React.Fragment>
          ))}
        </div>
        <div ref={ref}>{loading ? 'Updating...' : 'Done loading'}</div>
      </Container>
    </div>
  );
}

export const GitHubList = () => {
  const [loading, setLoading] = useState(false);

  const [fetcherId, setFetcherId] = useState(2);

  const queryClient = new QueryClient();

  const fixedIndicator = tv({
    slots: {
      base: 'pt-8 pl-8',
    },
  });

  const fetch1 = async (pageParam: number): Promise<Response> => {
    const url =
      'https://api.github.com/search/repositories?q=language:typescript&sort=stars&order=desc&per_page=10' +
      `&page=${pageParam}`;
    const response = await fetch(url);

    await new Promise((r) => setTimeout(r, 3000));

    return response;
  };

  const fetch2 = async (pageParam: number): Promise<Response> => {
    const url =
      'https://api.github.com/search/repositories?q=language:typescript&sort=stars&order=desc&per_page=3' +
      `&page=${pageParam}`;
    const response = await fetch(url);

    await new Promise((r) => setTimeout(r, 3000));

    return response;
  };

  const fetch3 = async (pageParam: number): Promise<Response> => {
    const url =
      'http://localhost:3000/getGitHubTrendingDaily'
      //`&page=${pageParam}`;
    const response = await fetch(url);

    await new Promise((r) => setTimeout(r, 3000));

    return response;
  };

  const queryFunc1 = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<QF> => {
    let rh = await fetch1(pageParam);
    let resp = await rh.json();

    const hl = rh.headers.has('link') ? rh.headers.get('link') : undefined;
    resp = {
      ...resp,
      ...extractGHResponseHeaderLinkPagination(hl as string),
    };
    return resp;
  };

  const queryFunc2 = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<QF> => {
    let rh = await fetch2(pageParam);
    let resp = await rh.json();

    const hl = rh.headers.has('link') ? rh.headers.get('link') : undefined;
    resp = {
      ...resp,
      ...extractGHResponseHeaderLinkPagination(hl as string),
    };
    return resp;
  };

  const queryFunc3 = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<QF> => {
    let rh = await fetch3(pageParam);
    let resp = await rh.json();

    const hl = rh.headers.has('link') ? rh.headers.get('link') : undefined;
    resp = {
      ...resp,
      ...extractGHResponseHeaderLinkPagination(hl as string),
    };
    return resp;
  };

  const changeFetchered = (id: number) => {
    setFetcherId(id);
  };

  return (
    <Container>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <FetcherContext.Provider value={{ fetcherId, setFetcherId }}>
          <Flex align="start" className={fixedIndicator().base()}>
            <Spinner loading={loading}>
              <Text>Status: Loading...</Text>
            </Spinner>
          </Flex>

          <Container>
            <Box maxWidth="100%" className="pt-10 pl-8 pr-8">
              <RadioCards.Root
                defaultValue="1"
                columns={{ initial: '1', sm: '3' }}
              >
                {/* ()=>{setFetcherId(2)} */}
                <RadioCards.Item
                  value="1"
                  onClick={() => {
                    changeFetchered(2);
                    return null;
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
                    changeFetchered(3);
                    return null;
                  }}
                >
                  <Flex direction="column" width="100%">
                    <Text weight="bold" align="center">
                      Populate from scrape proxy
                    </Text>
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item value="3" onClick={() => {
                    changeFetchered(4);
                    return null;
                  }}>
                  <Flex direction="column" width="100%">
                    <Text weight="bold" align="center">
                      Populate from API
                    </Text>
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </Box>
          </Container>

          {/* <CountDisplay /> */}
          <Suspense fallback={<Spinner size="3" />}>
            <QueryClientProvider client={queryClient}>
              {fetcherId === 2 && (
                <GitHubFetchListInfinite queryFunc={queryFunc1} />
              )}

              {fetcherId === 3 && (
                <GitHubFetchListInfinite queryFunc={queryFunc2} />
              )}

              {fetcherId === 4 && (
                <GitHubFetchListInfinite queryFunc={queryFunc3} />
              )}

              {/* <GitHubFetchListInfinite queryFunc={queryFunc2}/> */}

              {/* <Github /> */}
            </QueryClientProvider>
          </Suspense>
        </FetcherContext.Provider>
      </LoadingContext.Provider>
    </Container>
  );
};

export default GitHubList;
