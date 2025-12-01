# Папка для видео

## YouTube видео

### Способ 1: JSON файл (рекомендуется)

Создайте файл `youtube.json` со списком видео в формате:

```json
[
  {
    "id": "dQw4w9WgXcQ",
    "title": "Название видео"
  },
  {
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "title": "Название видео"
  }
]
```

### Способ 2: Текстовый файл

Добавьте ссылки в `links.txt` (по одной на строку):
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://www.youtube.com/watch?v=jNQXAC9IVRw
```

## Локальные видео

Поместите видео файлы (MP4, WebM и т.д.) в эту папку и добавьте их в функцию `loadLocalVideos()` в `script.js`:

```javascript
const localVideos = [
    { src: 'video/my-video.mp4', title: 'Мое видео' }
];
```

