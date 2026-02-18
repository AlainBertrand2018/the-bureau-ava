"use client";
import React from 'react';
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
    ChevronDown
} from 'lucide-react';
import { AudienceTargeting } from '@/context/MissionContext';

interface AudienceConfiguratorProps {
    value: AudienceTargeting;
    onChange: (value: AudienceTargeting) => void;
    dark?: boolean;
}

export default function AudienceConfigurator({ value, onChange, dark = false }: AudienceConfiguratorProps) {
    const handleChange = (key: keyof AudienceTargeting, val: any) => {
        onChange({ ...value, [key]: val });
    };

    const inputBg = dark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200";
    const labelColor = dark ? "text-indigo-100" : "text-slate-900";
    const subLabelColor = dark ? "text-slate-500" : "text-slate-400";
    const textColor = dark ? "text-slate-200" : "text-slate-800";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Country Selection */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Globe size={14} className="text-indigo-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Target Country</span>
                </div>
                <div className="relative">
                    <select
                        value={value.country || 'Mauritius'}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className={`w-full px-4 py-2 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-indigo-500/40`}
                    >
                        <option value="Mauritius">Mauritius</option>
                        <option value="France">France</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="India">India</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Australia">Australia</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-blue-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Gender (Mandatory)</span>
                </div>
                <div className={`flex p-1 rounded-xl ${inputBg} border`}>
                    {['Male', 'Female', 'All'].map((g) => (
                        <button
                            key={g}
                            onClick={() => handleChange('gender', g)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${value.gender === g
                                ? "bg-blue-600 text-white shadow-lg"
                                : `text-slate-500 hover:${textColor}`
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Age Range */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Age Group (Min: {value.age_range[0]} - Max: {value.age_range[1]})</span>
                </div>
                <div className="flex gap-3">
                    <input
                        type="number"
                        value={value.age_range[0]}
                        onChange={(e) => handleChange('age_range', [parseInt(e.target.value) || 0, value.age_range[1]])}
                        className={`w-full px-4 py-2 text-xs font-bold rounded-xl border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
                        placeholder="Min"
                        min={0}
                        max={100}
                    />
                    <input
                        type="number"
                        value={value.age_range[1]}
                        onChange={(e) => handleChange('age_range', [value.age_range[0], parseInt(e.target.value) || 100])}
                        className={`w-full px-4 py-2 text-xs font-bold rounded-xl border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
                        placeholder="Max"
                        min={0}
                        max={100}
                    />
                </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Heart size={14} className="text-pink-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Marital Status</span>
                </div>
                <div className="relative">
                    <select
                        value={value.marital_status}
                        onChange={(e) => handleChange('marital_status', e.target.value)}
                        className={`w-full px-4 py-2 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-pink-500/40`}
                    >
                        <option value="Any">Any Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Revenue Range */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Banknote size={14} className="text-amber-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Revenue (Annual Tier)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">$</span>
                        <input
                            type="number"
                            value={value.revenue_range[0]}
                            onChange={(e) => handleChange('revenue_range', [parseInt(e.target.value) || 0, value.revenue_range[1]])}
                            className={`w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
                            placeholder="Min"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">$</span>
                        <input
                            type="number"
                            value={value.revenue_range[1]}
                            onChange={(e) => handleChange('revenue_range', [value.revenue_range[0], parseInt(e.target.value) || 0])}
                            className={`w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
                            placeholder="Max"
                        />
                    </div>
                </div>
            </div>

            {/* Education Level (Refinement) */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-purple-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Education level</span>
                </div>
                <div className="relative">
                    <select
                        value={value.education_level}
                        onChange={(e) => handleChange('education_level', e.target.value)}
                        className={`w-full px-4 py-2 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-purple-500/40`}
                    >
                        <option value="Any">Any Level</option>
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                        <option value="University">University</option>
                        <option value="Postgraduate">Postgraduate</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Employment Sector (Refinement) */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-cyan-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Employment Sector</span>
                </div>
                <div className="relative">
                    <select
                        value={value.employment_sector}
                        onChange={(e) => handleChange('employment_sector', e.target.value)}
                        className={`w-full px-4 py-2 text-xs font-bold rounded-xl border appearance-none ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-cyan-500/40`}
                    >
                        <option value="Any">Any Sector</option>
                        <option value="Private">Private Sector</option>
                        <option value="Public">Public Sector</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Student">Student</option>
                        <option value="Unemployed">Unemployed / Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Urbanization (Refinement) */}
            <div className="space-y-3 lg:col-span-2">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-red-500" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${subLabelColor}`}>Urbanization Density</span>
                </div>
                <div className={`flex p-1 rounded-xl ${inputBg} border`}>
                    {['Urban', 'Suburban', 'Rural', 'Any'].map((u) => (
                        <button
                            key={u}
                            onClick={() => handleChange('urbanization', u)}
                            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${value.urbanization === u
                                ? "bg-red-600 text-white shadow-lg"
                                : `text-slate-500 hover:${textColor}`
                                }`}
                        >
                            {u}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
