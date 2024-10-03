document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('myVideo');
    const customPlayPauseButton = document.getElementById('customPlayPauseButton');
    const playPauseButton = document.getElementById('playPauseButton');
    const progress = document.getElementById('progress');
    const buffered = document.getElementById('buffered');
    const progressThumb = document.getElementById('progressThumb');
    const volumeControl = document.getElementById('volumeControl');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeProgress = document.getElementById('volumeProgress');
    const volumeThumb = document.getElementById('volumeThumb');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const progressBar = document.querySelector('.progress-bar');
    let isDragging = false;
    let isVolumeDragging = false;

    function updatePlayPauseButton() {
        const icon = video.paused || video.ended ? 'fa-play' : 'fa-pause';
        playPauseButton.innerHTML = `<i class="fas ${icon}"></i>`;
        customPlayPauseButton.innerHTML = `<i class="fas ${icon}"></i>`;
    }

    playPauseButton.addEventListener('click', togglePlayPause);
    customPlayPauseButton.addEventListener('click', togglePlayPause);

    function togglePlayPause() {
        if (video.paused || video.ended) {
            video.play().catch(error => console.error('Play error:', error));
        } else {
            video.pause();
        }
        updatePlayPauseButton();
    }

    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const percentage = (video.currentTime / video.duration) * 100;
            progress.style.width = percentage + '%';
            progressThumb.style.left = percentage + '%';
        }
    });

    video.addEventListener('progress', () => {
        if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const bufferedPercentage = (bufferedEnd / video.duration) * 100;
            buffered.style.width = bufferedPercentage + '%';
        }
    });

    progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateProgress(e);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateProgress(e);
        }
    });

    function updateProgress(e) {
        const rect = progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
        progress.style.width = percentage + '%';
        progressThumb.style.left = percentage + '%';
        video.currentTime = (percentage / 100) * video.duration;
    }

    function updateVolume(e) {
        const rect = volumeSlider.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
        volumeProgress.style.width = percentage + '%';
        volumeThumb.style.left = percentage + '%';
        video.volume = percentage / 100;
    }

    volumeControl.addEventListener('click', () => {
        video.muted = !video.muted;
        volumeControl.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });

    volumeSlider.addEventListener('mousedown', (e) => {
        isVolumeDragging = true;
        updateVolume(e);
    });

    document.addEventListener('mouseup', () => {
        isVolumeDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isVolumeDragging) {
            updateVolume(e);
        }
    });

    function setVolumeSlider() {
        const volumePercentage = video.volume * 100;
        volumeProgress.style.width = volumePercentage + '%';
        volumeThumb.style.left = volumePercentage + '%';
    }

    fullscreenButton.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });

    video.addEventListener('waiting', () => {
        loadingOverlay.style.display = 'flex';
    });

    video.addEventListener('playing', () => {
        loadingOverlay.style.display = 'none';
    });

    video.addEventListener('error', () => {
        loadingOverlay.style.display = 'none';
    });

    // Initialize volume slider on page load
    setVolumeSlider();
});
