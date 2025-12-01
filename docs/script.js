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
    initModals(); // Сначала создаем модальное окно
    initNavigation();
    initAudioPlayer();
    initContentCards();
    initPlaceholders();
    initSoundEffects();
    initShopButton();
    initSmoothScroll();
    initVideoTabs();
    initHeroMatrix(); // Инициализируем матричный эффект для hero
    // Загружаем локальную музыку
    loadLocalMusic();
    // Загружаем видео из папки
    loadLocalVideos();
    // Загружаем фото из папки
    loadLocalPhotos();
    // Загружаем YouTube ссылки из папки
    loadYouTubeLinks();
    // Загружаем GIF баннеры в футер
    loadFooterBanners();
    // Добавляем примеры контента для демонстрации
    addDemoContent();
});

// Инициализируем AudioContext при загрузке
initAudioContext();

// Навигация
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Обновляем активные классы
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            link.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                playSound('click');
            }
        });
    });
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

function loadAudio(src, title) {
    const audioElement = document.getElementById('audioElement');
    const playerTitle = document.getElementById('playerTitle');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');

    audioElement.src = src;
    playerTitle.textContent = title;
    audioPlayer.classList.add('active');
    currentAudio = src;
    
    // Загружаем метаданные для определения длительности
    audioElement.addEventListener('loadedmetadata', () => {
        updateTimeDisplay();
    }, { once: true });
    
    audioElement.load();
    playSound('click');
    
    // Автоматически начинаем воспроизведение
    audioElement.play().then(() => {
        playPauseBtn.textContent = '⏸';
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
    // Эстетика
    const aestheticGallery = document.getElementById('aestheticGallery');
    if (aestheticGallery) {
        aestheticGallery.innerHTML = `
            <div class="placeholder">
                <p>Галерея эстетики</p>
                <p>Добавьте изображения через JS или HTML</p>
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
function addAestheticImage(src, alt) {
    const gallery = document.getElementById('aestheticGallery');
    if (!gallery) return;
    
    // Удаляем placeholder если он есть
    const placeholder = gallery.querySelector('.placeholder');
    if (placeholder) {
        gallery.innerHTML = '';
    }
    
    const item = document.createElement('div');
    item.className = 'gallery-item';
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
    item.addEventListener('click', () => {
        if (window.showImageModal) {
            // Пробуем загрузить изображение, даже если оно еще не загружено
            window.showImageModal(src, alt || '');
        }
    });
    
    gallery.appendChild(item);
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
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'position: absolute; bottom: 10px; left: 10px; color: white; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 3px; pointer-events: none;';
    titleDiv.textContent = title;
    
    item.appendChild(video);
    item.appendChild(titleDiv);
    
    // Добавляем звуковой эффект при клике
    item.addEventListener('click', () => {
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
    item.addEventListener('click', () => {
        if (window.showImageModal) {
            // Пробуем загрузить изображение, даже если оно еще не загружено
            window.showImageModal(src, alt || '');
        }
    });
    
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

    const modalImage = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalClose = modal.querySelector('.modal-close');

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
        // Удаляем предыдущее сообщение об ошибке если есть
        const existingError = modalContent.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Показываем модальное окно сразу
        modal.classList.add('active');
        modalCaption.textContent = alt || '';
        
        // Загружаем изображение в полном разрешении
        modalImage.style.opacity = '0';
        modalImage.style.display = 'block';
        
        // Используем оригинальный путь без изменений для максимального качества
        const fullImageSrc = src;
        
        modalImage.onload = function() {
            this.style.opacity = '1';
            // Увеличиваем размер для лучшего просмотра
            if (this.naturalWidth > 0 && this.naturalHeight > 0) {
                const maxWidth = window.innerWidth * 0.95;
                const maxHeight = window.innerHeight * 0.95;
                const ratio = Math.min(maxWidth / this.naturalWidth, maxHeight / this.naturalHeight);
                this.style.width = (this.naturalWidth * ratio) + 'px';
                this.style.height = (this.naturalHeight * ratio) + 'px';
            }
        };
        
        modalImage.onerror = function() {
            // Если изображение не загрузилось, скрываем его и показываем сообщение
            this.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'text-align: center; color: var(--text-secondary); padding: 40px; font-size: 1.2rem;';
            errorMsg.textContent = 'Изображение не найдено';
            modalContent.insertBefore(errorMsg, modalImage);
        };
        
        modalImage.src = fullImageSrc;
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
    const footerBanners = document.getElementById('footerBanners');
    if (!footerBanners) return;
    
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
        'эстетика', 'музыка', 'визуал', 'творчество', 'арт', 'дизайн'
    ];
    
    // Получаем размеры контейнера
    const container = matrixContainer.parentElement;
    setTimeout(() => {
        const containerWidth = container.offsetWidth || window.innerWidth;
        const containerHeight = container.offsetHeight || 500;
        create3DMatrixWords(matrixContainer, containerWidth, containerHeight, codeWords);
    }, 100);
}

function create3DMatrixWords(matrixContainer, containerWidth, containerHeight, codeWords) {
    const textLines = [];
    const lineCount = 20 + Math.floor(Math.random() * 15);
    const wordsPerLine = 10 + Math.floor(Math.random() * 8);
    
    // Создаем текст как в книге - строки одна под другой
    const textContainer = document.createElement('div');
    textContainer.className = 'matrix-text-container';
    
    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
        const lineElement = document.createElement('div');
        lineElement.className = 'matrix-text-line';
        
        let lineText = '';
        // Создаем слова для строки
        for (let wordIndex = 0; wordIndex < wordsPerLine; wordIndex++) {
            const word = codeWords[Math.floor(Math.random() * codeWords.length)];
            lineText += word + ' ';
        }
        
        lineElement.textContent = lineText.trim();
        
        // Параметры для искажения формы каждой строки
        const wavePhase = Math.random() * Math.PI * 2;
        const waveAmplitude = 15 + Math.random() * 25;
        const waveFrequency = 0.008 + Math.random() * 0.015;
        const skewAmount = (Math.random() - 0.5) * 15;
        const perspectiveAmount = 400 + Math.random() * 400;
        
        textLines.push({
            element: lineElement,
            wavePhase: wavePhase,
            waveAmplitude: waveAmplitude,
            waveFrequency: waveFrequency,
            skewAmount: skewAmount,
            perspectiveAmount: perspectiveAmount,
            time: Math.random() * 100,
            lineIndex: lineIndex
        });
        
        textContainer.appendChild(lineElement);
    }
    
    matrixContainer.appendChild(textContainer);
    
    // Анимация искажения формы текста
    let animationFrame;
    const animate = () => {
        textLines.forEach(line => {
            line.time += 0.016; // Примерно 60 FPS
            
            // Математические искажения формы строки текста
            // Волновое искажение по X (горизонтальное) - строка изгибается
            const waveX = Math.sin((line.lineIndex * 0.5 + line.time * 0.3) * line.waveFrequency + line.wavePhase) * line.waveAmplitude;
            
            // Искажение перспективы (3D эффект) - строка наклоняется
            const perspectiveDistortion = Math.sin(line.lineIndex * 0.2 + line.time * 0.2) * 8;
            
            // Искажение наклона (skew) - меняется динамически
            const dynamicSkew = line.skewAmount + Math.sin(line.time * 0.25 + line.lineIndex * 0.1) * 8;
            
            // Искажение масштаба (строка растягивается/сжимается по ширине)
            const scaleX = 1 + Math.sin(line.lineIndex * 0.3 + line.time * 0.4) * 0.15;
            
            // Вертикальное смещение для волнового эффекта
            const waveY = Math.cos(line.lineIndex * 0.4 + line.time * 0.3) * 3;
            
            // Применяем искажения формы текста
            line.element.style.transform = `
                translateY(${waveY}px)
                translateX(${waveX}px)
                perspective(${line.perspectiveAmount}px)
                rotateX(${perspectiveDistortion}deg)
                rotateY(${Math.sin(line.time * 0.15 + line.lineIndex * 0.05) * 3}deg)
                skewX(${dynamicSkew}deg)
                scaleX(${scaleX})
            `;
            
            // Искажение через CSS clip-path для более сложных форм (волна)
            const clipPathOffset = Math.sin(line.lineIndex * 0.3 + line.time * 0.2) * 3;
            line.element.style.clipPath = `polygon(
                0% ${50 - clipPathOffset}%, 
                100% ${50 + clipPathOffset}%, 
                100% ${100 + clipPathOffset}%, 
                0% ${100 - clipPathOffset}%
            )`;
            
            // Прозрачность в зависимости от позиции
            const opacity = 0.4 + Math.sin(line.lineIndex * 0.1 + line.time * 0.1) * 0.15;
            line.element.style.opacity = Math.max(0.25, Math.min(0.7, opacity));
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
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
            playSound('click');
        });
    });
}

// Загрузка локальной музыки
function loadLocalMusic() {
    // Список всех локальных аудио файлов
    const localMusic = [
        { src: 'music/Abel Korzeniowski - Evgeni\'s Waltz.mp3', title: 'Abel Korzeniowski - Evgeni\'s Waltz', duration: '0:00' },
        { src: 'music/Adam Ferello - Infinity.mp3', title: 'Adam Ferello - Infinity', duration: '0:00' },
        { src: 'music/Assasin`s Cred - из Асасинс Крид 2.mp3', title: 'Assasin`s Cred - из Асасинс Крид 2', duration: '0:00' },
        { src: 'music/Ben Howard - Oats In The Water.mp3', title: 'Ben Howard - Oats In The Water', duration: '0:00' },
        { src: 'music/Blanck Mass - Ranger Gary.mp3', title: 'Blanck Mass - Ranger Gary', duration: '0:00' },
        { src: 'music/Bobby Vinton - Mr. Lonely.mp3', title: 'Bobby Vinton - Mr. Lonely', duration: '0:00' },
        { src: 'music/Buster Poindexter - Hit the Road Jack.mp3', title: 'Buster Poindexter - Hit the Road Jack', duration: '0:00' },
        { src: 'music/Caesars - Jerk It Out.mp3', title: 'Caesars - Jerk It Out', duration: '0:00' },
        { src: 'music/Calvin Harris - My Way.mp3', title: 'Calvin Harris - My Way', duration: '0:00' },
        { src: 'music/Clair De Lune - The Evil Within - 2014 Soundtrack OST.mp3', title: 'Clair De Lune - The Evil Within', duration: '0:00' },
        { src: 'music/Clint Mansell - Lux Aeterna (OST Requiem for a Dream) - Вечный свет (ОСТ Реквием по мечте) оригинальная.mp3', title: 'Clint Mansell - Lux Aeterna', duration: '0:00' },
        { src: 'music/Clint Mansell - Robbo\'s Theme.mp3', title: 'Clint Mansell - Robbo\'s Theme', duration: '0:00' },
        { src: 'music/Daft Punk - Instant Crush.mp3', title: 'Daft Punk - Instant Crush', duration: '0:00' },
        { src: 'music/Dvar - ariil iaat.mp3', title: 'Dvar - ariil iaat', duration: '0:00' },
        { src: 'music/Erik Satie - Gymnopedia №1.mp3', title: 'Erik Satie - Gymnopedia №1', duration: '0:00' },
        { src: 'music/Fall Out Boy - I Don\'t Care (Album Version).mp3', title: 'Fall Out Boy - I Don\'t Care', duration: '0:00' },
        { src: 'music/Film Soundtracks, SoundtrackCast Album, Best Movie Soundtracks, TV Theme Players - Mad World (From Donnie Darko).mp3', title: 'Mad World (From Donnie Darko)', duration: '0:00' },
        { src: 'music/HIM - Gone With The Sin.mp3', title: 'HIM - Gone With The Sin', duration: '0:00' },
        { src: 'music/Hayley Williams - Simmer.mp3', title: 'Hayley Williams - Simmer', duration: '0:00' },
        { src: 'music/Is Tropical - Dancing Anymore (zaycev.net).mp3', title: 'Is Tropical - Dancing Anymore', duration: '0:00' },
        { src: 'music/Jackson C. Frank - My Name Is Carnival (2001 Remaster).mp3', title: 'Jackson C. Frank - My Name Is Carnival', duration: '0:00' },
        { src: 'music/Jake Chudnow - Pressed Pennies.mp3', title: 'Jake Chudnow - Pressed Pennies', duration: '0:00' },
        { src: 'music/Jean-Michel Jarre, Christophe - Walking the Mile.mp3', title: 'Jean-Michel Jarre - Walking the Mile', duration: '0:00' },
        { src: 'music/Jessica Curry - Mandus.mp3', title: 'Jessica Curry - Mandus', duration: '0:00' },
        { src: 'music/John Murphy & Blue States - Season Song.mp3', title: 'John Murphy & Blue States - Season Song', duration: '0:00' },
        { src: 'music/Jukebox - Jason.mp3', title: 'Jukebox - Jason', duration: '0:00' },
        { src: 'music/Led Zeppelin - Immigrant Song (Remaster).mp3', title: 'Led Zeppelin - Immigrant Song', duration: '0:00' },
        { src: 'music/Ludovico Einaudi - Einaudi Nuvole Bianche.mp3', title: 'Ludovico Einaudi - Nuvole Bianche', duration: '0:00' },
        { src: 'music/MGMT - Little Dark Age.mp3', title: 'MGMT - Little Dark Age', duration: '0:00' },
        { src: 'music/Maxence Cyrin - Where Is My Mind.mp3', title: 'Maxence Cyrin - Where Is My Mind', duration: '0:00' },
        { src: 'music/Mike Oldfield - Moonlight Shadow (Remastered).mp3', title: 'Mike Oldfield - Moonlight Shadow', duration: '0:00' },
        { src: 'music/N3verface - Guts Theme (From Berserk).mp3', title: 'N3verface - Guts Theme (From Berserk)', duration: '0:00' },
        { src: 'music/Nothing But Thieves - Graveyard Whistling.mp3', title: 'Nothing But Thieves - Graveyard Whistling', duration: '0:00' },
        { src: 'music/Oliver Tree - Alien Boy.mp3', title: 'Oliver Tree - Alien Boy', duration: '0:00' },
        { src: 'music/Passarella Death Squad - Just Like Sleep.mp3', title: 'Passarella Death Squad - Just Like Sleep', duration: '0:00' },
        { src: 'music/Phantazo - I Scream to You God of Time.mp3', title: 'Phantazo - I Scream to You God of Time', duration: '0:00' },
        { src: 'music/Porter Robinson - Goodbye To A World.mp3', title: 'Porter Robinson - Goodbye To A World', duration: '0:00' },
        { src: 'music/Ramin Djawadi - Light Of The Seven (OST Игра Престолов 6 сезон 10 серия).mp3', title: 'Ramin Djawadi - Light Of The Seven', duration: '0:00' },
        { src: 'music/Seatbelts - Rain (Demo Ver.).mp3', title: 'Seatbelts - Rain', duration: '0:00' },
        { src: 'music/Silent Partner - Ether.mp3', title: 'Silent Partner - Ether', duration: '0:00' },
        { src: 'music/Skrillex ft. Damian Marley (OST Far Cry 3-Make It Burn Them - Far Cry 3.mp3', title: 'Skrillex - Make It Burn Them (Far Cry 3)', duration: '0:00' },
        { src: 'music/Slowdive - Sugar for the Pill.mp3', title: 'Slowdive - Sugar for the Pill', duration: '0:00' },
        { src: 'music/Styx - Man In The Wilderness.mp3', title: 'Styx - Man In The Wilderness', duration: '0:00' },
        { src: 'music/Sufjan Stevens - Mystery of Love.mp3', title: 'Sufjan Stevens - Mystery of Love', duration: '0:00' },
        { src: 'music/Sune Martin - Land of Mine (End Credits).mp3', title: 'Sune Martin - Land of Mine', duration: '0:00' },
        { src: 'music/Tame Impala - Posthumous Forgiveness.mp3', title: 'Tame Impala - Posthumous Forgiveness', duration: '0:00' },
        { src: 'music/The Handsome Family - Far from Any Road.mp3', title: 'The Handsome Family - Far from Any Road', duration: '0:00' },
        { src: 'music/The Heavy - Short Change Hero.mp3', title: 'The Heavy - Short Change Hero', duration: '0:00' },
        { src: 'music/The Prodigy - Firestarter.mp3', title: 'The Prodigy - Firestarter', duration: '0:00' },
        { src: 'music/Yurima - River Flows in You.mp3', title: 'Yurima - River Flows in You', duration: '0:00' },
        { src: 'music/[MP3DOWNLOAD.TO] Parasyte - Next To You (Anime Version)-320k.mp3', title: 'Parasyte - Next To You', duration: '0:00' },
        { src: 'music/[MP3DOWNLOAD.TO] Silent Hill Blood Tears _Lisa\'s Theme Not Tomorrow_ (Extended)-320k.mp3', title: 'Silent Hill - Lisa\'s Theme', duration: '0:00' },
        { src: 'music/analog mannequin - milk cassette x.mp3 - demo.mp3', title: 'analog mannequin - milk cassette', duration: '0:00' },
        { src: 'music/cavetown - demons.mp3', title: 'cavetown - demons', duration: '0:00' },
        { src: 'music/daniel.mp3 - green to blue (slowed + reverbed).mp3', title: 'daniel - green to blue', duration: '0:00' },
        { src: 'music/elevators - tsunami.mp3', title: 'elevators - tsunami', duration: '0:00' },
        { src: 'music/girl in red - we fell in love in october (2).mp3', title: 'girl in red - we fell in love in october', duration: '0:00' },
        { src: 'music/lil death - moment.mp3', title: 'lil death - moment', duration: '0:00' },
        { src: 'music/openai-fm-ash-audio.wav', title: 'openai-fm-ash-audio', duration: '0:00' },
        { src: 'music/santo & johnny - sleep walk (slowed + reverb).mp3', title: 'santo & johnny - sleep walk', duration: '0:00' },
        { src: 'music/scott - Overcome.mp3', title: 'scott - Overcome', duration: '0:00' },
        { src: 'music/tie-fighter-roar.mp3', title: 'tie-fighter-roar', duration: '0:00' },
        { src: 'music/xxxtentacion - revenge.mp3', title: 'xxxtentacion - revenge', duration: '0:00' },
        { src: 'music/Микаэл Таривердиев - Клавесин (из к ф цена).mp3', title: 'Микаэл Таривердиев - Клавесин', duration: '0:00' },
        { src: 'music/Музыка из фильма Игра престолов - Ramin Djawadi - Main Title.mp3', title: 'Ramin Djawadi - Main Title (Game of Thrones)', duration: '0:00' },
        { src: 'music/Рамин Джавади - Красная свадьба Игра престолов.mp3', title: 'Ramin Djawadi - Красная свадьба', duration: '0:00' }
    ];
    
    localMusic.forEach(track => {
        addAudioTrack(track.src, track.title, track.duration);
    });
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
    
    // Используем несколько вариантов для обхода блокировок
    const embedUrls = [
        `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
        `https://invidious.io/embed/${videoId}`,
        `https://piped.kavin.rocks/embed/${videoId}`
    ];
    
    let currentEmbedIndex = 0;
    
    const iframe = document.createElement('iframe');
    iframe.src = embedUrls[0];
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.className = 'youtube-iframe';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'youtube-title';
    titleDiv.textContent = title || 'YouTube видео';
    
    const errorHandler = () => {
        currentEmbedIndex++;
        if (currentEmbedIndex < embedUrls.length) {
            iframe.src = embedUrls[currentEmbedIndex];
        } else {
            // Если все варианты не работают, показываем ссылку
            item.innerHTML = `
                <div class="youtube-fallback">
                    <p>${title || 'YouTube видео'}</p>
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="youtube-link">
                        Открыть на YouTube →
                    </a>
                </div>
            `;
        }
    };
    
    iframe.onerror = errorHandler;
    
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
    // Список локальных видео файлов (добавьте ваши файлы)
    const localVideos = [
        // Пример:
        // { src: 'video/my-video.mp4', title: 'Мое видео' }
    ];
    
    localVideos.forEach(video => {
        addVideo(video.src, video.title);
    });
}

// Загрузка YouTube ссылок из файла
async function loadYouTubeLinks() {
    try {
        // Пытаемся загрузить JSON файл со ссылками
        const response = await fetch('video/youtube.json');
        if (response.ok) {
            const videos = await response.json();
            videos.forEach(video => {
                if (video.id) {
                    addYouTubeVideo(video.id, video.title);
                } else if (video.url) {
                    addYouTubeVideoByURL(video.url, video.title);
                }
            });
            return;
        }
    } catch (e) {
        // Игнорируем ошибку, если файл не найден
    }
    
    // Если JSON не найден, пытаемся загрузить текстовый файл со ссылками
    try {
        const response = await fetch('video/links.txt');
        if (response.ok) {
            const text = await response.text();
            const links = text.split('\n').filter(line => line.trim() && line.includes('youtube'));
            links.forEach(link => {
                const trimmedLink = link.trim();
                if (trimmedLink) {
                    addYouTubeVideoByURL(trimmedLink, 'YouTube видео');
                }
            });
        }
    } catch (e) {
        // Игнорируем ошибку
    }
}

// Загрузка фотографий из папки photo
function loadLocalPhotos() {
    // Список фотографий (добавьте ваши файлы)
    // В реальном проекте это можно сделать через серверный скрипт
    // или использовать список файлов
    const localPhotos = [
        // Пример:
        // { src: 'photo/my-photo.jpg', alt: 'Описание фото' }
    ];
    
    localPhotos.forEach(photo => {
        addPhoto(photo.src, photo.alt);
    });
    
    // Альтернативный способ: загрузка через список файлов
    // Если у вас есть файл photo/list.json, можно загрузить оттуда
    fetch('photo/list.json')
        .then(response => response.json())
        .then(photos => {
            photos.forEach(photo => {
                addPhoto(photo.src, photo.alt || '');
            });
        })
        .catch(() => {
            // Файл не найден, это нормально
        });
}

// Добавление демо-контента для тестирования
function addDemoContent() {
    // Примеры изображений (используем placeholder изображения)
    setTimeout(() => {
        // Эстетика - примеры
        const aestheticExamples = [
            { src: 'https://via.placeholder.com/400x400/ff00ff/ffffff?text=Aesthetic+1', alt: 'Эстетика 1' },
            { src: 'https://via.placeholder.com/400x400/00ffff/000000?text=Aesthetic+2', alt: 'Эстетика 2' },
            { src: 'https://via.placeholder.com/400x400/9d4edd/ffffff?text=Aesthetic+3', alt: 'Эстетика 3' }
        ];
        
        aestheticExamples.forEach(item => {
            addAestheticImage(item.src, item.alt);
        });

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

        photoExamples.forEach(item => {
            addPhoto(item.src, item.alt);
        });

        // Библиотека - примеры
        addLibraryItem('Материал 1', 'Описание первого материала', 'https://example.com');
        addLibraryItem('Материал 2', 'Описание второго материала', null);
        addLibraryItem('Материал 3', 'Описание третьего материала', 'https://example.com');
        
        // Пример YouTube видео (закомментируйте если не нужно)
        // addYouTubeVideo('dQw4w9WgXcQ', 'Пример YouTube видео');
    }, 100);
}

// Экспорт функций для использования
window.addAestheticImage = addAestheticImage;
window.addAudioTrack = addAudioTrack;
window.addVideo = addVideo;
window.addPhoto = addPhoto;
window.addLibraryItem = addLibraryItem;
window.addYouTubeVideo = addYouTubeVideo;
window.addYouTubeVideoByURL = addYouTubeVideoByURL;

