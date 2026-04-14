# GeethaTex E-Commerce

Simple Vercel-ready e-commerce site for **GeethaTex** (Soft Silk + Kerala Sarees).

## Features
- Product listing
- Add to cart
- Razorpay checkout
- Admin dashboard (PIN login) to add/delete products

## Files
- `public/index.html` - storefront + admin UI
- `api/login.js` - admin PIN login, returns signed token
- `api/verify.js` - admin token verification
- `api/create-order.js` - Razorpay order creation
- `api/payment-verify.js` - Razorpay signature verification

## Environment variables
- `ADMIN_PIN`
- `ADMIN_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## Run locally
```bash
vercel dev
```
