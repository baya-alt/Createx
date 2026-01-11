import React from 'react'
import { FiInstagram } from 'react-icons/fi'
import foll1 from '../../assets/foll1.png'
import foll2 from '../../assets/foll2.png'
import foll3 from '../../assets/foll3.png'
import './Insta.css'
import Fashionblog from '../Fashionblog/Fashionblog'

function Insta() {
  return (
    <section className="insta">
      <div className="insta-left">
        <p className="insta-label">FOLLOW US ON INSTAGRAM</p>
        <h2 className="insta-title">@createx_store</h2>

        <a href="https://instagram.com/createx_store" className="insta-btn">
          <FiInstagram size={18} /> Follow Instagram
        </a>
      </div>

      <div className="insta-gallery">
        <img src={foll1} alt="Instagram post 1" />
        <img src={foll2} alt="Instagram post 2" />
        <img src={foll3} alt="Instagram post 3" />
      </div>
      {/* <Fashionblog/> */}
    </section>
  )
}

export default Insta
