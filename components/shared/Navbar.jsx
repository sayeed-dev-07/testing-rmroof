/* eslint-disable react-hooks/refs */
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);
gsap.config({ force3D: true });

const navItems = {
    logo: { alt: 'RM Roofing', src: '/logo.png', link: '/' },
    navlink: [
        { id: 1, name: 'Home', link: '/' },
        { id: 2, name: 'Services', link: '/services' },
        { id: 3, name: 'About', link: '/about' },
        { id: 4, name: 'Gallery', link: '/gallery' },
        { id: 5, name: 'Contact', link: '/contact' }
    ]
};

// 1. ISOLATED NAV ITEM COMPONENT
const AnimatedNavItem = ({ item, closeMenu, isMenuOpen }) => {
    const linkRef = useRef(null);
    const lineRef = useRef(null);
    const { contextSafe } = useGSAP();

    const handleMouseEnter = contextSafe(() => {
        if (window.innerWidth < 640) return;
        gsap.to(linkRef.current, { x: 16, color: 'rgba(0,0,0,0.6)', duration: 0.3, ease: 'power2.out' });
        gsap.to(lineRef.current, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
    });

    const handleMouseLeave = contextSafe(() => {
        if (window.innerWidth < 640) return;
        gsap.to(linkRef.current, { x: 0, color: '#000000', duration: 0.3, ease: 'power2.out' });
        gsap.to(lineRef.current, { scaleX: 0, duration: 0.3, ease: 'power2.out' });
    });

    return (
        <li className="border-b border-black/10">
            <Link
                ref={linkRef}
                data-menu-link
                href={item.link}
                onClick={closeMenu}
                tabIndex={isMenuOpen ? 0 : -1}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="opacity-0 invisible translate-y-[18px] flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 text-[clamp(1.35rem,5.8vw,2.15rem)] font-medium leading-none tracking-normal text-black sm:min-h-20"
            >
                <span>{item.name}</span>
                <span ref={lineRef} className="hidden sm:block h-px w-14 bg-current origin-left scale-x-0" />
            </Link>
        </li>
    );
};

// 2. MAIN NAVBAR COMPONENT
const Navbar = ({ introComplete = true }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const navRef = useRef(null);
    const timelineRef = useRef(null);
    const btnRef = useRef(null);
    const phoneRef = useRef(null);
    const lastScrollYRef = useRef(0);
    const scrollDeltaRef = useRef(0);

    const { contextSafe } = useGSAP(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const duration = prefersReducedMotion ? 0 : 0.65;

        gsap.set('[data-menu-overlay]', { autoAlpha: 0 });
        gsap.set('[data-menu-panel]', { xPercent: 110, autoAlpha: 1, willChange: 'transform' });
        gsap.set('[data-menu-link]', { autoAlpha: 0, y: 18, willChange: 'transform, opacity' });
        gsap.set('[data-menu-top-line]', { y: -5, rotate: 0 });
        gsap.set('[data-menu-bottom-line]', { y: 5, rotate: 0 });

        const tl = gsap.timeline({
            paused: true,
            onComplete: () => {
                gsap.set('[data-menu-panel], [data-menu-link]', { clearProps: 'willChange' });
            }
        });

        tl.to('[data-menu-overlay]', {
            autoAlpha: 1,
            duration: duration,
            ease: 'power2.out',
        }, 0)
            .to('[data-menu-panel]', {
                xPercent: 0,
                duration: duration,
                ease: 'power3.inOut',
            }, 0)
            .to('[data-menu-top-line]', {
                y: 0,
                rotate: 16,
                duration: duration,
                ease: 'power3.inOut',
            }, 0)
            .to('[data-menu-bottom-line]', {
                y: 0,
                rotate: -16,
                duration: duration,
                ease: 'power3.inOut',
            }, 0)
            .to('[data-menu-link]', {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.08,
                ease: 'power3.out',
            }, ">-0.2");

        timelineRef.current = tl;

        return () => tl.kill();
    }, { scope: navRef });

    useEffect(() => {
        const timeline = timelineRef.current;
        if (!timeline) return;

        if (isMenuOpen) {
            gsap.set('[data-menu-panel], [data-menu-link]', { willChange: 'transform, opacity' });
            timeline.play();
            document.body.style.overflow = 'hidden';
        } else {
            gsap.set('[data-menu-panel], [data-menu-link]', { willChange: 'transform, opacity' });
            timeline.reverse();
            document.body.style.overflow = '';
        }

        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        let frameId = null;

        const updateNavbar = () => {
            frameId = null;

            const currentScrollY = Math.max(window.scrollY, 0);
            const previousScrollY = lastScrollYRef.current;
            const delta = currentScrollY - previousScrollY;
            const hero = document.querySelector('[data-hero-section]');
            const navHeight = navRef.current?.offsetHeight || 0;
            const isPastHero = hero
                ? hero.getBoundingClientRect().bottom <= navHeight + 8
                : currentScrollY > 8;

            setHasScrolledPastHero(isPastHero);

            if (isMenuOpen || currentScrollY < 12) {
                setIsNavVisible(true);
                scrollDeltaRef.current = 0;
            } else if (delta > 0) {
                scrollDeltaRef.current = scrollDeltaRef.current > 0
                    ? scrollDeltaRef.current + delta
                    : delta;

                if (scrollDeltaRef.current > 28) {
                    setIsNavVisible(false);
                }
            } else if (delta < 0) {
                scrollDeltaRef.current = scrollDeltaRef.current < 0
                    ? scrollDeltaRef.current + delta
                    : delta;

                if (Math.abs(scrollDeltaRef.current) > 8) {
                    setIsNavVisible(true);
                }
            }

            lastScrollYRef.current = currentScrollY;
        };

        const requestUpdate = () => {
            if (frameId === null) {
                frameId = window.requestAnimationFrame(updateNavbar);
            }
        };

        updateNavbar();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frameId !== null) window.cancelAnimationFrame(frameId);
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, [isMenuOpen]);

    const toggleMenu = contextSafe(() => setIsMenuOpen((current) => !current));
    const closeMenu = contextSafe(() => setIsMenuOpen(false));

    const handleBtnEnter = contextSafe(() => {
        if (window.innerWidth > 640) gsap.to(btnRef.current, { backgroundColor: '#ffffff', color: '#000000', duration: 0.3 });
    });
    const handleBtnLeave = contextSafe(() => {
        if (window.innerWidth > 640) gsap.to(btnRef.current, { backgroundColor: 'rgba(0,0,0,0.2)', color: '#ffffff', duration: 0.3 });
    });

    const handlePhoneEnter = contextSafe(() => {
        if (window.innerWidth > 640) gsap.to(phoneRef.current, { color: 'rgba(0,0,0,0.6)', duration: 0.3 });
    });
    const handlePhoneLeave = contextSafe(() => {
        if (window.innerWidth > 640) gsap.to(phoneRef.current, { color: '#000000', duration: 0.3 });
    });

    const shouldShowBackdrop = hasScrolledPastHero || isMenuOpen;

    return (
        <header
            ref={navRef}
            className={`pointer-events-none fixed inset-x-0 top-0 z-40 py-4 transition-all duration-500 ease-out ${introComplete ? 'visible opacity-100' : 'invisible opacity-0'} ${isNavVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full'} ${shouldShowBackdrop ? 'bg-black/85 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md' : 'bg-transparent'}`}
        >
            <div className="pointer-events-auto flex w-full items-center justify-between containerPadding">
                <Link
                    href={navItems.logo.link}
                    aria-label="RM Roofing home"
                    onClick={closeMenu}
                    className="relative z-50 inline-flex h-12 w-[92px] items-center cursor-pointer sm:h-14 sm:w-[112px] lg:h-16 lg:w-[128px]"
                >
                    <Image
                        src={navItems.logo.src}
                        alt={navItems.logo.alt}
                        fill
                        priority
                        sizes="(min-width: 1024px) 128px, (min-width: 640px) 112px, 92px"
                        className="object-contain object-left brightness-0 invert"
                    />
                </Link>

                <button
                    ref={btnRef}
                    type="button"
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="site-menu"
                    onClick={toggleMenu}
                    onMouseEnter={handleBtnEnter}
                    onMouseLeave={handleBtnLeave}
                    className="relative z-50 flex h-12 w-16 items-center cursor-pointer justify-center overflow-hidden rounded-full border border-white/35 bg-black/20 text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-14 sm:w-20"
                >
                    <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                    <span className="relative h-5 w-11 sm:w-12" aria-hidden="true">
                        <span data-menu-top-line className="absolute left-0 top-1/2 h-px w-full origin-center bg-current -translate-y-[5px]" />
                        <span data-menu-bottom-line className="absolute left-0 top-1/2 h-px w-full origin-center bg-current translate-y-[5px]" />
                    </span>
                </button>
            </div>

            <div
                data-menu-overlay
                className="pointer-events-auto invisible fixed inset-0 z-40 bg-black/42"
                onClick={closeMenu}
            />

            <nav
                id="site-menu"
                data-menu-panel
                aria-label="Primary navigation"
                aria-hidden={!isMenuOpen}
                className="invisible pointer-events-auto fixed right-3 top-3 z-40 flex h-[calc(100svh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-[460px] flex-col overflow-y-auto rounded-[1.75rem] border border-black/10 bg-[#f7f3ed] px-6 pb-6 pt-24 text-black  sm:right-5 sm:top-5 sm:h-[calc(100svh-2.5rem)] sm:w-[min(430px,calc(100vw-2.5rem))] sm:px-8 sm:pb-8 sm:pt-28 lg:right-7 lg:top-7 lg:h-[calc(100svh-3.5rem)] lg:w-[430px]"
            >
                {/* 
                  FIX: Replaced `min-h-0 flex-1` with `grow shrink-0`. 
                  This allows the block to expand to push the footer down if there's space, 
                  but prevents it from squishing its content when space runs out.
                */}
                <div className="flex flex-col grow shrink-0">
                    <div className="mb-7 border-b border-black/10 pb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">Navigation</p>
                    </div>

                    <ul className="flex flex-col">
                        {navItems.navlink.map((item) => (
                            <AnimatedNavItem
                                key={item.id}
                                item={item}
                                closeMenu={closeMenu}
                                isMenuOpen={isMenuOpen}
                            />
                        ))}
                    </ul>
                </div>

                {/* 
                  FIX: Added `shrink-0` and updated the top margin logic (`mt-auto pt-8` instead of `mt-8`). 
                  This ensures the footer never gets squished into the links on small height screens 
                  and naturally triggers the scrollbar on the parent wrapper instead. 
                */}
                <div data-menu-link className="opacity-0 invisible translate-y-[18px] mt-auto pt-8 flex flex-col gap-4 text-sm text-black/60 sm:text-base shrink-0">
                    <a
                        ref={phoneRef}
                        href="tel:4695443768"
                        onClick={closeMenu}
                        tabIndex={isMenuOpen ? 0 : -1}
                        onMouseEnter={handlePhoneEnter}
                        onMouseLeave={handlePhoneLeave}
                        className="w-fit cursor-pointer border-b border-black/35 pb-1 text-black"
                    >
                        469 544 3768
                    </a>
                    <p className="max-w-64 leading-relaxed">
                        Quality roofing services built for strong, lasting protection.
                    </p>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
