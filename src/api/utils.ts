import {Base_Url} from "../calls/constant";

export const serve = (url:string)=>{
    if(!url.startsWith("http") && Base_Url === ""){
       return `https://merty-inspiration.com${url}`
    }    
    return `${url}`
}