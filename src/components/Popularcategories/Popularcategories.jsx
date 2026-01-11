import React from 'react'
import tops from "../../assets/tops.png"
import tshirts from "../../assets/t-shirts.png"
import caps from "../../assets/caps.png"
import sandals from "../../assets/sandals.png"
import jackets from "../../assets/jackets.png"
import coats from "../../assets/coats.png"
import './Popularcategories.css'

function Popularcategories() {
  const categories = [
    { id: 1, image: tops },
    { id: 2, image: tshirts },
    { id: 3, image: caps },
    { id: 4, image: sandals },
    { id: 5, image: jackets },
    { id: 6, image: coats }
  ];

  return (
    <div className='popular-categories'>
      <h2 className='section-title'>Popular categories</h2>
      <div className='categories-grid'>
        {categories.map((category) => (
          <div key={category.id} className='category-item'>
            <img src={category.image} alt="" className='category-img' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Popularcategories