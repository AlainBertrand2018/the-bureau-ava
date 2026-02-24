"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ─── GSAP Reveal Wrapper ─── */
export function Reveal({
    children,
    className = "",
    delay = 0,
    y = 40,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
}) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(elementRef.current, {
                opacity: 0,
                y: y,
                duration: 1,
                ease: "power3.out",
                delay: delay,
                scrollTrigger: {
                    trigger: elementRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
            });
        });
        return () => ctx.revert();
    }, [delay, y]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
}

/* ─── Animated Counter ─── */
export const AnimatedCounter = React.memo(function AnimatedCounter({
    target,
    suffix = "",
    className = "",
    duration = 2,
}: {
    target: number;
    suffix?: string;
    className?: string;
    duration?: number;
}) {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    const obj = useRef({ value: 0 });

    useEffect(() => {
        obj.current.value = 0;
        const ctx = gsap.context(() => {
            gsap.to(obj.current, {
                value: target,
                duration: duration,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: countRef.current,
                    start: "top 90%",
                },
                onUpdate: () => {
                    setCount(Math.round(obj.current.value));
                },
            });
        });
        return () => ctx.revert();
    }, [target, duration]);

    return (
        <span ref={countRef} className={className}>
            {count.toLocaleString()}{suffix}
        </span>
    );
});
