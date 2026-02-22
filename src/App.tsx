import { useState } from "react";
import "./JunoStyles.css";
import * as Tone from "tone";
import { engine } from "./audio/engine";
import { ArpSection } from "./components/ArpSection";
import { LFOSection } from "./components/LFOSection";
import { DCOSection } from "./components/DCOSection";
import { VCFSection } from "./components/VCFSection";
import { ADSRSection } from "./components/ADSRSection";
import { ChorusSection } from "./components/ChorusSection";
import { useKeyboard } from "./hooks/useKeyboard";
import { KeyboardSection } from "./components/KeyboardSection";

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
        <div className="main-container">
          <div className="juno-logo-bar">
            <span className="juno-subtitle">
              PROGRAMMABLE POLYPHONIC SYNTHESIZER
            </span>{" "}
            INGO-60
          </div>

          <div className="juno-panel">
            //* LFO / CONTROLS SECTION
            <div className="juno-section juno-section-arp">
              <div className="juno-header juno-header-L">ARPEGGIO</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <ArpSection />
              </div>
            </div>
            //* LFO SECTION
            <div className="juno-section">
              <div className="juno-header juno-header-C">LFO</div>
              <LFOSection />
            </div>
            //* DCO SECTION
            <div className="juno-section">
              <div className="juno-header juno-header-C">DCO</div>
              <DCOSection />
            </div>
            //* VCF SECTION
            <div className="juno-section">
              <div className="juno-header juno-header-C">VCF</div>
              <VCFSection />
            </div>
            //* VCA/ENV SECTION
            <div className="juno-section">
              <div className="juno-header juno-header-C">VCA / ENV</div>
              <ADSRSection />
            </div>
            //* CHORUS SECTION
            <div className="juno-section juno-section-chorus">
              <div className="juno-header juno-header-R">CHORUS</div>
              <ChorusSection />
            </div>
          </div>
          <KeyboardSection />
        </div>
      )}
    </div>
  );
}

export default App;
