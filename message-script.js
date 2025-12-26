// Audio player functionality - Spotify-style
const audioPlayer = document.getElementById('audioPlayer');

if (audioPlayer) {
    const playBtnMain = document.getElementById('playBtnMain');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('progressBar');
    const currentTimeLabel = document.getElementById('currentTimeLabel');
    const durationLabel = document.getElementById('durationLabel');

    function toggleAudio() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            if (playIcon) {
                playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>'; // Pause icon
            }
        } else {
            audioPlayer.pause();
            if (playIcon) {
                playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
            }
        }
    }

    function seekBackward() {
        audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
    }

    function seekForward() {
        audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
    }

    function seekToPosition(e) {
        const progressTrack = e.currentTarget;
        const rect = progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = progressTrack.offsetWidth;
        const seekTime = (clickX / width) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }

    function formatTime(sec) {
        if (isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // Event listeners
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (durationLabel) {
            durationLabel.textContent = formatTime(audioPlayer.duration);
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (progressBar && audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = percent + '%';
        }
        if (currentTimeLabel) {
            currentTimeLabel.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    audioPlayer.addEventListener('ended', () => {
        if (playIcon) {
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
        }
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    });

    // Make functions globally accessible
    window.toggleAudio = toggleAudio;
    window.seekBackward = seekBackward;
    window.seekForward = seekForward;
    window.seekToPosition = seekToPosition;
}