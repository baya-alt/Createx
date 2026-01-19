import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/home/Home";

import Women from "./components/women/Women";
import Men from "./components/men/Men";
import Kids from "./components/kids/Kids";

import ProductPage from "./components/women/ProductPage";
import MenProductPage from "./components/men/MenProductPage";
import KidsProductPage from "./components/kids/KidsProductPage";

import Salemin from "./components/salemin/Salemin";
import Checkout from "./components/korzina/Checkout";

import SearchResults from "./components/header/SearchResults";
import DeliveryPage from "./components/enjoy/DeliveryPage";
import OrdersPage from "./components/header/OrdersPage";
import BlogPage from "./components/Fashionblog/BlogPage";
import ContactsPage from "./components/footer/ContactsPage";
import FAQPage from "./components/footer/FAQPage"; // ДОБАВЛЕНО

export const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: "women", element: <Women /> },
      { path: "product/:id", element: <ProductPage /> },

      { path: "men", element: <Men /> },
      { path: "men/product/:id", element: <MenProductPage /> },

      { path: "kids", element: <Kids /> },
      { path: "kids/product/:id", element: <KidsProductPage /> },

      { path: "sale", element: <Salemin /> },

      { path: "checkout", element: <Checkout /> },

      { path: "search", element: <SearchResults /> },
      { path: "delivery", element: <DeliveryPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "contacts", element: <ContactsPage /> },
      { path: "faq", element: <FAQPage /> } // ДОБАВЛЕНО
    ]
  }
]);