import { useState } from "react";
import "./header-sale.css";

const SLIDES = [
  {
    title: "Up to 30% Off.",
    linkText: "Shop seasonal picks",
    link: "#",
  },
  {
    title: "Up to 50% Off.",
    linkText: "Discover mid-season sale",
    link: "#",
  },
  {
    title: "Up to 70% Off.",
    linkText: "Shop our latest sale styles",
    link: "#",
  },
];

export default function HeaderSale() {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex(i => (i === 0 ? SLIDES.length - 1 : i - 1));

  const next = () =>
    setIndex(i => (i === SLIDES.length - 1 ? 0 : i + 1));

  return (
    <div className="sale-strip">
      <div className="container sale-strip-content">
        {/* LEFT ARROW */}
        <button className="strip-arrow" onClick={prev}>
          ‹
        </button>

        {/* FIXED TEXT AREA */}
        <div className="sale-text-wrapper">
          <p className="sale-text">
            <strong>{SLIDES[index].title}</strong>{" "}
            <a href={SLIDES[index].link}>
              {SLIDES[index].linkText}
            </a>
          </p>
        </div>

        {/* RIGHT ARROW */}
        <button className="strip-arrow" onClick={next}>
          ›
        </button>
      </div>
    </div>
  );
}
