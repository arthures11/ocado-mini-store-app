import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, Link, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, createContext, useState, useEffect, useContext, useCallback } from "react";
import { v4 } from "uuid";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const getPriceAsNumber = (price) => {
  return price.main + price.fractional / 100;
};
const formatPriceDisplay = (price) => {
  if (typeof price === "number") {
    return price.toFixed(2);
  }
  return `${price.main}.${String(price.fractional).padStart(2, "0")}`;
};
const CartContext = createContext(void 0);
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem("shoppingCart");
      return localData ? JSON.parse(localData) : [];
    } else {
      return;
    }
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
    }
  }, [cartItems]);
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map(
          (item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };
  const updateQuantity = (productId, quantity) => {
    setCartItems(
      (prevItems) => prevItems.map((item) => item.id === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0)
    );
  };
  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("shoppingCart");
    }
  };
  const getTotalCost = () => {
    return cartItems == null ? void 0 : cartItems.reduce((total, item) => {
      const itemPriceAsNumber = getPriceAsNumber(item.price);
      return total + itemPriceAsNumber * item.quantity;
    }, 0);
  };
  return /* @__PURE__ */ jsx(CartContext.Provider, { value: { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalCost }, children });
};
const Header = () => {
  const { cartItems } = useCart();
  let itemCount = 0;
  if (cartItems === void 0) ;
  else {
    cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  return /* @__PURE__ */ jsx("header", { className: "bg-gray-800 text-white p-4 shadow-md", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex justify-between items-center", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: "text-2xl font-bold hover:text-gray-300", children: "My Shop" }),
    /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsxs("ul", { className: "flex space-x-6 items-center", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-gray-300", children: "Product List" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "/cart", className: "relative hover:text-gray-300", children: [
        "Shopping Cart",
        itemCount > 0
      ] }) })
    ] }) })
  ] }) });
};
const NotificationContext = createContext(void 0);
const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const addNotification = useCallback((message, type = "info") => {
    const id = v4();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 3e3);
  }, []);
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);
  return /* @__PURE__ */ jsx(NotificationContext.Provider, { value: { notifications, addNotification, removeNotification }, children });
};
const NotificationItem = ({
  notification,
  onDismiss
}) => {
  let bgColor = "bg-blue-500";
  if (notification.type === "success") bgColor = "bg-green-500";
  else if (notification.type === "error") bgColor = "bg-red-500";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative ${bgColor} text-white p-3 rounded-md shadow-lg mb-2 transition-all duration-300 ease-in-out transform opacity-100 translate-y-0`,
      role: "alert",
      children: [
        /* @__PURE__ */ jsx("p", { children: notification.message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onDismiss,
            className: "absolute top-1 right-1 text-white hover:text-gray-200",
            "aria-label": "Dismiss notification",
            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ]
    }
  );
};
const NotificationDisplay = () => {
  const { notifications, removeNotification } = useNotification();
  if (notifications.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed top-4 left-4 z-50 w-64 sm:w-80", children: notifications.map((notification) => /* @__PURE__ */ jsx(
    NotificationItem,
    {
      notification,
      onDismiss: () => removeNotification(notification.id)
    },
    notification.id
  )) });
};
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(CartProvider, {
    children: /* @__PURE__ */ jsxs(NotificationProvider, {
      children: [/* @__PURE__ */ jsx(NotificationDisplay, {}), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col min-h-screen bg-gray-100",
        children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("main", {
          className: "flex-grow",
          children: /* @__PURE__ */ jsx(Outlet, {})
        }), /* @__PURE__ */ jsxs("footer", {
          className: "bg-gray-700 text-white text-center p-4 mt-auto",
          children: ["© ", (/* @__PURE__ */ new Date()).getFullYear(), " My Awesome Shop"]
        })]
      })]
    })
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home
}, Symbol.toStringTag, { value: "Module" }));
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const handleAddToCart = () => {
    addNotification(`${product.name} added to cart!`, "success");
    addToCart(product);
  };
  return /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 shadow-lg bg-white flex flex-col", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2", children: product.name }),
    /* @__PURE__ */ jsxs("p", { className: "text-gray-700 text-lg mb-4", children: [
      "$",
      formatPriceDisplay(product.price)
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleAddToCart(),
        className: "mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150",
        children: "Add to Cart"
      }
    )
  ] });
};
const productsData = [
  {
    id: 1,
    name: "Banany BIO",
    price: {
      main: 3,
      fractional: 49
    }
  },
  {
    id: 2,
    name: "Mleko 3.2%",
    price: {
      main: 2,
      fractional: 89
    }
  },
  {
    id: 3,
    name: "Chleb Żytni",
    price: {
      main: 4,
      fractional: 15
    }
  },
  {
    id: 4,
    name: "Jaja 6 sztuk",
    price: {
      main: 6,
      fractional: 99
    }
  },
  {
    id: 5,
    name: "Łosoś wędzony",
    price: {
      main: 5,
      fractional: 20
    }
  }
];
const ProductListPage = () => {
  const products = productsData;
  return /* @__PURE__ */ jsxs("div", {
    className: "container mx-auto p-4",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-bold mb-6 text-center",
      children: "Products"
    }), /* @__PURE__ */ jsx("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
      children: products.map((product) => /* @__PURE__ */ jsx(ProductCard, {
        product
      }, product.id))
    })]
  });
};
const ProductListPage$1 = withComponentProps(ProductListPage);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductListPage$1
}, Symbol.toStringTag, { value: "Module" }));
const ShoppingCartPage = () => {
  var _a;
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalCost
  } = useCart();
  const {
    addNotification
  } = useNotification();
  if (!(cartItems && cartItems.length > 0)) {
    return /* @__PURE__ */ jsxs("div", {
      className: "container mx-auto p-4 text-center",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold mb-6",
        children: "Shopping Cart"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-xl mb-4",
        children: "Your cart is empty."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/",
        className: "text-blue-500 hover:text-blue-700 underline",
        children: "Continue Shopping"
      })]
    });
  }
  const handleQuantityChange = (item, newQuantity) => {
    const quantity = Math.max(0, newQuantity);
    if (quantity === 0) {
      removeFromCart(item.id);
      addNotification(`successfully removed ${item.name}!`, "success");
    } else {
      if (quantity > item.quantity) addNotification(`added +1 ${item.name} successfully!`, "success");
      else addNotification(`lowered the amount of ${item.name}`, "success");
      updateQuantity(item.id, quantity);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "container mx-auto p-4",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-bold mb-6 text-center",
      children: "Shopping Cart"
    }), /* @__PURE__ */ jsxs("div", {
      className: "bg-white shadow-md rounded-lg p-6",
      children: [cartItems == null ? void 0 : cartItems.map((item) => {
        const itemPriceAsNumber = getPriceAsNumber(item.price);
        const subtotal = itemPriceAsNumber * item.quantity;
        return /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between border-b py-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex items-center w-2/5",
            children: /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-lg font-semibold",
                children: item.name
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-gray-600",
                children: ["$", formatPriceDisplay(item.price), " each"]
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center w-1/5 justify-center",
            children: [/* @__PURE__ */ jsx("button", {
              onClick: () => handleQuantityChange(item, item.quantity - 1),
              className: "bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold p-2 rounded-l h-10 w-10",
              children: "-"
            }), /* @__PURE__ */ jsx("input", {
              type: "number",
              value: item.quantity,
              onChange: (e) => handleQuantityChange(item, parseInt(e.target.value, 10)),
              className: "w-12 text-center border-t border-b h-10",
              min: "0"
            }), /* @__PURE__ */ jsx("button", {
              onClick: () => handleQuantityChange(item, item.quantity + 1),
              className: "bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold p-2 rounded-r h-10 w-10",
              children: "+"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "w-1/5 text-right",
            children: /* @__PURE__ */ jsxs("p", {
              className: "text-lg font-semibold",
              children: ["$", subtotal.toFixed(2)]
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "w-1/5 text-right",
            children: /* @__PURE__ */ jsx("button", {
              onClick: () => handleQuantityChange(item, 0),
              className: "text-red-500 hover:text-red-700 font-semibold",
              children: "Remove"
            })
          })]
        }, item.id);
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-6 pt-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex justify-end items-center",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-xl font-bold",
            children: "Total:"
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-2xl font-bold ml-4",
            children: ["$", (_a = getTotalCost()) == null ? void 0 : _a.toFixed(2)]
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-8 flex justify-between items-center",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/",
          className: "text-blue-500 hover:text-blue-700 underline",
          children: "← Back to Product List"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/order-summary",
          className: "bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150",
          children: "Proceed to Order Summary"
        })]
      })]
    })]
  });
};
const ShoppingCartPage$1 = withComponentProps(ShoppingCartPage);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ShoppingCartPage$1
}, Symbol.toStringTag, { value: "Module" }));
const OrderSummaryPage = () => {
  const {
    cartItems,
    getTotalCost,
    clearCart
  } = useCart();
  useNavigate();
  if (cartItems.length === 0) {
    return /* @__PURE__ */ jsxs("div", {
      className: "container mx-auto p-4 text-center",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold mb-6",
        children: "Order Summary"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-xl mb-4",
        children: "Your cart is empty. Cannot proceed to summary."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/cart",
        className: "text-blue-500 hover:text-blue-700 underline",
        children: "Go to Cart"
      })]
    });
  }
  const handlePlaceOrder = () => {
    const orderDetails = {
      items: cartItems,
      total: getTotalCost(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    localStorage.setItem("finalizedOrder", JSON.stringify(orderDetails));
    clearCart();
    window.location.href = "/order-confirmation";
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "container mx-auto p-4",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-bold mb-6 text-center",
      children: "Order Summary"
    }), /* @__PURE__ */ jsxs("div", {
      className: "bg-white shadow-md rounded-lg p-6",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-2xl font-semibold mb-4",
        children: "Items in your order:"
      }), cartItems.map((item) => {
        const itemPriceAsNumber = getPriceAsNumber(item.price);
        const subtotal = itemPriceAsNumber * item.quantity;
        return /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between items-center border-b py-3",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("h3", {
              className: "text-lg",
              children: [item.name, " (x", item.quantity, ")"]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-gray-600",
              children: ["$", formatPriceDisplay(item.price), " each"]
            })]
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-lg font-semibold",
            children: ["$", subtotal.toFixed(2)]
          })]
        }, item.id);
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-6 pt-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex justify-end items-center",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-xl font-bold",
            children: "Final Total:"
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-2xl font-bold ml-4",
            children: ["$", getTotalCost().toFixed(2)]
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-8 flex justify-between items-center",
        children: [/* @__PURE__ */ jsx(Link, {
          to: "/cart",
          className: "text-blue-500 hover:text-blue-700 underline",
          children: "← Back to Cart"
        }), /* @__PURE__ */ jsx("button", {
          onClick: handlePlaceOrder,
          className: "bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded text-lg transition duration-150",
          children: "Place Order"
        })]
      })]
    })]
  });
};
const OrderSummaryPage$1 = withComponentProps(OrderSummaryPage);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderSummaryPage$1
}, Symbol.toStringTag, { value: "Module" }));
const OrderConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const rawOrderData = localStorage.getItem("finalizedOrder");
    if (rawOrderData) {
      try {
        const parsedOrder = JSON.parse(rawOrderData);
        setOrderDetails(parsedOrder);
      } catch (e) {
        setError("There was an issue retrieving your order details.");
        localStorage.removeItem("finalizedOrder");
      }
    } else {
      setError("No order details found. Your order might have been processed, or you've navigated here directly.");
    }
  }, []);
  if (error) {
    return /* @__PURE__ */ jsxs("div", {
      className: "container mx-auto p-6 text-center",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold text-red-600 mb-4",
        children: "Order Confirmation Issue"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-xl text-white mb-6",
        children: error
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => window.location.href = "/",
        className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 inline-block",
        children: "Back to Product List"
      })]
    });
  }
  if (!orderDetails) {
    return /* @__PURE__ */ jsxs("div", {
      className: "container mx-auto p-6 text-center",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold mb-4",
        children: "Loading Order Confirmation..."
      }), /* @__PURE__ */ jsx("p", {
        children: "If this takes too long, please try returning to the product list."
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => window.location.href = "/",
        className: "mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 inline-block",
        children: "Back to Product List"
      })]
    });
  }
  localStorage.removeItem("finalizedOrder");
  return /* @__PURE__ */ jsxs("div", {
    className: "container mx-auto p-6 bg-white shadow-xl rounded-lg max-w-2xl text-center my-8",
    children: [/* @__PURE__ */ jsx("svg", {
      className: "w-16 h-16 text-green-500 mx-auto mb-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsx("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2",
        d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      })
    }), /* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-bold text-green-600 mb-4",
      children: "Order Placed Successfully!"
    }), /* @__PURE__ */ jsxs("div", {
      className: "text-left my-6",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-xl font-semibold mb-3 border-b pb-2",
        children: "Your Order Summary:"
      }), /* @__PURE__ */ jsx("ul", {
        className: "list-disc list-inside space-y-1 mb-4",
        children: orderDetails.items.map((item) => {
          const itemPriceAsNum = getPriceAsNumber(item.price);
          const subtotal = itemPriceAsNum * item.quantity;
          return /* @__PURE__ */ jsxs("li", {
            className: "py-1",
            children: [item.name, " (x", item.quantity, ") - $", formatPriceDisplay(item.price), " each = ", /* @__PURE__ */ jsxs("span", {
              className: "font-semibold",
              children: ["$", subtotal.toFixed(2)]
            })]
          }, item.id);
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-4 pt-3 border-t",
        children: /* @__PURE__ */ jsxs("p", {
          className: "text-xl font-bold text-right",
          children: ["Total Cost: ", /* @__PURE__ */ jsxs("span", {
            className: "text-green-600",
            children: ["$", orderDetails.total.toFixed(2)]
          })]
        })
      })]
    }), /* @__PURE__ */ jsxs("p", {
      className: "text-lg mb-6",
      children: ["Thank you for your purchase. Order placed at: ", new Date(orderDetails.timestamp).toLocaleString()]
    }), /* @__PURE__ */ jsx("button", {
      onClick: () => window.location.href = "/",
      className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 inline-block",
      children: "Back to Product List"
    })]
  });
};
const OrderConfirmationPage$1 = withComponentProps(OrderConfirmationPage);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderConfirmationPage$1
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/ocado-mini-store-app/assets/entry.client-CyJt58eN.js", "imports": ["/ocado-mini-store-app/assets/chunk-D4RADZKF-5GD_Vqhz.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/ocado-mini-store-app/assets/root-DSKJFFCa.js", "imports": ["/ocado-mini-store-app/assets/chunk-D4RADZKF-5GD_Vqhz.js", "/ocado-mini-store-app/assets/with-props-DVVsAxuH.js"], "css": ["/ocado-mini-store-app/assets/root-B3w_lUMb.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/ocado-mini-store-app/assets/home-DTP-HUkb.js", "imports": ["/ocado-mini-store-app/assets/with-props-DVVsAxuH.js", "/ocado-mini-store-app/assets/chunk-D4RADZKF-5GD_Vqhz.js", "/ocado-mini-store-app/assets/CartContext-Ba5Dub5i.js", "/ocado-mini-store-app/assets/NotificationContext-B_FCBjnG.js", "/ocado-mini-store-app/assets/priceUtils-B0uR9NUr.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/ProductListPage": { "id": "pages/ProductListPage", "parentId": "routes/home", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/ocado-mini-store-app/assets/ProductListPage-Cv-ze6Lz.js", "imports": ["/ocado-mini-store-app/assets/with-props-DVVsAxuH.js", "/ocado-mini-store-app/assets/chunk-D4RADZKF-5GD_Vqhz.js", "/ocado-mini-store-app/assets/CartContext-Ba5Dub5i.js", "/ocado-mini-store-app/assets/priceUtils-B0uR9NUr.js", "/ocado-mini-store-app/assets/NotificationContext-B_FCBjnG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/ShoppingCartPage": { "id": "pages/ShoppingCartPage", "parentId": "routes/home", "path": "cart", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/ocado-mini-store-app/assets/ShoppingCartPage-BYZ8cYq9.js", "imports": ["/ocado-mini-store-app/assets/with-props-DVVsAxuH.js", "/ocado-mini-store-app/assets/chunk-D4RADZKF-5GD_Vqhz.js", "/ocado-mini-store-app/assets/CartContext-Ba5Dub5i.js", "/ocado-mini-store-app/assets/priceUtils-B0uR9NUr.js", "/ocado-mini-store-app/assets/NotificationContext-B_FCBjnG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/OrderSummaryPage": { "id": "pages/OrderSummaryPage", "parentId": "routes/home", "path": "order-summary", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/ocado-mini-store-app/assets/OrderSummaryPage-BH8qiv67.js", "imports": ["/ocado-mini-store-app/assets/with-props-DVVsAxuH.js", "/ocado-mini-store-app/assets/chunk-D4RADZKF-5GD_Vqhz.js", "/ocado-mini-store-app/assets/CartContext-Ba5Dub5i.js", "/ocado-mini-store-app/assets/priceUtils-B0uR9NUr.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/OrderConfirmationPage": { "id": "routes/OrderConfirmationPage", "parentId": "root", "path": "order-confirmation", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/ocado-mini-store-app/assets/OrderConfirmationPage-BiAoTStM.js", "imports": ["/ocado-mini-store-app/assets/with-props-DVVsAxuH.js", "/ocado-mini-store-app/assets/chunk-D4RADZKF-5GD_Vqhz.js", "/ocado-mini-store-app/assets/priceUtils-B0uR9NUr.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/ocado-mini-store-app/assets/manifest-bcca2661.js", "version": "bcca2661", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/ocado-mini-store-app/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "pages/ProductListPage": {
    id: "pages/ProductListPage",
    parentId: "routes/home",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "pages/ShoppingCartPage": {
    id: "pages/ShoppingCartPage",
    parentId: "routes/home",
    path: "cart",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "pages/OrderSummaryPage": {
    id: "pages/OrderSummaryPage",
    parentId: "routes/home",
    path: "order-summary",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/OrderConfirmationPage": {
    id: "routes/OrderConfirmationPage",
    parentId: "root",
    path: "order-confirmation",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
