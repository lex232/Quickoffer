# Quickoffer

Application for quickly creating commercial proposals
Приложение для создания коммерческих предложений в сфере СКС и формирования документов к ним

Сайт — https://offerguru.ru/

## Технологии

[![Python](https://img.shields.io/badge/-Python-464646?style=flat&logo=Python&logoColor=56C0C0&color=fbec5d)](https://www.python.org/)
[![Django](https://img.shields.io/badge/-Django-464646?style=flat&logo=Django&logoColor=56C0C0&color=221080)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/-Django%20REST%20Framework-464646?style=flat&logo=Django%20REST%20Framework&logoColor=56C0C0&color=1a21a0)](https://www.django-rest-framework.org/)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=fla&logo=react&logoColor=%2361DAFB)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-464646?style=fla&logo=PostgreSQL&logoColor=000000&color=11aa77)](https://www.postgresql.org/)
[![Nginx](https://img.shields.io/badge/-NGINX-464646?style=flat&logo=NGINX&logoColor=56C0C0&color=000000)](https://nginx.org/ru/)
[![gunicorn](https://img.shields.io/badge/-gunicorn-464646?style=flat&logo=gunicorn&logoColor=56C0C0&color=65fa41)](https://gunicorn.org/)

## Возможности

- Регистрация и авторизация пользователей.
- Создание клиентов индивидуальных для аккаунта.
- Создание товаров индивидуальных для аккаунта.
- Дополнительная информация в профиле (реквизиты).
- Создание коммерческих предложений.
- Каталог популярных товаров.
- Формирование документов (счёт на работы, счёт на товары, КП, КП + характеристики, ТОРГ-12, договоры).

## Локальный запуск

### Требования

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Клонировать репозиторий

```bash
git clone <url>
cd quickoffer
```

### 2. Бэкенд

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv

# Активировать
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
cp .env.example .env
# Отредактировать .env — указать свои данные БД, SECRET_KEY, DEBUG_MODE=True
# Пример:
# POSTGRES_DB=quickoffer
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=mysecretpassword
# DB_HOST=localhost
# DB_PORT=5432
# SECRET_KEY=your-secret-key
# DEBUG_MODE=True

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Запустить сервер
python manage.py runserver
```

Бэкенд будет доступен на http://localhost:8000/

### 3. Фронтенд

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev-сервер
npm start
```

Фронтенд будет доступен на http://localhost:3000/

### Быстрый запуск (скрипты)

В папке `infras/` лежат готовые скрипты для simultaneous запуска бэкенда и фронтенда (нужно прописать пути):

**Windows:**
```bash
infras\run_qiuckoffer_win.bat
```

**Linux (Gnome Terminal):**
```bash
bash infras/quickoffer_linux.sh
```

## Тестирование

```bash
cd backend
python manage.py test offer.tests --verbosity=2

# Конкретный файл
python manage.py test offer.tests.test_models
python manage.py test offer.tests.test_api_offers

# Конкретный тест-кейс
python manage.py test offer.tests.test_api_offers.OfferAPITests
```

## Структура проекта

```
quickoffer/
├── backend/
│   ├── api/              # API endpoints (DRF)
│   ├── offer/            # Основное приложение (модели, сервисы)
│   │   ├── services/     # Бизнес-логика генерации документов
│   │   └── tests/        # Тесты
│   ├── quickoffer/       # Настройки Django
│   ├── utils/            # Утилиты, шаблоны docx
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/              # React-компоненты
│   └── package.json
└── infras/               # Скрипты для запуска
```
