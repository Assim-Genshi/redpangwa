import React from 'react';
import { motion } from 'framer-motion';

//---- heroui ----
import { Button, Link } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import GradientBackdropBlur from './GradientBackdropBlur';

const Toolbar: React.FC<{
    book: any;
    displayAuthorName: string;
    currentPage: number;
    totalPages: number;
    clearBookmark: () => void;
}> = ({
    displayAuthorName,
    currentPage,
    totalPages,
    clearBookmark,
}) => {

    return (
        <>
            <motion.div
                className="fixed w-full top-1 z-20 flex flex-wrap items-center justify-between gap-x-4 p-2 bg-transparent pb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <GradientBackdropBlur direction='to top' maskBlur="5px" className="absolute inset-0"/>
                {/* Left Controls */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Button as={Link} color='primary' variant='flat' size='sm' startContent={<ArrowLeftIcon className="size-4" />} href='/'>
                        Home
                    </Button>
                    
                    <div className="hidden sm:block overflow-hidden whitespace-nowrap">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={displayAuthorName}>{displayAuthorName}</p>
                    </div>
                </div>

                {/* Center/Right Controls */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Page Indicator */}
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline whitespace-nowrap">
                        Page {currentPage} / {totalPages}
                    </span>

                    {/* Clear Bookmark */}
                    <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={clearBookmark}
                        title="Clear Bookmark (Scroll to Top)"
                        className="text-xs whitespace-nowrap"
                    >
                        Clear Mark
                    </Button>
                </div>
            </motion.div>
        </>
    );
};

export default Toolbar;    