# Добро пожаловать в pet-проект UsersService!

UsersService - сервис работы с пользователями.

## 🛠️ Технологии

| Категория      | Технологии                           |
|----------------|--------------------------------------|
| Бэкенд         | Node.js, Express, TypeScript         |
| Базы данных    | MongoDB, ODM Mongoose                |
| Инструменты    | Postman, MongoDB Compass             |


## ⚙️ API роуты

- POST /auth/login - авторизация пользователя
- POST /auth/logout - выход
- POST /auth/register - регистрация пользователя
- POST /auth/token - обновление token

Защищенные маршруты:
- GET /user — получить всех пользователей
- GET /user/:id — получить пользователя по идентификатору
- PATCH /user/:id — обновить статус (active, inactive)

## 📦 Структура проекта
- src/ — исходный код:  
  - controllers/ — контроллеры
  - errors/ — централизованная обработка ошибок
  - middlewares/ — мидлвары auth, errorHandler, logger, validations
  - models/ — схемы
  - routes/ — роуты
  - app.ts — запуск сервера, подключение MongoDB, настройка роутов
  - config.ts — атрибуты PORT, DB_ADDRESS, AUTH_ACCESS_TOKEN_SECRET, AUTH_REFRESH_TOKEN_SECRET
- .editorconfig — настройки отступов и кодировки
- .eslintrc — конфигурация ESLint (Airbnb, исключение _id)
- package.json — скрипты start, dev, build, lint, зависимости
- tsconfig.json — настройки TypeScript
- .env.example - пример файла переменных окружения

## 📥 Установка и запуск

1. Установите зависимости:
```
npm install
```

2. Убедитесь, что MongoDB запущен локально на порту 27017

3. Скомпилируйте проект:
```
npm run build
```

4. Проверьте код на ошибки линтера:
```
npm run lint
```

5. Запустите проект:
```
npm run start
```

Приложение будет доступно по адресу: http://localhost:3000


## ☕ Проверка маршрутов

1. Пожалуйста установите MongoDB (https://www.mongodb.com/try/download/community)
2. Пожалуйста установите MongoDB Compass (https://www.mongodb.com/try/download/compass)
3. Создайте БД UsersService и коллекцию users

Проверка маршрута /register. Передайте в Body (raw).
```
{
    "email": "elon.musk@example.com", 
    "password": "qwerty",
    "fullname": "Илон Маск",
    "birthdate": "1971-06-28",
    "role": "user"
}
```
При успешной регистрации будет возвращен ответ в теле user, accessToken и refreshToken (cookies).

---

Проверка маршрута POST /login. Передайте в Body (raw)
```
{
    "email": "elon.musk@example.com",
    "password": "qwerty"
}
```
При успешной авторизации будет возвращен ответ в теле user, accessToken и refreshToken (cookies).

---

Проверка маршрута POST /logout
При успешной выходе будет возвращен ответ, refreshToken будет удален из БД и cookies.

---

Проверка маршрута POST /token
При успешной обноалении токенов будет возвращен ответ в теле user, accessToken и refreshToken (cookies).

---

Проверка маршрута GET /user
Пример строки: http://localhost:3000/user
Настройте раздел Authorization в Postman - Bearer Token, введите accessToken текущего пользователя с правами admin
Будет возвращён список пользователей.

---

Проверка маршрута GET /user/:id
Пример строки: http://localhost:3000/user/68a0f242d89e17e27d66888d
Настройте раздел Authorization в Postman - Bearer Token, введите accessToken текущего пользователя
Будет возвращён пользователь (либо админ, либо пользователь сам себя)

---

Проверка маршрута PATCH /user/:id
Пример строки: http://localhost:3000/user/68a0f242d89e17e27d66888d
Будет изменён статус пользователя (либо админ, либо пользователь сам себя)

```
{
    "status": "inactive"
}
```