// Import dependecies
import { useState, useEffect } from 'react';
import axios from 'axios';

// Import styles
import './grid.scss';

// Import components
import Node from './node.jsx'

// Component
const Grid = () => {

    // Mouse down controls
    const [mouseDown, setMouseDown] = useState(false);
    useEffect(() => {
        // Handler for mouse down
        const handleMouseDown = () => setMouseDown(true);

        // Handler for mouse up
        const handleMouseUp = () => setMouseDown(false);

        // Add event listeners
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Matrix controls
    const gridSize = 28;
    const totalNodes = gridSize * gridSize;
    const [mat, setMat] = useState(new Array(totalNodes).fill(0));
    const [number, setNumber] = useState(null);

    // Clear matrix controls
    const handleClear = (e) => {
        e.preventDefault();
        setMat(new Array(totalNodes).fill(0)); // Reset grid
        setNumber(null); // Reset number when clearing grid
    }

    // Handle node update
    const handleNodeUpdate = (idx) => {

        const clamp = (val) => {
            return Math.min(1.00, val);
        }

        
        setMat(prevMat => {
            const newMat = [...prevMat]; // Ensures trigger re-render
            
            newMat[idx] = 0.80; // Set the value of the node to 1.00
            
            // Update neighbors (left, right, up, down) if within bounds
            const firstLayer = 0.20;
            const secondLayer = 0.10;

            // Direct neighbors
            if (idx % gridSize !== 0) {  // Left neighbor
                newMat[idx - 1] = clamp(Math.max(firstLayer, prevMat[idx - 1] + firstLayer / 5));
            }
            if ((idx + 1) % gridSize !== 0) { // Right neighbor
                newMat[idx + 1] = clamp(Math.max(firstLayer, prevMat[idx + 1] + firstLayer / 5));
            }
            if (idx - gridSize >= 0) { // Top neighbor
                newMat[idx - gridSize] = clamp(Math.max(firstLayer, prevMat[idx - gridSize] + firstLayer / 5));
            }
            if (idx + gridSize < totalNodes) { // Bottom neighbor
                newMat[idx + gridSize] = clamp(Math.max(firstLayer, prevMat[idx + gridSize] + firstLayer / 5));       
            }
            // Diagonal neighbors
            if (idx - gridSize - 1 >= 0 && (idx - gridSize - 1) % gridSize !== gridSize - 1) { // Top-left neighbor
                newMat[idx - gridSize - 1] = clamp(Math.max(secondLayer, prevMat[idx - gridSize - 1] + secondLayer / 5));
            }
            if (idx - gridSize + 1 >= 0 && (idx - gridSize + 1) % gridSize !== 0) { // Top-right neighbor
                newMat[idx - gridSize + 1] = clamp(Math.max(secondLayer, prevMat[idx - gridSize + 1] + secondLayer / 5));
            }
            if (idx + gridSize - 1 < totalNodes && (idx + gridSize - 1) % gridSize !== gridSize - 1) { // Bottom-left neighbor
                newMat[idx + gridSize - 1] = clamp(Math.max(secondLayer, prevMat[idx + gridSize - 1] + secondLayer / 5));
            }
            if (idx + gridSize + 1 < totalNodes && (idx + gridSize + 1) % gridSize !== 0) { // Bottom-right neighbor
                newMat[idx + gridSize + 1] = clamp(Math.max(secondLayer, prevMat[idx + gridSize + 1] + secondLayer / 5));
            }
        
            return newMat;
        });
        
    }


    // Backend request to predict number
    const handlePredict = async (e) => {
        try {
            e.preventDefault(); // Prevent default button behavior
            const res = await axios.post('http://localhost:5000/api/predict', { mat });
            const data = res.data;
            setNumber(data.prediction);
        }
        catch (err) {
            setNumber(null); // Reset number if error occurs
            console.error('Error fetching prediction: ', err);
        }
    }

    /**Create an array of nodes
     * .from() creates a new array from an iterable object
     * '_' signifies that we are not using fist param of callback function (current element)
     * 'index' 'is the index of the current element in the array
    */
    const nodes = Array.from({ length: totalNodes }, (_, idx) => {
        return <Node key={idx} id={idx} val={mat[idx]} mouseDown={mouseDown} handleNodeUpdate={handleNodeUpdate} /> // Key is used by React to identify each node uniquely ----- Id is used for custom app logic
    });

    // Visible component
    return (
        <>
            <div className='grid' onDragStart={(e) => e.preventDefault()}>
                {nodes}
            </div>
            <div className='grid-controls'>
                <button className='btn' type='button' onClick={handleClear}>Clear</button>
                <button className='btn' type='button' onClick={handlePredict}>Calculate Number</button>
                <h2>{number ? number : ''}</h2>
          </div>
        </>
    )
}

// Export component
export default Grid;