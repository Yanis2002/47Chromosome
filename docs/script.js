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
    // Загружаем локальную музыку
    loadLocalMusic();
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
    
    // Обработка ошибок загрузки
    img.onerror = function() {
        this.style.display = 'none';
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary);';
        errorDiv.textContent = 'Ошибка загрузки';
        item.appendChild(errorDiv);
    };
    
    item.appendChild(img);
    
    // Добавляем обработчик клика для открытия в модальном окне
    item.addEventListener('click', () => {
        if (window.showImageModal && img.complete && !img.onerror) {
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
    
    // Обработка ошибок загрузки
    img.onerror = function() {
        this.style.display = 'none';
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary);';
        errorDiv.textContent = 'Ошибка загрузки';
        item.appendChild(errorDiv);
    };
    
    item.appendChild(img);
    
    // Добавляем обработчик клика для открытия в модальном окне
    item.addEventListener('click', () => {
        if (window.showImageModal && img.complete && !img.onerror) {
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
        modalImage.src = src;
        modalCaption.textContent = alt || '';
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
    // Список локальных аудио файлов
    const localMusic = [
        { 
            src: 'music/Silent Partner - Ether.mp3', 
            title: 'Silent Partner - Ether', 
            duration: '0:00' // Будет определено автоматически
        }
        // Добавьте сюда другие треки:
        // { src: 'music/название-файла.mp3', title: 'Название трека', duration: '0:00' }
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

