import { type RouteConfig, index,route,prefix } from "@react-router/dev/routes";

export default [
    ...prefix("ocado-mini-store-app", [
    route("", "routes/home.tsx", [
            index("pages/ProductListPage.tsx"),
            route("cart", "pages/ShoppingCartPage.tsx"),
            route("order-summary", "pages/OrderSummaryPage.tsx"),
    ]),
        route("order-confirmation", "routes/OrderConfirmationPage.tsx")
        ]),
] satisfies RouteConfig;
