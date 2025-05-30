'use client';
import { RootState } from '@/redux/store';
import {  useEffect, type FC } from 'react';
import { useSelector } from 'react-redux';
import Cardstyle from './CardStyle/Cardstyle';
import Loadercom from './Loadercom';

interface ProductsList {}


const ProductsList : FC<ProductsList> = () => {
    const items = useSelector((state: RootState) => state.data.items);
    useEffect(()=>{
      console.log(items);
     
    },[items])
  
   return (
  <>
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
    ) : (
      <Loadercom/>
    )}
  </>
);
}


export default ProductsList ;
