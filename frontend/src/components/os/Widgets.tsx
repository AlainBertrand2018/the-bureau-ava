"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMission } from '@/context/MissionContext';
import { useOS } from '@/context/OSContext';
import { Clock, Globe, Users, TrendingUp, BookOpen, Linkedin, Twitter, MessageSquare } from 'lucide-react';

export const WidgetContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="fixed top-12 left-6 bottom-24 w-72 flex flex-col gap-6 pointer-events-none z-10">
        {children}
    </div>
);

const WidgetWrapper: React.FC<{ children: React.ReactNode; delay?: number; id: string }> = ({ children, delay = 0, id }) => {
    const { wallpaper } = useOS();
    const isLight = wallpaper === 'clinical-white';

    const lightClasses = "bg-white/70 backdrop-blur-3xl border-slate-200 shadow-xl group hover:bg-white text-slate-800";
    const darkClasses = "bg-white/5 backdrop-blur-3xl border-white/10 shadow-xl group hover:bg-white/10 text-white";

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            whileDrag={{ scale: 1.05, rotate: 2, zIndex: 100 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
            className={`pointer-events-auto p-5 rounded-[2rem] border overflow-hidden transition-colors duration-500 cursor-grab active:cursor-grabbing relative ${isLight ? lightClasses : darkClasses}`}
            id={id}
        >
            {/* Drag Handle Dot (iOS style) */}
            <div className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full transition-colors ${isLight ? 'bg-slate-300 group-hover:bg-slate-400' : 'bg-white/10 group-hover:bg-white/30'}`} />
            {children}
        </motion.div>
    );
};

/* ─── Widget 1: Time & Calendar ─── */
export const TimeWidget = () => {
    const { wallpaper } = useOS();
    const isLight = wallpaper === 'clinical-white';
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const day = time.toLocaleDateString('en-US', { weekday: 'long' });
    const date = time.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hourDegrees = ((hours + minutes / 60) / 12) * 360;

    return (
        <WidgetWrapper delay={0.2} id="time">
            <div className="flex flex-col gap-1 items-center justify-center w-full">
                <div className="flex items-center gap-2 text-emerald-500 mb-2 w-full justify-center">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">System</span>
                </div>

                <div className={`relative w-32 h-32 rounded-full border shadow-inner flex items-center justify-center my-1 z-0 ${isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-black/40'}`}>
                    {/* Clock Marks */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 flex justify-center"
                            style={{ transform: `rotate(${i * 30}deg)` }}
                        >
                            <div className={`w-[1px] mt-1 ${isLight
                                ? (i % 3 === 0 ? 'h-3 bg-slate-400' : 'h-1.5 bg-slate-200')
                                : (i % 3 === 0 ? 'h-3 bg-white/50' : 'h-1.5 bg-white/20')}`} />
                        </div>
                    ))}

                    {/* Hour Hand Container */}
                    <div className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${hourDegrees}deg)` }}>
                        <div className={`w-[3px] h-9 rounded-full mt-[27px] origin-bottom z-10 ${isLight ? 'bg-slate-800' : 'bg-white/90'}`} />
                    </div>

                    {/* Minute Hand Container */}
                    <div className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${minuteDegrees}deg)` }}>
                        <div className={`w-[2px] h-12 rounded-full mt-[16px] origin-bottom z-10 ${isLight ? 'bg-slate-600' : 'bg-white/70'}`} />
                    </div>

                    {/* Second Hand Container */}
                    <div className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${secondDegrees}deg)` }}>
                        <div className="w-[1.5px] h-14 bg-emerald-500 rounded-full mt-[12px] origin-bottom z-10" />
                    </div>

                    {/* Clock center point */}
                    <div className="absolute w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_var(--tw-shadow-color)] shadow-emerald-400 z-20"></div>
                </div>

                <div className="flex flex-col items-center mt-2 w-full text-center">
                    <div className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white/90'}`}>{day}</div>
                    <div className={`text-[10px] font-medium uppercase tracking-widest leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{date}</div>
                </div>
            </div>
        </WidgetWrapper>
    );
};

/* ─── Widget 2: Omniscient Location (Jurisdiction) ─── */
export const CountryWidget = () => {
    const { wallpaper } = useOS();
    const isLight = wallpaper === 'clinical-white';

    const [jurisdiction, setJurisdiction] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [manualInput, setManualInput] = useState('');
    const [needsManual, setNeedsManual] = useState(false);

    // State to hold the fetched RestCountries data
    const [intel, setIntel] = useState({
        demographics: '',
        economics: '',
        axiom: ''
    });

    // Fetch real data from REST Countries API
    const fetchBureauIntel = async (countryName: string) => {
        try {
            const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
            if (!res.ok) throw new Error('Country not found in public database.');
            const data = await res.json();
            const country = data[0];

            // 1. Demographics: Population & Borders
            const pop = country.population ? new Intl.NumberFormat('en-US').format(country.population) : 'Unknown';
            const borders = country.borders?.length ? country.borders.join(', ') : 'None';
            const demographicsStr = `Population: ${pop} | Borders: ${borders}`;

            // 2. Economics: Currencies
            const currencies = country.currencies
                ? Object.values(country.currencies).map((c: any) => `${c.name} (${c.symbol})`).join(', ')
                : 'Unknown';
            // Extract Gini if available
            const giniYear = country.gini ? Object.keys(country.gini)[0] : null;
            const giniValue = giniYear && country.gini ? country.gini[giniYear] : null;
            const giniStr = giniValue ? ` | Gini Index (${giniYear}): ${giniValue}` : '';
            const economicsStr = `Currency: ${currencies}${giniStr}`;

            // 3. Cultural Axiom: Region, Capital, Languages
            const region = country.subregion || country.region || 'Unknown Region';
            const capital = country.capital?.[0] || 'Unknown Capital';
            const languages = country.languages ? Object.values(country.languages).join(', ') : 'Unknown';
            const axiomStr = `Operating out of ${capital} in ${region}. Primary language contexts: ${languages}.`;

            setIntel({
                demographics: demographicsStr,
                economics: economicsStr,
                axiom: axiomStr
            });

        } catch (error) {
            // Fallback if API fails (e.g., misspelled manual input)
            setIntel({
                demographics: 'Data inaccessible structure.',
                economics: 'Economic indicators off-grid.',
                axiom: 'Jurisdiction requires manual field reconnaissance.'
            });
        }
    };

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await fetch('https://ipwho.is/');
                const data = await res.json();
                if (data.success && data.country) {
                    setJurisdiction(data.country);
                    await fetchBureauIntel(data.country);
                } else {
                    setNeedsManual(true);
                }
            } catch (error) {
                setNeedsManual(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLocation();
    }, []);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const input = manualInput.trim();
        if (input) {
            setIsLoading(true); // show loading state while fetching real data
            setNeedsManual(false);
            setJurisdiction(input);
            await fetchBureauIntel(input);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <WidgetWrapper delay={0.4} id="country-loading">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Globe className="w-4 h-4 animate-spin opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pinging Satellites...</span>
                    </div>
                </div>
            </WidgetWrapper>
        );
    }

    if (needsManual) {
        return (
            <WidgetWrapper delay={0.4} id="country-manual">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-500">
                        <Globe className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Location Obscured</span>
                    </div>
                    <form onSubmit={handleManualSubmit} className="flex flex-col gap-2">
                        <span className={`text-[10px] leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-white/50'}`}>
                            Cannot detect your jurisdiction. Please declare your operating country:
                        </span>
                        <input
                            type="text"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            placeholder="e.g., Mauritius, France..."
                            className={`border rounded-lg px-3 py-2 text-xs placeholder-opacity-50 focus:outline-none focus:border-emerald-500/50 transition-colors ${isLight
                                    ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                                    : 'bg-black/40 border-white/10 text-white placeholder-white/20'
                                }`}
                            autoFocus
                        />
                        <button type="submit" className={`text-[9px] font-bold uppercase tracking-wider py-1.5 rounded-md transition-colors w-full mt-1 ${isLight ? 'bg-slate-800 text-white hover:bg-emerald-500' : 'text-black bg-white hover:bg-emerald-400'}`}>
                            Set Jurisdiction
                        </button>
                    </form>
                </div>
            </WidgetWrapper>
        );
    }

    return (
        <WidgetWrapper delay={0.4} id="country">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-emerald-500">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{jurisdiction} Intel</span>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-1">
                    <div className="flex items-start gap-3">
                        <Users className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`} />
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Demographics</div>
                            <div className={`text-xs leading-snug ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{intel.demographics}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <TrendingUp className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`} />
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Economics</div>
                            <div className={`text-xs leading-snug ${isLight ? 'text-slate-700' : 'text-white/80'}`}>{intel.economics}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MessageSquare className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`} />
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Cultural Axiom</div>
                            <div className={`text-xs italic leading-snug opacity-90 ${isLight ? 'text-emerald-700' : 'text-emerald-400/90'}`}>
                                "{intel.axiom}"
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WidgetWrapper>
    );
};

/* ─── Widget 3: Bureau Feed (Articles & Socials) ─── */
const ARTICLES = [
    "Synthetic Respondents vs. Humans",
    "Decoding Mauritius Retail Trends",
    "The Ethics of AI Research",
    "Gen Z: The Uncatchable Sample",
    "Why Surveys Fail in Emerging Markets"
];

export const BureauFeedWidget = () => {
    const { wallpaper } = useOS();
    const isLight = wallpaper === 'clinical-white';

    return (
        <WidgetWrapper delay={0.6} id="feed">
            <div className="flex flex-col gap-4">
                <div className={`flex items-center gap-2 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Feed</span>
                </div>

                <div className="flex flex-col gap-2.5">
                    {ARTICLES.map((title, i) => (
                        <div key={i} className="flex items-center gap-2 group/item cursor-pointer">
                            <div className={`w-1 h-1 rounded-full transition-colors ${isLight ? 'bg-blue-400 group-hover/item:bg-blue-600' : 'bg-blue-500/50 group-hover/item:bg-blue-400'}`} />
                            <div className={`text-[11px] transition-colors truncate ${isLight ? 'text-slate-600 group-hover/item:text-slate-900' : 'text-white/60 group-hover/item:text-white'}`}>
                                {title}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`flex items-center justify-between pt-3 mt-1 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                    <div className="flex gap-4">
                        <Linkedin className={`w-4 h-4 cursor-pointer transition-colors ${isLight ? 'text-slate-400 hover:text-blue-600' : 'text-slate-500 hover:text-white'}`} />
                        <Twitter className={`w-4 h-4 cursor-pointer transition-colors ${isLight ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-white'}`} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Connect</span>
                </div>
            </div>
        </WidgetWrapper>
    );
};
