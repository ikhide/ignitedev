# AdonisJS App

Welcome to your AdonisJS app! This README provides details on how to set up, run, test, and work with the application.

## Table of Contents

- [AdonisJS App](#adonisjs-app)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Linting](#linting)
  - [Dockerized Database](#dockerized-database)
  - [Available Scripts](#available-scripts)
  - [API Documentation](#api-documentation)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-adonis-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-adonis-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To run the app in development mode:

```bash
npm run dev
```

This will start the development server, and you can access the app at http://localhost:3333.

For production, you can build the app and start the server:

```bash
npm run build
npm start
```

## Testing

Run tests using:

```bash
npm test

```

For test coverage:

```bash
npm run test:coverage

```

## Linting

Lint your TypeScript files with:

```bash
npm run lint

```

## Dockerized Database

For database operations using Docker:

- Start the database:

```bash
npm run infra:up
```

- Stop the database:

```bash
npm run infra:down
```

## Available Scripts

- `npm run dev`: Start the development server with watch mode.
- `npm run build`: Build the app for production.
- `npm start:` Start the app in production mode.
- `npm test:` Run tests.
- `npm run test:coverage:` Run tests with coverage using NYC.
- `npm run lint:` Lint TypeScript files.
- `npm run format:` Format files using Prettier.
- `npm run infra:up:` Start the Dockerized database.
- `npm run infra:down:` Stop the Dockerized database.

## API Documentation

After running the application, check the swagger documentation on

```bash
GET /docs
```
