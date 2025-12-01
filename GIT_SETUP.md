# Инструкция по загрузке в Git

## Шаг 1: Создайте репозиторий на GitHub

1. Зайдите на [GitHub.com](https://github.com)
2. Нажмите "New repository" (зеленая кнопка)
3. Назовите репозиторий (например: `maidcore-site` или `47-site`)
4. Выберите Public или Private
5. **НЕ** создавайте README, .gitignore или лицензию (они уже есть)
6. Нажмите "Create repository"

## Шаг 2: Подключите локальный репозиторий к GitHub

Выполните в терминале (замените URL на ваш):

```bash
cd "/Users/yanis/47 сайт"

# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: Maidcore site"

# Подключите к удаленному репозиторию (замените URL)
git remote add origin https://github.com/ВАШ-USERNAME/НАЗВАНИЕ-РЕПОЗИТОРИЯ.git

# Загрузите в GitHub
git branch -M main
git push -u origin main
```

## Шаг 3: Настройте GitHub Pages

1. Зайдите в Settings вашего репозитория на GitHub
2. Перейдите в раздел "Pages" (слева в меню)
3. В "Source" выберите:
   - Branch: `main`
   - Folder: `/ (root)`
4. Нажмите "Save"
5. Через несколько минут сайт будет доступен по адресу:
   `https://ВАШ-USERNAME.github.io/НАЗВАНИЕ-РЕПОЗИТОРИЯ/`

## Важные замечания

### Размер файлов

GitHub имеет ограничения:
- Максимум 100MB на один файл
- Максимум 1GB на репозиторий

Если у вас большие аудио/видео файлы:
1. Используйте Git LFS (Large File Storage)
2. Или храните файлы на внешнем хостинге (Google Drive, Dropbox, etc.)

### Git LFS для больших файлов

```bash
# Установите Git LFS (если еще не установлен)
# macOS: brew install git-lfs
# Затем:
git lfs install
git lfs track "*.mp3"
git lfs track "*.mp4"
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### Обновление сайта

После изменений:

```bash
git add .
git commit -m "Описание изменений"
git push
```

GitHub Pages автоматически обновится через несколько минут.

## Структура проекта

```
47 сайт/
├── index.html          # Главная страница
├── styles.css          # Стили
├── script.js           # JavaScript
├── README.md           # Документация
├── .gitignore          # Игнорируемые файлы
├── .gitattributes      # Настройки Git
├── .nojekyll           # Отключение Jekyll
├── music/              # Папка с музыкой
│   ├── README.md
│   └── *.mp3          # Ваши аудио файлы
└── examples.js         # Примеры использования
```

