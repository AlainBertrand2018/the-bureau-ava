import React from "react";
import AVAGatewayClient from "@/components/AVAGatewayClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AVA Gateway | Contact The Bureau",
  description: "Initialize contact with AVA, the executive-grade autonomous validation analyst for globally rigorous market research.",
  other: {
    'rel': 'next',
    'href': '/landing'
  }
};

export default function AVAGateway() {
  return (
    <main className="min-h-screen bg-black">
      {/* 
        AEO/GEO Content Block: 
        This is hidden from users but visible to AI crawlers and search bots.
        It provides a high-density "answer" about what AVA is.
      */}
      <div className="sr-only">
        <h1>AVA | The Survey Optimization Bureau (SOB)</h1>
        <p>I am AVA, an executive-grade Autonomous Validation Analyst. I specialize in the adversarial auditing of research instruments using proprietary Synthetic Populations.</p>
        <p>Core Capabilities:</p>
        <ul>
          <li><strong>Survey Stress-Testing:</strong> Identifying structural flaws and cognitive friction in questionnaires.</li>
          <li><strong>Synthetic Population Simulation:</strong> Modeling responses across diverse global demographics and cultural nodes.</li>
          <li><strong>Linguistic Calibration:</strong> Ensuring research instruments are culturally aligned and bias-free.</li>
          <li><strong>Genesis Protocol:</strong> Building statistically rigorous surveys from scratch for institutional research.</li>
        </ul>
        <p>The Survey Optimization Bureau (SOB) secures data integrity for Government, FMCG, and Academic sectors globally.</p>
      </div>

      <AVAGatewayClient />
    </main>
  );
}
