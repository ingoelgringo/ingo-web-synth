import { useState } from "react";
import "./styles/variables.css";
import "./styles/global.css";
import * as Tone from "tone";
import { engine } from "./audio/engine";
import { useKeyboard } from "./hooks/useKeyboard";
import { SynthPanel } from "./components/SynthPanel";

function App() {
  const [started, setStarted] = useState(false);
  useKeyboard(started);

  const handleStart = async () => {
    await engine.start();
    Tone.getTransport().start();
    setStarted(true);
  };

  return (
    <div className="App">
      {!started ? (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ccc", letterSpacing: "2px" }}>INGO-60</h1>
          <button
            onClick={handleStart}
            style={{
              padding: "15px 30px",
              fontSize: "1.2rem",
              background: "#d94e4e",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            POWER ON
          </button>
        </div>
      ) : (
        <SynthPanel />
      )}
    </div>
  );
}

export default App;

//  ▗▄▄▄▖▗▖  ▗▖ ▗▄▄▖ ▗▄▖     ▗▄▄▄▖▗▖        ▗▄▄▖▗▄▄▖ ▗▄▄▄▖▗▖  ▗▖ ▗▄▄▖ ▗▄▖
//    █  ▐▛▚▖▐▌▐▌   ▐▌ ▐▌    ▐▌   ▐▌       ▐▌   ▐▌ ▐▌  █  ▐▛▚▖▐▌▐▌   ▐▌ ▐▌
//    █  ▐▌ ▝▜▌▐▌▝▜▌▐▌ ▐▌    ▐▛▀▀▘▐▌       ▐▌▝▜▌▐▛▀▚▖  █  ▐▌ ▝▜▌▐▌▝▜▌▐▌ ▐▌
//  ▗▄█▄▖▐▌  ▐▌▝▚▄▞▘▝▚▄▞▘    ▐▙▄▄▖▐▙▄▄▖    ▝▚▄▞▘▐▌ ▐▌▗▄█▄▖▐▌  ▐▌▝▚▄▞▘▝▚▄▞▘
