# STOCRX Backend Control Tutorial

## 📚 Table of Contents
1. [Understanding Frontend vs Backend](#understanding-frontend-vs-backend)
2. [User Access Levels](#user-access-levels)
3. [How to Control Your Website](#how-to-control-your-website)
4. [Editing Content](#editing-content)
5. [Managing Users](#managing-users)
6. [Adding New Pages](#adding-new-pages)

---

## 🎯 Understanding Frontend vs Backend

### **Frontend (What Visitors See)**
- Public pages that anyone can view
- No login required
- Limited functionality
- Examples: Homepage, Browse Cars, Pricing, FAQs

### **Backend (Admin Control)**
- Protected pages requiring login
- Full control over website content
- Manage users, cars, payments
- Examples: Admin Dashboard, Add Cars, User Management

---

## 👥 User Access Levels

### **1. Visitor (No Account)**
**Can Access:**
- ✅ Homepage
- ✅ Browse Cars (view only)
- ✅ Pricing & Plans
- ✅ How It Works
- ✅ FAQs
- ✅ Contact Us

**Cannot Access:**
- ❌ My Account
- ❌ Make Payment
- ❌ Apply for Car
- ❌ Ownership Progress

### **2. User (Registered Customer)**
**Can Access:**
- ✅ Everything Visitors can access
- ✅ My Account
- ✅ Make Payment
- ✅ Apply for Car
- ✅ Ownership Progress
- ✅ Compare Cars
- ✅ Car Finder

**Cannot Access:**
- ❌ Admin Dashboard
- ❌ Add/Edit Cars
- ❌ User Management

### **3. Admin (You - Website Owner)**
**Can Access:**
- ✅ Everything Users can access
- ✅ Admin Dashboard
- ✅ Add/Edit/Delete Cars
- ✅ User Management
- ✅ Payment Management
- ✅ Site Settings

---

## 🎛️ How to Control Your Website

### **Method 1: Edit HTML Files Directly**

#### **Step 1: Open the File**
```bash
# Navigate to your project folder
cd stocrx-updated

# Open index.html in a text editor
# Windows: notepad index.html
# Mac: open -a TextEdit index.html
# Linux: nano index.html
```

#### **Step 2: Find What You Want to Change**
Look for specific sections:

**Change Hero Title:**
```html
<!-- Find this line (around line 150) -->
<h2 class="hero-title">Drive Today.<br>Pay As You Go.<br>Own It Your Way.</h2>

<!-- Change to: -->
<h2 class="hero-title">Your New Title Here</h2>
```

**Change Contact Email:**
```html
<!-- Find this line (around line 350) -->
<p>Email: contact@stocrx.com</p>

<!-- Change to: -->
<p>Email: youremail@stocrx.com</p>
```

#### **Step 3: Save and Upload**
1. Save the file (Ctrl+S or Cmd+S)
2. Upload to your GitHub repository
3. Changes will appear on your live site

---

### **Method 2: Use Backend Control Panel (Recommended)**

I'll create an admin dashboard for you where you can:
- Add/edit cars without touching code
- Manage users
- Update content
- View analytics

---

## ✏️ Editing Content

### **Change Menu Items**

**Location:** `index.html` (lines 40-80)

```html
<!-- Current Menu -->
<li class="nav-item has-dropdown">
    <a href="#" class="nav-link">Cars <span class="dropdown-arrow">▼</span></a>
    <ul class="dropdown-menu">
        <li><a href="browse-cars.html">Browse Cars</a></li>
        <li><a href="compare-cars.html">Compare Cars</a></li>
        <li><a href="car-finder.html">Car Finder (AI)</a></li>
    </ul>
</li>

<!-- To Add a New Menu Item: -->
<li><a href="new-page.html">New Page Name</a></li>
```

### **Change Colors**

**Location:** `styles.css` (lines 1-15)

```css
/* Current Colors */
:root {
    --primary: #375fe2;        /* Main blue color */
    --primary-dark: #2748B8;   /* Darker blue */
    --secondary: #53389E;      /* Purple accent */
}

/* To Change Colors: */
:root {
    --primary: #FF0000;        /* Change to red */
    --primary-dark: #CC0000;   /* Darker red */
    --secondary: #0000FF;      /* Blue accent */
}
```

### **Add New Cars**

**Location:** `script.js` (lines 80-140)

```javascript
// Current Cars Array
const vehicles = [
    {
        id: 1,
        name: "2015 Honda Civic",
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500",
        price: 7500,
        downPayment: 1500,
        monthly: 583,
        mileage: 85000,
        year: 2015,
        make: "Honda",
        model: "Civic"
    },
    // Add your new car here:
    {
        id: 6,
        name: "2016 Toyota Corolla",
        image: "YOUR_IMAGE_URL_HERE",
        price: 8000,
        downPayment: 1500,
        monthly: 583,
        mileage: 75000,
        year: 2016,
        make: "Toyota",
        model: "Corolla"
    }
];
```

---

## 👤 Managing Users

### **How User Access Works**

**Location:** `script.js` (lines 350-400)

```javascript
// User roles are stored in browser localStorage
const UserRole = {
    VISITOR: 'visitor',  // No account
    USER: 'user',        // Registered customer
    ADMIN: 'admin'       // You (website owner)
};

// To make yourself admin (run in browser console):
localStorage.setItem('userRole', 'admin');

// To check current role:
console.log(localStorage.getItem('userRole'));
```

### **Protect Pages from Visitors**

Add this to the top of any page you want to protect:

```html
<script>
// Protect this page - require user login
if (!localStorage.getItem('userRole') || localStorage.getItem('userRole') === 'visitor') {
    alert('Please log in to access this page');
    window.location.href = 'login.html';
}
</script>
```

### **Protect Admin-Only Pages**

```html
<script>
// Protect this page - require admin access
if (localStorage.getItem('userRole') !== 'admin') {
    alert('Admin access required');
    window.location.href = 'index.html';
}
</script>
```

---

## 📄 Adding New Pages

### **Step 1: Create New HTML File**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page - STOCRX</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Copy header from index.html -->
    <header class="main-header">
        <!-- ... header content ... -->
    </header>

    <!-- Your new page content -->
    <section class="page-content">
        <div class="container">
            <h1>Your New Page Title</h1>
            <p>Your content here...</p>
        </div>
    </section>

    <!-- Copy footer from index.html -->
    <footer class="main-footer">
        <!-- ... footer content ... -->
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

### **Step 2: Add to Menu**

In `index.html`, add your new page to the menu:

```html
<li><a href="your-new-page.html">New Page Name</a></li>
```

### **Step 3: Upload to GitHub**

```bash
git add your-new-page.html
git commit -m "Added new page"
git push
```

---

## 🔧 Quick Reference Commands

### **Make Yourself Admin**
Open browser console (F12) and run:
```javascript
localStorage.setItem('userRole', 'admin');
location.reload();
```

### **Check Current User Role**
```javascript
console.log(localStorage.getItem('userRole'));
```

### **Reset to Visitor**
```javascript
localStorage.removeItem('userRole');
location.reload();
```

---

## 📝 Common Tasks

### **Task 1: Change Down Payment Amount**
**File:** `script.js`
**Line:** ~85
```javascript
downPayment: 1500,  // Change this number
```

### **Task 2: Change Monthly Payment**
**File:** `script.js`
**Line:** ~86
```javascript
monthly: 583,  // Change this number
```

### **Task 3: Change Contact Email**
**File:** `index.html`
**Line:** ~350
```html
<p>Email: contact@stocrx.com</p>  <!-- Change email here -->
```

### **Task 4: Change Phone Number**
**File:** `index.html`
**Line:** ~351
```html
<p>Phone: 1-800-STOCRX</p>  <!-- Change phone here -->
```

---

## 🎓 Next Steps

1. **Practice editing** - Make small changes and see results
2. **Create admin dashboard** - I can build this for you
3. **Add database** - Store cars and users in a database
4. **Add authentication** - Real login system with passwords
5. **Add payment processing** - Integrate Stripe or PayPal

---

## 💡 Tips

- **Always backup** before making changes
- **Test locally** before uploading to live site
- **Use browser console** (F12) to debug issues
- **Check mobile view** - Test on phone after changes
- **Ask for help** - I'm here to assist you!

---

## 🆘 Need Help?

If you get stuck or need me to:
- Build the admin dashboard
- Add new features
- Fix issues
- Explain something

Just ask! I'm here to help you control your website easily.