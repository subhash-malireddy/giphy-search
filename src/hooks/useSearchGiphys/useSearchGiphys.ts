import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { GiphySearchResponse } from './types';
import { Maybe } from '../../utility/utilityTypes';

interface UseSearchForGifsArgs {
    queryString?: string;
    // shouldSearch?: boolean;
    // resetShouldSearch?: () => void;
}

const useSearchForGifs = ({ queryString = ''}: UseSearchForGifsArgs) => {
    const [giphySearchResponse, setGiphySearchResponse] = useState<Maybe<GiphySearchResponse>>(null);
    const [offset, setOffSet] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>(null);

    const searchGiphys = useCallback(async () => {
        console.log("🚀 ~ searchGiphys ~ offset:", offset)
        if (!queryString) return;
        const searchParams = new URLSearchParams();
        searchParams.append('api_key', process.env.REACT_APP_giphy_api_key)
        searchParams.append('q', queryString);
        if(offset){
            searchParams.append('offset', offset.toString());
        }

        try {
            setLoading(true);
            if(loading) return;
            // debugger;
            if(giphySearchResponse === null || giphySearchResponse?.pagination.offset !== offset) {

                const {data} = await axiosInstance.get('', {
                    params: searchParams
                });

                setGiphySearchResponse((prev) => {
                            return {
                                data: [...(prev?.data || []), ...(data.data)], 
                                meta: data.meta, 
                                pagination: data.pagination
                            }
                        });
            }

            // if(giphySearchResponse === null || (giphySearchResponse?.pagination && giphySearchResponse.pagination.offset !== data.meta.response_id)){

            //     setGiphySearchResponse((prev) => {
            //         return {
            //             data: [...(prev?.data || []), ...(data.data)], 
            //             meta: data.meta, 
            //             pagination: data.pagination
            //         }
            //     });
            // }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            // if (resetShouldSearch) {
            //     resetShouldSearch()
            // }
        }
    }, [queryString, giphySearchResponse?.data, giphySearchResponse?.meta.response_id, offset])

    useEffect(() => {
        searchGiphys();
    }, [searchGiphys]);

    const fetchMore = () => {
        setOffSet(prev => prev+50);
    }

    return { giphySearchResponse, loading, error, fetchMore } as const;
};

export default useSearchForGifs;
