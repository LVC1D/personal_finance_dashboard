import PropTypes from 'prop-types';
import '../styles/Modal.css';

export default function UserModal({isVisible, onClose, children}) {
    
    if (!isVisible) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}

// Add 'onClose' to props validation
UserModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};