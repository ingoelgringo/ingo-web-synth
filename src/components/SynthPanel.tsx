import React from "react";
import "../styles/SynthPanel.css";
import { ArpSection } from "./ArpSection";
import { LFOSection } from "./LFOSection";
import { DCOSection } from "./DCOSection";
import { VCFSection } from "./VCFSection";
import { ADSRSection } from "./ADSRSection";
import { ChorusSection } from "./ChorusSection";
import { KeyboardSection } from "./KeyboardSection";

export const SynthPanel: React.FC = () => {
  return (
    <div className="main-container">
      <div className="juno-logo-bar">
        <span className="juno-subtitle">
          PROGRAMMABLE POLYPHONIC SYNTHESIZER
        </span>{" "}
        INGO-60
      </div>

      <div className="juno-panel">
        {/* ARP SECTION */}
        <div className="juno-section juno-section-arp">
          <div className="juno-header juno-header-L">ARPEGGIO</div>
          <ArpSection />
        </div>
        {/* LFO SECTION */}
        <div className="juno-section">
          <div className="juno-header juno-header-C">LFO</div>
          <LFOSection />
        </div>
        {/* DCO SECTION */}
        <div className="juno-section">
          <div className="juno-header juno-header-C">DCO</div>
          <DCOSection />
        </div>
        {/* VCF SECTION */}
        <div className="juno-section">
          <div className="juno-header juno-header-C">VCF</div>
          <VCFSection />
        </div>
        {/* VCA/ENV SECTION */}
        <div className="juno-section">
          <div className="juno-header juno-header-C">VCA / ENV</div>
          <ADSRSection />
        </div>
        {/* CHORUS SECTION */}
        <div className="juno-section juno-section-chorus">
          <div className="juno-header juno-header-R">CHORUS</div>
          <ChorusSection />
        </div>
      </div>
      <KeyboardSection />
      <p
        style={{
          color: "#888",
          fontSize: "0.75rem",
          margin: "10px 0 0 0",
        }}
      >
        * Chrome seems to have issues playing multiple notes simultaneously
      </p>
    </div>
  );
};
