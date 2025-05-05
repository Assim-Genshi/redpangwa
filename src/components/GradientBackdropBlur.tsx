import React from 'react';

interface Stop {
  blur: number; // Blur value in px
  position: number; // Position percentage (0-100) where this blur should be fully active
}

interface GradientBackdropBlurProps {
  /** Controls the overall strength of the blur effect. Default: 1 */
  intensity?: number;
  /** Optional CSS classes for positioning or other overrides. */
  className?: string;
  /** Direction of the gradient blur. Default: 'to bottom' */
  direction?: 'to bottom' | 'to top' | 'to left' | 'to right';
  /**
   * Array of blur stops. Each stop defines a blur value and the position
   * (0-100%) where that blur level should start taking full effect.
   * Stops should generally be sorted by position, starting at 0.
   * Default: A set of exponentially increasing blur values.
   */
  stops?: Stop[];
  /**
   * Defines the height/width (in percentage) of the transition zone
   * between two consecutive blur stops for smoother blending. Default: 5
   */
  transitionSize?: number;
   /**
   * Optional blur intensity (CSS filter: blur) applied to the mask layers themselves
   * to further smooth transitions between backdrop-filter steps. Default: 0 (no blur)
   * Example: '3px' corresponds to Tailwind `blur-[3px]`
   */
  maskBlur?: string; // e.g., '3px'
}

const defaultStops: Stop[] = [
  { blur: 0.1, position: 0 },     // Base blur at the start
  { blur: 0.5, position: 15 },
  { blur: 1, position: 30 },
  { blur: 2.5, position: 45 },
  { blur: 5, position: 60 },
  { blur: 10, position: 75 },
  { blur: 20, position: 90 },     // Stronger blur towards the end
];

const GradientBackdropBlur: React.FC<GradientBackdropBlurProps> = ({
  intensity = 1,
  className = '',
  direction = 'to bottom',
  stops = defaultStops,
  transitionSize = 5, // Percentage height/width for the transition smoothness
  maskBlur = '0px', // Default to no extra mask blur
}) => {
  // Ensure stops are sorted by position and remove duplicates
  const uniqueSortedStops = Array.from(new Map(stops.map(s => [s.position, s])).values())
                                .sort((a, b) => a.position - b.position);

  // Ensure there's a stop at position 0
  if (uniqueSortedStops.length === 0 || uniqueSortedStops[0].position !== 0) {
    const firstBlur = uniqueSortedStops[0]?.blur ?? 0.1; // Use first defined blur or a tiny default
    uniqueSortedStops.unshift({ blur: firstBlur, position: 0 });
  }

  // Determine if maskBlur is non-zero to apply the class/style
  const applyMaskBlur = maskBlur && maskBlur !== '0px' && maskBlur !== '0';
  const maskBlurStyle = applyMaskBlur ? { filter: `blur(${maskBlur})` } : {};
  // Or if using Tailwind, you might construct the class name dynamically, but inline style is simpler here.


  return (
    // Added overflow-hidden which can sometimes help with mask edges
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {uniqueSortedStops.map((stop, index) => {
        const actualBlur = stop.blur * intensity;

        // Base layer (index 0) covers the entire area with the starting blur
        if (index === 0) {
          return (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                zIndex: 5, // Base layer
                backdropFilter: `blur(${actualBlur}px)`,
                WebkitBackdropFilter: `blur(${actualBlur}px)`,
                // No mask needed, covers the whole area
              }}
            />
          );
        }

        // Subsequent layers apply stronger blur and are masked
        // to fade in starting slightly before their defined position.
        const startTransition = Math.max(0, stop.position - transitionSize / 2);
        const endTransition = Math.min(100, stop.position + transitionSize / 2);

        // Prevent invalid gradient if start >= end
        const finalStart = Math.min(startTransition, endTransition - 0.01); // Ensure start < end

        const maskImage = `linear-gradient(${direction}, transparent ${finalStart}%, black ${endTransition}%)`;

        return (
          <div
            key={index}
            // Apply mask blur class/style conditionally
            className={`absolute inset-0`}
            style={{
              zIndex: -2, // CORRECTED: Higher z-index overlays previous layers
              backdropFilter: `blur(${actualBlur}px)`,
              WebkitBackdropFilter: `blur(${actualBlur}px)`,
              maskImage: maskImage,
              WebkitMaskImage: maskImage,
              // Apply the CSS filter blur to the layer itself to soften the mask edge
              ...maskBlurStyle,
            }}
          />
        );
      })}
    </div>
  );
};

export default GradientBackdropBlur;