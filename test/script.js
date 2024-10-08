const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
seriesBtn = container.querySelector(".series-btn span"),
seriesOptions = container.querySelector(".series-options"),
fullScreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadedmetadata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

mainVideo.addEventListener("loadedmetadata", () => {
    console.log("Video duration: ", mainVideo.duration);
    videoDuration.innerText = formatTime(mainVideo.duration);
});


const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});

seriesOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.src = option.dataset.src;
        mainVideo.load(); // Загрузите видео заново
        mainVideo.play();
        seriesOptions.querySelector(".active")?.classList.remove("active");
        option.classList.add("active");
    });
});


document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-icons") {
        seriesOptions.classList.remove("show");
    }
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});

seriesBtn.addEventListener("click", () => seriesOptions.classList.toggle("show"));
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5);
skipForward.addEventListener("click", () => mainVideo.currentTime += 5);
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));

playPauseBtn.addEventListener("click", () => {
    if (mainVideo.paused) {
        mainVideo.play();
    } else {
        mainVideo.pause();
    }
});

mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));

// Обработчик события для перемотки видео при нажатии стрелок влево и вправо
document.addEventListener('keydown', (e) => {
    // Проверяем, была ли нажата клавиша пробела
    if (e.code === 'Space') {
        e.preventDefault(); // Предотвращаем действие по умолчанию для пробела (например, прокрутка страницы)
        
        // Переключаем воспроизведение и паузу видео
        if (mainVideo.paused) {
            mainVideo.play();
        } else {
            mainVideo.pause();
        }
        
        // Обновляем иконку кнопки воспроизведения/паузы
        playPauseBtn.classList.toggle("fa-play", mainVideo.paused);
        playPauseBtn.classList.toggle("fa-pause", !mainVideo.paused);
    }

    // Перематываем видео при нажатии стрелок влево и вправо
    if (e.code === 'ArrowLeft') {
        mainVideo.currentTime -= 10; // Перематываем на 10 секунд назад
        if (mainVideo.currentTime < 0) mainVideo.currentTime = 0; // Не даем текущему времени стать меньше нуля
        e.preventDefault(); // Предотвращаем действие по умолчанию
    }

    if (e.code === 'ArrowRight') {
        mainVideo.currentTime += 10; // Перематываем на 10 секунд вперед
        if (mainVideo.currentTime > mainVideo.duration) mainVideo.currentTime = mainVideo.duration; // Не даем текущему времени стать больше продолжительности видео
        e.preventDefault(); // Предотвращаем действие по умолчанию
    }
});
