/* This document handles everything related to the controls of the game */
document.addEventListener('DOMContentLoaded', () => {
    const leftControl = document.querySelector('#left');
    const rightControl = document.querySelector('#right');
    const downControl = document.querySelector('#down');
    const ccwControl = document.querySelector('#counterclockwise');
    const cwControl = document.querySelector('#clockwise');
    const fullRotateControl = document.querySelector('#fullSpin');
    const upFont = document.querySelector('.upFont')
    const leftFont = document.querySelector('.leftFont');
    const rightFont = document.querySelector('.rightFont');
    const downFont = document.querySelector('.downFont');
    const rightCwFont = document.querySelector('.rightClockwiseFont')
    const leftCcwFont = document.querySelector('.leftCcwFont');
    const fullRotateFont = document.querySelector('.upFullFont');
    const hardDropControl = document.querySelector('#hardDrop');
    const keybindButtons = Array.from(document.querySelectorAll('.keybind-button'));
    
    document.addEventListener('keydown', control); // Attaches the control function to the 'keydown' event
    document.addEventListener('keyup', releaseKey); // Attaches the releaseKey function to the 'keyup' event

    const activeHorizontalKeys = new Map(); // Map to track Horizontal keys
    const activeDownKeys = new Map(); // Map to track holdable keys currently held down
    const activeNonHoldKeys = new Set(); // Set to track non-holdable keys currently held down
    const resetKeys = new Set(); // Tracks the reset key
    const moveInterval = 50; // How long before horizontal movement is repeated
    window.moveDownInterval = fallSpeed * 0.06; // How long before downward movement is repeated
    window.horizontalHoldInterval = 100; // How long it takes for the horizontal movement to start repeating
    let isHorKeyReleased = true; // Tracks whether horizontal movement keys have been released

    // Assigns functions to keyCodes
    function control(e) {
        if (!movementStart) return;
    
        // Handles downward key actions
        if (moveDownBindings[e.code]) {
            if (currentRotation == 0 || currentRotation == 2) {
                gracePeriodTimer = 400;
            } else if (currentRotation == 1 || currentRotation == 3) {
                gracePeriodTimer = 300;
            }
            if (!activeDownKeys.has(e.code)) {
                if (!isInputEnabled) return;
                moveDownBindings[e.code]()

                // Start the movement if the key is not already active
                const intervalId = setInterval(() => {
                    if (!isInputEnabled) return;
                    moveDownBindings[e.code]()
                    if (currentRotation == 0 || currentRotation == 2) {
                        gracePeriodTimer = 400;
                    } else if (currentRotation == 1 || currentRotation == 3) {
                        gracePeriodTimer = 300;
                    }
                }, moveDownInterval);
                activeDownKeys.set(e.code, intervalId);
            }
        }

        // Handles horizontal key actions
        if (horizontalBindings[e.code]) {
            if (!activeHorizontalKeys.has(e.code)) {
                let horizontalIntervalId = null // Interval ID for horizontal movement

                // If movement is not being held, move once
                if (!horizontalIntervalId) {
                    horizontalBindings[e.code]();
                    activeHorizontalKeys.set(e.code);
                    isHorKeyReleased = false;
                }
                
                // Start the movement if the key is not already active
                setTimeout(() => {
                    if (isHorKeyReleased) return;
                    horizontalIntervalId = setInterval(() => {
                        if (!isInputEnabled || isHorKeyReleased) return;
                        horizontalBindings[e.code]()
                    }, moveInterval);
                    if (isHorKeyReleased) return;
                    activeHorizontalKeys.set(e.code, horizontalIntervalId);
                }, horizontalHoldInterval) // Starts the movement after held for set amount of time
            }
        }

        // Handles non-holdable key actions
        if (nonHoldBindings[e.code]) {
            if (!activeNonHoldKeys.has(e.code)) {
                if (!isInputEnabled) return;
                nonHoldBindings[e.code]()
                activeNonHoldKeys.add(e.code);
            }
        }

        // Handles reset key
        if (resetBindings[e.code]) {
            if (!resetKeys.has(e.code)) {
                resetBindings[e.code]()
                resetKeys.add(e.code);
            }
        }
    }

    // Makes sure key function are not still activated and allows keys to be pressed again after being released
    function releaseKey(e) {
        // if (!movementStart) return;
        if (activeDownKeys.has(e.code)) {
            clearInterval(activeDownKeys.get(e.code));
            activeDownKeys.delete(e.code);
            gracePeriodTimer = 800;
        }
        if (activeHorizontalKeys.has(e.code)) {
            isHorizontalPressed = true;
            clearInterval(activeHorizontalKeys.get(e.code));
            activeHorizontalKeys.delete(e.code);
            isHorKeyReleased = true;
        }
        if (activeNonHoldKeys.has(e.code)) {
            activeNonHoldKeys.delete(e.code);
        }
        if (resetKeys.has(e.code)) {
            resetKeys.delete(e.code);
        }
    }

    // Changes the controls to the default
    window.defaultControls = function defaultControls() {

        // Key bindings to move down
        moveDownBindings = {
            "KeyS": sharedMoveDownCurrent,
            "ArrowDown": sharedMoveDownCurrent,
        };

        // Key bindings to move left/right
        horizontalBindings = {
            "ArrowRight": sharedMoveRight,
            "ArrowLeft": sharedMoveLeft,
        }

        // Key bindings that are not able to be held; rotation and hard drop
        nonHoldBindings = {
            "KeyA": rotateFull,
            "KeyZ": sharedRotateLeft,
            "KeyD": sharedRotateRight,
            "ArrowUp": sharedRotateRight,
            "Space": sharedHardDrop
        }

        window.resetBindings = {
            "KeyR": reset
        }

        leftFont.style.display = "contents";
        leftControl.innerHTML = "";
        rightFont.style.display = "contents"
        rightControl.innerHTML = "";
        downFont.style.display = "contents"
        downControl.innerHTML = "S";
        leftCcwFont.style.display = "none"
        ccwControl.innerHTML = "Z";
        upFont.style.display = "contents"
        rightCwFont.style.display = "none"
        cwControl.innerHTML = "D";
        hardDropControl.innerHTML = "Space";
        fullRotateControl.innerHTML = "A";
        fullRotateFont.style.display = "none";
    }

    // Switches to the flipped control scheme
    window.flippedControls = function flippedControls() {

        // Key bindings to move down
        moveDownBindings = {
            "KeyS": sharedMoveDownCurrent,
        };

        // Key bindings to move left/right
        horizontalBindings = {
            "KeyA": sharedMoveLeft,
            "KeyD": sharedMoveRight,
        }

        // Key bindings that are not able to be held
        nonHoldBindings = {
            "ArrowRight": sharedRotateRight,
            "ArrowLeft": sharedRotateLeft,
            "ArrowUp": rotateFull,
            "ArrowDown": sharedRotateLeft,
            "KeyW": sharedHardDrop,
        }

        window.resetBindings = {
            "KeyR": reset
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
        fullRotateControl.innerHTML = "";
        fullRotateFont.style.display = "contents";
    }
    defaultControls();


function createBinding() {

}
    keybindButtons.forEach(button => {
        button.addEventListener('click', function () {
            let toastId = this.getAttribute('data-toast-target'); // Get toast ID from button
            let toastEl = document.getElementById(toastId); // Find the toast element
            let toastInstance = new bootstrap.Toast(toastEl); // Create a Bootstrap toast instance
            toastInstance.show(); // Show the toast
        });
    });
});