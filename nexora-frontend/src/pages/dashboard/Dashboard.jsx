// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import WonValueRationCard from '../../components/dashboardcharts/WonLeadConversion';
import PieChart from '../../components/dashboardcharts/PieChart';
import BarChart from '../../components/dashboardcharts/BarChart';
import Loader from '../../atoms/loading/Loader';

const Dashboard = () => {
    const [isLineChartLoaded, setLineChartLoaded] = useState(false);
    const [isBarChartLoaded, setBarChartLoaded] = useState(false);
    const [isPieChartLoaded, setPieChartLoaded] = useState(false);

    useEffect(() => {
        // Simulate loading
        const loadLineChart = setTimeout(() => {
            setLineChartLoaded(true);
        }, 1000); // Adjust timing as needed

        return () => clearTimeout(loadLineChart);
    }, []);

    useEffect(() => {
        if (isLineChartLoaded) {
            const loadBarChart = setTimeout(() => {
                setBarChartLoaded(true);
            }, 1000); // Adjust timing as needed
            return () => clearTimeout(loadBarChart);
        }
    }, [isLineChartLoaded]);

    useEffect(() => {
        if (isBarChartLoaded) {
            const loadPieChart = setTimeout(() => {
                setPieChartLoaded(true);
            }, 1000); // Adjust timing as needed
            return () => clearTimeout(loadPieChart);
        }
    }, [isBarChartLoaded]);

    return (
        <div className="p-4">
            {!isLineChartLoaded ? (
                <Loader />
            ) : (
                <> 
                    <div className="mt-4 flex gap-4">
                        <div className='flex flex-col gap-5'>

                            <div className=" bg-white shadow-lg rounded-lg p-6">
                                {!isBarChartLoaded ? <Loader /> : <WonValueRationCard />}
                            </div>
                            {/* <div className=" bg-white shadow-lg rounded-lg p-6">
                                {!isBarChartLoaded ? <Loader /> : <WonRatioCard />}
                            </div> */}
                        </div>

                        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                            {!isPieChartLoaded ? <Loader /> : <PieChart />}
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
                        <BarChart />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;