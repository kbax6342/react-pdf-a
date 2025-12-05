import logo from './logo.svg';
import './App.css';
import Checkout from './Checkout';

function App() {
  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>Buy Example Product — $20</h1>
        </header>
        <main>
          <Checkout />
        </main>
      </div>
    </div>
  );
}

export default App;
