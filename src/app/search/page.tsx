'use client';
import Cardstyle from '@/component/CardStyle/Cardstyle';
import Load_search from '@/component/Load_search';
import useRequest from '@/hooks/call';
import { Product } from '@/types/product';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import Ropot from '@/component/Ropot/Ropot';



const Search = () => {
    const [value, setValue] = useState<string>('');
    const [products, setProducts] = useState<Product | null>(null);

    const { data, loading } = useRequest<Product>({
        url: '/api/products-search',
        method: 'GET',
        params: { 
            page_size:"100",
            search: value,   
        }
    }, [value]);

   
    const handleSearch = useCallback(
        debounce((searchText: string) => {
            setValue(searchText);
        }, 700), []
    );

    useEffect(() => {
        if (data) {
            console.log(data);
            setProducts(data);
        }
    }, [data]);

    return (
        <div className='flex flex-col  items-center gap-[50px]'>
            <div className="ui-input-container">
                <input
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Type something..."
                    className="ui-input"
                    type="text"
                />
                <div className="ui-input-underline"></div>
                <div className="ui-input-highlight"></div>
                <div className="ui-input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            stroke="currentColor"
                            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                        ></path>
                    </svg>
                </div>
            </div>

            <div className='flex gap-[20px] flex-wrap'>
                {loading ?
                    <div className='pt-[100px]'>
                        <Load_search />
                    </div>
                    :
                        products &&
                        products.results.map((el: any) => (
                            <Cardstyle
                                key={el.id}
                                image={el.image}
                                name={el.name}
                                id={el.id}
                                colors={el.colors}
                                el={el}
                                season={el.season.name}
                            />
                        ))
                      
                }
            </div>
            {
            !loading && products && products.results.length === 0 &&
                <Ropot/>
          
            }
        </div>
    );
}

export default Search;
