import React from 'react';
import Button from './components/Button/button';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button btnType='primary'>Heello</Button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
