'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitTextAnimation from '../shared/SplitTextAnimation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const aboutData = {
    headline: {
        line1: "WHY WE",
        line2: "EXIST'S",
    },
    image: {
        src: "https://img1.wsimg.com/isteam/stock/V8b3qdz/:/rs=w:600,h:800,cg:true,m/cr=w:600,h:800",
        alt: "RM Roofing Craftsmanship"
    },
    description: "Moving beyond 'just fixing leaks' to 'architecting the entire shield of your home'. RM ROOFING is a comprehensive approach that harmonizes structural integrity, weather resistance, and architectural beauty. Designed for the 'essential longevity' of your property."
};

const About = () => {
    const containerRef = useRef(null);
    const lineRef = useRef(null);
    const imgWrapperRef = useRef(null);

    useGSAP(() => {
        // Main Timeline for the section entrance
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 85%',
            }
        });

        // 1. Header Line Expansion
        tl.to(lineRef.current, {
            x: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, 0);

        // 2. Huge Text Mask Reveal (Slides up from hidden bounds)
        tl.from(".hero-text", {
            y: "110%",
            rotate: 2, // Adds a very slight, premium tilt as it reveals
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
        }, 0.1);

        // 3. Image Clip-Path Reveal (Bottom to Top)
        tl.fromTo(imgWrapperRef.current,
            { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
            {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                duration: 1.5,
                ease: 'power3.inOut'
            },
            0.3
        );

        // 4. Subtle Details Fade In
        tl.from(".fade-item", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, 0.6);

        // 5. Image Inner Parallax (Tied to scroll, outside of the entrance timeline)
        gsap.to('.about-image-inner', {
            y: '15%', // Moves the image slightly inside its wrapper as you scroll
            ease: 'none',
            scrollTrigger: {
                trigger: imgWrapperRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className='bg-[#f7f5f0] text-black w-full min-h-screen py-20 lg:py-32 overflow-hidden flex flex-col items-center justify-center'
        >
            <div className='w-full containerPadding relative'>

                {/* Section Header */}
                <div className='w-fit overflow-hidden mb-12 lg:mb-20'>
                    <p className='text-3xl md:text-4xl font-bold uppercase tracking-tighter'>01 / About Us</p>
                    <div ref={lineRef} className='w-full h-[3px] bg-black -translate-x-full mt-2' />
                </div>

                <div className='flex flex-col relative w-full'>

                    {/* Top Row: WHY WE */}
                    <div className='relative z-20 w-full flex justify-between items-end'>
                        {/* Overflow hidden wrapper is essential for the masking animation */}
                        <div className='overflow-hidden'>
                            <h1 className='hero-text text-[20vw] lg:text-[14vw] leading-[0.8]   font-black uppercase tracking-tighter m-0'>
                                {aboutData.headline.line1}
                            </h1>
                        </div>

                        {/* Decorative Badge Element */}
                        <div className="hidden lg:flex fade-item flex-col text-right mb-4 pr-12">
                            <span className="text-sm font-bold tracking-widest uppercase">Premium</span>
                            <span className="text-sm text-black/60 font-medium tracking-widest uppercase">Craftsmanship</span>
                        </div>
                    </div>

                    {/* Bottom Section: EXIST, Description, and Image */}
                    <div className='relative flex flex-col lg:flex-row w-full items-start md:-mt-3'>

                        {/* Left Side: EXIST + Paragraph */}
                        <div className='w-full lg:w-1/2 flex flex-col relative z-20'>
                            <div className='overflow-hidden'>
                                <h1 className='hero-text text-[20vw] lg:text-[14vw] leading-[0.8] font-black uppercase tracking-tighter'>
                                    {aboutData.headline.line2}
                                </h1>
                            </div>

                            <SplitTextAnimation className='mt-8 lg:mt-12 max-w-md pr-4'>
                                <p className='text-base md:text-lg font-medium leading-relaxed text-black/80 lg:ml-2'>
                                    {aboutData.description}
                                </p>
                            </SplitTextAnimation>

                        </div>

                        {/* Right Side: Image with Parallax & Overlap */}
                        <div className='w-full lg:w-1/2 flex justify-center lg:justify-end mt-16 lg:mt-0 relative z-10'>
                            {/* Negative margin pulls the image up to overlap the text slightly */}
                            <div
                                ref={imgWrapperRef}
                                className='relative w-full max-w-[550px] aspect-[4/5] overflow-hidden lg:-mt-24 shadow-2xl'
                            >
                                {/* Scaling the image slightly larger than the container allows room for the scrub parallax */}
                                <Image
                                    src={aboutData.image.src}
                                    alt={aboutData.image.alt}
                                    fill
                                    className='about-image-inner object-cover scale-[1.2] origin-top'
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;