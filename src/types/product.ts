////////////////////////////////////// Color  //////////////////////////////////////

export interface ShortColor {
    color: string;
    image: string;
}


interface BaseColor {
    id: number;
    color: string;
    product: number;
    name: string;
}
export interface Color extends BaseColor {
    image: string;
}
export interface ColorCreate extends BaseColor {
    image: File | null | FileList;
}

////////////////////////////////////// Size  //////////////////////////////////////

export interface ShortSize {
    size: string;
    price: number;
}

export interface Size {
    id: number;
    size: string;
    price: number;
    product: number;
}

////////////////////////////////////// Season  //////////////////////////////////////

export interface Season {
    id: number;
    name: string;
}

////////////////////////////////////// ProductSizeColor  //////////////////////////////////////

export interface ProductSizeColor {
    id: number;
    color: Color;
    size: Size; 
    stock: number;
    product: number;
    discounts:Discounts_types[]
    
}

export interface Discounts_types{
created_at: string
discount: number
end_date: string
id: number
size_color: number
start_date:string
updated_at:string
}

////////////////////////////////////// Product  //////////////////////////////////////

export interface HomeProduct {
    id: number;
    name: string;
    description: string;
    image: string;
    colors: ShortColor[];
    sizes: ShortSize[];
    season: Season;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    colors: Color[];
    sizes: Size[];
    season: Season;
    results:[]
    next:string | null
    product_size_colors: ProductSizeColor[];
    is_active: boolean;
}