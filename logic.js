/* This document accounts for all of the game logic */
document.addEventListener('DOMContentLoaded', () => {

    // DOM elements
    const scoreContainer = document.querySelector('#scoreDisplay'); // Displays score
    const scoreDisplay = document.querySelector('#score'); // Displays score
    window.chainDisplay = document.querySelector('#chainLength'); // Background for chain length
    window.chainDisplayText = document.querySelector('#chainLengthText'); // Displays chain length
    const chainText = document.querySelector('#chainText');
    const chainDisplayTextContainer = document.querySelector('#chainLengthTextContainer');
    window.upNext = document.querySelector('#upNext'); // Displays the up next text
    window.startBtn = document.querySelector('#start-button') // Start and pause button
    const gameOverDisplay = document.querySelector('#gameOverDisplay'); // Displays the end state
    window.dropdownBtn = document.querySelector('.dropdown'); // All dropdown menus
    window.aestheticCustom = document.querySelector('#aesthetic-custom'); // Customize aesthetics button
    window.squares = Array.from(document.querySelectorAll('.grid div')); // Array of all grid spaces
    const miniSquares = Array.from(document.querySelectorAll('.mini-grid div'));
    const nextMiniSquares = Array.from(document.querySelectorAll('.next-mini-grid div'));
    window.ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div')); // Array of all ghost grid spaces
    window.custom = document.querySelector('#customBtn'); // Customization button
    const speedDisplay = document.querySelector('#speedDisplay'); // Speed up text
    window.pauseOverlay = document.querySelector('.grid-pause-overlay');
    window.miniGridOverlay = document.querySelectorAll('.mini-grid-overlay');
    const resetBtn = document.querySelector('.reset-div');
    const resetToastEl = document.querySelector('#resetToast');
    window.pauseOverlayText = document.querySelector('.pauseOverlayText');
    const navDisabledText = document.querySelector('#navDisabledText');

    // Variables
    window.width = 6; // Width of each grid space
    let timerId = 0; // Interval in which puyos fall
    let score = 0; // Score of the game
    window.isInputEnabled = false; // Controls whether input is enabled
    window.isClickedOnce = false; // Controls whether the start button has been clicked once
    window.chainLength = 0; // Length of the current chain
    let puyoCount = 0; // Number of puyo cleared in a chain
    let chainPower = 0; // Chain power depending on chain length
    let colorBonus = 0; // Color bonus depending on how many different colored puyo were cleared
    let groupBonus = 0; // Group bonus depending on how many of the same color puyo were cleared
    let timeoutId; // Id for how long multiplier's increment
    let isFalling = false // Tracks if puyos are currently falling
    let isMovementResumed = false // Tracks if current position movement can occur
    let isGameOver = false; // Checks if a game over has occurred
    window.puyosToPop = 4; // Amount of puyos needed to connect in order to pop
    window.amountOfColors = 4; // Amount of different colors displayed
    window.fallSpeed = 1000; // How much time passes before puyos are moved down
    window.originalFallSpeed = 1000; // The original fall speed which does not change
    window.showImageClicked = false; // Checks whether the image puyos are selected
    window.timeToSpeedUp = 90000; // How long it takes for the game to speed up
    window.remainingTime = timeToSpeedUp; // The time it takes for the game to speed up, unalterable
    window.isSpeedUpEnabled = true; // Tracks if speed up is enabled
    let speedInterval = 0; // Interval in which the game speeds up
    let hasSpedUp = false; // Tracks if the game has sped up
    let startTime; // Time since the game has started
    let isPaused = false; // Tracks if the speed up timer has been paused
    window.fallingAndColorTimer = 800; // How long it takes for puyos to clear
    const resumeTimer = 80; // How long it takes for puyos to land
    let resumeTimerChange = false // Tracks if the landing timer has been resumed
    let areClearsReset = true // Tracks if process clears has been called already
    let isAtMaxSpeed = false; // Tracks whether the game is at the maximum speed
    window.movementStart = false;
    window.isHidingGridEnabled = false; // Tracks if gameplay will be obscured when pausing
    let isAllClear = false; // Tracks if all clear state was reached
    let isGhost = false; // Whether or not the puyos being used in a given function are ghosts or not
    let isHardDrop = false; // Whether hard drop has been used
    window.gracePeriodTimer = 1000; // Amount of time in which movement can occur when placed before next puyos will spawn
    let isMoveDownEnabled = true; // Whether moving down is enabled
    let isFreezeFinished = true;
    window.isGameReset = false;
    let fallingTimer = 70; // How long it takes for puyos to fall down 1 grid space

    // All puyo colors
    window.colors = [
        'red',
        'forestgreen',
        'dodgerblue',
        'yellow',
        'blueviolet',
        'teal',
        'hotpink'
    ]

    // Maps puyos to their respective class based on color
    const colorClassMap = {
        "rgb(255, 0, 0)": "redPuyo",   // Red
        "rgb(34, 139, 34)": "greenPuyo", // Green
        "rgb(30, 144, 255)": "bluePuyo",  // Blue
        "rgb(255, 255, 0)": "yellowPuyo", // Yellow
        "rgb(138, 43, 226)": "purplePuyo", // Purple
        "rgb(0, 128, 128)": "tealPuyo", // Teal
        "rgb(255, 105, 180)": "pinkPuyo" // Pink
    };
    
    // Puyo rotations
    window.puyo = [
        [width, 0],
        [width, width+1],
        [width, width*2],
        [width, width-1]
    ];

    // Randomly selects a puyo
    window.random = Math.floor(Math.random()*amountOfColors);
    window.randomSecondary = Math.floor(Math.random()*amountOfColors);
    window.nextRandom = 0;
    window.nextRandomSecondary = 0;
    window.thirdRandom = 0;
    window.thirdRandomSecondary = 0;
    window.currentPosition = Math.ceil(width / 2 - 1);
    window.deathPoint = Math.ceil(width / 2 - 1) + width;
    window.currentRotation = 0;
    window.current = puyo[currentRotation];
    let primaryColorClass = colorClassMap[colors[random]];
    let secondaryColorClass = colorClassMap[colors[randomSecondary]];

    // Adds font to the puyos
    function addFont(puyos, puyoPosition, array) {
        let computedColor;
        if (window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor) {
            computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;
        }

        // If the computed color matches one in the map, add font
        if (colorClassMap[computedColor]) {
            array[puyos + puyoPosition].removeAttribute('id');
            array[puyos + puyoPosition].classList.add(colorClassMap[computedColor]);
        }
    }

    // Removes font from puyos
    function removeFont(puyos, puyoPosition, array) {
        let computedColor;
        if (window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor) {
            computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;
        }
    
        // If the computed color matches one in the map, remove font
        if (colorClassMap[computedColor]) {
            array[puyos + puyoPosition].classList.remove(colorClassMap[computedColor]);
        }
    }

    window.firstBelowGhost = 0;
    window.secondBelowGhost = 0;

    // Draws puyos
    function draw(puyos) {
        if (isGameOver) return;

        // Allows moving down if there is nothing directly below the current puyos
        if (!squares[currentPosition + current[0] + width].classList.contains('taken') && 
        !squares[currentPosition + current[1] + width].classList.contains('taken')) {
            clearInterval(timeoutFreeze);
            isMoveDownEnabled = true;
        }

        // Sets color and font for first puyo
        current.forEach(index => {
            squares[puyos + index].classList.add('puyoBlob', 'currentPosition');
            squares[puyos + index].style.backgroundColor = colors[random];
            squares[puyos + index].classList.add(primaryColorClass);
            addFont(puyos, current[1], squares);
        });
    
        // Sets color and font for second puyo
        if (puyos === currentPosition) {
            squares[puyos + current[0]].style.backgroundColor = colors[randomSecondary];
            current.forEach(index => {
                squares[puyos + index].classList.add(secondaryColorClass);
                addFont(puyos, current[0], squares);
                squares[puyos + index].classList.add('currentPosition');
            });
        }
        resetBtn.style.opacity = "0%";
        resetBtn.style.zIndex = "-2";
        if (!isMoveDownEnabled) return;
        freeze(current);
    }

    // Undraws puyos
    function undraw(puyos, array) {
        if ((isHardDrop && !isMoveDownEnabled) && (!isGameReset)) return;

        // Removes classlist, color, and font from puyos
        array.forEach(index => {
            if (array == current) {
                removeFont(puyos, index, squares);
                squares[puyos + index].classList.remove("currentPosition", "puyoBlob")
                squares[puyos + index].style.backgroundColor = '';
            } else { // Accounts for removing puyos when game is reset
                removeFont(puyos, 0, array);
                array[puyos].classList.remove("puyoBlob", "taken");
                array[puyos].style.backgroundColor = '';
            }
        });

        // Undraws ghost puyos
        ghostSquares.forEach(index => {
            index.style.backgroundColor = '';
            index.style.outline = 'none';
            index.classList.remove('ghostPuyo');
        });
    }

    // Move down function
    window.sharedMoveDownCurrent = function moveDownCurrent() {
        if (!isMovementResumed || !isMoveDownEnabled) return;
        multiplierTimeout();
        undraw(currentPosition, current); // Remove puyos from the current position
        currentPosition += width;
        score += 1;
        scoreDisplay.innerHTML = score;
        draw(currentPosition);
    }

    let hasFallen = false;

    // Moves puyos down when there is nothing beneath them
    async function moveDownPlaced(fallingTimer, visited) {
        if (isGameReset) return;
        startBtn.innerHTML = '<i class="fa-solid fa-square"></i>' + ' Disabled'

        return new Promise(resolve => {
            if (isGameReset) return;

            setTimeout(() => {
                // Perform move on every relevant puyo at the same time
                visited.forEach(ind => {
                    let belowIndex = ind + width;
                    if (isGameReset || squares[belowIndex].classList.contains('taken')) {
                        hasFallen = false;
                        return
                    };

                    // The puyo's color which stays the same throughout the move
                    initialColor = squares[ind].style.backgroundColor;

                    hasFallen = true;
                    isFallingTimeout();

                    // Remove the 'puyoBlob' class and font
                    removeFont(ind, 0, squares);
                    undraw(ind, squares)

                    // Preserves the color and adds relevant classes
                    squares[belowIndex].style.backgroundColor = initialColor;
                    addFont(belowIndex, 0, squares);
                    squares[belowIndex].classList.add('taken', 'puyoBlob');

                    // Reset the original position (after moving down)
                    squares[ind].classList.remove('puyoBlob', 'taken');
                    squares[ind].style.backgroundColor = '';
                    removeFont(ind, 0, squares);

                }) 
                resolve(); // Resolves the promise once the move is completed
            }, fallingTimer); // Delay for each puyo move      
        });
    }

    // Move down function for already placed puyos
    async function moveDownGhost() {

        // Current Horizontal positions of the inner and outer puyos
        let firstCurrentHorPosition = (currentPosition + current[0]) % width;
        let secondCurrentHorPosition = (currentPosition + current[1]) % width;

        let firstGhostIndex = ghostSquares[firstCurrentHorPosition];
        let secondGhostIndex = ghostSquares[secondCurrentHorPosition];

        firstBelowGhost = 0;
        secondBelowGhost = 0;

        const firstBottom = firstCurrentHorPosition + width
        const secondBottom = secondCurrentHorPosition + width

        // Iterate through the grid until reached a spot that's taken
        while (!squares[firstBelowGhost + firstBottom].classList.contains('taken') && 
        firstBelowGhost + firstBottom < width*height - width) {
            firstBelowGhost += width;
        }

        while (!squares[secondBelowGhost + secondBottom].classList.contains('taken') && 
        secondBelowGhost + secondBottom < width*height - width) {
            secondBelowGhost += width;
        }
        
        if (currentRotation === 2) {
            firstGhostIndex = ghostSquares[firstCurrentHorPosition + firstBelowGhost + current[0] - width*3];
            secondGhostIndex = ghostSquares[secondCurrentHorPosition + secondBelowGhost + current[1] - width*3];
        } else if (currentRotation === 1) {
            firstGhostIndex = ghostSquares[firstCurrentHorPosition + firstBelowGhost + current[0] - width*2];
            secondGhostIndex = ghostSquares[secondCurrentHorPosition + secondBelowGhost + current[0] - width*2];
        } else if (currentRotation === 3) {
            firstGhostIndex = ghostSquares[firstCurrentHorPosition + firstBelowGhost + current[0] - width*2];
            secondGhostIndex = ghostSquares[secondCurrentHorPosition + secondBelowGhost + current[0] - width*2];
        } else if (currentRotation === 0) {
            firstGhostIndex = ghostSquares[firstCurrentHorPosition + firstBelowGhost + current[0] - width*2];
            secondGhostIndex = ghostSquares[secondCurrentHorPosition + secondBelowGhost + current[1] - width*2];
        }
        
        firstGhostIndex.classList.add('ghostPuyo');
        firstGhostIndex.style.backgroundColor = squares[currentPosition + current[0]].style.backgroundColor;
        secondGhostIndex.classList.add('ghostPuyo');
        firstGhostIndex.style.transform = 'scale(0.35)';
        firstGhostIndex.style.outline = "0.5vh solid black";
        secondGhostIndex.style.backgroundColor = squares[currentPosition + current[1]].style.backgroundColor;
        secondGhostIndex.style.transform = 'scale(0.35)';
        secondGhostIndex.style.outline = "0.5vh solid black";
    }
    
    const hardDropSound = new Audio('game-sounds/thump.mp3');
    hardDropSound.volume = 0.7;

    // Allows the puyos to be snapped to the bottom instantly
    window.sharedHardDrop = function hardDrop() {
        isHardDrop = true;
        if (!isMovementResumed) return;
        clearInterval(gracePeriodTimer)
        gracePeriodTimer = 0;

        playInterruptableSound(hardDropSound);
        
        undraw(currentPosition, current); // Remove puyos from the current position
        let firstBelowIndex = currentPosition + current[0];
        let secondBelowIndex = currentPosition + current[1];
        while (!squares[firstBelowIndex].classList.contains('taken') || 
        !squares[secondBelowIndex].classList.contains('taken')) {
            sharedMoveDownCurrent();
            firstBelowIndex += width;
            secondBelowIndex += width;
            if ((firstBelowIndex || secondBelowIndex) >= squares.length - width) {
                break;
            }
        }
        gracePeriod();
    }

    // Doesn't allow CCW rotation to cause puyos to overflow to other side
    function checkRotationLeft() {
        let isAtLeftPuyoEdge = 0;

        // If left puyo edge is not a negative number, set the value
        if (currentPosition - width >= 0) 
            isAtLeftPuyoEdge = current.some(index => squares[currentPosition + index - 1].classList.contains('taken'));

        let isRotationFinished = false;
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        const isAtRightPuyoEdge = current.some(index => squares[currentPosition + index + 1].classList.contains('taken'));
        currentRotation--;

        if (currentRotation === -1) {
            currentRotation = 3;
        }
        if (currentRotation == 3 && ((isAtLeftEdge || isAtLeftPuyoEdge))) {
            currentPosition++;

            // Accounts for if in between puyos and edges
            current.some(index => {
                if ((squares[currentPosition + index].classList.contains('taken'))) {
                    currentRotation = 0;
                    currentPosition--;
                    isRotationFinished = true;
                }
                if (((currentPosition + index) % width === 0) && !isRotationFinished) {
                    currentRotation = 0;
                    currentPosition--;
                }    
            });
        }
        if (currentRotation == 1 && (isAtRightEdge || isAtRightPuyoEdge)) {
            currentPosition--;
        }

        // Accounts for if the puyos are at the bottom
        if (currentRotation == 2 && 
            (squares[current[0] + currentPosition + width].classList.contains('taken'))) {
            currentPosition -= width;
            isRotationFinished = true;
        } else if ((currentPosition < -1) && (currentRotation == 0)) {
            currentPosition += width;
            isRotationFinished = true;
        }
    }

    // Doesn't allow CW rotation to cause puyos to overflow to other side
    function checkRotationRight() {
        let isRotationFinished = false;
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        const isAtRightPuyoEdge = current.some(index => squares[currentPosition + index + 1].classList.contains('taken'));
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        let isAtLeftPuyoEdge = 0;

        // If left puyo edge is not a negative number, set the value
        if ((currentPosition - width) >= 0) 
            isAtLeftPuyoEdge = current.some(index => squares[currentPosition + index - 1].classList.contains('taken'));

        currentRotation++;

        if (currentRotation === 4) {
            currentRotation = 0;
        }
        if ((currentRotation == 1) && (isAtRightEdge || isAtRightPuyoEdge) ) {
            currentPosition--;

            // Accounts for if in between puyos and edges
            current.some(index => {
                if (squares[currentPosition + index].classList.contains('taken')) {
                    currentRotation = 0;
                    currentPosition++;
                    isRotationFinished = true;
                }
                if (((currentPosition + index) % width === width - 1) && !isRotationFinished) {
                    currentRotation = 0;
                    currentPosition++;
                }
            });
        }
        if (((currentRotation == 3) && (isAtLeftEdge || isAtLeftPuyoEdge) )) {
            currentPosition++;
        }

        // Accounts for if the puyos are at the bottom
        if (currentRotation == 2 && 
            (squares[current[0] + currentPosition + width].classList.contains('taken')) &&
            currentPosition > -1) {
            currentPosition -= width;
            isRotationFinished = true;
        } else if (currentPosition < -1 && currentRotation == 0) {
            currentPosition += width;
            isRotationFinished = true;
        }
    }

    // Makes sure 180 rotations don't clip into the bottom or other puyos
    function checkRotationFull() {
        if (!isMovementResumed || (isHardDrop && !isMoveDownEnabled)) return;
        undraw(currentPosition, current);
        let initialRandom = random;

        // Sets the background color and adds the puyoBlob class
        primaryColorClass = colorClassMap[colors[random]];
        secondaryColorClass = colorClassMap[colors[randomSecondary]];
        squares[currentPosition + current[0]].classList.add('puyoBlob', 'currentPosition');
        if (secondaryColorClass) {
            squares[currentPosition + current[0]].classList.add(secondaryColorClass);
        }
        squares[currentPosition + current[0]].style.backgroundColor = colors[random];
        addFont(currentPosition, current[0], squares);
    
        // // Adds secondary color
        squares[currentPosition + current[1]].style.backgroundColor = colors[randomSecondary];
        if (primaryColorClass) {
            squares[currentPosition + current[1]].classList.add(primaryColorClass);
        }
        addFont(currentPosition, current[1], squares);
        squares[currentPosition + current[1]].classList.add('puyoBlob', 'currentPosition');

        random = randomSecondary
        randomSecondary = initialRandom

        primaryColorClass = colorClassMap[colors[randomSecondary]];
        secondaryColorClass = colorClassMap[colors[random]];
    }

    const rotateSound = new Audio('game-sounds/slide.mp3');
    rotateSound.volume = 1.0;

    // Rotate the puyos clockwise
    window.sharedRotateRight = function rotateRight() {
        if (!isMovementResumed || (isHardDrop && !isMoveDownEnabled)) return;

        playInterruptableSound(rotateSound);

        undraw(currentPosition, current);
        checkRotationRight(currentPosition);
        current = puyo[currentRotation];
        draw(currentPosition);
    }

    // Rotate the puyos counterclockwise
    window.sharedRotateLeft = function rotateLeft() {
        if (!isMovementResumed || (isHardDrop && !isMoveDownEnabled)) return;

        playInterruptableSound(rotateSound);

        undraw(currentPosition, current);
        checkRotationLeft();
        current = puyo[currentRotation];
        draw(currentPosition);
    }

    // Rotates puyos by 180 degrees
    window.rotateFull = function rotateFull() {

        playInterruptableSound(rotateSound);

        undraw(currentPosition, squares);
        checkRotationFull();
        current = puyo[currentRotation];
        draw(currentPosition);
    }

    const speedSound = new Audio('game-sounds/cute-level-up-2.mp3');
    speedSound.volume = 0.5;

    // Function that checks if puyos have been placed down
    function freeze(puyos) {
        let nextIndex;
        if (current.some(index => {
            nextIndex = currentPosition + index + width;
            return nextIndex >= squares.length - width || squares[nextIndex].classList.contains('taken');
        })) {
            preloadSpellSounds();
            if (puyos == current) {
                gracePeriod();
            } 
        } else if (isGhostEnabled) {
            isGhost = true;
            falling(ghostSquares, 0);
        }
    }

    const placedSound = new Audio('game-sounds/big-bubble-2.mp3')
    placedSound.volume = 0.3;

    window.timeoutFreeze = null;
    // allows puyos to be moved when already placed slightly before the next set is spawned
    function gracePeriod() {
        if (isGameOver) return;
        isFreezeFinished = false;
        isMoveDownEnabled = false;
        isGhost = false;
        if (isHardDrop) {
            clearInterval(timeoutFreeze);
            gracePeriodTimer = 0;
        }
        playInterruptableSound(placedSound);
        gracePeriodCalculations();
    }

    // Helper for the changing the timer of the grace period
    function gracePeriodCalculations() {
        timeoutFreeze = setTimeout (() => {
            if (isFreezeFinished || isMoveDownEnabled || isGameOver || isGameReset) return;
            if (!timerId) {
                clearInterval(timeoutFreeze)
                gracePeriod();
            } else {
                isMovementResumed = false;
                startBtn.disabled = true;
                areClearsReset = false;
                current.forEach(index => squares[currentPosition + index].classList.remove('currentPosition'));
                current.forEach(index => squares[currentPosition + index].classList.add('taken'));
                falling(squares, fallingTimer);
                multiplierTimeout();
                scoreDisplay.innerHTML = score;
                squares.slice().forEach(index => {
                    if (index.classList.contains('aboveGrid') && index.classList.contains('taken')) {
                        index.classList.remove('taken');
                    }
                });
            }
        }, gracePeriodTimer);
    }

    // Creates new puyos to fall
    function createNewPuyo() {
        if (isGameOver) return;
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
        score++;
        scoreDisplay.innerHTML = score;
        isMoveDownEnabled = true;
        gracePeriodTimer = 800;
        isHardDrop = false;
        isFreezeFinished = true;
        current.forEach(index=> squares[currentPosition + index].classList.remove('currentPosition'));
        speedUp();

        // Makes the up next puyos the current puyo
        random = nextRandom;
        nextRandom = thirdRandom
        randomSecondary = nextRandomSecondary;
        nextRandomSecondary = thirdRandomSecondary;
        thirdRandom = Math.floor(Math.random() * amountOfColors);
        thirdRandomSecondary = Math.floor(Math.random() * amountOfColors);

        currentRotation = 0;
        current = puyo[currentRotation];
        currentPosition = Math.ceil(width / 2 - 1);
        if (width == 1) {
            currentPosition = Math.floor(width / 2)
        }
        draw(currentPosition);
        if (chainDisplayText.innerHTML !== "") {
            let chainDisplayRemovalId = setTimeout(() => {
                if (!isMovementResumed) {
                    clearInterval(chainDisplayRemovalId) 
                    return;
                };
                chainDisplayText.innerHTML = "";
            }, 2200);
        }
    }

    // Resets multiplier variables to default when the chain ends
    function multiplierTimeout() {
        chainLength = 0;
        puyoCount = 0;
        chainPower = 0;
        groupBonus = 0;
    }
    
    // Allows puyos to fall 
    async function falling(array, fallingTimer) {
        if (isGameOver || isGameReset) return;
        if (!isGhost) {
            isFallingTimeout();
        }
        let movedPuyos = false; // Tracks if any puyo moved
        let visited = new Set(); // Ensures no puyos get visited twice
        let promises = [];  // Array to hold promises

        // Loops through the grid squares
        array.forEach((square, index) => {

            // Skips if it's not a Puyo or already visited
            if ((!isGhost && !square.classList.contains('puyoBlob')) || visited.has(index) || 
            square.classList.contains('currentPosition')) return;

            const belowIndex = index + width; // Position below the current puyo
            
            // Skips if below the grid or if the square is already filled
            if (belowIndex >= squares.length - width) return;

            // Checks if the space below is empty
            if ((isGhost || (!squares[belowIndex].classList.contains('puyoBlob') && 
                !squares[belowIndex].classList.contains('taken')))) {

                visited.add(index);
                if (!isGhost) {
                    let newIndex = 0;
                    squares.forEach((sqr, ind) => {
                        if (ind = 0)
                            newIndex = index;

                        const aboveIndex = newIndex + index - width;

                        if (aboveIndex < 0) return;
                        if (!squares[aboveIndex].classList.contains('puyoBlob')) return;
                        visited.add(aboveIndex);
                        newIndex -= width;
                    });
                }
                
                let movePromise; // Initializes the move promise

                // Moves the Puyo down and add the promise for this move
                if (!isGhost) {
                    movePromise = moveDownPlaced(fallingTimer, visited);
                    promises.push(movePromise);  // Store the promise in an array
                    movedPuyos = true;
                    isFalling = true;
                    startBtn.disabled = true;
                }
            } 
        });

        if (isGhost) {
            moveDownGhost();
        }

        // Wait for all moves to finish before continuing
        if (movedPuyos && !isGhost && !isGameReset) {
            await Promise.all(promises); // Wait for all puyos to stop falling
            falling(array, fallingTimer); // Recursively call falling to check if any new Puyos need to fall
        } else {
            if (isGhost || isGameReset) return;
            // After all Puyos have settled, check for adjacent Puyos to clear
            squares.forEach((square, index) => {
                if (square.classList.contains('puyoBlob')) {
                    processClears();
                    checkAdjacentColor(index);
                }
            });
            if (hasFallen) {
                playInterruptableSound(placedSound);
            }
            processClears();
        }
        if (isGhost || isGameReset) return;
        isFalling = false;
    }

    // Draws more puyos if falling and chaining has stopped
    function isFallingTimeout() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (isGameOver || isFalling || resumeTimerChange) return;
            gameOver();
            hasFallen = false;
            if (isGameOver) return;
            resumeCurrent();
            isMovementResumed = true
        }, resumeTimer)
    }

    // Move puyos left, unless at the edge or there is a blockage
    window.sharedMoveLeft = function moveLeft() {
        if (!isMovementResumed || (isHardDrop && !isMoveDownEnabled)) return;
        undraw(currentPosition, current);
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge)
            currentPosition--;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition++;

        draw(currentPosition);
    }

    // Move puyos right, unless at the edge or there is a blockage
    window.sharedMoveRight = function moveRight() {
        if (!isMovementResumed || (isHardDrop && !isMoveDownEnabled)) return;
        undraw(currentPosition, current);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge)
            currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition -= 1;

        draw(currentPosition);
    }

    // Shows up-next puyos in mini grids
    window.displaySquares = document.querySelectorAll('.mini-grid div');
    window.displayIndex = 0;
    window.nextDisplaySquares = document.querySelectorAll('.next-mini-grid div');
    window.nextDisplayIndex = 0;

    // Displays the puyos in the mini-grid display
    window.displayShape = function displayShape() {
        if (isGameOver) return;
        displaySquares.forEach(square => {
            // Remove font and puyos from the up next display
            removeFont(displayIndex, 0, displaySquares);
            removeFont(displayIndex, 1, displaySquares);
            square.classList.remove('puyoBlob');
            square.style.backgroundColor = '';
        });

        nextDisplaySquares.forEach(square => {
            // Remove font and puyos from the up next display
            removeFont(nextDisplayIndex, 0, nextDisplaySquares);
            removeFont(nextDisplayIndex, 1, nextDisplaySquares);
            square.classList.remove('puyoBlob');
            square.style.backgroundColor = '';
        });

            // Add puyos and font to the up next display
            if (!showImageClicked) {
                displaySquares[displayIndex].classList.add('puyoBlob');
                displaySquares[displayIndex].style.backgroundColor = colors[nextRandom];
                displaySquares[displayIndex + 1].classList.add('puyoBlob');
                displaySquares[displayIndex + 1].style.backgroundColor = colors[nextRandomSecondary];

            } else {
                displaySquares[displayIndex].classList.add('puyoBlob');
                displaySquares[displayIndex].style.backgroundColor = colors[nextRandom];
                displaySquares[displayIndex + 1].classList.add('puyoBlob');
                displaySquares[displayIndex + 1].style.backgroundColor = colors[nextRandomSecondary];
            }
            // Add font for both puyos
            addFont(displayIndex, 0, displaySquares);
            addFont(displayIndex, 1, displaySquares);

            if (!showImageClicked) {
                nextDisplaySquares[nextDisplayIndex].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex].style.backgroundColor = colors[thirdRandom];
                nextDisplaySquares[nextDisplayIndex + 1].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex + 1].style.backgroundColor = colors[thirdRandomSecondary];
            } else {
                nextDisplaySquares[nextDisplayIndex].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex].style.backgroundColor = colors[thirdRandom];
                nextDisplaySquares[nextDisplayIndex + 1].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex + 1].style.backgroundColor = colors[thirdRandomSecondary];
            }
            // Add font for both puyos
            addFont(nextDisplayIndex, 0, nextDisplaySquares);
            addFont(nextDisplayIndex, 1, nextDisplaySquares);
    }

    // Adds functionality to the pause button
    startBtn.addEventListener('click', () => {
        if (!isGameOver) {
            startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
            upNext.innerHTML ='UpNext';
            startBtnPause();
            event.target.blur();
        } else {
            reset();
        }
    });

    const activeEscKey = new Set();

    let isEscapeEnabled = false;
    // Adds pause/play functionality to the escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && isEscapeEnabled && !activeEscKey.has(e.key)) {
            if (!isGameOver) {     
                activeEscKey.add(e.key);
                startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
                startBtnPause(); // Toggle pause/unpause when the escape key is pressed
            } else {
                reset();
            }
        }
    });

    // Makes sure the escape key can't be held down
    document.addEventListener('keyup', (e) => {
        if (activeEscKey.has(e.key)) {
            activeEscKey.delete(e.key);
        }
    });

    // Resumes gameplay after chaining has finished
    function resumeCurrent() {
        if (isGameReset) return;
        isInputEnabled = false;
        clearInterval(timerId);
        createNewPuyo();
        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
        timerId = setInterval(() => {
            if (isGameOver) return;
            sharedMoveDownCurrent();
        }, fallSpeed);
        displayShape();
        if (isGameOver) return;
        isInputEnabled = true
        startBtn.disabled = false;
    }

    // Starts, pauses, and unpauses the game
    function startBtnPause() {
        if (timerId) { // If game is paused
            pauseGame();
        } else if (isClickedOnce) { // If game is resumed
            resumeGame();
        } else { // If game has not been started yet
            startGame();
            closeNavbar();
        }
    }

    // Helper which handles all functions related to starting the game
    function startGame() {
        startTimerId = setTimeout(() => {
            if (isGameReset) return;
            createNewPuyo();
            displayShape();
            timerId = setInterval(() => { // Set fall timer when unpaused
                sharedMoveDownCurrent()
            }, fallSpeed);
            isInputEnabled = true;
            startSpeedUpTimer();
            pauseOverlay.style.opacity = "0%"
            resetBtn.style.zIndex = "-2";
            miniGridOverlay.forEach(overlay => overlay.style.opacity = "0%")
            playStartSound(0);
            isInputEnabled = true;
            resetNumAnimation();
            pauseOverlayText.innerHTML = "Paused"
            pauseOverlayText.style.fontSize = "3.5vh"
            pauseOverlayText.style.marginBottom = "5vh";
            areClearsReset = true;
            arePuyosCleared = true;
            resumeTimerChange = false;
            isMovementResumed = true;
            isEscapeEnabled = true; // Enables pausing with the escape key
        }, scaleAnimationTimer * 3)

        custom.disabled = true; // Disables customization menu when game starts
        movementStart = true;
        isGameReset = false;
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fa-solid fa-square"></i>' + ' Disabled'
        chainDisplay.style.opacity = "70%";
        chainText.style.opacity = "100%";
        chainDisplayTextContainer.style.opacity = "100%";
        startNumbers();

        scoreDisplay.innerHTML = score;

        scoreContainer.style.visibility = "visible";
        isInputEnabled = false;
        pauseOverlay.style.opacity = "50%";
        miniGridOverlay.forEach(overlay => overlay.style.opacity = "50%")

        // Ensures up next puyos are randomized at start
        nextRandom = Math.floor(Math.random() * amountOfColors);
        nextRandomSecondary = Math.floor(Math.random() * amountOfColors);
        thirdRandom = Math.floor(Math.random() * amountOfColors);
        thirdRandomSecondary = Math.floor(Math.random() * amountOfColors);

        displayShape();
        isClickedOnce = true;
    }

    // Sound for pausing the game
    const pauseSound = new Audio('game-sounds/arcade-ui-5.mp3');
    pauseSound.volume = 0.5;

    function pauseGame() {
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i>' + '  Play';
        pauseSpeedUpTimer();
        clearInterval(timerId);
        timerId = null;
        isInputEnabled = false;
        pauseOverlay.style.opacity = "50%";
        resetBtn.style.zIndex = "6";
        resetBtn.style.opacity = "80%"
        miniGridOverlay.forEach(overlay => overlay.style.opacity = "50%")

        // Hides the grid
        if (isHidingGridEnabled)
            secondaryGrid.style.zIndex = "4";

        playInterruptableSound(pauseSound)
    }

    // Sound for resuming the game
    const resumeSound = new Audio('game-sounds/arcade-ui-14.mp3');
    resumeSound.volume = 0.5;

    // Helper which houses all logic for a paused game
    function resumeGame() {
        startBtn.disabled = false;  
        draw(currentPosition);
        timerId = setInterval(() => { // Set fall timer when unpaused
            sharedMoveDownCurrent()
        }, fallSpeed);
        isInputEnabled = true;
        startSpeedUpTimer();
        pauseOverlay.style.opacity = "0%"
        resetBtn.style.zIndex = "-2";
        resetBtn.style.opacity = "0%";
        miniGridOverlay.forEach(overlay => overlay.style.opacity = "0%")
        isMovementResumed = true;

        playInterruptableSound(resumeSound);
    }

    // Speeds the game up
    function speedUp() {
        if (isGameOver) return;
        if (hasSpedUp && !isAtMaxSpeed) {
            fallSpeed -= originalFallSpeed * 0.15;
            if (fallSpeed < 100) {
                fallSpeed = 100;
                isAtMaxSpeed = true;
            }
            hasSpedUp = false;
            speedDisplay.innerHTML = "Speed up!"
            speedSound.play();
            moveDownInterval = fallSpeed * 0.06;
            setTimeout(() => {
                if (isGameOver) return;
                speedDisplay.innerHTML = ""
            }, 3000)
        }
        gameOverDisplay.innerHTML = "";
        isAllClear = false;
        setTimeout (() => {
            if (!isGameOver) return;
            speedSound.pause();
            speedDisplay.innerHTML = "";
        }, 20)
    }

    // Helper to start and resume the speed up timer
    function startSpeedUpTimer() {
        if (isGameOver) return;
        if (!isSpeedUpEnabled) return;
        startTime = Date.now(); // Records when the timer started

        // Speeds the game up every remaining time interval
        speedInterval = setTimeout(() => {
            remainingTime = timeToSpeedUp; // Reset the timer
            hasSpedUp = true;
            startSpeedUpTimer(); // Restarts the interval
        }, remainingTime);
        isPaused = false;
    }

    // Helper to pause the speed up timer
    function pauseSpeedUpTimer() {
        if (!isSpeedUpEnabled) return;
        if (!isPaused) {
            clearTimeout(speedInterval);
            const elapsedTime = Date.now() - startTime;
            remainingTime -= elapsedTime;
            isPaused = true;
        }
    }

    // A global variable to track connected puyos on each turn
    window.globalConnectedPuyos = new Set();

    // Main function to check the color of adjacent puyos
    function checkAdjacentColor(puyoIndex) {
        if (isGameOver || isGameReset) return;

        let localConnected = new Set(); // Collects connected puyos for this call

        // If in bounds, continue
        if (puyoIndex >= 0 && puyoIndex < squares.length - width) {
            // Sets color to be compared
            let color = window.getComputedStyle(squares[puyoIndex]).backgroundColor;
            let connected = (getConnectedPuyos(puyoIndex, color, new Set()));
            // If the puyos to pop value or more connected puyos are found, add them to both sets
            if (connected.length >= puyosToPop) {
                resumeTimerChange = true;
                areClearsReset = true
                connected.forEach(ind => {
                    globalConnectedPuyos.add(ind);
                    localConnected.add(ind);
                    const indexColor = window.getComputedStyle(squares[ind]).backgroundColor;

                    // Assures the same color does not get counted multiple times
                    if (!colorVisited.has(indexColor)) {
                        colorVisited.add(indexColor);
                    }
                });
            } 
        }
    }

    // Tracks if a color has already been visited in the connected index
    window.colorVisited = new Set();

    // Helper for checkAdjacentColor to recursively find all connected Puyos of the same color
    function getConnectedPuyos(index, color, visited = new Set()) {
        if (isGameReset) return;
        // Base case: Makes sure puyos don't get counted more than once
        if (visited.has(index)) return [];

        let connectedPuyos = []; // Array of same colored puyos that are adjacent to each other
        connectedPuyos.push(index); 

        const directions = [
            -width, // Up
            width, // Down
            -1, // Left
            1 // Right
        ];

        // Color comparison loop
        directions.slice().forEach(direction => {
            let neighborIndex = index + direction; // Index of neighboring puyos
            visited.add(index);

            // Makes sure both current color and neighboring colors are in the same color format and valid elements
            let neighborColor = 'rgb(128, 128, 128)';
            if (!(squares[neighborIndex] instanceof Element)) {
                return;
            }
            
            const computedStyle = window.getComputedStyle(squares[neighborIndex]);
            if (computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                neighborColor = computedStyle.backgroundColor;
            }

            // Boundary checks
            if (neighborIndex < 0 || neighborIndex >= squares.length - width) return; // Grid boundary
            if ((direction === -1 && index % width === 0) && width != 1) return;  // Left boundary
            if ((direction === 1 && (index + 1) % width === 0) && width != 1) return;  // Right boundary

            // Compares colors
            if (neighborColor == color) {
                // Adds adjacent puyos to connected list
                connectedPuyos = connectedPuyos.concat(getConnectedPuyos(neighborIndex, color, visited));
            } else 
                return;
        }) 
        return connectedPuyos;
    }

    const popSound = 'game-sounds/coin-pickup.mp3';
    popSound.volume = 0.2;
    window.currentPopSound = null;
    let arePuyosCleared = false; // Checks whether the current connected puyos have been cleared
    window.connectedFontTimer = 200; // The time it takes for the font to be removed from connected puyos

    // Function to process all puyo pops after collecting global connections
    function processClears() {
        if (!areClearsReset || isGameOver || isGameReset) return;
        if (globalConnectedPuyos.size > 0) {
            startBtn.disabled = true;
            resetPopAnimation();
            arePuyosCleared = false; 
            totalElements = globalConnectedPuyos.size;
            globalConnectedPuyos.forEach(ind => {    
                startColor[ind] = parseRGB(squares[ind].style.backgroundColor);
            })
            setTimeout (() => {
                if (!areClearsReset || isFalling || isGameReset) return;
                startBtn.disabled = true;
                startBtn.innerHTML = '<i class="fa-solid fa-square"></i>' + ' Disabled'
                globalConnectedPuyos.forEach(ind => {  
                    removeFont(ind, 0, squares);
                });
                requestAnimationFrame(animatePop)
            }, connectedFontTimer);
        }
        setTimeout (() => {
            if (!areClearsReset || isGameOver || isGameReset) return;
            areClearsReset = false;

            // If there are puyos in the conneced list
            if (globalConnectedPuyos.size > 0) {
                // Clear the puyo
                globalConnectedPuyos.forEach(ind => {
                    removeFont(ind, 0, squares);
                    squares[ind].classList.remove('taken', 'puyoBlob');
                    squares[ind].style.backgroundColor = '';
                    squares[ind].style.border = '';
                    puyoCount++;
                });
                colorVisited.clear();

                // Group bonus calculation
                if (puyoCount > 10) {
                    groupBonus = 10;
                } else if (puyoCount > puyosToPop) {
                    if (groupBonus <= 1)
                        groupBonus= 2;
                    groupBonus++;
                }

                chainLength++;
                chainDisplay.style.opacity = "70%";

                animateChainIncrement();

                currentPopSound = popSound;
                startBtn.disabled = true;
                startBtn.innerHTML = '<i class="fa-solid fa-square"></i>' + ' Disabled';
                playVoiceLine();
                displayScore();
                hasFallen = false;
                falling(squares, fallingTimer); // Handles falling puyos
                globalConnectedPuyos.clear(); // Reset global connections and colors for the next turn
                setTimeout(() => {
                    if (areClearsReset || isGameOver || isGameReset) return;
                    isFallingTimeout();
                    resumeTimerChange = false;
                    allClear()
                }, 100)
                areClearsReset = true;
                arePuyosCleared = true;
                groupBonus = 0;
            }
        }, fallingAndColorTimer)
    }

    // Increasing amount of animation size based on chain length
    function animateChainIncrement() {
        if (chainLength >= 10) {
            chainDisplayText.innerHTML = chainLength + "!!!";
            resetNumAnimation();
            requestAnimationFrame((timestamp) => animateNumbers(chainDisplayText, 20.4, 14.2, timestamp));
        } else if (chainLength >= 7) {
            chainDisplayText.innerHTML = chainLength + "!!";
            resetNumAnimation();
            requestAnimationFrame((timestamp) => animateNumbers(chainDisplayText, 16.4, 10.2, timestamp));
        } else if (chainLength >= 4) {
            chainDisplayText.innerHTML = chainLength + "!";
            resetNumAnimation();
            requestAnimationFrame((timestamp) => animateNumbers(chainDisplayText, 12.4, 6.2, timestamp));
        } else {
            chainDisplayText.innerHTML = chainLength;
            resetNumAnimation();
            requestAnimationFrame((timestamp) => animateNumbers(chainDisplayText, 10.4, 4.2, timestamp));
        }
    }

    const allClearSound = new Audio('game-sounds/all-clear.mp3');
    allClearSound.volume = 0.4;
    window.currentAllClearVoice = null;

    // Logic for a clear board
    function allClear() {
        if (squares.every(square => !square.classList.contains('puyoBlob') || 
        square.classList.contains('currentPosition'))) {
            setTimeout(() => {
                // Adds margin if both speed up and all clear happen at the same time
                if (speedDisplay.innerHTML !== "") {
                    gameOverDisplay.style.marginRight = "2.2vh";
                } else {
                    gameOverDisplay.style.marginRight = "0vh";
                }

                if (!isJosh) {
                    setTimeout(() => playAllClearLine(), 100)
                }

                gameOverDisplay.innerHTML = 'All Clear!';
                gameOverDisplay.style.color = "#0d6efd"
                isAllClear = true;
                score += 5000;
                scoreDisplay.innerHTML = score
                
                playInterruptableSound(allClearSound);
            }, 400)
        }
    }

    // Plays the correct all clear line based on which character is selected
    function playAllClearLine() {
        playInterruptableSound(currentAllClearVoice);
        currentSpell.stop();
        currentSpell = null
    }

    let finalScoreAdd;
    // Calculates and displays score according to Puyo Puyo Tsu's scoring system
    function displayScore() {
        if (chainLength > 1) {

            // Exponential growth until chain is greater than 5
            if (chainLength <= 5) {
                chainPower = (2 ** (chainLength + 1));
            } else if (chainLength > 5) {
                chainPower += 32;
            }
        }
        if ((chainPower + colorBonus == 0) && (groupBonus == 0)) {
            groupBonus = 1;
        }
        colorBonus = colorVisited.size * 3;
        finalScoreAdd = ((10 * puyoCount) * (chainPower + colorBonus + groupBonus)); // Final score calculation
        score += finalScoreAdd;
        puyoCount = 0;
        scoreDisplay.innerHTML = score; // Displays the score
    }
    
    const gameOverSound = new Audio('game-sounds/error-10.mp3');
    gameOverSound.volume = 0.3;

    const resetPopSound = new Audio('game-sounds/Pop!.mp3'); // Sound effect when the restart button appears

    /* Game over if reached the top */
    function gameOver() {
        if (isGameReset) return;
        if (squares.some((square, index) => square.classList.contains('taken', 'puyoBlob') && (index == deathPoint))) {
            isMovementResumed = false;
            isGameOver = true;
            clearInterval(timerId);
            isInputEnabled = false;

            gameOverDisplay.innerHTML = 'game over';
            gameOverDisplay.style.color = "red";
            gameOverDisplay.style.fontStyle = "";
            gameOverSound.play();

            if (!isJosh)
                setTimeout(() => gameOverVoice.play(), 300);

            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>' + ' Reset';
            chainDisplayText.innerHTML = "";

            // Prompts players to restart page to play again
            if (isGameReset) return;
            setTimeout(() => {
                if (isGameReset) return;
                resetBtn.style.zIndex = "6";
                resetBtn.style.opacity = "100%";
                resetPopSound.play();
            }, 3000);
        }
    }

    // Collapses the customization navbar
    function closeNavbar() {
        let navbar = document.querySelector('#navbarNav');
        let bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });
        navDisabledText.style.visibility = "visible";
        bsCollapse.hide();
    }

    const resetSound = new Audio('game-sounds/arcade-ui-17.mp3');
    resetSound.volume = 0.35;

    // Reset success toaster
    const resetToast = new bootstrap.Toast(resetToastEl);

    // Resets the game while retaining current customization options
    window.reset = function reset() {
        isGameOver = false;
        isGameReset = true;
        clearInterval(timerId);
        clearInterval(startTimerId);
        clearTimeout(speedInterval);
        fallSpeed = originalFallSpeed;
        nextRandom = 0;
        nextRandomSecondary = 0;
        thirdRandom = 0;
        thirdRandomSecondary = 0;
        currentPosition = Math.ceil(width / 2 - 1);
        currentRotation = 0;
        current = puyo[currentRotation];
        score = 0;
        scoreDisplay.innerHTML = "0"
        startBtn.innerHTML = "Start"
        startBtn.disabled = false;
        isClickedOnce = false;
        timerId = null;
        isInputEnabled = false;
        custom.disabled = false;
        firstBelowGhost = 0;
        secondBelowGhost = 0;
        remainingTime = timeToSpeedUp;
        chainDisplay.style.opacity = "0%";
        pauseOverlay.style.opacity = "0%"
        resetBtn.style.zIndex = "-2";
        miniGridOverlay.forEach(overlay => overlay.style.opacity = "0%")
        scoreContainer.style.visibility = "hidden";
        upNext.innerHTML ='';
        resetToast.show();
        gameOverDisplay.innerHTML = "";
        resetBtn.style.opacity = "0%"
        resetSound.play();
        pauseOverlayText.innerHTML = "";
        resetNumAnimation();
        colorVisited.clear();
        globalConnectedPuyos.clear();
        resetPopAnimation();
        chainText.style.opacity = "0%";
        chainDisplayTextContainer.style.opacity = "0%";
        chainDisplayText.innerHTML = "";
        movementStart = false;
        isMovementResumed = false;
        pauseOverlay.style.marginBottom = "0vh";
        navDisabledText.style.visibility = "hidden";
        pauseOverlayText.style.marginBottom = "0vh";
        speedDisplay.innerHTML = "";

        if (isHidingGridEnabled)
            secondaryGrid.style.zIndex = "0";
        squares.forEach((square, index) => {
            undraw(index, squares);
            square.classList.remove('currentPosition')
        });
        miniSquares.forEach((square, index) => {
            undraw(index, miniSquares);
        });
        nextMiniSquares.forEach((square, index) => {
            undraw(index, nextMiniSquares);
        });
    }
})