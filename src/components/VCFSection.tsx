import React from "react";
import { engine } from "../audio/engine";

export const VCFSection: React.FC = () => {
  const [cutoff, setCutoff] = React.useState(2000);
  const [res, setRes] = React.useState(1);

  const handleCutoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCutoff(value);
    engine.updateVCF(value, res);
  };

  return (
    <div className="section">
      <h3>VCF</h3>
      <div className="control">
        <label>FREQ</label>
        <input
          type="range"
          min="20"
          max="10000"
          value={cutoff}
          onChange={handleCutoffChange}
        />
      </div>
    </div>
  );
};
