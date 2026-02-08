"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FileUp, ShieldCheck, Zap, AlertCircle, PlayCircle, Info } from 'lucide-react';
import { uploadSurvey } from '@/app/actions/upload';
import Modal from '@/components/Modal';
import RotatingDashboard from '@/components/RotatingDashboard';

export default function Hero() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<'demo' | 'methodology' | 'audit' | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadSurvey(formData);
        if (result.error) {
            setUploadError(result.error);
            setIsUploading(false);
        } else {
            alert(`Success! Simulation staging ready for ${result.filename}.`);
            setIsUploading(false);
        }
    };

    return (
        <section className="relative pt-40 pb-32 overflow-hidden bg-slate-950 min-h-screen flex items-center">
            {/* Professional Grid/Gradient Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                {/* Left Side: Content */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-xl"
                    >
                        <div className="flex items-center gap-2 mb-8">
                            <span className="bg-primary/20 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-primary/30">The Elite Choice</span>
                            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Used by Leading Mauritian Brands</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-[1.0] max-w-2xl">
                            Stop Losing Budget<br />on <span className="text-blue-500">Guesswork.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light tracking-wide">
                            <button
                                onMouseEnter={() => setActiveModal('audit')}
                                onMouseLeave={() => setActiveModal(null)}
                                className="text-white font-bold underline decoration-blue-500/50 decoration-2 underline-offset-4 decoration-dashed hover:decoration-blue-500 transition-all text-left"
                            >
                                94% of survey fails
                            </button> occur because they aren't stress-tested. We simulate 100 synthetic personalities before you spend a single Rupee in the field.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <button className={`bg-primary text-white px-8 py-4 rounded-full font-black text-xs tracking-widest flex items-center gap-3 transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 uppercase ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <FileUp size={16} />
                                    {isUploading ? 'AUDITING...' : 'DROP SURVEY FOR AUDIT'}
                                </button>
                            </div>
                            <button
                                onClick={() => setActiveModal('demo')}
                                className="bg-white/5 text-white border border-white/10 flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs tracking-widest transition-all hover:bg-white/10 hover:border-white/20 uppercase"
                            >
                                <PlayCircle size={16} className="text-blue-500" />
                                Interactive Demo
                            </button>
                        </div>

                        {uploadError && (
                            <div className="mt-6 flex items-center gap-2 text-rose-600 text-xs font-black font-mono tracking-tighter bg-rose-50 p-3 rounded-lg border border-rose-100 uppercase">
                                <AlertCircle size={14} /> {uploadError}
                            </div>
                        )}

                        <div className="mt-16 flex items-center gap-10">
                            <button onClick={() => setActiveModal('methodology')} className="text-slate-400 hover:text-primary transition-colors text-xs font-black tracking-widest flex items-center gap-2 uppercase underline underline-offset-8 decoration-slate-200">
                                <Info size={14} /> See Why Scientific Simulation Beats Panels
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: The Intelligence Hub */}
                <div className="relative group lg:h-[600px] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -15, 0]
                        }}
                        transition={{
                            opacity: { duration: 1 },
                            scale: { duration: 1 },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative w-full max-w-md h-[550px] bg-white rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
                    >
                        <RotatingDashboard />
                    </motion.div>

                    {/* Decorative Background Glow */}
                    <div className="absolute -z-10 w-[120%] h-[120%] bg-blue-100/40 blur-[100px] rounded-full" />
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={activeModal === 'demo'}
                onClose={() => setActiveModal(null)}
                title="Bureau Simulation Environment"
            >
                <div className="space-y-6">
                    <p className="text-slate-600 font-medium">Experience the power of <span className="text-primary font-bold">Predictive Analytics</span>. See how our synthetic agents identify fatigue and bias in real-time.</p>
                    <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center flex-col text-slate-400 gap-4 border border-slate-200 group hover:border-primary/20 transition-all cursor-pointer">
                        <PlayCircle size={64} className="group-hover:scale-110 transition-transform text-primary/40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Launch Sandbox Preview</span>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={activeModal === 'methodology'}
                onClose={() => setActiveModal(null)}
                title="The Simulation Whitepaper"
            >
                <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                    <p>Panels are biased. Real people have survey fatigue. Statistical simulation uses <span className="text-primary font-bold">Iterative Proportional Fitting (IPF)</span> and AI persona roleplay to give you the truth, faster.</p>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <li className="flex gap-4 items-start"><ShieldCheck className="text-primary shrink-0 mt-1" size={18} /> <span>Grounded in the <span className="text-slate-900 font-bold">2022 Census</span> data anchors.</span></li>
                        <li className="flex gap-4 items-start"><Zap className="text-primary shrink-0 mt-1" size={18} /> <span>Scalable up to <span className="text-slate-900 font-bold">5,000 simulations</span> per mandate.</span></li>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={activeModal === 'audit'}
                onClose={() => setActiveModal(null)}
                title="Bureau Internal Audit Protocol"
                size="sm"
                showBackdrop={false}
            >
                <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-slate-900 font-bold text-lg mb-2">Longitudinal Audit Discovery</p>
                        <p className="text-slate-600 font-medium leading-relaxed text-sm">
                            Through our proprietary IAP-2025 framework, we have determined that <span className="text-primary font-black">9.4 out of 10</span> initial survey designs fail to account for latent predictive inhibitors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-900 text-xs text-center border">01</div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1 uppercase tracking-tighter text-sm">Structural Bias Heatmaps</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">Identifying phrasing that subconsciously steers respondents away from their honest sentiment.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-900 text-xs text-center border">02</div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1 uppercase tracking-tighter text-sm">Latent Sampling Errors</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">Detecting demographic blindspots that unweighted panels historically overlook in the Mauritian context.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-900 text-xs text-center border">03</div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1 uppercase tracking-tighter text-sm">Response Fatigue Thresholds</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">Pinpointing the exact question where agent attention drops by more than 65%.</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-6 uppercase tracking-widest">
                        *Statistical certainty based on n=5,000 simulations conducted across multi-sector mandates (2023-2025).
                    </p>
                </div>
            </Modal>
        </section>
    );
}
