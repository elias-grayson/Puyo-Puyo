/* This document accounts for all of the animations that play in the game */
document.addEventListener('DOMContentLoaded', () => {

    // Helper function to parse colors into [r, g, b] format
    window.parseRGB = function parseRGB(color) {

        // Extracts numeric RGB values if the color is in rgb format
        if (color.startsWith("rgb")) {
            const match = color.match(/\d+/g);
            return match ? match.map(Number) : [0, 0, 0];
        }

        // Creates a temporary DOM element to extract color if in named format
        const dummyDiv = document.createElement("div");
        dummyDiv.style.color = color;
        document.body.appendChild(dummyDiv);
        const computedColor = window.getComputedStyle(dummyDiv).color;
        document.body.removeChild(dummyDiv);

        return parseRGB(computedColor);
    }

    window.startColor = {}; // Initialize the connected puyos starting color
    let popAnimateStartTime = null; // Determines when the clearing animation starts

    // Fades puyos to white before being popped
    window.animatePop = async function animatePop(timestamp) {
        if (!popAnimateStartTime) popAnimateStartTime = timestamp;
        const elapsedTime = timestamp - popAnimateStartTime;
        const progress = Math.min(elapsedTime / popAnimateDuration, 1); // Animation progress

        globalConnectedPuyos.forEach(ind => {
            const currentElement = squares[ind];
    
            // Use the start color for this specific square
            const color = startColor[ind];
            if (!color || !Array.isArray(color)) {
                return;
            }

            const endColor = [255, 255, 255]; // White

            // Interpolate between startColor and endColor
            if (color !== undefined) {
                const currentColor = color.map((start, index) => {
                    return Math.round(start + (endColor[index] - start) * progress);
                });
            
            // Apply the interpolated color
            currentElement.style.backgroundColor = `rgb(${currentColor.join(',')})`;
            }
        });

        // Continues animation if not finished
        if (progress < 1) {
            requestAnimationFrame(animatePop);
        } 
    }

    // Resets the popping animation so it can be used again
    window.resetPopAnimation = function resetPopAnimation() {
        popAnimateStartTime = null;
        startColor = {};  // Reset the starting color for the next animation
        elementsAnimated = 0; // Reset the counter
        arePuyosCleared = false;
    }

    window.scaleAnimationTimer = 500;
    const scaleAnimateDuration = 300; // Duration each number will animate for
    let scaleAnimateStartTime = null; // Determines when the start animation starts

    // Displays 3 2 1 GO before starting the game
    window.startNumbers = function startNumbers() {
        if (isGameReset) return;
        pauseOverlayText.style.fontSize = "10vh";
        pauseOverlayText.innerHTML = "3";
        playStartSound(-600)
        resetNumAnimation();
        requestAnimationFrame((timestamp) => animateNumbers(pauseOverlayText, 10, 5, timestamp));

        setTimeout (() => {
            if (isGameReset) return;
            pauseOverlayText.style.fontSize = "10vh";
            pauseOverlayText.innerHTML = "2";
            playStartSound(-400)
            resetNumAnimation();
            requestAnimationFrame((timestamp) => animateNumbers(pauseOverlayText, 10, 5, timestamp));
            
            setTimeout (() => {
                if (isGameReset) return;
                pauseOverlayText.style.fontSize = "10vh";
                pauseOverlayText.innerHTML = "1";
                playStartSound(-100)
                resetNumAnimation();
                requestAnimationFrame((timestamp) => animateNumbers(pauseOverlayText, 10, 5, timestamp));
            }, scaleAnimationTimer);
        }, scaleAnimationTimer);
    }

    // Helper to add a scaling animation to the start numbers
    window.animateNumbers = function animateNumbers(text, startScale, endScale, timestamp) {
        if (!scaleAnimateStartTime) scaleAnimateStartTime = timestamp;
        const elapsedTime = timestamp - scaleAnimateStartTime;
        const progress = Math.min(elapsedTime / scaleAnimateDuration, 1); // Animation progress

        const currentScale = `${Math.min((startScale - endScale) / progress, startScale)}vh`;

        text.style.fontSize = `${currentScale}`;

        // Continues animation if not finished
        if (progress < 1) {
            requestAnimationFrame((newTimestamp) => animateNumbers(text, startScale, endScale, newTimestamp));
        }
    }

    // Resets the scaling animation so it can be used again
    window.resetNumAnimation = function resetNumAnimation() {
        scaleAnimateStartTime = null;
    }
})