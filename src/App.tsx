import React from "react";
import "./App.css";
import GiphySearch from "./components/GiphySearch";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Giphy Search</h1>
      </header>

      <main className="app-main">
        <ErrorBoundary
          fallback={
            <>
              Something wen wrong while showing the search results 😢. Please
              refresh and try or contact developer.
            </>
          }
        >
          <GiphySearch />
        </ErrorBoundary>
        <ToastContainer
          position="bottom-right"
          stacked
          pauseOnHover={false}
          autoClose={3000}
        />
      </main>
      <footer className="app-footer">
        <h2>
          <span>Dev Contact:&nbsp;</span>
          <a href="mailto:subhashmalireddy@gmail.com">Subhash's Email.</a>
        </h2>
      </footer>
    </div>
  );
}

export default App;
