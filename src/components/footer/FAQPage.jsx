import { useState } from "react";
import "./Faqpage.css";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Select the products, add them to your cart, go to the cart and click 'Checkout'. Fill in the delivery details and choose a payment method."
    },
    {
      question: "What delivery methods are available?",
      answer: "We offer courier delivery within the city, delivery to pickup points, and postal delivery throughout the country."
    },
    {
      question: "How much is delivery?",
      answer: "Delivery is free for orders over $50. For smaller amounts, the delivery cost is calculated individually based on the address."
    },
    {
      question: "How can I track my order?",
      answer: "After your order is shipped, you will receive a tracking number via email. Use it to track your order on the carrier's website."
    },
    {
      question: "How do I return an item?",
      answer: "Items can be returned within 14 days of receipt. The item must be in its original packaging with tags attached."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bank cards (Visa, Mastercard), Apple Pay, Google Pay, and cash on delivery."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Here you'll find answers to the most common questions about our store</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button 
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-contact">
        <h3>Didn't find the answer to your question?</h3>
        <p>Contact our support team:</p>
        <div className="contact-options">
          <a href="https://wa.me/996225325666" target="_blank" rel="noopener noreferrer" className="contact-btn phone">
            📞 (225) 325 666 (WhatsApp)
          </a>
          <a href="mailto:stargoe8@gmail.com" className="contact-btn email">
            ✉️ stargoe8@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}