import React from "react";
import { Link } from "react-router-dom";
import { FooterStyles } from "./Footer.style";


const Footer = () => {
  return (
    <>
      <FooterStyles>
        <section className="contact-area" id="contact">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 offset-lg-3">
                <div className="contact-content text-center">
                  <div className="footer-content-i">
                    <h6>Nexora</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer style={{color:"white"}}>
          <p>Copyright &copy; 2024 Nexora, All Rights Reserved.</p>
        </footer>
      </FooterStyles>
    </>
  );
};

export default Footer;
