import React from "react";
import { useParams } from "react-router-dom";
import { useGetSubscriptionQuery } from "../../../features/allApi";
import LoadingHV from '../../../atoms/loading/LoadingHV';
import CreateSubscription from "./CreateSubscription";

const MainSubscription = () => {
  const { id } = useParams();
  console.log(id)
  const { data: subscription, isLoading } = useGetSubscriptionQuery(id, { skip: !id });

  console.log(subscription?.data)

  if (isLoading) {
    return <LoadingHV />;
  }

  return <CreateSubscription subscription={subscription?.data} />;
};

export default MainSubscription; 