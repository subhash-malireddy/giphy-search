import { MouseEventHandler, useRef, useState } from 'react';
import './GiphySearch.css'
import GiphysMasonary from './GiphysMasonary';
const GiphySearch = () => {

    const [queryString, setQueryString] = useState('');
    const [shouldSearch, setshouldSearch] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const triggerSearch: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();

        setQueryString(inputRef.current.value);
        setshouldSearch(true);
    }

    const resetShouldSearch = () => {
        setshouldSearch(false);
    }


    return (
        < div className='wrapper'>
            <div className='search-form'>
                <input type="text" className="search-input" placeholder='Find the perfect GIF to express your mood!' ref={inputRef} />
                <button onClick={triggerSearch}>Search</button>
            </div>
            <GiphysMasonary queryString={queryString} shouldSearch={shouldSearch} resetShouldSearch={resetShouldSearch} />
        </div>
    )
}

export default GiphySearch;