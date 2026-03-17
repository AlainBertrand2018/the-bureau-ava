"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

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
    refreshClearance: () => Promise<void>;
}

const ClearanceContext = createContext<ClearanceContextType | undefined>(undefined);

export const ClearanceProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userEmail, setUserEmail] = useState("");
    const [clearanceLevel, setClearanceLevel] = useState(0);
    const [credits, setCredits] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchClearance = async (email: string) => {
        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
            const response = await fetch(`${apiUrl}/conductor/clearance?email=${email}`);
            if (response.ok) {
                const data = await response.json();
                setClearanceLevel(data.clearance_level || 0);
                setCredits(data.credits ?? 0);
            }
        } catch (err) {
            console.error("Failed to fetch clearance:", err);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setUserEmail(currentUser.email || "");
                setIsAuthenticated(true);
                fetchClearance(currentUser.email || "");
            } else {
                setUserEmail("");
                setIsAuthenticated(false);
                setCredits(0);
                setClearanceLevel(0);
            }
            setIsLoaded(true);
        });

        return () => unsubscribe();
    }, []);

    const updateClearance = async (level: number) => {
        if (!userEmail) return;
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
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            return true;
        } catch (err) {
            console.error("Login failed:", err);
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const isSuperAdmin = (clearanceLevel >= 10 || userEmail === "bertrand.chagal@gmail.com") && isAuthenticated;

    return (
        <ClearanceContext.Provider
            value={{
                userEmail,
                setUserEmail,
                clearanceLevel,
                setClearanceLevel,
                credits: isSuperAdmin ? 9999999 : credits,
                spendCredits: async (amount: number) => {
                    return credits >= amount || isSuperAdmin;
                },
                isSuperAdmin,
                isAuthenticated,
                isLoaded,
                updateClearance,
                login,
                logout,
                isSyncing,
                refreshClearance: () => fetchClearance(userEmail)
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
