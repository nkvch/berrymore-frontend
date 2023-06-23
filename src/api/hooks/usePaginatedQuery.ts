import { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import useAuthenticatedQuery from "../auth/hooks/useAuthenticatedQuery";
import { PaginatedResponse, PaginationParams } from "../types/pagination";

const usePaginatedQuery = <
  T,
>(
  queryKey: QueryKey,
  queryFn: (pagParams: PaginationParams) => Promise<PaginatedResponse<T>>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<T>, Error, PaginatedResponse<T>, QueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & { initialData?: () => undefined },
) => {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const useQueryResult = useAuthenticatedQuery<PaginatedResponse<T>, Error, PaginatedResponse<T>, QueryKey>(
    [...queryKey, page, perPage],
    async () => {
      const pagParams: PaginationParams = {
        page,
        perPage
      };

      const data: PaginatedResponse<T> = await queryFn(pagParams);

      return data;
    },
    options
  );

  const hasNextPage = useMemo(() => {
    if (useQueryResult.data) {
      return useQueryResult.data.totalPages > useQueryResult.data.currentPage + 1;
    }

    return false;
  }, [useQueryResult.data]);

  const hasPreviousPage = useMemo(() => {
    if (useQueryResult.data) {
      return useQueryResult.data.currentPage > 0;
    }

    return false;
  }
    , [useQueryResult.data]);

  const isLastPage = useMemo(() => {
    if (useQueryResult.data) {
      return useQueryResult.data.currentPage === useQueryResult.data.totalPages - 1;
    }

    return false;
  }
    , [useQueryResult.data]);

  const isFirstPage = useMemo(() => {
    if (useQueryResult.data) {
      return useQueryResult.data.currentPage === 0;
    }

    return false;
  }
    , [useQueryResult.data]);

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prevPage => prevPage + 1);
    }
  }
    , [hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(prevPage => prevPage - 1);
    }
  }
    , [hasPreviousPage]);

  const goToLastPage = useCallback(() => {
    if (!isLastPage) {
      setPage(prevPage => prevPage + 1);
    }
  }
    , [isLastPage]);

  const goToFirstPage = useCallback(() => {
    if (!isFirstPage) {
      setPage(prevPage => prevPage - 1);
    }
  }
    , [isFirstPage]);

  return {
    ...useQueryResult,
    hasNextPage,
    hasPreviousPage,
    isLastPage,
    isFirstPage,
    goToNextPage,
    goToPreviousPage,
    goToLastPage,
    goToFirstPage,
    page,
    perPage,
    setPage,
    setPerPage
  };
}

export default usePaginatedQuery;
