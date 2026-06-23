import styled from "styled-components";


export const LoginStyle = styled.div`
  .login-section {
    height: calc(100vh - 40px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    width: 100%;
    max-width: 400px;
    padding: 0 20px;
  }

  .login-box {
    width: 100%;
    padding: 40px;
    background: linear-gradient(to top, #fff 0%, #fff 100%);
    box-sizing: border-box;
    box-shadow: 0 5px 10px rgba(10, 10, 10, 0.2);
    border-radius: 10px;
  }

  .login-box h2 {
    margin: 0 0 30px;
    padding: 0;
    color: var(--color-primary);
    text-align: center;
    font-size: 1.8rem;
  }

  .user-box {
    position: relative;
    margin-bottom: 20px;
  }

  .user-box input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: var(--color-primary);
    margin-bottom: 10px;
    border: none;
    border-bottom: 1px solid var(--color-primary);
    outline: none;
    background: transparent;
  }

  .user-box label {
    position: absolute;
    top: 10px;
    left: 0;
    font-size: 16px;
    color: var(--text-color);
    pointer-events: none;
    transition: 0.5s;
  }

  .user-box input:focus ~ label,
  .user-box input:valid ~ label {
    top: -20px;
    color: var(--bg-color);
    font-size: 12px;
  }

  .form-button {
    text-align: center;
  }
`;

const Button = styled.button`
  background-color: var(--color-primary);
  color: var(--bg-theme);
  padding: 10px 30px;
  width: 100%;
  border: none;
  border-radius: 4px;
  /* margin: 1rem 0; */
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0px 0.1em 0px 0.5px rgba(178, 186, 194, 0.9) inset;
`;

export const LoginCard = styled.div`
  .card {
    background: linear-gradient(145deg, #f3f3f3, #e5e5e5); 
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 40px;
    max-width: 400px;
    margin: auto;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .card:hover {
    transform: translateY(-10px); 
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
  }`