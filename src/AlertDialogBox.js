import React from 'react';
import './AlertDialogBox.css';

const AlertDialogBox = ({ message, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p className="message-content">{message} &#128542;</p>
        <span className="close-btn" onClick={onClose}>Close</span>
      </div>
    </div>
  );
};

export default AlertDialogBox;

