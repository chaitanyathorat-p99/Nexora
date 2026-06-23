import React from "react";
import CreateCompany from "./CreateCompany";
import CrossButton from "../../../../../atoms/button/CrossButton";
import { useSelector } from "react-redux";
import { useGetCompanyQuery } from "../../../../../features/allApi";
import LoadingHV from "../../../../../atoms/loading/LoadingHV";
import CustomModel from "../../../../../atoms/model/CustomModel";

const MainCompany = ({ performCancel, lead, getdata }) => {
  const {
    data: company,
    isLoading: company_isLoading,
    isFetching: company_fetch,
  } = useGetCompanyQuery({ _id: getdata });
  return (

      <CustomModel performCancel={performCancel} fetch={company_fetch}>
        <CreateCompany
          formValue={company}
          performCancel={performCancel}
          lead={lead}
        />
      </CustomModel>
  );
};

export default MainCompany;
