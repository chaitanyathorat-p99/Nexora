import React from 'react';
import { useGetUserWiseCallStatsQuery } from '../../features/allApi';
import ModuleHeader from '../../components/moduleHeaders/ModuleHeader';
import SimpleTable from '../../components/tables/SimpleTable';
import { UserWiseCallStatsColumns } from '../../components/allColumns/AllColumns';
import LoadingHV from '../../atoms/loading/LoadingHV';

const UserWiseCallStats = () => {
  const { data = [], isLoading, error } = useGetUserWiseCallStatsQuery();

  return (
    <>
      <ModuleHeader
        filter={false}
        title={"User-wise Call Stats Report"}
      />
      {isLoading ? (
        <LoadingHV />
      ) : error ? (
        <div style={{ color: 'red' }}>Failed to fetch call stats</div>
      ) : (
        <SimpleTable data={data} columns={UserWiseCallStatsColumns()} size={"small"} x={800} />
      )}
    </>
  );
};

export default UserWiseCallStats; 