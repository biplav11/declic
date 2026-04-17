import Slider from "@/app/(index)/Slider";
import SearchBox from "@/app/(index)/SearchBox";
import Brands from "@/app/(index)/Brands";
import NewCars from "@/app/(index)/NewCars";
import BlogCardList from "@/app/(index)/BlogCardsList";
import UsedCars from "@/app/(index)/UsedCars";
import { Container, Gap } from "@/components/Utility";
import { getAllModels, getBodyTypes, getBrands, getLatestModels, getSliders } from "@/utlls/request";
import { newsData as blogs, usedCars } from "@/utlls/data";
import { Magazine } from "@/components/Common";

export const dynamic = "force-dynamic";

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
  const [sliders, bodyTypes, brands, models, latestModels] = await Promise.all([
    getSliders(),
    getBodyTypes(),
    getBrands(300),
    getAllModels(),
    getLatestModels(8),
  ]);

  const brandTitle = {
    title: "Search Your Dream Car",
    subtitle: "There are over 300+ brands to choose form",
  };

  const newCarsTitle = {
    title: "Recently Launched Cars",
    subtitle: "The 8 newest models in our catalogue",
  };

  const blogTitle = {
    title: "From the Desk",
    subtitle: "Explore our latest news and articles ",
  };

  const usedCarsTitle = {
    title: "From Our Selection",
    subtitle: "Here are some of the featured cars in different categories",
  };

  return (
    <>
      <Container>
        <Slider {...{ sliders }} />
      </Container>
      <Gap />
      <SearchBox {...{ bodyTypes, brands, models }} />
      <Gap />
      <Brands {...{ brands, brandTitle }} />
      <Gap />
      <NewCars models={latestModels} newCarsTitle={newCarsTitle} />
      <Gap />
      <BlogCardList {...{ blogs, blogTitle }} />
      <Gap />
      <Magazine />
      <Gap />
      <UsedCars {...{ usedCars, usedCarsTitle }} />
      <Gap />
    </>
  );
};

export default Index;
