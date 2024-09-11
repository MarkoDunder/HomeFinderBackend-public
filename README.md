# NestJS Application

## Description
This is a backend service built using [NestJS](https://nestjs.com/). It provides REST APIs for handling business logic, user authentication, and data management.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) (v6 or above)
- [PostgreSQL](https://www.postgresql.org/) or any supported database
- [Docker](https://www.docker.com/) (optional, for Docker setup)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
   - Create a `.env` file in the root directory of the project.
   - Add the necessary environment variables:
     ```bash
     DATABASE_HOST=localhost
     DATABASE_PORT=5432
     DATABASE_USERNAME=your-db-username
     DATABASE_PASSWORD=your-db-password
     DATABASE_NAME=your-db-name
     JWT_SECRET=your-jwt-secret
     REDIS_HOST=localhost
     REDIS_PORT=6379
     ```

4. Run database migrations (if applicable):
    ```bash
    npm run typeorm:migration:run
    ```

## Running the Application

### Development
To run the application in development mode:
```bash
npm run start:dev
