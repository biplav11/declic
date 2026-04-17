import { getBodyTypes, getBrands } from "@/utlls/request";
import { Gap } from "@/components/Utility";
import Brands from "./(components)/Brands";
import SearchBox from "./(components)/SearchBox";
import UsedCarsList from "./(components)/UsedCarsList";
import { usedCars } from "@/utlls/data";

export const metadata = {
  title: 'Declic Car | Magazine sénégalais " Automobile & Lifestyle "',
  description: 'Declic Car | Magazine sénégalais " Automobile & Lifestyle "',
  openGraph: {
    siteName: "Declic Car",
    title: 'Declic Car | Magazine sénégalais " Automobile & Lifestyle "',
    description: 'Declic Car | Magazine sénégalais " Automobile & Lifestyle "',
    images: [
      {
        url: "https://presse.porsche.de/prod/presse_pag/PressBasicData.nsf/6C533F53C4948848C125880900444D67/$File/2022_911_Sport_Classic.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "https://presse.porsche.de/prod/presse_pag/PressBasicData.nsf/6C533F53C4948848C125880900444D67/$File/2022_911_Sport_Classic.jpg",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    type: "website",
    url: "https://declicweb.web.app/",
    locale: "en_US",
  },
};

const Index = async () => {
  let brands = await getBrands(50);
  let bodyTypes = await getBodyTypes();

  const brandsTitle = {
    title: "Search Your Dream Car",
    subtitle: "There are over 300+ brands to choose form",
    hideLink: true,
  };

  const usedCarsTitle = {
    title: "From Our Selection",
    subtitle: "Here are some of the featured cars in different categories",
  };

  return (
    <>
      <Gap height={30} />
      <UsedCarsList {...{ usedCars, usedCarsTitle }} />
      <Gap />
      <Brands {...{ brands, brandsTitle }} />
      <Gap />
      <SearchBox {...{ bodyTypes }} />
      <Gap />
    </>
  );
};

export default Index;
