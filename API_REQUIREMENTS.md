# 🔌 CAVIOS E-Commerce - Complete API Requirements

## 📊 **Total API Count Summary**

### **Frontend APIs: ~85-90 APIs**
### **Admin Panel APIs: ~160 APIs**
### **🎯 GRAND TOTAL: ~245-250 APIs**

---

## 🔐 **1. Authentication & User Management (12 APIs)**

### **Login Page** (`/login`)
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/logout` - User logout
- ✅ `GET /api/auth/me` - Get current user

### **Register Page** (`/register`)
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/verify-email` - Email verification
- ✅ `GET /api/auth/check-email` - Check email availability

### **Forgot Password** (`/forget-password`)
- ✅ `POST /api/auth/forgot-password` - Send reset link
- ✅ `POST /api/auth/reset-password` - Reset password

### **User Profile** (`/my-account`)
- ✅ `GET /api/users/profile` - Get user profile
- ✅ `PUT /api/users/profile` - Update user profile
- ✅ `POST /api/users/change-password` - Change password
- ✅ `DELETE /api/users/account` - Delete account

---

## 🛍️ **2. Products (8 APIs)**

### **Products API (Consolidated)**
- ✅ `GET /api/products` - Get products (with filters)
  - Query params: 
    - `type`: `featured` | `new-arrivals` | `best-seller` | `on-sale` | `all` (default)
    - `page`, `limit`, `sort`, `category`, `brand`, `color`, `size`, `priceMin`, `priceMax`, `inStock`, `onSale`
- ✅ `GET /api/products/:id` - Get single product details
- ✅ `GET /api/products/:id/related` - Get related products
- ✅ `GET /api/products/:id/frequently-bought` - Frequently bought together
- ✅ `GET /api/products/filters` - Get filter options (colors, sizes, brands, price range)
- ✅ `GET /api/products/categories` - Get categories
- ✅ `GET /api/collections` - Collections/Banners
- ✅ `GET /api/brands` - Brands list

---

## 🛒 **3. Shopping Cart (6 APIs)**

### **Cart Modal & Shopping Cart Page** (`/shopping-cart`)
- ✅ `GET /api/cart` - Get user cart
- ✅ `POST /api/cart/add` - Add to cart
- ✅ `PUT /api/cart/update/:itemId` - Update cart item quantity
- ✅ `DELETE /api/cart/remove/:itemId` - Remove from cart
- ✅ `DELETE /api/cart/clear` - Clear cart
- ✅ `POST /api/cart/apply-coupon` - Apply discount coupon

---

## ❤️ **4. Wishlist (4 APIs)**

### **Wishlist Page** (`/wish-list`)
- ✅ `GET /api/wishlist` - Get user wishlist
- ✅ `POST /api/wishlist/add/:productId` - Add to wishlist
- ✅ `DELETE /api/wishlist/remove/:productId` - Remove from wishlist
- ✅ `GET /api/wishlist/check/:productId` - Check if in wishlist

---

## 🔄 **5. Compare Products (4 APIs)**

### **Compare Page** (`/compare-products`)
- ✅ `GET /api/compare` - Get compare list
- ✅ `POST /api/compare/add/:productId` - Add to compare
- ✅ `DELETE /api/compare/remove/:productId` - Remove from compare
- ✅ `DELETE /api/compare/clear` - Clear compare list

---

## 📦 **6. Orders & Checkout (12 APIs)**

### **Checkout Page** (`/checkout`)
- ✅ `POST /api/checkout` - Create order
- ✅ `GET /api/checkout/shipping-methods` - Get shipping methods
- ✅ `GET /api/checkout/payment-methods` - Get payment methods
- ✅ `POST /api/checkout/validate-coupon` - Validate coupon code
- ✅ `POST /api/checkout/calculate-shipping` - Calculate shipping cost

### **Order Tracking** (`/order-tracking`)
- ✅ `GET /api/orders/track/:orderId` - Track order status
- ✅ `GET /api/orders/track-by-email` - Track by email & order number

### **My Account Orders** (`/my-account-orders`)
- ✅ `GET /api/orders` - Get user orders
- ✅ `GET /api/orders/:orderId` - Get order details
- ✅ `PUT /api/orders/:orderId/cancel` - Cancel order
- ✅ `POST /api/orders/:orderId/return` - Request return

---

## 📍 **7. Address Management (6 APIs)**

### **My Account Address** (`/my-account-address`)
- ✅ `GET /api/addresses` - Get user addresses
- ✅ `POST /api/addresses` - Add new address
- ✅ `PUT /api/addresses/:addressId` - Update address
- ✅ `DELETE /api/addresses/:addressId` - Delete address
- ✅ `PUT /api/addresses/:addressId/set-default` - Set default address
- ✅ `GET /api/addresses/countries` - Get countries list

---

## 📝 **8. Blogs (6 APIs)**

### **Blog Pages** (`/blog-default`, `/blog-grid`, `/blog-list`)
- ✅ `GET /api/blogs` - Get all blogs (with pagination, filters)
  - Query params: `page`, `limit`, `category`, `tag`, `sort`
- ✅ `GET /api/blogs/:id` - Get single blog
- ✅ `GET /api/blogs/:id/related` - Get related blogs
- ✅ `GET /api/blogs/categories` - Get blog categories
- ✅ `GET /api/blogs/tags` - Get blog tags

### **Blog Comments (Uses Reviews API - see Reviews section)**
- Comments use same `/api/reviews` endpoint with `blogId` param

---

## 🔍 **9. Search (2 APIs)**

### **Search API (Consolidated)**
- ✅ `GET /api/search` - Global search
  - Query params: `q` (query), `type`: `products` | `blogs` | `all` (default), `page`, `limit`
- ✅ `GET /api/search/suggestions` - Get search suggestions/autocomplete
  - Query params: `q` (query), `type`: `products` | `blogs` | `all`

---

## 📧 **10. Contact & Newsletter (4 APIs)**

### **Contact Pages** (`/contact`, `/contact-02`)
- ✅ `POST /api/contact` - Send contact message

### **Newsletter Modal**
- ✅ `POST /api/newsletter/subscribe` - Subscribe newsletter
- ✅ `POST /api/newsletter/unsubscribe` - Unsubscribe newsletter

### **Footer Newsletter**
- ✅ `POST /api/newsletter/subscribe` - Subscribe (same as above)

---

## ⭐ **11. Reviews & Ratings (4 APIs)**

### **Reviews API (Consolidated - works for products & blogs)**
- ✅ `GET /api/reviews` - Get reviews
  - Query params: `productId` | `blogId` (one required), `page`, `limit`
- ✅ `POST /api/reviews` - Add review
  - Body: `productId` | `blogId`, `rating`, `comment`, etc.
- ✅ `PUT /api/reviews/:reviewId` - Update review
- ✅ `DELETE /api/reviews/:reviewId` - Delete review

---

## 🏪 **12. Store Locations (2 APIs)**

### **Store List Pages** (`/store-list`, `/store-list-02`)
- ✅ `GET /api/stores` - Get all stores
- ✅ `GET /api/stores/:id` - Get store details

---

## 📊 **13. Analytics & Tracking (3 APIs)**

### **Product Views & Analytics**
- ✅ `POST /api/analytics/product-view/:productId` - Track product view
- ✅ `POST /api/analytics/page-view` - Track page view
- ✅ `GET /api/analytics/popular-products` - Get popular products

---

## 💳 **14. Payment Integration (4 APIs)**

### **Payment Processing** (Checkout)
- ✅ `POST /api/payments/create-intent` - Create payment intent
- ✅ `POST /api/payments/confirm` - Confirm payment
- ✅ `GET /api/payments/methods` - Get available payment methods
- ✅ `POST /api/payments/webhook` - Payment webhook handler

---

## 🎁 **15. Coupons & Discounts (2 APIs)**

### **Coupons API (Consolidated)**
- ✅ `GET /api/coupons` - Get coupons
  - Query params: `code` (for validation), `available` (true/false)
- ✅ `POST /api/coupons/apply` - Apply coupon to cart
  - Body: `code`, `cartId`

---

## 📱 **16. Quick Actions (2 APIs)**

### **Quick Actions (Consolidated)**
- ✅ `GET /api/products/:id` - Get product (includes quick-view data, size-guide)
  - Query params: `view`: `quick` | `full` (default)
- ✅ `POST /api/cart/add` - Add to cart (works for quick-add with `quick: true` in body)

---

## 📄 **17. Static Pages (3 APIs)**

### **Pages API (Consolidated)**
- ✅ `GET /api/pages/:slug` - Get page content
  - Slug options: `about`, `terms`, `privacy`, etc.
- ✅ `GET /api/faqs` - Get FAQs
- ✅ `GET /api/testimonials` - Get testimonials
- ✅ `POST /api/testimonials` - Submit testimonial

---

## 📈 **Summary by Page/Feature**

| Page/Feature | API Count | APIs |
|-------------|-----------|------|
| **Homepage** | 4 | Products (type param), Collections, Brands |
| **Shop Pages** | 3 | Products (with filters), Filters options, Categories |
| **Product Detail** | 4 | Product details, Related, Reviews, Frequently bought |
| **Cart** | 6 | Get, Add, Update, Remove, Clear, Coupon |
| **Wishlist** | 4 | Get, Add, Remove, Check |
| **Compare** | 4 | Get, Add, Remove, Clear |
| **Checkout** | 5 | Create order, Shipping, Payment, Coupon, Calculate |
| **Orders** | 4 | List, Details, Track, Cancel |
| **My Account** | 8 | Profile, Addresses (6 APIs), Password |
| **Blogs** | 5 | List (with filters), Detail, Related, Categories, Tags |
| **Search** | 2 | Global (type param), Suggestions |
| **Contact** | 1 | Send message |
| **Newsletter** | 2 | Subscribe, Unsubscribe |
| **Reviews** | 4 | Get, Add, Update, Delete |
| **Stores** | 2 | List, Details |
| **Payment** | 4 | Intent, Confirm, Methods, Webhook |
| **Coupons** | 2 | Get (with code/available params), Apply |
| **Auth** | 12 | Login, Register, Forgot, Reset, Profile |
| **Other** | 2 | Analytics, Pages (slug param), Testimonials |

---

## 🗄️ **Database Collections/Schemas Needed**

### **MongoDB Collections:**

#### **Frontend Collections (20)**
1. **users** - User accounts
2. **products** - Products catalog
3. **categories** - Product categories
4. **brands** - Brands
5. **orders** - Orders
6. **orderItems** - Order items
7. **cart** - Shopping cart
8. **wishlist** - Wishlist items
9. **compare** - Compare items
10. **addresses** - User addresses
11. **reviews** - Product reviews
12. **blogs** - Blog posts
13. **comments** - Blog comments
14. **coupons** - Discount coupons
15. **newsletter** - Newsletter subscribers
16. **contacts** - Contact messages
17. **testimonials** - Customer testimonials
18. **stores** - Store locations
19. **payments** - Payment transactions
20. **analytics** - Analytics data

#### **Admin Panel Collections (10)**
21. **admins** - Admin accounts
22. **adminSessions** - Admin sessions
23. **settings** - Site settings
24. **shippingMethods** - Shipping methods
25. **shippingZones** - Shipping zones
26. **paymentMethods** - Payment method configs
27. **reports** - Generated reports
28. **media** - Media files metadata
29. **inventoryLogs** - Inventory change logs
30. **adminLogs** - Admin activity logs

### **Total Collections: 30**

---

## 🔧 **Tech Stack Recommendation**

- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary/AWS S3
- **Payment**: Stripe/PayPal integration
- **Email**: Nodemailer or SendGrid
- **Validation**: Joi or express-validator
- **Security**: bcrypt, helmet, cors
- **Rate Limiting**: express-rate-limit

---

## 📝 **Priority Implementation Order**

### **FRONTEND APIs**

#### **Phase 1 (Core Features) - 45 APIs**
1. Authentication (12 APIs)
2. Products CRUD (15 APIs)
3. Cart Management (6 APIs)
4. Orders & Checkout (12 APIs)

#### **Phase 2 (User Features) - 22 APIs**
5. Wishlist (4 APIs)
6. Address Management (6 APIs)
7. Reviews (4 APIs)
8. My Account (8 APIs)

#### **Phase 3 (Additional Features) - 22 APIs**
9. Blogs (8 APIs)
10. Search (3 APIs)
11. Compare (4 APIs)
12. Payment (4 APIs)
13. Coupons (3 APIs)

#### **Phase 4 (Supporting Features) - 13 APIs**
14. Contact & Newsletter (4 APIs)
15. Stores (2 APIs)
16. Analytics (3 APIs)
17. Static Pages (5 APIs)

---

### **ADMIN PANEL APIs**

#### **Phase 1 (Core Admin Features) - 45 APIs**
1. Admin Authentication (6 APIs)
2. Dashboard (8 APIs)
3. Product Management (15 APIs)
4. Order Management (12 APIs)
5. User Management (10 APIs)

#### **Phase 2 (Content Management) - 33 APIs**
6. Category Management (8 APIs)
7. Brand Management (7 APIs)
8. Blog Management (10 APIs)
9. Content Management (5 APIs)
10. Media Management (5 APIs)

#### **Phase 3 (Business Features) - 27 APIs**
11. Coupon Management (8 APIs)
12. Review Management (6 APIs)
13. Shipping Management (7 APIs)
14. Payment Settings (5 APIs)
15. Store Management (6 APIs)

#### **Phase 4 (Advanced Features) - 30 APIs**
16. Analytics & Reports (8 APIs)
17. Inventory Management (6 APIs)
18. Contact & Newsletter (6 APIs)
19. Staff Management (7 APIs)
20. Dashboard Widgets (4 APIs)

#### **Phase 5 (Settings & Configuration) - 15 APIs**
21. Settings (10 APIs)
22. Admin Logs & Activity (5 APIs)

---

### **Recommended Development Timeline**

**Month 1-2: Frontend Phase 1 + Admin Phase 1**
- Core e-commerce functionality
- Basic admin panel

**Month 3: Frontend Phase 2 + Admin Phase 2**
- User features
- Content management

**Month 4: Frontend Phase 3 + Admin Phase 3**
- Additional features
- Business features

**Month 5: Frontend Phase 4 + Admin Phase 4-5**
- Supporting features
- Advanced admin features

---

---

## 🔐 **18. ADMIN PANEL APIs (~95-100 APIs)**

### **🔑 Admin Authentication (6 APIs)**
- ✅ `POST /api/admin/auth/login` - Admin login
- ✅ `POST /api/admin/auth/logout` - Admin logout
- ✅ `GET /api/admin/auth/me` - Get current admin
- ✅ `POST /api/admin/auth/refresh-token` - Refresh token
- ✅ `POST /api/admin/auth/change-password` - Change password
- ✅ `GET /api/admin/auth/permissions` - Get admin permissions

---

### **📊 Admin Dashboard (8 APIs)**
- ✅ `GET /api/admin/dashboard/stats` - Get dashboard statistics
  - Total orders, revenue, users, products
  - Today's orders, revenue
  - Monthly/Yearly charts data
- ✅ `GET /api/admin/dashboard/revenue` - Revenue analytics
- ✅ `GET /api/admin/dashboard/orders-chart` - Orders chart data
- ✅ `GET /api/admin/dashboard/sales-chart` - Sales chart data
- ✅ `GET /api/admin/dashboard/top-products` - Top selling products
- ✅ `GET /api/admin/dashboard/top-customers` - Top customers
- ✅ `GET /api/admin/dashboard/recent-orders` - Recent orders
- ✅ `GET /api/admin/dashboard/low-stock` - Low stock alerts

---

### **🛍️ Admin Product Management (15 APIs)**

#### **Product CRUD**
- ✅ `GET /api/admin/products` - Get all products (with filters, pagination)
- ✅ `GET /api/admin/products/:id` - Get single product
- ✅ `POST /api/admin/products` - Create new product
- ✅ `PUT /api/admin/products/:id` - Update product
- ✅ `DELETE /api/admin/products/:id` - Delete product
- ✅ `POST /api/admin/products/bulk-delete` - Bulk delete products
- ✅ `POST /api/admin/products/:id/duplicate` - Duplicate product

#### **Product Features**
- ✅ `PUT /api/admin/products/:id/stock` - Update stock
- ✅ `PUT /api/admin/products/:id/status` - Update status (active/inactive)
- ✅ `PUT /api/admin/products/:id/featured` - Set featured
- ✅ `POST /api/admin/products/:id/images` - Upload product images
- ✅ `DELETE /api/admin/products/:id/images/:imageId` - Delete image
- ✅ `PUT /api/admin/products/:id/variants` - Manage variants
- ✅ `GET /api/admin/products/export` - Export products (CSV/Excel)
- ✅ `POST /api/admin/products/import` - Import products (CSV/Excel)

---

### **📦 Admin Order Management (12 APIs)**

#### **Order Operations**
- ✅ `GET /api/admin/orders` - Get all orders (with filters)
- ✅ `GET /api/admin/orders/:id` - Get order details
- ✅ `PUT /api/admin/orders/:id/status` - Update order status
- ✅ `PUT /api/admin/orders/:id/shipping` - Update shipping info
- ✅ `PUT /api/admin/orders/:id/payment` - Update payment status
- ✅ `POST /api/admin/orders/:id/invoice` - Generate invoice
- ✅ `GET /api/admin/orders/:id/invoice` - Download invoice
- ✅ `POST /api/admin/orders/:id/refund` - Process refund
- ✅ `PUT /api/admin/orders/:id/cancel` - Cancel order
- ✅ `POST /api/admin/orders/:id/send-tracking` - Send tracking email
- ✅ `GET /api/admin/orders/export` - Export orders
- ✅ `GET /api/admin/orders/analytics` - Order analytics

---

### **👥 Admin User Management (10 APIs)**

#### **User CRUD**
- ✅ `GET /api/admin/users` - Get all users (with filters)
- ✅ `GET /api/admin/users/:id` - Get user details
- ✅ `POST /api/admin/users` - Create user
- ✅ `PUT /api/admin/users/:id` - Update user
- ✅ `DELETE /api/admin/users/:id` - Delete user
- ✅ `PUT /api/admin/users/:id/status` - Activate/Deactivate user
- ✅ `PUT /api/admin/users/:id/role` - Change user role
- ✅ `GET /api/admin/users/:id/orders` - Get user orders
- ✅ `GET /api/admin/users/export` - Export users
- ✅ `GET /api/admin/users/statistics` - User statistics

---

### **📁 Admin Category Management (8 APIs)**
- ✅ `GET /api/admin/categories` - Get all categories
- ✅ `GET /api/admin/categories/:id` - Get category details
- ✅ `POST /api/admin/categories` - Create category
- ✅ `PUT /api/admin/categories/:id` - Update category
- ✅ `DELETE /api/admin/categories/:id` - Delete category
- ✅ `PUT /api/admin/categories/:id/status` - Update status
- ✅ `PUT /api/admin/categories/reorder` - Reorder categories
- ✅ `GET /api/admin/categories/tree` - Get category tree

---

### **🏷️ Admin Brand Management (7 APIs)**
- ✅ `GET /api/admin/brands` - Get all brands
- ✅ `GET /api/admin/brands/:id` - Get brand details
- ✅ `POST /api/admin/brands` - Create brand
- ✅ `PUT /api/admin/brands/:id` - Update brand
- ✅ `DELETE /api/admin/brands/:id` - Delete brand
- ✅ `POST /api/admin/brands/:id/logo` - Upload brand logo
- ✅ `PUT /api/admin/brands/:id/status` - Update status

---

### **📝 Admin Blog Management (10 APIs)**
- ✅ `GET /api/admin/blogs` - Get all blogs
- ✅ `GET /api/admin/blogs/:id` - Get blog details
- ✅ `POST /api/admin/blogs` - Create blog
- ✅ `PUT /api/admin/blogs/:id` - Update blog
- ✅ `DELETE /api/admin/blogs/:id` - Delete blog
- ✅ `PUT /api/admin/blogs/:id/status` - Update status (draft/published)
- ✅ `GET /api/admin/blogs/categories` - Manage blog categories
- ✅ `POST /api/admin/blogs/:id/images` - Upload blog images
- ✅ `GET /api/admin/blogs/:id/comments` - Get blog comments
- ✅ `DELETE /api/admin/blogs/:id/comments/:commentId` - Delete comment

---

### **🎁 Admin Coupon Management (8 APIs)**
- ✅ `GET /api/admin/coupons` - Get all coupons
- ✅ `GET /api/admin/coupons/:id` - Get coupon details
- ✅ `POST /api/admin/coupons` - Create coupon
- ✅ `PUT /api/admin/coupons/:id` - Update coupon
- ✅ `DELETE /api/admin/coupons/:id` - Delete coupon
- ✅ `PUT /api/admin/coupons/:id/status` - Activate/Deactivate
- ✅ `GET /api/admin/coupons/:id/usage` - Get coupon usage stats
- ✅ `GET /api/admin/coupons/analytics` - Coupon analytics

---

### **⭐ Admin Review Management (6 APIs)**
- ✅ `GET /api/admin/reviews` - Get all reviews
- ✅ `GET /api/admin/reviews/:id` - Get review details
- ✅ `PUT /api/admin/reviews/:id/status` - Approve/Reject review
- ✅ `DELETE /api/admin/reviews/:id` - Delete review
- ✅ `GET /api/admin/reviews/pending` - Get pending reviews
- ✅ `GET /api/admin/reviews/statistics` - Review statistics

---

### **📧 Admin Contact & Newsletter (6 APIs)**

#### **Contact Messages**
- ✅ `GET /api/admin/contacts` - Get all contact messages
- ✅ `GET /api/admin/contacts/:id` - Get message details
- ✅ `PUT /api/admin/contacts/:id/read` - Mark as read
- ✅ `DELETE /api/admin/contacts/:id` - Delete message
- ✅ `POST /api/admin/contacts/:id/reply` - Reply to message

#### **Newsletter**
- ✅ `GET /api/admin/newsletter/subscribers` - Get all subscribers
- ✅ `DELETE /api/admin/newsletter/subscribers/:id` - Remove subscriber
- ✅ `POST /api/admin/newsletter/send` - Send newsletter email
- ✅ `GET /api/admin/newsletter/statistics` - Newsletter stats

---

### **🏪 Admin Store Management (6 APIs)**
- ✅ `GET /api/admin/stores` - Get all stores
- ✅ `GET /api/admin/stores/:id` - Get store details
- ✅ `POST /api/admin/stores` - Create store
- ✅ `PUT /api/admin/stores/:id` - Update store
- ✅ `DELETE /api/admin/stores/:id` - Delete store
- ✅ `PUT /api/admin/stores/:id/status` - Update status

---

### **🚚 Admin Shipping Management (7 APIs)**
- ✅ `GET /api/admin/shipping/methods` - Get shipping methods
- ✅ `POST /api/admin/shipping/methods` - Create shipping method
- ✅ `PUT /api/admin/shipping/methods/:id` - Update method
- ✅ `DELETE /api/admin/shipping/methods/:id` - Delete method
- ✅ `GET /api/admin/shipping/zones` - Get shipping zones
- ✅ `POST /api/admin/shipping/zones` - Create zone
- ✅ `PUT /api/admin/shipping/zones/:id` - Update zone

---

### **💳 Admin Payment Settings (5 APIs)**
- ✅ `GET /api/admin/payments/methods` - Get payment methods
- ✅ `PUT /api/admin/payments/methods/:id` - Update payment method
- ✅ `PUT /api/admin/payments/methods/:id/status` - Enable/Disable
- ✅ `GET /api/admin/payments/transactions` - Get transactions
- ✅ `GET /api/admin/payments/analytics` - Payment analytics

---

### **📊 Admin Analytics & Reports (8 APIs)**
- ✅ `GET /api/admin/analytics/sales` - Sales analytics
- ✅ `GET /api/admin/analytics/products` - Product analytics
- ✅ `GET /api/admin/analytics/customers` - Customer analytics
- ✅ `GET /api/admin/analytics/revenue` - Revenue reports
- ✅ `GET /api/admin/analytics/orders` - Order reports
- ✅ `GET /api/admin/reports/sales` - Generate sales report
- ✅ `GET /api/admin/reports/products` - Generate product report
- ✅ `GET /api/admin/reports/customers` - Generate customer report

---

### **⚙️ Admin Settings (10 APIs)**

#### **General Settings**
- ✅ `GET /api/admin/settings` - Get all settings
- ✅ `PUT /api/admin/settings` - Update settings
- ✅ `GET /api/admin/settings/general` - General settings
- ✅ `PUT /api/admin/settings/general` - Update general

#### **Email Settings**
- ✅ `GET /api/admin/settings/email` - Email settings
- ✅ `PUT /api/admin/settings/email` - Update email settings
- ✅ `POST /api/admin/settings/email/test` - Test email

#### **SEO Settings**
- ✅ `GET /api/admin/settings/seo` - SEO settings
- ✅ `PUT /api/admin/settings/seo` - Update SEO

#### **Other**
- ✅ `GET /api/admin/settings/social` - Social media settings
- ✅ `PUT /api/admin/settings/social` - Update social settings

---

### **📄 Admin Content Management (5 APIs)**
- ✅ `GET /api/admin/pages` - Get all pages (About, Terms, etc.)
- ✅ `GET /api/admin/pages/:slug` - Get page by slug
- ✅ `PUT /api/admin/pages/:slug` - Update page content
- ✅ `GET /api/admin/faqs` - Get FAQs
- ✅ `PUT /api/admin/faqs` - Update FAQs

---

### **👨‍💼 Admin Staff Management (7 APIs)**
- ✅ `GET /api/admin/staff` - Get all admin staff
- ✅ `GET /api/admin/staff/:id` - Get staff details
- ✅ `POST /api/admin/staff` - Create staff member
- ✅ `PUT /api/admin/staff/:id` - Update staff
- ✅ `DELETE /api/admin/staff/:id` - Delete staff
- ✅ `PUT /api/admin/staff/:id/permissions` - Update permissions
- ✅ `PUT /api/admin/staff/:id/status` - Activate/Deactivate

---

### **📦 Admin Inventory Management (6 APIs)**
- ✅ `GET /api/admin/inventory` - Get inventory list
- ✅ `GET /api/admin/inventory/low-stock` - Low stock alerts
- ✅ `PUT /api/admin/inventory/:productId/stock` - Update stock
- ✅ `POST /api/admin/inventory/adjust` - Stock adjustment
- ✅ `GET /api/admin/inventory/history` - Stock history
- ✅ `GET /api/admin/inventory/export` - Export inventory

---

### **🖼️ Admin Media Management (5 APIs)**
- ✅ `GET /api/admin/media` - Get all media files
- ✅ `POST /api/admin/media/upload` - Upload file
- ✅ `DELETE /api/admin/media/:id` - Delete file
- ✅ `GET /api/admin/media/folders` - Get folders
- ✅ `POST /api/admin/media/folders` - Create folder

---

### **📈 Admin Dashboard Widgets (4 APIs)**
- ✅ `GET /api/admin/widgets` - Get dashboard widgets
- ✅ `PUT /api/admin/widgets/reorder` - Reorder widgets
- ✅ `PUT /api/admin/widgets/:id/visibility` - Toggle visibility
- ✅ `GET /api/admin/widgets/data` - Get widget data

---

## 📊 **ADMIN PANEL API SUMMARY**

| Module | API Count |
|--------|-----------|
| Admin Authentication | 6 |
| Dashboard | 8 |
| Product Management | 15 |
| Order Management | 12 |
| User Management | 10 |
| Category Management | 8 |
| Brand Management | 7 |
| Blog Management | 10 |
| Coupon Management | 8 |
| Review Management | 6 |
| Contact & Newsletter | 6 |
| Store Management | 6 |
| Shipping Management | 7 |
| Payment Settings | 5 |
| Analytics & Reports | 8 |
| Settings | 10 |
| Content Management | 5 |
| Staff Management | 7 |
| Inventory Management | 6 |
| Media Management | 5 |
| Dashboard Widgets | 4 |
| **TOTAL ADMIN APIs** | **~160 APIs** |

---

## ✅ **GRAND TOTAL API COUNT**

### **Frontend APIs: ~85-90 APIs**
### **Admin Panel APIs: ~160 APIs**
### **🎯 TOTAL: ~245-250 APIs**

---

## 📋 **Complete API Breakdown Table**

| Category | Frontend APIs | Admin APIs | Subtotal |
|----------|---------------|------------|----------|
| **Authentication** | 12 | 6 | 18 |
| **Dashboard** | - | 8 | 8 |
| **Products** | 8 | 15 | 23 |
| **Orders** | 12 | 12 | 24 |
| **Users** | 8 | 10 | 18 |
| **Cart** | 6 | - | 6 |
| **Wishlist** | 4 | - | 4 |
| **Compare** | 4 | - | 4 |
| **Addresses** | 6 | - | 6 |
| **Categories** | 1 | 8 | 9 |
| **Brands** | 1 | 7 | 8 |
| **Blogs** | 6 | 10 | 16 |
| **Reviews** | 4 | 6 | 10 |
| **Coupons** | 2 | 8 | 10 |
| **Search** | 2 | - | 2 |
| **Contact/Newsletter** | 4 | 6 | 10 |
| **Stores** | 2 | 6 | 8 |
| **Shipping** | 2 | 7 | 9 |
| **Payment** | 4 | 5 | 9 |
| **Analytics** | 3 | 8 | 11 |
| **Settings** | - | 10 | 10 |
| **Content Management** | 3 | 5 | 8 |
| **Staff** | - | 7 | 7 |
| **Inventory** | - | 6 | 6 |
| **Media** | - | 5 | 5 |
| **Widgets** | - | 4 | 4 |
| **Other** | 2 | - | 2 |
| **TOTAL** | **~65** | **~160** | **~225** |

---

**Note**: কিছু APIs একাধিক page-এ ব্যবহার হতে পারে (যেমন Product APIs সব product pages-এ)।

