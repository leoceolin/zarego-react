import { requestMockGetCountries } from "../../../mocks/mockGetCountries";
import { getCountries } from "../getCountries";

describe('CountryService', () => {
  beforeAll(() => {
    requestMockGetCountries(1, 10);
  });

  it('Should receive response with ten countries from api', async () => {
    const { data: {
      countries
    } } = await getCountries();
    expect(countries.length).toBe(10);
  });

});
