/* eslint-disable react-hooks/refs */
'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';

gsap.registerPlugin(useGSAP);

const AnimatedButton = ({ text = "Hover Me", href, className = "" }) => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const textRef = useRef(null);

    const { contextSafe } = useGSAP(() => {
        gsap.set(bgRef.current, { xPercent: -100 });
        // Start text as white to show up on the dark video background
        gsap.set(textRef.current, { color: "#ffffff" });
    }, { scope: containerRef });

    const handleMouseEnter = contextSafe(() => {
        gsap.to(bgRef.current, {
            xPercent: 0,
            duration: 0.4,
            ease: "power3.out"
        });

        // Text changes to black when the white background slides in
        gsap.to(textRef.current, {
            color: "#000000",
            duration: 0.4,
            ease: "power3.out"
        });
    });

    const handleMouseLeave = contextSafe(() => {
        gsap.to(bgRef.current, {
            xPercent: -100,
            duration: 0.4,
            ease: "power3.inOut"
        });

        gsap.to(textRef.current, {
            color: "#ffffff",
            duration: 0.4,
            ease: "power3.inOut"
        });
    });

    const innerContent = (
        <>
            <div
                ref={bgRef}
                className='absolute inset-0 bg-foreground z-10 w-full h-full'
            ></div>
            <div
                ref={textRef}
                className='relative z-20 font-bold'
            >
                {text}
            </div>
        </>
    );

    const baseClasses = `relative inline-flex max-w-full items-center justify-center overflow-hidden border-2 border-white px-4 py-2.5 text-center text-base leading-tight cursor-pointer sm:px-6 sm:py-3 sm:text-lg ${className}`;


    if (href) {
        return (
            <a
                href={href}
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={baseClasses}
            >
                {innerContent}
            </a>
        );
    }

    return (
        <button
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={baseClasses}
        >
            {innerContent}
        </button>
    );
};

export default AnimatedButton;
