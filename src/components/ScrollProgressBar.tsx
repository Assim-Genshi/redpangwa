import React from 'react';
import { motion } from 'framer-motion';

const ScrollProgressBar: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
    return (
        <div className="relative h-1 w-full bg-gray-300 dark:bg-gray-700 flex-shrink-0">
            <motion.div
                className="absolute top-0 left-0 h-full bg-blue-500" // Consider making progress bar color themeable
                style={{ width: `${scrollProgress}%`, originX: 0 }}
                transition={{ duration: 0.1, ease: "linear" }}
            />
        </div>
    );
};

export default ScrollProgressBar;    