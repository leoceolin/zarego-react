import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import { QueryClient, QueryClientProvider } from 'react-query'
import { render, screen, fireEvent } from '@testing-library/react'
import { Home } from '..'
import { mockedCountries } from '../../../mocks/mockData'
import useFetchCountries from '../useFetchCountries'
import { handleGeneratePdf } from '../useHome'

const queryClient = new QueryClient()
const mockedQuery = useFetchCountries as jest.Mock<any>
const mockedUseHome = handleGeneratePdf as jest.Mock<any>

jest.mock('../useFetchCountries')
jest.mock('../useHome')

const mockIntersectionObserver = jest.fn()

describe('Home', () => {
  function createComponent() {
    return (
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver

    mockedQuery.mockImplementation(() => ({
      status: 'success',
      data: {
        pages: [mockedCountries],
      },
      hasNextPage: true,
      isFetching: false,
      isLoading: false,
    }))
  })

  it('Should call function to generate PDF', () => {
    render(<Home />)
    const downloadButton = screen.getByTestId('downloadPDFButton')
    fireEvent.click(downloadButton)
    expect(mockedUseHome).toHaveBeenCalled()
  })

  it('Should render loading component when query is fetching api data', async () => {
    mockedQuery.mockImplementation(() => ({
      isLoading: true,
    }))

    render(createComponent())

    const loadingComponent = screen.getByTestId('loading')

    expect(loadingComponent).toBeInTheDocument()
  })

  it('Should render list component after query finish fetch api data', async () => {
    render(createComponent())

    const listCountriesComponent = screen.getByTestId('countriesList')
    const chooseCountryMessage = screen.getByTestId('chooseCountryMessage')
    const countriesItemList = screen.getAllByTestId('countryItemList')

    expect(listCountriesComponent).toBeInTheDocument()
    expect(chooseCountryMessage).toBeInTheDocument()
    expect(chooseCountryMessage.textContent).toBe(
      'Choose at least one country to show data',
    )
    expect(countriesItemList.length).toBe(10)
  })

  it('Should render country table after user select country', async () => {
    render(createComponent())

    const countriesItemList = screen.getAllByTestId('countryItemList')
    fireEvent.click(countriesItemList[0])

    const tableContainer = screen.getByTestId('tableContainer')
    expect(tableContainer).toBeInTheDocument()

    const tableRows = screen.getAllByTestId('tableRow')
    expect(tableRows.length).toBe(1)

    expect(countriesItemList[0]).toHaveStyle('background: #ADD8E6')
  })

  it('Should remove country from table after user select country to be removed', async () => {
    render(createComponent())

    const countriesItemList = screen.getAllByTestId('countryItemList')
    fireEvent.click(countriesItemList[0])
    fireEvent.click(countriesItemList[1])
    fireEvent.click(countriesItemList[2])

    const tableContainer = screen.getByTestId('tableContainer')
    expect(tableContainer).toBeInTheDocument()

    const tableRows = screen.getAllByTestId('tableRow')
    expect(tableRows.length).toBe(3)

    fireEvent.click(countriesItemList[1])

    const tableRowsAfterRemove = screen.getAllByTestId('tableRow')
    expect(tableRowsAfterRemove.length).toBe(2)
  })
})
