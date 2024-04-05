import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  TableCell,
} from '@mui/material'
import { TableCellCustom } from './styles'
import { Country } from '../../types/country'

const TABLE_HEADERS = [
  'Country',
  'Performance',
  'Autocratic',
  'Decisive',
  'Diplomatic',
  'Face Saver',
]

interface Countries extends Country {
  selected: boolean
}

interface ITable {
  countriesSelected: Countries[]
}
export function TableComponent({ countriesSelected }: ITable) {
  return (
    <TableContainer
      data-testid="tableContainer"
      component={Paper}
      sx={{ border: '1px solid black' }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ background: 'black' }}>
          <TableRow>
            {TABLE_HEADERS.map((tableHeader) => (
              <TableCell
                key={tableHeader}
                align="center"
                sx={{
                  color: 'white',
                  borderRightStyle: 'solid',
                  borderRightColor: 'gray',
                  borderRightWidth: '1px',
                }}
              >
                {tableHeader}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {countriesSelected.map((el) => (
            <TableRow data-testid="tableRow" key={el.id}>
              <TableCellCustom>{el.CountryName}</TableCellCustom>
              <TableCellCustom>{el.PerformanceOriented}</TableCellCustom>
              <TableCellCustom>{el.Autocratic}</TableCellCustom>
              <TableCellCustom>{el.Decisive}</TableCellCustom>
              <TableCellCustom>{el.Diplomatic}</TableCellCustom>
              <TableCellCustom>{el.FaceSaver}</TableCellCustom>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
