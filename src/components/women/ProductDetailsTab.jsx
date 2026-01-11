// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ProductDetails from "./ProductDetails";

// export default function ProductDetailsTab() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`https://691bbd103aaeed735c8e1d0d.mockapi.io/my/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProduct(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Ошибка:", err);
//         setLoading(false);
//       });
//   }, [id]);

//   return (
//     <div style={{
//       backgroundColor: "#f9f9f9",
//       minHeight: "100vh",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       padding: "20px"
//     }}>
//       {loading ? (
//         <p>Загрузка...</p>
//       ) : (
//         product && <ProductDetails product={product} />
//       )}
//     </div>
//   );
// }