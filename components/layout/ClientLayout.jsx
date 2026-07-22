'use client';

import { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Navbar from '../shared/Navbar';

gsap.registerPlugin(useGSAP);

gsap.config({ force3D: true });

const IntroAnimationContext = createContext({
    introComplete: true,
});

const INTRO_SESSION_KEY = 'rm-roofing-intro-played';

const subscribeToIntroSession = () => () => { };
const getIntroSessionSnapshot = () => window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true';
// Keep this false so the server always sends the preloader HTML just in case it's a first visit
const getIntroServerSnapshot = () => false;

export const useIntroAnimation = () => useContext(IntroAnimationContext);

const RepairIcon = () => {
    return (
        <svg
            viewBox="0 0 160 160"
            aria-hidden="true"
            className="h-24 w-24 sm:h-32 sm:w-32"
        >
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.5">
                <path d="M24 77 80 32l56 45" />
                <path d="M39 77h82" />
                <path d="M46 77v43h68V77" />
                <path d="M60 91h40" />
                <path d="M56 106h48" />
                <path d="M74 120V96h20v24" />
            </g>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5">
                <path d="m104 52 17-17 12 12-17 17" />
                <path d="m112 44 18 18" />
                <path d="M51 64h18" />
                <path d="M58 57v14" />
            </g>
            <g fill="currentColor">
                <circle cx="107" cy="91" r="3" />
                <circle cx="118" cy="91" r="3" />
                <circle cx="112.5" cy="101" r="3" />
            </g>
        </svg>
    );
};

const IntroOverlay = ({ onComplete }) => {
    const blockCount = 5;

    useGSAP(() => {
        const root = document.querySelector('[data-intro-overlay]');
        const base = root?.querySelector('[data-intro-base]');
        const icon = root?.querySelector('[data-intro-icon]');

        const blocks = gsap.utils.toArray('[data-intro-block]').filter(b => getComputedStyle(b).display !== 'none');

        if (!root || !base || !icon || !blocks.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            gsap.set(root, { autoAlpha: 0 });
            onComplete();
            return;
        }

        gsap.set(root, { autoAlpha: 1 });
        gsap.set(icon, {
            autoAlpha: 0,
            y: 10,
            scale: 0.96,
            transformOrigin: 'center',
        });
        gsap.set(blocks, {
            autoAlpha: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            willChange: 'clip-path',
        });

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete,
        });

        tl.to(icon, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
        })
            .to(icon, {
                autoAlpha: 0,
                y: -8,
                scale: 0.98,
                duration: 0.5,
                ease: 'power3.inOut',
            }, '+=0.2')
            .set(blocks, { autoAlpha: 1 })
            .set(base, { autoAlpha: 0 })
            .to(blocks, {
                clipPath: 'inset(0% 0% 0% 100%)',
                duration: 1.1,
                stagger: { amount: 0.18, from: 'start' },
                ease: 'power4.inOut',
            })
            .to(root, { autoAlpha: 0, duration: 0.15 })
            .set(blocks, { clearProps: 'willChange' });

        return () => tl.kill();
    }, []);

    return (
        <div
            id="intro-overlay-wrapper"
            data-intro-overlay
            className="fixed inset-0 z-50 overflow-hidden bg-transparent text-background"
        >
            <div data-intro-base className="absolute inset-0 bg-foreground" />

            <div
                data-intro-icon
                className="absolute inset-0 z-10 flex items-center justify-center text-background opacity-0 invisible"
            >
                <RepairIcon />
            </div>

            <div className="absolute inset-0 z-20 grid grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: blockCount }).map((_, index) => (
                    <div
                        key={index}
                        data-intro-block
                        className={`h-full w-full bg-foreground ${index >= 3 ? 'hidden lg:block' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

const ClientLayout = ({ children }) => {
    const hasPlayedIntro = useSyncExternalStore(
        subscribeToIntroSession,
        getIntroSessionSnapshot,
        getIntroServerSnapshot
    );

    const [introComplete, setIntroComplete] = useState(false);

    const isIntroComplete = hasPlayedIntro || introComplete;
    const shouldShowIntro = !hasPlayedIntro && !introComplete;

    const handleIntroComplete = () => {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
        setIntroComplete(true);
    };

    return (
        <IntroAnimationContext.Provider value={{ introComplete: isIntroComplete }}>
            {/* 1. Injects a global class hiding the preloader if it shouldn't be seen */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    html.skip-intro-fouc #intro-overlay-wrapper {
                        display: none !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                    }
                `
            }} />

            {/* 2. Synchronous script runs instantly to check storage before React paints */}
            <script dangerouslySetInnerHTML={{
                __html: `
                    try {
                        if (sessionStorage.getItem('${INTRO_SESSION_KEY}') === 'true') {
                            document.documentElement.classList.add('skip-intro-fouc');
                        }
                    } catch (e) {}
                `
            }} />

            <Navbar introComplete={isIntroComplete} />
            {children}

            {shouldShowIntro && (
                <IntroOverlay onComplete={handleIntroComplete} />
            )}
        </IntroAnimationContext.Provider>
    );
};

export default ClientLayout;