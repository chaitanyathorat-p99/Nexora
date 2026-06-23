import { Form } from "formik";
import styled from "styled-components";

export const CreateFormCard = styled.div`
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 6px 18px rgba(12, 20, 40, 0.06);
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
`;

export const CreateFormForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  position: relative;
  min-height: calc(100vh - 220px);

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  label {
    display: block;
    font-size: 0.9rem;
    color: #2b2b2b;
    margin-bottom: 0.35rem;
    font-weight: 600;
  }

  input[type="text"],
  input[type="email"],
  input[type="number"],
  input[type="tel"],
  input[type="url"],
  input[type="date"],
  input[type="time"],
  textarea,
  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    font-size: 0.95rem;
    color: #111827;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    box-sizing: border-box;
  }

  textarea {
    min-height: 88px;
    resize: vertical;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #0b6bf4;
    box-shadow: 0 0 0 3px rgba(11, 107, 244, 0.08);
  }

  & > div.col-span-2 {
    grid-column: 1 / -1;
  }

  .field-error {
    color: #e11d48;
    font-size: 0.85rem;
    margin-top: 0.35rem;
  }
`;

export const CreateFormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
`;

export const CreateInlineActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #0b6bf4;
  color: white;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;

  &:hover {
    background-color: #085acb;
  }
`;