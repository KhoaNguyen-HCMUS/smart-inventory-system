# Unit Management API Documentation

## 📦 Unit Endpoints

### POST /units

Create a new unit.

**Request Body:**

```json
{
  "code": "PCS",
  "name": "Pieces"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "unit-id",
    "code": "PCS",
    "name": "Pieces",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Unit created successfully"
}
```

### GET /units

Get all units with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### GET /units

Get all units without pagination.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "unit-id",
      "code": "PCS",
      "name": "Pieces",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "All units retrieved successfully"
}
```

### GET /units/:id

Get unit by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "unit-id",
    "code": "PCS",
    "name": "Pieces",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Unit retrieved successfully"
}
```

### PATCH /units/:id

Update unit by ID.

**Request Body:**

```json
{
  "code": "PCS",
  "name": "Pieces Updated"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "unit-id",
    "code": "PCS",
    "name": "Pieces Updated",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Unit updated successfully"
}
```

### DELETE /units/:id

Delete unit by ID.

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Unit deleted successfully"
}
```

## 🔧 Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Code is required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Unit not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "Unit with this code already exists",
  "error": "Conflict"
}
```

### 409 Conflict (Cannot Delete)

```json
{
  "success": false,
  "message": "Cannot delete unit that is being used by products",
  "error": "Conflict"
}
```

## 🚀 Usage Examples

### 1. Create a new unit

```bash
curl -X POST http://localhost:5000/units \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PCS",
    "name": "Pieces"
  }'
```

### 2. Get all units with pagination

```bash
curl -X GET "http://localhost:5000/units?page=1&limit=10"
```

### 2.1. Get all units without pagination

```bash
curl -X GET http://localhost:5000/units/all
```

### 3. Get unit by ID

```bash
curl -X GET http://localhost:5000/units/unit-id
```

### 4. Update unit

```bash
curl -X PATCH http://localhost:5000/units/unit-id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pieces Updated"
  }'
```

### 5. Delete unit

```bash
curl -X DELETE http://localhost:5000/units/unit-id
```

## 📝 Business Rules

1. **Unit Code Uniqueness**: Each unit code must be unique
2. **Required Fields**: Both `code` and `name` are required for creation
3. **Update Validation**: When updating, new code must not conflict with existing units
4. **Delete Protection**: Cannot delete units that are being used by products
5. **Pagination**: All list endpoints support pagination

## 🎯 Common Unit Examples

- **PCS** - Pieces
- **BOX** - Boxes
- **KG** - Kilograms
- **L** - Liters
- **M** - Meters
- **SET** - Sets
- **PAIR** - Pairs
