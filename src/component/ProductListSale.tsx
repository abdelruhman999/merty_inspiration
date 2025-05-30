'use client'
import { RootState } from '@/redux/store';
import { useEffect, type FC } from 'react';
import { useSelector } from 'react-redux';
import Cardstyle from './CardStyle/Cardstyle';

interface ProductListSaleProps {
  
}

const ProductListSale: FC<ProductListSaleProps> = () => {
 
        const {items} = useSelector((state: RootState) => state.counterTow);
        useEffect(()=>{
          console.log(items);
          
        })
        return (<>
          {items.length > 0 ? (
            items.map((el: any) =>
              el.colors.length > 0 ? (
                <Cardstyle
                  key={el.id}
                  image={el.colors[0].image}
                  name={el.name}
                  id={el.id}
                  colors={el.colors}
                  el={el}
                  season={el.season.name}
                />
              ) : null
            )
          ) :
             <div className="text-center p-8 text-gray-500">
              <i className="text-4xl mb-4">📭</i>
              <h2 className="text-xl font-semibold">مافيش عروض حالياً</h2>
              <p className="text-sm mt-2">تابعنا دايمًا، العروض بترجع كل فترة 😉</p>
             </div>
          
          
          }
        </>);
    
}

export default ProductListSale;
