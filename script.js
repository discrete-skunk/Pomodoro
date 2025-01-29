let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleButton = document.getElementById('toggle-mode');
const addTimeButton = document.getElementById('add-time');
const focusTextDisplay = document.getElementById('focus-text');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const modal = document.getElementById('focus-modal');
const focusInput = document.getElementById('focus-input');
const focusOkButton = document.getElementById('focus-ok');
const focusCancelButton = document.getElementById('focus-cancel');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    minutesDisplay.textContent = minutes.toString();
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the browser tab title
    document.title = timerId !== null ? 
        `(${timeString}) ${isWorkTime ? 'Work' : 'Break'} - Pomodoro` : 
        'Pomodoro Timer';
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? '\u2600' : '\u263D';
    document.title = `Pomodoro Timer - ${isWorkTime ? 'Work' : 'Break'}`;
    updateDisplay();
}

function showFocusModal() {
    return new Promise((resolve) => {
        modal.style.display = 'block';
        focusInput.value = '';
        
        const closeButton = document.querySelector('.modal-close');
        closeButton.onclick = () => {
            modal.style.display = 'none';
            resolve(null);
        };
        
        focusOkButton.onclick = () => {
            const value = focusInput.value.trim();
            if (value) {
                modal.style.display = 'none';
                resolve(value);
            }
        };
        
        focusCancelButton.onclick = () => {
            modal.style.display = 'none';
            resolve(null);
        };
        
        focusInput.onkeyup = (e) => {
            if (e.key === 'Enter') focusOkButton.click();
            if (e.key === 'Escape') focusCancelButton.click();
        };
    });
}

async function startTimer() {
    if (timerId !== null) return;
    
    if (isWorkTime) {
        const focusTask = await showFocusModal();
        if (!focusTask) return;
        focusTextDisplay.textContent = `Focus: ${focusTask}`;
    }
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            addTimeButton.disabled = true;
            focusTextDisplay.textContent = ''; // Clear focus text
            switchMode();
            alert(isWorkTime ? 'Break time is over! Time to work!' : 'Work time is over! Take a break!');
        }
    }, 1000);
    
    startButton.textContent = 'Pause';
    addTimeButton.disabled = false;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeText.textContent = 'Work Time';
    startButton.textContent = 'Start';
    addTimeButton.disabled = true;
    focusTextDisplay.textContent = ''; // Clear focus text
    document.title = 'Pomodoro Timer';
    updateDisplay();
}

function addFiveMinutes() {
    if (timerId !== null) {  // Only allow adding time when timer is running
        timeLeft += 5 * 60;  // Add 5 minutes in seconds
        updateDisplay();
    }
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        addTimeButton.disabled = true;
    }
});

resetButton.addEventListener('click', resetTimer);

toggleButton.addEventListener('click', () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        addTimeButton.disabled = true;
    }
    switchMode();
});

addTimeButton.addEventListener('click', addFiveMinutes);

// Initialize the display
timeLeft = WORK_TIME;
toggleButton.textContent = '\u2600';
updateDisplay();

// Initialize the button state
addTimeButton.disabled = true;

function getTimeBasedColors() {
    const hour = new Date().getHours();
    
    // Early morning (5-8)
    if (hour >= 5 && hour < 8) {
        return {
            primary: '#FF7F50',    // Coral sunrise
            secondary: '#FFA07A',   // Light salmon
            darker: '#E55B3C'       // Darker coral
        };
    }
    // Morning (8-12)
    else if (hour >= 8 && hour < 12) {
        return {
            primary: '#008080',     // Original teal
            secondary: '#009090',    // Slightly lighter teal
            darker: '#006666'       // Darker teal
        };
    }
    // Afternoon (12-16)
    else if (hour >= 12 && hour < 16) {
        return {
            primary: '#20B2AA',     // Light sea green
            secondary: '#48D1CC',    // Medium turquoise
            darker: '#1A8F89'       // Darker sea green
        };
    }
    // Late afternoon (16-19)
    else if (hour >= 16 && hour < 19) {
        return {
            primary: '#CD853F',     // Peru (warm sunset)
            secondary: '#DEB887',    // Burlywood
            darker: '#A66A32'       // Darker peru
        };
    }
    // Evening (19-22)
    else if (hour >= 19 && hour < 22) {
        return {
            primary: '#4682B4',     // Steel blue
            secondary: '#5F9EA0',    // Cadet blue
            darker: '#385E8D'       // Darker steel blue
        };
    }
    // Night (22-5)
    else {
        return {
            primary: '#2F4F4F',     // Dark slate gray
            secondary: '#3D5C5C',    // Slightly lighter slate
            darker: '#243C3C'       // Darker slate
        };
    }
}

function updateBackgroundColors() {
    const colors = getTimeBasedColors();
    document.body.style.background = 
        `linear-gradient(to bottom, ${colors.primary} 0%, ${colors.darker} 100%)`;
}

// Update colors immediately and then every minute
updateBackgroundColors();
setInterval(updateBackgroundColors, 60000); 