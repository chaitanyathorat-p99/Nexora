import React from "react";
import MainDynamicField from "./MainDynamicField";
import { useParams } from "react-router-dom";
import { useGetDynamicFieldQuery } from "../../../features/allApi";
import LoadingHV from "../../../atoms/loading/LoadingHV";

const CreateDynamicField = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetDynamicFieldQuery({ _id: id }, { skip: !id });

  if (isLoading) return <LoadingHV />;

  return <MainDynamicField formValue={data} />;
};

export default CreateDynamicField; 