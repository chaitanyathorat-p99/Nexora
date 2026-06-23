import React from "react";
import CreateLead from "./CreateLead";
import { useFetchLeadStatusQuery, useGetLeadQuery } from "../../../features/allApi";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import { useParams } from "react-router-dom";

const MainLead = () => {
  const {id}=useParams()
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetLeadQuery({_id:id});

  return <div>{fetch ? <LoadingHV /> : <CreateLead  formValue={data}/>}</div>;
};

export default MainLead;
