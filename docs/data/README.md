# Папка данных

Эта папка содержит все данные сайта: фото, видео, музыку и ссылки.

## Структура

```
data/
├── links.json      # Список ссылок для раздела "Ссылки"
├── music/          # Аудио файлы (.mp3, .wav, .ogg и т.д.)
├── photo/          # Фотографии (.jpg, .png, .webp и т.д.)
│   └── list.json   # Список фотографий
└── video/          # Видео файлы и YouTube ссылки
    ├── links.txt   # Список YouTube ссылок
    └── youtube.json # JSON файл с YouTube видео
```

## Как добавить контент

### Ссылки (`links.json`)

Отредактируйте файл `data/links.json`:

```json
[
  {
    "url": "https://example.com",
    "title": "Название ссылки",
    "description": "Описание ссылки"
  }
]
```

### Фото

1. Поместите файлы в `data/photo/`
2. Отредактируйте `data/photo/list.json`:

```json
[
  {
    "src": "data/photo/my-photo.jpg",
    "alt": "Описание фото"
  }
]
```

### Музыка

Добавьте файлы в `data/music/` и обновите список в `script.js` (функция `loadLocalMusic()`).

### Видео

- **Локальные видео**: добавьте файлы в `data/video/`
- **YouTube**: добавьте ссылки в `data/video/links.txt` или `data/video/youtube.json`

