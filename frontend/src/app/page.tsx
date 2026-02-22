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
  return <AVAGatewayClient />;
}
