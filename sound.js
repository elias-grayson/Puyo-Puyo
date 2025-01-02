document.addEventListener('DOMContentLoaded', async () => {

     // Initialize AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    // Cache for preloaded audio buffers
    const cachedSounds = {};

    // Preload and cache all sounds at the start
    async function preloadSounds() {
        for (let i = 0; i < joshSpells.length; i++) {
            const sound = joshSpells[i];
            await loadAndCacheSound(sound.url);
        }
        // Preload the current pop sound
        await loadAndCacheSound(currentPopSound);
    }

    // Load and cache audio file
    async function loadAndCacheSound(url) {
        if (cachedSounds[url]) {
            return cachedSounds[url]; // Return the cached sound if already loaded
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        cachedSounds[url] = audioBuffer; // Cache the audio buffer for future use
    }

    // Play the sound with a specific pitch and volume
    function playSound(url, pitch = 1.0, volume = 0.5) {
        const audioBuffer = cachedSounds[url]; // Get the cached sound

        // Create a new buffer source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Set pitch and volume
        source.playbackRate.value = pitch;
        const soundGainNode = audioContext.createGain();
        soundGainNode.gain.value = volume;

        // Connect to destination
        source.connect(soundGainNode);
        soundGainNode.connect(audioContext.destination);

        // Play the sound
        source.start();
    }

    // Josh's voice clips (you can adjust volume per clip if necessary)
    const joshSpells = [
        { url: 'josh-spells/1.mp3', volume: 1.0 },
        { url: 'josh-spells/2.mp3', volume: 1.0 },
        { url: 'josh-spells/3.mp3', volume: 1.0 }, 
        { url: 'josh-spells/4.mp3', volume: 1.0 },
        { url: 'josh-spells/5.mp3', volume: 1.0 },
        { url: 'josh-spells/6.mp3', volume: 1.0 },
        { url: 'josh-spells/7.mp3', volume: 1.0 } 
    ];

    // Tracks the currently playing spell
    let currentSpell = null;
    const currentPopSound = 'game-sounds/coin-pickup.mp3'


    // Preloads all sounds as soon as the page loads
    await preloadSounds();

    // Plays the appropriate spell based on the chain length
    window.playVoiceLine = function playVoiceLine() {
        let pitch = 0.6 + Math.min(chainLength - 1, 6) * (1/8);

        // Pauses the current voice line if another one is already being played
        if (currentSpell) {
            currentSpell.currentTime = 0;
        }

        // Sets the appropriate sound based on chain length
        if (chainLength < 7) {
            currentSpell = joshSpells[chainLength - 1];
        } else {
            currentSpell = joshSpells[6];
            pitch = 2.0;
        }

        playSound(currentSpell.url, 1.0, currentSpell.volume);

        playSound(currentPopSound, pitch); 
    }
})