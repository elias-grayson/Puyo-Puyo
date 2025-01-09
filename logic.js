/* This document accounts for all of the game logic */
document.addEventListener('DOMContentLoaded', () => {

    // DOM elements
    const gameOverDisplay = document.querySelector('#gameOverText') // Game over text
    const scoreContainer = document.querySelector('#scoreDisplay'); // Displays score
    const scoreDisplay = document.querySelector('#score'); // Displays score
    window.chainDisplay = document.querySelector('#chainLength'); // Displays chain length
    window.upNext = document.querySelector('#upNext'); // Displays the up next text
    window.startBtn = document.querySelector('#start-button') // Start and pause button
    const endDisplay = document.querySelector('#endDisplay'); // Displays the end state
    window.dropdownBtn = document.querySelector('.dropdown'); // All dropdown menus
    window.aestheticCustom = document.querySelector('#aesthetic-custom'); // Customize aesthetics button
    window.squares = Array.from(document.querySelectorAll('.grid div')); // Array of all grid spaces
    window.ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div')); // Array of all ghost grid spaces
    window.custom = document.querySelector('#custom'); // Customization button
    const speedDisplay = document.querySelector('#speedDisplay'); // Speed up text
    window.pauseOverlay = document.querySelector('.grid-pause-overlay');
    window.miniGridOverlay = document.querySelectorAll('.mini-grid-overlay');

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
    let groupBonus = 1; // Group bonus depending on how many of the same color puyo were cleared
    let timeoutId; // Id for how long multiplier's increment
    let isFalling = false // Tracks if puyos are currently falling
    let isMovementResumed = true // Tracks if current position movement can occur
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
    const fallingAndColorTimer = 800; // How long it takes for puyos to clear
    const resumeTimer = 150; // How long it takes for puyos to land
    let resumeTimerChange = false // Tracks if the landing timer has been resumed
    let isReset = true // Tracks if process clears has been called already
    let isAtMaxSpeed = false; // Tracks whether the game is at the maximum speed
    let movementStart = false; // Tracks if 
    window.isHidingGridEnabled = false; // Tracks if gameplay will be obscured when pausing
    let isAllClear = false;
    let isGhost = false

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

    // Identical rotations for the ghost puyo
    window.ghostPuyo = [
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
    window.currentGhostPosition = currentPosition;
    window.currentRotation = 0;
    window.current = puyo[currentRotation];
    window.currentGhost = ghostPuyo[currentRotation];

    // Adds font to the puyos
    function addFont(puyos, puyoPosition, array) {
        const computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;

            // If the computed color matches one in the map, add font
            if (colorClassMap[computedColor]) {
                array[puyos + puyoPosition].removeAttribute('id');
                array[puyos + puyoPosition].classList.add(colorClassMap[computedColor]);
            }
    }

    // Removes font from puyos
    function removeFont(puyos, puyoPosition, array) {
        let computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;
    
        // If the computed color matches one in the map, remove font
        if (colorClassMap[computedColor]) {
            array[puyos + puyoPosition].classList.remove(colorClassMap[computedColor]);
        }
    }

    // Draws puyos
    function draw(puyos) {
        if (isGameOver) return;
            current.forEach(index => {

            // Sets the background color and adds the puyoBlob class
            squares[puyos + index].classList.add('puyoBlob');
            squares[puyos + index].classList.add('currentPosition');
            squares[puyos + index].style.backgroundColor = colors[random];
            addFont(puyos, current[1], squares);
        });
    
        // Adds secondary color
        if (puyos === currentPosition) {
            squares[puyos + current[0]].style.backgroundColor = colors[randomSecondary];
            current.forEach(index => {
                const secondaryColorClass = colorClassMap[colors[randomSecondary]];
                if (secondaryColorClass) {
                    squares[puyos + index].classList.add(secondaryColorClass);
                }
                addFont(puyos, current[0], squares);
                squares[puyos + index].classList.add('currentPosition');
            });
        }
        freeze(current, currentPosition);
    }

    // Undraws puyos
    function undraw(puyos) {
        current.forEach(index => {
            removeFont(puyos, index, squares);
            squares[puyos + index].classList.remove('puyoBlob')
            squares[puyos + index].classList.remove('currentPosition')
            squares[puyos + index].classList.remove('taken')
            squares[puyos + index].style.backgroundColor = '';
        })
        undrawGhost()
    }

    // Undraws ghost puyos
    function undrawGhost() {
        if (!isMovementResumed) return;
        ghostSquares.forEach(index => {
            index.style.backgroundColor = '';
            index.style.outline = 'none';
            index.classList.remove('ghostPuyo');
        })
    }

    // Move down function
    window.sharedMoveDownCurrent = function moveDownCurrent() {
        if (!isMovementResumed) return;
        multiplierTimeout();
        undraw(currentPosition); // Remove puyos from the current position
        currentPosition += width;
        score += 1;
        scoreDisplay.innerHTML = score;
        draw(currentPosition);
    }

    // Move down function for already placed puyos
    async function moveDownPlaced(index, initialColor, fallingTimer) {

        // Move the Puyo down one row
        const belowIndex = index + width;
        return new Promise(resolve => {
            setTimeout(() => {
                isFallingTimeout();

                // Remove the 'puyoBlob' class and font
                removeFont(index, 0, squares);
                squares[index].classList.remove('puyoBlob');
                squares[index].classList.remove('taken');
                squares[index].style.backgroundColor = '';

                // Preserves the color
                squares[belowIndex].style.backgroundColor = initialColor;
                addFont(belowIndex, 0, squares);

                // Reset the original position (after moving down)
                squares[index].classList.remove('taken');
                squares[index].classList.add('puyoBlob');
                squares[belowIndex].classList.remove('taken');
                squares[belowIndex].classList.remove('puyoBlob');
                squares[belowIndex].classList.add('taken');
                squares[belowIndex].classList.add('puyoBlob');
                squares[index].classList.remove('puyoBlob');
                squares[index].classList.remove('taken');
                squares[index].style.backgroundColor = '';
                removeFont(index, 0, squares);
                resolve(); // Resolves the promise once the move is completed
            }, fallingTimer); // Delay for each puyo move
        });
    }

    window.firstBelowGhost = 0;
    window.secondBelowGhost = 0;
    // Move down function for already placed puyos
    async function moveDownGhost() {
        const halfWidth = Math.ceil(width / 2);

        // Current Horizontal positions of the inner and outer puyos
        let firstCurrentHorPosition = (currentPosition + current[0]) % width;
        let secondCurrentHorPosition = (currentPosition + current[1]) % width;

        let firstGhostIndex = ghostSquares[firstCurrentHorPosition];
        let secondGhostIndex = ghostSquares[secondCurrentHorPosition];

        window.firstBelowGhost = 0;
        window.secondBelowGhost = 0;

        // Iterate through the grid until reached a spot that's taken
        while (!squares[firstBelowGhost + firstCurrentHorPosition + width].classList.contains('taken')) {
            firstBelowGhost += width;
        }

        while (!squares[secondBelowGhost + secondCurrentHorPosition + width].classList.contains('taken')) {
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
        
        firstGhostIndex .classList.add('ghostPuyo');
        firstGhostIndex.style.backgroundColor = squares[currentPosition + current[0]].style.backgroundColor;
        secondGhostIndex.classList.add('ghostPuyo');
        firstGhostIndex.style.transform = 'scale(0.35)';
        firstGhostIndex.style.outline = "0.5vh solid black"
        secondGhostIndex.style.backgroundColor = squares[currentPosition + current[1]].style.backgroundColor;
        secondGhostIndex.style.transform = 'scale(0.35)';
        secondGhostIndex.style.outline = "0.5vh solid black"
    }
    
    const hardDropSound = new Audio('game-sounds/thump.mp3');
    let currentHardDropSound = null;

    // Allows the puyos to be snapped to the bottom instantly
    window.sharedHardDrop = function hardDrop() {
        if (!isMovementResumed) return;

        if (currentHardDropSound) {
            currentHardDropSound.pause();
            currentHardDropSound.currentTime = 0;
        }
        currentHardDropSound = hardDropSound;
        currentHardDropSound.play();
        
        undraw(currentPosition); // Remove puyos from the current position
        while (!squares[currentPosition + width].classList.contains('taken')) {
            sharedMoveDownCurrent();
        }
    }

    const rotateSound = new Audio('game-sounds/slide.mp3');
    rotateSound.volume = 1.0;
    let currentRotateSound = null;

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

        // Interrupt previous rotation sound, if any, and play new one
        if (currentRotateSound) {
            currentRotateSound.pause();
            currentRotateSound.currentTime = 0;
        }
        currentRotateSound = rotateSound;
        currentRotateSound.play();

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

            // Accounts for if in between puyos and edges
            current.some(index => {
                if ((squares[currentPosition + index].classList.contains('taken'))) {
                    currentRotation++;
                    currentPosition++;
                    isRotationFinished = true;
                }
                if (((currentPosition + index) % width === width - 1) && !isRotationFinished) {
                    currentRotation++;
                    currentPosition++;
                }
                
            });
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

        // Interrupt previous rotation sound, if any, and play new one
        if (currentRotateSound) {
            currentRotateSound.pause();
            currentRotateSound.currentTime = 0;
        }
        currentRotateSound = rotateSound;
        currentRotateSound.play();

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

            // Accounts for if in between puyos and edges
            current.some(index => {
                if (squares[currentPosition + index].classList.contains('taken')) {
                    currentRotation--;
                    currentPosition--;
                    isRotationFinished = true;
                }
                if (((currentPosition + index) % width === 0) && !isRotationFinished) {
                    currentRotation--;
                    currentPosition--;
                }
            });
        }
    }

    // Rotate the puyos to the right
    window.sharedRotateRight = function rotateRight() {
        if (!isMovementResumed) return;
        undraw(currentPosition);
        checkRotationRight(currentPosition);
        current = puyo[currentRotation];
        draw(currentPosition);
    }

    // Rotate the puyos to the left
    window.sharedRotateLeft = function rotateLeft() {
        if (!isMovementResumed) return;
        undraw(currentPosition);
        checkRotationLeft();
        current = puyo[currentRotation];
        draw(currentPosition);
    }

    const speedSound = new Audio('game-sounds/cute-level-up-2.mp3');

    // Freeze function 
    function freeze(puyos, puyoPosition) {
        if (current.some(index => {
            const nextIndex = puyoPosition + index + width;
            return nextIndex >= squares.length - width || squares[nextIndex].classList.contains('taken');
        })) {
            if (puyos == current) {
                isMovementResumed = false;
                isReset = false;
                isGhost = false;
                current.forEach(index => squares[currentPosition + index].classList.add('taken'));
                current.forEach(index => squares[currentPosition + index].classList.remove('currentPosition'));
                current.forEach(index => squares[currentPosition + index].classList.remove('ghostPuyo'));
                falling(squares, 50);
                multiplierTimeout();
                scoreDisplay.innerHTML = score;
                squares.slice().forEach(index => {
                    if (index.classList.contains('aboveGrid') && index.classList.contains('taken'))
                        index.classList.remove('taken');
                })
            }
        } else if (isGhostEnabled) {
            isGhost = true;
            falling(ghostSquares, 0), 100
        }
    }

    // Creates new puyos to fall
    function createNewPuyo() {
        current.forEach(index=> squares[currentPosition + index].classList.remove('currentPosition'));
        speedUp();
        undrawGhost();

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
        setTimeout(() => {
            if (!isMovementResumed) return;
            chainDisplay.innerHTML = "";
        }, 2200);
    }

    // Resets multiplier variables to default when the chain ends
    function multiplierTimeout() {
        chainLength = 0;
        puyoCount = 0;
        chainPower = 0;
        groupBonus = 1;
    }
    
    // Allows puyos to fall 
    async function falling(array, fallingTimer) {
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

                visited.add(index); // Marks as visited to avoid multiple moves on the same Puyo
                
                let movePromise;

                // Moves the Puyo down and add the promise for this move
                if (!isGhost) {
                    movePromise = moveDownPlaced(index, array[index].style.backgroundColor, fallingTimer);
                } else if (index % width == 0) {
                    moveDownGhost()
                }
                promises.push(movePromise);  // Store the promise in an array
                movedPuyos = true;
                isFalling = true;
            }
        });

        // Wait for all moves to finish before continuing
        if (movedPuyos && !isGhost) {
            await Promise.all(promises); // Wait for all puyos to stop falling
            falling(array, fallingTimer); // Recursively call falling to check if any new Puyos need to fall
        } else {
            if (isGhost) return;
            // After all Puyos have settled, check for adjacent Puyos to clear
            squares.forEach((square, index) => {
                if (square.classList.contains('puyoBlob')) {
                    processClears();
                        checkAdjacentColor(index);
                }
            });
            if (isGhost) return;
            processClears();
        }
        if (isGhost) return;
        isFalling = false;
    }

    // Draws more puyos if falling and chaining has stopped
    function isFallingTimeout() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (isFalling) return;
            if (resumeTimerChange) return;
            resumeCurrent();
            gameOver();
            isMovementResumed = true
        }, resumeTimer)
    }

    // Move puyos left, unless at the edge or there is a blockage
    window.sharedMoveLeft = function moveLeft() {
        if (!isMovementResumed) return;
        undraw(currentPosition);
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge)
            currentPosition--;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition++;

        draw(currentPosition);
    }

    // Move puyos right, unless at the edge or there is a blockage
    window.sharedMoveRight = function moveRight() {
        if (!isMovementResumed) return;
        undraw(currentPosition);
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
        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
        upNext.innerHTML ='UpNext';
        startBtnPause();
        event.target.blur();
    });

    let isEscapeEnabled = false;
    // Adds pause/play functionality to the escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && isEscapeEnabled) {
            startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
            startBtnPause(); // Toggle pause/unpause when the escape key is pressed
        }
    });

    // Resumes gameplay after chaining has finished
    function resumeCurrent() {
        isInputEnabled = false;
        clearInterval(timerId);
        createNewPuyo();
        timerId = setInterval(() => {
            sharedMoveDownCurrent();
        }, fallSpeed);
        displayShape();
        isInputEnabled = true
    }

    // Sounds for starting, pausing, and resuming the game
    const startSound = new Audio('game-sounds/new-notification-7.mp3');
    startSound.volume = 0.5;
    const pauseSound = new Audio('game-sounds/arcade-ui-5.mp3');
    pauseSound.volume = 0.5;
    let currentPauseSound = null;
    const resumeSound = new Audio('game-sounds/arcade-ui-14.mp3');
    resumeSound.volume = 0.5;
    let currentResumeSound = null;

    // Starts, pauses, and unpauses the game
    function startBtnPause() {
        if (!isMovementResumed || isGameOver) {
            startBtn.disabled = true;
            return;
        }
        custom.disabled = true; // Disables customization menu when game starts

        isEscapeEnabled = true; // Enables pausing with the escape key

        // When game is paused
        if (timerId) {
            startBtn.innerHTML = '<i class="fa-solid fa-play"></i>' + '  Play';
            pauseSpeedUpTimer();
            clearInterval(timerId);
            timerId = null;
            isInputEnabled = false;
            pauseOverlay.style.opacity = "50%";
            miniGridOverlay.forEach(overlay => overlay.style.opacity = "50%")

            // Hides the grid
            if (isHidingGridEnabled)
                secondaryGrid.style.zIndex = "4";

            // Interrupt the pause sound if currently playing
            if (currentPauseSound) {
                currentPauseSound.pause()
                currentPauseSound.currentTime = 0;
                currentPauseSound.play();
            } else { // Play pause sound
                currentPauseSound = pauseSound;
                currentPauseSound.play();
            }
        } else { 
            startBtn.disabled = false;
            draw(currentPosition);
            timerId = setInterval(() => { // Set fall timer when unpaused
                sharedMoveDownCurrent()
            }, fallSpeed);
            isInputEnabled = true;
            startSpeedUpTimer();
            pauseOverlay.style.opacity = "0%"
            miniGridOverlay.forEach(overlay => overlay.style.opacity = "0%")

            // Shows the grid
            if (isHidingGridEnabled)
                secondaryGrid.style.zIndex = "0";

            if (isClickedOnce) {
                // Interrupt the resume sound if currently playing
                if (currentResumeSound) {
                    currentResumeSound.pause()
                    currentResumeSound.currentTime = 0;
                    currentResumeSound.play();
                } else { // Play resume sound
                    currentResumeSound = resumeSound;
                    currentResumeSound.play();
                }
                return;
            }
            movementStart = true;
            startSound.play();

            scoreContainer.style.visibility = "visible";

            // Ensures up next puyos are randomized at start
            nextRandom = Math.floor(Math.random() * amountOfColors);
            nextRandomSecondary = Math.floor(Math.random() * amountOfColors);
            thirdRandom = Math.floor(Math.random() * amountOfColors);
            thirdRandomSecondary = Math.floor(Math.random() * amountOfColors);

            displayShape();
            isClickedOnce = true;
        }
    }

    // Speeds the game up
    function speedUp() {
        if (hasSpedUp && !isAtMaxSpeed) {
            fallSpeed -= originalFallSpeed * 0.2;
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
        endDisplay.innerHTML = "";
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
    let globalConnectedPuyos = new Set();

    // Main function to check the color of adjacent puyos
    function checkAdjacentColor(puyoIndex) {
        if (isGameOver) return;

        let localConnected = new Set(); // Collects connected puyos for this call

        // If in bounds, continue
        if (puyoIndex >= 0 && puyoIndex < squares.length - width) {
            // Sets color to be compared
            let color = window.getComputedStyle(squares[puyoIndex]).backgroundColor;
            let connected = (getConnectedPuyos(puyoIndex, color, new Set()));
            // If the puyos to pop value or more connected puyos are found, add them to both sets
            if (connected.length >= puyosToPop) {
                resumeTimerChange = true;
                isReset = true
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
    let colorVisited = new Set();

    // Helper for checkAdjacentColor to recursively find all connected Puyos of the same color
    function getConnectedPuyos(index, color, visited = new Set()) {
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

    // Function to process all puyo pops after collecting global connections
    function processClears() {
        if (!isReset || isGameOver) return;
        if (globalConnectedPuyos.size > 0) {
            resetPopAnimation();
            arePuyosCleared = false; 
            totalElements = globalConnectedPuyos.size;
            globalConnectedPuyos.forEach(ind => {    
                startColor[ind] = parseRGB(squares[ind].style.backgroundColor);
            })
            setTimeout (() => {
                if (!isReset) return;
                if (isFalling) return
                globalConnectedPuyos.forEach(ind => {  
                    removeFont(ind, 0, squares);
                })
                requestAnimationFrame(animatePop)
            }, 200);
        }
        setTimeout (() => {
            if (!isReset || isGameOver) return;
            isReset = false;

            // If there are puyos in the conneced list
            if (globalConnectedPuyos.size > 0) {
                // Clear the puyo
                globalConnectedPuyos.forEach(ind => {
                    removeFont(ind, 0, squares);
                    squares[ind].classList.remove('taken');
                    squares[ind].classList.remove('puyoBlob');
                    squares[ind].style.backgroundColor = '';
                    squares[ind].style.border = '';
                    puyoCount++;
                });
                colorVisited.clear();

                // Group bonus calculation
                if (puyoCount > puyosToPop + 6) {
                    groupBonus = 10;
                } else if (puyoCount > puyosToPop) {
                    groupBonus++;
                }

                chainLength++; // Increments chain length
                chainDisplay.innerHTML = chainLength + " chain!"; // Displays chain length
                currentPopSound = popSound;
                playVoiceLine();
                displayScore();
                groupBonus = 1;
                falling(squares, 50); // Handles falling puyos
                globalConnectedPuyos.clear(); // Reset global connections and colors for the next turn
                setTimeout(() => {
                    if (isReset || isGameOver) return;
                    isFallingTimeout();
                    resumeTimerChange = false;
                    allClear()
                }, 100)
                isReset = true;
                arePuyosCleared = true;
            }
        }, fallingAndColorTimer)
    }

    // Helper function to parse colors into [r, g, b] format
    function parseRGB(color) {

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

    let startColor = {}; // Initialize the connected puyos starting color
    let animationStartTime = null; // Determines when the clearing animation starts
    const animationDuration = 600; // How long the popping animation lasts

    // Fades puyos to white before being popped
    async function animatePop(timestamp) {
        if (!animationStartTime) animationStartTime = timestamp;
        const elapsedTime = timestamp - animationStartTime;
        const progress = Math.min(elapsedTime / animationDuration, 1); // Animation progress

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
    function resetPopAnimation() {
        animationStartTime = null;
        startColor = {};  // Reset the starting color for the next animation
        elementsAnimated = 0; // Reset the counter
        arePuyosCleared = false;
    }

    const allClearSound = new Audio('game-sounds/all-clear.mp3');
    allClearSound.volume = 0.5;
    currentAllClearSound = null;
    window.allClearVoice = new Audio('british-micah-spells/all-clear.mp3');
    window.currentAllClearVoice = null;
    allClearVoice.volume = 0.7;

    // Logic for a clear board
    function allClear() {
        if (squares.every(square => !square.classList.contains('puyoBlob') || 
        square.classList.contains('currentPosition'))) {
            setTimeout(() => {
                // Adds margin if both speed up and all clear happen at the same time
                if (speedDisplay.innerHTML !== "") {
                    endDisplay.style.marginRight = "2.2vh";
                } else {
                    endDisplay.style.marginRight = "0vh";
                }

                // If British Micah's voice is active, play matching all clear line
                if (isBritMicah) {
                    currentAllClearVoice = new Audio('british-micah-spells/all-clear.mp3');
                    currentAllClearVoice.play();
                    currentSpell.stop();
                    currentSpell = null
                }

                // If Southern Micah's voice is active, play matching all clear line
                if (isSouthMicah) {
                    currentAllClearVoice = new Audio('southern-micah-spells/all-clear.mp3');
                    currentAllClearVoice.play();
                    currentSpell.stop();
                    currentSpell = null
                }

                endDisplay.innerHTML = 'All Clear!';
                endDisplay.style.color = "#0d6efd"
                isAllClear = true;
                score += 5000;
                scoreDisplay.innerHTML = score
                if (currentAllClearVoice) {
                    currentAllClearVoice.pause();
                    currentAllClearVoice.currentTime = 0;
                    currentAllClearVoice.play();
                }

                if (currentAllClearSound) {
                    currentAllClearSound.pause();
                    currentAllClearSound.currentTime = 0;
                    currentAllClearSound.play();
                } else {
                    currentAllClearSound = allClearSound;
                    currentAllClearSound.play();
                }
            }, 400)
        }
    }

    // Calculates and displays score according to Puyo Puyo Tsu's scoring system
    function displayScore() {
        if (chainLength > 1) {

            // Exponential growth until chain is greater than 5
            if (chainLength <= 5) {
                chainPower = (2 ** (chainLength));
            } else if (chainLength > 5) {
                chainPower += 32;
            }
        }
        colorBonus = colorVisited.size * 3;
        finalScoreAdd = ((10 * puyoCount) * (chainPower + colorBonus + groupBonus)); // Final score calculation
        score += finalScoreAdd;
        scoreDisplay.innerHTML = score; // Displays the score
    }
    
    const gameOverSound = new Audio('game-sounds/error-10.mp3');
    gameOverSound.volume = 0.3;

    /* Game over if reached the top */
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            isMovementResumed = false;
            isGameOver = true;
            isPaused = true;
            clearInterval(timerId);
            isInputEnabled = false
            endDisplay.innerHTML = 'game over';
            endDisplay.style.color = "red";
            endDisplay.style.fontStyle = "";
            gameOverSound.play();

            // Prompts players to restart page to play again
            setTimeout(() => {
                gameOverDisplay.innerHTML = "To restart, refresh the page";
                gameOverDisplay.style.padding = '2.2vh';
                gameOverDisplay.style.border= "solid 0.5vh black";
                gameOverDisplay.style.borderRadius = '4.8vh';
            }, 3000);
        }
    }

    document.addEventListener('keydown', control); // Attaches the control function to the 'keydown' event
    document.addEventListener('keyup', releaseKey); // Attaches the releaseKey function to the 'keyup' event

    const activeHorizontalKeys = new Map(); // Map to track Horizontal keys
    const activeDownKeys = new Map(); // Map to track holdable keys currently held down
    const activeNonHoldKeys = new Set(); // Set to track non-holdable keys currently held down
    const moveInterval = 50; // How long before horizontal movement is repeated
    window.moveDownInterval = fallSpeed * 0.06; // How long before downward movement is repeated
    window.horizontalHoldInterval = 100; // How long it takes for the horizontal movement to start repeating
    let isHorKeyReleased = true; // Tracks whether horizontal movement keys have been released

    // Assigns functions to keyCodes
    function control(e) {
        if (!movementStart) return;
    
        // Handles downward key actions
        if (moveDownBindings[e.key]) {
            if (!activeDownKeys.has(e.key)) {
                if (!isInputEnabled) return;
                moveDownBindings[e.key]()

                // Start the movement if the key is not already active
                const intervalId = setInterval(() => {
                    if (!isInputEnabled) return;
                    moveDownBindings[e.key]()
                }, moveDownInterval);
                activeDownKeys.set(e.key, intervalId);
            }
        }

        // Handles horizontal key actions
        if (horizontalBindings[e.key]) {
            if (!activeHorizontalKeys.has(e.key)) {

                let horizontalIntervalId = null // Interval ID for horizontal movement

                // If movement is not being held, move once
                if (!horizontalIntervalId) {
                    if (!isInputEnabled) return;
                    horizontalBindings[e.key]();
                    activeHorizontalKeys.set(e.key);
                    isHorKeyReleased = false;
                }
                
                // Start the movement if the key is not already active
                setTimeout(() => {
                    if (isHorKeyReleased) return;
                    horizontalIntervalId = setInterval(() => {
                        if (!isInputEnabled || isHorKeyReleased) return;
                        horizontalBindings[e.key]()
                    }, moveInterval);
                    if (isHorKeyReleased) return;
                    activeHorizontalKeys.set(e.key, horizontalIntervalId);
                }, horizontalHoldInterval) // Starts the movement after held for set amount of time
            }
        }

        // Handles non-holdable key actions
        if (nonHoldBindings[e.key]) {
            if (!activeNonHoldKeys.has(e.key)) {
                if (!isInputEnabled) return;
                nonHoldBindings[e.key]()
                activeNonHoldKeys.add(e.key);
            }
        }
    }

    function releaseKey(e) {
        if (activeDownKeys.has(e.key)) {
            clearInterval(activeDownKeys.get(e.key)); // Stop the interval for the key
            activeDownKeys.delete(e.key);
        }
        if (activeHorizontalKeys.has(e.key)) {
            clearInterval(activeHorizontalKeys.get(e.key)); // Stop the interval for the key
            activeHorizontalKeys.delete(e.key);
            isHorKeyReleased = true;
        }
        if (activeNonHoldKeys.has(e.key)) {
            activeNonHoldKeys.delete(e.key);
        }
    }
    
    // Key bindings to move down
    window.moveDownBindings = {
        "s": sharedMoveDownCurrent,
        "S": sharedMoveDownCurrent,
        "ArrowDown": sharedMoveDownCurrent,
    };

    // Key bindings to move left/right
    window.horizontalBindings = {
        "ArrowRight": sharedMoveRight,
        "ArrowLeft": sharedMoveLeft,
    }

    // Key bindings that are not able to be held
    window.nonHoldBindings = {
        "a": sharedRotateLeft,
        "A": sharedRotateLeft,
        "z": sharedRotateLeft,
        "Z": sharedRotateLeft,
        "d": sharedRotateRight,
        "D": sharedRotateRight,
        "ArrowUp": sharedRotateRight,
        " ": sharedHardDrop,
    }
})