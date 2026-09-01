# KAWASAKI DEALER MANAGEMENT SYSTEM

## Laravel System Specification

**Project:** Kawasaki Dealer CRM & Customer Management System
**Framework:** Laravel
**Database:** MySQL / PostgreSQL
**Architecture:** Laravel REST API + Web Application
**Timezone:** Asia/Jakarta

---

# 1. SYSTEM OBJECTIVE

Sistem digunakan untuk mengelola seluruh lifecycle customer dan kendaraan Kawasaki:

```text
LEAD
 ↓
FOLLOW UP
 ↓
CUSTOMER
 ↓
SALES
 ↓
MOTORCYCLE
 ↓
OWNERSHIP
 ↓
SERVICE
 ↓
WARRANTY
 ↓
LOYALTY
```

Sistem harus mampu menjawab:

> "Motor ini sekarang milik siapa, dibeli kapan, dari dealer mana, oleh sales siapa, berapa harga belinya, sudah service berapa kali, kapan service berikutnya, warranty sampai kapan, dan seluruh history-nya apa saja?"

---

# 2. USER ROLES

## 2.1 Super Admin

Full access seluruh sistem.

## 2.2 Dealer Admin

Mengelola data dealer/cabang:

* Customer
* Lead
* Sales
* Sales Pipeline
* Vehicle
* Sales Transaction
* Service
* Loyalty
* Report

## 2.3 Salesperson

Access:

* My Leads
* My Customers
* Follow Up
* Sales Activity
* Sales Pipeline
* My Sales
* Sales Target
* Sales Achievement

Sales hanya dapat melihat data yang menjadi tanggung jawabnya sesuai permission.

## 2.4 Service Advisor

Access:

* Customer
* Vehicle
* Service Booking
* Service History
* Service Reminder
* Warranty
* Service Report

## 2.5 Service Technician

Access:

* Assigned Service
* Vehicle
* Service Checklist
* Work Order
* Service Status

## 2.6 Customer

Access:

* Profile
* My Motorcycle
* Ownership
* Purchase History
* Service History
* Service Booking
* Warranty
* Loyalty Points
* Rewards
* Notifications

---

# 3. DEALER / BRANCH MANAGEMENT

Karena Kawasaki dapat memiliki banyak dealer/cabang, semua transaksi harus dapat dikaitkan dengan dealer.

Table:

```text
dealers
```

Fields:

```text
id
dealer_code
name
phone
email
address
city
province
status
```

Status:

```text
ACTIVE
INACTIVE
```

---

# 4. SALESPERSON MANAGEMENT

Table:

```text
salespersons
```

Fields:

```text
id
employee_code
name
email
phone
dealer_id
join_date
status
```

Status:

```text
ACTIVE
INACTIVE
```

---

# 5. CUSTOMER MANAGEMENT

Customer merupakan pusat data customer.

Table:

```text
customers
```

Fields:

```text
id
customer_code
full_name
nik
phone
email
date_of_birth
gender
address
city
province
postal_code
occupation
status
created_at
updated_at
```

Status:

```text
ACTIVE
INACTIVE
```

Customer dapat memiliki:

```text
Multiple Vehicles
Multiple Purchases
Multiple Service History
Multiple Leads
Loyalty Account
```

---

# 6. LEAD MANAGEMENT

Lead adalah calon customer sebelum terjadi transaksi.

Table:

```text
leads
```

Fields:

```text
id
lead_code
name
phone
email
source
interested_model_id
salesperson_id
dealer_id
estimated_budget
notes
status
created_at
updated_at
```

Lead Source:

```text
WALK_IN
WEBSITE
WHATSAPP
INSTAGRAM
FACEBOOK
REFERRAL
EVENT
ADVERTISEMENT
PHONE
OTHER
```

---

# 7. LEAD STATUS

Status wajib:

```text
COLD
WARM
HOT
HOLD
WON
LOST
```

Flow:

```text
NEW LEAD
 ↓
COLD / WARM
 ↓
HOT
 ↓
WON
 ↓
CUSTOMER
```

Atau:

```text
HOT
 ↓
LOST
```

---

# 8. LEAD STATUS RULE

### Cold

Belum menunjukkan intent pembelian tinggi.

### Warm

Sudah tertarik dan melakukan komunikasi.

### Hot

Memiliki intent pembelian tinggi.

### Hold

Prospek ditunda.

### Won

Berhasil menjadi transaksi.

### Lost

Tidak berhasil menjadi transaksi.

System harus menyimpan history perubahan status.

Table:

```text
lead_status_histories
```

Fields:

```text
id
lead_id
old_status
new_status
reason
changed_by
created_at
```

---

# 9. FOLLOW-UP MANAGEMENT

Table:

```text
follow_ups
```

Fields:

```text
id
lead_id
customer_id
salesperson_id
follow_up_date
follow_up_time
channel
purpose
notes
result
next_follow_up_at
status
```

Channel:

```text
PHONE
WHATSAPP
EMAIL
VISIT
SHOWROOM
VIDEO_CALL
OTHER
```

Status:

```text
PLANNED
COMPLETED
MISSED
CANCELLED
```

---

# 10. FOLLOW-UP REMINDER

System harus menyediakan reminder:

```text
Today
Tomorrow
Overdue
Upcoming
```

Dashboard salesperson:

```text
Today's Follow Up
Overdue Follow Up
Upcoming Follow Up
Completed Follow Up
```

Reminder dapat melalui:

```text
In-App
Email
WhatsApp - optional
```

---

# 11. SALES ACTIVITY HISTORY

Semua aktivitas sales harus tercatat.

Table:

```text
sales_activities
```

Fields:

```text
id
salesperson_id
lead_id
customer_id
activity_type
description
activity_date
reference_type
reference_id
```

Activity:

```text
CALL
WHATSAPP
MEETING
TEST_RIDE
PRICE_QUOTE
FOLLOW_UP
PURCHASE
OTHER
```

---

# 12. SALES PIPELINE

Pipeline ditampilkan seperti Kanban:

```text
COLD
│
├── Lead A
├── Lead B
│
WARM
│
├── Lead C
│
HOT
│
├── Lead D
│
HOLD
│
├── Lead E
│
WON
│
├── Lead F
│
LOST
│
└── Lead G
```

Sales dapat melakukan drag/drop status sesuai permission.

---

# 13. SALES FUNNEL

Dashboard:

```text
Total Leads
      ↓
Warm Leads
      ↓
Hot Leads
      ↓
Quotation
      ↓
Test Ride
      ↓
Won
```

Metrics:

```text
Lead → Warm %
Warm → Hot %
Hot → Won %
Overall Conversion Rate
```

Formula:

```text
Conversion Rate =
Won Leads / Total Leads × 100
```

---

# 14. SALES TRANSACTION

Table:

```text
sales_transactions
```

Fields:

```text
id
transaction_number
lead_id
customer_id
salesperson_id
dealer_id
vehicle_id
sale_date
vehicle_price
discount
additional_cost
final_price
payment_method
payment_status
promo_id
status
```

Payment Method:

```text
CASH
CREDIT
BANK_TRANSFER
OTHER
```

Status:

```text
DRAFT
BOOKED
SOLD
CANCELLED
```

---

# 15. SALES TRANSACTION FLOW

```text
Lead
 ↓
Customer
 ↓
Select Motorcycle
 ↓
Quotation
 ↓
Booking
 ↓
Payment
 ↓
Sales Transaction
 ↓
Vehicle Ownership Created
 ↓
Delivery
 ↓
Service Schedule Created
 ↓
Warranty Activated
 ↓
Loyalty Points
```

---

# 16. MOTORCYCLE PRODUCT MANAGEMENT

Table:

```text
vehicle_models
```

Fields:

```text
id
brand
model
variant
year
engine_cc
description
status
```

Contoh:

```text
Ninja 250
Ninja ZX-25R
KLX 150
W175
Z900
```

---

# 17. VEHICLE INVENTORY

Vehicle model berbeda dengan unit kendaraan.

Contoh:

```text
Model:
Ninja 250

Unit:
VIN ABC123
Engine XYZ123
Color Green
```

Table:

```text
vehicles
```

Fields:

```text
id
vehicle_code
vehicle_model_id
vin
engine_number
color
year
license_plate
odometer
dealer_id
status
```

Status:

```text
IN_STOCK
BOOKED
SOLD
DELIVERED
IN_SERVICE
TRANSFERRED
SCRAPPED
```

---

# 18. VEHICLE IDENTITY

Setiap unit kendaraan harus memiliki identifier unik:

```text
Vehicle ID
VIN / Nomor Rangka
Engine Number
License Plate
```

Constraint:

```text
VIN UNIQUE
Engine Number UNIQUE
Vehicle Code UNIQUE
```

---

# 19. VEHICLE OWNERSHIP

Table:

```text
vehicle_ownerships
```

Fields:

```text
id
vehicle_id
customer_id
purchase_transaction_id
dealer_id
salesperson_id
purchase_date
delivery_date
ownership_start
ownership_end
status
```

Status:

```text
CURRENT
TRANSFERRED
ENDED
```

Satu vehicle dapat memiliki banyak ownership history.

Contoh:

```text
Vehicle
 ↓
Owner A
2024-2025
 ↓
Owner B
2025-present
```

---

# 20. OWNERSHIP TRANSFER

Table:

```text
ownership_transfers
```

Fields:

```text
id
vehicle_id
from_customer_id
to_customer_id
transfer_date
reason
document_reference
approved_by
notes
```

Flow:

```text
Owner A
 ↓
Transfer Request
 ↓
Verification
 ↓
Approved
 ↓
Owner A = ENDED
 ↓
Owner B = CURRENT
```

Tidak boleh ada dua `CURRENT` owner untuk satu vehicle.

---

# 21. VEHICLE PURCHASE HISTORY

Customer dapat melihat:

```text
Vehicle
Purchase Date
Dealer
Salesperson
Price
Payment Method
Promo
Delivery Date
```

Admin dapat melihat seluruh history customer.

---

# 22. VEHICLE TIMELINE

Ini merupakan salah satu fitur utama sistem.

Setiap kendaraan memiliki timeline:

```text
PURCHASED
   ↓
BOOKED
   ↓
DELIVERED
   ↓
SERVICE
   ↓
SERVICE
   ↓
WARRANTY CLAIM
   ↓
SERVICE
   ↓
OWNERSHIP TRANSFER
   ↓
SERVICE
```

Table:

```text
vehicle_timelines
```

Fields:

```text
id
vehicle_id
event_type
event_date
title
description
reference_type
reference_id
created_by
```

Event Type:

```text
PURCHASE
DELIVERY
SERVICE
WARRANTY_CLAIM
OWNERSHIP_TRANSFER
REGISTRATION
OTHER
```

---

# 23. VEHICLE DOCUMENTS

Table:

```text
vehicle_documents
```

Fields:

```text
id
vehicle_id
document_type
document_number
file_path
issued_date
expired_date
status
uploaded_by
```

Document:

```text
STNK
BPKB
INVOICE
WARRANTY
SERVICE_RECORD
OTHER
```

File harus disimpan menggunakan secure storage.

---

# 24. VEHICLE REGISTRATION

Table:

```text
vehicle_registrations
```

Fields:

```text
id
vehicle_id
license_plate
stnk_number
registration_date
registration_expiry
bpkb_number
status
```

---

# 25. SERVICE MANAGEMENT

Service merupakan bagian dari lifecycle kendaraan.

Table:

```text
service_records
```

Fields:

```text
id
service_number
vehicle_id
customer_id
dealer_id
service_date
odometer
service_type
complaint
diagnosis
notes
total_cost
status
```

Service Type:

```text
ROUTINE
PERIODIC
REPAIR
WARRANTY
INSPECTION
OTHER
```

---

# 26. SERVICE BOOKING

Table:

```text
service_bookings
```

Fields:

```text
id
booking_number
vehicle_id
customer_id
dealer_id
booking_date
booking_time
service_type
complaint
assigned_advisor_id
status
```

Status:

```text
REQUESTED
CONFIRMED
ARRIVED
IN_PROGRESS
COMPLETED
CANCELLED
NO_SHOW
```

---

# 27. SERVICE WORK ORDER

Table:

```text
service_work_orders
```

Fields:

```text
id
work_order_number
service_booking_id
vehicle_id
technician_id
start_time
end_time
diagnosis
work_description
status
```

Status:

```text
OPEN
IN_PROGRESS
WAITING_PART
COMPLETED
CANCELLED
```

---

# 28. SERVICE ITEMS

Service dapat memiliki detail item:

```text
service_items
```

Fields:

```text
id
service_record_id
item_type
name
quantity
unit_price
total
```

Item Type:

```text
PART
LABOR
OTHER
```

Contoh:

```text
Engine Oil
1
Rp100.000

Labor
1
Rp75.000
```

---

# 29. SERVICE HISTORY

Customer dapat melihat:

```text
Date
Dealer
KM
Service Type
Complaint
Diagnosis
Service Cost
```

---

# 30. ROUTINE SERVICE

Vehicle dapat memiliki service schedule.

Table:

```text
service_schedules
```

Fields:

```text
id
vehicle_id
service_type
last_service_date
last_service_km
next_service_date
next_service_km
status
```

Contoh:

```text
Last Service:
01 August 2026

Last KM:
5,000 KM

Next Service:
01 November 2026

Next KM:
10,000 KM
```

---

# 31. SERVICE REMINDER

System harus mendeteksi:

```text
Upcoming Service
Due Service
Overdue Service
```

Reminder berdasarkan:

```text
Date
Kilometer
```

Contoh:

```text
7 days before
3 days before
1 day before
```

---

# 32. WARRANTY MANAGEMENT

Table:

```text
warranties
```

Fields:

```text
id
vehicle_id
customer_id
warranty_number
start_date
end_date
warranty_period
status
terms
```

Status:

```text
ACTIVE
EXPIRED
VOID
```

Warranty Start biasanya mengikuti aturan bisnis dealer/manufacturer, bukan hardcoded.

---

# 33. WARRANTY CLAIM

Table:

```text
warranty_claims
```

Fields:

```text
id
claim_number
vehicle_id
customer_id
warranty_id
service_record_id
claim_date
problem
diagnosis
resolution
cost
status
```

Status:

```text
SUBMITTED
UNDER_REVIEW
APPROVED
REJECTED
COMPLETED
```

---

# 34. WARRANTY HISTORY

Vehicle timeline:

```text
Warranty Started
 ↓
Warranty Claim
 ↓
Inspection
 ↓
Approved
 ↓
Repair
 ↓
Completed
```

Semua harus tersimpan.

---

# 35. CUSTOMER LOYALTY PROGRAM

Customer memiliki loyalty account.

Table:

```text
loyalty_accounts
```

Fields:

```text
id
customer_id
tier_id
status
```

---

# 36. POINT MANAGEMENT

Gunakan ledger, jangan hanya menyimpan angka balance.

Table:

```text
loyalty_transactions
```

Fields:

```text
id
customer_id
type
points
reference_type
reference_id
description
expired_at
created_at
```

Type:

```text
EARN
REDEEM
EXPIRED
ADJUSTMENT
REVERSAL
```

Balance:

```text
EARN
- REDEEM
- EXPIRED
+ ADJUSTMENT
```

---

# 37. POINT EARNING

Point dapat berasal dari:

```text
Vehicle Purchase
Service
Referral
Campaign
Event
Promotion
```

Contoh:

```text
Purchase Rp50.000.000
→ 5.000 points

Service Rp500.000
→ 50 points
```

Rules harus configurable.

Table:

```text
loyalty_rules
```

---

# 38. MEMBERSHIP TIER

Contoh:

```text
Bronze
Silver
Gold
Platinum
```

Table:

```text
loyalty_tiers
```

Fields:

```text
id
name
minimum_points
maximum_points
benefits
status
```

---

# 39. REWARD / VOUCHER

Table:

```text
rewards
```

Fields:

```text
id
code
name
description
points_required
stock
valid_from
valid_until
status
```

Reward dapat berupa:

```text
Discount Service
Free Service
Merchandise
Accessories
Voucher
Cashback
```

---

# 40. REDEMPTION

Table:

```text
reward_redemptions
```

Fields:

```text
id
redemption_number
customer_id
reward_id
points_used
status
redeemed_at
fulfilled_at
```

Flow:

```text
Customer
 ↓
Select Reward
 ↓
Validate Points
 ↓
Validate Stock
 ↓
Redeem
 ↓
Deduct Points
 ↓
Create Voucher
```

Semua proses harus menggunakan database transaction.

---

# 41. SALES TARGET

Table:

```text
sales_targets
```

Fields:

```text
id
salesperson_id
dealer_id
period
target_units
target_revenue
start_date
end_date
status
```

Contoh:

```text
September 2026

Target:
20 Units

Revenue:
Rp1.000.000.000
```

---

# 42. SALES ACHIEVEMENT

Achievement dihitung berdasarkan transaksi yang valid.

```text
Units Sold
Revenue
Target
Achievement %
```

Formula:

```text
Achievement % =
Actual / Target × 100
```

Contoh:

```text
Target = 20

Actual = 15

Achievement = 75%
```

---

# 43. SALES PERFORMANCE

Dashboard salesperson:

```text
Target Units
Units Sold
Target Revenue
Actual Revenue
Achievement %
Conversion Rate
Total Leads
Hot Leads
Won Leads
Lost Leads
Follow Up
Completed Follow Up
Overdue Follow Up
```

---

# 44. SALES RANKING

Ranking berdasarkan configurable metric:

```text
Units Sold
Revenue
Achievement %
Conversion Rate
```

Contoh:

```text
#1 Sales A — 28 Units
#2 Sales B — 24 Units
#3 Sales C — 19 Units
```

Ranking harus dapat difilter:

```text
Daily
Weekly
Monthly
Yearly
Dealer
Region
```

---

# 45. SALES ANALYTICS

Dashboard:

## Sales Overview

```text
Total Sales
Total Revenue
Units Sold
Average Transaction Value
```

## Sales Funnel

```text
Total Leads
Cold
Warm
Hot
Hold
Won
Lost
```

## Conversion

```text
Lead → Won
```

## Product

```text
Sales by Motorcycle
```

## Salesperson

```text
Sales by Salesperson
```

## Period

```text
Daily
Weekly
Monthly
Yearly
```

---

# 46. SALES REPORT

Filter:

```text
Date
Dealer
Salesperson
Motorcycle
Payment Method
Status
```

Columns:

```text
Transaction
Date
Customer
Vehicle
Salesperson
Dealer
Price
Discount
Final Price
Payment
Status
```

Export:

```text
Excel
CSV
PDF
```

---

# 47. CUSTOMER 360

Customer detail harus menjadi satu halaman pusat.

```text
CUSTOMER 360
```

Menampilkan:

```text
Profile
 ↓
Leads
 ↓
Sales
 ↓
Vehicles
 ↓
Ownership
 ↓
Service
 ↓
Warranty
 ↓
Loyalty
 ↓
Follow Up
 ↓
Timeline
```

Contoh:

```text
Customer:
John Doe

Vehicles:
1. Ninja 250
2. KLX 150

Purchases:
2

Service:
8

Warranty Claims:
1

Loyalty:
4,250 points

Current Tier:
Gold
```

---

# 48. VEHICLE 360

Vehicle detail:

```text
VEHICLE 360
```

## Identity

```text
Vehicle ID
VIN
Engine Number
Model
Year
Color
Plate
KM
```

## Current Owner

```text
Customer
Phone
Ownership Start
```

## Purchase

```text
Dealer
Salesperson
Purchase Date
Price
Transaction
```

## Service

```text
Last Service
Next Service
Total Service
Total Service Cost
```

## Warranty

```text
Status
Start
End
Claims
```

## Timeline

```text
Purchased
Delivered
Service
Warranty
Transfer
```

---

# 49. GLOBAL SEARCH

Admin harus dapat mencari:

```text
Customer Name
Phone
Customer ID
VIN
Engine Number
License Plate
Vehicle ID
Transaction Number
Invoice
Lead
Salesperson
```

Contoh:

```text
Search:
B 1234 ABC
```

System menemukan:

```text
Vehicle
Owner
Purchase
Salesperson
Dealer
Service History
Warranty
```

---

# 50. DASHBOARD ADMIN

## KPI

```text
Total Customers
New Customers
Active Leads
Won Leads
Units Sold
Sales Revenue
Conversion Rate
```

## Service

```text
Today's Service
Upcoming Service
Overdue Service
Warranty Claims
```

## Loyalty

```text
Loyalty Members
Points Issued
Points Redeemed
Active Rewards
```

---

# 51. DASHBOARD SALESPERSON

```text
My Target
My Achievement
Units Sold
Revenue
Achievement %
Conversion Rate
```

Lead:

```text
Cold
Warm
Hot
Hold
Won
Lost
```

Follow-up:

```text
Today's Follow Up
Overdue
Upcoming
Completed
```

---

# 52. DASHBOARD SERVICE

```text
Today's Booking
Waiting
In Progress
Completed
Cancelled
```

Performance:

```text
Average Service Time
Service Revenue
Repeat Customer
Warranty Claim
```

---

# 53. NOTIFICATION

Notification:

```text
New Lead
Follow Up Reminder
Overdue Follow Up
New Sale
Service Reminder
Service Booking
Warranty Expiry
Warranty Claim
Loyalty Points
Reward Redemption
```

---

# 54. AUDIT LOG

Semua aktivitas penting dicatat.

```text
audit_logs
```

Fields:

```text
id
user_id
action
module
record_type
record_id
old_values
new_values
ip_address
created_at
```

Contoh:

```text
Sales changed Lead status
Admin changed Customer
Admin changed Vehicle Owner
Admin approved Ownership Transfer
Admin adjusted Loyalty Points
Admin recorded Payment
```

---

# 55. DATABASE STRUCTURE

Core tables:

```text
users
roles
permissions

dealers
salespersons

customers
leads
lead_status_histories
follow_ups
sales_activities

vehicle_models
vehicles
vehicle_ownerships
ownership_transfers
vehicle_registrations
vehicle_documents
vehicle_timelines

sales_transactions
sales_targets

service_bookings
service_records
service_work_orders
service_items
service_schedules

warranties
warranty_claims

loyalty_accounts
loyalty_tiers
loyalty_rules
loyalty_transactions
rewards
reward_redemptions
vouchers

notifications
audit_logs
system_settings
```

---

# 56. DATABASE RELATIONSHIP

```text
Dealer
 ├── Salespersons
 ├── Customers
 ├── Leads
 ├── Vehicles
 ├── Sales
 └── Service

Customer
 ├── Leads
 ├── Sales Transactions
 ├── Vehicles
 ├── Ownership History
 ├── Service History
 ├── Warranty
 ├── Loyalty
 └── Follow Ups

Vehicle
 ├── Model
 ├── Current Owner
 ├── Ownership History
 ├── Purchase
 ├── Service
 ├── Warranty
 ├── Documents
 └── Timeline

Salesperson
 ├── Leads
 ├── Follow Ups
 ├── Sales Activities
 ├── Sales Transactions
 └── Sales Target
```

---

# 57. LARAVEL MODELS

```text
User
Dealer
Salesperson

Customer
Lead
LeadStatusHistory
FollowUp
SalesActivity

VehicleModel
Vehicle
VehicleOwnership
OwnershipTransfer
VehicleRegistration
VehicleDocument
VehicleTimeline

SalesTransaction
SalesTarget

ServiceBooking
ServiceRecord
ServiceWorkOrder
ServiceItem
ServiceSchedule

Warranty
WarrantyClaim

LoyaltyAccount
LoyaltyTier
LoyaltyRule
LoyaltyTransaction
Reward
RewardRedemption
Voucher

AuditLog
SystemSetting
```

---

# 58. SERVICE LAYER

Business logic harus dipisahkan dari Controller.

```text
SalesService
LeadService
FollowUpService
VehicleService
OwnershipService
ServiceManagementService
WarrantyService
LoyaltyService
AnalyticsService
NotificationService
```

## OwnershipService

```text
transferOwnership()
getCurrentOwner()
getOwnershipHistory()
```

## VehicleService

```text
registerVehicle()
updateVehicle()
getVehicleTimeline()
```

## LoyaltyService

```text
earnPoints()
redeemPoints()
expirePoints()
calculateBalance()
updateTier()
```

## SalesService

```text
createSale()
completeSale()
calculateAchievement()
calculateConversion()
```

---

# 59. IMPORTANT BUSINESS RULES

## Vehicle

VIN harus unique.

Engine number harus unique.

Vehicle tidak boleh memiliki dua current owner.

---

## Ownership

Saat transfer:

```text
Old Owner
→ ENDED

New Owner
→ CURRENT
```

History tidak boleh dihapus.

---

## Sales

Transaksi `CANCELLED` tidak dihitung sebagai achievement.

Transaksi `SOLD` yang valid dihitung sebagai:

```text
Units Sold
Revenue
Achievement
```

---

## Lead

Lead `WON` harus dapat dikaitkan dengan:

```text
Customer
Sales Transaction
Vehicle
```

---

## Conversion

Hanya lead valid yang dihitung.

```text
Conversion =
Won / Total Valid Leads
```

---

## Loyalty

Point tidak boleh negatif.

Redeem harus atomic.

---

## Service

Service harus terkait dengan:

```text
Vehicle
Customer
Dealer
```

---

## Warranty

Claim hanya dapat dibuat jika warranty masih valid, kecuali admin memiliki permission override.

---

# 60. SCHEDULED JOBS

Laravel Scheduler:

```text
Daily:

Check Service Reminder
Check Warranty Expiry
Check Follow Up
Expire Loyalty Points
Update Loyalty Tier
Check Overdue Follow Up
```

---

# 61. API STRUCTURE

Prefix:

```text
/api/v1
```

## Customer

```http
GET    /customers
POST   /customers
GET    /customers/{id}
PUT    /customers/{id}
```

## Leads

```http
GET    /leads
POST   /leads
PUT    /leads/{id}
PUT    /leads/{id}/status
```

## Follow Up

```http
GET    /follow-ups
POST   /follow-ups
PUT    /follow-ups/{id}
```

## Sales

```http
GET    /sales
POST   /sales
GET    /sales/{id}
```

## Vehicles

```http
GET    /vehicles
POST   /vehicles
GET    /vehicles/{id}
PUT    /vehicles/{id}
```

## Ownership

```http
GET  /vehicles/{id}/ownership
POST /vehicles/{id}/transfer
```

## Service

```http
GET  /services
POST /services
GET  /vehicles/{id}/services
POST /service-bookings
```

## Warranty

```http
GET  /vehicles/{id}/warranty
POST /warranty-claims
```

## Loyalty

```http
GET  /loyalty
GET  /loyalty/transactions
POST /loyalty/redeem
```

---

# 62. SEARCH & FILTER

Semua module harus mendukung:

```text
Search
Filter
Sort
Pagination
Export
```

Gunakan server-side pagination.

---

# 63. INDEXING

Important indexes:

```text
customers.customer_code
customers.phone

leads.lead_code
leads.status
leads.salesperson_id

vehicles.vehicle_code
vehicles.vin
vehicles.engine_number
vehicles.license_plate

vehicle_ownerships.vehicle_id
vehicle_ownerships.customer_id
vehicle_ownerships.status

sales_transactions.transaction_number
sales_transactions.customer_id
sales_transactions.salesperson_id
sales_transactions.sale_date

service_records.vehicle_id
service_records.service_date

follow_ups.salesperson_id
follow_ups.follow_up_date

loyalty_transactions.customer_id
```

Unique:

```text
customer_code
lead_code
vehicle_code
VIN
engine_number
transaction_number
service_number
warranty_number
```

---

# 64. SECURITY

Wajib:

```text
Authentication
Authorization
Role & Permission
Policy
Form Request Validation
CSRF
Rate Limiting
Audit Log
Secure File Storage
```

Salesperson tidak boleh:

```text
Melihat customer sales lain
Mengubah sales orang lain
Mengubah target
Mengubah loyalty
Mengubah ownership
```

kecuali permission diberikan.

---

# 65. TESTING

Feature test minimum:

```text
Create Customer
Create Lead
Change Lead Status
Create Follow Up
Complete Follow Up

Create Vehicle
Create Sales Transaction
Complete Sale
Create Ownership

Transfer Ownership
Prevent Duplicate Current Owner

Create Service
Create Service Booking
Service Reminder

Warranty Claim

Earn Loyalty
Redeem Loyalty
Prevent Negative Points

Sales Target
Sales Achievement
Conversion Rate
```

---

# 66. DEVELOPMENT PRIORITY

## P0 — CORE

```text
Authentication
Dealer
Salesperson
Customer
Lead
Follow Up
Sales Pipeline
Vehicle
Sales Transaction
Ownership
```

## P1 — AFTER SALES

```text
Service
Service Booking
Service Reminder
Warranty
Vehicle Timeline
Documents
```

## P2 — ENGAGEMENT

```text
Loyalty
Rewards
Voucher
Notification
```

## P3 — ANALYTICS

```text
Sales Dashboard
Sales Performance
Sales Ranking
Conversion Analytics
Customer 360
Vehicle 360
Reports
```

---

# 67. MOST IMPORTANT FEATURE: VEHICLE 360

Setiap kendaraan harus menjadi entity utama yang dapat ditelusuri.

Contoh:

```text
VIN:
MH4XXXXXXXX123456

MODEL:
Ninja 250

OWNER:
John Doe

PURCHASE:
12 March 2025

DEALER:
Kawasaki Dealer A

SALESPERSON:
Andi

PRICE:
Rp68.000.000
```

Kemudian:

```text
SERVICE HISTORY
────────────────────
10 Apr 2025   1,000 KM
10 Jul 2025   5,000 KM
10 Oct 2025  10,000 KM
```

Warranty:

```text
START:
12 Mar 2025

END:
12 Mar 2027

CLAIM:
1
```

Ownership:

```text
John Doe
2025 → 2026

Jane Doe
2026 → CURRENT
```

Timeline:

```text
12 Mar 2025
PURCHASED

15 Mar 2025
DELIVERED

10 Apr 2025
SERVICE

10 Jul 2025
SERVICE

12 Aug 2026
OWNERSHIP TRANSFER
```

---

# 68. CUSTOMER 360 + VEHICLE 360

Arsitektur utama:

```text
                 CUSTOMER
                    │
        ┌───────────┼───────────┐
        │           │           │
       LEAD        SALES      LOYALTY
        │           │
        │        VEHICLE
        │           │
        │     ┌─────┼─────┐
        │     │     │     │
        │  OWNER SERVICE WARRANTY
        │           │
        │       TIMELINE
        │
     FOLLOW UP
```

Dengan desain ini, sistem bukan hanya "aplikasi sales".

Ini menjadi **Customer + Sales + Vehicle Lifecycle Management System**.

---

# 69. DEFINITION OF DONE

Sistem dianggap siap production jika:

* Customer dapat dibuat.
* Lead dapat dibuat dan dipindahkan status.
* Follow-up dapat dijadwalkan.
* Sales activity tercatat.
* Sales transaction dapat dibuat.
* Vehicle dapat dikaitkan dengan transaction.
* Ownership otomatis dibuat setelah sale.
* Ownership history tersimpan.
* Ownership transfer dapat dilakukan.
* VIN dan engine number unique.
* Service history tersimpan.
* Service booking berjalan.
* Service reminder berjalan.
* Warranty dapat dibuat.
* Warranty claim dapat dicatat.
* Vehicle timeline otomatis terbentuk.
* Customer dapat melihat semua kendaraannya.
* Loyalty point dapat diperoleh dan digunakan.
* Reward dapat diredeem.
* Sales target dapat dibuat.
* Achievement otomatis dihitung.
* Conversion rate tersedia.
* Sales ranking tersedia.
* Dashboard tersedia.
* Customer 360 tersedia.
* Vehicle 360 tersedia.
* Audit log tersedia.
* Semua permission berjalan.
* Semua transaksi kritis menggunakan database transaction.

---

# 70. CORE PRINCIPLE

**Jangan menjadikan Sales sebagai pusat data.**

Pusat data sistem adalah:

```text
CUSTOMER
    ↕
VEHICLE
    ↕
OWNERSHIP
    ↕
TRANSACTION
    ↕
SERVICE
    ↕
WARRANTY
    ↕
LOYALTY
```

Salesperson adalah aktor yang menjalankan proses tersebut.

Dengan model ini, ketika customer membeli motor kedua, pindah dealer, ganti pemilik, melakukan service, atau melakukan warranty claim, seluruh history tetap terhubung dan tidak membuat data customer/vehicle baru secara sembarangan.
