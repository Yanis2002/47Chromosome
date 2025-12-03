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
// Electric Border класс для карточки книги
class ElectricBorder {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.width = options.width || 354;
        this.height = options.height || 504;
        this.octaves = options.octaves || 10;
        this.lacunarity = options.lacunarity || 1.6;
        this.gain = options.gain || 0.6;
        this.amplitude = options.amplitude || 0.2;
        this.frequency = options.frequency || 5;
        this.baseFlatness = options.baseFlatness || 0.2;
        this.displacement = options.displacement || 60;
        this.speed = options.speed || 1;
        this.borderOffset = options.borderOffset || 60;
        this.borderRadius = options.borderRadius || 24;
        this.lineWidth = options.lineWidth || 1;
        this.color = options.color || "#ff00ff";
        this.animationId = null;
        this.time = 0;
        this.lastFrameTime = 0;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.start();
    }
    random(x) { return (Math.sin(x * 12.9898) * 43758.5453) % 1; }
    noise2D(x, y) {
        const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
        const a = this.random(i + j * 57), b = this.random(i + 1 + j * 57), c = this.random(i + (j + 1) * 57), d = this.random(i + 1 + (j + 1) * 57);
        const ux = fx * fx * (3.0 - 2.0 * fx), uy = fy * fy * (3.0 - 2.0 * fy);
        return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    }
    octavedNoise(x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time = 0, seed = 0, baseFlatness = 1.0) {
        let y = 0, amplitude = baseAmplitude, frequency = baseFrequency;
        for (let i = 0; i < octaves; i++) {
            let octaveAmplitude = amplitude;
            if (i === 0) octaveAmplitude *= baseFlatness;
            y += octaveAmplitude * this.noise2D(frequency * x + seed * 100, time * frequency * 0.3);
            frequency *= lacunarity;
            amplitude *= gain;
        }
        return y;
    }
    getRoundedRectPoint(t, left, top, width, height, radius) {
        const straightWidth = width - 2 * radius, straightHeight = height - 2 * radius, cornerArc = (Math.PI * radius) / 2;
        const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
        const distance = t * totalPerimeter;
        let accumulated = 0;
        if (distance <= accumulated + straightWidth) {
            return { x: left + radius + ((distance - accumulated) / straightWidth) * straightWidth, y: top };
        }
        accumulated += straightWidth;
        if (distance <= accumulated + cornerArc) {
            return this.getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
        }
        accumulated += cornerArc;
        if (distance <= accumulated + straightHeight) {
            return { x: left + width, y: top + radius + ((distance - accumulated) / straightHeight) * straightHeight };
        }
        accumulated += straightHeight;
        if (distance <= accumulated + cornerArc) {
            return this.getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - accumulated) / cornerArc);
        }
        accumulated += cornerArc;
        if (distance <= accumulated + straightWidth) {
            return { x: left + width - radius - ((distance - accumulated) / straightWidth) * straightWidth, y: top + height };
        }
        accumulated += straightWidth;
        if (distance <= accumulated + cornerArc) {
            return this.getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
        }
        accumulated += cornerArc;
        return this.getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - accumulated) / cornerArc);
    }
    getCornerPoint(centerX, centerY, radius, startAngle, arcLength, progress) {
        const angle = startAngle + progress * arcLength;
        return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
    }
    drawElectricBorder(currentTime = 0) {
        if (!this.canvas || !this.ctx) return;
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.time += deltaTime * this.speed;
        this.lastFrameTime = currentTime;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        const left = this.borderOffset, top = this.borderOffset;
        const borderWidth = this.canvas.width - 2 * this.borderOffset, borderHeight = this.canvas.height - 2 * this.borderOffset;
        const radius = Math.min(this.borderRadius, Math.min(borderWidth, borderHeight) / 2);
        const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
        const sampleCount = Math.floor(approximatePerimeter / 2);
        this.ctx.beginPath();
        for (let i = 0; i <= sampleCount; i++) {
            const progress = i / sampleCount;
            const point = this.getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
            const xNoise = this.octavedNoise(progress * 8, this.octaves, this.lacunarity, this.gain, this.amplitude, this.frequency, this.time, 0, this.baseFlatness);
            const yNoise = this.octavedNoise(progress * 8, this.octaves, this.lacunarity, this.gain, this.amplitude, this.frequency, this.time, 1, this.baseFlatness);
            const displacedX = point.x + xNoise * this.displacement;
            const displacedY = point.y + yNoise * this.displacement;
            if (i === 0) this.ctx.moveTo(displacedX, displacedY);
            else this.ctx.lineTo(displacedX, displacedY);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.animationId = requestAnimationFrame((time) => this.drawElectricBorder(time));
    }
    start() { this.animationId = requestAnimationFrame((time) => this.drawElectricBorder(time)); }
    stop() { if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; } }
}

// Функция для исправления путей к изображениям для GitHub Pages
function fixImagePaths() {
    const pathname = window.location.pathname;
    const hostname = window.location.hostname;
    const isGitHubPages = hostname.includes('github.io') || pathname.includes('/47Chromosome/');
    
    if (!isGitHubPages) return; // Локально не нужно исправлять
    
    // Определяем базовый путь
    let basePath = '';
    if (pathname.includes('/docs/')) {
        const docsIndex = pathname.indexOf('/docs/');
        basePath = pathname.substring(0, docsIndex + 5); // +5 для '/docs'
    } else if (pathname.includes('/47Chromosome/')) {
        const repoIndex = pathname.indexOf('/47Chromosome/');
        basePath = pathname.substring(0, repoIndex) + '/47Chromosome/docs';
    } else {
        basePath = '/47Chromosome/docs';
    }
    
    // Исправляем пути к изображениям в HTML
    const images = document.querySelectorAll('img[src^="./data/"], img[src^="data/"]');
    images.forEach(img => {
        let src = img.getAttribute('src');
        if (src.startsWith('./')) {
            src = src.substring(2);
        }
        if (!src.startsWith('/')) {
            img.setAttribute('src', `${basePath}/${src}`);
            console.log('Исправлен путь к изображению:', img.getAttribute('src'));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Исправляем пути к изображениям для GitHub Pages
    try {
        fixImagePaths();
    } catch (e) {
        console.error('Ошибка исправления путей к изображениям:', e);
    }
    
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
        
        // Проверяем доступность инстансов в фоне (не блокируя загрузку)
        try {
            console.log('Начинаем проверку доступности инстансов YouTube...');
            preCheckYouTubeInstances();
        } catch (e) {
            console.error('Ошибка проверки инстансов:', e);
        }
        
        try {
            console.log('Загрузка баннеров...');
            loadFooterBanners();
            console.log('Баннеры загружены');
        } catch (e) {
            console.error('Ошибка загрузки баннеров:', e);
        }
        
        try {
            console.log('Загрузка ссылок...');
            loadLinks();
            console.log('Ссылки загружены');
        } catch (e) {
            console.error('Ошибка загрузки ссылок:', e);
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

    // Функция переключения секций с уникальными эффектами
    const switchSection = (targetId) => {
            // Обновляем активные классы
            navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => {
            s.classList.remove('active');
            // Удаляем классы анимации для плавного переключения
            s.style.animation = 'none';
        });
            
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
let audioTracks = []; // Массив всех треков
let currentTrackIndex = -1; // Индекс текущего трека
let isShuffleActive = false; // Флаг перетасовки
let originalTrackOrder = []; // Оригинальный порядок треков для восстановления

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
            playPrevTrack();
            playSound('click');
        });
    }
    
    if (winampNext) {
        winampNext.addEventListener('click', () => {
            playNextTrack();
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
            toggleShuffle();
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
    
    // Обновляем индекс текущего трека
    const trackIndex = audioTracks.findIndex(t => t.src === src);
    if (trackIndex >= 0) {
        currentTrackIndex = trackIndex;
    }
    
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

// Загрузка ссылок (автоматизировано)
function loadLinks() {
    waitForElement('linksContent', (linksContent) => {
        console.log('Загрузка ссылок, найден элемент:', linksContent);
        loadDataFromJSON('data/links.json', (link) => {
            if (link.url) {
                addLink(link.url, link.title || '', link.description || '');
            }
        }, 'Ссылки', 5);
    });
}

// Вспомогательная функция для безопасной вставки текста (предотвращает ошибки с кавычками)
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// УНИВЕРСАЛЬНЫЕ ФУНКЦИИ ДЛЯ АВТОМАТИЗАЦИИ
// ============================================

/**
 * Ожидание появления элемента DOM с повторными попытками
 * @param {string} elementId - ID элемента
 * @param {Function} callback - Функция, которая будет вызвана когда элемент найден
 * @param {number} retryDelay - Задержка между попытками в мс (по умолчанию 500)
 * @param {number} maxRetries - Максимальное количество попыток (по умолчанию 10)
 */
function waitForElement(elementId, callback, retryDelay = 500, maxRetries = 10) {
    let retries = 0;
    const tryFind = () => {
        const element = document.getElementById(elementId);
        if (element) {
            callback(element);
        } else if (retries < maxRetries) {
            retries++;
            console.warn(`Элемент ${elementId} не найден, попытка ${retries}/${maxRetries}...`);
            setTimeout(tryFind, retryDelay);
        } else {
            console.error(`Элемент ${elementId} не найден после ${maxRetries} попыток`);
        }
    };
    tryFind();
}

/**
 * Загрузка данных из JSON файла с универсальной обработкой
 * @param {string} url - URL JSON файла
 * @param {Function} processor - Функция обработки каждого элемента массива
 * @param {string} logPrefix - Префикс для логов
 * @param {number} logInterval - Интервал логирования прогресса (каждый N-й элемент)
 */
function loadDataFromJSON(url, processor, logPrefix = 'Данные', logInterval = 5) {
    // Исправляем путь для GitHub Pages
    // Если URL не начинается с http/https, делаем его относительным от текущей директории
    let finalUrl = url;
    const pathname = window.location.pathname;
    const hostname = window.location.hostname;
    
    // Определяем, находимся ли мы на GitHub Pages
    const isGitHubPages = hostname.includes('github.io') || pathname.includes('/47Chromosome/');
    
    if (!url.startsWith('http') && !url.startsWith('/')) {
        // Определяем базовый путь
        let basePath = '';
        
        if (isGitHubPages) {
            // На GitHub Pages: путь всегда должен начинаться с /47Chromosome/docs/
            if (pathname.includes('/docs/')) {
                // Если путь содержит /docs/, берем все до /docs/ включительно
                const docsIndex = pathname.indexOf('/docs/');
                basePath = pathname.substring(0, docsIndex + 5); // +5 для включения '/docs'
            } else if (pathname.includes('/47Chromosome/')) {
                // Если путь содержит /47Chromosome/, добавляем /docs/
                const repoIndex = pathname.indexOf('/47Chromosome/');
                basePath = pathname.substring(0, repoIndex) + '/47Chromosome/docs';
            } else {
                // Если нет /docs/ и нет /47Chromosome/, добавляем /47Chromosome/docs
                basePath = '/47Chromosome/docs';
            }
        } else {
            // Локально: используем текущую директорию
            if (pathname.endsWith('.html')) {
                basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
            } else if (pathname.endsWith('/')) {
                basePath = pathname;
            } else {
                basePath = pathname + '/';
            }
        }
        
        // Формируем финальный URL
        if (basePath && !basePath.endsWith('/')) {
            basePath += '/';
        }
        
        // Если URL начинается с ./, убираем его
        if (url.startsWith('./')) {
            url = url.substring(2);
        }
        
        finalUrl = basePath ? `${basePath}${url}` : url;
    } else if (url.startsWith('./')) {
        // Если путь начинается с ./, обрабатываем его
        const cleanUrl = url.substring(2);
        if (isGitHubPages) {
            // На GitHub Pages добавляем базовый путь
            let basePath = '';
            if (pathname.includes('/docs/')) {
                const docsIndex = pathname.indexOf('/docs/');
                basePath = pathname.substring(0, docsIndex + 5);
            } else {
                basePath = '/47Chromosome/docs';
            }
            finalUrl = `${basePath}/${cleanUrl}`;
        } else {
            finalUrl = url;
        }
    }
    
    console.log(`Загрузка ${logPrefix}: ${finalUrl} (исходный URL: ${url}, pathname: ${pathname}, hostname: ${hostname})`);
    return fetch(finalUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Файл не найден: ${url}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Получены ${logPrefix} из JSON:`, data);
            if (data && Array.isArray(data)) {
                console.log(`Всего ${logPrefix.toLowerCase()} для загрузки:`, data.length);
                data.forEach((item, index) => {
                    try {
                        processor(item, index);
                        if (index % logInterval === 0 && index > 0) {
                            console.log(`Загружено ${logPrefix.toLowerCase()}: ${index + 1}/${data.length}`);
                        }
                    } catch (e) {
                        console.error(`Ошибка обработки ${logPrefix.toLowerCase()}:`, e, item);
                    }
                });
                console.log(`Все ${logPrefix.toLowerCase()} загружены, всего:`, data.length);
                return data;
            } else {
                console.warn(`${logPrefix} не являются массивом:`, data);
                return [];
            }
        })
        .catch((error) => {
            console.error(`Ошибка загрузки ${logPrefix.toLowerCase()} из JSON:`, error);
            return [];
        });
}

/**
 * Безопасное выполнение функции с обработкой ошибок
 * @param {Function} fn - Функция для выполнения
 * @param {string} errorMessage - Сообщение об ошибке
 */
function safeExecute(fn, errorMessage = 'Ошибка выполнения') {
    try {
        return fn();
    } catch (error) {
        console.error(errorMessage, error);
        return null;
    }
}

function addAudioTrack(src, title, duration) {
    const audioList = document.getElementById('audioList');
    if (!audioList) return;
    
    // Удаляем placeholder если он есть
    const placeholder = audioList.querySelector('.placeholder');
    if (placeholder) {
        audioList.innerHTML = '';
    }
    
    // Используем путь как есть - на GitHub Pages пути должны быть относительными от корня (docs/)
    // Пути вида music/file.mp3 работают и на localhost, и на GitHub Pages когда docs/ - корень сайта
    const trackIndex = audioTracks.length;
    audioTracks.push({ src, title, duration });
    if (originalTrackOrder.length === 0) {
        originalTrackOrder = [...audioTracks];
    }
    
    const item = document.createElement('div');
    item.className = 'audio-item';
    item.dataset.trackIndex = trackIndex;
    
    // Используем безопасные методы вместо innerHTML
    const container = document.createElement('div');
    const titleDiv = document.createElement('div');
    titleDiv.className = 'audio-item-title';
    titleDiv.textContent = title || '';
    const durationDiv = document.createElement('div');
    durationDiv.className = 'audio-item-duration';
    durationDiv.textContent = duration || '0:00';
    
    container.appendChild(titleDiv);
    container.appendChild(durationDiv);
    item.appendChild(container);
    
    item.addEventListener('click', () => {
        playTrack(trackIndex);
        playSound('click');
    });
    audioList.appendChild(item);
}

// Функция для воспроизведения трека по индексу
function playTrack(index) {
    if (index < 0 || index >= audioTracks.length) return;
    
    currentTrackIndex = index;
    const track = audioTracks[index];
    loadAudio(track.src, track.title);
    
    // Обновляем активный класс
    document.querySelectorAll('.audio-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Функция для переключения на следующий трек
function playNextTrack() {
    if (audioTracks.length === 0) return;
    
    if (isShuffleActive) {
        // Случайный трек
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * audioTracks.length);
        } while (nextIndex === currentTrackIndex && audioTracks.length > 1);
        playTrack(nextIndex);
    } else {
        // Следующий трек по порядку
        const nextIndex = (currentTrackIndex + 1) % audioTracks.length;
        playTrack(nextIndex);
    }
}

// Функция для переключения на предыдущий трек
function playPrevTrack() {
    if (audioTracks.length === 0) return;
    
    if (isShuffleActive) {
        // Случайный трек
        let prevIndex;
        do {
            prevIndex = Math.floor(Math.random() * audioTracks.length);
        } while (prevIndex === currentTrackIndex && audioTracks.length > 1);
        playTrack(prevIndex);
    } else {
        // Предыдущий трек по порядку
        const prevIndex = currentTrackIndex <= 0 ? audioTracks.length - 1 : currentTrackIndex - 1;
        playTrack(prevIndex);
    }
}

// Функция для перетасовки треков
function toggleShuffle() {
    isShuffleActive = !isShuffleActive;
    
    if (isShuffleActive) {
        // Перетасовываем массив
        const shuffled = [...audioTracks];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        audioTracks = shuffled;
    } else {
        // Восстанавливаем оригинальный порядок
        audioTracks = [...originalTrackOrder];
        // Обновляем индекс текущего трека
        if (currentTrackIndex >= 0) {
            const currentTrack = audioTracks.find(t => t.src === currentAudio?.src);
            if (currentTrack) {
                currentTrackIndex = audioTracks.indexOf(currentTrack);
            }
        }
    }
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
    // Безопасная установка src (автоматически экранирует специальные символы)
    // Пути вида data/video/file.mp4 работают и на localhost, и на GitHub Pages когда docs/ - корень сайта
    video.setAttribute('src', src);
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
    titleDiv.textContent = title || ''; // Используем textContent вместо innerHTML
    
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
    if (!photoGallery) {
        console.warn('photoGallery не найден при попытке добавить фото:', src);
        return;
    }
    
    // Удаляем placeholder если он есть (только при добавлении первого фото)
    if (photoGallery.children.length === 1) {
    const placeholder = photoGallery.querySelector('.placeholder');
    if (placeholder) {
        photoGallery.innerHTML = '';
        }
    }
    
    const item = document.createElement('div');
    item.className = 'photo-item';
    const img = document.createElement('img');
    // Безопасная установка src и alt (автоматически экранирует специальные символы)
    // Пути вида data/photo/file.jpg работают и на localhost, и на GitHub Pages когда docs/ - корень сайта
    img.setAttribute('src', src);
    img.setAttribute('alt', alt || '');
    img.loading = 'lazy';
    
    // Обработка ошибок загрузки - логируем и скрываем элемент
    img.onerror = function() {
        console.error('Ошибка загрузки изображения:', src);
        item.style.display = 'none';
    };
    
    // Логируем успешную загрузку
    img.onload = function() {
        console.log('Изображение загружено:', src);
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

// Модальные окна для просмотра изображений и видео
function initModals() {
    // Проверяем, не создано ли уже модальное окно для изображений
    if (!document.querySelector('.modal.image-modal')) {
        // Создаем модальное окно для изображений
    const modal = document.createElement('div');
        modal.className = 'modal image-modal';
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
    
    // Создаем модальное окно для видео
    if (!document.querySelector('.modal.video-modal')) {
        const videoModal = document.createElement('div');
        videoModal.className = 'modal video-modal';
        videoModal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <video class="modal-video" controls autoplay></video>
                <div class="modal-caption"></div>
            </div>
        `;
        document.body.appendChild(videoModal);
        initVideoModal(videoModal);
    }
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
        // Убеждаемся, что путь правильный (если путь начинается с data/photo/, оставляем как есть)
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
// Загрузка баннеров в футере (автоматизировано)
function loadFooterBanners() {
    waitForElement('footerBanners', (footerBanners) => {
        // Список всех GIF баннеров 88x31 из папки banners/
        const banners = [
            { src: 'banners/z3r0s.gif', alt: 'z3r0s' },
            { src: 'banners/hoho.gif', alt: 'hoho' },
            { src: 'banners/hash_now.gif', alt: 'hash_now' },
            { src: 'banners/webpassion.gif', alt: 'webpassion' },
            { src: 'banners/winamp3.gif', alt: 'winamp3' },
            { src: 'banners/anythingbut.gif', alt: 'anythingbut' },
            { src: 'banners/php_powered.gif', alt: 'php_powered' },
            { src: 'banners/anonymize.webp', alt: 'anonymize' },
            { src: 'banners/arizona.gif', alt: 'arizona' },
            { src: 'banners/bestviewed2.gif', alt: 'bestviewed2' },
            { src: 'banners/internetarchive.gif', alt: 'internetarchive' },
            { src: 'banners/modarchive.gif', alt: 'modarchive' },
            { src: 'banners/mysqla.webp', alt: 'mysqla' },
            { src: 'banners/notepadpp.webp', alt: 'notepadpp' },
            { src: 'banners/piracy.gif', alt: 'piracy' },
            { src: 'banners/thoughtcrimes.webp', alt: 'thoughtcrimes' }
        ];
        
        banners.forEach(banner => {
            safeExecute(() => {
                const item = document.createElement('div');
                item.className = 'footer-banner-item';
                const img = document.createElement('img');
                img.setAttribute('src', banner.src);
                img.setAttribute('alt', banner.alt);
                img.loading = 'lazy';
                
                // Обработка ошибок - просто скрываем
                img.onerror = function() {
                    item.style.display = 'none';
                };
                
                item.appendChild(img);
                footerBanners.appendChild(item);
            }, `Ошибка добавления баннера: ${banner.alt || banner.src}`);
        });
    });
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
    
    // Находим центр "WELCOME" для вращения вокруг него
    const heroTitle = document.querySelector('.hero-title');
    let welcomeCenterX = containerWidth / 2; // По умолчанию центр контейнера
    let welcomeCenterY = containerHeight / 2;
    
    if (heroTitle) {
        const titleRect = heroTitle.getBoundingClientRect();
        const containerRect = matrixContainer.getBoundingClientRect();
        // Вычисляем центр "WELCOME" относительно контейнера hero-matrix-bg
        welcomeCenterX = (titleRect.left + titleRect.width / 2) - containerRect.left;
        welcomeCenterY = (titleRect.top + titleRect.height / 2) - containerRect.top;
    }
    
    const textBlocks = [];
    const blockCount = 7; // Уменьшено количество блоков
    
    // Увеличиваем максимальный радиус орбиты, чтобы блоки могли выходить за пределы экрана
    const maxRadius = Math.max(containerWidth, containerHeight) * 0.8;
    
    // Создаем текстовые блоки, которые вращаются вокруг WELCOME
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
        
        // Параметры для орбитального движения
        const orbitRadius = 200 + Math.random() * (maxRadius - 200); // Радиус орбиты (может выходить за пределы)
        const orbitAngle = (blockIndex / blockCount) * Math.PI * 2; // Начальный угол (равномерно распределены)
        const orbitSpeed = ((0.005 + Math.random() * 0.01) * 0.5) * 0.25; // Скорость вращения по орбите (замедлена еще в 4 раза)
        const orbitDirection = Math.random() > 0.5 ? 1 : -1; // Направление вращения
        
        // Начальная позиция на орбите
        const startX = welcomeCenterX + Math.cos(orbitAngle) * orbitRadius;
        const startY = welcomeCenterY + Math.sin(orbitAngle) * orbitRadius;
        
        // Параметры для искажения
        const distortionPhase = Math.random() * Math.PI * 2;
        const distortionAmplitude = 30 + Math.random() * 40; // Увеличена амплитуда для пластичности
        const rotationSpeed = ((Math.random() - 0.5) * 0.3) * 0.5 * 0.25; // Вращение самого блока (замедлено еще в 4 раза)
        
        // Задержка появления для каждого блока (чтобы не появлялись все разом)
        const appearanceDelay = blockIndex * 0.5; // Задержка в секундах
        
        textBlock.style.left = startX + 'px';
        textBlock.style.top = startY + 'px';
        textBlock.style.opacity = '0'; // Начинаем с невидимыми
        textBlock.style.transform = 'scale(0.5)'; // Начинаем с уменьшенными
        
        // Вычисляем transform-origin относительно позиции блока
        // transform-origin работает относительно самого элемента, поэтому нужно вычислить разницу
        const transformOriginX = welcomeCenterX - startX;
        const transformOriginY = welcomeCenterY - startY;
        
        // Устанавливаем transform-origin на центр "WELCOME" относительно блока
        textBlock.style.transformOrigin = `${transformOriginX}px ${transformOriginY}px`;
        
        textBlocks.push({
            element: textBlock,
            orbitRadius: orbitRadius,
            orbitAngle: orbitAngle,
            orbitSpeed: orbitSpeed * orbitDirection,
            distortionPhase: distortionPhase,
            distortionAmplitude: distortionAmplitude,
            rotationSpeed: rotationSpeed,
            time: -appearanceDelay, // Отрицательное время для задержки появления
            rotation: 0,
            welcomeCenterX: welcomeCenterX,
            welcomeCenterY: welcomeCenterY,
            appearanceDelay: appearanceDelay
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
            
            // Плавное появление блока
            const appearanceProgress = Math.max(0, Math.min(1, (block.time + block.appearanceDelay) / 1.5));
            const appearanceScale = 0.5 + appearanceProgress * 0.5; // От 0.5 до 1.0
            const appearanceOpacity = appearanceProgress; // От 0 до 1
            
            // Орбитальное движение вокруг центра WELCOME
            block.orbitAngle += block.orbitSpeed;
            
            // Вычисляем новую позицию на орбите
            const x = block.welcomeCenterX + Math.cos(block.orbitAngle) * block.orbitRadius;
            const y = block.welcomeCenterY + Math.sin(block.orbitAngle) * block.orbitRadius;
            
            // Вращение самого блока
            block.rotation += block.rotationSpeed;
            
            // Вычисляем расстояние от центра WELCOME для пластичных искажений
            const distanceFromCenter = block.orbitRadius;
            const normalizedDistance = distanceFromCenter / 400; // Нормализуем для расчетов
            
            // Обновляем transform-origin при изменении позиции блока
            // чтобы он всегда вращался вокруг центра WELCOME
            const currentTransformOriginX = block.welcomeCenterX - x;
            const currentTransformOriginY = block.welcomeCenterY - y;
            block.element.style.transformOrigin = `${currentTransformOriginX}px ${currentTransformOriginY}px`;
            
            // Обновляем позицию элемента
            block.element.style.left = x + 'px';
            block.element.style.top = y + 'px';
            
            // Пластичные искажения формы текста вокруг WELCOME - значительно усилены
            // Волновое искажение по Y (расплывание) - очень сильное
            const waveY = Math.sin(block.time * 0.02 + block.distortionPhase) * block.distortionAmplitude * 2.5;
            const waveX = Math.cos(block.time * 0.025 + block.distortionPhase) * block.distortionAmplitude * 1.8;
            
            // Искажение наклона (skew) - очень сильное для пластичности
            const skewX = Math.sin(block.time * 0.015 + block.distortionPhase) * 35 + 
                         Math.cos(block.time * 0.012 + block.distortionPhase) * 20 +
                         Math.sin(block.orbitAngle) * 15 + 
                         Math.sin(block.time * 0.03) * 10; // Дополнительное искажение
            const skewY = Math.cos(block.time * 0.02 + block.distortionPhase) * 28 + 
                         Math.sin(block.time * 0.018 + block.distortionPhase) * 18 +
                         Math.cos(block.orbitAngle) * 12 +
                         Math.cos(block.time * 0.025) * 8;
            
            // Масштабирование (растяжение/сжатие) - очень выраженное
            const scaleX = 1 + Math.sin(block.time * 0.025 + block.distortionPhase) * 0.4 + 
                          Math.cos(block.orbitAngle * 2) * 0.2 +
                          Math.sin(block.time * 0.04) * 0.15; // Зависит от позиции
            const scaleY = 1 + Math.cos(block.time * 0.03 + block.distortionPhase) * 0.35 + 
                          Math.sin(block.orbitAngle * 2) * 0.2 +
                          Math.cos(block.time * 0.035) * 0.12;
            
            // Перспективное искажение (3D эффект)
            const perspectiveRotateX = Math.sin(block.time * 0.02 + block.distortionPhase) * 15;
            const perspectiveRotateY = Math.cos(block.time * 0.018 + block.distortionPhase) * 12;
            
            // Пластичное искажение краев через clip-path (очень сложная форма)
            const leftEdgeDistortion = Math.sin(block.time * 0.02 + block.distortionPhase) * 30 + 
                                      Math.cos(block.orbitAngle) * 15 +
                                      Math.sin(block.time * 0.03) * 10;
            const leftEdgeWave = Math.cos(block.time * 0.015 + block.distortionPhase) * 25 + 
                                Math.sin(block.orbitAngle) * 12 +
                                Math.cos(block.time * 0.025) * 8;
            const rightEdgeDistortion = Math.sin(block.time * 0.025 + block.distortionPhase) * 20 +
                                       Math.cos(block.orbitAngle * 1.5) * 10;
            const topEdgeWave = Math.cos(block.time * 0.022 + block.distortionPhase) * 18 +
                               Math.sin(block.orbitAngle) * 10;
            const bottomEdgeWave = Math.sin(block.time * 0.028 + block.distortionPhase) * 20 +
                                  Math.cos(block.orbitAngle) * 12;
            
            // Применяем трансформации с очень сильными пластичными искажениями
            block.element.style.transform = `
                perspective(1000px)
                translate3d(${waveX * appearanceScale}px, ${waveY * appearanceScale}px, ${Math.sin(block.time * 0.02) * 20}px)
                rotateX(${perspectiveRotateX}deg)
                rotateY(${perspectiveRotateY}deg)
                rotateZ(${block.rotation}deg)
                skew(${skewX}deg, ${skewY}deg)
                scale(${scaleX * appearanceScale}, ${scaleY * appearanceScale})
            `;
            
            // Пластичное искажение формы через clip-path (очень сложный многоугольник с волнистыми краями)
            const clipTopLeftX = Math.max(-10, leftEdgeDistortion);
            const clipTopLeftY = Math.max(-10, topEdgeWave);
            const clipTopRightX = Math.min(110, 100 - rightEdgeDistortion);
            const clipTopRightY = Math.max(-10, topEdgeWave + Math.sin(block.time * 0.02) * 8);
            const clipBottomRightX = Math.min(110, 100 - rightEdgeDistortion + Math.cos(block.time * 0.025) * 5);
            const clipBottomRightY = Math.min(110, 100 - bottomEdgeWave);
            const clipBottomLeftX = Math.max(-10, leftEdgeDistortion + leftEdgeWave);
            const clipBottomLeftY = Math.min(110, 100 - bottomEdgeWave + Math.sin(block.time * 0.03) * 6);
            
            block.element.style.clipPath = `polygon(${clipTopLeftX}% ${clipTopLeftY}%, ${clipTopRightX}% ${clipTopRightY}%, ${clipBottomRightX}% ${clipBottomRightY}%, ${clipBottomLeftX}% ${clipBottomLeftY}%)`;
            
            // Прозрачность с вариациями для эффекта расплывания
            const opacity = (0.4 + Math.sin(block.time * 0.12 + block.distortionPhase) * 0.2) * appearanceOpacity;
            block.element.style.opacity = Math.max(0.2, Math.min(0.7, opacity));
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

// Загрузка локальной музыки (автоматизировано)
function loadLocalMusic() {
    waitForElement('audioList', (audioList) => {
        console.log('Загрузка музыки, найден элемент:', audioList);
        
        // Список всех локальных аудио файлов
        // Используем двойные кавычки для путей с апострофами, чтобы избежать ошибок
        // Пути обновлены для новой структуры: data/music/
    const localMusic = [
            { src: "data/music/Abel Korzeniowski - Evgeni's Waltz.mp3", title: "Abel Korzeniowski Evgeni's Waltz", duration: '0:00' },
        { src: 'data/music/Adam Ferello - Infinity.mp3', title: 'Adam Ferello Infinity', duration: '0:00' },
        { src: 'data/music/Assasin`s Cred - из Асасинс Крид 2.mp3', title: 'Assasin`s Cred из Асасинс Крид 2', duration: '0:00' },
        { src: 'data/music/Ben Howard - Oats In The Water.mp3', title: 'Ben Howard Oats In The Water', duration: '0:00' },
        { src: 'data/music/Blanck Mass - Ranger Gary.mp3', title: 'Blanck Mass Ranger Gary', duration: '0:00' },
        { src: 'data/music/Bobby Vinton - Mr. Lonely.mp3', title: 'Bobby Vinton Mr. Lonely', duration: '0:00' },
        { src: 'data/music/Buster Poindexter - Hit the Road Jack.mp3', title: 'Buster Poindexter Hit the Road Jack', duration: '0:00' },
        { src: 'data/music/Caesars - Jerk It Out.mp3', title: 'Caesars Jerk It Out', duration: '0:00' },
        { src: 'data/music/Calvin Harris - My Way.mp3', title: 'Calvin Harris My Way', duration: '0:00' },
        { src: 'data/music/Clair De Lune - The Evil Within - 2014 Soundtrack OST.mp3', title: 'Clair De Lune The Evil Within 2014 Soundtrack OST', duration: '0:00' },
        { src: 'data/music/Clint Mansell - Lux Aeterna (OST Requiem for a Dream) - Вечный свет (ОСТ Реквием по мечте) оригинальная.mp3', title: 'Clint Mansell Lux Aeterna (OST Requiem for a Dream) Вечный свет (ОСТ Реквием по мечте) оригинальная', duration: '0:00' },
        { src: "data/music/Clint Mansell - Robbo's Theme.mp3", title: "Clint Mansell Robbo's Theme", duration: '0:00' },
        { src: 'data/music/Daft Punk - Instant Crush.mp3', title: 'Daft Punk Instant Crush', duration: '0:00' },
        { src: 'data/music/Dvar - ariil iaat.mp3', title: 'Dvar ariil iaat', duration: '0:00' },
        { src: 'data/music/Erik Satie - Gymnopedia №1.mp3', title: 'Erik Satie Gymnopedia №1', duration: '0:00' },
        { src: "data/music/Fall Out Boy - I Don't Care (Album Version).mp3", title: "Fall Out Boy I Don't Care (Album Version)", duration: '0:00' },
        { src: 'data/music/Film Soundtracks, SoundtrackCast Album, Best Movie Soundtracks, TV Theme Players - Mad World (From Donnie Darko).mp3', title: 'Film Soundtracks, SoundtrackCast Album, Best Movie Soundtracks, TV Theme Players Mad World (From Donnie Darko)', duration: '0:00' },
        { src: 'data/music/HIM - Gone With The Sin.mp3', title: 'HIM Gone With The Sin', duration: '0:00' },
        { src: 'data/music/Hayley Williams - Simmer.mp3', title: 'Hayley Williams Simmer', duration: '0:00' },
        { src: 'data/music/Is Tropical - Dancing Anymore (zaycev.net).mp3', title: 'Is Tropical Dancing Anymore (zaycev.net)', duration: '0:00' },
        { src: 'data/music/Jackson C. Frank - My Name Is Carnival (2001 Remaster).mp3', title: 'Jackson C. Frank My Name Is Carnival (2001 Remaster)', duration: '0:00' },
        { src: 'data/music/Jake Chudnow - Pressed Pennies.mp3', title: 'Jake Chudnow Pressed Pennies', duration: '0:00' },
        { src: 'data/music/Jean-Michel Jarre, Christophe - Walking the Mile.mp3', title: 'Jean Michel Jarre, Christophe Walking the Mile', duration: '0:00' },
        { src: 'data/music/Jessica Curry - Mandus.mp3', title: 'Jessica Curry Mandus', duration: '0:00' },
        { src: 'data/music/John Murphy & Blue States - Season Song.mp3', title: 'John Murphy & Blue States Season Song', duration: '0:00' },
        { src: 'data/music/Jukebox - Jason.mp3', title: 'Jukebox Jason', duration: '0:00' },
        { src: 'data/music/Led Zeppelin - Immigrant Song (Remaster).mp3', title: 'Led Zeppelin Immigrant Song (Remaster)', duration: '0:00' },
        { src: 'data/music/Ludovico Einaudi - Einaudi Nuvole Bianche.mp3', title: 'Ludovico Einaudi Einaudi Nuvole Bianche', duration: '0:00' },
        { src: 'data/music/MGMT - Little Dark Age.mp3', title: 'MGMT Little Dark Age', duration: '0:00' },
        { src: 'data/music/Maxence Cyrin - Where Is My Mind.mp3', title: 'Maxence Cyrin Where Is My Mind', duration: '0:00' },
        { src: 'data/music/Mike Oldfield - Moonlight Shadow (Remastered).mp3', title: 'Mike Oldfield Moonlight Shadow (Remastered)', duration: '0:00' },
        { src: 'data/music/N3verface - Guts Theme (From Berserk).mp3', title: 'N3verface Guts Theme (From Berserk)', duration: '0:00' },
        { src: 'data/music/Nothing But Thieves - Graveyard Whistling.mp3', title: 'Nothing But Thieves Graveyard Whistling', duration: '0:00' },
        { src: 'data/music/Oliver Tree - Alien Boy.mp3', title: 'Oliver Tree Alien Boy', duration: '0:00' },
        { src: 'data/music/Passarella Death Squad - Just Like Sleep.mp3', title: 'Passarella Death Squad Just Like Sleep', duration: '0:00' },
        { src: 'data/music/Phantazo - I Scream to You God of Time.mp3', title: 'Phantazo I Scream to You God of Time', duration: '0:00' },
        { src: 'data/music/Porter Robinson - Goodbye To A World.mp3', title: 'Porter Robinson Goodbye To A World', duration: '0:00' },
        { src: 'data/music/Ramin Djawadi - Light Of The Seven (OST Игра Престолов 6 сезон 10 серия).mp3', title: 'Ramin Djawadi Light Of The Seven (OST Игра Престолов 6 сезон 10 серия)', duration: '0:00' },
        { src: 'data/music/Seatbelts - Rain (Demo Ver.).mp3', title: 'Seatbelts Rain (Demo Ver.)', duration: '0:00' },
        { src: 'data/music/Silent Partner - Ether.mp3', title: 'Silent Partner Ether', duration: '0:00' },
        { src: 'data/music/Skrillex ft. Damian Marley (OST Far Cry 3-Make It Burn Them - Far Cry 3.mp3', title: 'Skrillex ft. Damian Marley (OST Far Cry 3 Make It Burn Them Far Cry 3', duration: '0:00' },
        { src: 'data/music/Slowdive - Sugar for the Pill.mp3', title: 'Slowdive Sugar for the Pill', duration: '0:00' },
        { src: 'data/music/Styx - Man In The Wilderness.mp3', title: 'Styx Man In The Wilderness', duration: '0:00' },
        { src: 'data/music/Sufjan Stevens - Mystery of Love.mp3', title: 'Sufjan Stevens Mystery of Love', duration: '0:00' },
        { src: 'data/music/Sune Martin - Land of Mine (End Credits).mp3', title: 'Sune Martin Land of Mine (End Credits)', duration: '0:00' },
        { src: 'data/music/Tame Impala - Posthumous Forgiveness.mp3', title: 'Tame Impala Posthumous Forgiveness', duration: '0:00' },
        { src: 'data/music/The Handsome Family - Far from Any Road.mp3', title: 'The Handsome Family Far from Any Road', duration: '0:00' },
        { src: 'data/music/The Heavy - Short Change Hero.mp3', title: 'The Heavy Short Change Hero', duration: '0:00' },
        { src: 'data/music/The Prodigy - Firestarter.mp3', title: 'The Prodigy Firestarter', duration: '0:00' },
        { src: 'data/music/Yurima - River Flows in You.mp3', title: 'Yurima River Flows in You', duration: '0:00' },
        { src: 'data/music/[MP3DOWNLOAD.TO] Parasyte - Next To You (Anime Version)-320k.mp3', title: 'Parasyte Next To You (Anime Version) 320k', duration: '0:00' },
        { src: "data/music/[MP3DOWNLOAD.TO] Silent Hill Blood Tears _Lisa's Theme Not Tomorrow_ (Extended)-320k.mp3", title: "Silent Hill Blood Tears Lisa's Theme Not Tomorrow (Extended) 320k", duration: '0:00' },
        { src: 'data/music/analog mannequin - milk cassette x.mp3 - demo.mp3', title: 'analog mannequin milk cassette x.mp3 demo', duration: '0:00' },
        { src: 'data/music/cavetown - demons.mp3', title: 'cavetown demons', duration: '0:00' },
        { src: 'data/music/daniel.mp3 - green to blue (slowed + reverbed).mp3', title: 'daniel.mp3 green to blue (slowed + reverbed)', duration: '0:00' },
        { src: 'data/music/elevators - tsunami.mp3', title: 'elevators tsunami', duration: '0:00' },
        { src: 'data/music/girl in red - we fell in love in october (2).mp3', title: 'girl in red we fell in love in october (2)', duration: '0:00' },
        { src: 'data/music/lil death - moment.mp3', title: 'lil death moment', duration: '0:00' },
        { src: 'data/music/openai-fm-ash-audio.wav', title: 'openai fm ash audio', duration: '0:00' },
        { src: 'data/music/santo & johnny - sleep walk (slowed + reverb).mp3', title: 'santo & johnny sleep walk (slowed + reverb)', duration: '0:00' },
        { src: 'data/music/scott - Overcome.mp3', title: 'scott Overcome', duration: '0:00' },
        { src: 'data/music/tie-fighter-roar.mp3', title: 'tie fighter roar', duration: '0:00' },
        { src: 'data/music/xxxtentacion - revenge.mp3', title: 'xxxtentacion revenge', duration: '0:00' },
        { src: 'data/music/Микаэл Таривердиев - Клавесин (из к ф цена).mp3', title: 'Микаэл Таривердиев Клавесин (из к ф цена)', duration: '0:00' },
        { src: 'data/music/Музыка из фильма Игра престолов - Ramin Djawadi - Main Title.mp3', title: 'Музыка из фильма Игра престолов Ramin Djawadi Main Title', duration: '0:00' },
        { src: 'data/music/Рамин Джавади - Красная свадьба Игра престолов.mp3', title: 'Рамин Джавади Красная свадьба Игра престолов', duration: '0:00' }
    ];
        
        console.log('Всего треков для загрузки:', localMusic.length);
        localMusic.forEach((track, index) => {
            safeExecute(() => {
        addAudioTrack(track.src, track.title, track.duration);
                if (index % 10 === 0 && index > 0) {
                    console.log(`Загружено треков: ${index + 1}/${localMusic.length}`);
                }
            }, `Ошибка добавления трека: ${track.title || track.src}`);
        });
        console.log('Все треки загружены, всего:', localMusic.length);
    });
}

/**
 * Функция для проверки доступности инстанса Invidious/Piped
 * 
 * Как найти рабочие инстансы Invidious:
 * 1. Официальный список: https://api.invidious.io/instances.json (JSON API со списком всех инстансов)
 * 2. Альтернативные источники:
 *    - Форум NTC: https://ntc.party (пользователи делятся рабочими инстансами)
 *    - Reddit: r/Invidious (обсуждения и списки инстансов)
 *    - GitHub: https://github.com/iv-org/invidious (официальный репозиторий)
 * 
 * 3. Проверка инстанса вручную:
 *    - Откройте в браузере: https://[инстанс]/api/v1/stats
 *    - Если видите JSON с данными - инстанс работает
 *    - Для embed: https://[инстанс]/embed/[VIDEO_ID]
 * 
 * 4. Хорошие инстансы обычно имеют:
 *    - Низкий пинг
 *    - Поддержку embed
 *    - Стабильную работу
 *    - Отсутствие блокировок в вашем регионе
 * 
 * Возвращает Promise, который резолвится с true если инстанс доступен, иначе false
 */
async function checkInstanceAvailability(instanceUrl) {
    try {
        // Проверяем доступность через HEAD запрос к API инстанса
        const apiUrl = instanceUrl.replace('/embed/', '/api/v1/stats');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 секунды таймаут
        
        // Пробуем сначала с CORS
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                mode: 'cors',
                signal: controller.signal,
                cache: 'no-cache'
            });
            clearTimeout(timeoutId);
            return response.status !== 0; // Если статус не 0, инстанс доступен
        } catch (corsError) {
            // Если CORS не работает, пробуем no-cors
            clearTimeout(timeoutId);
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
            
            try {
                await fetch(apiUrl, {
                    method: 'HEAD',
                    mode: 'no-cors', // Обходим CORS для проверки
                    signal: controller2.signal
                });
                clearTimeout(timeoutId2);
                return true; // Если запрос прошел без ошибок
            } catch (noCorsError) {
                clearTimeout(timeoutId2);
                return false;
            }
        }
    } catch (error) {
        // Если ошибка - инстанс недоступен
        return false;
    }
}

// Получение списка доступных инстансов с проверкой
// Использует кэш для избежания повторных проверок
const instanceAvailabilityCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

async function getAvailableInstances(baseInstances, videoId, isPlaylist = false) {
    const now = Date.now();
    const availableInstances = [];
    const unavailableInstances = [];
    
    // Проверяем каждый инстанс
    for (const instanceUrl of baseInstances) {
        const cacheKey = instanceUrl.split('/embed/')[0]; // Базовый URL инстанса
        
        // Проверяем кэш
        const cached = instanceAvailabilityCache.get(cacheKey);
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
            if (cached.available) {
                availableInstances.push(instanceUrl);
            } else {
                unavailableInstances.push(instanceUrl);
            }
            continue;
        }
        
        // Проверяем доступность
        const isAvailable = await checkInstanceAvailability(instanceUrl);
        
        // Сохраняем в кэш
        instanceAvailabilityCache.set(cacheKey, {
            available: isAvailable,
            timestamp: now
        });
        
        if (isAvailable) {
            availableInstances.push(instanceUrl);
        } else {
            unavailableInstances.push(instanceUrl);
        }
    }
    
    // Возвращаем сначала доступные, потом недоступные (на случай если проверка была неточной)
    return [...availableInstances, ...unavailableInstances];
}

// Предварительная проверка доступности инстансов YouTube в фоне
// Проверяет только первые несколько инстансов, чтобы не блокировать загрузку
async function preCheckYouTubeInstances() {
    // Базовые URL инстансов для проверки (без /embed/)
    const baseInstances = [
        'https://invidious.nerdvpn.de',
        'https://inv.perditum.com',
        'https://invidious.io',
        'https://invidious.flokinet.to',
        'https://invidious.privacyredirect.com',
        'https://invidious.osi.kr',
        'https://invidious.slipfox.xyz',
        'https://nyc1.iv.ggtyler.dev',
        'https://cal1.iv.ggtyler.dev',
        'https://pol1.iv.ggtyler.dev',
        'https://piped.data',
        'https://piped.kavin.rocks',
        'https://piped.mha.fi'
    ];
    
    console.log(`Проверяем ${baseInstances.length} инстансов...`);
    
    // Проверяем инстансы параллельно, но с ограничением (не более 5 одновременно)
    const batchSize = 5;
    let availableCount = 0;
    let unavailableCount = 0;
    
    for (let i = 0; i < baseInstances.length; i += batchSize) {
        const batch = baseInstances.slice(i, i + batchSize);
        await Promise.all(
            batch.map(async (baseUrl) => {
                try {
                    // Пробуем несколько способов проверки
                    const testUrls = [
                        `${baseUrl}/api/v1/stats`,
                        `${baseUrl}/api/v1/trending`
                    ];
                    
                    let isAvailable = false;
                    for (const testUrl of testUrls) {
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 2000);
                            
                            // Пробуем с cors, если не работает - пробуем no-cors
                            const response = await fetch(testUrl, {
                                method: 'GET',
                                mode: 'cors',
                                signal: controller.signal,
                                cache: 'no-cache'
                            }).catch(() => null); // Игнорируем ошибки CORS
                            
                            clearTimeout(timeoutId);
                            
                            // Если получили ответ (даже с ошибкой CORS), инстанс доступен
                            if (response && response.status !== 0) {
                                isAvailable = true;
                                break;
                            }
                        } catch (corsError) {
                            // Если CORS не работает, пробуем no-cors
                            try {
                                const controller2 = new AbortController();
                                const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
                                
                                await fetch(testUrl, {
                                    method: 'HEAD',
                                    mode: 'no-cors',
                                    signal: controller2.signal
                                }).catch(() => null); // Игнорируем ошибки сети
                                
                                clearTimeout(timeoutId2);
                                // Если запрос прошел без ошибки abort, считаем доступным
                                isAvailable = true;
                                break;
                            } catch (noCorsError) {
                                // Продолжаем проверку следующего URL
                                continue;
                            }
                        }
                    }
                    
                    // Сохраняем в кэш
                    instanceAvailabilityCache.set(baseUrl, {
                        available: isAvailable,
                        timestamp: Date.now()
                    });
                    
                    if (isAvailable) {
                        availableCount++;
                        console.log(`✓ ${baseUrl} - доступен`);
                    } else {
                        unavailableCount++;
                        // Не логируем недоступные инстансы, чтобы не засорять консоль
                    }
                } catch (error) {
                    // Сохраняем в кэш как недоступный
                    instanceAvailabilityCache.set(baseUrl, {
                        available: false,
                        timestamp: Date.now()
                    });
                    unavailableCount++;
                    // Не логируем ошибки, чтобы не засорять консоль
                }
            })
        );
        
        // Небольшая задержка между батчами
        if (i + batchSize < baseInstances.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    console.log(`Проверка инстансов завершена: ${availableCount} доступны, ${unavailableCount} недоступны`);
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
    
    // Используем расширенный список зеркал YouTube для обхода блокировки в России
    // Список регулярно обновляется на основе доступности инстансов
    let embedUrls = [
        // Официальные публичные инстансы Invidious (проверенные рабочие)
        `https://invidious.nerdvpn.de/embed/${videoId}`,
        `https://inv.perditum.com/embed/${videoId}`,
        // Дополнительные Invidious инстансы
        `https://invidious.io/embed/${videoId}`,
        `https://invidious.flokinet.to/embed/${videoId}`,
        `https://invidious.privacyredirect.com/embed/${videoId}`,
        `https://invidious.osi.kr/embed/${videoId}`,
        `https://invidious.slipfox.xyz/embed/${videoId}`,
        // Альтернативные инстансы (из сообщества)
        `https://nyc1.iv.ggtyler.dev/embed/${videoId}`,
        `https://cal1.iv.ggtyler.dev/embed/${videoId}`,
        `https://pol1.iv.ggtyler.dev/embed/${videoId}`,
        // Piped инстансы (альтернатива Invidious)
        `https://piped.data/video/embed/${videoId}`,
        `https://piped.kavin.rocks/embed/${videoId}`,
        `https://piped.mha.fi/embed/${videoId}`,
        `https://piped.privacyredirect.com/embed/${videoId}`,
        // Проблемные инстансы (могут быть недоступны)
        `https://invidious.f5.si/embed/${videoId}`, // ERR_QUIC_PROTOCOL_ERROR
        `https://inv.nadeko.net/embed/${videoId}`, // Может быть недоступен
        `https://yewtu.be/embed/${videoId}`, // Может быть недоступен
        // Прямые YouTube embed (последний вариант)
        `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
        `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    ];
    
    // Сортируем инстансы на основе кэша проверки (если есть)
    const now = Date.now();
    embedUrls.sort((a, b) => {
        const baseUrlA = a.split('/embed/')[0];
        const baseUrlB = b.split('/embed/')[0];
        
        const cachedA = instanceAvailabilityCache.get(baseUrlA);
        const cachedB = instanceAvailabilityCache.get(baseUrlB);
        
        // Если кэш устарел (старше 5 минут), не учитываем его
        const validA = cachedA && (now - cachedA.timestamp) < CACHE_DURATION;
        const validB = cachedB && (now - cachedB.timestamp) < CACHE_DURATION;
        
        if (validA && validB) {
            // Оба проверены: доступные идут первыми
            if (cachedA.available && !cachedB.available) return -1;
            if (!cachedA.available && cachedB.available) return 1;
            return 0;
        }
        if (validA && cachedA.available) return -1; // Проверенный доступный идет первым
        if (validB && cachedB.available) return 1;  // Проверенный доступный идет первым
        if (validA && !cachedA.available) return 1; // Проверенный недоступный идет последним
        if (validB && !cachedB.available) return -1; // Проверенный недоступный идет последним
        
        return 0; // Если оба не проверены, сохраняем порядок
    });
    
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
                        <a href="https://piped.data/video/watch?v=${videoId}" target="_blank" style="color: var(--accent-cyan);">Piped</a>
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

// Загрузка локальных видео из папки video (автоматизировано)
function loadLocalVideos() {
    // Список локальных видео файлов (добавьте ваши файлы)
    const localVideos = [];
    
    localVideos.forEach(video => {
        safeExecute(() => {
            addVideo(video.src, video.title);
        }, `Ошибка добавления видео: ${video.title || video.src}`);
    });
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
        const response = await fetch('data/video/youtube.json');
        if (response.ok) {
            const videos = await response.json();
            videos.forEach(video => {
                // Проверяем, является ли это плейлистом
                if (video.isPlaylist && video.id) {
                    tvVideos.push({
                        id: video.id,
                        title: video.title || 'YouTube плейлист',
                        isPlaylist: true
                    });
                } else {
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
                }
            });
        }
    } catch (e) {
        // Игнорируем ошибку, если файл не найден
    }
    
    // Если JSON не найден, пытаемся загрузить текстовый файл со ссылками
    if (tvVideos.length === 0) {
        try {
            const response = await fetch('data/video/links.txt');
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));
                for (const link of lines) {
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
                                // Для плейлистов добавляем как отдельный элемент
                                tvVideos.push({
                                    id: playlistMatch[1],
                                    title: `Плейлист ${tvVideos.length + 1}`,
                                    isPlaylist: true
                                });
                                continue; // Пропускаем дальнейшую обработку для плейлистов
                            }
                        }
                        
                        if (videoId) {
                            // Извлекаем название из URL если возможно
                            let videoTitle = `Видео ${tvVideos.length + 1}`;
                            
                            tvVideos.push({
                                id: videoId,
                                title: videoTitle
                            });
                        }
                    }
                }
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
        const video = tvVideos[index];
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
        
        if (!video || !video.id) {
            console.error('Неверные данные видео:', video);
            return;
        }
        
        // Если это плейлист, используем специальный URL
        if (video.isPlaylist) {
            // Для плейлистов используем расширенный список зеркал YouTube (Invidious и альтернативы)
            let embedUrls = [
                // Официальные публичные инстансы Invidious (проверенные рабочие)
                `https://invidious.nerdvpn.de/embed/videoseries?list=${video.id}`,
                `https://inv.perditum.com/embed/videoseries?list=${video.id}`,
                // Дополнительные Invidious инстансы
                `https://invidious.io/embed/videoseries?list=${video.id}`,
                `https://invidious.flokinet.to/embed/videoseries?list=${video.id}`,
                `https://invidious.privacyredirect.com/embed/videoseries?list=${video.id}`,
                `https://invidious.osi.kr/embed/videoseries?list=${video.id}`,
                `https://invidious.slipfox.xyz/embed/videoseries?list=${video.id}`,
                // Альтернативные инстансы (из сообщества)
                `https://nyc1.iv.ggtyler.dev/embed/videoseries?list=${video.id}`,
                `https://cal1.iv.ggtyler.dev/embed/videoseries?list=${video.id}`,
                `https://pol1.iv.ggtyler.dev/embed/videoseries?list=${video.id}`,
                // Piped инстансы (альтернатива Invidious)
                `https://piped.data/video/embed/videoseries?list=${video.id}`,
                `https://piped.kavin.rocks/embed/videoseries?list=${video.id}`,
                `https://piped.mha.fi/embed/videoseries?list=${video.id}`,
                `https://piped.privacyredirect.com/embed/videoseries?list=${video.id}`,
                // Проблемные инстансы (могут быть недоступны)
                `https://invidious.f5.si/embed/videoseries?list=${video.id}`, // ERR_QUIC_PROTOCOL_ERROR
                `https://inv.nadeko.net/embed/videoseries?list=${video.id}`, // Может быть недоступен
                `https://yewtu.be/embed/videoseries?list=${video.id}`, // Может быть недоступен
                // Прямые YouTube embed (последний вариант)
                `https://www.youtube.com/embed/videoseries?list=${video.id}&rel=0&modestbranding=1`,
                `https://www.youtube-nocookie.com/embed/videoseries?list=${video.id}&rel=0&modestbranding=1`
            ];
            
            // Сортируем инстансы на основе кэша проверки (если есть)
            const now = Date.now();
            embedUrls.sort((a, b) => {
                const baseUrlA = a.split('/embed/')[0];
                const baseUrlB = b.split('/embed/')[0];
                
                const cachedA = instanceAvailabilityCache.get(baseUrlA);
                const cachedB = instanceAvailabilityCache.get(baseUrlB);
                
                const validA = cachedA && (now - cachedA.timestamp) < CACHE_DURATION;
                const validB = cachedB && (now - cachedB.timestamp) < CACHE_DURATION;
                
                if (validA && validB) {
                    if (cachedA.available && !cachedB.available) return -1;
                    if (!cachedA.available && cachedB.available) return 1;
                    return 0;
                }
                if (validA && cachedA.available) return -1;
                if (validB && cachedB.available) return 1;
                if (validA && !cachedA.available) return 1;
                if (validB && !cachedB.available) return -1;
                return 0;
            });
            
            let currentEmbedIndex = 0;
            let loadAttempts = 0;
            const maxAttempts = embedUrls.length;
            
            const loadPlaylist = () => {
                if (currentEmbedIndex < embedUrls.length) {
                    console.log(`Загрузка плейлиста (попытка ${currentEmbedIndex + 1}/${maxAttempts}):`, embedUrls[currentEmbedIndex]);
                    tvPlayer.src = embedUrls[currentEmbedIndex];
                    currentEmbedIndex++;
                    loadAttempts++;
                } else {
                    console.error('Не удалось загрузить плейлист, все варианты исчерпаны');
                    if (tvStatic) {
                        tvStatic.classList.add('active');
                    }
                }
            };
            
            const onLoad = () => {
                try {
                    console.log('Плейлист успешно загружен');
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
            
            const onError = () => {
                console.warn(`Ошибка загрузки плейлиста (попытка ${loadAttempts})`);
                if (currentEmbedIndex < embedUrls.length) {
                    setTimeout(loadPlaylist, 1000);
                } else {
                    console.error('Не удалось загрузить плейлист');
                    if (tvStatic) {
                        tvStatic.classList.add('active');
                    }
                }
            };
            
            tvPlayer.addEventListener('load', onLoad, { once: true });
            tvPlayer.addEventListener('error', onError);
            
            // Таймаут для проверки загрузки
            const loadTimeout = setTimeout(() => {
                if (loadAttempts < maxAttempts && currentEmbedIndex < embedUrls.length) {
                    onError();
                }
            }, 5000);
            
            tvPlayer.addEventListener('load', () => {
                clearTimeout(loadTimeout);
            }, { once: true });
            
            loadPlaylist();
        } else {
            // Обычное видео
            // Используем расширенный список зеркал YouTube для обхода блокировки в России
            let embedUrls = [
                // Официальные публичные инстансы Invidious (проверенные рабочие)
                `https://invidious.nerdvpn.de/embed/${video.id}`,
                `https://inv.perditum.com/embed/${video.id}`,
                // Дополнительные Invidious инстансы
                `https://invidious.io/embed/${video.id}`,
                `https://invidious.flokinet.to/embed/${video.id}`,
                `https://invidious.privacyredirect.com/embed/${video.id}`,
                `https://invidious.osi.kr/embed/${video.id}`,
                `https://invidious.slipfox.xyz/embed/${video.id}`,
                // Альтернативные инстансы (из сообщества)
                `https://nyc1.iv.ggtyler.dev/embed/${video.id}`,
                `https://cal1.iv.ggtyler.dev/embed/${video.id}`,
                `https://pol1.iv.ggtyler.dev/embed/${video.id}`,
                // Piped инстансы (альтернатива Invidious)
                `https://piped.data/video/embed/${video.id}`,
                `https://piped.kavin.rocks/embed/${video.id}`,
                `https://piped.mha.fi/embed/${video.id}`,
                `https://piped.privacyredirect.com/embed/${video.id}`,
                // Проблемные инстансы (могут быть недоступны)
                `https://invidious.f5.si/embed/${video.id}`, // ERR_QUIC_PROTOCOL_ERROR
                `https://inv.nadeko.net/embed/${video.id}`, // Может быть недоступен
                `https://yewtu.be/embed/${video.id}`, // Может быть недоступен
                // Прямые YouTube embed (последний вариант)
                `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`,
                `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`
            ];
            
            // Сортируем инстансы на основе кэша проверки (если есть)
            const now = Date.now();
            embedUrls.sort((a, b) => {
                const baseUrlA = a.split('/embed/')[0];
                const baseUrlB = b.split('/embed/')[0];
                
                const cachedA = instanceAvailabilityCache.get(baseUrlA);
                const cachedB = instanceAvailabilityCache.get(baseUrlB);
                
                const validA = cachedA && (now - cachedA.timestamp) < CACHE_DURATION;
                const validB = cachedB && (now - cachedB.timestamp) < CACHE_DURATION;
                
                if (validA && validB) {
                    if (cachedA.available && !cachedB.available) return -1;
                    if (!cachedA.available && cachedB.available) return 1;
                    return 0;
                }
                if (validA && cachedA.available) return -1;
                if (validB && cachedB.available) return 1;
                if (validA && !cachedA.available) return 1;
                if (validB && !cachedB.available) return -1;
                return 0;
            });
            
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
        }
    } catch (error) {
        console.error('Критическая ошибка в switchToVideo:', error);
    }
}

// Загрузка фотографий из папки photo (автоматизировано)
function loadLocalPhotos() {
    const photoGallery = document.getElementById('photoGallery');
    
    if (!photoGallery) {
        console.warn('Элемент photoGallery не найден, пробуем через waitForElement...');
    waitForElement('photoGallery', (photoGallery) => {
        console.log('Загрузка фото, найден элемент:', photoGallery);
            loadPhotosData(photoGallery);
        }, 500, 20); // Увеличиваем количество попыток
        return;
    }
    
    console.log('Загрузка фото, элемент найден сразу:', photoGallery);
    loadPhotosData(photoGallery);
}

function loadPhotosData(photoGallery) {
    if (!photoGallery) {
        console.error('loadPhotosData: photoGallery не передан');
        return;
    }
    
    console.log('loadPhotosData: начинаем загрузку фотографий');
    
    // Удаляем placeholder если он есть
    const placeholder = photoGallery.querySelector('.placeholder');
    if (placeholder) {
        console.log('loadPhotosData: удаляем placeholder');
        photoGallery.innerHTML = '';
    }
        
        // Загрузка фото из JSON файла
        loadDataFromJSON('data/photo/list.json', (photo) => {
        if (photo && photo.src) {
            // Исправляем путь для GitHub Pages
            let photoSrc = photo.src;
            const pathname = window.location.pathname;
            const hostname = window.location.hostname;
            const isGitHubPages = hostname.includes('github.io') || pathname.includes('/47Chromosome/');
            
            // Если путь не абсолютный и не начинается с /, исправляем его
            if (!photoSrc.startsWith('http') && !photoSrc.startsWith('/')) {
                if (isGitHubPages) {
                    // На GitHub Pages: добавляем базовый путь
                    if (pathname.includes('/docs/')) {
                        const docsIndex = pathname.indexOf('/docs/');
                        const basePath = pathname.substring(0, docsIndex + 5); // +5 для '/docs'
                        photoSrc = `${basePath}/${photoSrc}`;
                    } else if (pathname.includes('/47Chromosome/')) {
                        const repoIndex = pathname.indexOf('/47Chromosome/');
                        photoSrc = `${pathname.substring(0, repoIndex)}/47Chromosome/docs/${photoSrc}`;
                    } else {
                        photoSrc = `/47Chromosome/docs/${photoSrc}`;
                    }
                } else {
                    // Локально: добавляем ./ если нужно
                    if (!photoSrc.startsWith('./')) {
                        photoSrc = `./${photoSrc}`;
                    }
                }
            }
            
            console.log('loadPhotosData: добавляем фото:', photoSrc, '(исходный путь:', photo.src, ')');
            addPhoto(photoSrc, photo.alt || '');
        } else {
            console.warn('loadPhotosData: пропущено фото без src:', photo);
            }
    }, 'Фото', 5).then((data) => {
        console.log('loadPhotosData: загрузка завершена, загружено фото:', data ? data.length : 0);
        // Проверяем, что хотя бы одно фото загрузилось
        if (photoGallery && photoGallery.children.length === 0) {
            console.warn('loadPhotosData: ни одно фото не загружено');
            photoGallery.innerHTML = `
                <div class="placeholder">
                    <p>Фотогалерея</p>
                    <p>Фотографии не найдены. Проверьте файл data/photo/list.json</p>
                </div>
            `;
        }
    }).catch((error) => {
        console.error('Ошибка загрузки фотографий:', error);
        // Показываем сообщение об ошибке
        if (photoGallery) {
            photoGallery.innerHTML = `
                <div class="placeholder">
                    <p>Ошибка загрузки фотографий</p>
                    <p>${error.message || 'Проверьте консоль браузера для деталей'}</p>
                </div>
            `;
        }
    });
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

        // Фото загружаются из data/data/photo/list.json, не добавляем примеры
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

