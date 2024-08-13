import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface UseSearchForGifsArgs {
    queryString?: string;
    shouldSearch?: boolean;
    resetShouldSearch?: () => void;
}

const useSearchForGifs = ({ queryString = '', shouldSearch = false, resetShouldSearch }: UseSearchForGifsArgs) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>(null);

    useEffect(() => {
        if (!queryString || !shouldSearch) return;
        const fetchData = async () => {
            const searchParams = new URLSearchParams();
            searchParams.append('api_key', process.env.REACT_APP_giphy_api_key)
            searchParams.append('q', queryString);

            try {
                setLoading(true);
                const response = await axiosInstance.get('', {
                    params: searchParams
                });
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                if (resetShouldSearch) {
                    resetShouldSearch()
                }
            }
        };

        fetchData();
    }, [queryString, shouldSearch]);

    return { data, loading, error };
};

export default useSearchForGifs;
