import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useFetchStatsCountProductsQuery } from '../../features/allApi';
import UniversalLoading from '../../atoms/loading/UniversalLoading';
import { monthOptions, yearOptions } from '../../atoms/static';

const PieChart = () => {
  const [pieData, setPieData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Fetch the product count data
  const { data: productData, isSuccess, isFetching } = useFetchStatsCountProductsQuery({
    filterString: `&year=${selectedYear}&month=${selectedMonth}`,
  });

  // Map product data for the pie chart
  useEffect(() => {
    if (isSuccess && productData) {
      const mappedData = productData.map((item) => ({
        id: item._id,      // Product type (LT, Spare, HT)
        label: item._id,   // Display label for the product type
        value: item.count, // Count of products
        color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Dynamic color
      }));
      setPieData(mappedData);
    }
  }, [isSuccess, productData]);

  return (
    <div style={{ height: '350px' }}>
      <div className='flex space-x-4'>

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
      {!isFetching && pieData.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p>No Records Available</p>
        </div>
      ) : (
        <ResponsivePie
          data={pieData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            { match: { id: 'LT' }, id: 'lines' },
            { match: { id: 'Spare' }, id: 'dots' },
          ]}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [{ on: 'hover', style: { itemTextColor: '#000' } }],
            },
          ]}
        />
      )}
    </div>
  );
};

export default PieChart;
