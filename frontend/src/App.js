// Import dependencies
import axios from 'axios';
import { useState, useEffect } from 'react';

// Import styles
import './App.css';

// App component
function App() {

  const [text, setText] = useState('Blank');

  const sendToBackend = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('http://localhost:5000/api/hello');
      setText(response.data.message);
    } catch (error) {
      setText('Error');
      console.error('Error calling backend:', error);
    }
  };


  // Visible component
  return (
    <div className="App">
      <button onClick={(e) => sendToBackend(e)}>Send to Backend</button>
      <h1>{text}</h1>
    </div>
  );
}

export default App;
