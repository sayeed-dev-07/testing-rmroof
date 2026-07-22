'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitTextAnimation from '../shared/SplitTextAnimation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

gsap.config({
    force3D: true
})

const galleryImages = [
    { src: "https://i.pinimg.com/736x/31/66/af/3166af96c4681a368ac43a4cfe1a3a99.jpg", speed: 1.2 },
    { src: "https://i.pinimg.com/1200x/4f/dd/61/4fdd61d0fa19e65223cb4dd42d5f6d08.jpg", speed: 0.8 },
    { src: "https://i.pinimg.com/1200x/c5/00/42/c500426e9546334ea24b57f43f1b1570.jpg", speed: 1.5 },
    { src: "https://i.pinimg.com/1200x/97/27/bb/9727bb7815e6c652a2b08ff63b2051a0.jpg", speed: 0.6 },
    { src: "https://i.pinimg.com/1200x/6c/b1/05/6cb105ae86646eabd3fbb5fe394161a8.jpg", speed: 1.1 },
    { src: "https://i.pinimg.com/1200x/92/57/10/925710e8f00d6e00a0edc766653c0528.jpg", speed: 1.4 },
    { src: "https://i.pinimg.com/1200x/c1/a7/02/c1a702c96eec1ed88214d4edf6c012ea.jpg", speed: 0.9 },
    { src: "https://i.pinimg.com/1200x/c5/00/42/c500426e9546334ea24b57f43f1b1570.jpg", speed: 1.5 },
];

// Helper to chunk images into groups of 2 and 1 to mimic a random layout 
// safely without causing React hydration errors on page reload.
const chunkImages = (images) => {
    const chunks = [];
    let i = 0;
    let takeTwo = true; // Alternates between 2 columns and 1 column

    while (i < images.length) {
        if (takeTwo && i + 1 < images.length) {
            chunks.push([images[i], images[i + 1]]);
            i += 2;
        } else {
            chunks.push([images[i]]);
            i += 1;
        }
        takeTwo = !takeTwo;
    }
    return chunks;
};

// --- SUB-COMPONENT: Editorial Grid Image with Parallax & Reveal ---
const GalleryImage = ({ src, index, speed }) => {
    const imgWrapperRef = useRef(null);

    useGSAP(() => {
        // Left to Right Clip-Path Reveal
        gsap.fromTo(imgWrapperRef.current,
            { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
            {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                duration: 1.5,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: imgWrapperRef.current,
                    start: 'top 85%', // Triggers when the top of the image hits 85% of the viewport height
                }
            }
        );
    }, { scope: imgWrapperRef });

    return (
        <div
            className="relative will-change-transform w-full h-full overflow-hidden"
        >
            <div
                ref={imgWrapperRef}
                className="relative w-full h-full bg-[#f7f5f0]"
            >
                <Image
                    src={src}
                    alt={`Visual Archive ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

// --- MAIN GALLERY SECTION ---
const ParallaxGallery = () => {
    const containerRef = useRef(null);
    const lineRef = useRef(null);
    const imageRows = chunkImages(galleryImages);

    useGSAP(() => {
        gsap.to(lineRef.current, {
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: lineRef.current,
                start: 'top 80%'
            }
        });

    }, { scope: containerRef });

    return (
        <section className="w-full py-12 lg:py-20 bg-[#f7f5f0] text-black flex flex-col  overflow-hidden">

            <div className='containerPadding'>
                <div className='w-fit overflow-hidden mb-16 lg:mb-24 '>
                    <p className='text-3xl md:text-4xl font-bold uppercase tracking-tighter'>02 / Gallery</p>
                    <div ref={lineRef} className='w-full h-0.5 bg-black -translate-x-full mt-1' />
                </div>
            </div>

            {/* Header Block */}
            <div className="bg-[#f7f5f0] relative w-full mb-12">
                <div className="containerPadding flex flex-col md:flex-row justify-between items-end px-4 md:px-8">
                    <SplitTextAnimation className={''}>
                        <h2 className="text-[10vw] font-inter md:text-[8vw] leading-[0.85] font-black uppercase tracking-tighter m-0">
                            Selected<br />Works
                        </h2>
                    </SplitTextAnimation>


                    <SplitTextAnimation className='mt-8 lg:mt-12 text-start max-w-[320px] pr-4'>
                        <p className='text-sm md:text-base font-medium leading-relaxed text-black/90'>
                            A collection of our finest architectural and interior designs.
                            Scroll to explore the spaces we've brought to life.
                        </p>
                    </SplitTextAnimation>
                </div>
            </div>

            {/* Full-Width Edge-to-Edge Grid Container */}
            <div
                ref={containerRef}
                className="w-full flex flex-col relative gap-y-2 z-10"
            >
                {imageRows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex flex-col md:flex-row gap-2  w-full h-[60vh] md:h-[100vh]"
                    >
                        {row.map((item, colIndex) => (
                            <div
                                key={colIndex}
                                className="flex-1 w-full h-full relative"
                            >
                                <GalleryImage
                                    src={item.src}
                                    index={rowIndex * 2 + colIndex}
                                    speed={item.speed}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

        </section>
    );
};

export default ParallaxGallery;