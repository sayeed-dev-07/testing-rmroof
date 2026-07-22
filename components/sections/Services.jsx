/* eslint-disable react-hooks/refs */
'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SplitTextAnimation from '../shared/SplitTextAnimation';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const servicesData = [
    {
        id: 1,
        title: 'COMPREHENSIVE INSPECTION',
        category: 'Diagnostic Service',
        image: 'https://i.pinimg.com/736x/b9/b2/c2/b9b2c224aba5887896ab3db81e21a33a.jpg',
        hoverColor: '#1A1A1A',
    },
    {
        id: 2,
        title: 'EMERGENCY LEAK REPAIR',
        category: 'Active Response',
        image: 'https://i.pinimg.com/1200x/c5/00/42/c500426e9546334ea24b57f43f1b1570.jpg',
        hoverColor: '#0047AB',
    },
    {
        id: 3,
        title: 'FULL ROOF REPLACEMENT',
        category: 'Major Installation',
        image: 'https://i.pinimg.com/1200x/35/b9/98/35b998697519d1e8bf4317a5a9b8250a.jpg',
        hoverColor: '#8B0000',
    },
    {
        id: 4,
        title: 'MAINTENANCE & UPKEEP',
        category: 'Preventative Care',
        image: 'https://i.pinimg.com/1200x/74/35/00/74350037d6ce2313bb81b0fefd12cbcb.jpg',
        hoverColor: '#2F4F4F',
    },
    {
        id: 5,
        title: 'STRUCTURAL REINFORCEMENT',
        category: 'Engineering',
        image: 'https://i.pinimg.com/1200x/41/c2/ef/41c2ef927866489f3f0b8f5cad0f2f1e.jpg',
        hoverColor: '#4B3621',
    },
];

// --- CARD COMPONENT (Border-like hover background) ---
const ServiceCard = ({ data }) => {
    const cardRef = useRef(null);
    const bgRef = useRef(null);
    const titleBgRef = useRef(null);
    const categoryBgRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: cardRef });

    const onMouseEnter = contextSafe(() => {
        gsap.to(bgRef.current, { x: '0%', duration: 0.4, ease: 'power3.out' });
        gsap.to([titleBgRef.current, categoryBgRef.current], {
            backgroundColor: data.hoverColor,
            color: '#ffffff',
            duration: 0.3
        });
    });

    const onMouseLeave = contextSafe(() => {
        gsap.to(bgRef.current, { x: '-105%', duration: 0.4, ease: 'power3.inOut' });
        gsap.to([titleBgRef.current, categoryBgRef.current], {
            backgroundColor: '#fbfbfb',
            color: '#000000',
            duration: 0.3
        });
    });

    return (
        <div
            ref={cardRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="relative w-full aspect-[4/3] md:aspect-video cursor-pointer group overflow-hidden flex flex-col p-4 md:p-6"
        >
            <div
                ref={bgRef}
                className="absolute inset-0 w-full h-full translate-x-[-105%] z-0"
                style={{ backgroundColor: data.hoverColor }}
            ></div>
            <div className="relative z-10 w-full h-full">
                <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col items-end z-20">
                <div ref={titleBgRef} className="px-4 py-1 text-lg md:text-2xl font-bold uppercase tracking-tight transition-colors duration-300" style={{ backgroundColor: '#fbfbfb', color: '#000000' }}>
                    {data.title}
                </div>
                <div ref={categoryBgRef} className="px-3 py-1 text-xs md:text-sm font-semibold uppercase tracking-widest mt-[2px] shadow-sm transition-colors duration-300" style={{ backgroundColor: '#fbfbfb', color: '#000000' }}>
                    {data.category}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const Services = () => {
    const containerRef = useRef(null);
    const lineRef = useRef(null);
    const titleOurRef = useRef(null);
    const titleServicesRef = useRef(null);

    useGSAP(() => {
        // 1. Modern SplitText using the native 'mask' feature
        const splitText = new SplitText([titleOurRef.current, titleServicesRef.current], {
            type: 'lines',
            mask: 'lines' // GSAP automatically wraps lines with overflow: clip
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 85%',
            }
        });

        // 2. Header Line Expansion
        tl.to(lineRef.current, {
            x: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, 0);

        // 3. Reveal the inner lines smoothly from underneath the new mask
        tl.from(splitText.lines, {
            yPercent: 105,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
        }, 0.1);

        // 4. Subtle Details Fade In
        tl.from(".fade-item", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, 0.6);

        // Cleanup SplitText to avoid formatting bugs on hot reload
        return () => {
            splitText.revert();
        };

    }, { scope: containerRef });

    return (
        <main
            ref={containerRef}
            className="w-full bg-[#f7f5f0] text-black font-sans relative flex flex-col items-center overflow-hidden"
        >
            <section className="w-full pt-20 lg:pt-32 pb-16 flex flex-col items-center justify-center">
                <div className='w-full containerPadding relative px-4 md:px-8'>

                    <div className='w-fit overflow-hidden mb-12 lg:mb-20'>
                        <p className='text-3xl md:text-4xl font-bold uppercase tracking-tighter'>03 / Services</p>
                        <div ref={lineRef} className='w-full h-[3px] bg-black -translate-x-full mt-2' />
                    </div>

                    <div className='flex flex-col relative w-full'>
                        <div className='relative z-20 w-full flex justify-between items-end'>
                            {/* Target directly with Ref, SplitText handles the mask wrapper automatically */}
                            <h1
                                ref={titleOurRef}
                                className='text-[20vw] lg:text-[14vw] leading-[0.8] font-black uppercase tracking-tighter m-0'
                            >
                                OUR
                            </h1>

                            <div className="hidden lg:flex fade-item flex-col text-right mb-4 pr-12">
                                <span className="text-sm font-bold tracking-widest uppercase">Expertise</span>
                                <span className="text-sm text-black/60 font-medium tracking-widest uppercase">Precision</span>
                            </div>
                        </div>

                        <div className='relative flex flex-col lg:flex-row w-full items-start md:-mt-3'>
                            <div className='w-full lg:w-2/3 flex flex-col relative z-20'>
                                {/* Target directly with Ref */}
                                <h1
                                    ref={titleServicesRef}
                                    className='text-[20vw] lg:text-[14vw] leading-[0.8] font-black uppercase tracking-tighter '
                                >
                                    SERVICES
                                </h1>

                                <SplitTextAnimation className='mt-8 lg:mt-12 max-w-lg pr-4'>
                                    <p className='text-base md:text-lg font-medium leading-relaxed text-black/80 lg:ml-2'>
                                        Precision engineering and architectural excellence applied to every roof we build, repair, and maintain. Designed for essential longevity.
                                    </p>
                                </SplitTextAnimation>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full pb-32">
                <div className="w-full containerPadding px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 mt-12">
                        {servicesData.map((service) => (
                            <ServiceCard
                                key={service.id}
                                data={service}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Services;