import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { Country } from '../../types/country'
import { TableComponent } from '../../components/Table'
import { handleGeneratePdf } from './useHome'
import useFetchCountries from './useFetchCountries'
interface Countries extends Country {
  selected: boolean
}

export function Home() {
  const tableDivRef = useRef(null)

  const observer = useRef<IntersectionObserver>()
  const [countriesSelected, setCountriesSelected] = useState<Countries[]>([])

  const { data, hasNextPage, isFetching, isLoading, fetchNextPage } =
    useFetchCountries()

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

  const handleSelectCountry = (countryParam: Countries) => {
    const checkIfCountryIsSelected = countriesSelected.some(
      (elem) => elem.id === countryParam.id,
    )

    if (checkIfCountryIsSelected) {
      const filteredCountries = countriesSelected.filter(
        (item) => item.id !== countryParam.id,
      )

      setCountriesSelected(filteredCountries)
    } else {
      const countryToAdd = [...new Set([...countriesSelected, countryParam])]
      setCountriesSelected(countryToAdd)
    }
  }

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
            <div data-testid="loading">
              <CircularProgress />
            </div>
          ) : (
            <List
              sx={{
                maxHeight: '350px',
                overflowY: 'scroll',
              }}
              data-testid="countriesList"
            >
              {data?.pages.map((dataPage) => {
                return dataPage.map((el) => {
                  return (
                    <div key={el.id} ref={lastElementRef}>
                      <ListItem disablePadding>
                        <ListItemButton
                          data-testid="countryItemList"
                          onClick={() => {
                            handleSelectCountry(el)
                            el.selected = !el.selected
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
                  )
                })
              })}
            </List>
          )}
        </Stack>
        <Stack width="100%">
          <Typography variant="h4" textAlign="center">
            Data
          </Typography>
          {countriesSelected?.length ? (
            <Stack ref={tableDivRef}>
              <TableComponent countriesSelected={countriesSelected} />
            </Stack>
          ) : (
            <Typography data-testid="chooseCountryMessage">
              Choose at least one country to show data
            </Typography>
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
