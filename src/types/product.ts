////////////////////////////////////// Color  //////////////////////////////////////

export interface ShortColor {
    color: string;
    image: string;
}

export interface Color {
    id: number;
    image: string;
    color: string;
    product: number;
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
    image: string;
    colors: Color[];
    sizes: Size[];
    season: Season;
    results:[]
    product_size_colors: ProductSizeColor[];
}