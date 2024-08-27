import { useCallback, useRef, useState } from "react";
import "./GiphySearch.css";
import GiphysMasonry from "./GiphysMasonry";
const GiphySearch = () => {
  const [queryString, setQueryString] = useState("");
  const [shouldSearch, setshouldSearch] = useState(false);

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

  const resetShouldSearch = useCallback(() => {
    setshouldSearch(false);
  }, []);

  const allowSearch = useCallback(() => {
    setshouldSearch(true);
  }, []);

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
      <GiphysMasonry
        queryString={queryString}
        shouldSearch={shouldSearch}
        resetShouldSearch={resetShouldSearch}
        allowSearch={allowSearch}
      />
    </div>
  );
};

export default GiphySearch;
