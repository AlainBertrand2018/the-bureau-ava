"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Globe,
    Heart,
    Banknote,
    GraduationCap,
    Briefcase,
    MapPin,
    ChevronDown,
    Flag,
    Type
} from 'lucide-react';
import { AudienceTargeting } from '@/context/MissionContext';
import {
    COUNTRIES,
    AGE_GROUPS,
    MARITAL_STATUSES,
    REVENUE_GROUPS,
    EDUCATION_LEVELS,
    EMPLOYMENT_STATUSES,
    URBANIZATION_LEVELS
} from '@/constants/marketData';

interface DemographicCalibratorProps {
    value: AudienceTargeting;
    onChange: (value: AudienceTargeting) => void;
    dark?: boolean;
}

export default function DemographicCalibrator({ value, onChange, dark = false }: DemographicCalibratorProps) {
    const handleChange = (key: keyof AudienceTargeting, val: any) => {
        const updated = { ...value, [key]: val };

        // Dynamic resets when country changes
        if (key === 'country') {
            const countryData = COUNTRIES.find(c => c.id === val);
            if (val === "" || !countryData) {
                updated.region = "";
                updated.language = "";
            } else {
                updated.region = countryData.regions[0] || 'Nationwide';
                updated.language = countryData.languages[0] || 'Regardless';
            }
        }

        onChange(updated);
    };

    const selectedCountry = useMemo(() => {
        const found = COUNTRIES.find(c => c.id === value.country);
        // If not found or empty, return the "SELECT TARGET MARKET" placeholder at index 0
        return found || COUNTRIES[0];
    }, [value.country]);

    const hasSelection = value.country !== "";

    const inputBg = dark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200";
    const subLabelColor = dark ? "text-slate-500" : "text-slate-400";
    const textColor = dark ? "text-slate-200" : "text-slate-800";
    const accentColor = "text-emerald-500";

    const SelectWrapper = ({ label, icon: Icon, children, className = "" }: any) => (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center gap-2">
                <Icon size={12} className={accentColor} />
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${subLabelColor}`}>{label}</span>
            </div>
            <div className="relative group">
                {children}
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-emerald-500 transition-colors pointer-events-none" />
            </div>
        </div>
    );

    const RadioWrapper = ({ label, icon: Icon, options, current, onChangeKey, className = "" }: any) => (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center gap-2">
                <Icon size={12} className={accentColor} />
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${subLabelColor}`}>{label}</span>
            </div>
            <div className={`flex p-1 rounded-xl ${inputBg} border shadow-sm`}>
                {options.map((opt: string) => (
                    <button
                        key={opt}
                        onClick={() => handleChange(onChangeKey, opt)}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${current === opt
                            ? "bg-emerald-600 text-white shadow-md"
                            : `text-slate-500 hover:${textColor}`
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ROW 1: Market Anchors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectWrapper label="Market Country" icon={Flag}>
                    <select
                        value={value.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {COUNTRIES.map(c => (
                            <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                        ))}
                    </select>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                        {selectedCountry.flag}
                    </span>
                </SelectWrapper>

                <SelectWrapper label="Regional Focus" icon={MapPin} className={!hasSelection ? "opacity-40 pointer-events-none grayscale" : ""}>
                    <select
                        disabled={!hasSelection}
                        value={value.region}
                        onChange={(e) => handleChange('region', e.target.value)}
                        className={`w-full px-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {selectedCountry.regions.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </SelectWrapper>

                <SelectWrapper label="Local Linguistic Context" icon={Type} className={!hasSelection ? "opacity-40 pointer-events-none grayscale" : ""}>
                    <select
                        disabled={!hasSelection}
                        value={value.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                        className={`w-full px-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {selectedCountry.languages.map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </SelectWrapper>
            </div>

            {/* ROW 2: Identity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RadioWrapper
                    label="Gender"
                    icon={Users}
                    options={['Male', 'Female', 'Mixed']}
                    current={value.gender}
                    onChangeKey="gender"
                />

                <SelectWrapper label="Age Group" icon={Calendar}>
                    <select
                        value={value.age_group}
                        onChange={(e) => handleChange('age_group', e.target.value)}
                        className={`w-full px-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {AGE_GROUPS.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </SelectWrapper>

                <SelectWrapper label="Marital Status" icon={Heart}>
                    <select
                        value={value.marital_status}
                        onChange={(e) => handleChange('marital_status', e.target.value)}
                        className={`w-full px-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {MARITAL_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </SelectWrapper>
            </div>

            {/* ROW 3: Socio-Economics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectWrapper label="Revenue Group" icon={Banknote}>
                    <select
                        value={value.revenue_group}
                        onChange={(e) => handleChange('revenue_group', e.target.value)}
                        className={`w-full px-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {REVENUE_GROUPS.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </SelectWrapper>

                <SelectWrapper label="Education Level" icon={GraduationCap}>
                    <select
                        value={value.education_level}
                        onChange={(e) => handleChange('education_level', e.target.value)}
                        className={`w-full px-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {EDUCATION_LEVELS.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>
                </SelectWrapper>

                <SelectWrapper label="Employment Status" icon={Briefcase}>
                    <select
                        value={value.employment_status}
                        onChange={(e) => handleChange('employment_status', e.target.value)}
                        className={`w-full px-4 py-2.5 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                    >
                        {EMPLOYMENT_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </SelectWrapper>
            </div>

            {/* ROW 4: Perimeter */}
            <div className="pt-2">
                <RadioWrapper
                    label="Urbanization Density"
                    icon={MapPin}
                    options={URBANIZATION_LEVELS.map(u => u.name)}
                    current={value.urbanization}
                    onChangeKey="urbanization"
                    className="max-w-2xl"
                />
            </div>
        </div>
    );
}
