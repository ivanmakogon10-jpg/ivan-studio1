#!/usr/bin/env python3
"""Сборка сайта: dist/ — для публикации артефакта, standalone/ — обычный сайт."""
import pathlib, shutil

root = pathlib.Path(__file__).parent
src, dist, alone = root / 'src', root / 'dist', root / 'standalone'
head = (src / 'head.html').read_text('utf-8')
body = (src / 'body.html').read_text('utf-8')

for d in (dist, alone):
    d.mkdir(exist_ok=True)
    for name in ('styles.css', 'data.js', 'app.js'):
        shutil.copy(src / name, d / name)

# Артефакт: скелет <html><head><body> добавляется платформой
(dist / 'index.html').write_text(head + '\n' + body, 'utf-8')

# Обычный сайт: полноценный документ
(alone / 'index.html').write_text(
    '<!doctype html>\n<html lang="ru">\n<head>\n'
    '<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    + head +
    '</head>\n<body>\n' + body + '\n</body>\n</html>\n', 'utf-8')

print('собрано:', dist, alone)
