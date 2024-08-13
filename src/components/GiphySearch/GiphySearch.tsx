import { useState } from 'react';
import './GiphySearch.css'
import useSearchForGifs from '../../hooks/useSearchForGifs';
const GiphySearch = () => {

    const [queryString, setQueryString] = useState('');
    const [shouldSearch, setshouldSearch] = useState(false);

    const handleSearchQueryChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.stopPropagation();

        setQueryString(e.target.value);
    }
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        setshouldSearch(true);
    }

    const resetShouldSearch = () => {
        setshouldSearch(false);
    }

    const { data, loading, error } = useSearchForGifs({ queryString, shouldSearch, resetShouldSearch });

    if (loading) return <>`loading...`</>
    if (error) return <>`error: ${error.message}`</>

    if (data) console.log(data)

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit} className='search-form'>
                <input type="text" className="search-input" placeholder='Find the perfect GIF to express your mood!' value={queryString} onChange={handleSearchQueryChange} />
                <button>Search</button>
            </form>
            <div className='search-output-wrapper'>
                {
                    data && queryString && <h3>Search results for <em>{`${queryString}`}</em></h3>
                }
            </div>
        </div>
    )
}

export default GiphySearch;

/**
 * 1. 
 */