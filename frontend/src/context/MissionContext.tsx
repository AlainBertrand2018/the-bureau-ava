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

export interface MissionConfiguration {
    target_country: string;
    target_region: string;
    target_language: string;
    target_audience: string;
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
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: React.ReactNode }) {
    const [currentMission, setCurrentMission] = useState<Mission | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
        <MissionContext.Provider value={{ currentMission, setMission: handleSetMission, isLoading, setIsLoading }}>
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
