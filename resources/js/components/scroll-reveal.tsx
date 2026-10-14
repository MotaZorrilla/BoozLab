import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if already in viewport immediately (e.g. Hero on page load)
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setIsVisible(true);
                return;
            }
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -30px 0px',
            },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const directionTransform = {
        up: 'translate-y-7',
        down: '-translate-y-7',
        left: 'translate-x-7',
        right: '-translate-x-7',
        none: 'translate-y-0',
    }[direction];

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: `${delay}ms`,
            }}
            className={`transition-all duration-700 ease-out will-change-[transform,opacity] ${
                isVisible
                    ? 'opacity-100 translate-x-0 translate-y-0 filter-none'
                    : `opacity-0 ${directionTransform} blur-[0.5px]`
            } ${className}`}
        >
            {children}
        </div>
    );
}
