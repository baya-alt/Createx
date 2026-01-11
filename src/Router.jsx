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
// import Orders from "./components/orders/Orders"; // Закомментируйте если нет компонента

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
      
      // ✅ ДОБАВЛЯЕМ МАРШРУТ ДЛЯ РАСПРОДАЖИ
      { path: "sale", element: <Salemin /> }
      
      // ❌ УБИРАЕМ Orders если компонента нет
      // { path: "orders", element: <Orders /> }
    ]
  }
]);