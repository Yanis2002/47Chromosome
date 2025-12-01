#!/usr/bin/env node

/**
 * Скрипт для автоматической генерации JSON файлов из содержимого папок
 * 
 * Использование:
 *   node generate-content.js
 * 
 * Скрипт автоматически:
 * - Создает список музыки из папки docs/music/
 * - Создает список фото из папки docs/photo/
 * - Обновляет соответствующие JSON файлы
 */

const fs = require('fs');
const path = require('path');

const MUSIC_DIR = path.join(__dirname, 'music');
const PHOTO_DIR = path.join(__dirname, 'photo');
const VIDEO_DIR = path.join(__dirname, 'video');
const SCRIPT_FILE = path.join(__dirname, 'script.js');

// Поддерживаемые форматы
const AUDIO_FORMATS = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'];
const PHOTO_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const VIDEO_FORMATS = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];

// Функция для получения всех файлов из папки
function getFiles(dir, extensions) {
    if (!fs.existsSync(dir)) {
        return [];
    }
    
    const files = fs.readdirSync(dir);
    return files
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return extensions.includes(ext);
        })
        .map(file => ({
            name: file,
            path: path.join(dir, file),
            ext: path.extname(file).toLowerCase()
        }));
}

// Функция для создания названия из имени файла
function createTitle(filename) {
    // Убираем расширение
    let title = filename.replace(/\.[^/.]+$/, '');
    
    // Убираем специальные символы из начала (например, [MP3DOWNLOAD.TO])
    title = title.replace(/^\[.*?\]\s*/, '');
    
    // Заменяем подчеркивания и дефисы на пробелы
    title = title.replace(/[_-]/g, ' ');
    
    // Убираем лишние пробелы
    title = title.replace(/\s+/g, ' ').trim();
    
    return title;
}

// Генерация списка музыки
function generateMusicList() {
    console.log('🎵 Генерация списка музыки...');
    
    const musicFiles = getFiles(MUSIC_DIR, AUDIO_FORMATS);
    const musicList = musicFiles.map(file => {
        const title = createTitle(file.name);
        const src = `music/${file.name}`;
        
        return {
            src: src,
            title: title,
            duration: '0:00'
        };
    });
    
    // Обновляем script.js
    
    // Обновляем script.js
    const scriptPath = path.join(DOCS_DIR, 'script.js');
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Находим функцию loadLocalMusic и заменяем массив
    const musicArrayStart = scriptContent.indexOf('const localMusic = [');
    if (musicArrayStart !== -1) {
        const musicArrayEnd = scriptContent.indexOf('];', musicArrayStart);
        if (musicArrayEnd !== -1) {
            const indent = '        ';
            const musicArrayString = musicList.map(track => {
                const titleEscaped = track.title.replace(/'/g, "\\'");
                // Убираем docs/ из пути если есть
                const src = track.src.replace(/^docs\//, '');
                return `${indent}{ src: '${src}', title: '${titleEscaped}', duration: '${track.duration}' }`;
            }).join(',\n');
            
            const newMusicArray = `const localMusic = [\n${musicArrayString}\n    ];`;
            scriptContent = scriptContent.substring(0, musicArrayStart) + 
                          newMusicArray + 
                          scriptContent.substring(musicArrayEnd + 2);
            
            fs.writeFileSync(SCRIPT_FILE, scriptContent, 'utf8');
            console.log(`✅ Обновлен script.js: добавлено ${musicList.length} треков`);
        }
    }
    
    return musicList.length;
}

// Генерация списка фото
function generatePhotoList() {
    console.log('📸 Генерация списка фото...');
    
    const photoFiles = getFiles(PHOTO_DIR, PHOTO_FORMATS);
    const photoList = photoFiles.map(file => {
        const alt = createTitle(file.name);
        const src = `photo/${file.name}`;
        
        return {
            src: src,
            alt: alt
        };
    });
    
    // Создаем или обновляем list.json
    const listJsonPath = path.join(PHOTO_DIR, 'list.json');
    
    // Создаем или обновляем list.json
    const listJsonPath = path.join(PHOTO_DIR, 'list.json');
    const jsonContent = JSON.stringify(photoList, null, 2);
    
    fs.writeFileSync(listJsonPath, jsonContent, 'utf8');
    console.log(`✅ Обновлен photo/list.json: добавлено ${photoList.length} фото`);
    
    return photoList.length;
}

// Генерация списка локальных видео
function generateVideoList() {
    console.log('🎬 Генерация списка локальных видео...');
    
    const videoFiles = getFiles(VIDEO_DIR, VIDEO_FORMATS);
    const videoList = videoFiles.map(file => {
        const title = createTitle(file.name);
        const src = `video/${file.name}`;
        
        return {
            src: src,
            title: title
        };
    });
    
    // Обновляем script.js
    
    // Обновляем script.js
    const scriptPath = path.join(DOCS_DIR, 'script.js');
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Находим функцию loadLocalVideos и заменяем массив
    const videoArrayStart = scriptContent.indexOf('const localVideos = [');
    if (videoArrayStart !== -1) {
        const videoArrayEnd = scriptContent.indexOf('];', videoArrayStart);
        if (videoArrayEnd !== -1) {
            const indent = '    ';
            const videoArrayString = videoList.map(video => {
                const titleEscaped = video.title.replace(/'/g, "\\'");
                // Убираем docs/ из пути если есть
                const src = video.src.replace(/^docs\//, '');
                return `${indent}{ src: '${src}', title: '${titleEscaped}' }`;
            }).join(',\n');
            
            const newVideoArray = `const localVideos = [\n${videoArrayString}\n    ];`;
            scriptContent = scriptContent.substring(0, videoArrayStart) + 
                          newVideoArray + 
                          scriptContent.substring(videoArrayEnd + 2);
            
            fs.writeFileSync(SCRIPT_FILE, scriptContent, 'utf8');
            console.log(`✅ Обновлен script.js: добавлено ${videoList.length} видео`);
        }
    }
    
    return videoList.length;
}

// Главная функция
function main() {
    console.log('🚀 Начинаю генерацию контента...\n');
    
    let totalMusic = 0;
    let totalPhotos = 0;
    let totalVideos = 0;
    
    try {
        totalMusic = generateMusicList();
    } catch (error) {
        console.error('❌ Ошибка при генерации списка музыки:', error.message);
    }
    
    try {
        totalPhotos = generatePhotoList();
    } catch (error) {
        console.error('❌ Ошибка при генерации списка фото:', error.message);
    }
    
    try {
        totalVideos = generateVideoList();
    } catch (error) {
        console.error('❌ Ошибка при генерации списка видео:', error.message);
    }
    
    console.log('\n✨ Готово!');
    console.log(`   🎵 Музыка: ${totalMusic} треков`);
    console.log(`   📸 Фото: ${totalPhotos} изображений`);
    console.log(`   🎬 Видео: ${totalVideos} файлов`);
    console.log('\n💡 Теперь можно закоммитить изменения в Git');
}

// Запуск
if (require.main === module) {
    main();
}

module.exports = { generateMusicList, generatePhotoList, generateVideoList };

