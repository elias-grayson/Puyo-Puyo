document.addEventListener('DOMContentLoaded', () => {

    // Initialize AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext);

    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    // Current sound state
    let currentSource = null;
    let isPaused = false;
    let startTime = 0;
    let pauseTime = 0;

    // Connects the gain node to the audio destination
    gainNode.connect(audioContext.destination);

    // Load the audio file
    async function loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return audioContext.decodeAudioData(arrayBuffer);
    }

    // Play the sound with a specific pitch
    window.playSound = async function playSound(url, pitch = 1.0, volume = 0.3) {
        // Load the audio buffer
        const audioBuffer = await loadSound(url);

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
        startTime = audioContext.currentTime - pauseTime;
        source.start(0, pauseTime);

        // Save reference to the current source
        currentSource = source;

        // Handle sound completion
        source.onended = () => {
            currentSource = null;
            pauseTime = 0;
            isPaused = false;
        };
    }

    // Pause the current sound
    function pauseSound() {
        if (currentSource && !isPaused) {
            currentSource.stop(); // Stops the sound
            pauseTime = audioContext.currentTime - startTime; // Save playback time
            isPaused = true;
        }
    }

    // Resume the current sound
    async function resumeSound(url, pitch = 1.0, volume = 0.5) {
        if (isPaused) {
            isPaused = false;
            await playSound(url, pitch, volume); // Resumes from the saved pause time
        }
    }

    // Josh's voice clips
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

    for (let i = 0; i < joshSpells.length; i++) {
        currentSpell = joshSpells[i];
        resumeSound(currentSpell.url, 1.0, currentSpell.volume);
        pauseSound();
    }

    // Plays the appropriate spell based on the chain length
    window.playVoiceLine = function playVoiceLine() {
        let pitch = 0.6 + Math.min(chainLength - 1, 6) * (1/8);

        // Pauses the current voice line if another one is already being played
        if (currentSpell) {
            currentSpell.currentTime = 0;
        }

        // Raises the popping sound pitch depending on how big the chain is
        if (chainLength < 7) {
            currentSpell = joshSpells[chainLength - 1];
        } else {
            currentSpell = joshSpells[6];
            pitch = 2.0
        }

        console.log("pitch: ", pitch);
        console.log("Chain length: ", chainLength);
        playSound(currentSpell.url, 1.0, currentSpell.volume);
        playSound(currentPopSound, pitch);
    }
})