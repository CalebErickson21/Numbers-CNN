// Import dependencies
import axios from 'axios';
import { useState } from 'react';

// Import styles
import './App.scss';

// Import components
import Node from './components/node.jsx';
import Grid from './components/grid.jsx';

// App component
function App() {

  const sendToBackend = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('http://localhost:5000/api/hello');
      console.log(response.data.message);
    } catch (error) {
      console.error('Error calling backend:', error);
    }
  };

  // Visible component
  return (
    <div className="app">
      <div className='flex-row'>
        
        <div className='flex-col left'>
          <h1>Welcome to the Numbers Prediction Machine Learning Model</h1>
          <h3>Developed By: <a href='https://caleberickson21.github.io' target='_blank'>Caleb Erickson</a></h3>
        </div>

        <div className='flex-col right'>
          <Grid />
        </div>
        
      </div>
    </div>
  );
}

export default App;
