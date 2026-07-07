# System Architecture

## Architecture Style

The platform follows a Modular Monolith Architecture.

The application is developed in a single repository while maintaining clear module boundaries.

Each module can be extracted into an independent microservice in the future if required.

---

# Applications

The repository contains multiple applications.

## Fitness Platform

Purpose

- Authentication
- Dashboard Management
- Client Management
- Trainer Management
- Dietitian Management
- Workout
- Nutrition
- Running
- Walking
- Reports
- Meetings
- Notifications

Deployment

app.yourdomain.com

---

## Billing Platform

Purpose

- Plans
- Subscription
- Payments
- Coupons
- Invoices
- Renewals
- Refunds

Deployment

billing.yourdomain.com

---

# Architecture Layers

Presentation Layer

↓

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Database

---

# Backend Modules

Authentication

User Management

Tenant Management

Dashboard Management

Client Management

Trainer Management

Dietitian Management

Workout Module

Nutrition Module

Calories Module

Running Module

Meeting Module

Notification Module

Analytics Module

---

# Shared Modules

Validation

Authentication

Authorization

Logger

Utilities

Configuration

Error Handling

---

# Multi-Tenant Strategy

Every tenant has complete data isolation.

Every record stores

- tenantId
- dashboardId

Every request verifies

- Authenticated User
- User Role
- Tenant Ownership
- Dashboard Ownership

---

# Security Flow

Request

↓

JWT Authentication

↓

Role Verification

↓

Tenant Verification

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Response

---

# API Design

Every API starts with

/api/v1/

Example

/api/v1/auth/login

/api/v1/clients

/api/v1/trainers

/api/v1/workouts

---

# Database

Fitness Platform Database

Stores

- Users
- Clients
- Trainers
- Dietitians
- Workouts
- Food Logs
- Running
- Meetings
- Reports

Billing Database

Stores

- Plans
- Payments
- Transactions
- Coupons
- Invoices
- Refunds

---

# Future Scaling

Current

Modular Monolith

Future

Microservices

Possible future services

- Authentication
- Billing
- Notification
- AI
- Analytics
- Reports

---

# Deployment

Development

Local Machine

Production

AWS EC2

CloudFront

MongoDB Atlas

Docker

GitHub Actions

Nginx

Redis