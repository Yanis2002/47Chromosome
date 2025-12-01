// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ФУНКЦИЙ
// Этот файл содержит примеры того, как добавлять контент на сайт
// Вы можете скопировать эти примеры в консоль браузера или добавить в script.js

// ============================================
// ДОБАВЛЕНИЕ ИЗОБРАЖЕНИЙ В ГАЛЕРЕЮ ЭСТЕТИКИ
// ============================================

// Добавить одно изображение
addAestheticImage('images/my-art.jpg', 'Мое произведение искусства');

// Добавить несколько изображений
const aestheticImages = [
    { src: 'images/art1.jpg', alt: 'Арт 1' },
    { src: 'images/art2.jpg', alt: 'Арт 2' },
    { src: 'images/art3.jpg', alt: 'Арт 3' }
];

aestheticImages.forEach(img => {
    addAestheticImage(img.src, img.alt);
});

// ============================================
// ДОБАВЛЕНИЕ АУДИО ТРЕКОВ
// ============================================

// Добавить один трек
addAudioTrack('audio/my-track.mp3', 'Название трека', '3:45');

// Добавить несколько треков
const audioTracks = [
    { src: 'audio/track1.mp3', title: 'Трек 1', duration: '2:30' },
    { src: 'audio/track2.mp3', title: 'Трек 2', duration: '4:15' },
    { src: 'audio/track3.mp3', title: 'Трек 3', duration: '3:20' }
];

audioTracks.forEach(track => {
    addAudioTrack(track.src, track.title, track.duration);
});

// ============================================
// ДОБАВЛЕНИЕ ВИДЕО
// ============================================

// Добавить одно локальное видео
addVideo('videos/my-video.mp4', 'Название видео');

// Добавить несколько локальных видео
const videos = [
    { src: 'videos/video1.mp4', title: 'Видео 1' },
    { src: 'videos/video2.mp4', title: 'Видео 2' }
];

videos.forEach(video => {
    addVideo(video.src, video.title);
});

// ============================================
// ДОБАВЛЕНИЕ YOUTUBE ВИДЕО
// ============================================

// Добавить YouTube видео по ID
addYouTubeVideo('dQw4w9WgXcQ', 'Название YouTube видео');

// Добавить YouTube видео по URL (автоматически извлечет ID)
addYouTubeVideoByURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Название видео');

// Добавить несколько YouTube видео
const youtubeVideos = [
    { id: 'dQw4w9WgXcQ', title: 'Видео 1' },
    { id: 'jNQXAC9IVRw', title: 'Видео 2' },
    { url: 'https://www.youtube.com/watch?v=VIDEO_ID', title: 'Видео 3' }
];

youtubeVideos.forEach(video => {
    if (video.id) {
        addYouTubeVideo(video.id, video.title);
    } else if (video.url) {
        addYouTubeVideoByURL(video.url, video.title);
    }
});

// Примечание: YouTube плеер автоматически пытается использовать
// альтернативные сервисы (Invidious, Piped) для обхода блокировок

// ============================================
// ДОБАВЛЕНИЕ ФОТОГРАФИЙ
// ============================================

// Добавить одну фотографию
addPhoto('photos/my-photo.jpg', 'Описание фото');

// Добавить несколько фотографий
const photos = [
    { src: 'photos/photo1.jpg', alt: 'Фото 1' },
    { src: 'photos/photo2.jpg', alt: 'Фото 2' },
    { src: 'photos/photo3.jpg', alt: 'Фото 3' }
];

photos.forEach(photo => {
    addPhoto(photo.src, photo.alt);
});

// ============================================
// ДОБАВЛЕНИЕ МАТЕРИАЛОВ В БИБЛИОТЕКУ
// ============================================

// Добавить материал с ссылкой
addLibraryItem('Название материала', 'Описание материала', 'https://example.com');

// Добавить материал без ссылки
addLibraryItem('Название материала', 'Описание материала', null);

// Добавить несколько материалов
const libraryItems = [
    { title: 'Материал 1', description: 'Описание 1', link: 'https://example.com/1' },
    { title: 'Материал 2', description: 'Описание 2', link: null },
    { title: 'Материал 3', description: 'Описание 3', link: 'https://example.com/3' }
];

libraryItems.forEach(item => {
    addLibraryItem(item.title, item.description, item.link);
});

// ============================================
// ИСПОЛЬЗОВАНИЕ В КОНСОЛИ БРАУЗЕРА
// ============================================

// Откройте консоль браузера (F12) и выполните:
// addAestheticImage('путь/к/изображению.jpg', 'Описание');

// ============================================
// ИНТЕРАКТИВНОСТЬ
// ============================================

// Все элементы кликабельны:
// - Карточки на главной странице - переход к разделам
// - Изображения в галереях - открытие в модальном окне
// - Аудио треки - воспроизведение в плеере
// - Видео - встроенный плеер
// - Ссылки в библиотеке - открытие в новой вкладке
// - Кнопка покупки - обработчик события (можно настроить)

// Звуковые эффекты:
// - Клики по элементам
// - Наведение на карточки и ссылки
// - Переключение звука через кнопку в навигации

