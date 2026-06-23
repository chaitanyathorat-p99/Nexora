import React from "react";
import { useParams } from "react-router-dom";
import { useGetPlanQuery } from "../../../features/allApi";
import LoadingHV from '../../../atoms/loading/LoadingHV';
import PlanForm from "./PlanForm";

const MainPlan = () => {
  const { id } = useParams();

  const { data: planResponse, isLoading, error } = useGetPlanQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return <LoadingHV />;
  }

  if (error) {
    console.error("Error fetching plan:", error);
  }

  return <PlanForm formValue={planResponse?.data} />;
};

export default MainPlan; 