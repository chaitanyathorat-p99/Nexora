import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetchQuotationReportRatioQuery } from '../../features/allApi';
import ModuleHeader from '../../components/moduleHeaders/ModuleHeader';
import SimpleTable from '../../components/tables/SimpleTable';
import LoadingHV from '../../atoms/loading/LoadingHV';
import { toQueryString } from '../../atoms/State';
import { QuotationProductRatioColumns } from '../../components/allColumns/AllColumns';

const modelName = "Report";

const QuotationProductRatioCount = () => {
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
                filter={true}
    filterObj={report_filter}

                title={"Quotation & Product Type Ratio Report"}
            />
            {hasData ? (
                <SimpleTable
                    data={reportData} // Passing the entire reportData array
                    columns={QuotationProductRatioColumns({ user, modelName, data: reportData })} // Passing the whole reportData for dynamic columns
                    size={"small"}
                    x={800}
                />
            ) : (
                <LoadingHV />
            )}
        </>
    );
};

export default QuotationProductRatioCount;
