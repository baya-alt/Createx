import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (key) => key
});

const translations = {
  en: {
    headerTop: {
      delivery: "Delivery",
      trackOrder: "Track order",
      blog: "Blog",
      contacts: "Contacts",
      login: "Log in / Register",
      profile: "Profile",
      logout: "Log out"
    },
    headerMain: {
      women: "Women",
      men: "Men",
      girls: "Girls",
      boys: "Boys",
      sale: "Sale",
      searchPlaceholder: "Search for products...",
      products: "Products",
      found: "found",
      suggestions: "Suggestions",
      recentSearches: "Recent Searches",
      clear: "Clear",
      clearAll: "Clear all",
      popularCategories: "Popular Categories",
      noProductsFoundPrefix: "No products found for",
      tryDifferentKeywords: "Try different keywords",
      inPrefix: "in"
    },
    footer: {
      help: "HELP",
      shop: "SHOP",
      getInTouch: "GET IN TOUCH",
      downloadApp: "DOWNLOAD OUR APP",
      deliveryReturns: "Delivery & returns",
      faq: "FAQ",
      trackOrder: "Track order",
      contacts: "Contacts",
      blog: "Blog",
      women: "Women",
      men: "Men",
      sales: "Sales",
      kids: "Kids",
      call: "Call",
      email: "Email",
      rights: "© All rights reserved. Made with by Createx Studio",
      goTop: "Go to top"
    },
    headerSale: {
      upTo30: "Up to 30% Off.",
      upTo50: "Up to 50% Off.",
      upTo70: "Up to 70% Off.",
      seasonal: "Shop seasonal picks",
      midseason: "Discover mid-season sale",
      latest: "Shop our latest sale styles"
    },
    productTabs: {
      generalInfo: "General info",
      productDetails: "Product details",
      reviews: "Reviews"
    }
  },
  ru: {
    headerTop: {
      delivery: "Доставка",
      trackOrder: "Отследить заказ",
      blog: "Блог",
      contacts: "Контакты",
      login: "Войти / Регистрация",
      profile: "Профиль",
      logout: "Выйти"
    },
    headerMain: {
      women: "Женщинам",
      men: "Мужчинам",
      girls: "Девочкам",
      boys: "Мальчикам",
      sale: "Скидки",
      searchPlaceholder: "Поиск товаров...",
      products: "Товары",
      found: "найдено",
      suggestions: "Подсказки",
      recentSearches: "Недавние запросы",
      clear: "Очистить",
      clearAll: "Очистить всё",
      popularCategories: "Популярные категории",
      noProductsFoundPrefix: "Ничего не найдено по запросу",
      tryDifferentKeywords: "Попробуйте другие слова",
      inPrefix: "в"
    },
    footer: {
      help: "ПОМОЩЬ",
      shop: "МАГАЗИН",
      getInTouch: "СВЯЗАТЬСЯ",
      downloadApp: "СКАЧАТЬ ПРИЛОЖЕНИЕ",
      deliveryReturns: "Доставка и возврат",
      faq: "FAQ",
      trackOrder: "Отследить заказ",
      contacts: "Контакты",
      blog: "Блог",
      women: "Женщинам",
      men: "Мужчинам",
      sales: "Скидки",
      kids: "Детям",
      call: "Телефон",
      email: "Email",
      rights: "© Все права защищены. Сделано в Createx Studio",
      goTop: "Наверх"
    },
    headerSale: {
      upTo30: "Скидки до 30%.",
      upTo50: "Скидки до 50%.",
      upTo70: "Скидки до 70%.",
      seasonal: "Сезонные подборки",
      midseason: "Межсезонная распродажа",
      latest: "Новые товары со скидкой"
    },
    productTabs: {
      generalInfo: "Общее",
      productDetails: "Детали товара",
      reviews: "Отзывы"
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (next) => {
    setLangState(next);
    document.documentElement.lang = next;
  };

  const t = (key) => {
    const parts = key.split(".");
    let current = translations[lang] || {};
    for (const part of parts) {
      current = current?.[part];
      if (current === undefined) return key;
    }
    return typeof current === "string" ? current : key;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
