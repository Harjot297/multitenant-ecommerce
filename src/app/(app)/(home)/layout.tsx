import configPromise from "@payload-config";
import { getPayload } from "payload";

import Footer from "./Footer";
import Navbar from "./Navbar";
import SearchFilters from "./search-filters";
import { Category } from "@/payload-types";
import { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    pagination : false,
    depth: 1, // populate the subcategories , subcategories.[0] will be of type "Category"
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name"
  });

  const formattedData : CustomCategory[] = data.docs.map( (doc) => ({
    ...doc,
    subcategories : (doc.subcategories?.docs ?? []).map( (doc) => ({
      // Because of depth : "1" , we are confident "doc" will be of type Category
      ...(doc as Category),
      subcategories : undefined,
    }))
  }));

  console.log("Formatted Data", formattedData);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
