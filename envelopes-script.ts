// Floating hearts animation for romantic ambiance
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