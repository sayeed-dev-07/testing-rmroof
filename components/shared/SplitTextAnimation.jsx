'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

gsap.config({
    force3D: true
})
const SplitTextAnimation = ({ children, className }) => {
    const textRef = useRef(null);

    useGSAP(() => {
        if (!textRef.current) return;

        document.fonts.ready.then(() => {
            const splitText = new SplitText(textRef.current, {
                type: 'lines',
                // Assuming you have a custom CSS class or GSAP wrapper handling the mask
                mask: 'lines'
            });

            gsap.from(splitText.lines, {
                yPercent: 100,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 86%'
                }
            });
        });
    }, { scope: textRef });

    return (
        <div ref={textRef} className={className}>
            {children}
        </div>
    );
};

export default SplitTextAnimation;