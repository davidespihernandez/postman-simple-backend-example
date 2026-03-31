const express = require("express");
const { randomUUID } = require("node:crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const customers = [];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function findCustomerById(id) {
  return customers.find((customer) => customer.uuid === id);
}

function validateCustomerPayload(payload, { partial = false } = {}) {
  const errors = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    errors.push("Request body must be a JSON object");
    return errors;
  }

  const fields = ["firstName", "lastName", "email"];

  if (!partial) {
    for (const field of fields) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        errors.push(`${field} is required and must be a non-empty string`);
      }
    }
  }

  for (const field of fields) {
    if (field in payload && (typeof payload[field] !== "string" || !payload[field].trim())) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if ("email" in payload && typeof payload.email === "string" && !EMAIL_REGEX.test(payload.email.trim())) {
    errors.push("email must be a valid email address");
  }

  return errors;
}

app.get("/", (_req, res) => {
  res.json({
    message: "Customer API is running",
    endpoints: [
      "GET /customers",
      "GET /customers/:uuid",
      "POST /customers",
      "PUT /customers/:uuid",
      "PATCH /customers/:uuid",
      "DELETE /customers/:uuid",
    ],
  });
});

app.get("/customers", (_req, res) => {
  res.json(customers);
});

app.get("/customers/:uuid", (req, res) => {
  const customer = findCustomerById(req.params.uuid);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  return res.json(customer);
});

app.post("/customers", (req, res) => {
  const validationErrors = validateCustomerPayload(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: validationErrors });
  }

  const customer = {
    uuid: randomUUID(),
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email.trim().toLowerCase(),
  };

  customers.push(customer);
  return res.status(201).json(customer);
});

app.put("/customers/:uuid", (req, res) => {
  const customer = findCustomerById(req.params.uuid);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const validationErrors = validateCustomerPayload(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: validationErrors });
  }

  customer.firstName = req.body.firstName.trim();
  customer.lastName = req.body.lastName.trim();
  customer.email = req.body.email.trim().toLowerCase();

  return res.json(customer);
});

app.patch("/customers/:uuid", (req, res) => {
  const customer = findCustomerById(req.params.uuid);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const updateFields = ["firstName", "lastName", "email"];
  const hasAnyKnownField =
    req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? updateFields.some((field) => field in req.body)
      : false;
  if (!hasAnyKnownField) {
    return res.status(400).json({
      error: "Validation failed",
      details: ["At least one of firstName, lastName, or email must be provided"],
    });
  }

  const validationErrors = validateCustomerPayload(req.body, { partial: true });
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: validationErrors });
  }

  if ("firstName" in req.body) {
    customer.firstName = req.body.firstName.trim();
  }
  if ("lastName" in req.body) {
    customer.lastName = req.body.lastName.trim();
  }
  if ("email" in req.body) {
    customer.email = req.body.email.trim().toLowerCase();
  }

  return res.json(customer);
});

app.delete("/customers/:uuid", (req, res) => {
  const index = customers.findIndex((customer) => customer.uuid === req.params.uuid);
  if (index === -1) {
    return res.status(404).json({ error: "Customer not found" });
  }

  customers.splice(index, 1);
  return res.status(204).send();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Customer API listening on http://localhost:${PORT}`);
});
