"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    Target,
    Zap,
    ShieldCheck,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    LayoutDashboard,
    Cpu,
    Languages,
    TrendingUp,
    Shield,
    Users,
    MapPin,
    Wifi,
    Fingerprint,
    FileText,
    Lock,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useMission, AudienceTargeting } from "@/context/MissionContext";
import AudienceConfigurator from "@/components/shared/AudienceConfigurator";
import LaboratoryEntryProtocol from "@/components/shared/LaboratoryEntryProtocol";

const DEFAULT_TARGETING: AudienceTargeting = {
    gender: 'All',
    age_range: [18, 65],
    marital_status: 'Any',
    revenue_range: [15000, 100 * 1000],
    education_level: 'Any',
    employment_sector: 'Any',
    urbanization: 'Any',
    country: 'Mauritius'
};

const COUNTRIES = [
    // ── AFRICA ──
    { id: "Mauritius", name: "🇲🇺 Mauritius", regions: ["Islandwide", "Plaines Wilhems", "Port Louis", "North", "South", "East", "West"], flag: "🇲🇺" },
    { id: "South Africa", name: "🇿🇦 South Africa", regions: ["National", "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State"], flag: "🇿🇦" },
    { id: "Kenya", name: "🇰🇪 Kenya", regions: ["National", "Nairobi", "Mombasa", "Central", "Coast", "Rift Valley"], flag: "🇰🇪" },
    { id: "Nigeria", name: "🇳🇬 Nigeria", regions: ["National", "Lagos", "Abuja", "Rivers", "Kano", "Oyo"], flag: "🇳🇬" },
    { id: "Ghana", name: "🇬🇭 Ghana", regions: ["National", "Greater Accra", "Ashanti", "Northern"], flag: "🇬🇭" },
    { id: "Tanzania", name: "🇹🇿 Tanzania", regions: ["National", "Dar es Salaam", "Arusha", "Zanzibar"], flag: "🇹🇿" },
    { id: "Ethiopia", name: "🇪🇹 Ethiopia", regions: ["National", "Addis Ababa", "Oromia", "Amhara"], flag: "🇪🇹" },
    { id: "Egypt", name: "🇪🇬 Egypt", regions: ["National", "Cairo", "Alexandria", "Giza", "Upper Egypt"], flag: "🇪🇬" },
    { id: "Morocco", name: "🇲🇦 Morocco", regions: ["National", "Casablanca", "Rabat", "Marrakech", "Fez"], flag: "🇲🇦" },
    { id: "Rwanda", name: "🇷🇼 Rwanda", regions: ["National", "Kigali", "Eastern", "Western"], flag: "🇷🇼" },
    { id: "Senegal", name: "🇸🇳 Senegal", regions: ["National", "Dakar", "Thiès", "Saint-Louis"], flag: "🇸🇳" },
    { id: "Ivory Coast", name: "🇨🇮 Ivory Coast", regions: ["National", "Abidjan", "Yamoussoukro", "Bouaké"], flag: "🇨🇮" },
    { id: "Uganda", name: "🇺🇬 Uganda", regions: ["National", "Kampala", "Central", "Western"], flag: "🇺🇬" },
    { id: "Madagascar", name: "🇲🇬 Madagascar", regions: ["National", "Antananarivo", "Toamasina", "Mahajanga"], flag: "🇲🇬" },
    { id: "Reunion", name: "🇷🇪 Réunion", regions: ["Islandwide", "Saint-Denis", "Saint-Pierre", "Saint-Paul"], flag: "🇷🇪" },
    // ── EUROPE ──
    { id: "United Kingdom", name: "🇬🇧 United Kingdom", regions: ["National", "London", "Manchester", "Birmingham", "Scotland", "Wales", "Northern Ireland"], flag: "🇬🇧" },
    { id: "France", name: "🇫🇷 France", regions: ["National", "Île-de-France", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Nice"], flag: "🇫🇷" },
    { id: "Germany", name: "🇩🇪 Germany", regions: ["National", "Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"], flag: "🇩🇪" },
    { id: "Italy", name: "🇮🇹 Italy", regions: ["National", "Rome", "Milan", "Naples", "Turin", "Florence"], flag: "🇮🇹" },
    { id: "Spain", name: "🇪🇸 Spain", regions: ["National", "Madrid", "Barcelona", "Valencia", "Seville", "Basque Country"], flag: "🇪🇸" },
    { id: "Netherlands", name: "🇳🇱 Netherlands", regions: ["National", "Amsterdam", "Rotterdam", "The Hague", "Utrecht"], flag: "🇳🇱" },
    { id: "Switzerland", name: "🇨🇭 Switzerland", regions: ["National", "Zurich", "Geneva", "Basel", "Bern"], flag: "🇨🇭" },
    { id: "Belgium", name: "🇧🇪 Belgium", regions: ["National", "Brussels", "Flanders", "Wallonia"], flag: "🇧🇪" },
    { id: "Portugal", name: "🇵🇹 Portugal", regions: ["National", "Lisbon", "Porto", "Algarve"], flag: "🇵🇹" },
    { id: "Sweden", name: "🇸🇪 Sweden", regions: ["National", "Stockholm", "Gothenburg", "Malmö"], flag: "🇸🇪" },
    { id: "Norway", name: "🇳🇴 Norway", regions: ["National", "Oslo", "Bergen", "Trondheim"], flag: "🇳🇴" },
    { id: "Poland", name: "🇵🇱 Poland", regions: ["National", "Warsaw", "Kraków", "Gdańsk", "Wrocław"], flag: "🇵🇱" },
    { id: "Ireland", name: "🇮🇪 Ireland", regions: ["National", "Dublin", "Cork", "Galway"], flag: "🇮🇪" },
    { id: "Greece", name: "🇬🇷 Greece", regions: ["National", "Athens", "Thessaloniki", "Crete"], flag: "🇬🇷" },
    { id: "Turkey", name: "🇹🇷 Turkey", regions: ["National", "Istanbul", "Ankara", "Izmir", "Antalya"], flag: "🇹🇷" },
    // ── MIDDLE EAST ──
    { id: "United Arab Emirates", name: "🇦🇪 United Arab Emirates", regions: ["National", "Dubai", "Abu Dhabi", "Sharjah"], flag: "🇦🇪" },
    { id: "Saudi Arabia", name: "🇸🇦 Saudi Arabia", regions: ["National", "Riyadh", "Jeddah", "Mecca", "NEOM"], flag: "🇸🇦" },
    { id: "Qatar", name: "🇶🇦 Qatar", regions: ["National", "Doha", "Al Wakrah"], flag: "🇶🇦" },
    { id: "Israel", name: "🇮🇱 Israel", regions: ["National", "Tel Aviv", "Jerusalem", "Haifa"], flag: "🇮🇱" },
    { id: "Jordan", name: "🇯🇴 Jordan", regions: ["National", "Amman", "Aqaba", "Irbid"], flag: "🇯🇴" },
    // ── ASIA PACIFIC ──
    { id: "India", name: "🇮🇳 India", regions: ["National", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"], flag: "🇮🇳" },
    { id: "China", name: "🇨🇳 China", regions: ["National", "Beijing", "Shanghai", "Shenzhen", "Guangzhou", "Chengdu", "Hangzhou"], flag: "🇨🇳" },
    { id: "Japan", name: "🇯🇵 Japan", regions: ["National", "Tokyo", "Osaka", "Kyoto", "Nagoya", "Fukuoka"], flag: "🇯🇵" },
    { id: "South Korea", name: "🇰🇷 South Korea", regions: ["National", "Seoul", "Busan", "Incheon", "Daegu"], flag: "🇰🇷" },
    { id: "Singapore", name: "🇸🇬 Singapore", regions: ["National", "Central", "East", "West"], flag: "🇸🇬" },
    { id: "Indonesia", name: "🇮🇩 Indonesia", regions: ["National", "Jakarta", "Bali", "Surabaya", "Bandung"], flag: "🇮🇩" },
    { id: "Malaysia", name: "🇲🇾 Malaysia", regions: ["National", "Kuala Lumpur", "Penang", "Johor Bahru", "Sabah"], flag: "🇲🇾" },
    { id: "Thailand", name: "🇹🇭 Thailand", regions: ["National", "Bangkok", "Chiang Mai", "Phuket", "Pattaya"], flag: "🇹🇭" },
    { id: "Philippines", name: "🇵🇭 Philippines", regions: ["National", "Metro Manila", "Cebu", "Davao"], flag: "🇵🇭" },
    { id: "Vietnam", name: "🇻🇳 Vietnam", regions: ["National", "Ho Chi Minh City", "Hanoi", "Da Nang"], flag: "🇻🇳" },
    { id: "Pakistan", name: "🇵🇰 Pakistan", regions: ["National", "Karachi", "Lahore", "Islamabad", "Rawalpindi"], flag: "🇵🇰" },
    { id: "Bangladesh", name: "🇧🇩 Bangladesh", regions: ["National", "Dhaka", "Chittagong", "Sylhet"], flag: "🇧🇩" },
    { id: "Sri Lanka", name: "🇱🇰 Sri Lanka", regions: ["National", "Colombo", "Kandy", "Galle"], flag: "🇱🇰" },
    // ── OCEANIA ──
    { id: "Australia", name: "🇦🇺 Australia", regions: ["National", "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"], flag: "🇦🇺" },
    { id: "New Zealand", name: "🇳🇿 New Zealand", regions: ["National", "Auckland", "Wellington", "Christchurch"], flag: "🇳🇿" },
    // ── AMERICAS ──
    { id: "United States", name: "🇺🇸 United States", regions: ["National", "New York", "California", "Texas", "Florida", "Illinois", "Midwest", "Southeast", "Pacific Northwest"], flag: "🇺🇸" },
    { id: "Canada", name: "🇨🇦 Canada", regions: ["National", "Ontario", "Quebec", "British Columbia", "Alberta"], flag: "🇨🇦" },
    { id: "Mexico", name: "🇲🇽 Mexico", regions: ["National", "Mexico City", "Guadalajara", "Monterrey", "Cancún"], flag: "🇲🇽" },
    { id: "Brazil", name: "🇧🇷 Brazil", regions: ["National", "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Manaus"], flag: "🇧🇷" },
    { id: "Argentina", name: "🇦🇷 Argentina", regions: ["National", "Buenos Aires", "Córdoba", "Rosario", "Mendoza"], flag: "🇦🇷" },
    { id: "Colombia", name: "🇨🇴 Colombia", regions: ["National", "Bogotá", "Medellín", "Cali", "Barranquilla"], flag: "🇨🇴" },
    { id: "Chile", name: "🇨🇱 Chile", regions: ["National", "Santiago", "Valparaíso", "Concepción"], flag: "🇨🇱" },
    { id: "Peru", name: "🇵🇪 Peru", regions: ["National", "Lima", "Cusco", "Arequipa"], flag: "🇵🇪" },
    // ── CARIBBEAN & ISLANDS ──
    { id: "Jamaica", name: "🇯🇲 Jamaica", regions: ["National", "Kingston", "Montego Bay"], flag: "🇯🇲" },
    { id: "Trinidad and Tobago", name: "🇹🇹 Trinidad & Tobago", regions: ["National", "Port of Spain", "San Fernando"], flag: "🇹🇹" },
    { id: "Seychelles", name: "🇸🇨 Seychelles", regions: ["Islandwide", "Mahé", "Praslin", "La Digue"], flag: "🇸🇨" },
    { id: "Maldives", name: "🇲🇻 Maldives", regions: ["National", "Malé", "Ari Atoll"], flag: "🇲🇻" },
];

const LANGUAGES = [
    { id: "English", name: "English" },
    { id: "French", name: "French" },
    { id: "Spanish", name: "Spanish" },
    { id: "Portuguese", name: "Portuguese" },
    { id: "German", name: "German" },
    { id: "Italian", name: "Italian" },
    { id: "Dutch", name: "Dutch" },
    { id: "Swedish", name: "Swedish" },
    { id: "Norwegian", name: "Norwegian" },
    { id: "Polish", name: "Polish" },
    { id: "Greek", name: "Greek" },
    { id: "Turkish", name: "Turkish" },
    { id: "Arabic", name: "Arabic" },
    { id: "Hebrew", name: "Hebrew" },
    { id: "Hindi", name: "Hindi" },
    { id: "Urdu", name: "Urdu" },
    { id: "Bengali", name: "Bengali" },
    { id: "Tamil", name: "Tamil" },
    { id: "Sinhala", name: "Sinhala" },
    { id: "Mandarin", name: "Mandarin Chinese" },
    { id: "Japanese", name: "Japanese" },
    { id: "Korean", name: "Korean" },
    { id: "Bahasa", name: "Bahasa (Malay/Indonesian)" },
    { id: "Thai", name: "Thai" },
    { id: "Vietnamese", name: "Vietnamese" },
    { id: "Filipino", name: "Filipino (Tagalog)" },
    { id: "Swahili", name: "Swahili" },
    { id: "Amharic", name: "Amharic" },
    { id: "Yoruba", name: "Yoruba" },
    { id: "Pidgin", name: "Nigerian Pidgin" },
    { id: "Creole", name: "Mauritian Creole" },
    { id: "Kinyarwanda", name: "Kinyarwanda" },
    { id: "Malagasy", name: "Malagasy" },
];

function MissionControlContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setMission, setTier } = useMission();

    useEffect(() => {
        const tierParam = searchParams.get('tier');
        if (tierParam === 'tier2' || tierParam === 'tier3') {
            setTier(tierParam);
        } else {
            setTier('tier1');
        }
    }, [searchParams, setTier]);

    const [step, setStep] = useState<"configure" | "calibrating" | "ready">("configure");
    const [config, setConfig] = useState({
        target_country: "Mauritius",
        target_region: "Islandwide",
        target_language: "English",
        target_audience: "",
        research_topic: "Consumer Behavior",
        targeting_refinement: DEFAULT_TARGETING
    });

    const [error, setError] = useState<string | null>(null);
    const [calibText, setCalibText] = useState("Initializing Universalization Layer...");
    const [missionData, setMissionData] = useState<any>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionText, setTransitionText] = useState("");
    const [showAuditLog, setShowAuditLog] = useState(false);

    const calibSteps = [
        "Connecting to Bureau Intelligence Grid...",
        "Scanning Market Socio-Economics...",
        "Parsing Linguistic Registers...",
        "Establishing Cultural Axioms...",
        "Drafting Persona Seedlings...",
        "Finalizing Cultural Dossier..."
    ];

    const handleInitialize = async () => {
        if (!config.target_audience) {
            setError("Please define your target audience.");
            return;
        }

        setError(null);
        setStep("calibrating");

        // Cycle through text for effect
        let idx = 0;
        const interval = setInterval(() => {
            if (idx < calibSteps.length) {
                setCalibText(calibSteps[idx]);
                idx++;
            }
        }, 1500);

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mission/initialize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });

            if (!resp.ok) {
                const errData = await resp.json().catch(() => null);
                throw new Error(errData?.detail || "Mission failed to launch.");
            }

            // STREAMING RESPONSE HANDLER
            const reader = resp.body?.getReader();
            if (!reader) throw new Error("Stream not supported");

            // Clear previous data but keep structure for UI safety
            setMissionData({ audit_trail: [] } as any);
            // setShowAuditLog(true); // Disable auto-open full modal in favor of one-line ticker

            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    clearInterval(interval);
                    setStep("ready");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                accumulated += chunk;

                const lines = accumulated.split("\n");
                // Keep the last segment if it isn't a complete line (doesn't end in \n)
                // Actually split leaves empty string at end if text ends with \n
                // If it doesn't end with \n, the last element is the incomplete chunk.
                // We should check if the last char was \n before splitting, or pop the last element always if assume stream chunks might split lines.
                // Safer approach:
                const lastLine = lines.pop();
                accumulated = lastLine || "";

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const msg = JSON.parse(line);

                        if (msg.type === "log") {
                            setMissionData((prev: any) => ({
                                ...prev,
                                audit_trail: [...(prev?.audit_trail || []), msg.data]
                            }));
                        } else if (msg.type === "mission") {
                            setMissionData(msg.data);
                            setMission(msg.data);
                        } else if (msg.type === "status") {
                            // Optional: update calibration text?
                            // setCalibText(msg.data);
                        } else if (msg.type === "error") {
                            throw new Error(msg.detail);
                        }
                    } catch (e) {
                        console.error("Stream parse error", e);
                    }
                }
            }
        } catch (err: any) {
            clearInterval(interval);
            setError(err.message);
            setStep("configure");
        }
    };

    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const { tier } = useMission();

    const handleEnterLab = () => {
        if (tier === 'tier2' || tier === 'tier3') {
            setIsPaywallOpen(true);
        } else {
            setIsTransitioning(true);
        }
    };

    const handlePaywallSuccess = () => {
        setIsPaywallOpen(false);
        setIsTransitioning(true);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <LaboratoryEntryProtocol
                isOpen={isTransitioning}
                targetName={missionData?.config?.target_country || 'Unknown'}
                onComplete={() => router.push("/lab")}
            />
            {/* Background FX */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 hero-dot-grid opacity-20" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 md:pt-24 pb-20 md:pb-32 flex-grow w-full">
                <AnimatePresence mode="wait">
                    {/* STEP 1: CONFIGURE */}
                    {step === "configure" && (
                        <motion.div
                            key="configure"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8 md:space-y-12"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 mb-8 md:mb-12">
                                {/* AVA PORTRAIT (Identical to Hero) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40, scale: 0.98 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
                                    className="relative flex-shrink-0"
                                >
                                    <motion.div
                                        className="absolute inset-0 -m-4 rounded-full"
                                        style={{
                                            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                                        }}
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    <div className="relative w-[180px] h-[220px] md:w-[220px] md:h-[280px] lg:w-[260px] lg:h-[320px]">
                                        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent opacity-60" />
                                        <div className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-sm bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-white/5">
                                            <Image
                                                src="/images/AVA.webp"
                                                alt="AVA — Survey Intelligence Analyst"
                                                fill
                                                className="object-cover object-top"
                                                priority
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.8, duration: 0.5 }}
                                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-slate-900/90 border border-emerald-500/30"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Online</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <div className="flex-1 text-center lg:text-left space-y-4">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                                    >
                                        <Cpu size={12} />
                                        Mission Control Gateway
                                    </motion.div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-tight">
                                        Welcome to My <span className="text-emerald-500">Universal Bureau</span>
                                    </h1>
                                    <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                                        Where I <span className="text-slate-300">simulate the world</span> to stress-test your research against global reality.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: General Settings */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="glass-card p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Market</label>
                                                <select
                                                    value={config.target_country}
                                                    onChange={(e) => setConfig({ ...config, target_country: e.target.value })}
                                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-colors outline-none appearance-none"
                                                >
                                                    {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Region / Province</label>
                                                <select
                                                    value={config.target_region}
                                                    onChange={(e) => setConfig({ ...config, target_region: e.target.value })}
                                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-colors outline-none appearance-none"
                                                >
                                                    {COUNTRIES.find(c => c.id === config.target_country)?.regions.map(r => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Research Topic</label>
                                                <input
                                                    type="text"
                                                    value={config.research_topic}
                                                    onChange={(e) => setConfig({ ...config, research_topic: e.target.value })}
                                                    placeholder="e.g. FMCG, Fintech, Healthcare"
                                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-colors outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Language Register</label>
                                                <select
                                                    value={config.target_language}
                                                    onChange={(e) => setConfig({ ...config, target_language: e.target.value })}
                                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-emerald-500 transition-colors outline-none appearance-none"
                                                >
                                                    {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Audience Segments</label>
                                            <textarea
                                                value={config.target_audience}
                                                onChange={(e) => setConfig({ ...config, target_audience: e.target.value })}
                                                placeholder="Who are you targeting? (e.g. Gen Z gamers in urban areas, SME owners...)"
                                                rows={3}
                                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-sm font-bold focus:border-emerald-500 transition-colors outline-none resize-none"
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-slate-800/50">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Fingerprint size={16} className="text-emerald-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Demographic Precision Calibrator</h4>
                                            </div>
                                            <AudienceConfigurator
                                                value={config.targeting_refinement}
                                                onChange={(val) => setConfig({ ...config, targeting_refinement: val })}
                                                dark
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Summary / CTA */}
                                <div className="space-y-6">
                                    <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5 space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Mission Setup</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Globe size={16} className="text-slate-500 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Target Market</p>
                                                    <p className="text-sm font-black">{config.target_country}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Languages size={16} className="text-slate-500 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Local Linguistic Context</p>
                                                    <p className="text-sm font-black">{config.target_language}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Target size={16} className="text-slate-500 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Target Audience</p>
                                                    <p className="text-sm font-black line-clamp-2">{config.target_audience || "Waiting for audience..."}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
                                                <AlertCircle size={14} />
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleInitialize}
                                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-emerald-600/20"
                                        >
                                            Initialize Mission
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                    <p className="text-[10px] text-slate-500 font-bold text-center">
                                        The Bureau utilizes proprietary AI for cultural calibration.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: CALIBRATING */}
                    {step === "calibrating" && (
                        <motion.div
                            key="calibrating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center min-h-[50vh] space-y-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                                <Loader2 size={64} className="text-emerald-500 animate-spin relative z-10" />
                            </div>
                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-black uppercase tracking-[0.3em] animate-pulse">
                                    Calibrating <span className="text-emerald-500">Physics</span>
                                </h2>
                                <p className="text-slate-400 font-mono text-sm tracking-tighter">
                                    {calibText}
                                </p>
                            </div>

                            <div className="w-full max-w-md h-1 bg-slate-900 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 10, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-400"
                                />
                            </div>

                            {/* LIVE AGENT TICKER (ONE-LINE MODAL) */}
                            <div className="h-16 flex items-center justify-center w-full px-4">
                                <AnimatePresence mode="wait">
                                    {missionData?.audit_trail && missionData.audit_trail.length > 0 ? (
                                        missionData.audit_trail.slice(-1).map((log: any, i: number) => (
                                            <motion.div
                                                key={log.timestamp + log.action + i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex flex-col md:flex-row items-center gap-2 md:gap-4 px-6 py-3 rounded-full bg-slate-900/90 border border-slate-700 backdrop-blur shadow-2xl shadow-emerald-500/10 max-w-2xl w-full justify-center"
                                            >
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px] ${log.agent === 'SENTINEL' ? 'bg-amber-500 shadow-amber-500/50' :
                                                        log.agent === 'PROFILER' ? 'bg-purple-500 shadow-purple-500/50' :
                                                            log.agent === 'ADJUDICATOR' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                                                'bg-teal-500 shadow-teal-500/50'
                                                        }`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${log.agent === 'SENTINEL' ? 'text-amber-400' :
                                                        log.agent === 'PROFILER' ? 'text-purple-400' :
                                                            log.agent === 'ADJUDICATOR' ? 'text-emerald-400' :
                                                                'text-teal-400'
                                                        }`}>
                                                        {log.agent}
                                                    </span>
                                                </div>

                                                <div className="hidden md:block w-px h-4 bg-slate-700 mx-1" />

                                                <div className="flex items-center gap-2 overflow-hidden w-full justify-center md:justify-start">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                                                        {log.action}
                                                    </span>
                                                    <span className="hidden sm:inline text-slate-600">»</span>
                                                    <span className="font-mono text-xs text-emerald-100 truncate w-full md:w-auto">
                                                        {log.details || "Processing..."}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            key="waiting"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-[10px] font-mono text-slate-500 animate-pulse tracking-widest"
                                        >
                                            ESTABLISHING NEURAL UPLINK...
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: READY */}
                    {step === "ready" && missionData && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 md:space-y-12"
                        >
                            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 mb-8 md:mb-16">
                                {/* AVA PORTRAIT (Identical to Hero) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40, scale: 0.98 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
                                    className="relative flex-shrink-0"
                                >
                                    <motion.div
                                        className="absolute inset-0 -m-4 rounded-full"
                                        style={{
                                            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                                        }}
                                        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    <div className="relative w-[240px] h-[300px] md:w-[280px] md:h-[350px] lg:w-[320px] lg:h-[400px]">
                                        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent opacity-60" />
                                        <div className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-sm bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-white/5">
                                            <Image
                                                src="/images/AVA.webp"
                                                alt="AVA — Survey Intelligence Analyst"
                                                fill
                                                className="object-cover object-top"
                                                priority
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.8, duration: 0.5 }}
                                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-slate-900/90 border border-emerald-500/30"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Online</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <div className="flex-1 text-center lg:text-left space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                        <CheckCircle2 size={14} />
                                        Mission Established
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none">
                                        Target <span className="text-emerald-500">Snapshot</span>
                                    </h1>
                                    <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                        I have analyzed the cultural landscape of {missionData?.config?.target_country || 'your target market'}. Use these insights to build surveys that locals trust, understand, and answer honestly.
                                    </p>

                                    {/* Precision Refinement display */}
                                    {missionData.config.targeting_refinement && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                                <Fingerprint size={12} className="text-emerald-400" />
                                                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                                                    {missionData.config.targeting_refinement.gender} · {missionData.config.targeting_refinement.age_range[0]}-{missionData.config.targeting_refinement.age_range[1]} Years · {missionData.config.targeting_refinement.marital_status}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* SAMPLING STRATEGY CARD */}
                                    {missionData.dossier.sampling_parameters && (
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Users size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Est. Segment Size</span>
                                                </div>
                                                <p className="text-lg font-bold text-white">{missionData.dossier.sampling_parameters.targeted_segment_size}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Target size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Ideal Sample</span>
                                                </div>
                                                <p className="text-lg font-bold text-emerald-400">{missionData.dossier.sampling_parameters.ideal_sample_size}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Wifi size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Distribution Mode</span>
                                                </div>
                                                <p className="text-lg font-bold text-emerald-400">{missionData.dossier.sampling_parameters.suggested_distribution_mode}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ECONOMIC REALITY (NEW) */}
                            <div className="glass-card p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp size={120} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <TrendingUp size={24} className="text-emerald-400" />
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-widest">Economic Reality</h3>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <Shield size={12} className="text-emerald-400" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                                                Bureau Verifiable
                                            </span>
                                        </div>
                                    </div>

                                    {/* DEMOGRAPHIC CUT-OUTS (NEW) */}
                                    {missionData.dossier.demographics && (
                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">Demographic Cut-Outs</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.entries(missionData.dossier.demographics).map(([key, val]: any) => (
                                                    <div key={key} className="bg-amber-950/20 border border-amber-500/10 rounded-lg p-3">
                                                        <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                        <div className="text-xs text-slate-300 font-medium space-y-1">
                                                            {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                <div key={i} className="flex items-start gap-2">
                                                                    <span className="text-amber-500/50 mt-0.5">•</span>
                                                                    <span>{part.trim()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="h-px bg-slate-800/50 w-full" />
                                        </div>
                                    )}

                                    {/* STRUCTURED ECONOMIC DATA */}
                                    <div className="space-y-8">
                                        {/* Macro Economics */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Macro-Economic Indicators</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {missionData.dossier.economics && Object.entries(missionData.dossier.economics).map(([key, val]: any) => (
                                                    <div key={key} className="bg-emerald-950/20 border border-emerald-500/10 rounded-lg p-3">
                                                        <span className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                        <div className="text-xs text-slate-300 font-medium space-y-1">
                                                            {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                <div key={i} className="flex items-start gap-2">
                                                                    <span className="text-emerald-500/50 mt-0.5">•</span>
                                                                    <span>{part.trim()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-slate-800/50 w-full" />

                                        {/* Tech & Education Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Education */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Education Landscape</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {missionData.dossier.education && Object.entries(missionData.dossier.education).map(([key, val]: any) => (
                                                        <div key={key} className="bg-emerald-950/20 border border-emerald-500/10 rounded-lg p-3">
                                                            <span className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                            <div className="text-xs text-slate-300 font-medium space-y-1">
                                                                {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                    <div key={i} className="flex items-start gap-2">
                                                                        <span className="text-emerald-500/50 mt-0.5">•</span>
                                                                        <span>{part.trim()}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Technology */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">Technological Adoption</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {missionData.dossier.technology && Object.entries(missionData.dossier.technology).map(([key, val]: any) => (
                                                        <div key={key} className="bg-purple-950/20 border border-purple-500/10 rounded-lg p-3">
                                                            <span className="text-[10px] font-bold text-purple-400/70 uppercase tracking-wider block mb-1.5">{key.replace(/_/g, ' ')}</span>
                                                            <div className="text-xs text-slate-300 font-medium space-y-1">
                                                                {(typeof val === 'string' ? val : JSON.stringify(val)).split('|').map((part: string, i: number) => (
                                                                    <div key={i} className="flex items-start gap-2">
                                                                        <span className="text-purple-500/50 mt-0.5">•</span>
                                                                        <span>{part.trim()}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Citations Snippet */}
                                    {missionData.dossier.citation_index && missionData.dossier.citation_index.length > 0 && (
                                        <div className="pt-4 border-t border-slate-800">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Primary Sources</p>
                                            <div className="flex flex-wrap gap-2">
                                                {missionData.dossier.citation_index.slice(0, 3).map((cite: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 truncate max-w-[200px]">
                                                        {cite.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                                                    </span>
                                                ))}
                                                {missionData.dossier.citation_index.length > 3 && (
                                                    <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                                                        +{missionData.dossier.citation_index.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Cultural Axioms */}
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={20} className="text-emerald-500" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">Cultural Axioms</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {missionData.dossier.cultural_axioms.map((axiom: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                                                <p className="text-xs text-slate-300 font-medium leading-relaxed">{axiom}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Linguistic Nuances */}
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <Languages size={20} className="text-teal-500" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">Linguistic Context</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {missionData.dossier.linguistic_nuances.map((nuance: string, i: number) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                                                    {nuance}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Taboos & Sensitive Clusters</p>
                                            <ul className="space-y-2">
                                                {missionData.dossier.taboos.map((taboo: string, i: number) => (
                                                    <li key={i} className="text-xs text-red-400 font-bold flex items-center gap-2">
                                                        <AlertCircle size={10} />
                                                        {taboo}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Demographics Section */}
                            {missionData.dossier.demographic_archetypes && missionData.dossier.demographic_archetypes.length > 0 && (
                                <div className="glass-card p-8 space-y-6 mt-8">
                                    <div className="flex items-center gap-2">
                                        <Users size={20} className="text-amber-500" />
                                        <h3 className="text-sm font-black uppercase tracking-widest">Demographic Archetypes (Generated Personas)</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {missionData.dossier.demographic_archetypes.map((persona: any, i: number) => (
                                            <div key={i} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl hover:border-amber-500/30 transition-colors group">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">
                                                        {persona.name.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-amber-500 transition-colors">{persona.role}</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-white mb-2">{persona.name}</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">{persona.background}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {persona.traits && persona.traits.split(',').slice(0, 2).map((t: string, k: number) => (
                                                        <span key={k} className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] text-slate-500 uppercase tracking-wide">{t.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                <button
                                    onClick={handleEnterLab}
                                    className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all shadow-xl shadow-white/10"
                                >
                                    <LayoutDashboard size={16} />
                                    Enter Research Lab
                                </button>
                                <button
                                    onClick={() => router.push("/")}
                                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 border border-slate-800 transition-all"
                                >
                                    <Clock size={16} />
                                    View History
                                </button>
                            </div>

                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => setShowAuditLog(true)}
                                    className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 uppercase tracking-widest flex items-center gap-2 transition-colors"
                                >
                                    <FileText size={12} />
                                    View Agency Trace
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* TRANSITION OVERLAY */}
                <AnimatePresence>
                    {isTransitioning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative z-10 text-center space-y-8"
                            >
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping" />
                                    <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-emerald-500 border-l-transparent rounded-full animate-spin" />
                                    <div className="absolute inset-4 bg-emerald-500/20 rounded-full backdrop-blur-md flex items-center justify-center">
                                        <Cpu size={32} className="text-emerald-400" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] animate-pulse">
                                        Bureau Airlock
                                    </h2>
                                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />
                                    <p className="text-emerald-400 font-mono text-sm tracking-widest uppercase">
                                        {transitionText}
                                    </p>
                                </div>
                            </motion.div>

                            <div className="absolute bottom-12 left-0 right-0 text-center">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                                    Secure Connection Established
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AUDIT LOG MODAL */}
                <AnimatePresence>
                    {showAuditLog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAuditLog(false)}
                                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-emerald-400" />
                                        <h3 className="text-lg font-black uppercase tracking-widest text-white">Agency Trace</h3>
                                    </div>
                                    <button onClick={() => setShowAuditLog(false)} className="text-slate-400 hover:text-white">
                                        <span className="sr-only">Close</span>
                                        Esc
                                    </button>
                                </div>
                                <div className="p-0 max-h-[60vh] overflow-y-auto font-mono text-sm">
                                    {missionData?.audit_trail?.map((log: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                            <div className="w-16 text-[10px] text-slate-500 pt-1">{log.timestamp}</div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${log.agent === 'SENTINEL' ? 'bg-amber-500/10 text-amber-500' :
                                                        log.agent === 'PROFILER' ? 'bg-purple-500/10 text-purple-500' :
                                                            log.agent === 'ADJUDICATOR' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                'bg-teal-500/10 text-teal-500'
                                                        }`}>
                                                        {log.agent}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                        {log.action}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 text-xs leading-relaxed">{log.details}</p>
                                            </div>
                                        </div>
                                    )) || (
                                            <div className="p-8 text-center text-slate-500 italic">No audit trail available for this mission.</div>
                                        )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>



            <style jsx global>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 1.5rem;
        }
        .hero-dot-grid {
          background-image: radial-gradient(rgba(51, 65, 85, 0.5) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>
            {/* PAYWALL OVERLAY */}
            <AnimatePresence>
                {isPaywallOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white text-slate-900 rounded-[2rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 to-teal-600" />

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Lock size={32} className="text-slate-400" />
                                </div>

                                <div>
                                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                                        {tier === 'tier3' ? 'Deep Simulation' : 'Standard Audit'}
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">Unlock Mission Access</h3>
                                    <p className="text-slate-500 font-medium">Finalize your mission configuration to enter the Lab environment with {tier === 'tier3' ? '200' : '50'} active personas.</p>
                                </div>

                                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-slate-600">Total</span>
                                        <span className="text-2xl font-black text-slate-900">
                                            {tier === 'tier3' ? 'Rs 23,940' : 'Rs 15,960'}
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">One-time payment</div>
                                </div>

                                <button
                                    onClick={handlePaywallSuccess}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-900/20"
                                >
                                    Proceed to Payment
                                </button>

                                <button
                                    onClick={() => setIsPaywallOpen(false)}
                                    className="text-slate-400 text-xs font-bold hover:text-slate-600"
                                >
                                    Cancel & Return to Config
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
}

export default function MissionControl() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        }>
            <MissionControlContent />
        </Suspense>
    );
}
