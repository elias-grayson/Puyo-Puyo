document.addEventListener('DOMContentLoaded', () => {

    // DOM elements
    const gameOverDisplay = document.querySelector('#gameOverText')
    const scoreDisplay = document.querySelector('#score'); // Displays score
    window.chainDisplay = document.querySelector('#chainLength'); // Displays chain length
    window.upNext = document.querySelector('#upNext'); // Displays the up next text
    window.startBtn = document.querySelector('#start-button') // Start and pause button
    const endDisplay = document.querySelector('#endDisplay'); // Displays the end state
    window.dropdownBtn = document.querySelector('.dropdown'); // All dropdown menus
    window.aestheticCustom = document.querySelector('#aesthetic-custom'); // Customize aesthetics button
    window.squares = Array.from(document.querySelectorAll('.grid div')); // Array of all grid spaces


    window.width = 6; // Width of each grid space
    let timerId = 0; // Interval in which puyos fall
    let score = 0; // Score
    let isInputEnabled = false; // Controls whether input is enabled
    let isClickedOnce = false; // Controls whether the start button has been clicked once
    let chainLength = 0; // Length of the current chain
    let puyoCount = 0; // Number of puyo cleared in a chain
    let chainPower = 0; // Chain power depending on chain length
    let colorBonus = 0; // Color bonus depending on how many different colored puyo were cleared
    let groupBonus = 0; // Group bonus depending on how many of the same color puyo were cleared
    let timeoutId; // Id for how long multiplier's increment
    let isFalling = false // Tracks if puyos are currently falling
    let isUnpauseEnabled = true // Tracks if current position movement can occur
    let isGameOver = false; // Checks if a game over has occurred
    window.puyosToPop = 4; // Amount of puyos needed to connect in order to pop
    window.amountOfColors = 4; // Amount of different colors displayed
    let fallSpeed = 1000; // How much time passes before puyos are moved down
    window.showImageClicked = false; // Checks whether the image puyos are selected

    // All colors of puyos
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

    // Maps rgb values to their respective class based on color
    const rgbaClassMap = {
        "rgba(255, 0, 0, 0)": "redPuyo",   // Red
        "rgba(34, 139, 34, 0)": "greenPuyo", // Green
        "rgba(30, 144, 255, 0)": "bluePuyo",  // Blue
        "rgba(255, 255, 0, 0)": "yellowPuyo", // Yellow
        "rgba(138, 43, 226, 0)": "purplePuyo", // Purple
        "rgba(0, 128, 128, 0)": "tealPuyo", // Teal
        "rgba(255, 105, 180, 0)": "pinkPuyo" // Pink
    };

    // Maps rgb values to their respective colors
    const rgbaToName = {
        "rgba(255, 0, 0, 0)": "red",   // Red
        "rgba(34, 139, 34, 0)": "forestgreen", // Green
        "rgba(30, 144, 255, 0)": "dodgerblue",  // Blue
        "rgba(255, 255, 0, 0)": "yellow", // Yellow
        "rgba(138, 43, 226, 0)": "blueviolet", // Purple
        "rgba(0, 128, 128, 0)": "teal", // Teal
        "rgba(255, 105, 180, 0)": "hotpink" // Pink
    };
    
    // The puyo rotations
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
    if (width == 1) {
        currentPosition = Math.floor(1)
    }
    window.currentRotation = 0;
    window.current = puyo[currentRotation];

    // Adds font to the puyos
    function addFont(puyos, puyoPosition, array) {
        const colorClass = getColorClass(colors[random]);
        const computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;
        if (colorClass) {
            array[puyos + puyoPosition].classList.remove('fontState', colorClass);
        } else if (showImageClicked) {
            console.log("addFont else if called");
            if (computedColor == "rgba(0, 0, 0, 0)") return;
            array[puyos + puyoPosition].style.borderRadius = '50%';
            // array.forEach(index => {
            //     if (!isClickedOnce) return;
            //     if (index.classList.contains('aboveGrid')) return
            //     let rgbValues = computedColor.match(/\d+/g);
            //     let newColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0)`;
            //     array[puyos + puyoPosition].style.backgroundColor = newColor;
            //     array[puyos + puyoPosition].classList.remove('fontState', colorClass);
            //     array[puyos + puyoPosition].style.boxShadow = "0 0 0 1px rgba(0, 0, 0, 0.3) inset";
            //     array[puyos + puyoPosition].style.borderRadius = '0%';
            //     array[puyos + puyoPosition].removeAttribute('id');
            //     array[puyos + puyoPosition].classList.add('fontState', colorClass);
            //     array[puyos + puyoPosition].classList.add(colorClassMap[computedColor]);
            //     array[puyos + puyoPosition].classList.remove('undefined', 'null');
            // })
            // if (array[puyos + puyoPosition].classList.contains('aboveGrid')) {
            //     array[puyos + puyoPosition].classList.remove('fontState', 'undefined', 'null');
            //     array[puyos + puyoPosition].style.boxShadow = "none";
            //     array[puyos + puyoPosition].style.boxShadow = "100%";
            // }
        }
            // If the computed color matches one in the map, add font
            if (colorClassMap[computedColor]) {
                array[puyos + puyoPosition].removeAttribute('id');
                array[puyos + puyoPosition].classList.add(colorClassMap[computedColor]);
            }
    }

    // Removes font from puyos
    function removeFont(puyos, puyoPosition, array) {
        const colorClass = getColorClass(colors[random]);
        let computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;
        if (colorClass) {
            array[puyos + puyoPosition].classList.add('fontState', colorClass);
        } else if (showImageClicked) {
            console.log("removeFont else if called");
        //     array.forEach(index => {
        //         if (!index.classList.contains('aboveGrid')) return
        //         array[puyos + puyoPosition].classList.remove('fontState', colorClass);
        //         // array[puyos + puyoPosition].classList.remove(colorClassMap[computedColor]);
        //         array[puyos + puyoPosition].style.border = "none";
        //         array[puyos + puyoPosition].style.boxShadow = "";
        //         array[puyos + puyoPosition].className = '';
        //         array[puyos + puyoPosition].id = 'gridDiv';
        //     })
        }
    
        // If the computed color matches one in the map, remove font
        if (colorClassMap[computedColor]) {
            array[puyos + puyoPosition].id = 'gridDiv';
            array[puyos + puyoPosition].classList.remove(colorClassMap[computedColor]);
        }
    }

    function getColorClass(color) {
        return colorClassMap[color] || null;
    }

    function getColorNameFromRgba(rgba) {
        return rgbaToName[rgba] || "unknown color";
    }

    // Draws puyos
    function draw(puyos) {
        if (isGameOver) return
            current.forEach(index => {

                // Sets the background color and adds the puyoBlob class
                if (puyos + index <= width - 1)  return;
                squares[puyos + index].classList.add('puyoBlob');
                squares[puyos + index].classList.add('currentPosition');
                squares[puyos + index].style.backgroundColor = colors[random];
                addFont(puyos, current[1], squares);
        });
    
        // Adds secondary color
        if (puyos === currentPosition) {
            squares[puyos + current[0]].style.backgroundColor = colors[randomSecondary];
            current.forEach(index => {
                const secondaryColorClass = getColorClass(colors[randomSecondary]);
                if (secondaryColorClass) {
                    squares[puyos + index].classList.add(secondaryColorClass);
                }
                addFont(puyos, current[0], squares);
                squares[puyos + index].classList.add('currentPosition');
            });
        }
        freeze();
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

    }

    document.addEventListener('keydown', control); // Attaches the control function to the 'keydown' event
    document.addEventListener('keyup', releaseKey); // Attaches the releaseKey function to the 'keyup' event

    // Set to track keys currently held down
    const activeKeys = new Set();

    // Key bindings object
    let keyBindings = {
        "a": rotateLeft,
        "A": rotateLeft,
        "z": rotateLeft,
        "Z": rotateLeft,
        "d": rotateRight,
        "D": rotateRight,
        "s": moveDownCurrent,
        "S": moveDownCurrent,
        "ArrowRight": moveRight,
        "ArrowLeft": moveLeft,
        "ArrowUp": rotateRight,
        "ArrowDown": moveDownCurrent,
        " ": hardDrop,
    };

    // Assigns functions to keyCodes
    function control(e) {
        if (!isInputEnabled) return; // Ignore if input is disabled
    
        // Prevent repeated actions for specific keys
        if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
            if (activeKeys.has(e.key)) return;
            activeKeys.add(e.key);
        }
    
        // Call the corresponding function from the keyBindings object
        if (keyBindings[e.key]) {
            keyBindings[e.key]();
        }
    }

    function releaseKey(e) {
        // Remove the key from the set when it is released
        activeKeys.delete(e.key);
    }

    // Move down function
    function moveDownCurrent() {
        if (!isUnpauseEnabled) return;
        multiplierTimeout();
        undraw(currentPosition);  // Remove puyos from the current position
        currentPosition += width;
        draw(currentPosition);
    }

    // Move down function for already placed puyos
    async function moveDownPlaced(index, initialColor) {

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
                resolve();  // Resolves the promise once the move is completed
            }, 100);  // Delay for each puyo move
        });
    }

    // Allows the puyos to be snapped to the bottom instantly
    function hardDrop() {
        if (!isUnpauseEnabled) return;
        undraw(currentPosition);  // Remove puyos from the current position
            while (!squares[currentPosition + width].classList.contains('taken')) {
                moveDownCurrent();
            }
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
    function rotateRight() {
        if (!isUnpauseEnabled) return;
        undraw(currentPosition);
        checkRotationRight(currentPosition);
        current = puyo[currentRotation];
        draw(currentPosition);
    }

    // Rotate the puyos to the left
    function rotateLeft() {
        if (!isUnpauseEnabled) return;
        undraw(currentPosition);
        checkRotationLeft();
        current = puyo[currentRotation];
        draw(currentPosition);
    }

    // Freeze function 
    function freeze() {
        if (current.some(index => {
            const nextIndex = currentPosition + index + width;
            return nextIndex >= squares.length - width || squares[nextIndex].classList.contains('taken');
        })) {
            isUnpauseEnabled = false;
            freezeContinue();
            scoreDisplay.innerHTML = score;
        }
    }
    // Continues freeze function
    function freezeContinue() {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        current.forEach(index => squares[currentPosition + index].classList.remove('currentPosition'));
        falling();
        if (isFalling) {
            startBtn.innerHTML = 'Pause';
            pauseEverything();
        } else {
            setTimeout(() => {
                checkAdjacentColor(currentPosition);
            }, 200);
            multiplierTimeout();
        }
    }

    // Creates new puyos to fall
    function createNewPuyo() {
        console.log("create new puyo called")
        current.forEach(index=> squares[currentPosition + index].classList.remove('currentPosition'));
        random = nextRandom;
        nextRandom = thirdRandom
        randomSecondary = nextRandomSecondary;
        nextRandomSecondary = thirdRandomSecondary;
        currentRotation = 0;
        thirdRandom = Math.floor(Math.random() * amountOfColors);
        thirdRandomSecondary = Math.floor(Math.random() * amountOfColors);
        current = puyo[currentRotation];
        currentPosition = Math.ceil(width / 2 - 1);
        if (width == 1) {
            currentPosition = Math.floor(width / 2)
        }
        draw(currentPosition);
        setTimeout(() => {
            chainDisplay.innerHTML = "";
        }, 3000);
    }

    // Resets multiplier variables to default when the chain ends
    function multiplierTimeout() {
        if (isFalling) return
        chainLength = 0;
        puyoCount = 0;
        chainPower = 0;
    }
    
    // Allows puyos to fall 
    async function falling() {
        isFallingTimeout();
        let movedPuyos = false; // Tracks if any puyo moved
        let visited = new Set(); // Ensures no puyos get visited twice
        let promises = [];  // Array to hold promises

        // Loops through the grid squares
        squares.forEach((square, index) => {
            // Skips if it's not a Puyo or already visited
            if (!square.classList.contains('puyoBlob') || visited.has(index) || 
            square.classList.contains('currentPosition')) return;

            const belowIndex = index + width; // Position below the current puyo
            // Skips if below the grid or if the square is already filled
            if (belowIndex >= squares.length - width) return;

            // Checks if the space below is empty
            if (!squares[belowIndex].classList.contains('puyoBlob') && 
                !squares[belowIndex].classList.contains('taken')) {

                visited.add(index); // Marks as visited to avoid multiple moves on the same Puyo

                // Moves the Puyo down and add the promise for this move
                const movePromise = moveDownPlaced(index, squares[index].style.backgroundColor);
                promises.push(movePromise);  // Store the promise in an array
                movedPuyos = true;
                isFalling = true;
            }
        });
        // Wait for all moves to finish before continuing
        if (movedPuyos) {
            await Promise.all(promises);
            falling();  // Recursively call falling to check if any new Puyos need to fall
        } else {
            // After all Puyos have settled, check for adjacent Puyos to clear
            squares.forEach((square, index) => {
                if (square.classList.contains('puyoBlob')) {
                    setTimeout(() => {
                        checkAdjacentColor(index);
                    }, 200);
                }
            });
        }
        isFalling = false;
    }

    // Draws more puyos if falling and chaining has stopped
    function isFallingTimeout() {
        allClear();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            unPauseCurrent();
            gameOver();
            isUnpauseEnabled = true
        }, 201)
    }

    // Move the puyos left, unless it is at the edge or there is a blockage
    function moveLeft() {
        if (!isUnpauseEnabled) return;
        undraw(currentPosition);
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge)
            currentPosition--;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition++;

        draw(currentPosition);
    }

    // Move the puyos right, unless it is at the edge or there is a blockage
    function moveRight() {
        if (!isUnpauseEnabled) return;
        undraw(currentPosition);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge)
            currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition -= 1;

        draw(currentPosition);
    }

    // Show up-next puyos in mini grid
    window.displaySquares = document.querySelectorAll('.mini-grid div');
    window.displayIndex = 0;
    window.nextDisplaySquares = document.querySelectorAll('.next-mini-grid div');
    window.nextDisplayIndex = 0;

    // Displays the puyos in the mini-grid display
    function displayShape() {
        console.log("Display shape called")
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
                // console.log(displaySquares[displayIndex].style.backgroundColor);
            } else {
                const computedColor1 = window.getComputedStyle(displaySquares[displayIndex]).backgroundColor;
                const computedColor2 = window.getComputedStyle(displaySquares[displayIndex + 1]).backgroundColor;
                let fontColor1 = getColorNameFromRgba(window.getComputedStyle(displaySquares[displayIndex]).backgroundColor);
                let fontColor2 = getColorNameFromRgba(window.getComputedStyle(displaySquares[displayIndex + 1]).backgroundColor);
                displaySquares[displayIndex].classList.add('puyoBlob');
                displaySquares[displayIndex].style.backgroundColor = colors[nextRandom];
                displaySquares[displayIndex + 1].classList.add('puyoBlob');
                displaySquares[displayIndex + 1].style.backgroundColor = colors[nextRandomSecondary];
                // console.log(displaySquares[displayIndex + 1].style.backgroundColor);
                displaySquares[displayIndex].classList.add(rgbaClassMap[fontColor1]);
                // console.log("computed color 1: " + computedColor1);
                displaySquares[displayIndex + 1].classList.add(rgbaClassMap[fontColor2]);
            }

            addFont(displayIndex, 0, displaySquares);
            addFont(displayIndex, 1, displaySquares);

            if (!showImageClicked) {
                nextDisplaySquares[nextDisplayIndex].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex].style.backgroundColor = colors[thirdRandom];
                nextDisplaySquares[nextDisplayIndex + 1].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex + 1].style.backgroundColor = colors[thirdRandomSecondary];
            } else {
                // const computedColor1 = window.getComputedStyle(nextDisplaySquares[nextDisplayIndex]).backgroundColor;
                // const computedColor2 = window.getComputedStyle(nextDisplaySquares[nextDisplayIndex + 1]).backgroundColor;
                // let fontColor1 = getColorNameFromRgba(window.getComputedStyle(nextDisplaySquares[nextDisplayIndex]).backgroundColor);
                // let fontColor2 = getColorNameFromRgba(window.getComputedStyle(nextDisplaySquares[nextDisplayIndex + 1]).backgroundColor);
                nextDisplaySquares[nextDisplayIndex].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex].style.backgroundColor = colors[thirdRandom];
                nextDisplaySquares[nextDisplayIndex + 1].classList.add('puyoBlob');
                nextDisplaySquares[nextDisplayIndex + 1].style.backgroundColor = colors[thirdRandomSecondary];
                // nextDisplaySquares[nextDisplayIndex].classList.add(rgbaClassMap[fontColor1]);
                // nextDisplaySquares[nextDisplayIndex + 1].classList.add(rgbaClassMap[fontColor2]);
            }
            addFont(nextDisplayIndex, 0, nextDisplaySquares);
            addFont(nextDisplayIndex, 1, nextDisplaySquares);
    }
    window.displayShape = displayShape;

    // Adds functionality to the pause button
    startBtn.addEventListener('click', () => {
        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
        upNext.innerHTML ='UpNext';
        startBtnPause();
        event.target.blur();
    });

    // Adds pause/play functionality to the escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
            startBtnPause(); // Toggle pause/unpause when the escape key is pressed
        }
    });

    // Draws next set of puyos
    function unPauseCurrent() {
        isInputEnabled = false;
        clearInterval(timerId);
        createNewPuyo();
        timerId = setInterval(() => {
            moveDownCurrent();
        }, fallSpeed);
        displayShape();
        isInputEnabled = true
    } 

    // Pauses the movement of the current puyos
    function pauseEverything() {
        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>' + '  Pause';
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            isInputEnabled = false;
        } else {
            draw(currentPosition);
            timerId = setInterval(() => {
                moveDownCurrent()
            }, fallSpeed);
            isInputEnabled = true;
            displayShape();
        }
    }

    // Starts, pauses, and unpauses the game
    function startBtnPause() {
        if (!isUnpauseEnabled) return;
        if (isGameOver) return;

        // Removes customization when game starts
        dropdownBtn.classList.add("hidden");
        aestheticCustom.classList.add("hidden");

        if (timerId) {
            startBtn.innerHTML = '<i class="fa-solid fa-play"></i>' + '  Play';
            clearInterval(timerId);
            timerId = null;
            isInputEnabled = false;
        } else {
            draw(currentPosition);
            timerId = setInterval(() => {
                moveDownCurrent()
            }, fallSpeed);
            isInputEnabled = true;
            if (isClickedOnce) return;
            nextRandom = Math.floor(Math.random() * amountOfColors)
            nextRandomSecondary = Math.floor(Math.random() * amountOfColors)
            thirdRandom = Math.floor(Math.random() * amountOfColors)
            thirdRandomSecondary = Math.floor(Math.random() * amountOfColors)
            displayShape();
            isClickedOnce = true;
        }
    }
    
    // Main function to check and clear adjacent Puyos
    function checkAdjacentColor(puyoIndex) {
        if (isGameOver) return;
        current.some(index => {
            let neighborIndex = puyoIndex + index;
            if (neighborIndex >= 0 && neighborIndex < squares.length - width) {
                let color = window.getComputedStyle(squares[puyoIndex + index]).backgroundColor;
                const connected = (getConnectedPuyos(puyoIndex + index, color, new Set()));
            
                // If the puyos to pop value or more connected puyos are found, clear them
                    if (connected.length >= puyosToPop) {
                    connected.forEach(ind => {
                        removeFont(ind, 0, squares);
                        squares[ind].classList.remove('taken');
                        squares[ind].classList.remove('puyoBlob');
                        squares[ind].style.backgroundColor = '';
                        puyoCount++;
                    });
                    chainLength++; // Increment length of chain
                    chainDisplay.innerHTML = chainLength + " chain!";
                    displayScore();
                    falling(); // Check if any puyos need to fall after clearing
                    console.log("Chain length: " + chainLength);
                }
            }
        })
    }

    // Helper for checkAdjacentColor to recursively find all connected Puyos of the same color
    function getConnectedPuyos(index, color, visited = new Set()) {
        // Base case: Makes sure puyos don't get counted more than once
        if (visited.has(index)) return [];
        visited.add(index); //
        let connectedPuyos = []; // Array of same colored puyos that are adjacent to each other
        connectedPuyos.push(index);

        const directions = [
            -width, // Up
            width, // Down
            -1, // Left
            1 // Right
        ];

        // Color comparison loop
        directions.forEach(direction => {
        let neighborIndex = index + direction; // Index of neighboring puyos
            // Makes sure both current color and neighboring colors are in the same color format
            let neighborColor = 'rgb(128, 128, 128)';
                if (neighborIndex >= 0 && neighborIndex < squares.length - width) {
                if (window.getComputedStyle(squares[neighborIndex]).backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    neighborColor = window.getComputedStyle(squares[neighborIndex]).backgroundColor;
                }
            }

            // Boundary checks
            if (neighborIndex < 0 || neighborIndex >= squares.length - width) return; // Grid boundary
            if ((direction === -1 && index % width === 0) && width != 1) return;  // Left boundary
            if ((direction === 1 && (index + 1) % width === 0) && width != 1) return;  // Right boundary

            // Compares colors
            if (neighborColor === color && !visited.has(neighborIndex)) {
                // Adds adjacent puyos to connected list
                connectedPuyos = connectedPuyos.concat(getConnectedPuyos(neighborIndex, color, visited));
            }
        })
        return connectedPuyos;   
    }

    // Logic for a clear board
    function allClear() {
        if (squares.every(square => !square.classList.contains('puyoBlob') || 
        square.classList.contains('currentPosition'))) {
            scoreDisplay.innerHTML = 'All Clear!';
            score += 5000;
        }
    }

    // Calculates and displays score according to Puyo Puyo Tsu rules
    function displayScore() {
        if (chainLength === 1) {
            score += 10 * puyoCount;
            scoreDisplay.innerHTML = score;
        } else if (chainLength > 1) {

            // Exponential growth until chain is greater than 5
            if (chainLength <= 5) {
            chainPower = (2 ** (chainLength));
            } else if (chainLength > 5) {
                chainPower += 32;
            }

            finalScoreAdd = ((10 * puyoCount) * chainPower); // Final score calculation
            score += finalScoreAdd;
            scoreDisplay.innerHTML = score; // Displays the score
        }
    }
    
    // Game over if reached the top
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            endDisplay.innerHTML = 'game over';
            isUnpauseEnabled = false;
            isGameOver = true;
            clearInterval(timerId);
            isInputEnabled = false
            setTimeout(() => {
                gameOverDisplay.innerHTML = "To restart, refresh the page";
                gameOverDisplay.style.padding = '20px';
                gameOverDisplay.style.border= "solid 3px black";
                gameOverDisplay.style.borderRadius = '30px';
            }, 2000);
        }
    }
})