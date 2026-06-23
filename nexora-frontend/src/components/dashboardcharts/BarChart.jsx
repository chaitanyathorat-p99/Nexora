import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useFetchStatsCountCreatedAtQuery } from '../../features/allApi';
import { monthOptions, yearOptions } from '../../atoms/static';

const statuses = [
  { id: "New Leads", status: "666952773497ff34ce0b2b88", color: 'hsl(207, 70%, 54%)' },
  { id: "Marketing Qualified", status: "666952b73497ff34ce0b2b8e", color: 'hsl(120, 70%, 50%)' },
  { id: "Closed Lost", status: "666952f83497ff34ce0b2b9a", color: 'hsl(0, 70%, 50%)' },
  { id: "Contacted", status: "666952af3497ff34ce0b2b8c", color: 'hsl(181.0055865921788, 70.19607843137256%, 50%)' },
  { id: "In Negotiation", status: "666952ce3497ff34ce0b2b94", color: 'hsl(298.99441340782124, 70.19607843137256%, 50%)' },
  { id: "News", status: "669f9a86213d8b766d7d4697", color: 'hsl(58.994413407821234, 70.19607843137256%, 50%)' },
];

const BarChart = () => {
  const [barData, setBarData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const { data: status1Data, isSuccess: isSuccess1, isFetching: isFetching1 } = useFetchStatsCountCreatedAtQuery({
    filterString: `&status=${statuses[0].status}&year=${selectedYear}&month=${selectedMonth}`,
  });

  const { data: status2Data, isSuccess: isSuccess2, isFetching: isFetching2 } = useFetchStatsCountCreatedAtQuery({
    filterString: `&status=${statuses[1].status}&year=${selectedYear}&month=${selectedMonth}`,
  });

  const { data: status3Data, isSuccess: isSuccess3, isFetching: isFetching3 } = useFetchStatsCountCreatedAtQuery({
    filterString: `&status=${statuses[2].status}&year=${selectedYear}&month=${selectedMonth}`,
  });
  const { data: status4Data, isSuccess: isSuccess4, isFetching: isFetching4 } = useFetchStatsCountCreatedAtQuery({
    filterString: `&status=${statuses[3].status}&year=${selectedYear}&month=${selectedMonth}`,
  });
  const { data: status5Data, isSuccess: isSuccess5, isFetching: isFetching5 } = useFetchStatsCountCreatedAtQuery({
    filterString: `&status=${statuses[4].status}&year=${selectedYear}&month=${selectedMonth}`,
  });
  const { data: status6Data, isSuccess: isSuccess6, isFetching: isFetching6 } = useFetchStatsCountCreatedAtQuery({
    filterString: `&status=${statuses[5].status}&year=${selectedYear}&month=${selectedMonth}`,
  });
  useEffect(() => {
    if (isSuccess1 && isSuccess2 && isSuccess3 && status1Data && status2Data && status3Data) {
      const totalLeads1 = status1Data?.reduce((sum, item) => sum + item.lead_count, 0) || 0;
      const totalLeads2 = status2Data?.reduce((sum, item) => sum + item.lead_count, 0) || 0;
      const totalLeads3 = status3Data?.reduce((sum, item) => sum + item.lead_count, 0) || 0;
      const totalLeads4 = status4Data?.reduce((sum, item) => sum + item.lead_count, 0) || 0;
      const totalLeads5 = status5Data?.reduce((sum, item) => sum + item.lead_count, 0) || 0;
      const totalLeads6 = status6Data?.reduce((sum, item) => sum + item.lead_count, 0) || 0;

      setBarData([
        {
          status: statuses[0].id,
          lead_count: totalLeads1,
          color: statuses[0].color,
        },
        {
          status: statuses[1].id,
          lead_count: totalLeads2,
          color: statuses[1].color,
        },
        {
          status: statuses[2].id,
          lead_count: totalLeads3,
          color: statuses[2].color,
        },
        {
          status: statuses[3].id,
          lead_count: totalLeads4,
          color: statuses[3].color,
        },
        {
          status: statuses[4].id,
          lead_count: totalLeads5,
          color: statuses[4].color,
        },
        {
          status: statuses[5].id,
          lead_count: totalLeads6,
          color: statuses[5].color,
        }
      ]);
    }
  }, [
    isSuccess1, isSuccess2, isSuccess3, isSuccess4, isSuccess5, isSuccess6,
    status1Data, status2Data, status3Data, status4Data, status5Data, status6Data,
  ]);


  return (
    <>
      <div className="flex space-x-4">
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border rounded" style={{ height: "30px" }}>
          {yearOptions.map((year) => (
            <option key={year.value} value={year.value}>{year.label}</option>
          ))}
        </select>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border rounded" style={{ height: "30px" }}>
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>
      </div>

      <div style={{ height: '350px' }}>
        {!isFetching1 && isFetching2 && isFetching3 && barData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>No Records Available</p>
          </div>
        ) : (
          <ResponsiveBar
            data={barData}
            keys={['lead_count']}
            indexBy="status"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={({ data }) => data.color}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Status',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Lead Count',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                data: barData.map(d => ({ id: d.status, label: d.status, color: d.color })),
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            role="application"
            ariaLabel="Lead Bar Chart"
          />
        )}
      </div>
    </>
  );
};

export default BarChart;
