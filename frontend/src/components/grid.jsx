// Import dependecies
import { useState, useEffect, use } from 'react';

// Import styles
import './grid.scss';

// Import components
import Node from './node.jsx'

// Component
const Grid = ({ clear, setClear}) => {

    // States
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

    // Variable declarations
    const gridSize = 28;
    const totalNodes = gridSize * gridSize;

    const [mat, setMat] = useState(new Array(totalNodes).fill(0));

    const handleNodeUpdate = (idx) => {
        setMat(prevMat => {
            const newMat = [...prevMat];

            if (!clear) {
                newMat[idx] = 1.00; // Set the value of the node to 1.00

                // Update neighbors (left, right, up, down) if within bounds
                if (idx % gridSize !== 0) {  // Left neighbor
                    newMat[idx - 1] = Math.max(0.50, prevMat[idx - 1]); // Ensure it doesn't go below 0.50
                }
                if ((idx + 1) % gridSize !== 0) { // Right neighbor
                    newMat[idx + 1] = Math.max(0.50, prevMat[idx + 1]); // Ensure it doesn't go below 0.50
                }
                if (idx - gridSize >= 0) { // Top neighbor
                    newMat[idx - gridSize] = Math.max(0.50, prevMat[idx - gridSize]); // Ensure it doesn't go below 0.50
                }
                if (idx + gridSize < totalNodes) { // Bottom neighbor
                    newMat[idx + gridSize] = Math.max(0.50, prevMat[idx + gridSize]); // Ensure it doesn't go below 0.50            }
                }
            }
            return newMat;
        });
    }

    // Clear matrix controls
    const handleMatClear = () => {
        setMat(new Array(totalNodes).fill(0));
        handleNodeUpdate(0); // Update first node to trigger re-render    
    }
    useEffect(() => {
        if (clear) {
            handleMatClear();
            setClear(false); // Reset clear state to false after clearing
        }
    } , [clear]); // Run when clear state changes
    

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
        <div className="grid">
            {nodes}
        </div>
    )
}

// Export component
export default Grid;