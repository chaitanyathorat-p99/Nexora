import React from 'react';
import { useGetUserWiseMeetingStatsQuery } from '../../features/allApi';
import ModuleHeader from '../../components/moduleHeaders/ModuleHeader';
import SimpleTable from '../../components/tables/SimpleTable';
import { UserWiseMeetingStatsColumns } from '../../components/allColumns/AllColumns';
import LoadingHV from '../../atoms/loading/LoadingHV';

const UserWiseMeetingStats = () => {
  const { data = [], isLoading, error } = useGetUserWiseMeetingStatsQuery();

  return (
    <>
      <ModuleHeader
        filter={false}
        title={"User-wise Meeting Stats Report"}
      />
      {isLoading ? (
        <LoadingHV />
      ) : error ? (
        <div style={{ color: 'red' }}>Failed to fetch meeting stats</div>
      ) : (
        <SimpleTable data={data} columns={UserWiseMeetingStatsColumns()} size={"small"} x={800} />
      )}
    </>
  );
};

export default UserWiseMeetingStats; 