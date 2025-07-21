import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets.js";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-context">
        <div className="footer-context-left">
          <img src={assets.logo} />
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
            animi tenetur earum soluta aliquam accusamus totam! Labore
            consectetur sequi dolorum nostrum blanditiis similique nesciunt?
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} />
            <img src={assets.twitter_icon} />
            <img src={assets.linkedin_icon} />
          </div>
        </div>
        <div className="footer-context-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-context-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-212-456-885</li>
            <li>Contact@tomoto@gmail.com </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        copyright 2025 @ Tomato.com- All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
