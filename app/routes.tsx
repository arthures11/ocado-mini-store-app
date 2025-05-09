import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
    // Layout route at “/”
    route("", "routes/home.tsx", [
            index("pages/ProductListPage.tsx"),
            route("cart", "pages/ShoppingCartPage.tsx"),
            route("order-summary", "pages/OrderSummaryPage.tsx"),
    ]),
    route("order-confirmation", "routes/OrderConfirmationPage.tsx")
] satisfies RouteConfig;
