import React from 'react';
// Import ButtonGroup along with Button and Slider
import { Slider, Button, ButtonGroup } from "@heroui/react";
import { SunIcon } from "@heroicons/react/24/solid";
// Consider importing MinusIcon and PlusIcon if you prefer icons for the buttons
// import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const READING_THEMES = [
    { key: 'paper', label: 'Paper', fontFamily: "'Lora', serif", bgColor: 'bg-[#FBF6EF]', textColor: 'text-gray-800', proseClass: 'prose-p:text-gray-800 prose-headings:text-gray-900' },
    { key: 'calm', label: 'Calm', fontFamily: "'Source Sans 3', sans-serif", bgColor: 'bg-[#E4E9F0]', textColor: 'text-gray-700', proseClass: 'prose-p:text-gray-700 prose-headings:text-gray-800' },
    { key: 'bold', label: 'Bold', fontFamily: "'Merriweather', serif", bgColor: 'bg-gray-900', textColor: 'text-gray-100', proseClass: 'prose-invert prose-p:text-gray-100 prose-headings:text-white' }, // Dark theme example
    { key: 'focus', label: 'Focus', fontFamily: "'Roboto Slab', serif", bgColor: 'bg-white', textColor: 'text-black', proseClass: 'prose-p:text-black prose-headings:text-black' },
];

// --- Font Size Mapping ---
const MIN_FONT_SIZE = 14; // pixels
const MAX_FONT_SIZE = 28; // pixels
const FONT_SIZE_STEP = 1; // Increase/decrease step

// --- Brightness Mapping ---
const MIN_BRIGHTNESS = 0; // 0% opacity overlay
const MAX_BRIGHTNESS = 0.7; // 70% opacity overlay (adjust as needed)
const BRIGHTNESS_STEP = 0.05;

const SettingsPopup: React.FC<{
    activeThemeKey: string;
    setActiveThemeKey: (key: string) => void;
    fontSizePx: number;
    setFontSizePx: (value: number) => void;
    brightness: number;
    setBrightness: (value: number) => void;
    setIsSettingsOpen: (value: boolean) => void;
}> = ({
    activeThemeKey,
    setActiveThemeKey,
    fontSizePx,
    setFontSizePx,
    brightness,
    setBrightness,
    setIsSettingsOpen
}) => {

    // Handler for the brightness slider (remains the same)
    const handleBrightnessChange = (value: number | number[]) => {
        setBrightness(Array.isArray(value) ? value[0] : value);
    };

    // Handler to decrease font size
    const handleDecreaseFontSize = () => {
        setFontSizePx(Math.max(MIN_FONT_SIZE, fontSizePx - FONT_SIZE_STEP));
    };

    // Handler to increase font size
    const handleIncreaseFontSize = () => {
        setFontSizePx(Math.min(MAX_FONT_SIZE, fontSizePx + FONT_SIZE_STEP));
    };


    return (
        <div
            className="fixed inset-0 z-40 bg-black/10 flex items-end justify-center p-4"
            onClick={() => setIsSettingsOpen(false)} // Close on backdrop click
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-4"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
            >
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Themes & Settings</h3>

                {/* Theme Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Theme</label>
                    <div className="flex flex-wrap justify-center gap-2">
                        {READING_THEMES.map((themeOpt) => {
                            const isActive = activeThemeKey === themeOpt.key;
                            return (
                                <Button
                                    key={themeOpt.key}
                                    size="sm"
                                    variant={isActive ? "solid" : "bordered"}
                                    style={{
                                        fontFamily: themeOpt.fontFamily,
                                    }}
                                    className={`
                                      w-full max-w-24 h-fit py-3 text-4xl flex flex-col
                                      ${themeOpt.bgColor}
                                      ${themeOpt.textColor}
                                      ${isActive ? 'border-2 border-primary' : ''}
                                      dark:border-gray-600
                                    `}
                                    onPress={() => setActiveThemeKey(themeOpt.key)}
                                >
                                    <h2>Aa</h2><h1 style={{ fontFamily: "inter" }} className='text-sm text-center text-gray-500'>{themeOpt.label}</h1>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Font Size Buttons */}
                <div className="mb-6">
                    {/* Use flex to align label, buttons, and value */}
                    <div className="flex items-center justify-between mb-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                         {/* Display current font size */}
                         <span className="text-sm text-gray-500 dark:text-gray-400">{fontSizePx}px</span>
                    </div>
                    <div className="flex justify-center"> {/* Center the button group */}
                        <ButtonGroup variant="bordered" color="primary" size="md">
                            <Button
                                onPress={handleDecreaseFontSize}
                                isDisabled={fontSizePx <= MIN_FONT_SIZE} // Disable if at min size
                                aria-label="Decrease font size"
                            >
                                {/* You can use text or an icon */}
                                {/* <MinusIcon className="h-5 w-5" /> */}
                                A-
                            </Button>
                            <Button
                                onPress={handleIncreaseFontSize}
                                isDisabled={fontSizePx >= MAX_FONT_SIZE} // Disable if at max size
                                aria-label="Increase font size"
                            >
                                {/* You can use text or an icon */}
                                {/* <PlusIcon className="h-5 w-5" /> */}
                                A+
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>


                {/* Brightness Slider */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Brightness</label>
                    <Slider
                        aria-label="Brightness"
                        size="md"
                        color="primary"
                        step={BRIGHTNESS_STEP}
                        minValue={MIN_BRIGHTNESS}
                        maxValue={MAX_BRIGHTNESS}
                        value={brightness}
                        onChange={handleBrightnessChange} // Use onChange for smoother updates if desired
                        // onChangeEnd={handleBrightnessChange} // Or keep onChangeEnd
                        className="w-full"
                        startContent={<SunIcon className="h-4 w-4 text-gray-500 dark:text-gray-400"/>}
                        endContent={<span className="text-sm text-gray-500 dark:text-gray-400">{Math.round((1 - brightness) * 100)}%</span>}
                    />
                </div>

                <div className="mt-6 text-right">
                    <Button variant="flat" color="primary" onPress={() => setIsSettingsOpen(false)}>
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPopup;