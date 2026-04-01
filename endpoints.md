# API Endpoints

Base URL examples use `http://localhost:8000`.

## 1) Health

### GET `/health`
- Auth: No
- Request body: None

Sample request:
```bash
curl -X GET http://localhost:8000/health
```

## 2) Auth

### POST `/auth/register`
- Auth: No
- Content-Type: `application/json`

Sample request body:
```json
{
  "username": "emma_green",
  "email": "emma@example.com",
  "password": "TestPassword123!",
  "displayName": "Emma Green"
}
```

Sample request:
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "emma_green",
    "email": "emma@example.com",
    "password": "TestPassword123!",
    "displayName": "Emma Green"
  }'
```

### POST `/auth/login`
- Auth: No
- Content-Type: `application/json`

Sample request body (based on seeded user in `sql/init_db.sql`):
```json
{
  "email": "jane@example.com",
  "password": "TestPassword123!"
}
```

Sample request:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "TestPassword123!"
  }'
```

## 3) Datasets

### GET `/datasets`
- Auth: No
- Request body: None

Sample request:
```bash
curl -X GET http://localhost:8000/datasets
```

### GET `/datasets/:datasetId`
- Auth: No
- Request body: None

Sample request (`datasetId=1` is the seeded dataset `global-climate-indicators-2000-2023`):
```bash
curl -X GET http://localhost:8000/datasets/1
```

### GET `/datasets/:datasetId/feedback`
- Auth: No
- Request body: None

Sample request (`datasetId=1`):
```bash
curl -X GET http://localhost:8000/datasets/1/feedback
```

### POST `/datasets/:datasetId/feedback`
- Auth: Yes (`Authorization: Bearer <jwt_token>`)
- Content-Type: `application/json`

Sample request body (aligned with seeded feedback text):
```json
{
  "rating": 5,
  "comment": "Comprehensive and well-structured dataset. Missing values are minimal and clearly documented."
}
```

Sample request:
```bash
curl -X POST http://localhost:8000/datasets/1/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "rating": 5,
    "comment": "Comprehensive and well-structured dataset. Missing values are minimal and clearly documented."
  }'
```

### POST `/datasets/upload`
- Auth: Yes (`Authorization: Bearer <jwt_token>`)
- Content-Type: `multipart/form-data`
- Required fields:
  - `title` (text)
  - `file` (CSV file)
- Optional field:
  - `description` (text)

Seed-based field example:
- `title`: `Global Climate Indicators 2000-2023`
- `description`: `Monthly climate metrics across 195 countries including temperature anomalies, CO2 levels, and sea surface data.`

Sample request:
```bash
curl -X POST http://localhost:8000/datasets/upload \
  -H "Authorization: Bearer <jwt_token>" \
  -F "title=Global Climate Indicators 2000-2023" \
  -F "description=Monthly climate metrics across 195 countries including temperature anomalies, CO2 levels, and sea surface data." \
  -F "file=@/absolute/path/to/data.csv"
```

## 4) Versions

### GET `/versions/:versionId/download`
- Auth: Optional (supports guest or authenticated user)
- Request body: None

Sample request (`versionId=1` is seeded as version `1.0.0`):
```bash
curl -X GET http://localhost:8000/versions/1/download -o data.csv
```

Authenticated sample:
```bash
curl -X GET http://localhost:8000/versions/1/download \
  -H "Authorization: Bearer <jwt_token>" \
  -o data.csv
```

## 5) AI

### POST `/ai/suggest-metadata`
- Auth: Yes (`Authorization: Bearer <jwt_token>`)
- Content-Type: `application/json`

Sample request body:
```json
{
  "datasetId": 1
}
```

Sample request:
```bash
curl -X POST http://localhost:8000/ai/suggest-metadata \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "datasetId": 1
  }'
```

## Seed IDs Used In Samples

From `sql/init_db.sql`:
- Seeded dataset slug: `global-climate-indicators-2000-2023`
- Seeded version number: `1.0.0`
- Seeded login user: `jane@example.com` / `TestPassword123!`
- Sample IDs in this doc (`datasetId=1`, `versionId=1`) assume a fresh run of the SQL script.
