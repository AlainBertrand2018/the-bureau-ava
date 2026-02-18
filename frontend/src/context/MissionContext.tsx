"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PersonaArchetype {
    name: string;
    role: string;
    traits: string;
    background: string;
}

export interface CulturalDossier {
    country: string;
    economic_context: string;
    cultural_axioms: string[];
    linguistic_nuances: string[];
    taboos: string[];
    demographic_archetypes: PersonaArchetype[];
    fieldwork_etiquette: string[];
    citation_index: string[];
}

export interface AudienceTargeting {
    gender: 'Male' | 'Female' | 'All';
    age_range: [number, number];
    marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Any';
    revenue_range: [number, number];
    education_level: 'Primary' | 'Secondary' | 'University' | 'Postgraduate' | 'Any';
    employment_sector: string;
    urbanization: 'Urban' | 'Suburban' | 'Rural' | 'Any';
    country: string;
}

export interface MissionConfiguration {
    target_country: string;
    target_region: string;
    target_language: string;
    target_audience: string;
    targeting_refinement?: AudienceTargeting;
    research_topic?: string;
}

export interface MissionLogEntry {
    timestamp: string;
    agent: string;
    action: string;
    details: string;
}

export interface Mission {
    mission_id: string;
    config: MissionConfiguration;
    dossier: CulturalDossier;
    audit_trail: MissionLogEntry[];
    created_at: number;
}

interface MissionContextType {
    currentMission: Mission | null;
    setMission: (mission: Mission | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    tier: 'tier1' | 'tier2' | 'tier3';
    setTier: (tier: 'tier1' | 'tier2' | 'tier3') => void;
    limits: { maxPersonas: number; maxQuestions: number };
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: React.ReactNode }) {
    const [currentMission, setCurrentMission] = useState<Mission | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tier, setTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');

    const limits = {
        tier1: { maxPersonas: 10, maxQuestions: 3 },
        tier2: { maxPersonas: 50, maxQuestions: 20 },
        tier3: { maxPersonas: 200, maxQuestions: 50 }
    }[tier];

    // Persistence logic
    useEffect(() => {
        const saved = localStorage.getItem('active_mission');
        if (saved) {
            try {
                setCurrentMission(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved mission", e);
            }
        }
    }, []);

    const handleSetMission = (mission: Mission | null) => {
        setCurrentMission(mission);
        if (mission) {
            localStorage.setItem('active_mission', JSON.stringify(mission));
        } else {
            localStorage.removeItem('active_mission');
        }
    };

    return (
        <MissionContext.Provider value={{
            currentMission,
            setMission: handleSetMission,
            isLoading,
            setIsLoading,
            error,
            setError,
            tier,
            setTier,
            limits
        }}>
            {children}
        </MissionContext.Provider>
    );
}

export function useMission() {
    const context = useContext(MissionContext);
    if (context === undefined) {
        throw new Error('useMission must be used within a MissionProvider');
    }
    return context;
}
