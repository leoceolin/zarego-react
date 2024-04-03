import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Button,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { useInfiniteQuery } from 'react-query'
import { Country } from '../../types/country'
import { TableComponent } from '../../components/Table'
import { fetchCountries, handleGeneratePdf } from './useHome'

const QUERY_KEY = 'getCountryInformation'

interface Countries extends Country {
  selected: boolean
}

export function Home() {
  const tableDivRef = useRef(null)

  const observer = useRef<IntersectionObserver>()
  const [countryId, setCountryId] = useState('')
  const [allCountries, setAllCountries] = useState<Countries[]>([])
  const [countriesSelected, setCountriesSelected] = useState<Countries[]>([])

  const { data, hasNextPage, isFetching, isLoading, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [QUERY_KEY],
      queryFn: ({ pageParam }) => fetchCountries({ pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined
      },
      refetchInterval: 60 * 60 * 24,
    })

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [hasNextPage, isFetching, isLoading, fetchNextPage],
  )

  const handleSelectCountry = (countryIdParam: string) => {
    setCountryId(countryIdParam)
    setAllCountries(
      allCountries.map((item) =>
        item.id === countryIdParam
          ? { ...item, selected: !item.selected }
          : item,
      ),
    )
  }

  const countries = useMemo(() => {
    return data?.pages.reduce((_, page) => {
      return [...allCountries, ...page]
    }, [])
  }, [data])

  useEffect(() => {
    if (countries) {
      setAllCountries(countries)
    }
  }, [countries])

  useEffect(() => {
    if (countryId) {
      allCountries.forEach((item) => {
        if (item.id === countryId && item.selected) {
          const countryToAdd = [...new Set([...countriesSelected, item])]
          setCountriesSelected(countryToAdd)
        } else if (item.id === countryId) {
          const countryToRemove = countriesSelected.filter(
            (item) => item.id !== countryId,
          )
          setCountriesSelected(countryToRemove)
        }
      })
    }
  }, [allCountries, countryId])

  return (
    <Stack>
      <Stack
        sx={{
          flexDirection: { sm: 'column', md: 'row' },
        }}
        justifyContent="space-between"
        gap={8}
      >
        <Stack sx={{ minWidth: '250px' }}>
          <Typography variant="h4" pb={2}>
            Choose country
          </Typography>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <List
              sx={{
                maxHeight: '350px',
                overflowY: 'scroll',
              }}
            >
              {allCountries?.map((el) => (
                <div key={el.id} ref={lastElementRef}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleSelectCountry(el.id)
                      }}
                      sx={{
                        border: '1px solid black',
                        background: el.selected ? '#ADD8E6' : 'white',
                      }}
                    >
                      <ListItemText primary={el.CountryName} />
                    </ListItemButton>
                  </ListItem>
                </div>
              ))}
            </List>
          )}
        </Stack>
        <Stack width="100%">
          <Typography variant="h4" textAlign="center">
            Data
          </Typography>
          {countriesSelected.length ? (
            <Stack ref={tableDivRef}>
              <TableComponent countriesSelected={countriesSelected} />
            </Stack>
          ) : (
            <Typography>Choose at least one country to show data</Typography>
          )}
        </Stack>
      </Stack>
      <Stack
        sx={{
          alignItems: { sm: 'center', md: 'flex-end' },
        }}
      >
        <Stack alignItems="center">
          <Button
            onClick={() => {
              handleGeneratePdf(tableDivRef)
            }}
            sx={{ flexDirection: 'column' }}
          >
            <Typography>Download PDF</Typography>
            <DownloadIcon fontSize="large" />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
