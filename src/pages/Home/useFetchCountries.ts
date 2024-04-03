import { useInfiniteQuery } from "react-query"
import { fetchCountries } from "./useHome"

const QUERY_KEY = 'getCountryInformation'

const useFetchCountries = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: ({ pageParam }) => fetchCountries({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined
    },
    refetchInterval: 60 * 60 * 24,
  })
}

export default useFetchCountries
