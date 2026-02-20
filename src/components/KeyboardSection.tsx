import React, { useState, useEffect } from "react";
import "../KeyboardStyles.css"; // Import the new style

export const KeyboardSection: React.FC = () => {
  return (
    <div className="keyboard-section">
      <div className="keyboard-container">
        {/* Keyboard keys would be rendered here */}
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key"></div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key"></div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key"></div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key"></div>{" "}
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">E</div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key">
          <div className="keyboard-key-black"></div>
        </div>
        <div className="keyboard-key"></div>{" "}
        <div className="keyboard-key"></div>{" "}
      </div>
    </div>
  );
};
