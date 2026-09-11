const startButton = document.getElementById('start-button');

const modal = document.getElementById('focus-modal');
const focusInput = document.getElementById('focus-input');

const confirmButton = document.getElementById('confirm-button');
const cancelButton = document.getElementById('cancel-button');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsButton = document.getElementById('close-settings-button');
const soundToggle = document.getElementById('sound-toggle');
const topmostToggle = document.getElementById('topmost-toggle');

const errorMessage = document.getElementById('error-message');
const timerDisplay = document.querySelector('.timer');
const panImage = document.querySelector('.pan');
const panStage = document.querySelector('.pan-stage');

let timer = null;

const timerCompleteSound = new Audio('assets/TimerComplete.mp3');

soundToggle.checked = localStorage.getItem('timerSoundEnabled') !== 'false';
topmostToggle.checked = localStorage.getItem('windowTopmostEnabled') !== 'false';

if (window.electronAPI) {
    window.electronAPI.setAlwaysOnTop(topmostToggle.checked);
}

startButton.addEventListener('click', function() {
    startButton.classList.remove('clicked');
    void startButton.offsetWidth;
    startButton.classList.add('clicked');

    modal.classList.remove('hidden');

    focusInput.value = '';
    errorMessage.textContent = '';

    focusInput.focus();
});


settingsButton.addEventListener('click', function() {
    settingsModal.classList.remove('hidden');
});


closeSettingsButton.addEventListener('click', function() {
    settingsModal.classList.add('hidden');
});


soundToggle.addEventListener('change', function() {
    localStorage.setItem('timerSoundEnabled', String(soundToggle.checked));
});


topmostToggle.addEventListener('change', function() {
    localStorage.setItem('windowTopmostEnabled', String(topmostToggle.checked));

    if (window.electronAPI) {
        window.electronAPI.setAlwaysOnTop(topmostToggle.checked);
    }
});

cancelButton.addEventListener('click', function() {
    modal.classList.add('hidden');
});

confirmButton.addEventListener('click', function() {
    const focusTime = Number(focusInput.value);

    if (!Number.isInteger(focusTime) || focusTime <= 0) {
        errorMessage.textContent = 'Please enter a whole number greater than 0.';
        focusInput.focus();
        return;
    }

    modal.classList.add('hidden');

    panImage.src = 'assets/EggPan.png';
    panStage.classList.add('cooking');

    startTimer(focusTime);
});


function startTimer(focusTime) {

    if (timer !== null) {
        clearInterval(timer);
    }

    const endTime = Date.now() + focusTime * 60 * 1000;

    updateTimer(endTime);

    timer = setInterval(function() {
        updateTimer(endTime);
    }, 1000);
}


function updateTimer(endTime) {
    const remaining = endTime - Date.now();

    if (remaining <= 0) {
        clearInterval(timer);
        timer = null;

        timerDisplay.textContent = '00:00';

        panImage.src = 'assets/Pan.png';
        panStage.classList.remove('cooking');

        if (soundToggle.checked) {
            timerCompleteSound.currentTime = 0;
            timerCompleteSound.play();
        }

        console.log('Focus time is over!');

        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
