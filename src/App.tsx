import { useState } from "react";
import { engine } from "./audio/engine";
import { VCFSection } from "./components/VCFSection";
import { DCOSection } from "./components/DCOSection";
import { ADSRSection } from "./components/ADSRSection";
import { ChorusSection } from "./components/ChorusControls";
import { useKeyboard } from "./hooks/useKeyboard";
import { ArpSection } from "./components/ArpSection";
import { HoldButton } from "./components/HoldButton";

function App() {
  const [started, setStarted] = useState(false);

  useKeyboard(started);

  const handleStart = async () => {
    await engine.start();
    setStarted(true);
  };

  const playTestNote = () => {
    if (!started) return;
    engine.playNote("C3");
  };

  const stopTestNote = () => {
    if (!started) return;
    engine.stopNote("C3");
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        backgroundColor: "#222",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1>JUNO-60 Web Synth</h1>

      {!started ? (
        <button
          onClick={handleStart}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          START ENGINE
        </button>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {/* Vänster sektion */}
            <div style={{ display: "flex", gap: "10px" }}>
              <HoldButton />
              <ArpSection />
            </div>
            <DCOSection />
            <div
              style={{
                border: "1px solid #444",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <VCFSection />
            </div>
            <ADSRSection />
            <ChorusSection /> {/* Lägg till Chorus här */}
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              onMouseDown={playTestNote}
              onMouseUp={stopTestNote}
              onMouseLeave={stopTestNote}
              style={{
                padding: "20px 40px",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              PLAY C3
            </button>
            <p>
              Klicka och håll för att höra ljudet samtidigt som du drar i
              VCF-reglaget.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
