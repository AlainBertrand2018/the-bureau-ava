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
    consumeCredits: (amount: number) => void;
    addCredits: (amount: number) => void;
}

const ClearanceContext = createContext<ClearanceContextType | undefined>(undefined);

export const ClearanceProvider = ({ children }: { children: ReactNode }) => {
    const [userEmail, setUserEmail] = useState("bertrand.chagal@gmail.com");
    const [clearanceLevel, setClearanceLevel] = useState(0);
    const [credits, setCredits] = useState(1000000);
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
                // Initial Load from LocalStorage (Simulated Garage)
                const savedCredits = localStorage.getItem('ava_sovereign_credits');
                if (savedCredits && parseInt(savedCredits) >= 1000000) {
                    setCredits(parseInt(savedCredits));
                } else {
                    // Force 1,000,000 for presentation
                    setCredits(1000000);
                    localStorage.setItem('ava_sovereign_credits', '1000000');
                }

                const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
                const response = await fetch(`${apiUrl}/conductor/clearance?email=${userEmail}`);
                if (response.ok) {
                    const data = await response.json();
                    setClearanceLevel(data.clearance_level || 0);
                    // Server-side credits would go here in production
                }
            } catch (err) {
                console.error("Failed to fetch clearance:", err);
            }
        };
        fetchClearance();
    }, [userEmail]);

    const consumeCredits = (amount: number) => {
        // Presentation Bypass: No consumption
        console.log("Presentation Mode: Bypassing credit consumption of", amount);
        return;
    };

    const addCredits = (amount: number) => {
        setCredits(prev => {
            const newBalance = prev + amount;
            localStorage.setItem('ava_sovereign_credits', newBalance.toString());
            return newBalance;
        });
    };

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
        // Presentation Bypass
        return true;
    };

    const isSuperAdmin = (clearanceLevel >= 10 || userEmail === "bertrand.chagal@gmail.com") && isAuthenticated;

    // Effectively unlimited credits for Super Admin
    const actualCredits = isSuperAdmin ? 999999999 : credits;

    return (
        <ClearanceContext.Provider
            value={{
                userEmail,
                setUserEmail,
                clearanceLevel,
                setClearanceLevel,
                credits: actualCredits,
                spendCredits: async (amount: number) => {
                    if (isSuperAdmin) return true;
                    return spendCredits(amount);
                },
                isSuperAdmin,
                isAuthenticated,
                isLoaded,
                updateClearance,
                login,
                logout,
                isSyncing,
                consumeCredits,
                addCredits,
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
