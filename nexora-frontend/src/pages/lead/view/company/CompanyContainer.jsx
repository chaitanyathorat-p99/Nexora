import React, { useState } from "react";
import { CompanyCard } from "./CompanyCard";
import { PlusOutlined } from "@ant-design/icons";
import MainCompany from "./form/MainCompany";
import { useFetchCompanyQuery } from "../../../../features/allApi";
import LoadingHV from "../../../../atoms/loading/LoadingHV";

const CompanyContainer = ({ lead }) => {
  const [createCompany, setCreateCompany] = useState(false);
  const [getdata, setGetdata] = useState();
  const handleEdit = (data) => {setGetdata(data)
setCreateCompany(true)

  };
  const {
    data: company,
    isLoading: company_isLoading,
    isFetching: company_fetch,
  } = useFetchCompanyQuery({ lead: lead?._id });
  const performCancel = () => {
    setCreateCompany(false);
    setGetdata();
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {company_isLoading ? (
        <LoadingHV />
      ) : (
        <>
          {company?.map((item) => (
            <CompanyCard company={item} handleEdit={handleEdit} />
          ))}
        </>
      )}

      <div
        style={{
          border: "1px dotted #ddd",
          borderRadius: "8px",
          padding: "20px",
          height: "380px",

          width: "400px",
          margin: "20px auto",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setCreateCompany(true)}
      >
        <PlusOutlined style={{ fontSize: "40px" }} />
      </div>
      {createCompany && <MainCompany lead={lead} performCancel={performCancel} getdata={getdata}/>}
    </div>
  );
};

export default CompanyContainer;
