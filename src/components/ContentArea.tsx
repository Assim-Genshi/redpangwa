import React from 'react';
import { Card, CardBody } from "@heroui/react";

const ContentArea: React.FC<{
    book: any;
    displayAuthorName: string;
    pages: string[];
    activeTheme: any;
    fontSizePx: number;
    brightness: number;
    scrollContainerRef: React.RefObject<HTMLDivElement>;
    pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    estimatedReadTime: number;
}> = ({
    book,
    displayAuthorName,
    pages,
    activeTheme,
    fontSizePx,
    brightness,
    scrollContainerRef,
    pageRefs,
    estimatedReadTime
}) => {
    return (
        <div
            ref={scrollContainerRef}
            className={`flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 relative ${activeTheme.bgColor}`}
            style={{
                color: activeTheme.textColor, // Apply base text color via style for simplicity
            }}
        >
            {/* Brightness Overlay */}
            <div
                className="fixed inset-0 z-9 bg-black pointer-events-none"
                style={{ opacity: brightness }}
            />

            {/* Content Container */}
            <div className="max-w-3xl mx-auto relative pt-10 z-0"> {/* Ensure content is above overlay */}
                {/* Book Header */}
                <header className="mb-6 sm:mb-8 text-center border-b pb-4 border-gray-300 dark:border-gray-600">
                    {/* Apply theme text color explicitly if needed */}
                    <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${activeTheme.textColor}`}>{book.title}</h1>
                    <p className={`text-sm mb-2 ${activeTheme.textColor === 'text-black' || activeTheme.textColor === 'text-gray-800' ? 'text-gray-600' : 'text-gray-400'}`}>
                        by {displayAuthorName}
                    </p>
                    <p className={`text-xs ${activeTheme.textColor === 'text-black' || activeTheme.textColor === 'text-gray-800' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Est. reading time: {estimatedReadTime} min
                    </p>
                </header>

                {/* Render Pages using HeroUI Card */}
                {pages.map((pageContent, index) => (
                    <Card
                        key={index}
                        ref={el => pageRefs.current[index] = el}
                        className={`mb-6 overflow-hidden shadow-none border-none bg-transparent`}
                        radius="none" // Remove card radius if desired
                    >
                        <CardBody className="p-0"> {/* Remove CardBody padding */}
                            <div
                                style={{
                                    fontFamily: activeTheme.fontFamily,
                                    fontSize: `${fontSizePx}px`,
                                }}
                                className={`prose ${activeTheme.proseClass} max-w-none whitespace-pre-line ${fontSizePx < 16 ? 'leading-relaxed' : fontSizePx < 22 ? 'leading-relaxed' : 'leading-normal'} ${activeTheme.textColor}`}
                            >
                                {pageContent}
                            </div>
                        </CardBody>
                        {/* Page number - style according to theme */}
                        <div className={`text-center text-xs pt-4 pb-2 ${activeTheme.textColor === 'text-black' || activeTheme.textColor === 'text-gray-800' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Page {index + 1}
                        </div>
                    </Card>
                ))}

                {/* End of Book Marker */}
                {pages.length > 0 && (
                    <div className={`text-center text-sm py-8 ${activeTheme.textColor === 'text-black' || activeTheme.textColor === 'text-gray-800' ? 'text-gray-500' : 'text-gray-400'}`}>
                        --- End of Book ---
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentArea;    