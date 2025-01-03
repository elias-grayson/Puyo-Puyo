document.addEventListener('DOMContentLoaded', async () => {

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
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Creates a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    // Cache for preloaded audio buffers
    const cachedSounds = {};

    // Preload and cache all sounds at the start
    async function preloadSounds() {
        for (let i = 0; i < spells.length; i++) {
            const sound = spells[i];
            await loadAndCacheSound(sound.url);
        }
        // Preload the current pop sound
        await loadAndCacheSound(currentPopSound);
    }

    // Load and cache audio file
    window.loadAndCacheSound = async function loadAndCacheSound(url) {
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
    let currentSpell = null;
    const currentPopSound = 'game-sounds/coin-pickup.mp3'


    // Preloads all sounds as soon as the page loads
    await preloadSounds();

    // Plays the appropriate spell based on the chain length
    window.playVoiceLine = function playVoiceLine() {
        let pitch = 0.6 + Math.min(chainLength - 1, 6) * (1/9)

        // Pauses the current voice line if another one is already being played
        if (currentSpell) {
            currentSpell.currentTime = 0;
        }

        // Sets the appropriate sound based on chain length
        if (chainLength < 7) {
            currentSpell = spells[chainLength - 1];
        } else {
            currentSpell = spells[6];
            pitch = 1.225;
        }

        playSound(currentSpell.url, 1.0, currentSpell.volume);
        playSound(currentPopSound, pitch); 
    }
})