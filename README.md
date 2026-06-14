# Mobil Yetkilendirme Demo

Bu proje, mobil uygulamalarda yetkilendirme kavramlarını canlı demo üzerinden göstermek amacıyla yapılmıştır.

## Konu Başlıkları

- **JWT (JSON Web Token)** — Kullanıcı girişi sonrası token üretimi ve token içinden rol okuma
- **RBAC (Rol Tabanlı Erişim Kontrolü)** — Admin ve kullanıcı rollerine göre farklı ekranlar
- **Runtime Permission** — Uygulama çalışırken kamera izni isteme, reddetme ve ayarlara yönlendirme

## Kullanılan Teknolojiler

- React Native
- Expo
- TypeScript
- expo-crypto
- expo-image-picker
- jwt-decode

## Kurulum

```bash
npm install
npx expo start
```

## Test Kullanıcıları

| Kullanıcı Adı | Şifre | Rol   |
|---------------|-------|-------|
| hamza         | 1234  | admin |
| osman         | 1234  | user  |







# Mobile Authorization Demo

A demo project built to showcase core mobile authorization concepts.

## Topics Covered

- **JWT (JSON Web Token)** — Token generation after login and reading role from token
- **RBAC (Role-Based Access Control)** — Different screens based on admin and user roles
- **Runtime Permission** — Requesting camera permission at runtime, handling denial and redirecting to settings

## Tech Stack

- React Native
- Expo
- TypeScript
- expo-crypto
- expo-image-picker
- jwt-decode

## Setup

```bash
npm install
npx expo start
```

## Test Users

| Username | Password | Role  |
|----------|----------|-------|
| hamza    | 1234     | admin |
| osman    | 1234     | user  |
