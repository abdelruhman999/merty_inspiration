import { useState, useEffect, DependencyList } from 'react';
import { sendRequest, sendRequestKwargs } from '../api/index';

function useRequest<ResultsType>(reqConfig: sendRequestKwargs, dependency: DependencyList = []) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ResultsType | null>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); 
            try {
                const responseData = await sendRequest<ResultsType>({
                    ...reqConfig,
                    headers: {
                        ...reqConfig.headers,
                        "Content-Type": "application/json",
                        // "Access-Control-Allow-Origin": "*",
                    },
                });

                setData(responseData as ResultsType);
            } catch (err: unknown) {
                setError(
                    err instanceof Error 
                        ? err.message 
                        : "Error fetching data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ ...dependency]);

    return { loading, data, error , setData };
}

export default useRequest;
