# User Roles & Permissions

## Overview

The platform follows a Role-Based Access Control (RBAC) model.

Every authenticated user belongs to exactly one role.

---

# Roles

1. Super Admin
2. Admin (Gym Owner)
3. Trainer
4. Dietitian
5. Client
6. Individual User

---

# Super Admin

The Super Admin manages the entire SaaS platform.

## Permissions

- Create Admin
- Update Admin
- Suspend Admin
- Activate Admin
- Delete Admin

- View Platform Analytics

- Manage Subscription Plans

- Manage Coupons

- Manage Platform Settings

- View All Tenants

- View Revenue

---

# Admin (Gym Owner)

The Admin manages one tenant.

Each Admin can own one or more dashboards depending on their subscription plan.

## Permissions

- Create Dashboard
- Update Dashboard
- Delete Dashboard

- Create Trainer
- Update Trainer
- Delete Trainer

- Create Dietitian
- Update Dietitian
- Delete Dietitian

- Create Client
- Update Client
- Delete Client

- Assign Trainer

- Assign Dietitian

- View Reports

- Schedule Meetings

- View Dashboard Analytics

Cannot access another tenant.

---

# Trainer

Trainer manages assigned clients only.

## Permissions

- View Assigned Clients

- Create Workout Plans

- Update Workout Plans

- Track Workout Progress

- Schedule Meetings

Cannot create users.

Cannot access other trainers' clients.

---

# Dietitian

Dietitian manages assigned clients only.

## Permissions

- View Assigned Clients

- Create Meal Plans

- Update Meal Plans

- View Nutrition Reports

- Schedule Meetings

Cannot create users.

---

# Client

Created by Admin.

## Permissions

- Login

- Update Profile

- View Assigned Trainer

- View Assigned Dietitian

- Log Food

- Track Calories

- Track Water Intake

- Track Sleep

- Track Workout

- View Reports

- Join Meetings

---

# Individual User

Registers independently.

Pays yearly subscription.

## Permissions

- Manage Personal Profile

- Workout Tracking

- Calories Tracking

- Running

- Walking

- Food Diary

- Weight Tracking

- Reports

Cannot access tenant features.

---

# Role Hierarchy

Super Admin

↓

Admin

↓

Trainer

↓

Dietitian

↓

Client

Individual User remains independent.

---

# Security Rules

- Every request must be authenticated.

- Every request must be authorized.

- Every request must verify tenant ownership.

- Every action must be logged.