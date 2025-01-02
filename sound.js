document.addEventListener('DOMContentLoaded', () => {

    // Initialize AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext);

    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

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
        const audioBuffer = await loadSound(url);

        // Create a buffer source for the sound
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Set the playback rate for pitch adjustment
        source.playbackRate.value = pitch;

        // Set the gain (volume) for this sound
        const soundGainNode = audioContext.createGain();
        soundGainNode.gain.value = volume; // Adjust volume for this sound

        // Connect the source to the gain node and the destination
        source.connect(soundGainNode);
        soundGainNode.connect(audioContext.destination);

        // Start the sound
        source.start();
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