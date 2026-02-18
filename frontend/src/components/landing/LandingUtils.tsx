"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Scroll Animation Wrapper ─── */
export function Reveal({
    children,
    className = "",
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─── Animated Counter ─── */
export function AnimatedCounter({
    target,
    suffix = "",
    className = "",
}: {
    target: number;
    suffix?: string;
    className?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 1800;
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, target]);

    return (
        <span ref={ref} className={className}>
            {count}{suffix}
        </span>
    );
}
