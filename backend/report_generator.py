import datetime
from typing import Dict, Any, List


class BureauReportGenerator:
    """
    AVA Global Reporting Engine.
    Generates premium, print-ready HTML dossiers from raw data.
    Designed to be opened in any browser and printed directly to PDF via Ctrl+P.
    """

    @staticmethod
    def generate_dossier(data: Dict[str, Any], report_type: str = "GENESIS") -> str:
        timestamp = data.get("timestamp", datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"))
        certified_by = data.get("certified_by", "AVA Lead Architect v2.0")
        doc_id = f"{abs(hash(timestamp)) % 100000000:08d}"

        # ── Build instrument rows ──
        instrument = data.get("instrument", [])
        justifications = data.get("simulation_report", {}).get("question_justifications", [])
        
        questions_html = ""
        for i, q in enumerate(instrument):
            meta_html = ""
            if i < len(justifications):
                j = justifications[i]
                rel = j.get("relevance_to_objective", "N/A")
                trust = j.get("psychometric_trustworthiness") or j.get("design_rationale", "N/A")
                meta_html = f"""
                <div class="q-meta">
                    <div class="meta-item"><strong>STRATEGIC RELEVANCE:</strong> {rel}</div>
                    <div class="meta-item"><strong>SCIENTIFIC VALIDITY:</strong> {trust}</div>
                </div>"""

            questions_html += f"""
            <tr>
                <td class="q-num">{i + 1:02d}</td>
                <td class="q-text">
                    {q}
                    {meta_html}
                </td>
            </tr>"""

        # ── Build field manual ──
        manual = data.get("field_manual", {})
        bp_html = ""
        for bp in manual.get("deployment_best_practices", []):
            bp_html += f"<li>{bp}</li>"

        # ── Build simulation summary ──
        sim = data.get("simulation_report", {})
        sim_html = ""
        if sim:
            next_steps_html = ""
            for step in sim.get("next_steps", []):
                next_steps_html += f"<li>{step}</li>"

            demo_html = ""
            for insight in sim.get("demographic_insights", []):
                demo_html += f"""
                <div class="demo-item">
                    <strong>{insight.get('segment', '')}</strong>
                    <p>{insight.get('finding', '')}</p>
                </div>"""

            sim_html = f"""
            <section class="section">
                <h2>IV. Predictive Stress-Test Validation (n=5)</h2>
                <div class="risk-badge">{sim.get('overall_risk_level', 'VALIDATED')}</div>
                <p class="summary-text">{sim.get('executive_summary', '')}</p>

                <h3>Redressment Actions Taken</h3>
                <ol class="steps-list">{next_steps_html}</ol>

                <h3>Demographic Lens Findings</h3>
                <div class="demo-grid">{demo_html}</div>
            </section>
            """

        # ── Scientific Disclosure ──
        disclosure = manual.get("scientific_disclosure", "Built on Psychometric Measurement Theory and Agent-Based Modeling.")

        # ── Build Strategic Rationale ──
        rationale = data.get("strategic_rationale", "")

        # ── Build Universalized Grounding (New Granular Stats) ──
        dossier = data.get("mission", {}).get("dossier", {})
        grounding_html = ""
        if dossier:
            econ = dossier.get("economics", {})
            edu = dossier.get("education", {})
            tech = dossier.get("technology", {})
            
            grounding_html = f"""
            <section class="section">
                <h2>II. Universalized Market Grounding</h2>
                <div class="grounding-grid">
                    <div class="grounding-card">
                        <h3>Economics & Fiscal Landscape</h3>
                        <p><strong>Macro Indicators:</strong> {econ.get('macro_indicators', 'N/A')}</p>
                        <p><strong>Salary Benchmarks:</strong> {econ.get('salary_ranges', 'N/A')}</p>
                        <p><strong>Gender Revenue Parity:</strong> {econ.get('gender_revenue_parity', 'N/A')}</p>
                        <p><strong>Budgetary Decisions:</strong> {econ.get('budgetary_decisions', 'N/A')}</p>
                    </div>
                    <div class="grounding-card">
                        <h3>Educational Fidelity</h3>
                        <p><strong>Literacy Levels:</strong> {edu.get('literacy_levels', 'N/A')}</p>
                        <p><strong>Attainment:</strong> {edu.get('educational_attainment', 'N/A')}</p>
                    </div>
                    <div class="grounding-card">
                        <h3>Technological Adoption</h3>
                        <p><strong>Adoption Metrics:</strong> {tech.get('adoption_metrics', 'N/A')}</p>
                        <p><strong>Digital Literacy:</strong> {tech.get('tech_literacy', 'N/A')}</p>
                    </div>
                </div>
                
                <h3>Cultural Axioms & Taboos</h3>
                <div class="tag-cloud">
                    {' '.join([f'<span class="tag">{t}</span>' for t in dossier.get("cultural_axioms", [])])}
                    {' '.join([f'<span class="tag taboo">{t}</span>' for t in dossier.get("taboos", [])])}
                </div>
            </section>
            """

        # ── Full HTML Document ──
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bureau Genesis Report — {doc_id}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            line-height: 1.7;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}

        .container {{
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 48px;
        }}

        /* ── Header ── */
        .header {{
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding-bottom: 40px;
            margin-bottom: 48px;
        }}

        .header .org {{
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: #3b82f6;
            margin-bottom: 8px;
        }}

        .header h1 {{
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -0.02em;
            color: #ffffff;
            margin-bottom: 24px;
        }}

        .meta-row {{
            display: flex;
            justify-content: center;
            gap: 32px;
            font-size: 10px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }}

        .meta-row span {{
            color: #94a3b8;
        }}

        /* ── Sections ── */
        .section {{
            margin-bottom: 48px;
        }}

        .section h2 {{
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #3b82f6;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(59,130,246,0.15);
        }}

        .section h3 {{
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #64748b;
            margin-top: 28px;
            margin-bottom: 12px;
        }}

        .summary-text {{
            font-size: 14px;
            font-weight: 400;
            color: #cbd5e1;
            line-height: 1.8;
            margin-bottom: 16px;
        }}

        /* ── Questions Table ── */
        .q-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }}

        .q-table tr {{
            border-bottom: 1px solid rgba(255,255,255,0.04);
        }}

        .q-table tr:hover {{
            background: rgba(255,255,255,0.02);
        }}

        .q-num {{
            width: 40px;
            padding: 14px 12px;
            font-size: 10px;
            font-weight: 900;
            color: rgba(59,130,246,0.4);
            vertical-align: top;
            text-align: right;
        }}

        .q-text {{
            padding: 14px 16px;
            font-size: 13px;
            font-weight: 500;
            color: #e2e8f0;
            line-height: 1.6;
        }}

        /* ── Best Practices ── */
        .bp-list {{
            list-style: none;
            padding: 0;
        }}

        .bp-list li {{
            padding: 10px 0;
            font-size: 13px;
            font-weight: 500;
            color: #cbd5e1;
            border-bottom: 1px solid rgba(255,255,255,0.04);
        }}

        .bp-list li::before {{
            content: "\2022";
            color: #3b82f6;
            font-weight: 900;
            margin-right: 12px;
        }}

        /* ── Risk Badge ── */
        .risk-badge {{
            display: inline-block;
            padding: 4px 16px;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            border-radius: 100px;
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.2);
            margin-bottom: 16px;
        }}

        /* ── Simulation Steps ── */
        .steps-list {{
            padding-left: 20px;
        }}

        .steps-list li {{
            padding: 6px 0;
            font-size: 12px;
            color: #94a3b8;
            font-weight: 500;
        }}

        /* ── Demographics Grid ── */
        .demo-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 12px;
        }}

        .demo-item {{
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 16px;
        }}

        .demo-item strong {{
            font-size: 11px;
            font-weight: 700;
            color: #3b82f6;
            display: block;
            margin-bottom: 4px;
        }}

        .demo-item p {{
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
        }}

        /* ── Footer ── */
        .footer {{
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding-top: 32px;
            margin-top: 48px;
        }}

        .footer .seal {{
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: #10b981;
            margin-bottom: 8px;
        }}

        .footer .org-footer {{
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #475569;
        }}

        .disclosure {{
            margin-top: 32px;
            padding: 20px;
            background: rgba(16, 185, 129, 0.05);
            border: 1px solid rgba(16, 185, 129, 0.1);
            border-radius: 12px;
        }}

        .disclosure p {{
            font-size: 9px;
            font-weight: 600;
            color: #10b981;
            letter-spacing: 0.1em;
            line-height: 1.8;
            text-transform: uppercase;
        }}

        .grounding-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }

        .grounding-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
        }

        .grounding-card h3 {
            margin-top: 0 !important;
            color: #10b981 !important;
            border: none !important;
        }

        .grounding-card p {
            font-size: 11px;
            color: #94a3b8;
            margin-bottom: 8px;
            line-height: 1.5;
        }

        .grounding-card strong {
            color: #e2e8f0;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }

        .tag {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            font-size: 9px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .tag.taboo {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #f87171;
        }

        /* ── Print Styles ── */
        @media print {{
            .grounding-card {{ background: #f8fafc; border-color: #e2e8f0; }}
            .grounding-card p {{ color: #475569; }}
            .grounding-card strong {{ color: #0f172a; }}
            .tag {{ background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }}
            .tag.taboo {{ background: #fef2f2; border-color: #fecaca; color: #b91c1c; }}
        }}

            .container {{
                padding: 40px 32px;
            }}

            .header {{
                border-bottom-color: #e2e8f0;
            }}

            .header h1 {{
                color: #0f172a;
            }}

            .meta-row span {{
                color: #475569;
            }}

            .section h2 {{
                color: #1e40af;
                border-bottom-color: #dbeafe;
            }}

            .q-text {{
                color: #1e293b;
            }}

            .q-table tr {{
                border-bottom-color: #f1f5f9;
            }}

            .summary-text {{
                color: #334155;
            }}

            .bp-list li {{
                color: #334155;
                border-bottom-color: #f1f5f9;
            }}

            .steps-list li {{
                color: #475569;
            }}

            .demo-item {{
                border-color: #e2e8f0;
                background: #f8fafc;
            }}

            .demo-item p {{
                color: #475569;
            }}

            .footer {{
                border-top-color: #e2e8f0;
            }}

            .disclosure {{
                background: #f0fdf4;
                border-color: #bbf7d0;
            }}

            .disclosure p {{
                color: #166534;
            }}
        }}
        .q-meta {{
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px dashed rgba(255,255,255,0.1);
            font-size: 11px;
            color: #94a3b8;
        }}
        .meta-item {{ margin-bottom: 4px; }}
        .meta-item strong {{ color: #10b981; font-size: 9px; letter-spacing: 0.1em; margin-right: 6px; }}
        .legal-links {{ margin-top: 16px; font-size: 9px; color: #334155; letter-spacing: 0.05em; }}
        @media print {{
            .q-meta {{ border-top-color: #e2e8f0; color: #475569; }}
            .meta-item strong {{ color: #15803d; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <p class="org">Survey Optimization Bureau</p>
            <h1>Bureau-Certified Research Instrument</h1>
            <div class="meta-row">
                <div>Document <span>{doc_id}</span></div>
                <div>Certified by <span>{certified_by}</span></div>
                <div>Generated <span>{timestamp}</span></div>
            </div>
        </header>

        <section class="section">
            <h2>I. Strategic Rationale</h2>
            <p class="summary-text">{rationale}</p>
        </section>

        {grounding_html}

        <section class="section">
            <h2>III. Research Instrument ({len(instrument)} Items)</h2>
            <table class="q-table">
                {questions_html}
            </table>
        </section>

        <section class="section">
            <h2>III. Field Manual</h2>
            <h3>Deployment Best Practices</h3>
            <ul class="bp-list">{bp_html}</ul>

            <h3>Predicted Data Outcomes</h3>
            <p class="summary-text">{manual.get('potential_outcomes', 'N/A')}</p>
        </section>

        {sim_html}

        <section class="section">
            <h2>V. Scientific Disclosure</h2>
            <div class="disclosure">
                <p>{disclosure}</p>
            </div>
        </section>

        <footer class="footer">
            <p class="seal">AVA Certified — Bureau Gold Standard</p>
            <p class="org-footer">Survey Optimization Bureau — Secure Document</p>
            <div class="legal-links">
                [PRIVACY POLICY] &nbsp;&bull;&nbsp; [TERMS OF SERVICE] &nbsp;&bull;&nbsp; [RESEARCH COMPLIANCE]
            </div>
        </footer>
    </div>
</body>
</html>"""

        return html

    @staticmethod
    def generate_field_instrument(data: Dict[str, Any]) -> str:
        """
        Generates a clean, high-contrast Field Instrument for pen-and-paper data collection.
        Optimised for clipboard use and optical character recognition (OCR) readiness.
        """
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d")
        instrument = data.get("instrument", [])
        doc_id = f"FIELD-{abs(hash(timestamp)) % 10000:04d}"

        q_html = ""
        for i, q in enumerate(instrument):
            q_html += f"""
            <div class="field-item">
                <div class="field-num">Q{i + 1}</div>
                <div class="field-content">
                    <p class="q-text">{q}</p>
                    <div class="response-area">
                        <!-- Interactive inputs for hybrid online/offline use -->
                        <div class="checkbox-row"><span class="box"></span> <input type="text" class="response-line" /></div>
                        <div class="checkbox-row"><span class="box"></span> <input type="text" class="response-line" /></div>
                        <div class="checkbox-row"><span class="box"></span> <input type="text" class="response-line" /></div>
                        <div class="checkbox-row"><span class="box"></span> <input type="text" class="response-line" /></div>
                        <div class="checkbox-row"><span class="box"></span> <input type="text" class="response-line" /></div>
                    </div>
                </div>
            </div>"""

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Field Instrument {doc_id}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {{ font-family: 'Inter', sans-serif; background: #fff; color: #000; line-height: 1.4; }}
        .container {{ max-width: 800px; margin: 0 auto; padding: 40px; }}
        .header {{ border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }}
        .title {{ font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; }}
        .meta {{ font-size: 11px; font-weight: 600; text-transform: uppercase; }}
        
        .field-item {{ display: flex; gap: 20px; margin-bottom: 30px; page-break-inside: avoid; }}
        .field-num {{ font-size: 14px; font-weight: 900; width: 30px; padding-top: 2px; }}
        .field-content {{ flex: 1; }}
        .q-text {{ font-size: 14px; font-weight: 700; margin-bottom: 12px; }}
        
        .response-area {{ padding-left: 0; }}
        .checkbox-row {{ display: flex; align-items: center; margin-bottom: 8px; }}
        .box {{ width: 14px; height: 14px; border: 1.5px solid #000; display: inline-block; margin-right: 12px; flex-shrink: 0; }}
        .response-line {{ 
            border: none; 
            border-bottom: 1px solid #ccc; 
            width: 100%; 
            font-family: inherit;
            font-size: 14px;
            color: #000;
            background: transparent;
            outline: none;
        }}
        
        .footer {{ margin-top: 50px; border-top: 1px solid #ccc; padding-top: 15px; font-size: 10px; text-align: center; color: #666; }}
        
        @media print {{
            body {{ font-size: 12pt; }}
            .container {{ width: 100%; max-width: none; padding: 0; }}
            .header {{ border-bottom-width: 3px; }}
            .response-line {{ border-bottom: 1px solid #000; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div>
                <div class="meta">Survey Optimization Bureau</div>
                <div class="title">Field Instrument</div>
            </div>
            <div class="meta">
                ID: {doc_id}<br>
                Date: {timestamp}
            </div>
        </header>
        
        <div class="instructions" style="margin-bottom: 30px; font-size: 12px; border: 1px solid #000; padding: 15px;">
            <strong>INTERVIEWER INSTRUCTIONS:</strong> Read questions exactly as written. Do not improvise. 
            Mark only one response unless otherwise indicated.
        </div>

        {q_html}

        <footer class="footer">
            OFFICIAL BUREAU FIELD DOCUMENT &bull; DO NOT DISTRIBUTE &bull; {doc_id}
        </footer>
    </div>
</body>
</html>"""
        return html

# Global singleton
bureau_reports = BureauReportGenerator()
