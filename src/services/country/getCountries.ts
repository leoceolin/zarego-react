import { AxiosResponse } from "axios";
import AxiosInstance from "../AxiosInstance";
import { Country } from "../../types/country";

interface IResponseGetCountries {
  countries: Country[];
  total_registers: number;
}

export const getCountries = async (
  page: number = 1,
  rows: number = 10
): Promise<AxiosResponse<IResponseGetCountries>> => {

  return AxiosInstance.get(`getCountryInformation?page=${page}&rows=${rows}`);
};
