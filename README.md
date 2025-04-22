# SWIFT Codes API

## Description
REST API for working with bank SWIFT codes and countries. Supports Excel data import, strict validation, PostgreSQL, and is fully automated for launch via Docker Compose.

---

## Quick Start (Docker)

1. **Clone the repository and go to the project folder:**
   ```sh
   git clone https://github.com/Nurmx7292/SWIFT_API.git
   cd swift-codes-api
   ```

2. **Create a `.env` file based on `.env.example` and set your parameters:**
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=yourpassword
   POSTGRES_DB=swiftcodes
   DATABASE_URL=postgres://postgres:yourpassword@db:5432/swiftcodes
   PORT=8080
   ```

3. **Place your Excel file with data in the `data/` folder (next to docker-compose.yml):**
   - If you run the project locally, you can use any Excel file you want for import.
   - If you run the project in a container, the mock data from the Excel file you put in `data/` will be automatically loaded into the database on the first launch.
   - Example: `data/swift-codes.xlsx`

4. **Start the project:**
   ```sh
   docker compose up --build
   ```

5. **The API will be available at:**
   - http://localhost:8080

---

## Main Features
- Excel data import on first launch
- Automatic database creation and migration
- Strict validation for SWIFT codes and country ISO codes
- CRUD for SWIFT codes and countries
- Integration and unit tests (Jest, ts-jest)

---

## API Request Examples

### Get SWIFT code details
```http
GET /v1/swift-codes/PLTEST00XXX
```

### Get all SWIFT codes for a country
```http
GET /v1/swift-codes/country/PL
```

### Create a new SWIFT code
```http
POST /v1/swift-codes
Content-Type: application/json
{
  "swiftCode": "PLTEST00001",
  "bankName": "TEST BANK POLAND",
  "address": "UL. BRANCH 1, 00-000 WARSZAWA",
  "countryISO2": "PL",
  "countryName": "POLAND",
  "isHeadquarter": false
}
```

---

## Excel Data Import
- On the first container launch, all `.xlsx` files in the `data/` folder are automatically imported.
- If the database already exists (volume is not removed), import will not repeat.
- To re-import, remove the database volume:
  ```sh
  docker compose down -v
  docker compose up --build
  ```

---

## Testing

### In the container (recommended)
```sh
docker compose exec app npm test
```

### Locally
- Make sure your `.env` connection string points to your local Postgres:
  ```env
  DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/swiftcodes
  ```
- Run:
  ```sh
  npm test
  ```

---

## Notes & Nuances
- All database and app parameters are set via `.env`.
- For Docker, use `db` in the connection string; for local runs, use `localhost`.
- On first launch, the database and tables are created automatically.
- Excel import only runs if the database volume is empty.
- For a clean start, use `docker compose down -v`.
- Tests run only from source files, not from compiled files.

---

## Project Structure
```
swift-codes-api/
├── src/           # Application source code
├── __tests__/     # Integration and unit tests
├── data/          # Excel files for import
├── prisma/        # Prisma schema and migrations
├── docker/        # Dockerfile and helper scripts
├── package.json
├── tsconfig.json
├── tsconfig.test.json
├── jest.config.js
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Contacts
If you have any questions — feel free to ask! 

## Local Setup (without Docker)

> **Recommended:** Use Docker for the easiest and most automated setup. Manual local setup is only for advanced users or development without Docker.

1. **Install [PostgreSQL](https://www.postgresql.org/download/)** and make sure it is running.
2. **Create a database and user** according to your `.env` settings.
3. **Install [Node.js](https://nodejs.org/)** (v18+ recommended).
4. **Install dependencies:**
   ```sh
   npm install
   ```
5. **Copy `.env.example` to `.env` and set your local database connection:**
   ```env
   DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/swiftcodes
   ```
6. **Run database migrations:**
   ```sh
   npx prisma migrate deploy
   ```
7. **(Optional) Import Excel data:**
   ```sh
   npm run parse
   ```
8. **Start the server:**
   ```sh
   npm run dev
   ``` 