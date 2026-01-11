// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import Register from "./Register";
// import Profile from "./Profile";
// import CategoriesMenu from "./CategoriesMenu";
// import { MENU_DATA } from "./СategoriesData";
// import "./header.css";

// // assets
// import loginIcon from "../../assets/login.png";
// import america from "../../assets/america.webp";
// import russia from "../../assets/russia.webp";
// import createxLogo from "../../assets/CREATEX.png";
// import searchIcon from "../../assets/lupa.png";
// import heartIcon from "../../assets/jurok.png";
// import cartIcon from "../../assets/Cart.png";

// export default function Header() {
//   /* ===== LANG ===== */
//   const [lang, setLang] = useState("en");
//   const [openLang, setOpenLang] = useState(false);

//   /* ===== MENU ===== */
//   const [activeMenu, setActiveMenu] = useState(null);

//   /* ===== AUTH ===== */
//   const [showAuth, setShowAuth] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user"))
//   );
//   const [openUserMenu, setOpenUserMenu] = useState(false);
//   const userRef = useRef(null);

//   /* ===== PRODUCTS ===== */
//   const [allProducts, setAllProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedCat, setSelectedCat] = useState("");

//   /* ===== LOAD PRODUCTS ===== */
//   useEffect(() => {
//     fetch("https://691bbd103aaeed735c8e1d0d.mockapi.io/my")
//       .then((res) => res.json())
//       .then(setAllProducts);
//   }, []);

//   /* ===== CATEGORY CLICK ===== */
//   const handleCategoryClick = (categoryName) => {
//     setSelectedCat(categoryName);

//     setFilteredProducts(
//       allProducts.filter(
//         (p) => p.kategory.toLowerCase() === categoryName.toLowerCase()
//       )
//     );

//     setActiveMenu(null);
//   };

//   /* ===== MENU TOGGLE ===== */
//   const toggleMenu = (menu) => {
//     setActiveMenu((prev) => (prev === menu ? null : menu));
//   };

//   /* ===== LOGOUT ===== */
//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     setOpenUserMenu(false);
//     setShowProfile(false);
//   };

//   /* ===== CLOSE USER DROPDOWN ===== */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (userRef.current && !userRef.current.contains(e.target)) {
//         setOpenUserMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <>
//       <header className="header-wrapper">
//         {/* ================= TOP BAR ================= */}
//         <div className="top-bar">
//           <div className="container top-bar-content">
//             <a
//               href="https://wa.me/996225325666"
//               className="availability"
//               target="_blank"
//               rel="noreferrer"
//             >
//               Available 24/7 at <strong>(225) 325 666</strong>
//             </a>

//             <nav className="top-nav">
//               <a href="#">Delivery & returns</a>
//               <a href="#">Track order</a>
//               <a href="#">Blog</a>
//               <a href="#">Contacts</a>
//             </nav>

//             <div className="top-actions">
//               {/* ===== LANGUAGE ===== */}
//               <div
//                 className="lang-wrapper"
//                 tabIndex={0}
//                 onBlur={() => setOpenLang(false)}
//               >
//                 <button
//                   className="lang-btn"
//                   onClick={() => setOpenLang(!openLang)}
//                 >
//                   <img
//                     src={lang === "en" ? america : russia}
//                     alt=""
//                     className="flag-icon"
//                   />
//                   {lang === "en" ? "ENG / $" : "РУС / ₽"}
//                   <span className="arrow-down">▼</span>
//                 </button>

//                 {openLang && (
//                   <div className="lang-dropdown">
//                     <div onMouseDown={() => setLang("en")}>
//                       <img src={america} alt="" /> English / $
//                     </div>
//                     <div onMouseDown={() => setLang("ru")}>
//                       <img src={russia} alt="" /> Русский / ₽
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* ===== USER ===== */}
//               <div className="user-auth" ref={userRef}>
//                 <button
//                   className="login-btn"
//                   onClick={() =>
//                     user
//                       ? setOpenUserMenu((p) => !p)
//                       : setShowAuth(true)
//                   }
//                 >
//                   <img src={loginIcon} alt="" />
//                   {user ? user.name : "Log in / Register"}
//                 </button>

//                 {user && openUserMenu && (
//                   <div className="user-dropdown">
//                     <div
//                       className="user-dropdown-item"
//                       onClick={() => {
//                         setShowProfile(true);
//                         setOpenUserMenu(false);
//                       }}
//                     >
//                       Profile
//                     </div>
//                     <div
//                       className="user-dropdown-item logout"
//                       onClick={logout}
//                     >
//                       Logout
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= MAIN HEADER ================= */}
//         <div className="main-header">
//           <div className="container main-header-content">
//             <a href="/" className="logo">
//               <img src={createxLogo} alt="Createx" />
//             </a>

//             <nav className="main-nav">
//               {["women", "men", "girls", "boys", "sale"].map((item) => (
//                 <a
//                   key={item}
//                   href="#"
//                   className={item === "sale" ? "sale-link" : ""}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toggleMenu(item);
//                   }}
//                 >
//                   {item.charAt(0).toUpperCase() + item.slice(1)}
//                 </a>
//               ))}
//             </nav>

//             <div className="search-box">
//               <input placeholder="Search for products..." />
//               <button>
//                 <img src={searchIcon} alt="" />
//               </button>
//             </div>

//             <div className="user-icons">
//               <button className="icon-btn">
//                 <img src={heartIcon} alt="" />
//                 <span className="counter">0</span>
//               </button>
//               <button className="icon-btn">
//                 <img src={cartIcon} alt="" />
//                 <span className="counter green">0</span>
//               </button>
//             </div>
//           </div>

//           {activeMenu && (
//             <CategoriesMenu
//               data={MENU_DATA[activeMenu]}
//               onCategoryClick={handleCategoryClick}
//             />
//           )}
//         </div>

//         {/* ================= SALE STRIP ================= */}
//         <div className="sale-strip">
//           <div className="container sale-strip-content">
//             <button className="strip-arrow">&lt;</button>
//             <p>
//               <strong>Up to 70% Off.</strong>{" "}
//               <a href="#">Shop our latest sale styles</a>
//             </p>
//             <button className="strip-arrow">&gt;</button>
//           </div>
//         </div>
//       </header>

//       {/* ================= FILTERED PRODUCTS ================= */}
//       {filteredProducts.length > 0 && (
//         <section className="container filtered-results">
//           <div className="results-top">
//             <h2>{selectedCat}</h2>
//             <button
//               className="close-btn"
//               onClick={() => setFilteredProducts([])}
//             >
//               ×
//             </button>
//           </div>

//           <div className="product-grid-main">
//             {filteredProducts.map((item) => (
//               <Link
//                 key={item.id}
//                 to={`/product/${item.id}`}
//                 className="product-item-card"
//               >
//                 <img src={item.avatar} alt={item.name} />
//                 <h3>{item.name}</h3>
//                 <p>{item.price}</p>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* ================= MODALS ================= */}
//       {showAuth && (
//         <Register
//           onClose={() => setShowAuth(false)}
//           onLogin={(u) => setUser(u)}
//         />
//       )}

//       {showProfile && user && (
//         <Profile
//           user={user}
//           onClose={() => setShowProfile(false)}
//           onLogout={logout}
//         />
//       )}
//     </>
//   );
// }
