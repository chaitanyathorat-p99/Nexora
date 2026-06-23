import React from "react";
import CreateUsers from "./CreateUsers";
import Register from "../../register/Register";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../../../features/allApi";
import LoadingHV from "../../../atoms/loading/LoadingHV";

const MainUsers = ({ type }) => {
  const { id } = useParams();
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetUserQuery({ _id: id });
  return (
    <div>
      {/* <CreateUsers type={type}/> */}
      {fetch ? <LoadingHV /> : <Register formData={data?.data} type={type} />}
    </div>
  );
};

export default MainUsers;
