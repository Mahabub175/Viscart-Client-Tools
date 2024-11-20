import GlobalFilteredProducts from "@/components/LandingPages/Products/GlobalFilteredProducts";

const page = (param) => {
  return (
    <>
      <GlobalFilteredProducts searchParams={param?.searchParams?.filter} />
    </>
  );
};

export default page;
