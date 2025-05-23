import Cardstyle from "./CardStyle/Cardstyle";
import { Base_Url } from "../calls/constant";
import { Pagination } from "@/types/base";
import { Product } from "@/types/product";
import { sendRequest } from "../api";

const Products = async () => {
  const response = await sendRequest<Pagination<Product>>({
    url:'/api/products',
    server:true,
    method:'GET',
    params:{
      page:"1",
      page_size:"10"
    },
    // next:{
    //   revalidate:60
    // }

  });
  const data:Pagination<Product> = response; 
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
