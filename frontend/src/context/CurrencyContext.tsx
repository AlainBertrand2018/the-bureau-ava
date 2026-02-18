"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type CurrencyCode = 'EUR' | 'MUR' | 'USD' | 'GBP';

interface PricingTier {
    price: number;
    symbol: string;
}

interface CurrencyConfig {
    code: CurrencyCode;
    symbol: string;
    tiers: {
        tier1: PricingTier;
        tier2: PricingTier;
        tier3: PricingTier;
        genesis: PricingTier;
    };
    riskRange: string;
    icebergDesign: string;
    icebergRecruitment: string;
    icebergCollection: string;
    icebergAnalysis: string;
}

const BASE_EUR_CONFIG = {
    tier1: 0,
    tier2: 280,
    tier3: 420,
    genesis: 350,
    riskRange: [4000, 16000],
    icebergDesign: [1000, 3000],
    icebergRecruitment: [2000, 8000],
    icebergCollection: [400, 1000],
    icebergAnalysis: [600, 2000],
};

const FALLBACK_RATES: Record<CurrencyCode, number> = {
    EUR: 1,
    MUR: 53.58,
    USD: 1.179,
    GBP: 0.89,
};

const SYMBOLS: Record<CurrencyCode, string> = {
    EUR: '€',
    MUR: 'Rs',
    USD: '$',
    GBP: '£',
};

const roundToTen = (val: number) => Math.round(val / 10) * 10;

const formatPrice = (val: number, code: CurrencyCode) => {
    return roundToTen(val);
};

const generateConfig = (code: CurrencyCode, currentRates: Record<string, number>): CurrencyConfig => {
    const rate = currentRates[code] || FALLBACK_RATES[code];
    const symbol = SYMBOLS[code];

    const t1 = formatPrice(BASE_EUR_CONFIG.tier1 * rate, code);
    const t2 = formatPrice(BASE_EUR_CONFIG.tier2 * rate, code);
    const t3 = formatPrice(BASE_EUR_CONFIG.tier3 * rate, code);
    const tg = formatPrice(BASE_EUR_CONFIG.genesis * rate, code);

    const convRange = (range: number[]) => {
        const low = formatPrice(range[0] * rate, code);
        const high = formatPrice(range[1] * rate, code);
        const fmt = (v: number) => v.toLocaleString();
        return `${symbol}${fmt(low)} — ${fmt(high)}`;
    };

    const convRangeSimple = (range: number[]) => {
        const low = formatPrice(range[0] * rate, code);
        const high = formatPrice(range[1] * rate, code);

        const lStr = code === 'MUR' && low >= 1000 ? `${low / 1000}k` : low.toLocaleString();
        const hStr = code === 'MUR' && high >= 1000 ? `${high / 1000}k` : high.toLocaleString();

        return `${symbol}${lStr} – ${hStr}`;
    };

    return {
        code,
        symbol,
        tiers: {
            tier1: { price: t1, symbol },
            tier2: { price: t2, symbol },
            tier3: { price: t3, symbol },
            genesis: { price: tg, symbol },
        },
        riskRange: convRange(BASE_EUR_CONFIG.riskRange),
        icebergDesign: convRangeSimple(BASE_EUR_CONFIG.icebergDesign),
        icebergRecruitment: convRangeSimple(BASE_EUR_CONFIG.icebergRecruitment),
        icebergCollection: convRangeSimple(BASE_EUR_CONFIG.icebergCollection),
        icebergAnalysis: convRangeSimple(BASE_EUR_CONFIG.icebergAnalysis),
    };
};

interface CurrencyContextType {
    currency: CurrencyConfig;
    setCurrencyByCode: (code: CurrencyCode) => void;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [currency, setCurrency] = useState<CurrencyConfig>(() => generateConfig('EUR', FALLBACK_RATES));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initCurrency = async () => {
            let activeRates = FALLBACK_RATES;
            let detectedCode: CurrencyCode = 'EUR';

            try {
                const rateRes = await fetch('https://open.er-api.com/v6/latest/EUR');
                if (rateRes.ok) {
                    const rateData = await rateRes.json();
                    const markup = 1.05;
                    activeRates = {
                        EUR: 1,
                        MUR: (rateData.rates.MUR || FALLBACK_RATES.MUR) * markup,
                        USD: (rateData.rates.USD || FALLBACK_RATES.USD) * markup,
                        GBP: (rateData.rates.GBP || FALLBACK_RATES.GBP) * markup,
                    };
                    setRates(activeRates);
                }

            } catch (error) {
                console.warn("Using fallback rates:", error);
            }

            try {
                const ipRes = await fetch('https://ipapi.co/json/');
                if (ipRes.ok) {
                    const ipData = await ipRes.json();
                    if (ipData.country_code === 'MU') detectedCode = 'MUR';
                    else if (ipData.country_code === 'GB') detectedCode = 'GBP';
                    else if (['US', 'CA', 'AU'].includes(ipData.country_code)) detectedCode = 'USD';
                }
            } catch (error) {
                console.warn("Location detection failed, defaulting to EUR:", error);
            } finally {
                setCurrency(generateConfig(detectedCode, activeRates));
                setIsLoading(false);
            }
        };

        initCurrency();
    }, []);

    const setCurrencyByCode = useCallback((code: CurrencyCode) => {
        setCurrency(generateConfig(code, rates));
    }, [rates]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrencyByCode, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
