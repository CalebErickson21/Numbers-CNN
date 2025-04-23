// Import styles
import './App.scss';

// Import components
import Node from './components/node.jsx';
import Grid from './components/grid.jsx';

// App component
function App() {

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
