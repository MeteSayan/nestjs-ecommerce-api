# NestJS E-commerce API

![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

A modern and scalable e-commerce API built with NestJS framework, written in TypeScript, and using PostgreSQL database.

## 🚀 Features

- 🔐 JWT-based authentication and authorization
- 👥 User management (registration, login, profile management)
- 🛍️ Product management (CRUD operations)
- 📦 Order management
- ⭐ Product reviews and ratings
- 📑 Category management
- 📚 Swagger UI API documentation
- 🔄 TypeORM database management
- 🧪 Jest testing infrastructure
- 🔒 Security measures (Helmet, Compression)

## 🛠️ Technologies

- **Framework:** NestJS
- **Programming Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **API Documentation:** Swagger UI
- **Testing:** Jest
- **Security:** JWT, Bcrypt, Helmet
- **Code Quality:** ESLint, Prettier

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/MeteSayan/nestjs-ecommerce-api.git
cd nestjs-ecommerce-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure database settings:
- Update database connection details in `config/default.json`

4. Run database migrations:
```bash
npm run migration:run
```

## 🏃‍♂️ Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📚 API Documentation

Access the API documentation through Swagger UI:
```
http://localhost:3200/api/docs
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Generate test coverage report
npm run test:cov

# Run E2E tests
npm run test:e2e
```

## 📦 Database Migrations

```bash
# Generate new migration
npm run migration:generate -- db/migrations/migration-name

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## 🔐 Security

- JWT-based authentication
- Password hashing (Bcrypt)
- Security headers with Helmet
- Rate limiting
- CORS configuration

## 📁 Project Structure

```
src/
├── users/           # User management
├── products/        # Product management
├── orders/          # Order management
├── categories/      # Category management
├── reviews/         # Product reviews
└── utils/           # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Contact

Mete Sayan - [GitHub](https://github.com/MeteSayan)

Project Link: [https://github.com/MeteSayan/nestjs-ecommerce-api](https://github.com/MeteSayan/nestjs-ecommerce-api)
