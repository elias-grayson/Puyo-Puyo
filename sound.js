/* This document controls sounds and voice lines when chaining */
document.addEventListener('DOMContentLoaded', async () => {
    window.voiceEnabled = true;

    // Josh's voice clips
    window.spells = [
        { url: 'josh-spells/1.mp3', volume: 1.0 },
        { url: 'josh-spells/2.mp3', volume: 1.0 },
        { url: 'josh-spells/3.mp3', volume: 1.0 }, 
        { url: 'josh-spells/4.mp3', volume: 1.0 },
        { url: 'josh-spells/5.mp3', volume: 1.0 },
        { url: 'josh-spells/6.mp3', volume: 1.0 },
        { url: 'josh-spells/7.mp3', volume: 1.0 }
    ];

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
            preloadSpellSounds();
        }
    }

    // Preload and cache all sounds at the start
    window.preloadSpellSounds = async function preloadSpellSounds() {
        if (!isAudioInitialized) return;
        for (let i = 0; i < spells.length; i++) {
            const sound = spells[i];
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

    // Play sthe sound with a specific pitch and volume
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
    await preloadSpellSounds();

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

        // Create a new buffer source for the voice line
        currentSpell = audioContext.createBufferSource();
        currentSpell.buffer = cachedSounds[spell.url];
        currentSpell.playbackRate.value = 1.0;

        // Volume control for the voice line
        const spellGainNode = audioContext.createGain();
        spellGainNode.gain.value = spell.volume;

        // Connect the source to the gain node and then to the destination
        currentSpell.connect(spellGainNode);
        spellGainNode.connect(audioContext.destination);

        // Start the voice line
        if (voiceEnabled)
            currentSpell.start();
        playSound(currentPopSound, pitch); 
    }

    // Wait for user gesture before initializing audio
    document.addEventListener('click', initializeAudio, { once: true });
    document.addEventListener('keydown', initializeAudio, { once: true });
})