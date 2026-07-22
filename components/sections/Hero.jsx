'use client';
import React, { useRef } from 'react';
import AnimatedButton from '../shared/AnimatedButton';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { SplitText } from 'gsap/SplitText';
import { useIntroAnimation } from '../layout/ClientLayout';

gsap.config({ force3D: true })


gsap.registerPlugin(useGSAP, SplitText)

const videoLink = '/bgVideo.mp4';
const HeroContent = {
    subtitle: `Trusted experts providing quality solutions designed to protect what matters most.`,
    title: `Protect Your Home`,
    titleHighlight: `With Our Roofing Services`,
    button: {
        name: 'Contact Us',
        link: `tel:4695443768`
    }
}

const Hero = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const desRef = useRef(null);
    const buttonRef = useRef(null);
    const { introComplete } = useIntroAnimation();

    useGSAP(() => {
        if (!introComplete) return;

        let titleSplit;
        let desSplit;
        let tl;
        let isMounted = true;

        document.fonts.ready.then(() => {
            if (!isMounted) return;

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.set(containerRef.current, { autoAlpha: 1 });
                return;
            }

            titleSplit = new SplitText(titleRef.current, {
                type: 'lines',
                mask: 'lines'
            });

            desSplit = new SplitText(desRef.current, {
                type: 'lines',
                mask: 'lines'
            });

            tl = gsap.timeline({
                defaults: {
                    ease: 'expo.out'
                }
            });

            gsap.set(containerRef.current, { autoAlpha: 1 });
            gsap.set([titleSplit.lines, desSplit.lines], {
                transformOrigin: 'left bottom',
                willChange: 'transform, opacity, filter'
            });
            gsap.set(buttonRef.current, {
                willChange: 'transform, opacity'
            });

            tl.from(titleSplit.lines, {
                yPercent: 105,
                duration: 1.15,
                stagger: 0.12,
            })
                .from(desSplit.lines, {
                    yPercent: 105,
                    duration: 0.95,
                    stagger: 0.08,
                }, "-=0.72")
                .from(buttonRef.current, {
                    y: 18,
                    opacity: 0,
                    duration: 0.85,
                }, "-=0.5")
                .set([titleSplit.lines, desSplit.lines, buttonRef.current], {
                    clearProps: 'willChange,filter'
                });
        });

        return () => {
            isMounted = false;
            tl?.kill();
            titleSplit?.revert();
            desSplit?.revert();
        };
    }, { scope: containerRef, dependencies: [introComplete], revertOnUpdate: true });

    return (
        <>
            <div className="fixed inset-0 -z-10 bg-black">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={videoLink} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>
            </div>

            {/* 2. HERO CONTENT */}
            <main
                ref={containerRef}
                data-hero-section
                className="invisible relative flex min-h-[100svh] w-full items-end  pb-8 pt-24  sm:pb-10  md:pb-14 containerPadding"
            >
                <div className="z-10 flex w-full flex-col gap-8 xl:flex-row xl:items-end xl:justify-between xl:gap-12">

                    <div className="flex max-w-4xl flex-col gap-5 sm:gap-6 md:gap-8">

                        <h1 ref={titleRef} className="flex flex-col font-inter text-[clamp(2.25rem,min(9vw,10svh),4.5rem)] leading-[1.08] text-foreground tracking-tight">
                            <span className="font-extrabold">{HeroContent.title}</span>
                            <span className="mt-2 font-light text-foreground/85">{HeroContent.titleHighlight}</span>
                        </h1>

                        <p ref={desRef} className="max-w-xl text-base font-light tracking-wide text-foreground/85 sm:text-lg md:text-xl">
                            {HeroContent.subtitle}
                        </p>

                    </div>

                    {/* Bottom Right: Call to Action / Button */}
                    <div
                        ref={buttonRef}
                        className="flex w-full max-w-sm flex-wrap gap-2 items-stretch sm:w-auto sm:items-start xl:items-end "
                    >
                        <AnimatedButton
                            text={HeroContent.button.name}
                            href={HeroContent.button.link}
                            className="w-full sm:w-auto"
                        />
                        <AnimatedButton
                            text={'Book An appointment'}
                            href={HeroContent.button.link}
                            className="w-full sm:w-auto"
                        />
                    </div>

                </div>
            </main>
        </>
    );
};

export default Hero;
