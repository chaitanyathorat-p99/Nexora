import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetchIndustryTypeLeadCountQuery } from '../../features/allApi';
import ModuleHeader from '../../components/moduleHeaders/ModuleHeader';
import SimpleTable from '../../components/tables/SimpleTable';
import LoadingHV from '../../atoms/loading/LoadingHV';
import { ReportColumn } from '../../components/allColumns/AllColumns';
import { toQueryString } from '../../atoms/State';

const modelName = "Report";

const IndustryTypeReport = () => {
    const { user, userToken, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { report_filter } = useSelector(
        (state) => state.remaining
    );
    const {
        data: data,
        isLoading: isLoading,
        isFetching: fetch,
        error: error,
        refetch,
    } = useFetchIndustryTypeLeadCountQuery({ filterObj: toQueryString(report_filter) });

    console.log("Data", data);

    return (
        <>
            <ModuleHeader
                // search={false}
                filter={true}

                // handleCreate={handleCreate}
                filterObj={report_filter}

                title={"Industry Type Lead Count Report"}
            // disabled={checkAccess(user, modelName, "write")}
            />
            {data ? (
                <>
                    <SimpleTable data={data} columns={ReportColumn({ user, modelName })} size={"small"} x={800} />
                </>
            ) : (
                <LoadingHV />
            )}
        </>
    );
};

export default IndustryTypeReport;