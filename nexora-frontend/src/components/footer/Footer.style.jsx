import styled from "styled-components";

export const FooterStyles = styled.div`
  z-index: 10;
  background: var(--color-primary);
  img {
    max-width: 100%;
    height: auto;
  }
  section {
    padding: 30px 0 20px;
    /* min-height: 100vh;*/
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .contact-area {
    border-bottom: 1px solid #21252c;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* .contact-quote{
    padding: .5rem 0;
    color: var(--text-light);
    p{
    }
  } */
  .contact-content {
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    place-items: center;
    justify-content: center;
    justify-items: center;
    align-items: center;
    /* width: 90vw; */
    color:white;

    .footer-content-i {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      text-align: center;

      h1 {
        color: var(--text-light);
        font-size: 2rem;
        font-weight: bold;
      }
      .contact-quote {
        font-size: 1.4rem;
        color: var(--text-light);
      }
    }
  }
.footer-content-i a{
  background-color: var(--bgcolor);
  padding: 0.5rem;
  align-items: center;
}
  .contact-content p {
    color: var(--text-light);
    font-size: 15px;
    margin: 10px 0 10px;
    position: relative;
  }



  .contact-content h6 {
    color: var(--text-light);
    font-size: 15px;
    font-weight: 400;
    margin-bottom: 10px;
    
  }

  .contact-content span {
    color: #353c47;
    margin: 0 10px;
  }

  .contact-social {
    margin-top: 30px;
  }

  .contact-social > ul {
    display: inline-flex;
  }

  .contact-social ul li a {
    border: 1px solid #8b9199;
    color: #8b9199;
    display: inline-block;
    height: 40px;
    margin: 0 10px;
    padding-top: 7px;
    transition: all 0.4s ease 0s;
    width: 40px;
  }

  .contact-social ul li a:hover {
    border: 1px solid #fab702;
    color: #fab702;
  }

  .contact-content img {
    max-width: 210px;
  }

  section,
  footer {
    background: var(--dark-web-color);
    color: #868c96;
    text-align: center; 
  }

  footer p {
    padding: 20px 0;
    text-align: center;
  }

  footer img {
    width: 44px;
  }
  @media screen and (max-width: 768px) {
    .contact-content {
      text-align: center;
      display: grid;
      grid-template-columns: 1fr;
      place-items: center;
      justify-content: center;
      justify-items: center;
      align-items: center;
      color:white;
      /* width: 90vw; */
      .footer-content-i {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
    }
  }
`;
