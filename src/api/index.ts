import Swal from "sweetalert2";
import { Base_Url } from "../calls/constant";
import Cookies from 'js-cookie';

export interface sendRequestKwargs {
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE",
    params?: Record<string, string>,
    data?: BodyInit | null,
    headers?: HeadersInit,
    cache?: RequestCache,
    next?: {
        revalidate: number
    }
}

export const sendRequest = async <T>({ url, method, params, data, headers, cache, next }: sendRequestKwargs): Promise<T> => {
    const sessionId = Cookies.get('sessionid');
    const mergedHeaders = {
        'Content-Type': 'application/json',
        ...headers,
        'sessionid': sessionId || ''
    };

    const response = await fetch(`${Base_Url}${url}${params ? "?" + new URLSearchParams(params).toString() : ""}`, {
        method: method,
        body: data,
        headers: mergedHeaders,
        cache: cache,
        credentials: 'include',
        ...next
    })
    if (!response.ok) {
         if (response.status > 199 && response.status < 400) {

                    return await response.json();
                }
        //  else if (response.status === 401) {
        //             Swal.fire({
        //                 icon: 'error',
        //                 text: 'الرجاء اعادة تسجيل الدخول',
        //                 showConfirmButton: false,
        //                 timer: 10000
        //             });
        //         } else if (response.status === 403) {
        //             window.location.pathname = 'dashboard';
        //         } 

                 if (response.status === 400) {
                    const errorResponse = await response.json();                    
                    Swal.fire({
                        icon: 'error',
                        text:`${errorResponse.error}`,
                        showConfirmButton: false,
                        timer: 10000
                    });
                    throw new Error(response.statusText);
                } 
                else {
                    const errorResponse = await response.json();
                    console.log('Error response:', errorResponse);
                    throw new Error(response.statusText);
                }  
    }
    console.log('Response is OK but not 2xx:', response.headers);

    return response.json();
}
