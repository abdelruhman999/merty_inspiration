import Cardstyle from "./CardStyle/Cardstyle";
import { Base_Url } from "../calls/constant";
import { Pagination } from "@/types/base";
import { Product } from "@/types/product";

const Products = async () => {
  const response = await fetch(`${Base_Url}/api/products?page=1&page_size=1`, {
    cache: "no-store", 
  });
  const data:Pagination<Product> = await response.json(); 
  console.log(data);
  
  return (<>
      {data.results.length > 0 ? (
        data.results.map((el:any) => (
          <Cardstyle 
            key={el.id} 
            image={el.colors[0].image} 
            name={el.name} 
            id={el.id} 
            colors={el.colors} 
            el={el}
            season={el.season.name}
            />
        ))
      ) : (
        <p>No products available</p>
      )}
  </>);
};

export default Products;
