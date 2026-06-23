import React from "react";
import { useParams } from "react-router-dom";
import { useGetTicketQuery } from "../../features/allApi";
import LoadingHV from "../../atoms/loading/LoadingHV";
import CreateTicket from "./CreateTicket";

const MainTicket = () => {
	const { id } = useParams();
	const { data, isLoading, isFetching, error } = useGetTicketQuery({ _id: id }, { skip: !id });

	return (
		<div>
			{isLoading || isFetching ? (
				<LoadingHV />
			) : (
				<CreateTicket formData={data?.data ?? data} />
			)}
		</div>
	);
};

export default MainTicket;
