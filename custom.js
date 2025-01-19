/* This document controls all of the customization options */
document.addEventListener('DOMContentLoaded', () => {

    // DOM elements
    const container = document.querySelector('.container');
    const grid = document.querySelector('.grid');
    const miniGrid = document.querySelector('.mini-grid');
    const nextMiniGrid = document.querySelector('.next-mini-grid');
    const navbar = document.querySelector('.navbar');
    const leftControl = document.querySelector('#left');
    const rightControl = document.querySelector('#right');
    const downControl = document.querySelector('#down');
    const ccwControl = document.querySelector('#counterclockwise');
    const cwControl = document.querySelector('#clockwise');
    const upFont = document.querySelector('.upFont')
    const leftFont = document.querySelector('.leftFont');
    const rightFont = document.querySelector('.rightFont');
    const downFont = document.querySelector('.downFont');
    const rightCwFont = document.querySelector('.rightClockwiseFont')
    const leftCcwFont = document.querySelector('.leftCcwFont');
    const hardDropControl = document.querySelector('#hardDrop');
    const modalHeader = document.querySelector('.modal-header');
    const backgroundBtns = document.querySelectorAll('.backgroundBtn');
    const controlBtns = document.querySelectorAll('.controlBtn');
    const fontBtns = document.querySelectorAll('.fontButton');
    const widthBtn = document.querySelector('.widthButton')
    const widthBtns = document.querySelectorAll('.widthButton')
    const presetBtns = document.querySelectorAll('.presetBtn');
    const controlDisplay = document.querySelector('#controlDisplay')
    const fallRangeInput = document.querySelector('#fallSpeedInput');
    const amtPuyoInput = document.querySelector('#amtPuyoInput');
    const buttonContainer = document.getElementById("boardWidthContainer");
    const altButton = document.querySelector('#altControls');
    const defaultButton = document.querySelector('#defaultControls');
    const formCheck = document.querySelectorAll('.form-check-input');
    const speedUpToggle = document.querySelector('#speedUpToggle')
    const ghostPuyoToggle = document.querySelector('#ghostPuyoToggle')
    const rangeSliders = document.querySelectorAll('.form-range');
    const voiceBtns = document.querySelectorAll('.voiceBtn');
    const resetBtn = document.querySelector('.reset-btn');
    window.secondaryGrid = document.querySelector('.secondary-grid');
    let secondarySquares = Array.from(document.querySelectorAll('.secondary-grid div'));
    let ghostGrid = document.querySelector('.ghost-grid');
    window.tiles = Array.from(document.querySelectorAll('.tile-container div'))

    let activeColor = "#0d6efd"; // Current color theme choice

    // Tracks whether the respective font is active
    window.isEmojiFont = true;
    window.isFriendFont = false;
    window.isDukeFont = false;

    // Allows only one background button to be highlighted at once
    backgroundBtns.forEach(button => {
        button.addEventListener('click', () => {
            backgroundBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.style.backgroundColor = "";
            });
    
            button.style.backgroundColor = activeColor;
            button.classList.add('active');
        });
    });

    // Allows only one font button to be highlighted at once
    fontBtns.forEach(button => {
        button.addEventListener('click', () => {
            fontBtns.forEach(btn => {
                btn.classList.remove('active')
                btn.style.backgroundColor = "";
            });

            button.style.backgroundColor = activeColor;
            button.classList.add('active');
        });
    });

    // Allows only one width button to be highlighted at once
    widthBtns.forEach(button => {
        button.addEventListener('click', () => {
            widthBtns.forEach(btn => {
                btn.classList.remove('active')
                btn.style.backgroundColor = "";
            });

            button.style.backgroundColor = activeColor;
            button.classList.add('active');
        });
    });

    // Allows only one difficulty button to be highlighted at once
    presetBtns.forEach(button => {
        button.addEventListener('click', () => {
            presetBtns.forEach(btn => {
                btn.classList.remove('active')
                btn.style.backgroundColor = "";
            });

            button.style.backgroundColor = activeColor;
            button.classList.add('active');
        });
    });

    // Allows only one voice button to be highlighted at once
    voiceBtns.forEach(button => {
        button.addEventListener('click', () => {
            voiceBtns.forEach(btn => {
                btn.classList.remove('active')
                btn.style.backgroundColor = "";
            });

            button.style.backgroundColor = activeColor;
            button.classList.add('active');
        });
    });

    // Allows the fall speed display to change on input
    $("#fallSpeedInput").on("change input", function() {
        fallSpeed = $(this).val(); // Changes the fall speed to the chosen value
        moveDownInterval = fallSpeed * 0.06;
        originalFallSpeed = fallSpeed;
        var dividedValue = fallSpeed / 1000; // Fall speed in seconds
        if (dividedValue == 1) {
            $("#fallSpeedValue").text(dividedValue + " second per grid space (default)");
        } else {
        $("#fallSpeedValue").text(dividedValue + " seconds per grid space");
        }
    })

    // Allows the puyo pop display to change on input
    $("#puyoPopInput").on("change input", function() {
        puyosToPop = $(this).val(); // Changes the amount of puyos required to clear to the chosen value
        if (puyosToPop == 4) {
            $("#puyoPopValue").text(puyosToPop + " puyos to pop (default)");
        } else {
            $("#puyoPopValue").text(puyosToPop + " puyos to pop");
        }
    })

    // Allows the range display to change on input
    $("#amtPuyoInput").on("change input", function() {
        amountOfColors = $(this).val(); // Changes the amount of colors that appear to the chosen value
        if (amountOfColors == 1) {
            $("#amtPuyoValue").text(amountOfColors + " color");
        } else if (amountOfColors == 4) {
            $("#amtPuyoValue").text(amountOfColors + " different colors (default)");
        } else {
        $("#amtPuyoValue").text(amountOfColors + " different colors");
        }
        // Assures amount of colors is up to date with the choice
        random = Math.floor(Math.random()*amountOfColors);
        randomSecondary = Math.floor(Math.random()*amountOfColors);
    })

    window.height = 14; // Height of the playable grid
    let secondaryHeight = 12; // Height of the secondary grid
    window.isGhostEnabled = true;
    
    // Changes the grid width to the chosen value
    function widthChange(chosen, thisChosen) {
        chosenWidth = chosen; // Get the width from the button's data attribute
        let widthDif = width - chosenWidth; // Difference between old and new width

        upNext.style.marginLeft = chosenWidth * 6 + 20 + "vh"; // Adjusts position of upnext text based on grid width
        startBtn.style.width = chosenWidth * 6.1 + 'vh'; // Adjusts width of the start button based on grid width

        // Updates the widths for all grids affected
        grid.style.width = `${chosenWidth * 6.1 + 2.71}vh`; 
        pauseOverlay.style.width = `${chosenWidth * 6.1}vh`;
        secondaryGrid.style.width = `${chosenWidth * 6.1}vh`;
        ghostGrid.style.width = `${chosenWidth * 6.1}vh`;

        // Adjust taken squares and grid differences as needed
        let amtOftaken = [];
        let amtOfAbove = [];
        let gridDif = squares.length - (chosenWidth * height); // Difference in grid spaces for the grid
        let secondaryGridDif = secondarySquares.length - (chosenWidth * secondaryHeight);

        // Adds the # of taken grid spaces to the array
        squares.forEach(index => {
            if (index.classList.contains("taken")) {
                amtOftaken.push(index);
            }
        });

        // Adds the # of taken grid spaces to the array
        squares.forEach(index => {
            if (index.classList.contains("aboveGrid")) {
                amtOfAbove.push(index);
            }
        });

        secondarySquares.forEach(index => index.classList.remove('xMark'));

        let oldWidthDif = widthDif; // For iterating through taken

        // Continue if the chosen grid size is less than the previous grid size
        if (chosenWidth < width) {

            squares = Array.from(document.querySelectorAll('.grid div')); // Update squares
            // Remove elements from the above array until they equal the width
            squares.slice().reverse().forEach(index => {
                console.log("above grid called")
                const $newDiv = $("<div></div>");
                console.log("current index classlist: ", index.classList)
                console.log("amtOfAbove length: ", amtOfAbove.length)
                if (index.classList.contains("aboveGrid") && (amtOfAbove.length > chosenWidth)) {
                    console.log("above grid removed")
                    const firstIndex = amtOfAbove.shift();
                    amtOfAbove.push(firstIndex);
                    index.parentNode.appendChild($newDiv[0], index);
                    index.classList.remove('aboveGrid');
                    amtOfAbove.length--;
                    widthDif--;
                }
            });

            // Remove elements from the taken array until they equal the width
            amtOftaken.forEach((index) => {
                if (oldWidthDif > 0) {
                    index.remove();
                    oldWidthDif--;
                    widthDif++;
                }
            });

            // Remove grid divs until the proper amount has been reached
            squares.slice().reverse().forEach(index => {
                if (index.classList.contains("taken") || 
                index.classList.contains("aboveGrid") || 
                !(gridDif > (widthDif))) return;
                    index.remove();
                    widthDif++; 
            });

            // If there are any more grid divs left over, remove them
            squares = Array.from(document.querySelectorAll('.grid div'));
            squares.forEach((square, index) => {
                if (index >= chosenWidth * height) {
                    square.remove();
                }
            });

            // Update the secondary grid accordingly
            while (secondaryGridDif !== 0) {
                secondarySquares[secondaryGridDif].remove();
                secondaryGridDif--;
            }

            secondarySquares = Array.from(document.querySelectorAll('.secondary-grid div')); // Update secondary grid

            // Remove grid spaces from ghost grid
            ghostSquares.forEach(div => div.remove());

            ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div')); // Update ghost grid

            // Add appropriate amount of spaces back to ghost grid
            while (ghostSquares.length < secondarySquares.length) {
                const $newDiv = $("<div>");

                ghostGrid.appendChild($newDiv[0]);
                ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div'));
            }
            ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div'));
        }

        // If the chosen grid size is greater than the default, continue
        if (chosenWidth > width) {
            let amtOfDivs = [];
            squares.forEach(index => {
                if (index.classList.contains('aboveGrid') || index.classList.contains('taken')) {
                    index.remove();
                }
            })

            squares = Array.from(document.querySelectorAll('.grid div')); // Update squares

            amtOfDivs = [];
            let oldSquares = [];
            while (amtOfDivs.length < (chosenWidth*height - (chosenWidth*2 + squares.length))) {
                const $newDiv = $("<div>")
                squares[0].parentNode.appendChild($newDiv[0], squares[0])
                amtOfDivs.push($newDiv[0])
                oldSquares.push($newDiv[0])
                }

            // Adds above grid divs to the squares array
            squares = Array.from(document.querySelectorAll('.grid div'));
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
        
            // Update the secondary grid spaces
            while (secondaryGridDif !== 0)  {
                const $newDiv = $("<div>")
                secondarySquares[0].parentNode.appendChild($newDiv[0], secondarySquares[0]);
                secondaryGridDif++;
            }

            secondarySquares = Array.from(document.querySelectorAll('.secondary-grid div'));

            ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div'));

            // Update the ghost grid spaces
            while (ghostSquares.length < secondarySquares.length)  {
                const $newDiv = $("<div>")
                ghostGrid.appendChild($newDiv[0]);
                ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div'));
            }
        }
        if (isFriendFont) {
            document.querySelectorAll('.grid div').forEach((puyo) => {
                puyo.classList.add('showFriends');
                puyo.classList.remove('showDuke');
            });
        } else if (isDukeFont){
            document.querySelectorAll('.grid div').forEach((puyo) => {
                puyo.classList.remove('showFriends'); 
                puyo.classList.add('showDuke');
            });
        } else {
            document.querySelectorAll('.grid div').forEach((puyo) => {
                puyo.classList.remove('showFriends', 'showDuke'); 
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
        secondarySquares = Array.from(document.querySelectorAll('.secondary-grid div'));
        ghostSquares = Array.from(document.querySelectorAll('.ghost-grid div'));
        ghostGrid = document.querySelector('.ghost-grid');
        current = puyo[currentRotation].map(Number); // Assure all elements are numbers
        width = +width;
        currentPosition = Math.ceil(width / 2 - 1);
        deathPoint = Math.ceil(width / 2 - 1) + width;
        if (width == 1) {
            currentPosition = 0;
            deathPoint = 1;
        }
        secondarySquares[deathPoint - width].classList.add('xMark');

        $(".widthButton").removeClass("active");  // Removes 'active' from all buttons
        thisChosen.addClass("active"); // Adds 'active' to the clicked button
    }

    // Allows the grid width to be changed when clicking the corresponding button
    $("#boardWidthContainer").on("click", ".widthButton", function () {
        widthChange($(this).data("width"), $(this));
    });

    // Returns the puyos to their default font before the images
    document.getElementById('showEmoji').addEventListener('click', () => {
        displayShape();
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.remove('showFriends'); 
            puyo.classList.remove('showDuke');
        });
        document.querySelectorAll('.puyoBlob').forEach((puyo) => {
            puyo.classList.remove('showFriends');
            puyo.classList.remove('showDuke');
        });
        isEmojiFont = true;
        isFriendFont = false;
        isDukeFont = false;

        const puyoFonts = [
            "redBack",
            "greenBack",
            "blueBack",
            "yellowBack",
            "purpleBack",
            "tealBack",
            "pinkBack"
        ]

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].classList.remove('showFriends');
            tiles[i].classList.remove('showDuke');
        }
    });

    // Replaces the default font with images
    document.getElementById('showFriends').addEventListener('click', () => {
        displayShape();
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.add('showFriends');
            document.querySelectorAll('.puyoBlob').forEach((puyo) => {
                puyo.classList.add('showFriends');
            });
        });
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.remove('showDuke');
        });
        document.querySelectorAll('.puyoBlob').forEach((puyo) => {
            puyo.classList.remove('showDuke');
        });
        isEmojiFont = false;
        isFriendFont = true;
        isDukeFont = false;

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].classList.add('showFriends');
            tiles[i].classList.remove('showDuke');
        }
    });

    // Returns the puyos to their default font before the images
    document.getElementById('showDuke').addEventListener('click', () => {
        displayShape();
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.add('showDuke');
            document.querySelectorAll('.puyoBlob').forEach((puyo) => {
                puyo.classList.add('showDuke');
            });
        });
        document.querySelectorAll('.grid div').forEach((puyo) => {
            puyo.classList.remove('showFriends'); 
        });
        document.querySelectorAll('.puyoBlob').forEach((puyo) => {
            puyo.classList.remove('showFriends');
        });
        isEmojiFont = false;
        isFriendFont = false;
        isDukeFont = true;

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].classList.remove('showFriends');
            tiles[i].classList.add('showDuke');
        }
    });

    // Changes the background to green when clicked
    $(".backGroundBtn").on("click", "#greenBackground", function (event) {
        event.preventDefault();

        // Changes the grids an navbar backgrounds to green gradient
        secondaryGrid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        miniGrid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        nextMiniGrid.style.background = "radial-gradient(#4eb760, rgb(27, 78, 41))"
        navbar.style.background = "linear-gradient(to top, rgb(16, 72, 31), rgb(37, 201, 59))"
        modalHeader.style.background = "linear-gradient(to top, rgb(16, 72, 31), rgb(37, 201, 59))"
        custom.style.backgroundColor = "rgb(37, 201, 59)"
        activeColor = "rgb(37, 201, 59)"
        formCheck.forEach(checkBox => {
            if (checkBox.checked) {
                checkBox.style.backgroundColor = activeColor;
                checkBox.style.borderColor = activeColor;
            } else {
                checkBox.style.backgroundColor = "";
                checkBox.style.borderColor = "";
            }
        })

        // Changes the color of the range slider thumbs
        rangeSliders.forEach(slider => {
            slider.style.setProperty('--thumb-color', activeColor);
        })

        // Ensures the control buttons retain the color theme when the hotkey is pressed
        if (areControlsFlipped)
            altButton.style.backgroundColor = activeColor;
        else 
            defaultButton.style.backgroundColor = activeColor;

        // Makes sure all the active buttons update accordingly
        presetBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(37, 201, 59)";
        });
        backgroundBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(37, 201, 59)";
        });
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(37, 201, 59)";
        });
        fontBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(37, 201, 59)";
        });
        widthBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(37, 201, 59)";
        });
        voiceBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(37, 201, 59)";
        });

        // Changes the background detail back to default
        // secondaryGrid.style.setProperty('--font-family', '"Font Awesome 6 Free"');
        // secondaryGrid.style.setProperty('--before-font-size', '100px');
        // secondaryGrid.style.setProperty('--before-color', 'white');
        // secondaryGrid.style.setProperty('--before-opacity', '30%');
        // secondaryGrid.style.setProperty('--before-content', '"\\f005"');
    })

    // Changes the background to red when clicked
    $(".backGroundBtn").on("click", "#redBackground", function (event) {
        event.preventDefault();

        // Changes the grids an navbar backgrounds to red gradient
        secondaryGrid.style.background = "radial-gradient(#d48f8f, rgb(121, 0, 0))"
        miniGrid.style.background = "radial-gradient(#d48f8f, rgb(121, 0, 0))"
        nextMiniGrid.style.background = "radial-gradient(#d48f8f, rgb(121, 0, 0))"
        navbar.style.background = "linear-gradient(to top, rgb(103, 23, 23), rgb(255, 30, 30))"
        modalHeader.style.background = "linear-gradient(to top, rgb(103, 23, 23), rgb(255, 30, 30))"
        custom.style.backgroundColor = "rgb(255, 30, 30)"
        activeColor = "rgb(255, 30, 30)"
        formCheck.forEach(checkBox => {
            if (checkBox.checked) {
                checkBox.style.backgroundColor = activeColor;
                checkBox.style.borderColor = activeColor;
            } else {
                checkBox.style.backgroundColor = "";
                checkBox.style.borderColor = "";
            }
        })

        // Changes the color of the range slider thumbs
        rangeSliders.forEach(slider => {
            slider.style.setProperty('--thumb-color', activeColor);
        })

        // Ensures the control buttons retain the color theme when the hotkey is pressed
        if (areControlsFlipped)
            altButton.style.backgroundColor = activeColor;
        else 
            defaultButton.style.backgroundColor = activeColor;

        // Makes sure all the active buttons update accordingly
        presetBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(255, 30, 30)";
        });
        backgroundBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(255, 30, 30)";
        });
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(255, 30, 30)";
        });
        fontBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(255, 30, 30)";
        });
        widthBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(255, 30, 30)";
        });
        voiceBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(255, 30, 30)";
        });

        // Changes the background detail back to default
        // secondaryGrid.style.setProperty('--font-family', '"Font Awesome 6 Free"');
        // secondaryGrid.style.setProperty('--before-font-size', '100px');
        // secondaryGrid.style.setProperty('--before-color', 'white');
        // secondaryGrid.style.setProperty('--before-opacity', '30%');
        // secondaryGrid.style.setProperty('--before-content', '"\\f005"');
    })

    // Changes the background to purple and changes the background icon to "Elias" in comic sans when clicked
    $(".backGroundBtn").on("click", "#purpleBackground", function (event) {
        event.preventDefault(); 

        // Changes the grids an navbar backgrounds to purple gradient
        secondaryGrid.style.background = "radial-gradient(#c489ff, rgb(76, 30, 98))"
        miniGrid.style.background = "radial-gradient(#c489ff, rgb(76, 30, 98))"
        nextMiniGrid.style.background = "radial-gradient(#c489ff, rgb(76, 30, 98))"
        navbar.style.background = "linear-gradient(to top, rgb(54, 17, 72), rgb(183, 60, 255))"
        modalHeader.style.background = "linear-gradient(to top, rgb(54, 17, 72), rgb(183, 60, 255))"
        custom.style.backgroundColor = "rgb(183, 60, 255)"
        activeColor = "rgb(183, 60, 255)"
        formCheck.forEach(checkBox => {
            if (checkBox.checked) {
                checkBox.style.backgroundColor = activeColor;
                checkBox.style.borderColor = activeColor;
            } else {
                checkBox.style.backgroundColor = "";
                checkBox.style.borderColor = "";
            }
        });

        // Changes the color of the range slider thumbs
        rangeSliders.forEach(slider => {
            slider.style.setProperty('--thumb-color', activeColor);
        })

        // Ensures the control buttons retain the color theme when the hotkey is pressed
        if (areControlsFlipped)
            altButton.style.backgroundColor = activeColor;
        else 
            defaultButton.style.backgroundColor = activeColor;

        // Makes sure all the active buttons update accordingly
        presetBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(183, 60, 255)";
        });
        backgroundBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(183, 60, 255)";
        });
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(183, 60, 255)";
        });
        fontBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(183, 60, 255)";
        });
        widthBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(183, 60, 255)";
        });
        voiceBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "rgb(183, 60, 255)";
        });

        // Changes the background detail to Elias in comic sans
        // secondaryGrid.style.setProperty('--before-content', '"Elias :)"'); 
        // secondaryGrid.style.setProperty('--before-font-size', '30px'); 
        // secondaryGrid.style.setProperty('--before-color', 'black');
        // secondaryGrid.style.setProperty('--before-opacity', '100%');
        // secondaryGrid.style.setProperty('--font-family', '"Comic Sans MS", cursive, sans-serif');
    })

    // Returns the background back to blue when clicked
    $(".backGroundBtn").on("click", "#blueBackground", function (event) {
        event.preventDefault();

        // Changes the grids an navbar backgrounds to blue gradient
        secondaryGrid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        miniGrid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        nextMiniGrid.style.background = "radial-gradient(#64a2ff, rgb(54, 54, 148))"
        navbar.style.background = "linear-gradient(to top, midnightblue, dodgerblue)"
        modalHeader.style.background = "linear-gradient(to top, midnightblue, dodgerblue)"
        custom.style.backgroundColor = "#0d6efd"
        activeColor = "#0d6efd"
        formCheck.forEach(checkBox => {
            if (checkBox.checked) {
                checkBox.style.backgroundColor = activeColor;
                checkBox.style.borderColor = activeColor;
            } else {
                checkBox.style.backgroundColor = "";
                checkBox.style.borderColor = "";
            }
        });

        // Changes the color of the range slider thumbs
        rangeSliders.forEach(slider => {
            slider.style.setProperty('--thumb-color', activeColor);
        })

        // Ensures the control buttons retain the color theme when the hotkey is pressed
        if (areControlsFlipped)
            altButton.style.backgroundColor = activeColor;
        else 
            defaultButton.style.backgroundColor = activeColor;


        // Makes sure all the active buttons update accordingly
        presetBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "#0d6efd";
        });
        backgroundBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "#0d6efd";
        });
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "#0d6efd";
        });
        fontBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "#0d6efd";
        });
        widthBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "#0d6efd";
        });
        voiceBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = "#0d6efd";
        });

        // Changes the background back to default
        // secondaryGrid.style.setProperty('--font-family', '"Font Awesome 6 Free"');
        // secondaryGrid.style.setProperty('--before-font-size', '100px');
        // secondaryGrid.style.setProperty('--before-color', 'white');
        // secondaryGrid.style.setProperty('--before-opacity', '30%');
        // secondaryGrid.style.setProperty('--before-content', '"\\f005"');
    })

    // Easy difficulty
    $("#presetContainer").on("click", "#easyBtn", function (event) {
        event.preventDefault();
        fallSpeed = 2000;
        moveDownInterval = fallSpeed * 0.06;
        originalFallSpeed = fallSpeed;
        horizontalHoldInterval = 200;
        amountOfColors = 3;
        random = Math.floor(Math.random()*amountOfColors);
        randomSecondary = Math.floor(Math.random()*amountOfColors);
        timeToSpeedUp = 90000;
        remainingTime = timeToSpeedUp;
        isHidingGridEnabled = false;

        // Makes sure active buttons stay the chosen color theme
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = activeColor;
        });

        // Assures adjustments are displayed to the player
        $("#amtPuyoValue").text(amountOfColors + " different colors");
        $("#fallSpeedValue").text(fallSpeed / 1000 + " seconds per grid space");
        fallRangeInput.value = 2000;
        amtPuyoInput.value = 3;
        widthChange(6, $(this))
        widthBtn.value = 6;
        widthBtns.forEach(button => button.classList.remove("active"));
        widthBtns.forEach(button => button.style.backgroundColor = "");

        // Find the button with the specific data-width and add 'active' class
        const targetButton = buttonContainer.querySelector(`.widthButton[data-width="${6}"]`);
        if (targetButton) {
            targetButton.classList.add("active");
        }
        targetButton.style.backgroundColor = activeColor;
    })

    // Normal difficulty
    $("#presetContainer").on("click", "#normalBtn", function (event) {
        event.preventDefault();
        fallSpeed = 1000;
        moveDownInterval = fallSpeed * 0.06;
        originalFallSpeed = fallSpeed;
        horizontalHoldInterval = 100;
        amountOfColors = 4;
        timeToSpeedUp = 90000;
        remainingTime = timeToSpeedUp;
        random = Math.floor(Math.random()*amountOfColors);
        randomSecondary = Math.floor(Math.random()*amountOfColors);
        isHidingGridEnabled = false;

        // Makes sure active buttons stay the chosen color theme
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = activeColor;
        });

        // Assures adjustments are displayed to the player
        $("#amtPuyoValue").text(amountOfColors + " different colors (default)");
        $("#fallSpeedValue").text(fallSpeed / 1000 + " second per grid space (default)");
        fallRangeInput.value = 1000;
        amtPuyoInput.value = 4;
        widthChange(6, $(this))
        widthBtn.value = 6;
        widthBtns.forEach(button => button.classList.remove("active"));
        widthBtns.forEach(button => button.style.backgroundColor = "");

        // Find the button with the specific data-width and add 'active' class
        const targetButton = buttonContainer.querySelector(`.widthButton[data-width="${6}"]`);
        if (targetButton) {
            targetButton.classList.add("active");
        }
        targetButton.style.backgroundColor = activeColor;
    })

    // Hard difficulty
    $("#presetContainer").on("click", "#hardBtn", function (event) {
        event.preventDefault();
        fallSpeed = 800;
        moveDownInterval = fallSpeed * 0.06;
        originalFallSpeed = fallSpeed;
        horizontalHoldInterval = 100;
        amountOfColors = 5;
        timeToSpeedUp = 80000;
        remainingTime = timeToSpeedUp;
        random = Math.floor(Math.random()*amountOfColors);
        randomSecondary = Math.floor(Math.random()*amountOfColors);
        isHidingGridEnabled = true;

        // Makes sure active buttons stay the chosen color theme
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = activeColor;
        });

        // Assures adjustments are displayed to the player
        $("#amtPuyoValue").text(amountOfColors + " different colors");
        $("#fallSpeedValue").text(fallSpeed / 1000 + " seconds per grid space");
        fallRangeInput.value = 800;
        amtPuyoInput.value = 5;
        widthChange(6, $(this))
        widthBtn.value = 6;
        widthBtns.forEach(button => button.classList.remove("active"));
        widthBtns.forEach(button => button.style.backgroundColor = "");

        // Find the button with the specific data-width and add 'active' class
        const targetButton = buttonContainer.querySelector(`.widthButton[data-width="${6}"]`);
        if (targetButton) {
            targetButton.classList.add("active");
        }
        targetButton.style.backgroundColor = activeColor;
    })

    // Insane difficulty
    $("#presetContainer").on("click", "#insaneBtn", function (event) {
        event.preventDefault();
        fallSpeed = 700;
        moveDownInterval = fallSpeed * 0.06;
        originalFallSpeed = fallSpeed;
        horizontalHoldInterval = 100;
        amountOfColors = 6;
        timeToSpeedUp = 75000;
        remainingTime = timeToSpeedUp;
        random = Math.floor(Math.random()*amountOfColors);
        randomSecondary = Math.floor(Math.random()*amountOfColors);
        isHidingGridEnabled = true;

        // Makes sure active buttons stay the chosen color theme
        controlBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = activeColor;
        });

        // Assures adjustments are displayed to the player
        $("#amtPuyoValue").text(amountOfColors + " different colors");
        $("#fallSpeedValue").text(fallSpeed / 1000 + " seconds per grid space");
        fallRangeInput.value = 700;
        amtPuyoInput.value = 6;
        widthChange(6, $(this))
        widthBtn.value = 6;
        widthBtns.forEach(button => button.classList.remove("active"));
        widthBtns.forEach(button => button.style.backgroundColor = "");

        // Find the button with the specific data-width and add 'active' class
        const targetButton = buttonContainer.querySelector(`.widthButton[data-width="${6}"]`);
        if (targetButton) {
            targetButton.classList.add("active");
        }
        targetButton.style.backgroundColor = activeColor;
    })

    let areControlsFlipped = false; // Tracks if the controls are using the flipped scheme

    // Changes the controls back to default scheme
    $("#controlContainer").on("click", "#defaultControls", function (event) {
        event.preventDefault();
        event.stopPropagation();
        defaultControls();
        areControlsFlipped = false;
        controlBtns.forEach(btn => {
            btn.classList.remove('active')
            btn.style.backgroundColor = "";
            defaultButton.style.backgroundColor = activeColor;
        });
    })

    // Changes the controls to the default
    function defaultControls() {

        // Key bindings to move down
        moveDownBindings = {
            "s": sharedMoveDownCurrent,
            "S": sharedMoveDownCurrent,
            "ArrowDown": sharedMoveDownCurrent,
        };

        // Key bindings to move left/right
        horizontalBindings = {
            "ArrowRight": sharedMoveRight,
            "ArrowLeft": sharedMoveLeft,
        }

        // Key bindings that are not able to be held
        nonHoldBindings = {
            "a": sharedRotateLeft,
            "A": sharedRotateLeft,
            "z": sharedRotateLeft,
            "Z": sharedRotateLeft,
            "d": sharedRotateRight,
            "D": sharedRotateRight,
            "ArrowUp": sharedRotateRight,
            " ": sharedHardDrop
        }

        window.resetBindings = {
            "r": reset,
            "R": reset
        }

        leftFont.style.display = "contents";
        leftControl.innerHTML = "";
        rightFont.style.display = "contents"
        rightControl.innerHTML = "";
        downFont.style.display = "contents"
        downControl.innerHTML = "S";
        leftCcwFont.style.display = "none"
        ccwControl.innerHTML = "Z, A";
        upFont.style.display = "contents"
        rightCwFont.style.display = "none"
        cwControl.innerHTML = "D";
        hardDropControl.innerHTML = "Space";
        container.style.left = "7vh"
    }

    // Changes the controls to flipped scheme
    $("#controlContainer").on("click", "#altControls", function (event) {
        event.preventDefault();
        event.stopPropagation();
        flippedControls();
        areControlsFlipped = true;
        controlBtns.forEach(btn => {
            btn.classList.remove('active')
            btn.style.backgroundColor = "";
            altButton.style.backgroundColor = activeColor;
        });
    })

    // Hotkey for toggling controls
    document.addEventListener('keydown', (e) => {
        if ((e.key === "F" || e.key === "f") && !areControlsFlipped) {
            flippedControls();
            areControlsFlipped = true;
            controlBtns.forEach(btn => {
                btn.classList.remove('active')
                btn.style.backgroundColor = "";
                altButton.style.backgroundColor = activeColor;
            });

        } else if ((e.key === "F" || e.key === "f") && areControlsFlipped) {
            defaultControls();
            areControlsFlipped = false;
            controlBtns.forEach(btn => {
                btn.classList.remove('active')
                btn.style.backgroundColor = "";
                defaultButton.style.backgroundColor = activeColor;
            });
        }
    });

    // Switches to the flipped control scheme
    function flippedControls() {

        // Key bindings to move down
        moveDownBindings = {
            "s": sharedMoveDownCurrent,
            "S": sharedMoveDownCurrent,
        };

        // Key bindings to move left/right
        horizontalBindings = {
            "a": sharedMoveLeft,
            "A": sharedMoveLeft,
            "d": sharedMoveRight,
            "D": sharedMoveRight,
        }

        // Key bindings that are not able to be held
        nonHoldBindings = {
            "ArrowRight": sharedRotateRight,
            "ArrowLeft": sharedRotateLeft,
            "ArrowUp": sharedRotateRight,
            "ArrowDown": sharedRotateLeft,
            "w": sharedHardDrop,
            "W": sharedHardDrop,
        }

        window.resetBindings = {
            "r": reset,
            "R": reset
        }

        leftFont.style.display = "none";
        leftControl.innerHTML = "A";
        rightFont.style.display = "none"
        rightControl.innerHTML = "D";
        downFont.style.display = "none"
        downControl.innerHTML = "S";
        leftCcwFont.style.display = "contents"
        ccwControl.innerHTML = "";
        upFont.style.display = "none"
        rightCwFont.style.display = "contents"
        cwControl.innerHTML = "";
        hardDropControl.innerHTML = "W";
        container.style.left = "5.93vh"
    }

    // Allows speeding up to be turned on and off
    speedUpToggle.addEventListener('change', function() {
        if (speedUpToggle.checked) {
            isSpeedUpEnabled = true;
            speedUpToggle.style.backgroundColor = activeColor;
            speedUpToggle.style.borderColor = activeColor;
        } else {
            isSpeedUpEnabled = false;
            speedUpToggle.style.backgroundColor = "";
            speedUpToggle.style.borderColor = "";
        }
    });

    // Allows ghost puyos to be turned on and off
    ghostPuyoToggle.addEventListener('change', function() {
        if (ghostPuyoToggle.checked) {
            isGhostEnabled = true;
            ghostPuyoToggle.style.backgroundColor = activeColor;
            ghostPuyoToggle.style.borderColor = activeColor;
        } else {
            isGhostEnabled = false;
            ghostPuyoToggle.style.backgroundColor = "";
            ghostPuyoToggle.style.borderColor = "";
        }
    });

    window.isJosh = true; // Tracks whether Josh's lines are active
    window.isBritMicah = false; // Tracks whether micah's lines are active
    window.isSouthMicah = false;

    // Changes the voice lines to Josh's
    $(".voiceButtons").on("click", "#joshVoice", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        isJosh = true;
        isBritMicah = false
        isSouthMicah = false
        window.spells.splice(0, spells.length,
            { url: 'josh-spells/1.mp3', volume: 1.0 },
            { url: 'josh-spells/2.mp3', volume: 1.0 },
            { url: 'josh-spells/3.mp3', volume: 1.0 }, 
            { url: 'josh-spells/4.mp3', volume: 1.0 },
            { url: 'josh-spells/5.mp3', volume: 1.0 },
            { url: 'josh-spells/6.mp3', volume: 1.0 },
            { url: 'josh-spells/7.mp3', volume: 1.0 }
        );

        // Cache the new sound
        for (const spell of spells) {
            await loadAndCacheSound(spell.url);
        }

        voiceBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = activeColor;
        });
    })

    // Changes the voice lines to British Micah's
    $(".voiceButtons").on("click", "#britMicah", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        isJosh = false;
        isBritMicah = true
        isSouthMicah = false
        window.spells.splice(0, spells.length,
            { url: 'british-micah-spells/1.mp3', volume: 3.0 },
            { url: 'british-micah-spells/2.mp3', volume: 3.0 },
            { url: 'british-micah-spells/3.mp3', volume: 3.0 }, 
            { url: 'british-micah-spells/4.mp3', volume: 3.0 },
            { url: 'british-micah-spells/5.mp3', volume: 3.0 },
            { url: 'british-micah-spells/6.mp3', volume: 3.0 },
            { url: 'british-micah-spells/7.mp3', volume: 3.0 },
        );

        // Cache the new sound
        for (const spell of spells) {
            await loadAndCacheSound(spell.url);
        }

        voiceBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = activeColor;
        });
    })

    // Changes the voice lines to Southern Micah's
    $(".voiceButtons").on("click", "#southMicah", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        isJosh = false;
        isBritMicah = false;
        isSouthMicah = true
        window.spells.splice(0, spells.length,
            { url: 'southern-micah-spells/1.mp3', volume: 1.0 },
            { url: 'southern-micah-spells/2.mp3', volume: 1.0 },
            { url: 'southern-micah-spells/3.mp3', volume: 1.0 }, 
            { url: 'southern-micah-spells/4.mp3', volume: 1.0 },
            { url: 'southern-micah-spells/5.mp3', volume: 1.0 },
            { url: 'southern-micah-spells/6.mp3', volume: 1.0 },
            { url: 'southern-micah-spells/7.mp3', volume: 1.0 },
        );

        // Cache the new sound
        for (const spell of spells) {
            await loadAndCacheSound(spell.url);
        }

        voiceBtns.forEach(button => {
            if (button.classList.contains('active'))
                button.style.backgroundColor = activeColor;
        });
    })

    // Resets the game when clicked
    resetBtn.addEventListener('click', () => {
        reset();
    });
})