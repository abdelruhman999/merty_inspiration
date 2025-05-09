import Swal from "sweetalert2";
import { Base_Url } from "../calls/constant";
import Cookies from "js-cookie";

export interface sendRequestKwargs {
    url: string;
    server?: boolean;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    params?: Record<string, string>;
    data?: BodyInit | null;
    headers?: HeadersInit;
    cache?: RequestCache;
    ignoreContentType?: boolean;
    next?: {
        revalidate: number;
    };
}

export const sendRequest = async <T>({
    url,
    server = false,
    method,
    params,
    data,
    headers,
    cache,
    next,
    ignoreContentType = false,
}: sendRequestKwargs): Promise<T> => {
    const sessionId = Cookies.get("sessionid");
    const csrfToken = Cookies.get("csrftoken");
    const mergedHeaders: HeadersInit = ignoreContentType
        ? {
              sessionid: sessionId || "",
              ...(headers || {}),
          }
        : {
              sessionid: sessionId || "",
              "Content-Type": "application/json",
              "x-csrftoken": csrfToken || "",
              ...(headers || {}),
          };
    const full_url = server ? `http://0.0.0.0:8000${url}` : `${Base_Url}${url}`;
    const response = await fetch(
        `${full_url}${
            params ? "?" + new URLSearchParams(params).toString() : ""
        }`,
        {
            method: method,
            body: data,
            headers: mergedHeaders,
            cache: cache,
            credentials: "include",
            ...next,
        }
    );
    if (!response.ok) {
        if (response.status > 199 && response.status < 400) {
            return await response.json();
        }

        if (response.status === 400) {
            const errorResponse = await response.json();
            Swal.fire({
                icon: "error",
                text: `${errorResponse.error}`,
                showConfirmButton: false,
                timer: 10000,
            });
            throw new Error(response.statusText);
        } else {
            const errorResponse = await response.json();
            // console.log('Error response:', errorResponse.error);
            Swal.fire({
                icon: "error",
                text: `${errorResponse.error}`,
                showConfirmButton: false,
                timer: 10000,
            });

            throw new Error(response.statusText);
        }
    }
    else if (response.status === 204){
        return {} as T;
    }

    return response.json();
};
