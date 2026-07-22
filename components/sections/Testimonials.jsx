'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

gsap.config({
    force3D: true
})

const testimonialsData = [
    {
        id: 1,
        quote: "IT WAS AN ABSOLUTE PLEASURE TO PARTNER WITH THEM. THE FEEDBACK WE HAVE RECEIVED HAS BEEN RESOUNDINGLY POSITIVE.",
        author: "Holly, Purpose Conference"
    },
    {
        id: 2,
        quote: "THE ATTENTION TO DETAIL AND STRUCTURAL INTEGRITY THEY BROUGHT WAS UNPARALLELED. IT IS A METICULOUSLY CRAFTED MASTERPIECE.",
        author: "Eleanor Vance, Estate Owner"
    },
    {
        id: 3,
        quote: "A MASTERCLASS IN MODERN ARCHITECTURAL PRESERVATION. THEY NAVIGATED COMPLEX WEATHERPROOFING WITH ABSOLUTE PRECISION.",
        author: "Julian Crane, Lead Architect"
    },
    {
        id: 4,
        quote: "THEY DON'T JUST FIX PROBLEMS; THEY ENGINEER PERMANENT SOLUTIONS. OUR FACILITY HAS NEVER BEEN MORE SECURE.",
        author: "Marcus Thorne, Facility Director"
    }
];

const Testimonials = () => {
    const containerRef = useRef(null);
    const lineRef = useRef(null);
    const titleClientRef = useRef(null);
    const titleVoicesRef = useRef(null);

    // Animation Refs
    const quoteSectionRef = useRef(null);
    const quoteTextRef = useRef(null);
    const authorTextRef = useRef(null);
    const splitRef = useRef(null);
    const isTransitioningRef = useRef(false);

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const count = testimonialsData.length;
    const { contextSafe } = useGSAP({ scope: containerRef });

    // ------------------------------------------------------------
    // INITIAL ENTRANCE ANIMATION
    // ------------------------------------------------------------
    useGSAP(() => {
        const splitTitle = new SplitText([titleClientRef.current, titleVoicesRef.current], {
            type: 'lines',
            mask: 'lines'
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 85%',
            }
        });

        tl.to(lineRef.current, { x: 0, duration: 0.6, ease: 'power3.out' }, 0);

        tl.from(splitTitle.lines, {
            yPercent: 105,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
        }, 0.1);

        tl.from(".slider-controls", {
            opacity: 0,
            x: -20,
            duration: 0.8,
            ease: "power2.out"
        }, 0.6);

        // Animate first quote in
        splitRef.current = new SplitText(quoteTextRef.current, { type: "lines", mask: "lines" });
        tl.from(splitRef.current.lines, {
            yPercent: 105,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power4.out"
        }, 0.6);

        return () => {
            splitTitle.revert();
            splitRef.current?.revert();
        };
    }, []);

    // ------------------------------------------------------------
    // MASTER TRANSITION (Copied exact logic from working slider)
    // ------------------------------------------------------------
    const transitionQuote = (newIndex, direction) => {
        contextSafe(() => {
            if (isTransitioningRef.current || !quoteTextRef.current || !quoteSectionRef.current || newIndex === currentIndex) return;
            isTransitioningRef.current = true;
            setIsTransitioning(true);

            const textEl = quoteTextRef.current;
            const section = quoteSectionRef.current;

            // 1. Kill leftovers
            gsap.killTweensOf(textEl);
            splitRef.current?.revert();
            splitRef.current = null;

            // 2. Split current
            const oldSplit = new SplitText(textEl, {
                type: "lines",
                mask: "lines"
            });

            splitRef.current = oldSplit;

            const tl = gsap.timeline();

            // 3. EXIT OLD
            tl.to(oldSplit.lines, {
                yPercent: direction === 'next' ? -100 : 100,
                autoAlpha: 0,
                duration: 0.45,
                stagger: 0.05,
                ease: "power2.in"
            });

            // 4. HIDE WRAPPER
            tl.set(textEl, { autoAlpha: 0 });

            // 5. HEIGHT LOCK + SWAP
            tl.add(() => {
                // lock old height
                const oldHeight = section.offsetHeight;
                gsap.set(section, { height: oldHeight });
                const nextTestimonial = testimonialsData[newIndex];

                // cleanup old
                oldSplit.revert();
                splitRef.current = null;

                // swap content before SplitText touches the DOM again
                textEl.textContent = nextTestimonial.quote;
                if (authorTextRef.current) {
                    authorTextRef.current.textContent = nextTestimonial.author;
                }
                setCurrentIndex(newIndex);

                // Wait for React to render, then re-split and animate
                requestAnimationFrame(() => {
                    const nextTextEl = quoteTextRef.current;
                    const nextSection = quoteSectionRef.current;

                    if (!nextTextEl || !nextSection) {
                        isTransitioningRef.current = false;
                        setIsTransitioning(false);
                        return;
                    }

                    // --- TWO PHASE HEIGHT MEASURE ---

                    // allow auto height
                    gsap.set(nextSection, { height: "auto" });
                    const newHeight = nextSection.offsetHeight;

                    // relock to old
                    gsap.set(nextSection, { height: oldHeight });

                    // animate height
                    gsap.to(nextSection, {
                        height: newHeight,
                        duration: 0.8,
                        ease: "power3.inOut",
                        onComplete: () => {
                            gsap.set(nextSection, { clearProps: "height" });
                        }
                    });

                    // SPLIT NEW
                    const newSplit = new SplitText(nextTextEl, {
                        type: "lines",
                        mask: "lines"
                    });

                    splitRef.current = newSplit;

                    gsap.set(newSplit.lines, {
                        yPercent: direction === 'next' ? 100 : -100,
                        autoAlpha: 0
                    });

                    gsap.set(nextTextEl, { autoAlpha: 1 });

                    // ENTER NEW
                    gsap.to(newSplit.lines, {
                        yPercent: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: "power4.out",
                        onComplete: () => {
                            isTransitioningRef.current = false;
                            setIsTransitioning(false); // Unlock UI
                        }
                    });
                });
            });
        })();
    };

    const handleNext = () => {
        if (currentIndex < count - 1) {
            transitionQuote(currentIndex + 1, 'next');
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            transitionQuote(currentIndex - 1, 'prev');
        }
    };

    const prevDisabled = isTransitioning || currentIndex === 0;
    const nextDisabled = isTransitioning || currentIndex === count - 1;

    return (
        <section
            ref={containerRef}
            className="w-full bg-[#f7f5f0] text-black py-10 lg:py-32 flex flex-col items-center overflow-hidden min-h-screen"
        >
            <div className='w-full containerPadding relative px-4 md:px-8'>

                {/* Header Block */}
                <div className='w-fit overflow-hidden mb-8 lg:mb-20'>
                    <p className='text-3xl md:text-4xl font-bold uppercase tracking-tighter'>04 / Testimonials</p>
                    <div ref={lineRef} className='w-full h-[3px] bg-black -translate-x-full mt-2' />
                </div>

                {/* Massive Typographic Headline */}
                <div className='flex flex-col relative w-full mb-16 lg:mb-32'>
                    <div className='relative z-20 w-full flex justify-between items-end'>
                        <h1 ref={titleClientRef} className='text-[20vw] lg:text-[14vw] leading-[0.8] font-black uppercase tracking-tighter m-0'>
                            CLIENT
                        </h1>
                        <div className="hidden lg:flex fade-item flex-col text-right mb-4 pr-12">
                            <span className="text-sm font-bold tracking-widest uppercase">Reputation</span>
                            <span className="text-sm text-black/60 font-medium tracking-widest uppercase">Trusted</span>
                        </div>
                    </div>

                    <div className='relative flex w-full items-start md:-mt-3'>
                        <div className='w-full flex flex-col relative z-20'>
                            <h1 ref={titleVoicesRef} className='text-[20vw] lg:text-[14vw] leading-[0.8] font-black uppercase tracking-tighter '>
                                VOICES
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Slider Layout */}
                <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start pt-8 border-t border-black/10">

                    {/* Controls */}
                    <div className="slider-controls flex gap-4 lg:w-1/4 shrink-0 mt-2">
                        <button
                            onClick={handlePrev}
                            disabled={prevDisabled}
                            className={`w-14 h-14 rounded-full border-2 border-black flex items-center justify-center transition-all duration-300 group ${prevDisabled
                                ? 'opacity-20 cursor-not-allowed'
                                : 'hover:bg-black hover:text-[#f7f5f0] cursor-pointer'
                                }`}
                        >
                            <svg className={`w-6 h-6 transition-transform duration-300 ${!prevDisabled && 'group-hover:-translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={nextDisabled}
                            className={`w-14 h-14 rounded-full border-2 border-black flex items-center justify-center transition-all duration-300 group ${nextDisabled
                                ? 'opacity-20 cursor-not-allowed'
                                : 'hover:bg-black hover:text-[#f7f5f0] cursor-pointer'
                                }`}
                        >
                            <svg className={`w-6 h-6 transition-transform duration-300 ${!nextDisabled && 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Animated Quote Section */}
                    <div ref={quoteSectionRef} className="w-full lg:w-3/4 overflow-hidden">

                        <div className="flex flex-col pb-4">
                            <h2 ref={quoteTextRef} className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-black">
                                {testimonialsData[currentIndex].quote}
                            </h2>
                            <div className="mt-8 md:mt-12 flex items-center gap-4">
                                <div className="w-8 md:w-12 h-[3px] bg-black"></div>
                                <p ref={authorTextRef} className="text-sm md:text-base font-bold uppercase tracking-widest text-black/80">
                                    {testimonialsData[currentIndex].author}
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default Testimonials;
