
import type { FC } from 'react';
import { redirect } from 'next/navigation';


export const metadata = {
    title: "Home Prodcut",
    description: "This is the home page of the website", 
  }
  
interface productProps {}

const product: FC<productProps> = ({}:productProps) => {
  return redirect('/home');// redirect('/home')
}

export default product;
