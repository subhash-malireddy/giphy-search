import { useRef, useState } from "react";
import "./GiphySearch.css";
import GiphysMasonary from "./GiphysMasonary";
const GiphySearch = () => {
  const [queryString, setQueryString] = useState("");
  const [shouldSearch, setshouldSearch] = useState(false);
  const gifsGridContainer = useRef<HTMLDivElement>(null);

  const handleSearchQueryChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    e.stopPropagation();

    setQueryString(e.target.value);
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setshouldSearch(true);
  };

  const resetShouldSearch = () => {
    setshouldSearch(false);
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Find the perfect GIF to express your mood!"
          value={queryString}
          onChange={handleSearchQueryChange}
        />
        <button>Search</button>
      </form>
      <GiphysMasonary
        queryString={queryString}
        shouldSearch={shouldSearch}
        resetShouldSearch={resetShouldSearch}
      />
    </div>
  );
};

export default GiphySearch;

/**
 * 1. the most important thing is to decide how many columns you want to display on the screen based on the screen size.
 * 2. Remember the image width is 200px
 */
