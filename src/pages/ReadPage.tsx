import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {  AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// --- Import Data and Types ---
import booksData from '../data/books.json';
import authorsData from '../data/authors.json';
import { Book, Author } from '../types/book';

import { Button } from "@heroui/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";


// --- Constants ---
const WORDS_PER_MINUTE = 200;
const PARAGRAPHS_PER_PAGE = 10; // Adjusted for potentially different visual density

// --- Theme Definitions ---
// IMPORTANT: You need to load these Google Fonts in your public/index.html
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Roboto+Slab:wght@400;700&family=Source+Sans+3:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">

interface ReadingTheme {
    key: string;
    label: string;
    fontFamily: string; // CSS font-family value
    bgColor: string;    // Tailwind background class
    textColor: string;  // Tailwind text class
    proseClass?: string; // Optional specific prose adjustments
}

//change and add themes here:
const READING_THEMES: ReadingTheme[] = [
    { key: 'paper', label: 'Paper', fontFamily: "'Lora', serif", bgColor: 'bg-[#FBF6EF]', textColor: 'text-gray-800', proseClass: 'prose-p:text-gray-800 prose-headings:text-gray-900' },
    { key: 'calm', label: 'Calm', fontFamily: "'Source Sans 3', sans-serif", bgColor: 'bg-[#E4E9F0]', textColor: 'text-gray-700', proseClass: 'prose-p:text-gray-700 prose-headings:text-gray-800' },
    { key: 'bold', label: 'Bold', fontFamily: "'Merriweather', serif", bgColor: 'bg-gray-900', textColor: 'text-gray-100', proseClass: 'prose-invert prose-p:text-gray-100 prose-headings:text-white' }, // Dark theme example
    { key: 'focus', label: 'Focus', fontFamily: "'Roboto Slab', serif", bgColor: 'bg-white', textColor: 'text-black', proseClass: 'prose-p:text-black prose-headings:text-black' },
];
type ThemeKey = typeof READING_THEMES[number]['key'];


// --- Helper Functions ---
const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        if (item === null || item === 'undefined') return defaultValue;
        return JSON.parse(item) as T;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        localStorage.removeItem(key);
        return defaultValue;
    }
};

const setLocalStorageItem = <T,>(key: string, value: T) => {
    try {
        if (value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
    }
};

// --- Import Subcomponents ---
import Toolbar from '../components/Toolbar';
import ScrollProgressBar from '../components/ScrollProgressBar';
import ContentArea from '../components/ContentArea';
import SettingsPopup from '../components/SettingsPopup';

// --- Component ---
const ReadPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // --- Data Fetching ---
    const book = useMemo(() => (booksData as Book[]).find((b) => b.id === id), [id]);
    const authors = useMemo(() => {
        if (!book) return [];
        return (authorsData as Author[]).filter(author => book.authorIds.includes(author.id));
    }, [book]);
    const displayAuthorName = useMemo(() => {
        if (authors.length === 0) return "Unknown Author";
        return authors.map(a => a.name).join(', '); // Show all authors
    }, [authors]);

    const SettingsIcon = () => <AdjustmentsHorizontalIcon className={`size-6 ${activeTheme.textColor}`} />;

    // --- State ---
    const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>(() =>
        getLocalStorageItem<ThemeKey>('reader_theme_key', 'paper')
    );
    const [fontSizePx, setFontSizePx] = useState<number>(() =>
        getLocalStorageItem<number>('reader_font_size_px', 18) // Default font size in pixels
    );
    const [brightness, setBrightness] = useState<number>(() =>
        getLocalStorageItem<number>('reader_brightness', 0) // Default 0% overlay
    );
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // --- Reading Progress State ---
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [estimatedReadTime, setEstimatedReadTime] = useState(0);

    // Refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isRestoringScroll = useRef(false);

    // --- Derived State ---
    const activeTheme = useMemo(() =>
        READING_THEMES.find(t => t.key === activeThemeKey) || READING_THEMES[0],
        [activeThemeKey]
    );

    // --- Pagination Logic ---
    const pages = useMemo(() => {
        if (!book?.content) return [];
        const paragraphs = book.content.split(/\n\s*\n+/);
        const chunks: string[] = [];
        for (let i = 0; i < paragraphs.length; i += PARAGRAPHS_PER_PAGE) {
            chunks.push(paragraphs.slice(i, i + PARAGRAPHS_PER_PAGE).join('\n\n'));
        }
        setTotalPages(chunks.length || 1);
        pageRefs.current = chunks.map(() => null);
        return chunks;
    }, [book?.content]);

    // --- Effects ---

    // Save Settings to localStorage
    useEffect(() => {
        setLocalStorageItem('reader_theme_key', activeThemeKey);
    }, [activeThemeKey]);

    useEffect(() => {
        setLocalStorageItem('reader_font_size_px', fontSizePx);
    }, [fontSizePx]);

    useEffect(() => {
        setLocalStorageItem('reader_brightness', brightness);
    }, [brightness]);

    // Calculate Reading Time
    useEffect(() => {
        if (book?.content) {
            const wordCount = book.content.trim().split(/\s+/).length;
            const time = Math.ceil(wordCount / WORDS_PER_MINUTE);
            setEstimatedReadTime(time);
        } else {
            setEstimatedReadTime(0);
        }
    }, [book?.content]);

    // Scroll Handling & Progress (Same as before)
    const handleScroll = useCallback(() => {
        if (isRestoringScroll.current) return;
        const container = scrollContainerRef.current;
        if (container) {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
            setScrollProgress(progress);
            if (id) {
                setLocalStorageItem(`book_progress_${id}`, scrollTop);
            }
        }
    }, [id]);

    // Scroll Restoration and Event Listener Setup (Same as before)
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        container.addEventListener('scroll', handleScroll, { passive: true });
        if (id) {
            const savedScroll = getLocalStorageItem<number | null>(`book_progress_${id}`, null);
            if (savedScroll !== null && savedScroll > 0) {
                isRestoringScroll.current = true;
                requestAnimationFrame(() => {
                    container.scrollTo({ top: savedScroll, behavior: 'auto' });
                    const scrollHeight = container.scrollHeight - container.clientHeight;
                    const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (savedScroll / scrollHeight) * 100)) : 0;
                    setScrollProgress(progress);
                    setTimeout(() => { isRestoringScroll.current = false; }, 150);
                });
            } else {
                setScrollProgress(0);
            }
        } else {
            setScrollProgress(0);
        }
        return () => container.removeEventListener('scroll', handleScroll);
    }, [id, handleScroll, pages]);

    // Intersection Observer for Current Page (Same as before)
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        const options = { root: scrollContainerRef.current, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
        const observerCallback: IntersectionObserverCallback = (entries) => {
            let topVisibleEntry: IntersectionObserverEntry | null = null;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!topVisibleEntry || entry.boundingClientRect.top < topVisibleEntry.boundingClientRect.top) {
                        topVisibleEntry = entry;
                    }
                }
            });
            if (topVisibleEntry) {
                const pageIndex = pageRefs.current.findIndex(ref => ref === topVisibleEntry?.target);
                if (pageIndex !== -1) setCurrentPage(pageIndex + 1);
            }
        };
        observerRef.current = new IntersectionObserver(observerCallback, options);
        const currentObserver = observerRef.current;
        pageRefs.current.forEach(ref => { if (ref) currentObserver.observe(ref); });
        return () => { if (currentObserver) currentObserver.disconnect(); observerRef.current = null; };
    }, [pages]);

    // --- Event Handlers ---
    const clearBookmark = () => {
        if (id && scrollContainerRef.current) {
            setLocalStorageItem(`book_progress_${id}`, 0);
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            setScrollProgress(0);
            setCurrentPage(1);
        }
    };

 

    // --- Render Logic ---

    if (!book) {
        // Not Found State (Same as before)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 text-gray-800">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Book Not Found</h2>
                <p className="mb-6">Could not find a book with the specified ID.</p>
                <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
                    Go Back Home
                </Link>
            </div>
        );
    }

    return (
        <div className={clsx("flex flex-col h-screen bg-transparent")}>
            <Button
                isIconOnly
                variant="light"
                size='sm'
                aria-label="Display Settings"
                title="Display Settings"
                onPress={() => setIsSettingsOpen(true)}
                className="fixed bg-base-content/10 backdrop-blur-md bottom-4 right-4 z-20"
            >
                <SettingsIcon />
            </Button>
            <Toolbar
                book={book}
                displayAuthorName={displayAuthorName}
                currentPage={currentPage}
                totalPages={totalPages}
                clearBookmark={clearBookmark}
            />
            <ScrollProgressBar scrollProgress={scrollProgress} />
            <ContentArea
                book={book}
                displayAuthorName={displayAuthorName}
                pages={pages}
                activeTheme={activeTheme}
                fontSizePx={fontSizePx}
                brightness={brightness}
                scrollContainerRef={scrollContainerRef}
                pageRefs={pageRefs}
                estimatedReadTime={estimatedReadTime}
            />
            <AnimatePresence>
                {isSettingsOpen && <SettingsPopup
                    activeThemeKey={activeThemeKey}
                    setActiveThemeKey={setActiveThemeKey}
                    fontSizePx={fontSizePx}
                    setFontSizePx={setFontSizePx}
                    brightness={brightness}
                    setBrightness={setBrightness}
                    setIsSettingsOpen={setIsSettingsOpen}
                />}
            </AnimatePresence>
        </div>
    );
};

export default ReadPage;    