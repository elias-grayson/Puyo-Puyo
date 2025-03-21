/* This document controls sounds and voice lines when chaining */
document.addEventListener('DOMContentLoaded', async () => {

    const soundTestOpener = document.querySelector('#soundTestOpener'); // Button that opens the sound test
    const joshSTBtn = document.querySelector('.josh-test-btn'); // Container for Josh's voice lines

    window.voiceEnabled = true;

    // Josh's spell clips, enabled by default
    window.spells = [
        { url: 'josh-spells/1.mp3', volume: 1.0 },
        { url: 'josh-spells/2.mp3', volume: 1.0 },
        { url: 'josh-spells/3.mp3', volume: 1.0 }, 
        { url: 'josh-spells/4.mp3', volume: 1.0 },
        { url: 'josh-spells/5.mp3', volume: 1.0 },
        { url: 'josh-spells/6.mp3', volume: 1.0 },
        { url: 'josh-spells/7.mp3', volume: 1.0 }
    ];

    // All of Josh's voice lines
    window.joshLines = [
        { url: 'josh-spells/1.mp3', volume: 1.0 },
        { url: 'josh-spells/2.mp3', volume: 1.0 },
        { url: 'josh-spells/3.mp3', volume: 1.0 }, 
        { url: 'josh-spells/4.mp3', volume: 1.0 },
        { url: 'josh-spells/5.mp3', volume: 1.0 },
        { url: 'josh-spells/6.mp3', volume: 1.0 },
        { url: 'josh-spells/7.mp3', volume: 1.0 }
    ];

    // All of Michael's voice lines
    window.michaelLines = [
        { url: 'michael-spells/1.mp3', volume: 1.5 },
        { url: 'michael-spells/2.mp3', volume: 1.5 },
        { url: 'michael-spells/3.mp3', volume: 1.0 }, 
        { url: 'michael-spells/4.mp3', volume: 1.0 },
        { url: 'michael-spells/5.mp3', volume: 1.0 },
        { url: 'michael-spells/6.mp3', volume: 1.2 },
        { url: 'michael-spells/7.mp3', volume: 1.2 },
        // { url: 'michael-spells/counter.mp3', volume: 1.0 },
        { url: 'michael-spells/all-clear.mp3', volume: 1.0 },
        { url: 'michael-spells/char-select.mp3', volume: 1.0 },
        // { url: 'michael-spells/light-damage.mp3', volume: 1.0 },
        // { url: 'michael-spells/heavy-damage.mp3', volume: 1.0 },
        // { url: 'michael-spells/win.mp3', volume: 1.0 },
        // { url: 'michael-spells/win-josh.mp3', volume: 1.0 },
        { url: 'michael-spells/lose.mp3', volume: 1.0 },
        // { url: 'michael-spells/lose-josh.mp3', volume: 1.0 }
    ];

    // All of British Micah's voice lines
    window.britMicahLines = [
        { url: 'british-micah-spells/1.mp3', volume: 4.0 },
        { url: 'british-micah-spells/2.mp3', volume: 4.0 },
        { url: 'british-micah-spells/3.mp3', volume: 4.0 }, 
        { url: 'british-micah-spells/4.mp3', volume: 4.0 },
        { url: 'british-micah-spells/5.mp3', volume: 4.0 },
        { url: 'british-micah-spells/6.mp3', volume: 4.0 },
        { url: 'british-micah-spells/7.mp3', volume: 4.0 },
        { url: 'british-micah-spells/all-clear.mp3', volume: 1.0 },
        { url: 'british-micah-spells/char-select.mp3', volume: 0.5 },
        // { url: 'british-micah-spells/light-damage.mp3', volume: 1.0 },
        // { url: 'british-micah-spells/heavy-damage.mp3', volume: 1.0 },
        // { url: 'british-micah-spells/win.mp3', volume: 1.0 },
        // { url: 'british-micah-spells/win-josh.mp3', volume: 1.0 },
        { url: 'british-micah-spells/lose.mp3', volume: 0.5 },
        // { url: 'british-micah-spells/lose-josh.mp3', volume: 1.0 }
    ];

    // All of Southern Micah's voice lines
    window.southMicahLines = [
        { url: 'southern-micah-spells/1.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/2.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/3.mp3', volume: 1.0 }, 
        { url: 'southern-micah-spells/4.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/5.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/6.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/7.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/all-clear.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/char-select.mp3', volume: 0.6 },
        // { url: 'southern-micah-spells/light-damage.mp3', volume: 1.0 },
        // { url: 'southern-micah-spells/heavy-damage.mp3', volume: 1.0 },
        // { url: 'southern-micah-spells/win.mp3', volume: 1.0 },
        // { url: 'southern-micah-spells/win-josh.mp3', volume: 1.0 },
        { url: 'southern-micah-spells/lose.mp3', volume: 0.5 },
        // { url: 'southern-micah-spells/lose-josh.mp3', volume: 1.0 }
    ];

    // All of Kelvin's voice lines
    window.kelvinLines = [
        { url: 'kelvin-lines/1s.mp3', volume: 1.4 },
        { url: 'kelvin-lines/2.mp3', volume: 1.6 },
        { url: 'kelvin-lines/3.mp3', volume: 1.0 }, 
        { url: 'kelvin-lines/4s.mp3', volume: 1.0 },
        { url: 'kelvin-lines/5s.mp3', volume: 1.6 },
        { url: 'kelvin-lines/6.mp3', volume: 1.4 },
        { url: 'kelvin-lines/7.mp3', volume: 1.5 },
        // { url: 'kelvin-lines/counter.mp3', volume: 1.0 },
        { url: 'kelvin-lines/all-clear.mp3', volume: 1.0 },
        { url: 'kelvin-lines/char-select-1.mp3', volume: 1.0 },
        // { url: 'kelvin-lines/light-damage.mp3', volume: 1.0 },
        // { url: 'kelvin-lines/heavy-damage.mp3', volume: 1.0 },
        // { url: 'kelvin-lines/win.mp3', volume: 1.0 },
        // { url: 'kelvin-lines/win-josh.mp3', volume: 1.0 },
        { url: 'kelvin-lines/lose.mp3', volume: 1.0 },
        // { url: 'kelvin-lines/lose-josh.mp3', volume: 1.0 }
    ];

    window.soundEffects = [
        { url: 'game-sounds/arcade-ui-5.mp3', volume: 0.5 }, // Pause
        { url: 'game-sounds/arcade-ui-14.mp3', volume: 0.5 }, // Resume
        { url: 'game-sounds/arcade-ui-17.mp3', volume: 0.35 }, // Reset
        { url: 'game-sounds/cute-level-up-2.mp3', volume: 0.5 }, // Speed up
        { url: 'game-sounds/all-clear.mp3', volume: 0.4 }, // All clear
        { url: 'game-sounds/error-10.mp3', volume: 0.3 }, // Game over
        { url: 'game-sounds/Pop!.mp3', volume: 1.0 }, // Reset pop
        { url: 'game-sounds/slide.mp3', volume: 2.0 }, // Rotate
        { url: 'game-sounds/big-bubble-2.mp3', volume: 0.5 }, // Place
        { url: 'game-sounds/thump.mp3', volume: 1.0 }, // Hard drop
        // { url: 'game-sounds/success.mp3', volume: 1.0 } // Win
    ]

    // Countdown sound effects
    window.startSE = [
        { url: 'game-sounds/new-notification-7.mp3', volume: 0.5 },
        { url: 'game-sounds/new-notification-7.mp3', volume: 0.5 }, 
        { url: 'game-sounds/new-notification-7.mp3', volume: 0.5 }, 
        { url: 'game-sounds/new-notification-7.mp3', volume: 0.5 }
    ]

    // Chain sound effects
    window.chainSE = [
        { url: 'game-sounds/coin-pickup.mp3', volume: 0.2 },
        { url: 'game-sounds/coin-pickup.mp3', volume: 0.2 },
        { url: 'game-sounds/coin-pickup.mp3', volume: 0.2 },
        { url: 'game-sounds/coin-pickup.mp3', volume: 0.2 },
        { url: 'game-sounds/coin-pickup.mp3', volume: 0.2 },
        { url: 'game-sounds/coin-pickup.mp3', volume: 0.2 },
        { url: 'game-sounds/coin-pickup.mp3', volume: 0.2 },
    ]

     // Initializes AudioContext
    let audioContext;
    const cachedSounds = {};
    let isAudioInitialized = false;

    // Function to initialize audio context and preload sounds
    async function initializeAudio() {
        if (!isAudioInitialized) {
            // Initialize AudioContext
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            isAudioInitialized = true;
            // Preload sounds
            preloadSpellSounds(spells);
        }
    }

    // Preload and cache all sounds at the start
    window.preloadSpellSounds = async function preloadSpellSounds(soundArray) {
        if (!isAudioInitialized) return;
        if (soundArray == null)
            soundArray = spells;
        for (let i = 0; i < soundArray.length; i++) {
            const sound = soundArray[i];
            await loadAndCacheSound(sound.url);
        }
        // Preload the current pop sound
        await loadAndCacheSound(currentPopSound);
    }

    // Load and cache audio file
    window.loadAndCacheSound = async function loadAndCacheSound(url) {
        if (!isAudioInitialized) return;
        if (cachedSounds[url]) {
            return cachedSounds[url]; // Return the cached sound if already loaded
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        cachedSounds[url] = audioBuffer; // Cache the audio buffer for future use
    }

    // Plays the sound with a specific pitch and volume
    function playSound(url, pitch = 1.0, volume = 0.3) {
        const audioBuffer = cachedSounds[url]; // Get the cached sound

        // Creates a new buffer source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Sets pitch and volume
        source.playbackRate.value = pitch;
        const soundGainNode = audioContext.createGain();
        soundGainNode.gain.value = volume;

        // Connects to destination
        source.connect(soundGainNode);
        soundGainNode.connect(audioContext.destination);

        // Plays the sound
        source.start();
    }

    // Tracks the currently playing spell
    window.currentSpell = null;
    const currentPopSound = 'game-sounds/coin-pickup.mp3'

    // Preloads all sounds as soon as the page loads
    await preloadSpellSounds(spells);

    // Plays the appropriate spell and popping sound based on the chain length
    window.playVoiceLine = function playVoiceLine() {
        let pitch = 0.6 + Math.min(chainLength - 1, 6) * (1/9)

        // Pauses the current voice line if another one is already being played
        if (voiceEnabled) {
            if (currentSpell) {
                currentSpell.stop(); // Stop the current audio
                currentSpell = null; // Reset the reference
            }
        }

        // Sets the appropriate sound based on chain length
        let spell;
        if (chainLength < 7) {
            spell = spells[chainLength - 1];
        } else {
            spell = spells[6];
            pitch = 1.2;
        }

        initializeCurrentSpell(spell);

        // Start the voice line
        if (voiceEnabled)
            currentSpell.start();
        playSound(currentPopSound, pitch); 
    }

    function initializeCurrentSpell(voiceLine) {
        // Create a new buffer source for the voice line
        currentSpell = audioContext.createBufferSource();
        currentSpell.buffer = cachedSounds[voiceLine.url];
        currentSpell.playbackRate.value = 1.0;

        // Volume control for the voice line
        const spellGainNode = audioContext.createGain();
        spellGainNode.gain.value = voiceLine.volume;

        // Connect the source to the gain node and then to the destination
        currentSpell.connect(spellGainNode);
        spellGainNode.connect(audioContext.destination);
    }

    // Wait for user gesture before initializing audio
    document.addEventListener('click', initializeAudio, { once: true });
    document.addEventListener('keydown', initializeAudio, { once: true });

    // Sound for starting the game
    window.playStartSound = async function playStartSound(pitch) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch('game-sounds/new-notification-7.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        source.detune.value = pitch; // Sets pitch
        source.playbackRate.value = 1;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5; // Lowers volume
    
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
    }

    // Function for playing interruptable sounds
    window.playInterruptableSound = async function playInterruptableSound(sound) {
        let playPromise = sound.play();

        if (playPromise !== undefined) {
            playPromise.then(async _ => {
                await sound.pause();
                sound.currentTime = 0;
                sound.play();
            })
        }
    }

    // Ensures sounds are loaded in when the sound test is opened
    soundTestOpener.addEventListener('click', () => {
        preloadSpellSounds(joshLines);
        preloadSpellSounds(michaelLines);
        preloadSpellSounds(britMicahLines);
        preloadSpellSounds(southMicahLines);
        preloadSpellSounds(soundEffects);
        preloadSpellSounds(kelvinLines);
        preloadSpellSounds(startSE);
        preloadSpellSounds(chainSE);
    });

    // Plays appropriate voice line when a button is clicked
    $(".st-btn-container").on('click', '.btn', function () {
        let voiceArrayName = $(this).data("voice");
        let primaryIndex = $(this).data("line") - 1;
        let startIndex = $(this).data("start") - 1;
        let chainIndex = $(this).data("chain") - 1;

        let voiceArray = window[voiceArrayName];
        // console.log("Voice Array Name:", voiceArrayName);
        // console.log("Retrieved Voice Array:", voiceArray);

        if (voiceArray == chainSE) {
            playSound(currentPopSound, verifyPopSound(chainIndex));
            return; 
        } 
        if (voiceArray == startSE) {
            if (startIndex != 2) {
                playStartSound((startIndex*2)*100 - 600)
            } else {
                playStartSound(-100);
            }
            return; 
        }

        let spell = voiceArray[primaryIndex];
        initializeCurrentSpell(spell);

        currentSpell.start();
    });

    function verifyPopSound(index) {
        let popNum = index + 1;

        if (popNum == 7) {
            pitch = 1.2;
        } else {
            pitch = 0.6 + Math.min(popNum - 1, 6) * (1/9);
        }
        return pitch;
    }
})