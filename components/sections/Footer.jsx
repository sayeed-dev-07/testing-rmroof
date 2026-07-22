'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Footer = () => {
    const footerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 85%", // Triggers when the top of the footer is 85% down the screen
            }
        });

        // 1. Animate the top CTA and Grid
        tl.fromTo(".footer-reveal",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
        )
            // 2. Animate the massive bottom text
            .fromTo(".footer-massive-text",
                { y: "100%", opacity: 0 },
                { y: "0%", opacity: 1, duration: 1.2, ease: "power4.out" },
                "-=0.5"
            )
            // 3. Fade in the copyright bar
            .fromTo(".footer-bottom-bar",
                { opacity: 0 },
                { opacity: 1, duration: 0.5 },
                "-=0.5"
            );
    }, { scope: footerRef });

    return (
        <footer
            ref={footerRef}
            className="w-full bg-[#111111] text-[#f7f5f0] pt-12 pb-8 containerPadding flex flex-col items-center overflow-hidden"
        >
            <div className="w-full  flex flex-col">

                {/* Top Section: CTA & Links Grid */}
                <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 mb-24">

                    {/* Left: Call to Action */}
                    <div className="footer-reveal w-full lg:w-1/2 flex flex-col items-start">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight mb-8">
                            Ready to shield<br />your property?
                        </h2>
                        <button className="group relative px-8 py-4 bg-[#f7f5f0] text-[#111] text-sm font-bold uppercase cursor-pointer tracking-widest overflow-hidden">
                            <span className="relative z-10">Start Your Project</span>
                            <div className="absolute inset-0 bg-[#ffc6a5] transform scale-y-0 origin-bottom transition-transform duration-300 ease-out group-hover:scale-y-100 z-0"></div>
                        </button>
                    </div>

                    {/* Right: Navigation Grid */}
                    <div className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {/* Column 1: Explore */}
                        <div className="footer-reveal flex flex-col gap-4">
                            <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-bold mb-2">Explore</h4>
                            <a href="#about" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">About Us</a>
                            <a href="#services" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">Services</a>
                            <a href="#projects" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">Selected Works</a>
                            <a href="#contact" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">Contact</a>
                        </div>

                        {/* Column 2: Socials */}
                        <div className="footer-reveal flex flex-col gap-4">
                            <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-bold mb-2">Connect</h4>
                            <a href="#" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">Instagram</a>
                            <a href="#" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">LinkedIn</a>
                            <a href="#" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">Facebook</a>
                        </div>

                        {/* Column 3: Contact Details */}
                        <div className="footer-reveal flex flex-col gap-4 col-span-2 md:col-span-1">
                            <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-bold mb-2">Inquiries</h4>
                            <a href="mailto:contact@rmroofing.com" className="text-sm md:text-base wrap-break-word font-medium hover:text-[#ffc6a5] transition-colors">
                                contact@rmroofing.com
                            </a>
                            <a href="tel:4695443768" className="text-sm md:text-base font-medium hover:text-[#ffc6a5] transition-colors">
                                469-544-3768
                            </a>
                        </div>
                    </div>
                </div>

                {/* Massive Brand Name */}
                {/* overflow-hidden wrapper ensures the text slides up cleanly from an invisible line */}
                <div className="w-full overflow-hidden border-b border-white/20 pb-4 mb-8">
                    <h1 className="footer-massive-text text-[16vw] lg:text-[14vw] leading-[0.75] font-black uppercase tracking-tighter m-0 text-center w-full">
                        RM Roofing
                    </h1>
                </div>

                {/* Bottom Legal Bar */}
                <div className="footer-bottom-bar flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
                    <p>© {new Date().getFullYear()} RM ROOFING AND CONTRACTING LLC.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;