import React from 'react';
import './App.css';
import GiphySearch from './components/GiphySearch';

function App() {
  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Giphy Search</h1>
      </header>

      <main className='app-main'>
        <GiphySearch />
      </main>
      <footer className='app-footer'>
        <h2>
          <span>
            Dev Contact:&nbsp;
          </span>
          <a href="mailto:subhashmalireddy@gmail.com">Subhash's Email.</a>
        </h2>
      </footer>
    </div>

  );
}

export default App;
