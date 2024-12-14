document.addEventListener('DOMContentLoaded', () => {

    // DOM elements
    const grid = document.querySelector('.grid');
    const miniGrid = document.querySelector('.mini-grid');
    const nextMiniGrid = document.querySelector('.next-mini-grid');
    const navbar = document.querySelector('.navbar');
    const gameOverDisplay = document.querySelector('#gameOverText')
    const scoreDisplay = document.querySelector('#score'); // Displays score
    const chainDisplay = document.querySelector('#chainLength'); // Displays chain length
    const upNext = document.querySelector('#upNext'); // Displays the up next text
    const startBtn = document.querySelector('#start-button') // Start and pause button
    const endDisplay = document.querySelector('#endDisplay'); // Displays the end state
    const dropdownBtn = document.querySelector('.dropdown'); // All dropdown menus
    const aestheticCustom = document.querySelector('#aesthetic-custom'); // Customize aesthetics button
    const controlDisplay = document.querySelector('#controlDisplay');
    const leftControl = document.querySelector('#left');
    const rightControl = document.querySelector('#right');
    const downControl = document.querySelector('#down');
    const ccwControl = document.querySelector('#counterclockwise');
    const cwControl = document.querySelector('#clockwise');
    const hardDropControl = document.querySelector('#hardDrop');
    let squares = Array.from(document.querySelectorAll('.grid div'));

    let width = 6; // Width of each grid space
    let height = 14; // Height of the grid
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
    let puyosToPop = 4; // Amount of puyos needed to connect in order to pop
    let amountOfColors = 4; // Amount of different colors displayed
    let fallSpeed = 1000; // How much time passes before puyos are moved down
    let controlMargin = 390; // How big the left margin is for the controls display

    // Prevents dropdown menu from closing when clicking nested dropend
    document.querySelectorAll('.dropend .dropdown-toggle').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Prevents dropdown menu from closing when clicking nested dropdown
    document.querySelectorAll('.dropdown .dropdown-toggle').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Prevents dropfront menu from closing when clicking nested dropfront
    document.querySelectorAll('.dropfront .dropdown-toggle').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Allows the fall speed display to change on input
    $("#fallSpeedInput").on("change input", function() {
        fallSpeed = $(this).val(); // Changes the fall speed to the chosen value
        var dividedValue = fallSpeed / 1000;
        if (dividedValue == 1) {
            $("#fallSpeedValue").text(dividedValue + " second (default)");
        } else {
        $("#fallSpeedValue").text(dividedValue + " seconds");
        }
      })

    // Allows the puyo pop display to change on input
    $("#puyoPopInput").on("change input", function() {
        puyosToPop = $(this).val(); // Changes the amount of puyos required to clear to the chosen value
        if (puyosToPop == 4) {
            $("#puyoPopValue").text(puyosToPop + " puyos (default)");
        } else {
            $("#puyoPopValue").text(puyosToPop + " puyos");
        }
    })

    // Allows the range display to change on input
    $("#amtPuyoInput").on("change input", function() {
        amountOfColors = $(this).val(); // Changes the amount of colors that appear to the chosen value
        if (amountOfColors == 1) {
            $("#amtPuyoValue").text(amountOfColors + " color");
        } else if (amountOfColors == 4) {
            $("#amtPuyoValue").text(amountOfColors + " colors (default)");
        } else {
        $("#amtPuyoValue").text(amountOfColors + " colors");
        }
        // Assures amount of colors is up to date with the choice
        random = Math.floor(Math.random()*amountOfColors);
        randomSecondary = Math.floor(Math.random()*amountOfColors);
    })

    $("#gameButtonContainer").on("click", ".widthButton", function (event) {
        event.stopPropagation();
        chosenWidth = $(this).data("width"); // Get the width from the button's data attribute
        newChosenWidth = chosenWidth;
        let widthDif = width - chosenWidth; // Difference between old and new width

        upNext.style.marginLeft = chosenWidth * 48 + 200 + "px";
        startBtn.style.width = chosenWidth * 96 / 2 + 'px';
        controlMargin -= (widthDif*48);
        controlDisplay.style.marginLeft = controlMargin + "px";
        chainDisplay.style.marginRight = (-widthDif*48) + "px";

        if (chosenWidth == 1) {
            $("#gridSpaces").text(chosenWidth + " grid space");
        } else if (chosenWidth == 6) {
            $("#gridSpaces").text(chosenWidth + " grid spaces (default)");
        } 
        else {
            $("#gridSpaces").text(chosenWidth + " grid spaces");
        }

        // Updates the width display
        grid.style.width = `${chosenWidth * 48 + 20}px`; 
        grid.style.minWidth = `${chosenWidth * 48 + 20}px`;
    
        // Adjust taken squares and grid differences as needed
        let amtOftaken = [];
        let amtOfAbove = [];
        let gridDifference = squares.length - (chosenWidth * height);

        // Adds the # of taken grid spaces to the array
        squares.forEach(index => {
            if (index.classList.contains("taken")) {
                amtOftaken.push(index);
            }
        });

        // Adds the # of taken grid spaces to the array
        squares.forEach(index => {
            if (index.classList.contains("taken")) {
                amtOfAbove.push(index);
            }
        });
    
        let newWidthDif = widthDif; // For iterating through taken
    
        // Continue if the chosen grid size is less than the default
        if (chosenWidth < width) {

            // Remove elements from the above array until they equal the width
            squares.slice().reverse().forEach(index => {
                const $newDiv = $("<div></div>");
                if (index.classList.contains("aboveGrid")) {
                    if (amtOfAbove.length > chosenWidth) {
                        const firstIndex = amtOfAbove.shift();
                        amtOfAbove.push(firstIndex);
                        $newDiv.attr('id', 'gridDiv');
                        index.parentNode.appendChild($newDiv[0], index);
                        index.setAttribute('id', 'gridDiv')
                        index.classList.remove('aboveGrid');
                        amtOfAbove.length--;
                        widthDif--;
                    }
                }
            });

            // Remove elements from the taken array until they equal the width
            amtOftaken.forEach((index) => {
                if (newWidthDif > 0) {
                    index.remove();
                    newWidthDif--;
                    widthDif++;
                }
            });

            // Remove grid divs until the proper amount has been reached
            squares.slice().reverse().forEach(index => {
                if (index.classList.contains("taken")) return;
                if (index.classList.contains("aboveGrid")) return
                if (gridDifference > (widthDif)) {
                    index.remove();
                    widthDif++;
                }
            });

            // If there are any more grid divs left over, remove them
            squares = Array.from(document.querySelectorAll('.grid div'));
            squares.forEach((square, index) => {
                if (index >= chosenWidth * height) {
                    square.remove();
                }
            });
        }


        // If the chosen grid size is greater than the default, continue
        if (chosenWidth > width) {
            i = 0
            if (width < 4 && chosenWidth > 4) chosenWidth = 4;
            while (i < 2) {
                console.log("made it");
                console.log(chosenWidth);
                let amtOfDivs = [];
                let newGridDif = chosenWidth*2
                squares.forEach((square, index) => {
                    if (square.classList.contains('aboveGrid') || square.classList.contains('taken')) {
                        square.remove();
                    }
                })

                squares = Array.from(document.querySelectorAll('.grid div'));
                // Adds aboveGrid divs to the squares array until it has reached the desired width
                amtOfDivs = [];
                let oldSquares = [];
                squares.forEach((index) => {
                    const $newDiv = $("<div>")
                    if (amtOfDivs.length < ((chosenWidth*height - (squares.length + newGridDif)))) {
                        $newDiv.attr('id', 'gridDiv')
                        index.parentNode.appendChild($newDiv[0])
                    }
                    amtOfDivs.push($newDiv[0])
                    oldSquares.push($newDiv[0])
                });

                squares = Array.from(document.querySelectorAll('.grid div'));
                let nextOldSquares = [];
                squares.forEach((index) => {
                    const $newDiv = $("<div>")
                    nextOldSquares.push($newDiv[0]);
                    if (amtOfDivs.length < (chosenWidth*height - (oldSquares.length + newGridDif))) {
                        console.log("made it")
                        $newDiv.attr('id', 'gridDiv')
                        index.parentNode.appendChild($newDiv[0])
                    }
                    amtOfDivs.push($newDiv[0])
                });

                squares = Array.from(document.querySelectorAll('.grid div'));
                let secondNextOldSquares = [];
                squares.forEach(index => {
                    const $newDiv = $("<div>")
                    $newDiv.attr('id', 'gridDiv')
                    nextOldSquares.push($newDiv[0]);
                })
                squares.forEach((index) => {
                    const $newDiv = $("<div>")
                    if (amtOfDivs.length < (chosenWidth*height - (nextOldSquares.length + newGridDif))) {
                        $newDiv.attr('id', 'gridDiv')
                        index.parentNode.appendChild($newDiv[0])
                        amtOfDivs.push($newDiv[0])
                    }
                });

                squares = Array.from(document.querySelectorAll('.grid div'));
                let thirdNextOldSquares = [];
                squares.forEach(index => {
                    if (secondNextOldSquares.length >= (chosenWidth*height + newGridDif)) return;
                    const $newDiv = $("<div>")
                    $newDiv.attr('id', 'gridDiv')
                    secondNextOldSquares.push($newDiv[0]);
                })
                squares.forEach(index => {
                    if (secondNextOldSquares.length >= (chosenWidth*height - newGridDif)) return;
                    const $newDiv = $("<div>")
                    $newDiv.attr('id', 'gridDiv')
                    secondNextOldSquares.push($newDiv[0]);
                })
                squares.forEach((index) => {
                    const $newDiv = $("<div>")
                    console.log("Amount of divs: " + amtOfDivs.length)
                    if (amtOfDivs.length < (secondNextOldSquares.length - width*height)) {
                        // console.log("Divs to be filled: " + (chosenWidth*height - (secondNextOldSquares.length + newGridDif)))
                        // console.log("amount of divs: " + amtOfDivs.length);
                        // console.log("squares length: " + squares.length);
                        $newDiv.attr('id', 'gridDiv')
                        index.parentNode.appendChild($newDiv[0])
                        amtOfDivs.push($newDiv[0])
                    }
                    thirdNextOldSquares.push($newDiv[0]);
                });

                squares = Array.from(document.querySelectorAll('.grid div'));
                // Adds divs to the squares array until the grid has reached the proper length
                let amtOfAboves = []
                squares.slice().forEach((index) => {
                    if (amtOfAboves.length < chosenWidth) {
                        const $newAboveDiv = $("<div>")
                        $newAboveDiv.attr('class', 'aboveGrid');
                        index.parentNode.prepend($newAboveDiv[0]);
                        amtOfAboves.push($newAboveDiv[0])
                    }
                });

                squares = Array.from(document.querySelectorAll('.grid div'));
                // Adds taken divs to the squares array until it has reached the desired width
                let amtOfTakens = [];
                squares.slice().reverse().forEach((index) => {
                    if (amtOfTakens.length < chosenWidth) {
                        const $newTakenDiv = $("<div>").addClass("taken belowGrid");
                        index.parentNode.appendChild($newTakenDiv[0]);
                        amtOfTakens.push($newTakenDiv[0]);
                        widthDif--;
                    }
                });
                squares = Array.from(document.querySelectorAll('.grid div'));
                chosenWidth = newChosenWidth;
                i++;
            }
        }
        width = chosenWidth
        // Update puyo and other variables
        puyo = [
            [Number(width), 0],
            [Number(width), Number(width) + 1],
            [Number(width), Number(width) * 2],
            [Number(width), Number(width) - 1],
        ];
        squares = Array.from(document.querySelectorAll('.grid div'));
        current = puyo[currentRotation].map(Number); // Assure all elements are numbers
        squares.length = width * height;
        width = +width;
        currentPosition = Math.ceil(width / 2 - 1);
        if (width == 1)
            currentPosition = Math.floor(1);


        $(".widthButton").removeClass("active");  // Remove 'active' from all buttons
        $(this).addClass("active");  // Add 'active' to the clicked button
    });

    // Returns the puyos to their default font before the images
    document.getElementById('showFont').addEventListener('click', () => {
        event.stopPropagation();
        displayShape();
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.remove('fontState'); 
            puyo.style.backgroundColor = '';
        });
        document.querySelectorAll('.puyoBlob').forEach((puyo) => {
            puyo.style.border = "1px solid rgba(0, 0, 0, 0.3)";
            puyo.classList.remove('fontState');
        });
    });
    
    // Replaces the default font with images
    document.getElementById('showImage').addEventListener('click', () => {
        event.stopPropagation();
        displayShape();
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.add('fontState');
            // puyo.style.borderRadius = '0%';
            document.querySelectorAll('.puyoBlob').forEach((puyo) => {
                puyo.style.border = "1px solid rgba(0, 0, 0, 0.3)";
                puyo.style.borderRadius = '0%';
                puyo.style.backgroundColor = '';
                puyo.classList.add('fontState');
            });
        });
    });

    // Changes the background to green when clicked
    $(".backGroundBtn").on("click", "#greenBackground", function (event) {
        console.log("Green clicked")
        event.preventDefault();
        event.stopPropagation();
        grid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        miniGrid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        nextMiniGrid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        navbar.style.background = "linear-gradient(to top, rgb(16, 72, 31), rgb(37, 201, 59))"
    })

    // Changes the background to red when clicked
    $(".backGroundBtn").on("click", "#redBackground", function (event) {
        event.preventDefault();
        event.stopPropagation();
        grid.style.background = "radial-gradient(#a77171, rgb(135, 20, 20))"
        miniGrid.style.background = "radial-gradient(#a77171, rgb(135, 20, 20))"
        nextMiniGrid.style.background = "radial-gradient(#a77171, rgb(135, 20, 20))"
        navbar.style.background = "linear-gradient(to top, rgb(103, 23, 23), rgb(255, 30, 30))"
    })

    // Returns the background back to blue when clicked
    $(".backGroundBtn").on("click", "#blueBackground", function (event) {
        event.preventDefault();
        event.stopPropagation();
        grid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        miniGrid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        nextMiniGrid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        navbar.style.background = "linear-gradient(to top, midnightblue, dodgerblue)"
    })

    // Changes the controls to a flipped scheme
    $("#controlContainer").on("click", "#defaultControls", function (event) {
        event.preventDefault();
        event.stopPropagation();
        keyBindings = {
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
        leftControl.innerHTML = "Left: Left-arrow";
        rightControl.innerHTML = "Right: Right-arrow";
        downControl.innerHTML = "Down: Down-arrow, S";
        ccwControl.innerHTML = "Counterclockwise: Z, A";
        cwControl.innerHTML = "Clockwise: Up-arrow, D";
        hardDropControl.innerHTML = "Hard drop: Space";
        controlMargin = 390
        controlDisplay.style.marginLeft = "390px"
    })

    // Changes the controls back to default
    $("#controlContainer").on("click", "#flippedControls", function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Key bindings
        keyBindings = {
            "a": moveLeft,
            "A": moveLeft,
            "ArrowRight": rotateRight,
            "ArrowLeft": rotateLeft,
            "ArrowUp": rotateRight,
            "ArrowDown": rotateLeft,
            "d": moveRight,
            "D": moveRight,
            "s": moveDownCurrent,
            "S": moveDownCurrent,
            "w": hardDrop,
            "W": hardDrop,
        };
        leftControl.innerHTML = "Left: A";
        rightControl.innerHTML = "Right: D";
        downControl.innerHTML = "Down: S";
        ccwControl.innerHTML = "Counterclockwise: Left-Arrow";
        cwControl.innerHTML = "Clockwise: Right-arrow";
        hardDropControl.innerHTML = "Hard drop: W";
        controlMargin = 447.5;
        controlDisplay.style.marginLeft = "447.5px";

    })

    // All colors of puyos
    const colors = [
        'red',
        'forestgreen',
        'dodgerblue',
        'yellow',
        'blueviolet',
        'teal',
        'hotpink'
    ]

    const colorClassMap = {
        "rgb(255, 0, 0)": "redPuyo",   // Red
        "rgb(34, 139, 34)": "greenPuyo", // Green
        "rgb(30, 144, 255)": "bluePuyo",  // Blue
        "rgb(138, 43, 226)": "purplePuyo", // Purple
        "rgb(255, 255, 0)": "yellowPuyo", // Yellow
        "rgb(0, 128, 128)": "tealPuyo", // Teal
        "rgb(255, 105, 180)": "pinkPuyo" // Pink
    };
    
    // The puyo rotations
    let puyo = [
        [width, 0],
        [width, width+1],
        [width, width*2],
        [width, width-1]
    ];

    // Randomly selects a puyo
    let random = Math.floor(Math.random()*amountOfColors);
    let randomSecondary = Math.floor(Math.random()*amountOfColors);
    let nextRandom = 0;
    let nextRandomSecondary = 0;
    let thirdRandom = 0;
    let thirdRandomSecondary = 0;
    let currentPosition = Math.ceil(width / 2 - 1);
    if (width == 1) {
        currentPosition = Math.floor(1)
    }
    let currentRotation = 0;
    let current = puyo[currentRotation];

    // Adds font to the puyos
    function addFont(puyos, puyoPosition, array) {
        const colorClass = getColorClass(colors[random]);
        if (colorClass) {
            array[puyos + puyoPosition].classList.remove('fontState', colorClass);
            array[puyos + puyoPosition].style.border = "1px solid rgba(0, 0, 0, 0.3)";
            array[puyos + puyoPosition].style.borderRadius = '0%';
            array[puyos + puyoPosition].style.backgroundColor = '';
        } else if (!colorClass) {
            
        }
            const computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;
        
            // If the computed color matches one in the map, add font
            if (colorClassMap[computedColor]) {
                array[puyos + puyoPosition].removeAttribute('id');
                array[puyos + puyoPosition].classList.add(colorClassMap[computedColor]);
            }
    }

    // Removes font from puyos
    function removeFont(puyos, puyoPosition, array) {
        const colorClass = getColorClass(colors[random]);
        if (colorClass) {
            array[puyos + puyoPosition].classList.add('fontState', colorClass);
            array[puyos + puyoPosition].style.border = "1px solid rgba(0, 0, 0, 0.3)";
            array[puyos + puyoPosition].style.borderRadius = '0%';
            array[puyos + puyoPosition].style.backgroundColor = '';
        }
        const computedColor = window.getComputedStyle(array[puyos + puyoPosition]).backgroundColor;
    
        // If the computed color matches one in the map, remove font
        if (colorClassMap[computedColor]) {
            array[puyos + puyoPosition].id = 'gridDiv';
            array[puyos + puyoPosition].classList.remove(colorClassMap[computedColor]);
        }
    }

    function getColorClass(color) {
        return colorClassMap[color] || null;
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
            addFont(puyos, current[1], squares)
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
        "a": moveLeft,
        "A": moveLeft,
        "ArrowRight": rotateRight,
        "ArrowLeft": rotateLeft,
        "ArrowUp": rotateRight,
        "ArrowDown": rotateLeft,
        "d": moveRight,
        "D": moveRight,
        "s": moveDownCurrent,
        "S": moveDownCurrent,
        "w": hardDrop,
        "W": hardDrop,
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
        console.log(`event.code: ${e.code}, event.key: "${e.key}"`);
    }

    function releaseKey(e) {
        // Remove the key from the set when it is released
        activeKeys.delete(e.key);
    }

    // Move down function
    function moveDownCurrent() {
        console.log("Move down current called")
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
        const isAtLeftCorner = current.some(index => squares[currentPosition + index + width - 1].classList.contains('taken'))
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
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayIndex = 0;
    const nextDisplaySquares = document.querySelectorAll('.next-mini-grid div');
    const nextDisplayIndex = 0;

    // Displays the puyos in the mini-grid display
    function displayShape() {
        displaySquares.forEach(square => {

            // Remove font and puyos from the up next display
            removeFont(displayIndex, 0, displaySquares);
            removeFont(displayIndex, 1, displaySquares);
            square.classList.remove('puyoBlob')
            square.style.backgroundColor = '';
        });

        nextDisplaySquares.forEach(square => {

            // Remove font and puyos from the up next display
            removeFont(nextDisplayIndex, 0, nextDisplaySquares);
            removeFont(nextDisplayIndex, 1, nextDisplaySquares);
            square.classList.remove('puyoBlob')
            square.style.backgroundColor = '';
        });

            // Add puyos and font to the up next display
            displaySquares[displayIndex].classList.add('puyoBlob');
            displaySquares[displayIndex].style.backgroundColor = colors[nextRandom];
            displaySquares[displayIndex + 1].classList.add('puyoBlob');
            displaySquares[displayIndex + 1].style.backgroundColor = colors[nextRandomSecondary];
            addFont(displayIndex, 0, displaySquares);
            addFont(displayIndex, 1, displaySquares);

            nextDisplaySquares[nextDisplayIndex].classList.add('puyoBlob');
            nextDisplaySquares[nextDisplayIndex].style.backgroundColor = colors[thirdRandom];
            nextDisplaySquares[nextDisplayIndex + 1].classList.add('puyoBlob');
            nextDisplaySquares[nextDisplayIndex + 1].style.backgroundColor = colors[thirdRandomSecondary];
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
            chainDisplay.innerHTML = 'All Clear!';
            scoreDisplay.innerHTML = score;
            score += 5000;
        }
    }

    // Calculates and displays score according to Puyo Puyo Tsu rules
    function displayScore() {
        if (chainLength === 1) {
            score += 10 * puyoCount;
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