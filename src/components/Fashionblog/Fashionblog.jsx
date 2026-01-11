import React from 'react'
import './Fashionblog.css'
import blog1 from '../../assets/blog1.png'
import blog2 from '../../assets/blog2.png'

import part1 from '../../assets/part1.png'
import part2 from '../../assets/part2.png'
import part3 from '../../assets/part3.png'
import part4 from '../../assets/part4.png'
import part5 from '../../assets/part5.png'
import part6 from '../../assets/part6.png'

function Fashionblog() {
  return (
    <section className="fashionblog">
      <div className="fashionblog-header">
        <h2>Fashion blog</h2>
        <button className="view-blog-btn">View blog</button>
      </div>

      <div className="fashionblog-grid">
        <div className="blog-card">
          <img src={blog1} alt="Bag trends" />
          <div className="blog-content">
            <h3>Bag Trends for Summer 2020</h3>
            <p className="meta">Fashion · August 24, 2020 · 0 comments</p>
            <p className="excerpt">
              Ipsum aliquet nisi, hendrerit rhoncus quam tortor, maecenas faucibus.
              Tincidunt aliquet sit vel, venenatis nulla. Integer bibendum turpis convallis...
            </p>
          </div>
        </div>

        <div className="blog-card">
          <img src={blog2} alt="Sneakers trends" />
          <div className="blog-content">
            <h3>Top 10 of This Season’s Hottest Sneakers</h3>
            <p className="meta">Lifestyle · July 16, 2020 · 4 comments</p>
            <p className="excerpt">
              Porta habitant vitae quam interdum. Leo viverra non volutpat rhoncus placerat
              vitae scelerisque. Rhoncus augue faucibus maecenas lacus...
            </p>
          </div>
        </div>
      </div>

      <div className="partners">
        <img src={part1} alt="Partner 1" />
        <img src={part2} alt="Partner 2" />
        <img src={part3} alt="Partner 3" />
        <img src={part4} alt="Partner 4" />
        <img src={part5} alt="Partner 5" />
        <img src={part6} alt="Partner 6" />
      </div>
    </section>
  )
}

export default Fashionblog
