import React from 'react';
import CustomModel from '../../../atoms/model/CustomModel';
import QuotationDetailView from '../../quotation.jsx/view/QuotationDetailView';

const QuotationPopUpView = ({  performCancel, quotationData }) => {

    // console.log("QuotationData", quotationData);
    return (
        <>
            <CustomModel
                width={"80vw"}
                height={"80vh"}
                performCancel={performCancel}
                fetch={false}
            >
                <QuotationDetailView  performCancel={performCancel} quotationData={quotationData}/>
            </CustomModel>
        </>
    );
};

export default QuotationPopUpView;