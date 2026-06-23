import React, { useRef } from 'react';
import styled from 'styled-components';
import { useReactToPrint } from 'react-to-print';
import { FinalTotal, FinalTotalDiscount, IDateOnly, SavedPriceWithOutIndex, SubTotalWithOutIndex } from '../../../atoms/State';
import { ToWords } from "to-words";
import ProductTable from '../../../components/tables/ProductTable';
import { Field } from 'formik';
import SignatureBox from './SignatureBox';
import Logo from './../../../assets/sign.png'

const DisplayHTMLContent = ({ htmlContent }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};
// Styled components
const QuoteContainer = styled.div`
  /* width: 800px; */
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media print {
    width: 100%;
    margin: 0;
    padding: 20px;
    box-shadow: none;
    border-radius: 0;
  }
`;



const QuoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;


`;

const QuoteNumber = styled.div`
  flex: 1;
`;

const QuoteTitle = styled.div`
  flex: 1;

  h1 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const QuoteDate = styled.div`
  flex: 1;
  text-align: right;


`;

const CompanyLogo = styled.div`
  text-align: right;

  img {
    max-width: 150px;
  }

  @media print {
    text-align: left;
    margin-top: 10px;
  }
`;

const BillingInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;


`;

const BillFrom = styled.div`
  width: 45%;

  h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }


`;

const BillTo = styled.div`
  width: 45%;

  h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }


`;



const TotalAmount = styled.div`
  text-align: right;
  margin-bottom: 20px;
  font-weight: bold;


`;

const NotesSection = styled.div`
  margin-bottom: 20px;
`;

const SignatureSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;

`;

const Signature = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  p {
    margin: 0;
  }


`;



// Other styled components remain unchanged...

const PrintButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }

  @media print {
    display: none;
  }
`;

// React Component
const View = ({ data }) => {
  const quoteRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => quoteRef.current,
  });
  const toWords = new ToWords();

  const formValue = data;
  return (
    <div>
      <QuoteContainer ref={quoteRef}>
        <QuoteHeader>
          <QuoteNumber>#101</QuoteNumber>
          <QuoteTitle>
            <h1>Quote</h1>
            <p>{formValue?.title}</p>
          </QuoteTitle>
          <QuoteDate>
            <p>Date issued: {IDateOnly(formValue?.createdAt)}</p>
          </QuoteDate>
        </QuoteHeader>

        <BillingInfo>
          <BillFrom>
            <h3>Bill from:</h3>
            <p>{formValue?.companyMaster?.name ? formValue?.companyMaster?.name : "Nexora"}</p>
            <p>Pune</p>
            <p>India</p>
            <p>{formValue?.createdBy?.email}</p>
            <p>9890909090</p>
          </BillFrom>
          <BillTo>
            <h3>Bill to:</h3>
            <p>{formValue?.lead?.firstName} {formValue?.lead?.lastName}</p>
            <p>{formValue?.lead?.info?.address}</p>
            <p>{formValue?.lead?.info?.mobile}</p>
            <p>{formValue?.lead?.email}</p>
          </BillTo>
        </BillingInfo>

        <ProductTable formValue={formValue} />



        <NotesSection>
          <h4>Note</h4>
          <DisplayHTMLContent htmlContent={formValue?.scope} />
        </NotesSection>
        <NotesSection>
          <h4>Terms And Condition</h4>
          <DisplayHTMLContent htmlContent={formValue?.termsAndCondition} />
        </NotesSection>
        {formValue?.termsAndConditionCheck &&
          <SignatureSection>
            <Signature>
              <p>Signature</p>
              <img src={Logo} style={{ width: "100px" }} />

            </Signature>
            <Signature>
              <p>Date</p>
              <p>__________________________</p>
            </Signature>
            <Signature>
              <p>Name</p>
              <p>__________________________</p>
            </Signature>
          </SignatureSection>

        }

      </QuoteContainer>
      {!formValue?.termsAndConditionCheck &&

        <SignatureBox formValue={formValue} />
      }
      <PrintButton onClick={handlePrint}>Print Quote</PrintButton>
    </div>
  );
};

export default View;
