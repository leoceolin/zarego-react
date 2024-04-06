import { axiosMockAdapterInstance } from "./AxiosInstanceMock";
import { mockedCountries } from "./mockData";

export const requestMockGetCountries = (pageParam: number = 1, rowsParam: number = 10) => {
  return axiosMockAdapterInstance
    .onGet(`/getCountryInformation?page=${pageParam}&rows=${rowsParam}`)
    .reply(() => [
      200,
      { countries: mockedCountries, total_registers: mockedCountries.length },
    ]);
};
