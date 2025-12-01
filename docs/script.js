/**
 * ГЛАВНЫЙ ФАЙЛ JAVASCRIPT
 * 
 * ВСЯ ИНТЕРАКТИВНОСТЬ САЙТА РЕАЛИЗОВАНА ЧЕРЕЗ JAVASCRIPT:
 * - Навигация между разделами
 * - Открытие модальных окон для изображений
 * - Воспроизведение аудио треков
 * - Звуковые эффекты при взаимодействии
 * - Плавные анимации и переходы
 * - Обработка кликов по всем элементам
 * 
 * Все функции доступны глобально через window объект.
 * Смотрите examples.js для примеров использования.
 * 
 * ВАЖНО: Этот файл предназначен для работы в БРАУЗЕРЕ!
 * Не запускайте его через Node.js - откройте index.html в браузере.
 */

// Проверка на наличие браузерного окружения
if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.error('❌ Этот скрипт предназначен для работы в браузере!');
    console.error('📖 Откройте index.html в браузере вместо запуска через Node.js.');
    // Выходим, если запущено в Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {};
    }
    // Останавливаем выполнение
    throw new Error('Этот файл должен запускаться в браузере, а не в Node.js');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    try {
    initModals(); // Сначала создаем модальное окно
    } catch (e) {
        console.error('Ошибка инициализации модальных окон:', e);
    }
    
    try {
    initNavigation();
    } catch (e) {
        console.error('Ошибка инициализации навигации:', e);
    }
    
    try {
    initAudioPlayer();
    } catch (e) {
        console.error('Ошибка инициализации аудио плеера:', e);
    }
    
    try {
        initWinampPlayer();
    } catch (e) {
        console.error('Ошибка инициализации Winamp плеера:', e);
    }
    
    try {
    initContentCards();
    } catch (e) {
        console.error('Ошибка инициализации карточек контента:', e);
    }
    
    try {
    initPlaceholders();
    } catch (e) {
        console.error('Ошибка инициализации плейсхолдеров:', e);
    }
    
    try {
    initSoundEffects();
    } catch (e) {
        console.error('Ошибка инициализации звуковых эффектов:', e);
    }
    
    try {
    initShopButton();
    } catch (e) {
        console.error('Ошибка инициализации кнопки магазина:', e);
    }
    
    try {
    initSmoothScroll();
    } catch (e) {
        console.error('Ошибка инициализации плавной прокрутки:', e);
    }
    
    try {
    initVideoTabs();
    } catch (e) {
        console.error('Ошибка инициализации вкладок видео:', e);
    }
    
    try {
        initHeroMatrix(); // Инициализируем матричный эффект для hero
    } catch (e) {
        console.error('Ошибка инициализации матричного эффекта:', e);
    }
    
    // Загружаем данные с обработкой ошибок
    // Увеличиваем задержку, чтобы убедиться, что все элементы DOM готовы
    setTimeout(() => {
        console.log('Начинаем загрузку данных...');
        
        try {
            console.log('Загрузка музыки...');
    loadLocalMusic();
            console.log('Музыка загружена');
        } catch (e) {
            console.error('Ошибка загрузки музыки:', e);
        }
        
        try {
            console.log('Загрузка видео...');
            loadLocalVideos();
            console.log('Видео загружено');
        } catch (e) {
            console.error('Ошибка загрузки видео:', e);
        }
        
        try {
            console.log('Загрузка фото...');
            loadLocalPhotos();
            console.log('Фото загружено');
        } catch (e) {
            console.error('Ошибка загрузки фото:', e);
        }
        
        try {
            console.log('Загрузка YouTube ссылок...');
            loadYouTubeLinks();
            console.log('YouTube ссылки загружены');
        } catch (e) {
            console.error('Ошибка загрузки YouTube ссылок:', e);
        }
        
        try {
            console.log('Загрузка баннеров...');
            loadFooterBanners();
            console.log('Баннеры загружены');
        } catch (e) {
            console.error('Ошибка загрузки баннеров:', e);
        }
        
        try {
            console.log('Добавление демо контента...');
    addDemoContent();
            console.log('Демо контент добавлен');
        } catch (e) {
            console.error('Ошибка добавления демо контента:', e);
        }
        
        console.log('Загрузка данных завершена');
    }, 300);
});

// Инициализируем AudioContext при загрузке
initAudioContext();

// Навигация
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Функция переключения секций
    const switchSection = (targetId) => {
            // Обновляем активные классы
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
        // Находим нужную ссылку и секцию
        const targetLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
            const targetSection = document.getElementById(targetId);
        
        if (targetLink && targetSection) {
            targetLink.classList.add('active');
                targetSection.classList.add('active');
                playSound('click');
            return true;
        }
        return false;
    };

    // Обработка кликов по ссылкам
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchSection(targetId);
            // Обновляем URL без перезагрузки страницы
            window.history.pushState(null, null, `#${targetId}`);
        });
    });

    // Обработка hash при загрузке страницы
    const handleHash = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            switchSection(hash);
        } else {
            // Если нет hash, показываем home
            switchSection('home');
        }
    };

    // Обрабатываем hash при загрузке
    handleHash();

    // Обрабатываем изменения hash (когда пользователь использует кнопки назад/вперед)
    window.addEventListener('hashchange', handleHash);
}

// Аудио плеер
let currentAudio = null;
let isPlaying = false;

function initAudioPlayer() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const audioElement = document.getElementById('audioElement');
    const progressBar = document.getElementById('progressBar');
    const playerProgress = document.querySelector('.player-progress');

    // Плей/пауза
    playPauseBtn.addEventListener('click', () => {
        if (currentAudio) {
            if (isPlaying) {
                audioElement.pause();
                playPauseBtn.textContent = '▶';
                isPlaying = false;
            } else {
                audioElement.play();
                playPauseBtn.textContent = '⏸';
                isPlaying = true;
            }
            playSound('click');
        }
    });

    // Обновление прогресса
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.style.width = progress + '%';
            updateTimeDisplay();
        }
    });

    // Клик по прогресс-бару
    playerProgress.addEventListener('click', (e) => {
        const rect = playerProgress.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        if (audioElement.duration) {
            audioElement.currentTime = percent * audioElement.duration;
        }
    });

    // Громкость
    volumeSlider.addEventListener('input', (e) => {
        audioElement.volume = e.target.value / 100;
    });

    volumeBtn.addEventListener('click', () => {
        if (audioElement.volume > 0) {
            audioElement.volume = 0;
            volumeSlider.value = 0;
            volumeBtn.textContent = '🔇';
        } else {
            audioElement.volume = 0.5;
            volumeSlider.value = 50;
            volumeBtn.textContent = '🔊';
        }
    });

    // Когда трек закончился
    audioElement.addEventListener('ended', () => {
        playPauseBtn.textContent = '▶';
        isPlaying = false;
        progressBar.style.width = '0%';
    });
}

// Winamp-стиль плеер
let winampVisualizerContext = null;
let winampAnalyser = null;
let winampDataArray = null;
let winampAudioContext = null;
let winampSource = null;

function initWinampPlayer() {
    const audioElement = document.getElementById('audioElement');
    if (!audioElement) {
        console.warn('Аудио элемент не найден, Winamp плеер не инициализирован');
        return;
    }
    
    const winampPlay = document.getElementById('winampPlay');
    const winampPause = document.getElementById('winampPause');
    const winampStop = document.getElementById('winampStop');
    const winampPrev = document.getElementById('winampPrev');
    const winampNext = document.getElementById('winampNext');
    const winampEject = document.getElementById('winampEject');
    const winampShuffle = document.getElementById('winampShuffle');
    const winampRepeat = document.getElementById('winampRepeat');
    const winampVolumeSlider = document.getElementById('winampVolumeSlider');
    const winampVolumeHandle = document.getElementById('winampVolumeHandle');
    const winampVolumeFill = document.getElementById('winampVolumeFill');
    const winampBalanceSlider = document.getElementById('winampBalanceSlider');
    const winampBalanceHandle = document.getElementById('winampBalanceHandle');
    const winampBalanceFill = document.getElementById('winampBalanceFill');
    const winampProgressTrack = document.querySelector('.winamp-progress-track');
    const winampProgressHandle = document.getElementById('winampProgressHandle');
    const winampProgressFill = document.getElementById('winampProgressFill');
    const winampTime = document.getElementById('winampTime');
    const winampTrackInfo = document.getElementById('winampTrackInfo');
    const winampTrackDuration = document.getElementById('winampTrackDuration');
    const winampPlayIndicator = document.getElementById('winampPlayIndicator');
    const winampCanvas = document.getElementById('winampCanvas');
    
    // Инициализация визуализатора
    if (winampCanvas) {
        winampVisualizerContext = winampCanvas.getContext('2d');
        winampCanvas.width = winampCanvas.offsetWidth;
        winampCanvas.height = winampCanvas.offsetHeight;
        
        // Создаем AudioContext для анализа (только один раз)
        if (!winampAudioContext) {
            try {
                winampAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                winampAnalyser = winampAudioContext.createAnalyser();
                winampAnalyser.fftSize = 256;
                winampDataArray = new Uint8Array(winampAnalyser.frequencyBinCount);
                
                // Подключаем к аудио элементу
                const audioElement = document.getElementById('audioElement');
                if (audioElement && !winampSource) {
                    winampSource = winampAudioContext.createMediaElementSource(audioElement);
                    winampSource.connect(winampAnalyser);
                    winampAnalyser.connect(winampAudioContext.destination);
                }
            } catch (e) {
                console.log('AudioContext не поддерживается:', e);
            }
        }
        
        // Запускаем визуализацию
        animateVisualizer();
    }
    
    // Кнопки управления (с проверками)
    if (winampPlay) {
        winampPlay.addEventListener('click', () => {
            if (currentAudio) {
                audioElement.play();
                if (winampPlayIndicator) winampPlayIndicator.classList.add('active');
                isPlaying = true;
                playSound('click');
            }
        });
    }
    
    if (winampPause) {
        winampPause.addEventListener('click', () => {
            audioElement.pause();
            if (winampPlayIndicator) winampPlayIndicator.classList.remove('active');
            isPlaying = false;
            playSound('click');
        });
    }
    
    if (winampStop) {
        winampStop.addEventListener('click', () => {
            audioElement.pause();
            audioElement.currentTime = 0;
            if (winampPlayIndicator) winampPlayIndicator.classList.remove('active');
            isPlaying = false;
            playSound('click');
        });
    }
    
    if (winampPrev) {
        winampPrev.addEventListener('click', () => {
            // Переключение на предыдущий трек
            playSound('click');
        });
    }
    
    if (winampNext) {
        winampNext.addEventListener('click', () => {
            // Переключение на следующий трек
            playSound('click');
        });
    }
    
    if (winampEject) {
        winampEject.addEventListener('click', () => {
            audioElement.pause();
            audioElement.src = '';
            if (winampTrackInfo) winampTrackInfo.textContent = 'Выберите трек';
            if (winampTime) winampTime.textContent = '-00:00';
            if (winampTrackDuration) winampTrackDuration.textContent = '<0:00>';
            if (winampPlayIndicator) winampPlayIndicator.classList.remove('active');
            isPlaying = false;
            playSound('click');
        });
    }
    
    if (winampShuffle) {
        winampShuffle.addEventListener('click', () => {
            winampShuffle.classList.toggle('active');
            playSound('click');
        });
    }
    
    if (winampRepeat) {
        winampRepeat.addEventListener('click', () => {
            winampRepeat.classList.toggle('active');
            audioElement.loop = winampRepeat.classList.contains('active');
            playSound('click');
        });
    }
    
    // Слайдер громкости
    let isDraggingVolume = false;
    if (winampVolumeSlider && winampVolumeFill && winampVolumeHandle) {
        winampVolumeSlider.addEventListener('mousedown', (e) => {
            isDraggingVolume = true;
            updateVolumeSlider(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDraggingVolume) {
                updateVolumeSlider(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDraggingVolume = false;
        });
        
        function updateVolumeSlider(e) {
            const rect = winampVolumeSlider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            audioElement.volume = percent / 100;
            winampVolumeFill.style.width = percent + '%';
            winampVolumeHandle.style.right = (100 - percent) + '%';
        }
    }
    
    // Слайдер баланса
    let isDraggingBalance = false;
    if (winampBalanceSlider && winampBalanceFill && winampBalanceHandle) {
        winampBalanceSlider.addEventListener('mousedown', (e) => {
            isDraggingBalance = true;
            updateBalanceSlider(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDraggingBalance) {
                updateBalanceSlider(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDraggingBalance = false;
        });
        
        function updateBalanceSlider(e) {
            const rect = winampBalanceSlider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            // Баланс (pan) - от -1 (лево) до 1 (право)
            const panValue = (percent - 50) / 50;
            if (audioElement.setStereoPan) {
                audioElement.setStereoPan(panValue);
            }
            winampBalanceFill.style.width = percent + '%';
            winampBalanceHandle.style.right = (100 - percent) + '%';
        }
    }
    
    // Прогресс-бар
    let isDraggingProgress = false;
    if (winampProgressTrack && winampProgressFill && winampProgressHandle) {
        winampProgressTrack.addEventListener('mousedown', (e) => {
            isDraggingProgress = true;
            updateProgress(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDraggingProgress) {
                updateProgress(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDraggingProgress = false;
        });
        
        function updateProgress(e) {
            const rect = winampProgressTrack.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            if (audioElement.duration) {
                audioElement.currentTime = (percent / 100) * audioElement.duration;
            }
        }
    }
    
    // Обновление времени и прогресса
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            const current = audioElement.currentTime;
            const duration = audioElement.duration;
            const remaining = duration - current;
            
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `-${mins}:${secs.toString().padStart(2, '0')}`;
            };
            
            if (winampTime) winampTime.textContent = formatTime(remaining);
            
            if (winampProgressFill && winampProgressHandle) {
                const progress = (current / duration) * 100;
                winampProgressFill.style.width = progress + '%';
                winampProgressHandle.style.left = progress + '%';
            }
        }
    });
    
    // Обновление индикатора воспроизведения
    audioElement.addEventListener('play', () => {
        if (winampPlayIndicator) winampPlayIndicator.classList.add('active');
        isPlaying = true;
    });
    
    audioElement.addEventListener('pause', () => {
        if (winampPlayIndicator) winampPlayIndicator.classList.remove('active');
        isPlaying = false;
    });
}

// Анимация визуализатора
function animateVisualizer() {
    if (!winampVisualizerContext || !winampAnalyser || !winampDataArray) {
        requestAnimationFrame(animateVisualizer);
        return;
    }
    
    const canvas = winampVisualizerContext.canvas;
    winampAnalyser.getByteFrequencyData(winampDataArray);
    
    // Очищаем canvas
    winampVisualizerContext.fillStyle = '#000';
    winampVisualizerContext.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем сетку
    winampVisualizerContext.strokeStyle = '#00ff00';
    winampVisualizerContext.globalAlpha = 0.2;
    for (let i = 0; i < canvas.height; i += 5) {
        winampVisualizerContext.beginPath();
        winampVisualizerContext.moveTo(0, i);
        winampVisualizerContext.lineTo(canvas.width, i);
        winampVisualizerContext.stroke();
    }
    
    // Рисуем волну
    winampVisualizerContext.strokeStyle = '#00ff00';
    winampVisualizerContext.globalAlpha = 1;
    winampVisualizerContext.lineWidth = 2;
    winampVisualizerContext.beginPath();
    
    const sliceWidth = canvas.width / winampDataArray.length;
    let x = 0;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < winampDataArray.length; i++) {
        const v = winampDataArray[i] / 255.0;
        const y = centerY - (v * centerY);
        
        if (i === 0) {
            winampVisualizerContext.moveTo(x, y);
        } else {
            winampVisualizerContext.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    winampVisualizerContext.stroke();
    
    requestAnimationFrame(animateVisualizer);
}

function loadAudio(src, title) {
    const audioElement = document.getElementById('audioElement');
    const playerTitle = document.getElementById('playerTitle');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const winampTrackInfo = document.getElementById('winampTrackInfo');
    const winampTrackDuration = document.getElementById('winampTrackDuration');
    const winampPlayIndicator = document.getElementById('winampPlayIndicator');

    audioElement.src = src;
    playerTitle.textContent = title;
    audioPlayer.classList.add('active');
    currentAudio = src;
    
    // Обновляем Winamp-плеер
    if (winampTrackInfo) {
        winampTrackInfo.textContent = title || 'Неизвестный трек';
    }
    
    // Загружаем метаданные для определения длительности
    audioElement.addEventListener('loadedmetadata', () => {
        updateTimeDisplay();
        if (winampTrackDuration && audioElement.duration) {
            const mins = Math.floor(audioElement.duration / 60);
            const secs = Math.floor(audioElement.duration % 60);
            winampTrackDuration.textContent = `<${mins}:${secs.toString().padStart(2, '0')}>`;
        }
    }, { once: true });
    
    audioElement.load();
    playSound('click');
    
    // Автоматически начинаем воспроизведение
    audioElement.play().then(() => {
        playPauseBtn.textContent = '⏸';
        if (winampPlayIndicator) {
            winampPlayIndicator.classList.add('active');
        }
        isPlaying = true;
    }).catch(err => {
        console.log('Автовоспроизведение заблокировано:', err);
    });
}

function updateTimeDisplay() {
    const audioElement = document.getElementById('audioElement');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    if (audioElement.duration) {
        durationEl.textContent = formatTime(audioElement.duration);
    }
}

// Карточки контента
function initContentCards() {
    const contentCards = document.querySelectorAll('.content-card');
    
    contentCards.forEach(card => {
        card.addEventListener('click', () => {
            const section = card.getAttribute('data-section');
            const navLink = document.querySelector(`.nav-link[href="#${section}"]`);
            if (navLink) {
                navLink.click();
            }
        });
    });
}

// Плейсхолдеры для контента
function initPlaceholders() {
    // Ссылки
    const linksContent = document.getElementById('linksContent');
    if (linksContent) {
        linksContent.innerHTML = `
            <div class="placeholder">
                <p>Ссылки</p>
                <p>Добавьте ссылки через JS</p>
            </div>
        `;
    }

    // Аудио
    const audioList = document.getElementById('audioList');
    if (audioList && audioList.children.length === 0) {
        audioList.innerHTML = `
            <div class="placeholder">
                <p>Список аудио треков</p>
                <p>Добавьте треки через JS или они загрузятся автоматически</p>
            </div>
        `;
    }

    // Видео - локальные
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid && videoGrid.children.length === 0) {
        videoGrid.innerHTML = `
            <div class="placeholder">
                <p>Локальные видео</p>
                <p>Добавьте видео через JS или HTML</p>
            </div>
        `;
    }
    
    // YouTube
    const youtubeList = document.getElementById('youtubeList');
    if (youtubeList && youtubeList.children.length === 0) {
        youtubeList.innerHTML = `
            <div class="placeholder">
                <p>YouTube видео</p>
                <p>Добавьте YouTube видео через JS</p>
            </div>
        `;
    }

    // Фото
    const photoGallery = document.getElementById('photoGallery');
    if (photoGallery) {
        photoGallery.innerHTML = `
            <div class="placeholder">
                <p>Фотогалерея</p>
                <p>Добавьте фотографии через JS или HTML</p>
            </div>
        `;
    }

    // Библиотека
    const libraryContent = document.getElementById('libraryContent');
    if (libraryContent) {
        libraryContent.innerHTML = `
            <div class="placeholder">
                <p>Библиотека материалов</p>
                <p>Добавьте материалы через JS или HTML</p>
            </div>
        `;
    }
}

// Звуковые эффекты
let soundEnabled = true;
let audioContext = null;

function initAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('AudioContext не поддерживается');
    }
}

function initSoundEffects() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
            // Инициализируем AudioContext при первом клике
            if (!audioContext && soundEnabled) {
                initAudioContext();
            }
            playSound('click');
        });
    }
    
    // Инициализируем AudioContext при первом взаимодействии пользователя
    document.addEventListener('click', () => {
        if (!audioContext) {
            initAudioContext();
        }
    }, { once: true });
}

function playSound(type) {
    if (!soundEnabled || !audioContext) return;
    
    // Проверяем состояние AudioContext (может быть suspended)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch(type) {
            case 'click':
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'hover':
                oscillator.frequency.value = 600;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
        }
    } catch (e) {
        console.warn('Ошибка воспроизведения звука:', e);
    }
}

// Добавление звукового эффекта при наведении на карточки
document.querySelectorAll('.content-card, .nav-link').forEach(element => {
    element.addEventListener('mouseenter', () => {
        playSound('hover');
    });
});

// Функции для добавления контента (можно расширить)
function addLink(url, title, description) {
    const linksContent = document.getElementById('linksContent');
    if (!linksContent) return;
    
    // Удаляем placeholder если он есть
    const placeholder = linksContent.querySelector('.placeholder');
    if (placeholder) {
        linksContent.innerHTML = '';
    }
    
    const item = document.createElement('div');
    item.className = 'library-item';
    item.innerHTML = `
        <h3>${title || 'Ссылка'}</h3>
        <p>${description || ''}</p>
        <a href="${url}" target="_blank" class="library-link">Открыть →</a>
    `;
    
    // Добавляем обработчик клика
    item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('library-link')) {
            playSound('click');
        }
    });
    
    linksContent.appendChild(item);
}

function addAudioTrack(src, title, duration) {
    const audioList = document.getElementById('audioList');
    if (!audioList) return;
    
    // Удаляем placeholder если он есть
    const placeholder = audioList.querySelector('.placeholder');
    if (placeholder) {
        audioList.innerHTML = '';
    }
    
    const item = document.createElement('div');
    item.className = 'audio-item';
    item.innerHTML = `
        <div>
            <div class="audio-item-title">${title}</div>
            <div class="audio-item-duration">${duration || '0:00'}</div>
        </div>
    `;
    item.addEventListener('click', () => {
        loadAudio(src, title);
        document.querySelectorAll('.audio-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        playSound('click');
    });
    audioList.appendChild(item);
}

function addVideo(src, title) {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;
    
    // Удаляем placeholder если он есть
    const placeholder = videoGrid.querySelector('.placeholder');
    if (placeholder) {
        videoGrid.innerHTML = '';
    }
    
    const item = document.createElement('div');
    item.className = 'video-item';
    item.style.cursor = 'pointer';
    
    // Создаем превью видео
    const video = document.createElement('video');
    video.src = src;
    video.preload = 'metadata';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    
    // Загружаем превью при загрузке метаданных
    video.addEventListener('loadedmetadata', () => {
        video.currentTime = 1; // Переходим на 1 секунду для превью
    });
    
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'position: absolute; bottom: 10px; left: 10px; color: white; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 3px; pointer-events: none;';
    titleDiv.textContent = title;
    
    // Иконка play поверх видео
    const playIcon = document.createElement('div');
    playIcon.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; color: white; text-shadow: 0 0 10px rgba(0,0,0,0.8); pointer-events: none; z-index: 2;';
    playIcon.textContent = '▶';
    
    item.appendChild(video);
    item.appendChild(titleDiv);
    item.appendChild(playIcon);
    
    // Открываем видео в модальном окне при клике
    item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.showVideoModal) {
            window.showVideoModal(src, title);
        } else {
            // Если модальное окно для видео еще не создано, создаем его
            initVideoModal();
            setTimeout(() => {
                if (window.showVideoModal) {
                    window.showVideoModal(src, title);
                }
            }, 100);
        }
        playSound('click');
    });
    
    videoGrid.appendChild(item);
}

function addPhoto(src, alt) {
    const photoGallery = document.getElementById('photoGallery');
    if (!photoGallery) return;
    
    // Удаляем placeholder если он есть
    const placeholder = photoGallery.querySelector('.placeholder');
    if (placeholder) {
        photoGallery.innerHTML = '';
    }
    
    const item = document.createElement('div');
    item.className = 'photo-item';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.loading = 'lazy';
    
    // Обработка ошибок загрузки - просто скрываем элемент
    img.onerror = function() {
        item.style.display = 'none';
    };
    
    item.appendChild(img);
    
    // Добавляем обработчик клика для открытия в модальном окне
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Проверяем, что модальное окно инициализировано
        if (window.showImageModal) {
            window.showImageModal(src, alt || '');
        } else {
            // Если модальное окно еще не готово, пробуем инициализировать
            console.warn('Модальное окно еще не инициализировано, пробуем инициализировать...');
            initModals();
            // Пробуем еще раз через небольшую задержку
            setTimeout(() => {
                if (window.showImageModal) {
                    window.showImageModal(src, alt || '');
                } else {
                    console.error('Не удалось открыть модальное окно');
                }
            }, 100);
        }
    };
    
    item.addEventListener('click', handleClick);
    img.addEventListener('click', handleClick);
    
    // Убеждаемся, что элемент кликабелен
    item.style.cursor = 'pointer';
    item.style.pointerEvents = 'auto';
    img.style.pointerEvents = 'auto';
    
    photoGallery.appendChild(item);
}

function addLibraryItem(title, description, link) {
    const libraryContent = document.getElementById('libraryContent');
    if (!libraryContent) return;
    
    // Удаляем placeholder если он есть
    const placeholder = libraryContent.querySelector('.placeholder');
    if (placeholder) {
        libraryContent.innerHTML = '';
    }
    
    const item = document.createElement('div');
    item.className = 'library-item';
    item.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        ${link ? `<a href="${link}" target="_blank" class="library-link">Открыть →</a>` : ''}
    `;
    
    // Добавляем обработчик клика
    item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('library-link')) {
            playSound('click');
        }
    });
    
    libraryContent.appendChild(item);
}

// Модальные окна для просмотра изображений
function initModals() {
    // Проверяем, не создано ли уже модальное окно
    if (document.querySelector('.modal')) {
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img class="modal-image" src="" alt="">
            <div class="modal-caption"></div>
        </div>
    `;
    document.body.appendChild(modal);
    initImageModal(modal);
}

// Инициализация модального окна для изображений
function initImageModal(modal) {
    const modalImage = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalClose = modal.querySelector('.modal-close');
    const modalContent = modal.querySelector('.modal-content');

    // Закрытие модального окна
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        playSound('click');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            playSound('click');
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Сохраняем модальное окно в глобальной области
    window.imageModal = modal;
    window.showImageModal = (src, alt) => {
        console.log('showImageModal вызвана с src:', src, 'alt:', alt);
        
        // Удаляем предыдущее сообщение об ошибке если есть
        const existingError = modalContent.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Показываем модальное окно сразу
        modal.classList.add('active');
        modalCaption.textContent = alt || '';
        
        // Показываем индикатор загрузки
        modalImage.style.opacity = '0';
        modalImage.style.display = 'block';
        modalImage.style.width = 'auto';
        modalImage.style.height = 'auto';
        modalImage.style.maxWidth = 'none';
        modalImage.style.maxHeight = 'none';
        modalImage.style.objectFit = 'contain';
        
        // Используем оригинальный путь для максимального качества
        // Убеждаемся, что путь правильный (если путь начинается с photo/, оставляем как есть)
        let fullImageSrc = src;
        if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('./')) {
            // Если путь относительный и не начинается с точки или слеша, оставляем как есть
            // (уже должен быть правильным из JSON)
        }
        
        console.log('Загружаем изображение:', fullImageSrc);
        
        // Сбрасываем предыдущее изображение
        modalImage.src = '';
        
        modalImage.onload = function() {
            console.log('Изображение загружено успешно');
            this.style.opacity = '1';
            
            // Вычисляем оптимальный размер для просмотра
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const padding = 40; // Отступы от краев
            const maxWidth = viewportWidth - padding;
            const maxHeight = viewportHeight - padding - 100; // Учитываем место для caption и кнопки
            
            let displayWidth = this.naturalWidth;
            let displayHeight = this.naturalHeight;
            
            // Если изображение больше экрана, масштабируем
            if (displayWidth > maxWidth || displayHeight > maxHeight) {
                const ratio = Math.min(maxWidth / displayWidth, maxHeight / displayHeight);
                displayWidth = displayWidth * ratio;
                displayHeight = displayHeight * ratio;
            }
            
            this.style.width = displayWidth + 'px';
            this.style.height = displayHeight + 'px';
            this.style.maxWidth = maxWidth + 'px';
            this.style.maxHeight = maxHeight + 'px';
        };
        
        modalImage.onerror = function() {
            console.error('Ошибка загрузки изображения:', fullImageSrc);
            // Если изображение не загрузилось, скрываем его и показываем сообщение
            this.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.2rem;';
            errorMsg.textContent = 'Изображение не найдено: ' + fullImageSrc;
            modalContent.insertBefore(errorMsg, modalImage);
        };
        
        // Загружаем изображение
        modalImage.src = fullImageSrc;
        playSound('click');
    };
}

// Инициализация модального окна для видео
function initVideoModal(modal) {
    const modalVideo = modal.querySelector('.modal-video');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalClose = modal.querySelector('.modal-close');
    const modalContent = modal.querySelector('.modal-content');

    // Закрытие модального окна
    modalClose.addEventListener('click', () => {
        modalVideo.pause();
        modalVideo.src = '';
        modal.classList.remove('active');
        playSound('click');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modalVideo.pause();
            modalVideo.src = '';
            modal.classList.remove('active');
            playSound('click');
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modalVideo.pause();
            modalVideo.src = '';
            modal.classList.remove('active');
        }
    });

    // Сохраняем функцию для показа видео
    window.showVideoModal = (src, title) => {
        console.log('showVideoModal вызвана с src:', src, 'title:', title);
        
        modalCaption.textContent = title || '';
        modalVideo.src = src;
        modal.classList.add('active');
        playSound('click');
    };
}

// Инициализация кнопки покупки
function initShopButton() {
    const buyButton = document.querySelector('.buy-button');
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            playSound('click');
            // Здесь можно добавить логику покупки
            alert('Функция покупки будет реализована. Здесь можно подключить платежную систему.');
        });
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Загрузка GIF баннеров в футер
function loadFooterBanners() {
    try {
        const footerBanners = document.getElementById('footerBanners');
        if (!footerBanners) {
            console.warn('Элемент footerBanners не найден');
            return;
        }
        
        // Список всех GIF баннеров 88x31 из папки banners/
        const banners = [
            { src: 'banners/z3r0s.gif', alt: 'z3r0s' },
            { src: 'banners/hoho.gif', alt: 'hoho' },
            { src: 'banners/hash_now.gif', alt: 'hash_now' },
            { src: 'banners/webpassion.gif', alt: 'webpassion' },
            { src: 'banners/winamp3.gif', alt: 'winamp3' },
            { src: 'banners/anythingbut.gif', alt: 'anythingbut' },
            { src: 'banners/php_powered.gif', alt: 'php_powered' }
        ];
        
        banners.forEach(banner => {
            try {
                const item = document.createElement('div');
                item.className = 'footer-banner-item';
                const img = document.createElement('img');
                img.src = banner.src;
                img.alt = banner.alt;
                img.loading = 'lazy';
                
                // Обработка ошибок - просто скрываем
                img.onerror = function() {
                    item.style.display = 'none';
                };
                
                item.appendChild(img);
                footerBanners.appendChild(item);
            } catch (e) {
                console.error('Ошибка добавления баннера:', e, banner);
            }
        });
    } catch (error) {
        console.error('Критическая ошибка в loadFooterBanners:', error);
    }
}

// Инициализация матричного эффекта для hero секции (Midjourney style с 3D искажениями)
function initHeroMatrix() {
    const matrixContainer = document.getElementById('heroMatrix');
    if (!matrixContainer) return;
    
    // Слова для вставки (тематика сайта)
    const codeWords = [
        'imagine', 'create', 'design', 'art', 'digital', 'code', 'matrix', 
        'system', 'data', 'pixel', 'glitch', 'cyber', 'void', 'space', 
        'render', 'generate', 'prompt', 'style', 'aesthetic', 'visual', 
        '47Chromosome', 'music', 'video', 'photo', 'breakcore', 'post-rock', 
        'experimental', 'lo-fi', 'dark', 'neon', 'synth', 'wave', 'vapor', 'dream',
        'музыка', 'визуал', 'творчество', 'арт', 'дизайн'
    ];
    
    // Получаем размеры контейнера
    const container = matrixContainer.parentElement;
    const initMatrix = () => {
        const containerWidth = container ? container.offsetWidth : window.innerWidth;
        const containerHeight = container ? container.offsetHeight : window.innerHeight;
        
        if (containerWidth > 0 && containerHeight > 0) {
            create3DMatrixWords(matrixContainer, containerWidth, containerHeight, codeWords);
        } else {
            // Если размеры еще не готовы, пробуем еще раз
            setTimeout(initMatrix, 100);
        }
    };
    
    setTimeout(initMatrix, 100);
}


function create3DMatrixWords(matrixContainer, containerWidth, containerHeight, codeWords) {
    // Очищаем контейнер
    matrixContainer.innerHTML = '';
    
    const textBlocks = [];
    const blockCount = 2; // Количество текстовых блоков
    
    // Создаем текстовые блоки, которые появляются справа и сползают влево
    for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
        const textBlock = document.createElement('div');
        textBlock.className = 'matrix-text-block';
        
        // Генерируем текст (как в книге - строки одна под другой)
        let fullText = '';
        const lineCount = 15 + Math.floor(Math.random() * 10);
        const wordsPerLine = 8 + Math.floor(Math.random() * 6);
        
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            let lineText = '';
            for (let wordIndex = 0; wordIndex < wordsPerLine; wordIndex++) {
                const word = codeWords[Math.floor(Math.random() * codeWords.length)];
                lineText += word + ' ';
            }
            fullText += lineText.trim() + '\n';
        }
        
        textBlock.textContent = fullText.trim();
        
        // Начальная позиция справа
        const startX = containerWidth + 50;
        const startY = (blockIndex * containerHeight / blockCount) + 20;
        
        // Параметры для искажения
        const speed = 0.05 + Math.random() * 0.1; // Медленная скорость сползания
        const distortionPhase = Math.random() * Math.PI * 2;
        const distortionAmplitude = 15 + Math.random() * 20;
        const rotationSpeed = (Math.random() - 0.5) * 0.2; // Медленное вращение
        
        textBlock.style.left = startX + 'px';
        textBlock.style.top = startY + 'px';
        
        textBlocks.push({
            element: textBlock,
            x: startX,
            y: startY,
            speed: speed,
            distortionPhase: distortionPhase,
            distortionAmplitude: distortionAmplitude,
            rotationSpeed: rotationSpeed,
            time: 0,
            rotation: 0
        });
        
        matrixContainer.appendChild(textBlock);
    }
    
    // Анимация сползания и искажения текста
    let animationFrame;
    const animate = () => {
        if (!matrixContainer.parentElement) {
            cancelAnimationFrame(animationFrame);
            return;
        }
        
        textBlocks.forEach((block, index) => {
            block.time += 0.016;
            block.x -= block.speed; // Медленное сползание влево
            block.rotation += block.rotationSpeed; // Медленное вращение
            
            // Если блок ушел влево, возвращаем его справа
            if (block.x < -containerWidth - 100) {
                block.x = containerWidth + 50;
                block.y = (index * containerHeight / blockCount) + 20;
                // Генерируем новый текст
                let newText = '';
                const lineCount = 15 + Math.floor(Math.random() * 10);
                const wordsPerLine = 8 + Math.floor(Math.random() * 6);
                for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
                    let lineText = '';
                    for (let wordIndex = 0; wordIndex < wordsPerLine; wordIndex++) {
                        const word = codeWords[Math.floor(Math.random() * codeWords.length)];
                        lineText += word + ' ';
                    }
                    newText += lineText.trim() + '\n';
                }
                block.element.textContent = newText.trim();
            }
            
            // Математические искажения формы текста
            // Волновое искажение по Y (расплывание)
            const waveY = Math.sin(block.time * 0.1 + block.distortionPhase) * block.distortionAmplitude;
            
            // Искажение наклона (skew) - медленное
            const skewX = Math.sin(block.time * 0.08) * 8 + Math.cos(block.time * 0.06) * 4;
            const skewY = Math.cos(block.time * 0.1) * 6 + Math.sin(block.time * 0.07) * 3;
            
            // Масштабирование (растяжение/сжатие) - расплывание
            const scaleX = 1 + Math.sin(block.time * 0.12) * 0.1;
            const scaleY = 1 + Math.cos(block.time * 0.15) * 0.08;
            
            // Искажение левого края через clip-path (не прямой край)
            const leftEdgeDistortion = Math.sin(block.time * 0.1 + block.distortionPhase) * 8;
            const leftEdgeWave = Math.cos(block.time * 0.08 + block.distortionPhase) * 5;
            
            // Применяем трансформации с искажениями
            block.element.style.transform = `
                translate(${block.x}px, ${block.y + waveY}px)
                rotate(${block.rotation}deg)
                skew(${skewX}deg, ${skewY}deg)
                scale(${scaleX}, ${scaleY})
            `;
            
            // Искажение левого края (не прямой как в книге)
            block.element.style.clipPath = `polygon(
                ${leftEdgeDistortion}% ${leftEdgeWave}%,
                100% 0%,
                100% 100%,
                ${leftEdgeDistortion + leftEdgeWave}% 100%
            )`;
            
            // Прозрачность в зависимости от позиции (расплывание)
            const opacity = Math.max(0.25, Math.min(0.6, 1 - (block.x / containerWidth) * 0.5));
            block.element.style.opacity = opacity;
        });
        
        animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Обновление при изменении размера окна
    let resizeTimeout;
    const resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (matrixContainer.parentElement) {
                cancelAnimationFrame(animationFrame);
                matrixContainer.innerHTML = '';
                initHeroMatrix();
            }
        }, 300);
    };
    window.addEventListener('resize', resizeHandler);
}

// Инициализация вкладок для видео
function initVideoTabs() {
    const tabs = document.querySelectorAll('.video-tab');
    const tabContents = document.querySelectorAll('.video-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Убираем активные классы
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Добавляем активные классы
            tab.classList.add('active');
            
            // Правильное сопоставление ID вкладок
            let targetContentId = '';
            if (targetTab === 'youtube') {
                targetContentId = 'youtubeTab';
            } else if (targetTab === 'local') {
                targetContentId = 'localVideoTab';
            }
            
            const targetContent = document.getElementById(targetContentId);
            if (targetContent) {
                targetContent.classList.add('active');
            } else {
                console.warn('Вкладка не найдена:', targetContentId);
            }
            playSound('click');
        });
    });
}

// Загрузка локальной музыки
function loadLocalMusic() {
    try {
        const audioList = document.getElementById('audioList');
        if (!audioList) {
            console.warn('Элемент audioList не найден, пробуем еще раз...');
            setTimeout(loadLocalMusic, 500);
            return;
        }
        
        console.log('Загрузка музыки, найден элемент:', audioList);
        
        // Список всех локальных аудио файлов
        const localMusic = [
            { src: 'music/Abel Korzeniowski - Evgeni\'s Waltz.mp3', title: 'Abel Korzeniowski Evgeni\'s Waltz', duration: '0:00' },
        { src: 'music/Adam Ferello - Infinity.mp3', title: 'Adam Ferello Infinity', duration: '0:00' },
        { src: 'music/Assasin`s Cred - из Асасинс Крид 2.mp3', title: 'Assasin`s Cred из Асасинс Крид 2', duration: '0:00' },
        { src: 'music/Ben Howard - Oats In The Water.mp3', title: 'Ben Howard Oats In The Water', duration: '0:00' },
        { src: 'music/Blanck Mass - Ranger Gary.mp3', title: 'Blanck Mass Ranger Gary', duration: '0:00' },
        { src: 'music/Bobby Vinton - Mr. Lonely.mp3', title: 'Bobby Vinton Mr. Lonely', duration: '0:00' },
        { src: 'music/Buster Poindexter - Hit the Road Jack.mp3', title: 'Buster Poindexter Hit the Road Jack', duration: '0:00' },
        { src: 'music/Caesars - Jerk It Out.mp3', title: 'Caesars Jerk It Out', duration: '0:00' },
        { src: 'music/Calvin Harris - My Way.mp3', title: 'Calvin Harris My Way', duration: '0:00' },
        { src: 'music/Clair De Lune - The Evil Within - 2014 Soundtrack OST.mp3', title: 'Clair De Lune The Evil Within 2014 Soundtrack OST', duration: '0:00' },
        { src: 'music/Clint Mansell - Lux Aeterna (OST Requiem for a Dream) - Вечный свет (ОСТ Реквием по мечте) оригинальная.mp3', title: 'Clint Mansell Lux Aeterna (OST Requiem for a Dream) Вечный свет (ОСТ Реквием по мечте) оригинальная', duration: '0:00' },
        { src: 'music/Clint Mansell - Robbo\'s Theme.mp3', title: 'Clint Mansell Robbo\'s Theme', duration: '0:00' },
        { src: 'music/Daft Punk - Instant Crush.mp3', title: 'Daft Punk Instant Crush', duration: '0:00' },
        { src: 'music/Dvar - ariil iaat.mp3', title: 'Dvar ariil iaat', duration: '0:00' },
        { src: 'music/Erik Satie - Gymnopedia №1.mp3', title: 'Erik Satie Gymnopedia №1', duration: '0:00' },
        { src: 'music/Fall Out Boy - I Don\'t Care (Album Version).mp3', title: 'Fall Out Boy I Don\'t Care (Album Version)', duration: '0:00' },
        { src: 'music/Film Soundtracks, SoundtrackCast Album, Best Movie Soundtracks, TV Theme Players - Mad World (From Donnie Darko).mp3', title: 'Film Soundtracks, SoundtrackCast Album, Best Movie Soundtracks, TV Theme Players Mad World (From Donnie Darko)', duration: '0:00' },
        { src: 'music/HIM - Gone With The Sin.mp3', title: 'HIM Gone With The Sin', duration: '0:00' },
        { src: 'music/Hayley Williams - Simmer.mp3', title: 'Hayley Williams Simmer', duration: '0:00' },
        { src: 'music/Is Tropical - Dancing Anymore (zaycev.net).mp3', title: 'Is Tropical Dancing Anymore (zaycev.net)', duration: '0:00' },
        { src: 'music/Jackson C. Frank - My Name Is Carnival (2001 Remaster).mp3', title: 'Jackson C. Frank My Name Is Carnival (2001 Remaster)', duration: '0:00' },
        { src: 'music/Jake Chudnow - Pressed Pennies.mp3', title: 'Jake Chudnow Pressed Pennies', duration: '0:00' },
        { src: 'music/Jean-Michel Jarre, Christophe - Walking the Mile.mp3', title: 'Jean Michel Jarre, Christophe Walking the Mile', duration: '0:00' },
        { src: 'music/Jessica Curry - Mandus.mp3', title: 'Jessica Curry Mandus', duration: '0:00' },
        { src: 'music/John Murphy & Blue States - Season Song.mp3', title: 'John Murphy & Blue States Season Song', duration: '0:00' },
        { src: 'music/Jukebox - Jason.mp3', title: 'Jukebox Jason', duration: '0:00' },
        { src: 'music/Led Zeppelin - Immigrant Song (Remaster).mp3', title: 'Led Zeppelin Immigrant Song (Remaster)', duration: '0:00' },
        { src: 'music/Ludovico Einaudi - Einaudi Nuvole Bianche.mp3', title: 'Ludovico Einaudi Einaudi Nuvole Bianche', duration: '0:00' },
        { src: 'music/MGMT - Little Dark Age.mp3', title: 'MGMT Little Dark Age', duration: '0:00' },
        { src: 'music/Maxence Cyrin - Where Is My Mind.mp3', title: 'Maxence Cyrin Where Is My Mind', duration: '0:00' },
        { src: 'music/Mike Oldfield - Moonlight Shadow (Remastered).mp3', title: 'Mike Oldfield Moonlight Shadow (Remastered)', duration: '0:00' },
        { src: 'music/N3verface - Guts Theme (From Berserk).mp3', title: 'N3verface Guts Theme (From Berserk)', duration: '0:00' },
        { src: 'music/Nothing But Thieves - Graveyard Whistling.mp3', title: 'Nothing But Thieves Graveyard Whistling', duration: '0:00' },
        { src: 'music/Oliver Tree - Alien Boy.mp3', title: 'Oliver Tree Alien Boy', duration: '0:00' },
        { src: 'music/Passarella Death Squad - Just Like Sleep.mp3', title: 'Passarella Death Squad Just Like Sleep', duration: '0:00' },
        { src: 'music/Phantazo - I Scream to You God of Time.mp3', title: 'Phantazo I Scream to You God of Time', duration: '0:00' },
        { src: 'music/Porter Robinson - Goodbye To A World.mp3', title: 'Porter Robinson Goodbye To A World', duration: '0:00' },
        { src: 'music/Ramin Djawadi - Light Of The Seven (OST Игра Престолов 6 сезон 10 серия).mp3', title: 'Ramin Djawadi Light Of The Seven (OST Игра Престолов 6 сезон 10 серия)', duration: '0:00' },
        { src: 'music/Seatbelts - Rain (Demo Ver.).mp3', title: 'Seatbelts Rain (Demo Ver.)', duration: '0:00' },
        { src: 'music/Silent Partner - Ether.mp3', title: 'Silent Partner Ether', duration: '0:00' },
        { src: 'music/Skrillex ft. Damian Marley (OST Far Cry 3-Make It Burn Them - Far Cry 3.mp3', title: 'Skrillex ft. Damian Marley (OST Far Cry 3 Make It Burn Them Far Cry 3', duration: '0:00' },
        { src: 'music/Slowdive - Sugar for the Pill.mp3', title: 'Slowdive Sugar for the Pill', duration: '0:00' },
        { src: 'music/Styx - Man In The Wilderness.mp3', title: 'Styx Man In The Wilderness', duration: '0:00' },
        { src: 'music/Sufjan Stevens - Mystery of Love.mp3', title: 'Sufjan Stevens Mystery of Love', duration: '0:00' },
        { src: 'music/Sune Martin - Land of Mine (End Credits).mp3', title: 'Sune Martin Land of Mine (End Credits)', duration: '0:00' },
        { src: 'music/Tame Impala - Posthumous Forgiveness.mp3', title: 'Tame Impala Posthumous Forgiveness', duration: '0:00' },
        { src: 'music/The Handsome Family - Far from Any Road.mp3', title: 'The Handsome Family Far from Any Road', duration: '0:00' },
        { src: 'music/The Heavy - Short Change Hero.mp3', title: 'The Heavy Short Change Hero', duration: '0:00' },
        { src: 'music/The Prodigy - Firestarter.mp3', title: 'The Prodigy Firestarter', duration: '0:00' },
        { src: 'music/Yurima - River Flows in You.mp3', title: 'Yurima River Flows in You', duration: '0:00' },
        { src: 'music/[MP3DOWNLOAD.TO] Parasyte - Next To You (Anime Version)-320k.mp3', title: 'Parasyte Next To You (Anime Version) 320k', duration: '0:00' },
        { src: 'music/[MP3DOWNLOAD.TO] Silent Hill Blood Tears _Lisa\'s Theme Not Tomorrow_ (Extended)-320k.mp3', title: 'Silent Hill Blood Tears Lisa\'s Theme Not Tomorrow (Extended) 320k', duration: '0:00' },
        { src: 'music/analog mannequin - milk cassette x.mp3 - demo.mp3', title: 'analog mannequin milk cassette x.mp3 demo', duration: '0:00' },
        { src: 'music/cavetown - demons.mp3', title: 'cavetown demons', duration: '0:00' },
        { src: 'music/daniel.mp3 - green to blue (slowed + reverbed).mp3', title: 'daniel.mp3 green to blue (slowed + reverbed)', duration: '0:00' },
        { src: 'music/elevators - tsunami.mp3', title: 'elevators tsunami', duration: '0:00' },
        { src: 'music/girl in red - we fell in love in october (2).mp3', title: 'girl in red we fell in love in october (2)', duration: '0:00' },
        { src: 'music/lil death - moment.mp3', title: 'lil death moment', duration: '0:00' },
        { src: 'music/openai-fm-ash-audio.wav', title: 'openai fm ash audio', duration: '0:00' },
        { src: 'music/santo & johnny - sleep walk (slowed + reverb).mp3', title: 'santo & johnny sleep walk (slowed + reverb)', duration: '0:00' },
        { src: 'music/scott - Overcome.mp3', title: 'scott Overcome', duration: '0:00' },
        { src: 'music/tie-fighter-roar.mp3', title: 'tie fighter roar', duration: '0:00' },
        { src: 'music/xxxtentacion - revenge.mp3', title: 'xxxtentacion revenge', duration: '0:00' },
        { src: 'music/Микаэл Таривердиев - Клавесин (из к ф цена).mp3', title: 'Микаэл Таривердиев Клавесин (из к ф цена)', duration: '0:00' },
        { src: 'music/Музыка из фильма Игра престолов - Ramin Djawadi - Main Title.mp3', title: 'Музыка из фильма Игра престолов Ramin Djawadi Main Title', duration: '0:00' },
        { src: 'music/Рамин Джавади - Красная свадьба Игра престолов.mp3', title: 'Рамин Джавади Красная свадьба Игра престолов', duration: '0:00' }
        ];
        
        console.log('Всего треков для загрузки:', localMusic.length);
        localMusic.forEach((track, index) => {
            try {
        addAudioTrack(track.src, track.title, track.duration);
                if (index % 10 === 0) {
                    console.log(`Загружено треков: ${index + 1}/${localMusic.length}`);
                }
            } catch (e) {
                console.error('Ошибка добавления трека:', e, track);
            }
        });
        console.log('Все треки загружены, всего:', localMusic.length);
    } catch (error) {
        console.error('Критическая ошибка в loadLocalMusic:', error);
    }
}

// Добавление YouTube видео с обходом блокировок
function addYouTubeVideo(videoId, title, thumbnail) {
    const youtubeList = document.getElementById('youtubeList');
    if (!youtubeList) return;
    
    // Удаляем placeholder если он есть
    const placeholder = youtubeList.querySelector('.placeholder');
    if (placeholder) {
        youtubeList.innerHTML = '';
    }
    
    // Используем альтернативные сервисы для обхода блокировок
    // Invidious, Piped, или прямой embed с параметрами
    const item = document.createElement('div');
    item.className = 'youtube-item';
    
    // Используем альтернативные сервисы для обхода блокировок (VPN-прокси)
    // Список рабочих Invidious и Piped инстансов
    const embedUrls = [
        // Invidious инстансы (приоритет - обход блокировок)
        `https://invidious.io/embed/${videoId}`,
        `https://yewtu.be/embed/${videoId}`,
        `https://invidious.flokinet.to/embed/${videoId}`,
        `https://invidious.privacyredirect.com/embed/${videoId}`,
        `https://invidious.osi.kr/embed/${videoId}`,
        // Piped инстансы
        `https://piped.video/embed/${videoId}`,
        `https://piped.kavin.rocks/embed/${videoId}`,
        `https://piped.mha.fi/embed/${videoId}`,
        // Прямые YouTube embed (последний вариант)
        `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
        `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    ];
    
    let currentEmbedIndex = 0;
    let loadAttempts = 0;
    const maxLoadAttempts = embedUrls.length;
    
    const iframe = document.createElement('iframe');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.className = 'youtube-iframe';
    iframe.loading = 'lazy';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'youtube-title';
    titleDiv.textContent = title || 'YouTube видео';
    
    // Функция для загрузки следующего варианта
    const loadNextEmbed = () => {
        if (currentEmbedIndex < embedUrls.length) {
            iframe.src = embedUrls[currentEmbedIndex];
            currentEmbedIndex++;
            loadAttempts++;
        } else {
            // Если все варианты не работают, показываем ссылку
            item.innerHTML = `
                <div class="youtube-fallback">
                    <p>${title || 'YouTube видео'}</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 10px 0;">
                        Видео недоступно через прокси. Используйте VPN или откройте напрямую:
                    </p>
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="youtube-link">
                        Открыть на YouTube →
                    </a>
                    <div style="margin-top: 15px;">
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">
                            Альтернативные сервисы:
                        </p>
                        <a href="https://invidious.io/watch?v=${videoId}" target="_blank" style="color: var(--accent-cyan); margin-right: 15px;">Invidious</a>
                        <a href="https://piped.video/watch?v=${videoId}" target="_blank" style="color: var(--accent-cyan);">Piped</a>
                    </div>
                </div>
            `;
        }
    };
    
    // Обработка ошибок загрузки
    iframe.onerror = () => {
        setTimeout(loadNextEmbed, 1000); // Задержка перед следующей попыткой
    };
    
    // Проверка успешной загрузки
    iframe.onload = () => {
        // Если iframe загрузился, считаем успешным
        loadAttempts = 0;
    };
    
    // Таймаут для проверки загрузки (если iframe не загрузился за 5 секунд, пробуем следующий)
    const loadTimeout = setTimeout(() => {
        if (loadAttempts < maxLoadAttempts && currentEmbedIndex < embedUrls.length) {
            loadNextEmbed();
        }
    }, 5000);
    
    // Очищаем таймаут при успешной загрузке
    iframe.addEventListener('load', () => {
        clearTimeout(loadTimeout);
    });
    
    // Начинаем загрузку с первого варианта
    loadNextEmbed();
    
    item.appendChild(iframe);
    item.appendChild(titleDiv);
    
    youtubeList.appendChild(item);
}

// Добавление YouTube видео по URL
function addYouTubeVideoByURL(url, title) {
    // Извлекаем ID из различных форматов YouTube URL
    let videoId = '';
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/.*[?&]v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            videoId = match[1];
            break;
        }
    }
    
    if (videoId) {
        addYouTubeVideo(videoId, title);
    } else {
        console.error('Не удалось извлечь ID видео из URL:', url);
    }
}

// Загрузка локальных видео из папки video
function loadLocalVideos() {
    try {
        // Список локальных видео файлов (добавьте ваши файлы)
        const localVideos = [

    ];
        
        localVideos.forEach(video => {
            try {
                addVideo(video.src, video.title);
            } catch (e) {
                console.error('Ошибка добавления видео:', e, video);
            }
        });
    } catch (error) {
        console.error('Критическая ошибка в loadLocalVideos:', error);
    }
}

// Загрузка YouTube ссылок из файла
// Глобальный массив видео для телевизора
let tvVideos = [];
let currentVideoIndex = 0;

async function loadYouTubeLinks() {
    try {
        const channelList = document.getElementById('tvChannelList');
        const tvPlayer = document.getElementById('tvPlayer');
        const tvStatic = document.getElementById('tvStatic');
        
        if (!channelList) {
            console.warn('Элемент tvChannelList не найден, пробуем еще раз...');
            setTimeout(loadYouTubeLinks, 500);
            return;
        }
        
        if (!tvPlayer) {
            console.warn('Элемент tvPlayer не найден, пробуем еще раз...');
            setTimeout(loadYouTubeLinks, 500);
            return;
        }
        
        tvVideos = [];
    
    try {
        // Пытаемся загрузить JSON файл со ссылками
        const response = await fetch('video/youtube.json');
        if (response.ok) {
            const videos = await response.json();
            videos.forEach(video => {
                let videoId = '';
                if (video.id) {
                    videoId = video.id;
                } else if (video.url) {
                    const patterns = [
                        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
                        /youtube\.com\/.*[?&]v=([^&\n?#]+)/
                    ];
                    for (const pattern of patterns) {
                        const match = video.url.match(pattern);
                        if (match && match[1]) {
                            videoId = match[1];
                            break;
                        }
                    }
                }
                if (videoId) {
                    tvVideos.push({
                        id: videoId,
                        title: video.title || 'YouTube видео'
                    });
                }
            });
        }
    } catch (e) {
        // Игнорируем ошибку, если файл не найден
    }
    
    // Если JSON не найден, пытаемся загрузить текстовый файл со ссылками
    if (tvVideos.length === 0) {
        try {
            const response = await fetch('video/links.txt');
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));
                lines.forEach(link => {
                    const trimmedLink = link.trim();
                    if (trimmedLink && trimmedLink.includes('youtube')) {
                        // Обработка обычных ссылок на видео
                        let videoId = '';
                        const videoPatterns = [
                            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
                            /youtube\.com\/.*[?&]v=([^&\n?#]+)/
                        ];
                        for (const pattern of videoPatterns) {
                            const match = trimmedLink.match(pattern);
                            if (match && match[1]) {
                                videoId = match[1];
                                break;
                            }
                        }
                        
                        // Обработка плейлистов
                        if (!videoId) {
                            const playlistMatch = trimmedLink.match(/youtube\.com\/playlist\?list=([^&\n?#]+)/);
                            if (playlistMatch && playlistMatch[1]) {
                                // Для плейлистов используем первый видео ID или специальную обработку
                                // Пока просто добавляем как отдельное видео
                                videoId = playlistMatch[1];
                            }
                        }
                        
                        if (videoId) {
                            tvVideos.push({
                                id: videoId,
                                title: `Видео ${tvVideos.length + 1}`
                            });
                        }
                    }
                });
            }
        } catch (e) {
            console.log('Ошибка загрузки links.txt:', e);
        }
    }
    
    // Создаем список каналов (видео)
    channelList.innerHTML = '';
    tvVideos.forEach((video, index) => {
        const channelItem = document.createElement('div');
        channelItem.className = 'tv-channel-item';
        if (index === 0) {
            channelItem.classList.add('active');
        }
        channelItem.textContent = video.title || `Канал ${index + 1}`;
        channelItem.addEventListener('click', () => {
            switchToVideo(index);
        });
        channelList.appendChild(channelItem);
    });
    
        // Загружаем первое видео
        if (tvVideos.length > 0) {
            switchToVideo(0);
        } else {
            // Показываем статику, если нет видео
            if (tvStatic) {
                tvStatic.classList.add('active');
            }
        }
    } catch (error) {
        console.error('Критическая ошибка в loadYouTubeLinks:', error);
        // Пробуем еще раз через секунду
        setTimeout(loadYouTubeLinks, 1000);
    }
}

// Переключение на видео
function switchToVideo(index) {
    try {
        if (index < 0 || index >= tvVideos.length) {
            console.warn('Неверный индекс видео:', index, 'Всего видео:', tvVideos.length);
            return;
        }
        
        currentVideoIndex = index;
        const tvPlayer = document.getElementById('tvPlayer');
        const tvStatic = document.getElementById('tvStatic');
        const channelItems = document.querySelectorAll('.tv-channel-item');
        
        if (!tvPlayer) {
            console.warn('Элемент tvPlayer не найден');
            return;
        }
        
        // Обновляем активный канал
        channelItems.forEach((item, i) => {
            try {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            } catch (e) {
                console.error('Ошибка обновления канала:', e);
            }
        });
        
        // Показываем статику при переключении
        if (tvStatic) {
            tvStatic.classList.add('active');
            tvPlayer.classList.remove('loaded');
        }
        
        const video = tvVideos[index];
        if (!video || !video.id) {
            console.error('Неверные данные видео:', video);
            return;
        }
        
        // Используем альтернативные сервисы для обхода блокировок
        const embedUrls = [
            `https://invidious.io/embed/${video.id}`,
            `https://yewtu.be/embed/${video.id}`,
            `https://invidious.flokinet.to/embed/${video.id}`,
            `https://piped.video/embed/${video.id}`,
            `https://piped.kavin.rocks/embed/${video.id}`,
            `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`
        ];
        
        let currentEmbedIndex = 0;
        
        const loadVideo = () => {
            try {
                if (currentEmbedIndex < embedUrls.length) {
                    tvPlayer.src = embedUrls[currentEmbedIndex];
                    currentEmbedIndex++;
                }
            } catch (e) {
                console.error('Ошибка загрузки видео:', e);
            }
        };
        
        // Обработка успешной загрузки
        const onLoad = () => {
            try {
                if (tvStatic) {
    setTimeout(() => {
                        tvStatic.classList.remove('active');
                        tvPlayer.classList.add('loaded');
                    }, 500);
                }
                tvPlayer.removeEventListener('load', onLoad);
            } catch (e) {
                console.error('Ошибка обработки загрузки:', e);
            }
        };
        
        tvPlayer.addEventListener('load', onLoad);
        
        // Обработка ошибки - пробуем следующий сервис
        const onError = () => {
            try {
                if (currentEmbedIndex < embedUrls.length) {
                    setTimeout(loadVideo, 1000);
                }
            } catch (e) {
                console.error('Ошибка обработки ошибки загрузки:', e);
            }
        };
        
        tvPlayer.onerror = onError;
        
        // Начинаем загрузку
        loadVideo();
    } catch (error) {
        console.error('Критическая ошибка в switchToVideo:', error);
    }
}

// Загрузка фотографий из папки photo
function loadLocalPhotos() {
    try {
        const photoGallery = document.getElementById('photoGallery');
        if (!photoGallery) {
            console.warn('Элемент photoGallery не найден, пробуем еще раз...');
            setTimeout(loadLocalPhotos, 500);
            return;
        }
        
        console.log('Загрузка фото, найден элемент:', photoGallery);
        
        // Список фотографий (добавьте ваши файлы)
        // В реальном проекте это можно сделать через серверный скрипт
        // или использовать список файлов
        const localPhotos = [
            // Пример:
            // { src: 'photo/my-photo.jpg', alt: 'Описание фото' }
        ];
        
        localPhotos.forEach(photo => {
            try {
                addPhoto(photo.src, photo.alt);
            } catch (e) {
                console.error('Ошибка добавления фото:', e);
            }
        });
        
        // Альтернативный способ: загрузка через список файлов
        // Если у вас есть файл photo/list.json, можно загрузить оттуда
        console.log('Загрузка фото из photo/list.json...');
        fetch('photo/list.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Файл не найден');
                }
                return response.json();
            })
            .then(photos => {
                console.log('Получены фото из JSON:', photos);
                if (photos && Array.isArray(photos)) {
                    console.log('Всего фото для загрузки:', photos.length);
                    photos.forEach((photo, index) => {
                        try {
                            if (photo.src) {
                                addPhoto(photo.src, photo.alt || '');
                                if (index % 5 === 0) {
                                    console.log(`Загружено фото: ${index + 1}/${photos.length}`);
                                }
                            }
                        } catch (e) {
                            console.error('Ошибка добавления фото из JSON:', e, photo);
                        }
                    });
                    console.log('Все фото загружены, всего:', photos.length);
                } else {
                    console.warn('Фото не являются массивом:', photos);
                }
            })
            .catch((error) => {
                console.error('Ошибка загрузки фото из JSON:', error);
                // Файл не найден, это нормально
            });
    } catch (error) {
        console.error('Критическая ошибка в loadLocalPhotos:', error);
    }
}

// Добавление демо-контента для тестирования
function addDemoContent() {
    // Примеры изображений (используем placeholder изображения)
    setTimeout(() => {

        // Видео - примеры локальных видео
        const videoExamples = [
            { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Пример видео 1' },
            { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'Пример видео 2' }
        ];

        videoExamples.forEach(item => {
            addVideo(item.src, item.title);
        });

        // Фото - примеры
        const photoExamples = [
            { src: 'https://via.placeholder.com/400x400/ff00ff/ffffff?text=Photo+1', alt: 'Фото 1' },
            { src: 'https://via.placeholder.com/400x400/00ffff/000000?text=Photo+2', alt: 'Фото 2' },
            { src: 'https://via.placeholder.com/400x400/9d4edd/ffffff?text=Photo+3', alt: 'Фото 3' }
        ];

        // Фото загружаются из photo/list.json, не добавляем примеры
        // photoExamples.forEach(item => {
        //     addPhoto(item.src, item.alt);
        // });

        // Библиотека - примеры
        addLibraryItem('Материал 1', 'Описание первого материала', 'https://example.com');
        addLibraryItem('Материал 2', 'Описание второго материала', null);
        addLibraryItem('Материал 3', 'Описание третьего материала', 'https://example.com');
        
        // Пример YouTube видео (закомментируйте если не нужно)
        // addYouTubeVideo('dQw4w9WgXcQ', 'Пример YouTube видео');
    }, 100);
}

// Экспорт функций для использования
window.addLink = addLink;
window.addAudioTrack = addAudioTrack;
window.addVideo = addVideo;
window.addPhoto = addPhoto;
window.addLibraryItem = addLibraryItem;
window.addYouTubeVideo = addYouTubeVideo;
window.addYouTubeVideoByURL = addYouTubeVideoByURL;

