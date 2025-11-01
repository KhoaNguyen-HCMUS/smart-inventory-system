# API Endpoints Documentation

Complete API reference for Smart Inventory System.

**Base URL:** `http://localhost:5000`

**Authentication:** Most endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Table of Contents

- [Authentication](#-authentication-endpoints)
- [Users](#-user-endpoints)
- [Products](#-product-endpoints)
- [Suppliers](#-supplier-endpoints)
- [Customers](#-customer-endpoints)
- [Stock Moves](#-stock-move-endpoints)
- [Payable Ledgers](#-payable-ledger-endpoints)
- [Health](#-health-endpoints)
- [Error Responses](#-error-responses)

---

## 🔐 Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "id": "user-uuid",
  "displayName": "John Doe",
  "email": "john@example.com"
}
```

**Status Codes:**

- `201 Created` - Registration successful
- `400 Bad Request` - Validation error
- `409 Conflict` - Email already exists

---

### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "jwt-token-here",
  "user": {
    "id": "user-uuid",
    "displayName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Status Codes:**

- `200 OK` - Login successful
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Invalid credentials

---

### GET /auth/me

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": "user-uuid",
  "displayName": "John Doe",
  "email": "john@example.com"
}
```

**Status Codes:**

- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Invalid or missing token

---

## 👥 User Endpoints

### GET /users/:id

Get user by ID.

**Response:**

```json
{
  "id": "user-uuid",
  "displayName": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - User found
- `404 Not Found` - User not found

---

## 📦 Product Endpoints

**All endpoints require authentication.**

### POST /api/products

Create a new product.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "iPhone 15 Pro",
  "unitCode": "pcs",
  "costPrice": 25000000,
  "salePrice": 28000000,
  "isActive": true
}
```

**Response:**

```json
{
  "id": "product-uuid",
  "userId": "user-uuid",
  "name": "iPhone 15 Pro",
  "unitCode": "pcs",
  "costPrice": "25000000.00",
  "salePrice": "28000000.00",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `201 Created` - Product created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `409 Conflict` - Product with this name already exists for your account

**Notes:**

- Product name must be unique per user
- Default `unitCode` is `pcs` if not provided

---

### GET /api/products

Get all products for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `isActive` (optional): Filter by active status (`true` or `false`)

**Examples:**

```
GET /api/products
GET /api/products?isActive=true
GET /api/products?isActive=false
```

**Response:**

```json
[
  {
    "id": "product-uuid",
    "userId": "user-uuid",
    "name": "iPhone 15 Pro",
    "unitCode": "pcs",
    "costPrice": "25000000.00",
    "salePrice": "28000000.00",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Products retrieved successfully
- `401 Unauthorized` - Authentication required

---

### GET /api/products/:id

Get product by ID.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": "product-uuid",
  "userId": "user-uuid",
  "name": "iPhone 15 Pro",
  "unitCode": "pcs",
  "costPrice": "25000000.00",
  "salePrice": "28000000.00",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Product found
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Product not found or doesn't belong to user

---

### PATCH /api/products/:id

Update a product.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "iPhone 15 Pro Max",
  "costPrice": 30000000,
  "salePrice": 33000000
}
```

**Response:**

```json
{
  "id": "product-uuid",
  "userId": "user-uuid",
  "name": "iPhone 15 Pro Max",
  "unitCode": "pcs",
  "costPrice": "30000000.00",
  "salePrice": "33000000.00",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Product updated successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Product not found or doesn't belong to user
- `409 Conflict` - Product with this name already exists for your account

---

### DELETE /api/products/:id

Delete or deactivate a product.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Note:** If the product has stock moves, it will be deactivated (soft delete). Otherwise, it will be permanently deleted.

**Response:**

```json
{
  "message": "Product deleted successfully"
}
```

or

```json
{
  "message": "Product deactivated successfully",
  "product": { ... }
}
```

**Status Codes:**

- `200 OK` - Product deleted/deactivated successfully
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Product not found or doesn't belong to user

---

## 🏭 Supplier Endpoints

**All endpoints require authentication.**

### POST /api/suppliers

Create a new supplier.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "Supplier ABC",
  "phone": "+1234567890",
  "email": "contact@supplierabc.com",
  "address": "123 Supplier St, City, Country",
  "allowDebt": true
}
```

**Response:**

```json
{
  "id": "supplier-uuid",
  "userId": "user-uuid",
  "name": "Supplier ABC",
  "phone": "+1234567890",
  "email": "contact@supplierabc.com",
  "address": "123 Supplier St, City, Country",
  "allowDebt": true,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `201 Created` - Supplier created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `409 Conflict` - Supplier with this name already exists for your account

**Notes:**

- Supplier name must be unique per user
- Default `allowDebt` is `true` if not provided

---

### GET /api/suppliers

Get all suppliers for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `isActive` (optional): Filter by active status (`true` or `false`)

**Examples:**

```
GET /api/suppliers
GET /api/suppliers?isActive=true
GET /api/suppliers?isActive=false
```

**Response:**

```json
[
  {
    "id": "supplier-uuid",
    "userId": "user-uuid",
    "name": "Supplier ABC",
    "phone": "+1234567890",
    "email": "contact@supplierabc.com",
    "address": "123 Supplier St, City, Country",
    "allowDebt": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Suppliers retrieved successfully
- `401 Unauthorized` - Authentication required

---

### GET /api/suppliers/:id

Get supplier by ID.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": "supplier-uuid",
  "userId": "user-uuid",
  "name": "Supplier ABC",
  "phone": "+1234567890",
  "email": "contact@supplierabc.com",
  "address": "123 Supplier St, City, Country",
  "allowDebt": true,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Supplier found
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Supplier not found or doesn't belong to user

---

### PATCH /api/suppliers/:id

Update a supplier.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "Updated Supplier Name",
  "phone": "+0987654321",
  "allowDebt": false
}
```

**Response:**

```json
{
  "id": "supplier-uuid",
  "userId": "user-uuid",
  "name": "Updated Supplier Name",
  "phone": "+0987654321",
  "email": "contact@supplierabc.com",
  "address": "123 Supplier St, City, Country",
  "allowDebt": false,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Supplier updated successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Supplier not found or doesn't belong to user
- `409 Conflict` - Supplier with this name already exists for your account

---

### DELETE /api/suppliers/:id

Delete or deactivate a supplier.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Note:** If the supplier has stock moves, it will be deactivated (soft delete). Otherwise, it will be permanently deleted.

**Response:**

```json
{
  "message": "Supplier deleted successfully"
}
```

or

```json
{
  "message": "Supplier deactivated successfully",
  "supplier": { ... }
}
```

**Status Codes:**

- `200 OK` - Supplier deleted/deactivated successfully
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Supplier not found or doesn't belong to user

---

## 👤 Customer Endpoints

**All endpoints require authentication.**

### POST /api/customers

Create a new customer.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "Customer XYZ",
  "phone": "+1234567890",
  "email": "customer@example.com",
  "address": "456 Customer Ave, City, Country",
  "isActive": true
}
```

**Response:**

```json
{
  "id": "customer-uuid",
  "userId": "user-uuid",
  "name": "Customer XYZ",
  "phone": "+1234567890",
  "email": "customer@example.com",
  "address": "456 Customer Ave, City, Country",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `201 Created` - Customer created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `409 Conflict` - Customer with this name already exists for your account

**Notes:**

- Customer name must be unique per user
- Default `isActive` is `true` if not provided

---

### GET /api/customers

Get all customers for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `isActive` (optional): Filter by active status (`true` or `false`)

**Examples:**

```
GET /api/customers
GET /api/customers?isActive=true
GET /api/customers?isActive=false
```

**Response:**

```json
[
  {
    "id": "customer-uuid",
    "userId": "user-uuid",
    "name": "Customer XYZ",
    "phone": "+1234567890",
    "email": "customer@example.com",
    "address": "456 Customer Ave, City, Country",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Customers retrieved successfully
- `401 Unauthorized` - Authentication required

---

### GET /api/customers/:id

Get customer by ID.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": "customer-uuid",
  "userId": "user-uuid",
  "name": "Customer XYZ",
  "phone": "+1234567890",
  "email": "customer@example.com",
  "address": "456 Customer Ave, City, Country",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Customer found
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Customer not found or doesn't belong to user

---

### PATCH /api/customers/:id

Update a customer.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "Updated Customer Name",
  "phone": "+0987654321"
}
```

**Response:**

```json
{
  "id": "customer-uuid",
  "userId": "user-uuid",
  "name": "Updated Customer Name",
  "phone": "+0987654321",
  "email": "customer@example.com",
  "address": "456 Customer Ave, City, Country",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Customer updated successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Customer not found or doesn't belong to user
- `409 Conflict` - Customer with this name already exists for your account

---

### DELETE /api/customers/:id

Delete or deactivate a customer.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Note:** If the customer has stock moves, it will be deactivated (soft delete). Otherwise, it will be permanently deleted.

**Response:**

```json
{
  "message": "Customer deleted successfully"
}
```

or

```json
{
  "message": "Customer deactivated successfully",
  "customer": { ... }
}
```

**Status Codes:**

- `200 OK` - Customer deleted/deactivated successfully
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Customer not found or doesn't belong to user

---

## 📊 Stock Move Endpoints

**All endpoints require authentication.**

### POST /api/stock-moves

Create a stock move.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Move Reasons:**

- `IN` - Stock in (receiving goods from supplier) - requires `supplierId`
- `OUT` - Stock out (selling/shipping goods to customer) - requires `customerId`
- `ADJUST` - Inventory adjustment (positive or negative based on qtyDelta sign)

**Pay Types (for IN transactions only):**

- `CASH` - Paid immediately
- `CREDIT` - Purchase on credit (requires `unitPrice`, automatically creates PayableLedger BILL)

**Request Body:**

**Example: Stock IN with CASH payment**

```json
{
  "productId": "product-uuid",
  "qtyDelta": 100,
  "reason": "IN",
  "supplierId": "supplier-uuid",
  "unitPrice": 25000,
  "payType": "CASH",
  "note": "Received goods from supplier ABC"
}
```

**Example: Stock IN with CREDIT payment**

```json
{
  "productId": "product-uuid",
  "qtyDelta": 100,
  "reason": "IN",
  "supplierId": "supplier-uuid",
  "unitPrice": 25000,
  "payType": "CREDIT",
  "note": "Purchase on credit from supplier ABC"
}
```

**Example: Stock OUT**

```json
{
  "productId": "product-uuid",
  "qtyDelta": 50,
  "reason": "OUT",
  "customerId": "customer-uuid",
  "note": "Sold to customer XYZ"
}
```

**Example: Stock ADJUST**

```json
{
  "productId": "product-uuid",
  "qtyDelta": 5,
  "reason": "ADJUST",
  "note": "Inventory count adjustment"
}
```

**Response:**

```json
{
  "id": "stock-move-uuid",
  "userId": "user-uuid",
  "productId": "product-uuid",
  "qtyDelta": "100",
  "reason": "IN",
  "supplierId": "supplier-uuid",
  "customerId": null,
  "unitPrice": "25000.00",
  "payType": "CREDIT",
  "note": "Purchase on credit from supplier ABC",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "product": {
    "id": "product-uuid",
    "name": "iPhone 15 Pro",
    "unitCode": "pcs"
  },
  "supplier": {
    "id": "supplier-uuid",
    "name": "Supplier ABC"
  },
  "customer": null,
  "user": {
    "id": "user-uuid",
    "displayName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Status Codes:**

- `201 Created` - Stock move created successfully
- `400 Bad Request` - Validation error (missing required fields, invalid reason/payType combination, etc.)
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Product, supplier, or customer not found

**Notes:**

- For `IN` transactions: `supplierId` is required
- For `OUT` transactions: `customerId` is required
- For `CREDIT` payments: `unitPrice` is required (automatically creates PayableLedger BILL)
- `qtyDelta` should always be positive (sign is handled automatically: negative for OUT/ADJUST)
- When creating CREDIT purchase, a PayableLedger entry (BILL) is automatically created with `refMoveId` linking to this stock move

---

### GET /api/stock-moves

Get all stock moves with optional filters.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `productId` (optional): Filter by product ID
- `supplierId` (optional): Filter by supplier ID
- `customerId` (optional): Filter by customer ID
- `reason` (optional): Filter by reason (`IN`, `OUT`, `ADJUST`)
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)

**Examples:**

```
GET /api/stock-moves
GET /api/stock-moves?productId=xxx
GET /api/stock-moves?supplierId=yyy&reason=IN
GET /api/stock-moves?customerId=zzz&reason=OUT
GET /api/stock-moves?startDate=2024-01-01&endDate=2024-01-31
GET /api/stock-moves?productId=xxx&reason=OUT&startDate=2024-01-01
```

**Response:**

```json
[
  {
    "id": "stock-move-uuid",
    "userId": "user-uuid",
    "productId": "product-uuid",
    "qtyDelta": "100",
    "reason": "IN",
    "supplierId": "supplier-uuid",
    "customerId": null,
    "unitPrice": "25000.00",
    "payType": "CREDIT",
    "note": "Received goods",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "product": {
      "id": "product-uuid",
      "name": "iPhone 15 Pro",
      "unitCode": "pcs"
    },
    "supplier": {
      "id": "supplier-uuid",
      "name": "Supplier ABC"
    },
    "customer": null,
    "user": { ... }
  }
]
```

**Status Codes:**

- `200 OK` - Stock moves retrieved successfully
- `401 Unauthorized` - Authentication required

---

### GET /api/stock-moves/stock/:productId

Get current stock quantity for a product.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Examples:**

```
GET /api/stock-moves/stock/product-uuid
```

**Response:**

```json
{
  "productId": "product-uuid",
  "currentStock": 150.5,
  "totalMoves": 25
}
```

**Status Codes:**

- `200 OK` - Stock calculated successfully
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Product not found or doesn't belong to user

---

### GET /api/stock-moves/:id

Get stock move by ID.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": "stock-move-uuid",
  "userId": "user-uuid",
  "productId": "product-uuid",
  "qtyDelta": "100",
  "reason": "IN",
  "supplierId": "supplier-uuid",
  "customerId": null,
  "unitPrice": "25000.00",
  "payType": "CREDIT",
  "note": "Received goods",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "product": { ... },
  "supplier": { ... },
  "customer": null,
  "user": { ... }
}
```

**Status Codes:**

- `200 OK` - Stock move found
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Stock move not found or doesn't belong to user

---

## 💰 Payable Ledger Endpoints

**All endpoints require authentication.**

The Payable Ledger tracks accounts payable (AP) for suppliers. It records BILLs (increasing debt), PAYMENTs (reducing debt), and ADJUSTments.

### POST /api/payable-ledgers

Create a payable ledger entry.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Ledger Types:**

- `BILL` - Purchase invoice (increases debt) - typically auto-created when CREDIT purchase
- `PAYMENT` - Payment to supplier (decreases debt)
- `ADJUST` - Adjustment to balance (can increase or decrease debt)

**Request Body:**

**Example: Record a payment**

```json
{
  "supplierId": "supplier-uuid",
  "type": "PAYMENT",
  "amountDelta": 500000,
  "note": "Payment for invoice #123"
}
```

**Example: Manual adjustment**

```json
{
  "supplierId": "supplier-uuid",
  "type": "ADJUST",
  "amountDelta": 10000,
  "note": "Discount adjustment"
}
```

**Response:**

```json
{
  "id": "ledger-uuid",
  "userId": "user-uuid",
  "supplierId": "supplier-uuid",
  "type": "PAYMENT",
  "amountDelta": "-500000.00",
  "note": "Payment for invoice #123",
  "refMoveId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "supplier": {
    "id": "supplier-uuid",
    "name": "Supplier ABC"
  },
  "refMove": null,
  "user": { ... }
}
```

**Status Codes:**

- `201 Created` - Payable ledger entry created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Supplier or referenced stock move not found

**Notes:**

- `amountDelta` should always be positive in the request
- The sign is automatically handled: positive for BILL, negative for PAYMENT/ADJUST
- `refMoveId` is optional and links to the related StockMove (for BILL entries created from CREDIT purchases)

---

### GET /api/payable-ledgers

Get all payable ledger entries with optional filters.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `supplierId` (optional): Filter by supplier ID
- `type` (optional): Filter by type (`BILL`, `PAYMENT`, `ADJUST`)
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)

**Examples:**

```
GET /api/payable-ledgers
GET /api/payable-ledgers?supplierId=xxx
GET /api/payable-ledgers?type=PAYMENT
GET /api/payable-ledgers?startDate=2024-01-01&endDate=2024-01-31
GET /api/payable-ledgers?supplierId=xxx&type=BILL
```

**Response:**

```json
[
  {
    "id": "ledger-uuid",
    "userId": "user-uuid",
    "supplierId": "supplier-uuid",
    "type": "BILL",
    "amountDelta": "2500000.00",
    "note": "Purchase invoice for iPhone 15 Pro - Qty: 100",
    "refMoveId": "stock-move-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "supplier": { ... },
    "refMove": {
      "id": "stock-move-uuid",
      "productId": "product-uuid",
      "qtyDelta": "100",
      "unitPrice": "25000.00",
      "product": { ... }
    },
    "user": { ... }
  }
]
```

**Status Codes:**

- `200 OK` - Payable ledgers retrieved successfully
- `401 Unauthorized` - Authentication required

---

### GET /api/payable-ledgers/supplier/:supplierId/balance

Get current payable balance for a supplier.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "supplierId": "supplier-uuid",
  "balance": 2500000.0,
  "totalLedgers": 15
}
```

**Status Codes:**

- `200 OK` - Balance calculated successfully
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Supplier not found or doesn't belong to user

**Notes:**

- Positive balance = amount owed to supplier
- Negative balance = supplier owes you (credit balance)

---

### GET /api/payable-ledgers/supplier/:supplierId

Get all payable ledger entries for a specific supplier.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
[
  {
    "id": "ledger-uuid",
    "userId": "user-uuid",
    "supplierId": "supplier-uuid",
    "type": "BILL",
    "amountDelta": "2500000.00",
    "note": "Purchase invoice",
    "refMoveId": "stock-move-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "refMove": { ... },
    "user": { ... }
  }
]
```

**Status Codes:**

- `200 OK` - Payable ledgers retrieved successfully
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Supplier not found or doesn't belong to user

---

### GET /api/payable-ledgers/:id

Get payable ledger entry by ID.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": "ledger-uuid",
  "userId": "user-uuid",
  "supplierId": "supplier-uuid",
  "type": "BILL",
  "amountDelta": "2500000.00",
  "note": "Purchase invoice for iPhone 15 Pro - Qty: 100",
  "refMoveId": "stock-move-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "supplier": { ... },
  "refMove": { ... },
  "user": { ... }
}
```

**Status Codes:**

- `200 OK` - Payable ledger found
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Payable ledger not found or doesn't belong to user

---

## 💚 Health Endpoints

### GET /api/health

Check database connection health.

**Response:**

```json
{
  "status": "ok",
  "database": "connected"
}
```

**Status Codes:**

- `200 OK` - Service is healthy

---

## ❌ Error Responses

All error responses follow a consistent format:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Product with this name already exists for your account",
  "error": "Conflict"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 🔒 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token:

1. Register: `POST /auth/register`
2. Login: `POST /auth/login` - Returns `accessToken`

**Token Expiration:** Tokens expire after the time specified in `JWT_EXPIRES_IN` environment variable (default: 1 year).

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Decimal values are returned as strings to preserve precision
- UUIDs are used for all entity IDs
- Pagination is not implemented yet (returns all results)
- Filter parameters are optional and can be combined
- Date filters accept ISO format strings (e.g., `2024-01-01T00:00:00.000Z`)
- All data is isolated per user (multi-tenant system)
- Product, Supplier, and Customer names must be unique per user

---

## 🚀 Example Workflows

### Complete Stock Receiving Flow (CASH Payment)

1. **Login**

   ```http
   POST /auth/login
   { "email": "user@example.com", "password": "password" }
   ```

2. **Create Supplier (if needed)**

   ```http
   POST /api/suppliers
   { "name": "Supplier ABC", "phone": "+1234567890" }
   ```

3. **Create Product (if needed)**

   ```http
   POST /api/products
   { "name": "iPhone 15 Pro", "unitCode": "pcs", "costPrice": 25000 }
   ```

4. **Receive Stock (CASH)**

   ```http
   POST /api/stock-moves
   {
     "productId": "product-uuid",
     "qtyDelta": 100,
     "reason": "IN",
     "supplierId": "supplier-uuid",
     "unitPrice": 25000,
     "payType": "CASH",
     "note": "Received from supplier"
   }
   ```

5. **Check Stock**

   ```http
   GET /api/stock-moves/stock/product-uuid
   ```

---

### Complete Stock Receiving Flow (CREDIT Payment)

1. **Login** (same as above)

2. **Create Supplier and Product** (same as above)

3. **Receive Stock (CREDIT)**

   ```http
   POST /api/stock-moves
   {
     "productId": "product-uuid",
     "qtyDelta": 100,
     "reason": "IN",
     "supplierId": "supplier-uuid",
     "unitPrice": 25000,
     "payType": "CREDIT",
     "note": "Purchase on credit"
   }
   ```

   **Note:** This automatically creates a PayableLedger BILL entry.

4. **Check Payable Balance**

   ```http
   GET /api/payable-ledgers/supplier/supplier-uuid/balance
   ```

5. **Record Payment**

   ```http
   POST /api/payable-ledgers
   {
     "supplierId": "supplier-uuid",
     "type": "PAYMENT",
     "amountDelta": 2500000,
     "note": "Payment for invoice"
   }
   ```

6. **Check Updated Balance**

   ```http
   GET /api/payable-ledgers/supplier/supplier-uuid/balance
   ```

---

### Complete Stock Selling Flow

1. **Login** (same as above)

2. **Create Customer (if needed)**

   ```http
   POST /api/customers
   { "name": "Customer XYZ", "phone": "+0987654321" }
   ```

3. **Sell Stock**

   ```http
   POST /api/stock-moves
   {
     "productId": "product-uuid",
     "qtyDelta": 50,
     "reason": "OUT",
     "customerId": "customer-uuid",
     "note": "Sold to customer"
   }
   ```

4. **Check Updated Stock**

   ```http
   GET /api/stock-moves/stock/product-uuid
   ```
