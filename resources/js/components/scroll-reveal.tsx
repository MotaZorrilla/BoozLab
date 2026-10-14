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

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px',
            },
        );

        const currentRef = ref.current;
        if (currentRef) {
            // Si ya está visible al cargar, dar un tick mínimo para que la transición CSS sea perceptible
            const rect = currentRef.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 40 + delay);
                return () => clearTimeout(timer);
            }

            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
            observer.disconnect();
        };
    }, [delay]);

    const directionTransform = {
        up: 'translate-y-12 sm:translate-y-16 scale-[0.97]',
        down: '-translate-y-12 sm:-translate-y-16 scale-[0.97]',
        left: 'translate-x-12 sm:translate-x-16 scale-[0.97]',
        right: '-translate-x-12 sm:-translate-x-16 scale-[0.97]',
        none: 'translate-y-0 scale-95',
    }[direction];

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: `${delay}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className={`transition-all duration-700 will-change-[transform,opacity] ${
                isVisible
                    ? 'opacity-100 translate-x-0 translate-y-0 scale-100 filter-none'
                    : `opacity-0 ${directionTransform} blur-[1px]`
            } ${className}`}
        >
            {children}
        </div>
    );
}
