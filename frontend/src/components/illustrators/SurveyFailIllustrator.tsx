"use client";

import React, { useEffect, useRef } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
} from "chart.js";
import { Doughnut, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title
);

export default function SurveyFailIllustrator() {
    const wrapLabel = (str: string, maxChars: number) => {
        if (str.length <= maxChars) return str;
        const words = str.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + 1 + words[i].length <= maxChars) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#cbd5e1',
                    font: { family: "'Inter', sans-serif" }
                }
            },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#38bdf8',
                bodyColor: '#f8fafc',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 10,
            }
        }
    };

    const doughnutData = {
        labels: ['Structural Failure', 'Other Failures'],
        datasets: [{
            data: [94, 6],
            backgroundColor: ['#e879f9', '#4ade80'],
            borderColor: '#1e293b',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    const doughnutOptions = {
        ...commonOptions,
        cutout: '70%',
        plugins: {
            ...commonOptions.plugins,
            legend: {
                position: 'bottom' as const,
                labels: { color: '#cbd5e1' }
            }
        }
    };

    const barData = {
        labels: ['Leading Bias', 'Double-Barreled Logic', 'Linguistic Ambiguity'].map(l => wrapLabel(l, 16)),
        datasets: [{
            label: 'Prevalence (%)',
            data: [45, 30, 25],
            backgroundColor: ['#38bdf8', '#818cf8', '#c084fc'],
            borderRadius: 4,
            barPercentage: 0.6
        }]
    };

    const barOptions = {
        ...commonOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#334155' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#cbd5e1' }
            }
        },
        plugins: {
            ...commonOptions.plugins,
            legend: { display: false }
        }
    };

    const pieData = {
        labels: ['FMCG Sector', 'Policy Research', 'Financial Services'].map(l => wrapLabel(l, 16)),
        datasets: [{
            data: [40, 30, 30],
            backgroundColor: ['#38bdf8', '#2dd4bf', '#6366f1'],
            borderColor: '#1e293b',
            borderWidth: 2
        }]
    };

    const pieOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            legend: {
                position: 'right' as const,
                labels: { color: '#cbd5e1' }
            }
        }
    };

    return (
        <div className="bg-[#0f172a] text-[#f8fafc] font-sans antialiased overflow-x-hidden min-h-screen">
            {/* Header */}
            <header className="relative w-full py-16 px-4 md:px-8 bg-gradient-to-b from-[#0f172a] to-[#1e293b] border-b border-[#334155]">
                <div className="max-w-6xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-cyan-900/50 text-cyan-300 text-xs font-bold tracking-wider mb-4 border border-cyan-700/50">
                        INTERNAL AUDIT ARCHIVE: IA_025
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                        What <span className="text-fuchsia-400">94%</span> of Failed Surveys Have in Common
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Before they reach a single human respondent, the between 31% and 35% of research instruments have at least one design flaw.
                    </p>
                    <div className="mt-8 flex justify-center items-center space-x-2 text-sm text-slate-400">
                        <span>Source: AVA Intelligence</span>
                        <span>&bull;</span>
                        <span>N = 520 Audits</span>
                        <span>&bull;</span>
                        <span>Survey Optimization Bureau</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* SECTION 1: The Core Finding */}
                <section className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 h-full transition-all hover:translate-y-[-5px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:border-[#38bdf8] group">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b border-[#334155] pb-2">The Core Finding</h2>
                        <p className="text-slate-300 mb-6">
                            Recent internal test audits reveal a staggering reality. We reproduced and created <span className="text-1xl font-bold text-white-400">520</span> independent questionnaires. Only <span className="text-1xl font-bold text-green-400">198</span> passed our data integrity stress tests. Out of the failed surveys, <span className="text-1xl font-bold text-fuchsia-400">94%</span> contained "Adversarial Flaws" that generally produce statistical noise that can ruin the integrity of the research.
                        </p>

                        <div className="relative w-full h-[350px] flex-grow flex items-center justify-center">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-fuchsia-400">94% </span>

                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-slate-400 italic">Data Source: 520+ Institutional Research Audits</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: The "Silent Killers" */}
                <section className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col">
                    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 h-full transition-all hover:translate-y-[-5px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:border-[#38bdf8] group">
                        <h2 className="text-2xl font-bold text-fuchsia-400 mb-4 border-b border-[#334155] pb-2">The "Silent Killers"</h2>
                        <p className="text-slate-300 mb-6">
                            Three primary friction points compromise data integrity. These structural flaws corrupt respondent intent, leading to "noise" instead of "signal."
                        </p>

                        <div className="w-full h-[350px]">
                            <Bar data={barData} options={barOptions} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <div className="bg-[#0f172a] p-3 rounded border-l-2 border-cyan-500">
                                <h4 className="font-bold text-white text-sm">Leading Bias</h4>
                                <p className="text-xs text-slate-400 mt-1">Nudging answers, destroying objectivity.</p>
                            </div>
                            <div className="bg-[#0f172a] p-3 rounded border-l-2 border-fuchsia-500">
                                <h4 className="font-bold text-white text-sm">Double Logic</h4>
                                <p className="text-xs text-slate-400 mt-1">Combining issues, confusing results.</p>
                            </div>
                            <div className="bg-[#0f172a] p-3 rounded border-l-2 border-purple-500">
                                <h4 className="font-bold text-white text-sm">Ambiguity</h4>
                                <p className="text-xs text-slate-400 mt-1">Vague terms causing interpretation errors.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: The Economic Impact */}
                <section className="col-span-1 md:col-span-12 my-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">The Economic Impact</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Poor instrumentation isn't just an academic issue—it's a multi-billion dollar business risk affecting the bottom line.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: "⚠️", title: "Capital Misallocation", color: "text-red-500", border: "border-red-500/30", dev: "Millions wasted on marketing and development strategies based on skewed feedback loops and false positives." },
                            { icon: "📉", title: "Failed Launches", color: "text-orange-500", border: "border-orange-500/30", dev: "Product failures resulting from misinterpreted market trends and \"phantom\" consumer demand." },
                            { icon: "🏛️", title: "Authority Loss", color: "text-gray-400", border: "border-gray-400/30", dev: "Total degradation of trust in the intelligence unit when data fails to predict real-world outcomes." }
                        ].map((item, id) => (
                            <div key={id} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 flex flex-col items-center text-center transition-all hover:translate-y-[-5px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:border-[#38bdf8]">
                                <div className={`w-16 h-16 rounded-full bg-[#0f172a] flex items-center justify-center text-3xl mb-4 ${item.color} border ${item.border}`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-300 text-sm">{item.dev}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 4 & 5 */}
                <div className="col-span-1 md:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Audit Scope */}
                    <section className="lg:col-span-5 flex flex-col">
                        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 h-full transition-all hover:translate-y-[-5px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:border-[#38bdf8]">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b border-[#334155] pb-2">Audit Scope: Sectors</h2>
                            <p className="text-slate-300 mb-6">
                                The Bureau's investigation spanned critical sectors, proving that data fragility is a systemic issue, not a niche problem.
                            </p>

                            <div className="w-full h-[300px] flex items-center justify-center">
                                <Pie data={pieData} options={pieOptions} />
                            </div>
                        </div>
                    </section>

                    {/* The Solution */}
                    <section className="lg:col-span-7 flex flex-col">
                        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 h-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-[0_0_15px_rgba(232,121,249,0.3)] border-fuchsia-500/20 transition-all hover:translate-y-[-5px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:border-[#38bdf8]">
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#334155] pb-2">The Solution: Adversarial Auditing</h2>
                            <p className="text-slate-300 mb-8">
                                Instead of assuming clarity, AVA Intelligence deploys <strong>Synthetic Populations</strong>—AI agents calibrated to specific psychographics—to stress-test questionnaires before humans ever see them.
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-4">
                                <div className="flex-1 bg-slate-950 p-4 rounded-lg border border-slate-700 text-center relative">
                                    <div className="text-cyan-400 text-3xl mb-2">💻</div>
                                    <h4 className="font-bold text-white">Simulation</h4>
                                    <p className="text-xs text-slate-400 mt-2">Synthetic agents mimic diverse user personas.</p>
                                    <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 text-slate-500 text-xl">➔</div>
                                </div>

                                <div className="flex-1 bg-slate-950 p-4 rounded-lg border border-fuchsia-500 text-center relative">
                                    <div className="text-fuchsia-400 text-3xl mb-2">⚡</div>
                                    <h4 className="font-bold text-white">Stress Test</h4>
                                    <p className="text-xs text-slate-400 mt-2">Identify logic gaps & linguistic traps.</p>
                                    <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 text-slate-500 text-xl">➔</div>
                                </div>

                                <div className="flex-1 bg-slate-950 p-4 rounded-lg border border-green-500 text-center">
                                    <div className="text-green-400 text-3xl mb-2">📈</div>
                                    <h4 className="font-bold text-white">Correction</h4>
                                    <p className="text-xs text-slate-400 mt-2">Fix flaws while cost is zero. Launch with confidence.</p>
                                </div>
                            </div>

                            <div className="mt-8 bg-slate-950/50 p-4 rounded border border-slate-700">
                                <p className="text-center font-semibold text-cyan-300 italic">
                                    "We identify the drop-off risks and logic gaps while the cost of correction is still zero."
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h3 className="text-white font-bold mb-2">AVA Intelligence</h3>
                    <p className="text-slate-500 text-sm mb-4">Internal Audit Archive</p>
                    <p className="text-slate-600 text-xs">&copy; 2026 Survey Optimization Bureau.</p>
                </div>
            </footer>
        </div>
    );
}
