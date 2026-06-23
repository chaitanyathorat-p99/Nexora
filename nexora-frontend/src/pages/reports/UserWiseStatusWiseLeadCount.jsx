import React from 'react';
import { useGetUserWiseStatusWiseLeadCountQuery } from '../../features/allApi';
import ModuleHeader from '../../components/moduleHeaders/ModuleHeader';
import LoadingHV from '../../atoms/loading/LoadingHV';
import { Table } from 'antd';

const UserWiseStatusWiseLeadCount = () => {
  const { data = [], isLoading, error } = useGetUserWiseStatusWiseLeadCountQuery();

  // Dynamically generate columns based on data keys
  const columns = React.useMemo(() => {
    if (!data.length) return [];
    const keys = Object.keys(data[0]).filter(k => k !== 'userId');
    return [
      {
        title: 'Sr. No.',
        dataIndex: 'srNo',
        key: 'srNo',
        render: (_, __, idx) => idx + 1,
        width: 70,
        fixed: 'left',
      },
      ...keys.map(key => ({
        title: key === 'user' ? 'User' : key,
        dataIndex: key,
        key,
      })),
    ];
  }, [data]);

  // Add srNo to data
  const tableData = data.map((row, idx) => ({ ...row, srNo: idx + 1 }));

  return (
    <>
      <ModuleHeader filter={false} title={"Status-wise Lead Count Report"} />
      {isLoading ? (
        <LoadingHV />
      ) : error ? (
        <div style={{ color: 'red' }}>Failed to fetch report</div>
      ) : (
        <Table
          columns={columns}
          dataSource={tableData}
          size="small"
          scroll={{ x: 800 }}
          rowKey={row => row.userId || row.user}
          pagination={false}
        />
      )}
    </>
  );
};

export default UserWiseStatusWiseLeadCount; 