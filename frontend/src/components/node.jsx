// Include styles
import './node.scss';

// Component
const Node = ({ id, val, mouseDown, handleNodeUpdate }) => {

    // Handle mouse down effect
    const handleEnter = () => {
        if (mouseDown) {
            handleNodeUpdate(id);
        }
    }

    const handleClick = () => {
        handleNodeUpdate(id);
    }

    const getNodeClass = () => {
        if (val === 0.00) { return 'node inactive';}
        if (val === 0.50) { return 'node active-low'; }
        if (val === 1.00) { return 'node active-high'; }
    }

    // Visible component
    return (
        <div id={'node_' + id} className={getNodeClass()} onMouseDown={handleClick} onMouseEnter={handleEnter} onDragStart={(e) => e.preventDefault()}></div>
    )

};

// Export component
export default Node;