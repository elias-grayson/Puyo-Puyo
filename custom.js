document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const miniGrid = document.querySelector('.mini-grid');
    const nextMiniGrid = document.querySelector('.next-mini-grid');
    const navbar = document.querySelector('.navbar');
    const controlDisplay = document.querySelector('#controlDisplay');
    const leftControl = document.querySelector('#left');
    const rightControl = document.querySelector('#right');
    const downControl = document.querySelector('#down');
    const ccwControl = document.querySelector('#counterclockwise');
    const cwControl = document.querySelector('#clockwise');
    const hardDropControl = document.querySelector('#hardDrop');
    const gridDiv = document.querySelector("#gridDiv");
    const gridDivSpan = document.createElement('span');
    const gridBefore = window.getComputedStyle(grid, '::before');
    // window.squares = Array.from(document.querySelectorAll('.grid div'));

    // window.width = 6; // Width of each grid space
    let height = 14; // Height of the grid
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

    // Allows the grid width to be changed
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
                    if (amtOfDivs.length < (secondNextOldSquares.length - width*height)) {
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
        if (showImageClicked) {
            document.querySelectorAll('.grid div').forEach((puyo) => {
                puyo.classList.add('fontState');
                document.querySelectorAll('.puyoBlob').forEach((puyo) => {
                    puyo.style.border = "1px solid rgba(0, 0, 0, 0.3)";
                    puyo.style.borderRadius = '0%';
                    puyo.style.backgroundColor = '';
                    puyo.classList.add('fontState');
                });
            });
        } else {
            document.querySelectorAll('.grid div').forEach((puyo) => {
                puyo.classList.remove('fontState'); 
                puyo.style.backgroundColor = '';
            });
            document.querySelectorAll('.puyoBlob').forEach((puyo) => {
                puyo.style.border = "1px solid rgba(0, 0, 0, 0.3)";
                puyo.classList.remove('fontState');
            });
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
            puyo.style.lineHeight = '1';
        });
        document.querySelectorAll('.puyoBlob').forEach((puyo) => {
            puyo.style.border = "1px solid rgba(0, 0, 0, 0.3)";
            puyo.classList.remove('fontState');
            puyo.style.lineHeight = '1';
        });
        showImageClicked = false;
    });

    // Replaces the default font with images
    document.getElementById('showImage').addEventListener('click', () => {
        event.stopPropagation();
        displayShape();
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.add('fontState');
            document.querySelectorAll('.puyoBlob').forEach((puyo) => {
                puyo.style.border = "1px solid rgba(0, 0, 0, 0.3)";
                // puyo.style.borderRadius = '0%';
                // puyo.style.backgroundColor = '';
                puyo.classList.add('fontState');
                puyo.style.borderRadius = '50%';
            });
        });
        showImageClicked = true;
    });

    // Changes the background to green when clicked
    $(".backGroundBtn").on("click", "#greenBackground", function (event) {
        event.preventDefault();
        event.stopPropagation();// Prevents dropdown from disappearing when option is clicked

        // Changes the grids an navbar backgrounds to green gradient
        grid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        miniGrid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        nextMiniGrid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        navbar.style.background = "linear-gradient(to top, rgb(16, 72, 31), rgb(37, 201, 59))"

        // Changes the background detail back to default
        grid.style.setProperty('--font-family', '"Font Awesome 6 Free"');
        grid.style.setProperty('--before-font-size', '100px');
        grid.style.setProperty('--before-color', 'white');
        grid.style.setProperty('--before-opacity', '30%');
        grid.style.setProperty('--before-content', '"\\f005"');
    })

    // Changes the background to red when clicked
    $(".backGroundBtn").on("click", "#redBackground", function (event) {
        event.preventDefault();
        event.stopPropagation();// Prevents dropdown from disappearing when option is clicked

        // Changes the grids an navbar backgrounds to red gradient
        grid.style.background = "radial-gradient(#d48f8f, rgb(121, 0, 0))"
        miniGrid.style.background = "radial-gradient(#d48f8f, rgb(121, 0, 0))"
        nextMiniGrid.style.background = "radial-gradient(#d48f8f, rgb(121, 0, 0))"
        navbar.style.background = "linear-gradient(to top, rgb(103, 23, 23), rgb(255, 30, 30))"

        // Changes the background detail back to default
        grid.style.setProperty('--font-family', '"Font Awesome 6 Free"');
        grid.style.setProperty('--before-font-size', '100px');
        grid.style.setProperty('--before-color', 'white');
        grid.style.setProperty('--before-opacity', '30%');
        grid.style.setProperty('--before-content', '"\\f005"');
    })

    // Changes the background to purple and changes the background icon to "Elias" in comic sans when clicked
    $(".backGroundBtn").on("click", "#purpleBackground", function (event) {
        event.preventDefault(); 
        event.stopPropagation(); // Prevents dropdown from disappearing when option is clicked

        // Changes the grids an navbar backgrounds to purple gradient
        grid.style.background = "radial-gradient(#c489ff, rgb(76, 30, 98))"
        miniGrid.style.background = "radial-gradient(#c489ff, rgb(76, 30, 98))"
        nextMiniGrid.style.background = "radial-gradient(#c489ff, rgb(76, 30, 98))"
        navbar.style.background = "linear-gradient(to top, rgb(54, 17, 72), rgb(183, 60, 255))"

        // Changes the background detail to Elias in comic sans
        grid.style.setProperty('--before-content', '"Elias :)"'); 
        grid.style.setProperty('--before-font-size', '30px'); 
        grid.style.setProperty('--before-color', 'black');
        grid.style.setProperty('--before-opacity', '100%');
        grid.style.setProperty('--font-family', '"Comic Sans MS", cursive, sans-serif');
    })

    // Returns the background back to blue when clicked
    $(".backGroundBtn").on("click", "#blueBackground", function (event) {
        event.preventDefault();
        event.stopPropagation();// Prevents dropdown from disappearing when option is clicked

        // Changes the grids an navbar backgrounds to blue gradient
        grid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        miniGrid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        nextMiniGrid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        navbar.style.background = "linear-gradient(to top, midnightblue, dodgerblue)"

        // Changes the background back to default
        grid.style.setProperty('--font-family', '"Font Awesome 6 Free"');
        grid.style.setProperty('--before-font-size', '100px');
        grid.style.setProperty('--before-color', 'white');
        grid.style.setProperty('--before-opacity', '30%');
        grid.style.setProperty('--before-content', '"\\f005"');
    })

    // Changes the controls to a flipped scheme
    $("#controlContainer").on("click", "#defaultControls", function (event) {
        event.preventDefault();
        event.stopPropagation();
        keyBindings = {
            "a": sharedRotateLeft,
            "A": sharedRotateLeft,
            "z": sharedRotateLeft,
            "Z": sharedRotateLeft,
            "d": sharedRotateRight,
            "D": sharedRotateRight,
            "s": sharedMoveDownCurrent,
            "S": sharedMoveDownCurrent,
            "ArrowRight": sharedMoveRight,
            "ArrowLeft": sharedMoveLeft,
            "ArrowUp": sharedRotateRight,
            "ArrowDown": sharedMoveDownCurrent,
            " ": sharedHardDrop,
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
    $("#controlContainer").on("click", "#altControls", function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Key bindings
        keyBindings = {
        "a": sharedMoveLeft,
        "A": sharedMoveLeft,
        "ArrowRight": sharedRotateRight,
        "ArrowLeft": sharedRotateLeft,
        "ArrowUp": sharedRotateRight,
        "ArrowDown": sharedRotateLeft,
        "d": sharedMoveRight,
        "D": sharedMoveRight,
        "s": sharedMoveDownCurrent,
        "S": sharedMoveDownCurrent,
        "w": sharedHardDrop,
        "W": sharedHardDrop,
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
})