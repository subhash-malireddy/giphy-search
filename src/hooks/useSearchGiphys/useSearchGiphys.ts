import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { GiphySearchResponse } from './types';
import { Maybe } from '../../utility/utilityTypes';

interface UseSearchForGifsArgs {
    queryString?: string;
    shouldSearch?: boolean;
    resetShouldSearch?: () => void;
}

const useSearchForGifs = ({ queryString = '', shouldSearch = false, resetShouldSearch }: UseSearchForGifsArgs) => {
    const [response, setResponse] = useState<Maybe<GiphySearchResponse>>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>(null);

    useEffect(() => {
        const searchGiphys = async () => {
            if (!queryString || !shouldSearch) return;
            const searchParams = new URLSearchParams();
            searchParams.append('api_key', process.env.REACT_APP_giphy_api_key)
            searchParams.append('q', queryString);

            try {
                setLoading(true);
                const response = await axiosInstance.get('', {
                    params: searchParams
                });
                setResponse(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                if (resetShouldSearch) {
                    resetShouldSearch()
                }
            }
        };

        searchGiphys();
    }, [queryString, shouldSearch]);

    return { response, loading, error };
};

export default useSearchForGifs;
