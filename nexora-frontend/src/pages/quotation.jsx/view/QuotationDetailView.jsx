import React from "react";
import {
  useGetQuotationDetailQuery,
  useGetQuotationQuery,
} from "../../../features/allApi";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import View from "./View";
import { useParams } from "react-router-dom";

const QuotationDetailView = ({
  deal_id,
  getData,
  performCancel,
  quotationData,
}) => {
  const { id } = useParams();

  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useGetQuotationDetailQuery({ _id: getData ? getData : id });

  return (
    <div>
      {fetch ? (
        <LoadingHV />
      ) : (
        <View
          deal_id={deal_id}
          data={data?._id ? data : quotationData}
          performCancel={performCancel}
        />
      )}
    </div>
  );
};

export default QuotationDetailView;
