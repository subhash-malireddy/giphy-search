import { useCallback, useRef, useState } from "react";
import "./GiphySearch.css";
import GiphyMasonry from "./GiphyMasonry";
const GiphySearch = () => {
  const [queryString, setQueryString] = useState("");
  const [shouldSearch, setshouldSearch] = useState(false);

  /* istanbul ignore next*/
  const handleSearchQueryChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    e.stopPropagation();

    setQueryString(e.target.value);
  };
  /* istanbul ignore next*/
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setshouldSearch(true);
  };

  /* istanbul ignore next*/
  const resetShouldSearch = useCallback(() => {
    setshouldSearch(false);
  }, []);

  /* istanbul ignore next*/
  const allowSearch = useCallback(() => {
    setshouldSearch(true);
  }, []);

  return (
    <div className="wrapper">
      <form
        onSubmit={handleSubmit}
        className="search-form"
        name="giphy-search-form"
      >
        <input
          name="giphy-search-input"
          type="text"
          className="search-input"
          placeholder="Find the perfect GIF to express your mood!"
          value={queryString}
          onChange={handleSearchQueryChange}
          data-testid="giphy_search_input"
        />
        <button name="giphy-search-submit">Search</button>
      </form>
      <GiphyMasonry
        queryString={queryString}
        shouldSearch={shouldSearch}
        resetShouldSearch={resetShouldSearch}
        allowSearch={allowSearch}
      />
    </div>
  );
};

export default GiphySearch;
