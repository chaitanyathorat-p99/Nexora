import React from 'react';
import CustomModel from '../../../atoms/model/CustomModel';
import MainDealView from '../../deal/view/MainDealView';

const DealPopUpView = ({ performCancel, dealData }) => {

    
    return (
        <>
            <CustomModel
                width={"80vw"}
                height={"80vh"}
                performCancel={performCancel}
                fetch={false}
            >
                <MainDealView performCancel={performCancel} dealData={dealData} popUp={true}/>
            </CustomModel>
        </>
    );
};

export default DealPopUpView;