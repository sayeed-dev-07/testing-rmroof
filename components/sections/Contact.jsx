'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Contact = () => {
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const lineRef = useRef(null);

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
        // 1. Scroll Reveal Animation for the entire section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%", // Triggers when the top of the section hits 80% down the viewport
            }
        });

        tl.fromTo(".contact-header",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        )
            .fromTo(".form-element",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
                "-=0.4"
            )
            .fromTo(".info-element",
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
                "-=0.6"
            );
    }, { scope: containerRef });

    // 2. Satisfying Click Animation for the Button
    const handleMouseDown = () => {
        gsap.to(buttonRef.current, { scale: 0.92, duration: 0.1, ease: "power1.inOut" });
    };

    const handleMouseUp = () => {
        // Elastic pop back up
        gsap.to(buttonRef.current, { scale: 1, duration: 0.4, ease: "elastic.out(1.2, 0.4)" });
    };

    return (
        <section ref={containerRef} className="w-full py-24 bg-[#f7f5f0] text-black flex justify-center overflow-hidden containerPadding">
            <div className="w-full max-w-[1400px] flex flex-col items-center">

                {/* Section Header */}
                <div className='w-fit overflow-hidden mx-auto mb-16 xl:mb-24'>
                    <p className='text-3xl md:text-4xl font-bold uppercase  tracking-tighter'>05 / Contact Us</p>
                    <div ref={lineRef} className='w-full h-0.5 bg-black -translate-x-full mt-1' />
                </div>

                <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-24">

                    {/* Left Column: Form */}
                    <div className="xl:col-span-7 flex flex-col">
                        <h3 className="form-element text-2xl font-bold mb-8 uppercase tracking-wide">Get a Free Quote!</h3>

                        <form className="flex flex-col gap-8 w-full" onSubmit={(e) => e.preventDefault()}>

                            <div className="form-element relative">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full bg-transparent border-b border-black/30 py-3 text-base outline-none transition-colors focus:border-black placeholder:text-black/50"
                                />
                            </div>

                            <div className="form-element relative grid grid-cols-1 md:grid-cols-2 gap-8">
                                <input
                                    type="email"
                                    required
                                    placeholder="Email *"
                                    className="w-full bg-transparent border-b border-black/30 py-3 text-base outline-none transition-colors focus:border-black placeholder:text-black/50"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full bg-transparent border-b border-black/30 py-3 text-base outline-none transition-colors focus:border-black placeholder:text-black/50"
                                />
                            </div>

                            <div className="form-element relative">
                                <input
                                    type="text"
                                    placeholder="Address (Street, City, Zip Code)"
                                    className="w-full bg-transparent border-b border-black/30 py-3 text-base outline-none transition-colors focus:border-black placeholder:text-black/50"
                                />
                            </div>

                            <div className="form-element relative mt-4">
                                <textarea
                                    rows="4"
                                    placeholder="Let us know the details of what you are looking for, and we'll contact you with a quote."
                                    className="w-full bg-transparent border-b border-black/30 py-3 text-base outline-none transition-colors focus:border-black resize-none placeholder:text-black/50"
                                ></textarea>
                            </div>

                            <div className="form-element mt-6">
                                <button
                                    ref={buttonRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    type="submit"
                                    className="bg-black text-white px-12 py-4 text-sm font-bold uppercase cursor-pointer tracking-widest hover:bg-gray-800 transition-colors w-full md:w-auto"
                                >
                                    Send
                                </button>
                                <p className="text-[10px] text-black/40 mt-4 max-w-sm">
                                    This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Contact Info & Hours */}
                    <div className="xl:col-span-5 flex flex-col justify-start pt-2">

                        {/* Company Details */}
                        <div className="info-element mb-12">
                            <h4 className="text-xl font-bold uppercase tracking-wide mb-6">RM Roofing and Contracting LLC</h4>
                            <div className="flex flex-col gap-4 text-base font-medium text-black/80">
                                <a href="tel:4695443768" className="hover:text-black transition-colors flex items-center gap-3">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    469-544-3768
                                </a>
                                <a href="mailto:contact@rmroofing.com" className="hover:text-black transition-colors flex items-center gap-3">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    contact@rmroofing.com
                                </a>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="info-element">
                            <h4 className="text-xl font-bold uppercase tracking-wide mb-6">Hours</h4>

                            <ul className="flex flex-col gap-3 text-sm font-medium text-black/70 w-full max-w-[300px]">
                                <li className="flex justify-between border-b border-black/10 pb-2">
                                    <span>Mon</span> <span>07:00 am – 05:00 pm</span>
                                </li>
                                <li className="flex justify-between border-b border-black/10 pb-2">
                                    <span>Tue</span> <span>07:00 am – 05:00 pm</span>
                                </li>
                                <li className="flex justify-between border-b border-black/10 pb-2">
                                    <span>Wed</span> <span>07:00 am – 05:00 pm</span>
                                </li>
                                <li className="flex justify-between border-b border-black/10 pb-2">
                                    <span>Thu</span> <span>07:00 am – 05:00 pm</span>
                                </li>
                                <li className="flex justify-between border-b border-black/10 pb-2 text-black font-bold">
                                    <span>Fri</span> <span>07:00 am – 05:00 pm</span>
                                </li>
                                <li className="flex justify-between border-b border-black/10 pb-2">
                                    <span>Sat</span> <span>07:00 am – 05:00 pm</span>
                                </li>
                                <li className="flex justify-between pt-1">
                                    <span>Sun</span> <span className="text-black/40">Closed</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;