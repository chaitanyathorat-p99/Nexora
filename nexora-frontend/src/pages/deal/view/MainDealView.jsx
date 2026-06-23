import React from "react";
import { useGetDealDetailsQuery } from "../../../features/allApi";
import { useParams } from "react-router-dom";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import DealView from "./DealView";

const MainDealView = ({ deal_id, dealData ,popUp}) => {
  const { id } = useParams();
  
  // Call the hook only if dealData is not present
  const {
    data: apiData,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetDealDetailsQuery(
    { _id: deal_id?._id ? deal_id?._id : id }, 
    { skip: popUp } // Skip the query if dealData exists
  );

  const data = dealData || apiData; // Use dealData if available, otherwise use the API response

  return (
    <>
      {data?._id ? (
        <>
          <DealView deal={data} />
          {/* <OverviewComponent/> */}
        </>
      ) : (
        <LoadingHV />
      )}
    </>
  );
};

export default MainDealView;
