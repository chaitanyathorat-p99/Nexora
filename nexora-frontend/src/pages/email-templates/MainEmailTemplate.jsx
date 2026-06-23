import React from "react";
import { useParams } from "react-router-dom";
import { useGetEmailTemplateQuery } from "../../features/allApi";
import LoadingHV from "../../atoms/loading/LoadingHV";
import CreateEmailTemplate from "./CreateEmailTemplate";


const MainEmailTemplate = () => {
  const { id } = useParams();

  console.log(id)
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetEmailTemplateQuery(id);

  console.log(data)

  // If there is an ID and data is still loading or fetching, show loading indicator
  if (id && (isLoading || fetch)) {
    return <LoadingHV />;
  }

  // If there is an ID and no data, it means template was not found
  if (id && !data) {
    // Optionally, you can display an error message or redirect
    return <div>Template not found</div>;
  }

  // Pass the fetched data (or undefined for creation) to CreateEmailTemplate
  return <CreateEmailTemplate formValue={data} />;
};

export default MainEmailTemplate; 