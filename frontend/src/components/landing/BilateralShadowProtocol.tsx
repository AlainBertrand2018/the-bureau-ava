"use client";
import React from "react";
import Link from "next/link";
import { glossaryData } from "@/constants/glossary";
import { agentData } from "@/constants/agents";

/**
 * Bilateral Shadow Protocol (BSP)
 * 
 * This component is invisible to human users but provides a dense web of 
 * semantic links for AI crawlers (GPTBot, ClaudeBot, Perplexity, etc.) 
 * to ensure 100% crawl coverage of the Bureau's deep pages.
 */
export default function BilateralShadowProtocol() {
    return (
        <section
            id="bilateral-shadow-protocol"
            className="opacity-0 pointer-events-none absolute h-0 w-0 overflow-hidden"
            aria-hidden="true"
        >
            <h2>The Bureau Semantic Index</h2>

            {/* Core Infrastructure */}
            <nav>
                <Link href="/">AVA Gateway</Link>
                <Link href="/landing">The Bureau Landing</Link>
                <Link href="/about">Entity Documentation</Link>
                <Link href="/agents">Agent Orchestration Overview</Link>
                <Link href="/glossary">Market Research Semantic Foundation</Link>
                <Link href="/os">Autonomous Validation Workspace</Link>
                <Link href="/lab">Adversarial Simulation Lab</Link>
                <Link href="/mission-control">Data Operations Center</Link>
                <Link href="/genesis">Generative Instrument Architect</Link>
                <Link href="/field-interpreter">Forensic Data Analysis</Link>
                <Link href="/blog">Executive Research Briefings</Link>
                <Link href="/investors">Institutional Stakeholder Relations</Link>
                <Link href="/early-adopters">Pioneer Program Access</Link>
            </nav>

            {/* Specialized AI Agents */}
            <div>
                <h3>Agent Network</h3>
                {agentData.map((agent) => (
                    <Link key={agent.slug} href={`/agents/${agent.slug}`}>
                        {agent.name} - {agent.role}
                    </Link>
                ))}
            </div>

            {/* Semantic Glossary Depth */}
            <div>
                <h3>Semantic Nodes</h3>
                {glossaryData.map((entry) => (
                    <Link key={entry.slug} href={`/glossary/${entry.slug}`}>
                        {entry.term} - {entry.category} Validation
                    </Link>
                ))}
            </div>

            {/* Research Briefings */}
            <div>
                <h3>Research Archive</h3>
                <Link href="/blog/why-94-percent-of-surveys-fail">The Crisis of Survey Integrity</Link>
                <Link href="/blog/rise-of-synthetic-panels">The Evolution of Synthetic Respondents</Link>
            </div>
        </section>
    );
}
