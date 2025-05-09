# Artur_Bryja_Web_Wrocław 

A small, frontend-only React, TypeScript, and Tailwind CSS application that allows users to browse products, add/remove them from a shopping cart, and simulate an order placement process.

**Live Demo:** [https://arthures11.github.io/ocado-mini-store-app/](https://arthures11.github.io/ocado-mini-store-app/)

## Features

*   **Product Listing:** Displays a static list of products with names, prices, and images.
*   **Shopping Cart:**
    *   Add products to the cart.
    *   View items in the cart (name, quantity, price).
    *   Increase/decrease item quantity.
    *   Remove items from the cart.
    *   Displays subtotal per item and total cart cost.
*   **Order Summary:** Review cart items and total cost before "placing" an order.
*   **Order Confirmation:** A dedicated page confirming the order details after placement.
*   **Responsive Design:** Basic responsiveness with Tailwind CSS.
*   **Client-Side State:** Uses React Context API and `localStorage` to persist cart data.
*   **Notifications:** Displays a small alert when an item is added to the cart.
*   **Client-Side Routing:** Uses `react-router-dom` for page navigation.

## Tech Stack

*   **React 18+**
*   **TypeScript**
*   **Tailwind CSS 3+**
*   **React Router DOM v6+** (for client-side routing)
*   **Vite** (as the build tool - *adjust if using Create React App*)
*   **UUID** (for unique ID generation for notifications)
*   **gh-pages** (for deployment to GitHub Pages)


## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/arthures11/ocado-mini-store-app.git
    cd ocado-mini-store-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run:

*   **`npm run dev`**
    Runs the app in development mode using Vite.
    Open [http://localhost:5173](http://localhost:5173) (or the port Vite chooses) to view it in the browser.
    The page will reload if you make edits.

*   **`npm run build`**
    Builds the app for production to the `dist` folder (for Vite) or `build` folder (for CRA).
    It correctly bundles React in production mode and optimizes the build for the best performance.

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

1.  **Update `package.json`:**
    Set the `homepage` field to `https://arthures11.github.io/ocado-mini-store-app/`.

2.  **Update `vite.config.ts`:**
    Set the `base` property in `defineConfig` to `/ocado-mini-store-app/`.

    ```typescript
    // vite.config.ts
    import { defineConfig } from 'vite'
    // ... other imports
    export default defineConfig({
      // ... plugins
      base: '/ocado-mini-store-app/',
    })
    ```

3.  **Run the deploy script:**
    ```bash
    npm run deploy
    ```

4.  **Configure GitHub Repository Settings:**
    *   Go to your repository on GitHub > Settings > Pages.
    *   Set the source to the `gh-pages` branch and the folder to `/ (root)`.
    *   Your site should be live shortly at the URL specified in your `homepage` field.

## State Management

*   **Cart State:** Managed via `CartContext` (`src/context/CartContext.tsx`). Cart items are persisted in `localStorage` under the key `shoppingCart`.
*   **Notification State:** Managed via `NotificationContext` (`src/context/NotificationContext.tsx`). Notifications are transient and not persisted.
*   **Order Data for Confirmation:** When an order is "placed", details are temporarily stored in `localStorage` under the key `finalizedOrder` to be read by the confirmation page, then cleared.

## Further Improvements (Future Considerations)

*   Add unit and integration tests.
*   Implement more sophisticated state management (e.g., Redux Toolkit, Zustand) if complexity grows.
*   Connect to a real backend API for products and orders.
*   Add user authentication.
*   Enhance styling and user experience.
*   Improve accessibility.
*   Form validation for any future input fields.
