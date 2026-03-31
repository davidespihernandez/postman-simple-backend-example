# postman-simple-backend-example

Simple Express CRUD API for a `customer` resource, backed by in-memory storage (no database).

## Customer shape

```json
{
  "uuid": "generated-by-api",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com"
}
```

## Requirements

- Node.js 18+ (works great with Node 20+)

## Install and run

```bash
npm install
npm start
```

API starts at `http://localhost:3000`.

## Endpoints

### Health/info

- `GET /`

### Customers CRUD

- `GET /customers` - List all customers
- `GET /customers/:uuid` - Get one customer
- `POST /customers` - Create a customer
- `PUT /customers/:uuid` - Replace a customer
- `PATCH /customers/:uuid` - Partially update a customer
- `DELETE /customers/:uuid` - Delete a customer

## Postman-ready examples

Set base URL:

`http://localhost:3000`

### Create customer

`POST /customers`

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com"
}
```

Response `201 Created`:

```json
{
  "uuid": "5f9d9f2a-4f43-4274-8c3a-1a2b3c4d5e6f",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com"
}
```

### List customers

`GET /customers`

Response `200 OK`:

```json
[
  {
    "uuid": "5f9d9f2a-4f43-4274-8c3a-1a2b3c4d5e6f",
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada@example.com"
  }
]
```

### Get customer by uuid

`GET /customers/:uuid`

Response `200 OK`:

```json
{
  "uuid": "5f9d9f2a-4f43-4274-8c3a-1a2b3c4d5e6f",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com"
}
```

### Replace customer

`PUT /customers/:uuid`

```json
{
  "firstName": "Grace",
  "lastName": "Hopper",
  "email": "grace@example.com"
}
```

Response `200 OK` with updated customer.

### Partial update

`PATCH /customers/:uuid`

```json
{
  "email": "new-email@example.com"
}
```

Response `200 OK` with updated customer.

### Delete customer

`DELETE /customers/:uuid`

Response `204 No Content`.

## Validation notes

- `firstName`, `lastName`, and `email` must be non-empty strings.
- `email` must be in a valid email format.
- `POST` and `PUT` require all three fields.
- `PATCH` requires at least one of `firstName`, `lastName`, or `email`.