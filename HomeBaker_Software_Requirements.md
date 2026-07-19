# Software Requirements Specification (SRS)
## Project Name: HomeBaker — Custom Bakery & Order Management System
**Version:** 1.0.0  
**Date:** July 19, 2026  
**Architecture:** Full-Stack (React.js + Spring Boot + Supabase PostgreSQL)

---

## 1. Executive Summary
**HomeBaker** is a modern full-stack web application built to connect local homebakers with custom cake customers. The application provides auto-detection of nearby homebakers via geolocation, interactive custom cake building, automated email notifications to bakers, live order tracking, and custom baker-customer messaging.

---

## 2. Technology Stack & External APIs

### 2.1 Software Stack
| Layer | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), Vanilla CSS3 | Dynamic Sky Blue UI with responsive mobile/desktop layouts |
| **Backend** | Java 17, Spring Boot 3.3.4 | RESTful API backend handling business logic and ORM mappings |
| **Database** | PostgreSQL (Supabase Cloud) | Managed relational database storing 6 tables (`users`, `products`, `orders`, `chats`, `reviews`, `slots`) |
| **Security** | Spring Security + JWT Tokens | Stateless authentication with role-based access control (`CUSTOMER`, `BAKER`) |

### 2.2 External APIs Integrated
1. **OpenStreetMap (Nominatim Reverse Geocoding API)**: Auto-detects customer lat/long coordinates and resolves the city name to filter nearby homebakers. (No API key required).
2. **EmailJS API (`@emailjs/browser`)**: Sends real-time email order notifications directly to homebakers upon order placement.
3. **Unsplash API**: High-resolution food & bakery photography assets.

---

## 3. Hardware & Software Requirements

### 3.1 Hardware Requirements
- **Processor**: Dual-Core 2.0 GHz or higher (Intel Core i3/i5/i7 or AMD Ryzen).
- **RAM**: Minimum 4 GB (8 GB recommended for concurrent backend and frontend server execution).
- **Storage**: 500 MB free hard disk space for code repositories, dependencies, and build artifacts.
- **Display**: Minimum 1024x768 resolution.

### 3.2 Client Software Requirements
- **Web Browser**: HTML5-compliant browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).
- **Operating System**: Windows 10/11, macOS, Linux, Android, or iOS.

### 3.3 Development Environment Requirements
- **JDK**: Java Development Kit 17+ or JDK 21+.
- **Node.js**: Node.js v18.0.0+ and npm 9+.
- **Build Tools**: Gradle 8.x / 9.x Wrapper.
- **Database Engine**: PostgreSQL 14+ / Supabase Cloud Instance.

---

## 4. Functional Requirements

### 4.1 Authentication & Security
- User registration with role selection (`CUSTOMER` or `BAKER`).
- BCrypt password encryption for storing passwords securely.
- JWT token generation upon login with 24-hour expiration (`86400000 ms`).

### 4.2 Geolocation & Baker Discovery
- Browser GPS auto-detection using `navigator.geolocation`.
- City extraction via Nominatim reverse geocoding.
- Automatic filtering of nearby homebakers and their signature cakes.

### 4.3 Custom Cake Builder & Price Engine
- Custom selection of Cake Shape, Size, Flavor, Toppings, and Inscription Message.
- Live price computation in Indian Rupees (`₹`).
- Instant order submission triggering EmailJS notification to the baker.

### 4.4 Live Order Pipeline & Tracking
- Order status workflow: `CONFIRMED` ➔ `BAKING` ➔ `READY` ➔ `DELIVERED`.
- Baker Dashboard for managing bake slots and updating status.
- Customer Tracking Dashboard displaying live timeline and item details.

---

## 5. Non-Functional Requirements
- **Security**: JWT authorization header required for protected endpoints; BCrypt password hashing.
- **Usability**: Responsive Sky Blue (`#0284c7`), Ice Blue (`#f0f9ff`), and Navy Palette UI design.
- **Performance**: API response times under 200 ms.
- **Availability**: 99.9% uptime with Supabase PostgreSQL and Render PaaS deployment.
