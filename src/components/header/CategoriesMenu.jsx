import "./categories-menu.css";
import { useNavigate } from "react-router-dom";

export default function CategoriesMenu({ data, onCategoryClick }) {
  const navigate = useNavigate();

  if (!data) return null;

  // Функция для преобразования названия категории в URL
  const getCategoryUrl = (categoryName) => {
    // Убираем символы и преобразуем в нижний регистр с дефисами
    return categoryName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and');
  };

  const handleCategoryClick = (categoryName, e) => {
    e.preventDefault();
    
    // Закрываем меню
    onCategoryClick();
    
    // Переходим на страницу категории
    const urlSlug = getCategoryUrl(categoryName);
    navigate(`/category/${urlSlug}`);
  };

  return (
    <div className="mega-menu-dropdown">
      <div className="container mega-menu-content">
        {data.map((col, idx) => (
          <div className="menu-column" key={idx}>
            <p className="column-title">{col.title}</p>

            <ul className="column-list">
              {col.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={`/category/${getCategoryUrl(link)}`}
                    className={
                      link.toLowerCase().includes("sale")
                        ? "sale-highlight"
                        : ""
                    }
                    onClick={(e) => handleCategoryClick(link, e)}
                  >
                    {link}
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