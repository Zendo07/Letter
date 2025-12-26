const anniversaryDate = new Date('2023-06-03T00:00:00');

// Play welcome sound immediately - FIRST PRIORITY
function playWelcomeSound() {
    const welcomeSound = document.getElementById('welcomeSound');
    
    if (welcomeSound) {
        welcomeSound.volume = 0.5; // Adjust volume (0.0 to 1.0)
        
        // Play the sound
        const playPromise = welcomeSound.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Welcome sound playing!');
            }).catch((error) => {
                console.log('Autoplay blocked, playing on first interaction');
                // If blocked, play on first user interaction
                const playOnce = () => {
                    welcomeSound.play();
                    document.removeEventListener('click', playOnce);
                    document.removeEventListener('touchstart', playOnce);
                    document.removeEventListener('keydown', playOnce);
                };
                document.addEventListener('click', playOnce);
                document.addEventListener('touchstart', playOnce);
                document.addEventListener('keydown', playOnce);
            });
        }
    }
}

// Play sound as early as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playWelcomeSound);
} else {
    // DOM already loaded, play immediately
    playWelcomeSound();
}

// Delivery Animation
setTimeout(() => {
    const deliveryScene = document.getElementById('deliveryScene');
    const mailboxContainer = document.getElementById('mailboxContainer');
    
    if (deliveryScene && mailboxContainer) {
        // After rider animation completes (4 seconds)
        setTimeout(() => {
            deliveryScene.style.opacity = '0';
            deliveryScene.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                deliveryScene.style.display = 'none';
                mailboxContainer.style.display = 'block';
            }, 500);
        }, 4000);
    }
}, 100);

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.5 ? '❤️' : '💕';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    const bgAnimation = document.getElementById('bgAnimation');
    if (bgAnimation) {
        bgAnimation.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }
}

setInterval(createHeart, 1000);

// Mailbox Modal Functions
function openMailboxModal() {
    const modal = document.getElementById('dateModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('dateModal');
    const errorMessage = document.getElementById('errorMessage');
    if (modal) {
        modal.classList.remove('active');
    }
    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

function validateDate() {
    const dateInput = document.getElementById('dateInput');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!dateInput || !errorMessage) return;
    
    const inputValue = dateInput.value;
    
    if (!inputValue) {
        errorMessage.textContent = '❌ Please enter a date';
        return;
    }
    
    // Parse the input date
    const inputDate = new Date(inputValue);
    
    // Check if it matches our anniversary date (June 3, 2023)
    const correctDate = new Date('2023-06-03');
    
    if (inputDate.getFullYear() === correctDate.getFullYear() &&
        inputDate.getMonth() === correctDate.getMonth() &&
        inputDate.getDate() === correctDate.getDate()) {
        // Correct date!
        errorMessage.style.color = '#4CAF50';
        errorMessage.textContent = '✓ Unlocking your messages...';
        
        setTimeout(() => {
            // Redirect to envelopes page
            window.location.href = 'envelopes.html';
        }, 1000);
    } else {
        // Wrong date
        errorMessage.style.color = '#ff4444';
        errorMessage.textContent = '❌ Incorrect date. Try again!';
        dateInput.style.borderColor = '#ff4444';
        
        setTimeout(() => {
            dateInput.style.borderColor = '#ddd';
        }, 2000);
    }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        dateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                validateDate();
            }
        });
    }
});


const players = {
    1: {
        audio: document.getElementById('audio1'),
        playBtn: document.getElementById('playBtn1'),
        cardBtn: document.getElementById('cardBtn1'),
        progress: document.getElementById('progress1'),
        current: document.getElementById('current1'),
        duration: document.getElementById('duration1')
    },
    2: {
        audio: document.getElementById('audio2'),
        playBtn: document.getElementById('playBtn2'),
        cardBtn: document.getElementById('cardBtn2'),
        progress: document.getElementById('progress2'),
        current: document.getElementById('current2'),
        duration: document.getElementById('duration2')
    }
};

function toggleAudio(num) {
    const p = players[num];
    
    if (p.audio.paused) {
        Object.keys(players).forEach(key => {
            if (key != num) {
                const other = players[key];
                if (!other.audio.paused) {
                    other.audio.pause();
                    other.playBtn.textContent = '▶️';
                    if (other.cardBtn) {
                        other.cardBtn.textContent = '▶️';
                        other.cardBtn.classList.remove('playing');
                    }
                }
            }
        });
        
        p.audio.play();
        p.playBtn.textContent = '⏸️';
        if (p.cardBtn) {
            p.cardBtn.textContent = '⏸️';
            p.cardBtn.classList.add('playing');
        }
    } else {
        p.audio.pause();
        p.playBtn.textContent = '▶️';
        if (p.cardBtn) {
            p.cardBtn.textContent = '▶️';
            p.cardBtn.classList.remove('playing');
        }
    }
}

function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function seek(e, num) {
    const p = players[num];
    const bar = e.currentTarget;
    const clickX = e.offsetX;
    const width = bar.offsetWidth;
    p.audio.currentTime = (clickX / width) * p.audio.duration;
}

Object.keys(players).forEach(num => {
    const p = players[num];
    
    p.audio.addEventListener('loadedmetadata', () => {
        p.duration.textContent = formatTime(p.audio.duration);
    });

    p.audio.addEventListener('timeupdate', () => {
        const pct = (p.audio.currentTime / p.audio.duration) * 100;
        p.progress.style.width = pct + '%';
        p.current.textContent = formatTime(p.audio.currentTime);
    });

    p.audio.addEventListener('ended', () => {
        p.playBtn.textContent = '▶️';
        if (p.cardBtn) {
            p.cardBtn.textContent = '▶️';
            p.cardBtn.classList.remove('playing');
        }
        p.progress.style.width = '0%';
    });
});

// Also play when page becomes visible (if user switches tabs back)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        playWelcomeSound();
    }
});