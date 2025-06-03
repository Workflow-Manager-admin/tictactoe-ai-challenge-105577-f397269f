import React from 'react';
import './App.css';
import TicTacToeAIContainer from './TicTacToeAIContainer';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app" style={{background: 'var(--base-dark)', minHeight: '100vh'}}>
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
          </div>
        </div>
      </nav>
      <main style={{marginTop: 80}}>
        <TicTacToeAIContainer />
      </main>
    </div>
  );
}

export default App;