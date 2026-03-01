"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ClearanceContextType {
    userEmail: string;
    setUserEmail: (email: string) => void;
    clearanceLevel: number;
    setClearanceLevel: (level: number) => void;
    credits: number;
    spendCredits: (amount: number) => Promise<boolean>;
    isSuperAdmin: boolean;
    isAuthenticated: boolean;
    isLoaded: boolean;
    updateClearance: (level: number) => Promise<void>;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    isSyncing: boolean;
}

const ClearanceContext = createContext<ClearanceContextType | undefined>(undefined);

export const ClearanceProvider = ({ children }: { children: ReactNode }) => {
    const [userEmail, setUserEmail] = useState("bertrand.chagal@gmail.com");
    const [clearanceLevel, setClearanceLevel] = useState(0);
    const [credits, setCredits] = useState(100);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Sync with backend on mount or email change
    useEffect(() => {
        // Hydrate auth status from localStorage
        const storedAuth = localStorage.getItem("bureau_auth");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
        }
        setIsLoaded(true);

        const fetchClearance = async () => {
            try {
                const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
                const response = await fetch(`${apiUrl}/conductor/clearance?email=${userEmail}`);
                if (response.ok) {
                    const data = await response.json();
                    setClearanceLevel(data.clearance_level || 0);
                    setCredits(data.credits || 0);
                }
            } catch (err) {
                console.error("Failed to fetch clearance:", err);
            }
        };
        fetchClearance();
    }, [userEmail]);

    const updateClearance = async (level: number) => {
        setIsSyncing(true);
        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
            await fetch(`${apiUrl}/conductor/clearance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, level }),
            });
            setClearanceLevel(level);
        } catch (err) {
            console.error("Clearance update failed:", err);
        } finally {
            setIsSyncing(false);
        }
    };

    const login = async (email: string, pass: string): Promise<boolean> => {
        // SPECIFIC BUREAU CREDENTIALS
        if (email === "bertrand.chagal@gmail.com" && pass === "ab@280765") {
            setIsAuthenticated(true);
            setUserEmail(email);
            localStorage.setItem("bureau_auth", "true");
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("bureau_auth");
    };

    const spendCredits = async (amount: number): Promise<boolean> => {
        if (credits < amount) return false;

        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
            const response = await fetch(`${apiUrl}/conductor/credits`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, amount }),
            });
            if (response.ok) {
                setCredits(prev => prev - amount);
                return true;
            }
        } catch (err) {
            console.error("Credit deduction failed:", err);
        }
        return false;
    };

    const isSuperAdmin = clearanceLevel >= 10 && isAuthenticated;

    return (
        <ClearanceContext.Provider
            value={{
                userEmail,
                setUserEmail,
                clearanceLevel,
                setClearanceLevel,
                credits,
                spendCredits,
                isSuperAdmin,
                isAuthenticated,
                isLoaded,
                updateClearance,
                login,
                logout,
                isSyncing,
            }}
        >
            {children}
        </ClearanceContext.Provider>
    );
};

export const useClearance = () => {
    const context = useContext(ClearanceContext);
    if (context === undefined) {
        throw new Error("useClearance must be used within a ClearanceProvider");
    }
    return context;
};
