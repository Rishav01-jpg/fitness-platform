# Database Design

## Database Strategy

The platform uses two independent databases.

### Fitness Database

Stores all business data.

Collections

- users
- tenants
- dashboards
- trainers
- dietitians
- clients
- workouts
- workoutPlans
- foodLogs
- runningLogs
- walkingLogs
- waterLogs
- sleepLogs
- bodyMeasurements
- meetings
- notifications
- reports

---

### Billing Database

Stores billing information only.

Collections

- plans
- subscriptions
- invoices
- payments
- coupons
- refunds
- transactions

---

# Multi-Tenant Design

Every business record contains:

- tenantId
- dashboardId

This ensures complete tenant isolation.

---

# User Collection

Stores authentication and profile information.

Fields

- _id
- firstName
- lastName
- email
- password
- role
- status
- tenantId
- dashboardId
- profileImage
- createdAt
- updatedAt

---

# Tenant Collection

Represents one customer.

Fields

- _id
- companyName
- subscriptionId
- status
- createdAt

---

# Dashboard Collection

Represents one gym or branch.

Fields

- _id
- tenantId
- name
- address
- phone
- email
- logo
- status

---

# Client Collection

Stores fitness client information.

Fields

- userId
- trainerId
- dietitianId
- dashboardId
- tenantId
- goal
- height
- weight
- bmi
- bmr
- tdee

---

# Workout Collection

Stores completed workouts.

Fields

- clientId
- trainerId
- dashboardId
- tenantId
- exercises
- caloriesBurned
- duration

---

# Food Log Collection

Stores meals.

Fields

- clientId
- dashboardId
- tenantId
- mealType
- foods
- totalCalories
- protein
- carbs
- fat

---

# Running Log

Fields

- clientId
- distance
- duration
- caloriesBurned
- averageSpeed

---

# Meeting Collection

Fields

- trainerId
- dietitianId
- clientId
- meetingDate
- meetingType
- meetingLink
- status

---

# Notification Collection

Fields

- userId
- title
- message
- isRead

---

# Database Rules

Every document contains

- createdAt
- updatedAt

Soft delete will be used wherever possible.

Indexes will be created for

- email
- tenantId
- dashboardId
- userId
- clientId
- trainerId