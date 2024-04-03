
import { getCountries } from "../../services/country/getCountries"
import jsPDF from 'jspdf'

export const fetchCountries = async ({ pageParam }: { pageParam: number }) => {
  const {
    data: { countries },
  } = await getCountries(pageParam)

  const finalCountries = countries.map((el) => {
    return { ...el, selected: false }
  })
  return finalCountries
}

export const handleGeneratePdf = async (mainDivRef: React.MutableRefObject<HTMLDivElement | null>) => {
  const doc = new jsPDF('l', 'mm', [1500, 625])

  if (mainDivRef?.current) {
    doc.html(mainDivRef.current, {
      margin: [5, 5, 5, 5],
      async callback(doc) {
        await doc.save('document.pdf')
      },
    })
  }
}
