# Warehouse Management API Documentation

## 🏢 Warehouse Endpoints

### POST /api/warehouses

Create a new warehouse.

**Request Body:**

```json
{
  "code": "WH001",
  "name": "Main Warehouse",
  "address": "123 Main Street, City"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "warehouse-id",
    "code": "WH001",
    "name": "Main Warehouse",
    "address": "123 Main Street, City",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Warehouse created successfully"
}
```

### GET /api/warehouses

Get all warehouses without pagination.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "warehouse-id",
      "code": "WH001",
      "name": "Main Warehouse",
      "address": "123 Main Street, City",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "All warehouses retrieved successfully"
}
```

### GET /api/warehouses/:id

Get warehouse by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "warehouse-id",
    "code": "WH001",
    "name": "Main Warehouse",
    "address": "123 Main Street, City",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Warehouse retrieved successfully"
}
```

### PATCH /api/warehouses/:id

Update warehouse by ID.

**Request Body:**

```json
{
  "name": "Updated Warehouse Name",
  "address": "456 New Street, City"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "warehouse-id",
    "code": "WH001",
    "name": "Updated Warehouse Name",
    "address": "456 New Street, City",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Warehouse updated successfully"
}
```

### DELETE /api/warehouses/:id

Delete warehouse by ID.

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Warehouse deleted successfully"
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
  "message": "Warehouse not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "Warehouse with this code already exists",
  "error": "Conflict"
}
```

### 409 Conflict (Cannot Delete)

```json
{
  "success": false,
  "message": "Cannot delete warehouse that is being used by documents",
  "error": "Conflict"
}
```

## 🚀 Usage Examples

### 1. Create a new warehouse

```bash
curl -X POST http://localhost:5000/api/warehouses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WH001",
    "name": "Main Warehouse",
    "address": "123 Main Street, City"
  }'
```

### 2. Get all warehouses

```bash
curl -X GET http://localhost:5000/api/warehouses
```

### 3. Get warehouse by ID

```bash
curl -X GET http://localhost:5000/api/warehouses/warehouse-id
```

### 4. Update warehouse

```bash
curl -X PATCH http://localhost:5000/api/warehouses/warehouse-id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Warehouse Name",
    "address": "456 New Street, City"
  }'
```

### 5. Delete warehouse

```bash
curl -X DELETE http://localhost:5000/api/warehouses/warehouse-id
```

## 📝 Business Rules

1. **Warehouse Code Uniqueness**: Each warehouse code must be unique
2. **Required Fields**: `code` and `name` are required for creation
3. **Update Validation**: When updating, new code must not conflict with existing warehouses
4. **Delete Protection**: Cannot delete warehouses that are being used by documents
5. **No Pagination**: All list endpoints return all warehouses without pagination

## 🎯 Common Warehouse Examples

- **WH001** - Main Warehouse
- **WH002** - Secondary Warehouse
- **WH003** - Cold Storage
- **WH004** - Returns Warehouse
- **WH005** - Distribution Center
