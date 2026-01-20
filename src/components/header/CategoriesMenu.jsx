import "./categories-menu.css";
import { useNavigate } from "react-router-dom";

export default function CategoriesMenu({ data, onCategoryClick }) {
  const navigate = useNavigate();

  if (!data) return null;

  const handleCategoryClick = (path, e) => {
    e.preventDefault();

    // закрываем меню
    onCategoryClick?.();

    // переход по готовому path
    navigate(path);
  };

  return (
    <div className="mega-menu-dropdown">
      <div className="container mega-menu-content">
        {data.map((col, idx) => (
          <div className="menu-column" key={idx}>
            <p className="column-title">{col.title}</p>

            <ul className="column-list">
              {col.links.map((link, i) => (
                <li key={link.path || i}>
                  <a
                    href={link.path}
                    className={
                      link.label.toLowerCase().includes("sale")
                        ? "sale-highlight"
                        : ""
                    }
                    onClick={(e) => handleCategoryClick(link.path, e)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
