import React, { useState, useEffect } from 'react';
import { useFetchStatsCountByDayCreatedAtQuery, useFetchYearOptionsQuery } from '../../features/allApi';
import { monthOptions } from '../../atoms/static';

const statuses = [
    { id: "Leads Won", status: "666952773497ff34ce0b2b88", color: 'hsl(120, 70%, 50%)' },
    { id: "Leads Lost", status: "666952f83497ff34ce0b2b9a", color: 'hsl(0, 70%, 50%)' },
];

const WonValueRationCard = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [winRatio, setWinRatio] = useState(null);
    const [valueRatio, setValueRatio] = useState(null);

    const { data: wonStatsData, isSuccess: isSuccess1 } = useFetchStatsCountByDayCreatedAtQuery({
        filterString: `&status=${statuses[0].status}&year=${selectedYear}&month=${selectedMonth}`,
    });
    console.log("Won Data", wonStatsData);

    const { data: lostStatsData, isSuccess: isSuccess2 } = useFetchStatsCountByDayCreatedAtQuery({
        filterString: `&status=${statuses[1].status}&year=${selectedYear}&month=${selectedMonth}`,
    });
    console.log("Lost Data", lostStatsData);

    const { data: yearOptions, isSuccess: isSuccess3 } = useFetchYearOptionsQuery();
    console.log("Year Options", yearOptions);


    useEffect(() => {
        if (isSuccess1 && isSuccess2) {
            const totalWonLeads = wonStatsData?.lead_count || 0;
            const totalLostLeads = lostStatsData?.lead_count || 0;
            const totalWonValue = wonStatsData?.total_lead_value || 0;
            const totalLostValue = lostStatsData?.total_lead_value || 0;

            const totalLeads = totalWonLeads + totalLostLeads;
            const calculatedWinRatio = totalLeads > 0 ? ((totalWonLeads / totalLeads)).toFixed(2) : 0;
            //Total value of won leads / (total value of won leads + total value of lost leads)
            const totalValue = totalWonValue + totalLostValue;
            const wonRatio = totalValue > 0 ? ((totalWonValue / totalValue)).toFixed(2) : 0;
            setWinRatio(calculatedWinRatio);
            setValueRatio(wonRatio);
        }
    }, [wonStatsData, lostStatsData, isSuccess1, isSuccess2]);

    return (
        <>
            <div className='flex space-x-4'>

                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border rounded" style={{height: "30px"}}>
                    <option value="" disabled>Select Year</option>
                    {isSuccess3 && yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border rounded" style={{height: "30px"}}>
                    {monthOptions.map((month) => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-row gap-5 m-3'>
                <div>
                    <h2 className="text-xl font-semibold">Win Ratio</h2>
                    <p className="text-lg">
                        {winRatio !== null ? `${winRatio}%` : 'Loading...'}
                    </p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Win Value Ratio</h2>
                    <p className="text-lg">
                        {valueRatio !== null ? `${valueRatio}%` : 'Loading...'}
                    </p>
                </div>
            </div>
        </>
    );
};

export default WonValueRationCard;
