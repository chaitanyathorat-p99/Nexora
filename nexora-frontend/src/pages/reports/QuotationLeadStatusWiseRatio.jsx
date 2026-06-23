import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetchQuotationReportRatioQuery } from '../../features/allApi';
import ModuleHeader from '../../components/moduleHeaders/ModuleHeader';
import SimpleTable from '../../components/tables/SimpleTable';
import LoadingHV from '../../atoms/loading/LoadingHV';
import { QuotationStatusRatioColumns } from '../../components/allColumns/AllColumns';
import { toQueryString } from '../../atoms/State';

const modelName = "Report";

const QuotationStatusRatioCount = () => {
    const { user, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { report_filter} = useSelector(
        (state) => state.remaining
      );
    const {
        data: reportData,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useFetchQuotationReportRatioQuery({ filterObj:toQueryString(report_filter) });

    // Safeguard to ensure `reportData` exists before rendering
    const hasData = reportData && reportData.length > 0;

    console.log("Data", reportData);

    return (
        <>
            <ModuleHeader
    filterObj={report_filter}

                filter={true}
                title={"Quotation & Status Ratio Report"}
            />
            {hasData ? (
                <SimpleTable
                    data={reportData} // Passing the entire reportData array
                    columns={QuotationStatusRatioColumns({ user, modelName, data: reportData })} // Passing the whole reportData for dynamic columns
                    size={"small"}
                    x={800}
                />
            ) : (
                <LoadingHV />
            )}
        </>
    );
};

export default QuotationStatusRatioCount;
