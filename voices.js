/* Houses all of the different voices */
document.addEventListener('DOMContentLoaded', () => {

    // Tracks whether each respective voice line is active
    window.isJosh = true;
    window.isMichael = false;
    window.isBritMicah = false;
    window.isSouthMicah = false;

    window.gameOverVoice;

    // Changes the voice lines to Josh's
    $(".voiceButtons").on("click", "#joshVoice", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        enableVoice();

        isJosh = true;
        isMichael = false;
        isBritMicah = false;
        isSouthMicah = false;

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
        const selectJosh = new Audio('josh-spells/char-select.mp3');
        selectJosh.volume = 1.0;
        playInterruptableSound(selectJosh);
    })

    // Changes the voice lines to Southern Micah's
    $(".voiceButtons").on("click", "#michaelVoice", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        enableVoice();

        isJosh = false;
        isMichael = false;
        isBritMicah = false;
        isSouthMicah = true;

        currentAllClearVoice = new Audio('michael-spells/all-clear.mp3');
        gameOverVoice = new Audio('michael-spells/lose.mp3');
        gameOverVoice.volume = 1.0;

        window.spells.splice(0, spells.length,
            { url: 'michael-spells/1.mp3', volume: 1.0 },
            { url: 'michael-spells/2.mp3', volume: 2.0 },
            { url: 'michael-spells/3.mp3', volume: 1.0 }, 
            { url: 'michael-spells/4.mp3', volume: 2.0 },
            { url: 'michael-spells/5.mp3', volume: 2.0 },
            { url: 'michael-spells/6.mp3', volume: 1.7 },
            { url: 'michael-spells/7.mp3', volume: 1.7 },
        );

        // Cache the new sound
        for (const spell of spells) {
            await loadAndCacheSound(spell.url);
        }
        const selectMichael = new Audio('michael-spells/char-select.mp3');
        selectMichael.volume = 0.9;
        playInterruptableSound(selectMichael);
    });

    // Changes the voice lines to British Micah's
    $(".voiceButtons").on("click", "#britMicah", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        enableVoice();

        isJosh = false;
        isMichael = false;
        isBritMicah = true;
        isSouthMicah = false;

        currentAllClearVoice = new Audio('british-micah-spells/all-clear.mp3');
        currentAllClearVoice.volume = 0.6;
        gameOverVoice = new Audio('british-micah-spells/lose.mp3');
        gameOverVoice.volume = 0.5;

        window.spells.splice(0, spells.length,
            { url: 'british-micah-spells/1.mp3', volume: 4.0 },
            { url: 'british-micah-spells/2.mp3', volume: 4.0 },
            { url: 'british-micah-spells/3.mp3', volume: 4.0 }, 
            { url: 'british-micah-spells/4.mp3', volume: 4.0 },
            { url: 'british-micah-spells/5.mp3', volume: 4.0 },
            { url: 'british-micah-spells/6.mp3', volume: 4.0 },
            { url: 'british-micah-spells/7.mp3', volume: 4.0 },
        );

        // Cache the new sound
        for (const spell of spells) {
            await loadAndCacheSound(spell.url);
        }
        const selectBritMicah = new Audio('british-micah-spells/char-select.mp3');
        selectBritMicah.volume = 0.8;
        playInterruptableSound(selectBritMicah);
    })

    // Changes the voice lines to Southern Micah's
    $(".voiceButtons").on("click", "#southMicah", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        enableVoice();

        isJosh = false;
        isMichael = false;
        isBritMicah = false;
        isSouthMicah = true;

        currentAllClearVoice = new Audio('southern-micah-spells/all-clear.mp3');
        gameOverVoice = new Audio('southern-micah-spells/lose.mp3');
        gameOverVoice.volume = 0.6;

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
        const selectSouthMicah = new Audio('southern-micah-spells/char-select.mp3');
        selectSouthMicah.volume = 0.7;
        playInterruptableSound(selectSouthMicah);
    });

    $(".voiceButtons").on("click", "#noVoice", async function () {
        event.preventDefault();
        event.stopPropagation();
        voiceEnabled = false;
        isJosh = false;
        isBritMicah = false;
        isSouthMicah = false;
        isMichael = false;

        // Speeds up puyo clears
        fallingAndColorTimer = 400;
        popAnimateDuration = 300;
        connectedFontTimer = 100;
    });

    // Enables voice lines and reverts chaining speed
    function enableVoice() {
        popAnimateDuration = 600;
        fallingAndColorTimer = 800;
        connectedFontTimer = 200;

        voiceEnabled = true;
    }
});