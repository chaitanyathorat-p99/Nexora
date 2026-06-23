import React from "react";
import LeadView from "./LeadView";
import { useGetLeadDetailsQuery } from "../../../features/allApi";
import { useParams } from "react-router-dom";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import CRMOverview from "./CrmOverView";
import OverviewComponent from "./OverviewComponent";

const MainLeadView = () => {
  const { id } = useParams();

  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetLeadDetailsQuery({ _id: id });
  return (
    <>
      {data ? (
        <>
          <CRMOverview lead={data}/>
          <LeadView lead={data} />
          {/* <OverviewComponent/> */}
        </>
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default MainLeadView;
