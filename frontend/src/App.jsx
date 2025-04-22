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

  const [clear, setClear] = useState(false);
  const handleClear = (e) => {
    e.preventDefault();
    setClear(true);
  }


  // Visible component
  return (
    <div className="app">
      <div className='flex-row'>
        
        <div className='flex-col left'>
          <h1>Welcome to the Numbers Prediction Machine Learning Model</h1>
          <h3>Developed By: <a href='https://caleberickson21.github.io' target='_blank'>Caleb Erickson</a></h3>
        </div>

        <div className='flex-col right'>
          <div className='grid-container'>
            <Grid clear={clear} setClear={setClear}/>
          </div>
          <div className='grid-controls'>
            <button className='btn' type='button' onClick={handleClear}>Clear</button>
            <button className='btn' type='button'>Calculate Number</button>
            <h3>NUMBER</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
