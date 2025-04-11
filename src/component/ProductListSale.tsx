import { RootState } from '@/redux/store';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import Cardstyle from './CardStyle/Cardstyle';

interface ProductListSaleProps {}

const ProductListSale: FC<ProductListSaleProps> = () => {
 
        const {items} = useSelector((state: RootState) => state.counterTow);
   
        return (<>
            {items.length > 0 && (
              items.map((el:any,index) => (
                <Cardstyle 
                  key={index} 
                  image={el.colors[0].image} 
                  name={el.name} 
                  id={el.id} 
                  colors={el.colors} 
                  el={el}
                  season={el.season.name}
                  />
              ))
            )}
        </>);
    
}

export default ProductListSale;
