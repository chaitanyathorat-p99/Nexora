import React from "react";
import styled from "styled-components";
import { FinalTotal, FinalTotalDiscount, SimpleSubTotal } from "../../atoms/State";
import { ToWords } from "to-words";

const QuoteTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid var(--color-primary);
    padding: 5px;
    text-align: center;
  }

  th {
    background-color: var(--color-primary);
    color: white;
  }

  th:first-child,
  td:first-child {
    width: 80px;
  }

  @media print {
    page-break-inside: avoid; /* Prevent table from breaking inside rows */
    /* margin-bottom: 2rem; Add spacing for footer */
  }
`;

const TotalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  display: flex;
  justify-content: flex-end;

  th,
  td {
    border: 1px solid var(--color-primary);
    padding: 5px;
    text-align: center;
    font-weight: bold;
  }

  th {
    width: 168px;
  }

  td {
    width: 168px;
  }

  @media print {
    page-break-inside: avoid;
  }
`;

const AmountInWords = styled.div`
  font-size: 20px;
  text-align: start;
  margin-top: 10px;

  @media print {
    page-break-inside: avoid;
  }
`;

const ProductTable = ({ formValue }) => {
  const toWords = new ToWords();
  const hasDiscount = formValue?.product?.some((item) => item.discount > 0);

  return (
    <>
      <QuoteTable>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Item</th>
            <th>Quantity</th>
            {hasDiscount && <th>Discount %</th>}
            <th>₹ Price</th>
            <th>₹ Total</th>
          </tr>
        </thead>
        <tbody>
          {formValue?.product?.map((item, index) => (
            <tr key={item?._id}>
              <td>{index + 1}</td>
              <td>{item?.name}</td>
              <td>{item?.quantity || 1}</td>
              {hasDiscount && <td>{item?.discount || 0}</td>}
              <td>{item?.price}</td>
              <td>{SimpleSubTotal(item?.price, item?.discount, item?.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </QuoteTable>

      <TotalTable>
        <tbody>
          <tr>
            <th>Sub Total:</th>
            <td>
              ₹{" "}
              {FinalTotal(formValue?.product) -
                FinalTotalDiscount(formValue?.product, 0)}
            </td>
          </tr>

          {formValue?.discount !== 0 && (
            <>
              <tr>
                <th>Extra Discount:</th>
                <td>{formValue?.discount}%</td>
              </tr>
              <tr>
                <th>Final Total Discount:</th>
                <td>
                  ₹{" "}
                  {FinalTotalDiscount(formValue?.product, formValue?.discount)}
                </td>
              </tr>
            </>
          )}

          <tr>
            <th>Total:</th>
            <td>
              ₹{" "}
              {FinalTotal(formValue?.product) -
                FinalTotalDiscount(formValue?.product, formValue?.discount || 0)}
            </td>
          </tr>
        </tbody>
      </TotalTable>

      <AmountInWords>
        <b>
          Amount In Words:{" "}
          {toWords.convert(
            Math.round(
              FinalTotal(formValue?.product) -
              FinalTotalDiscount(formValue?.product, formValue?.discount || 0)
            )
          )}{" "}
          Rupees ONLY
        </b>
      </AmountInWords>
    </>
  );
};

export default ProductTable;
