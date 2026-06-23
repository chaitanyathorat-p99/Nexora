// ReportDashboard.js
import React from 'react';
import CommonTabs from '../../atoms/overview/CommonTabs';
import LeadCountStatusWiseRatioReport from './LeadCountStatusWiseRatio';
import IndustryTypeReport from './IndustryTypeReport';
import UserWiseCallStats from './UserWiseCallStats';
import UserWiseMeetingStats from './UserWiseMeetingStats';
import UserWiseStatusWiseLeadCount from './UserWiseStatusWiseLeadCount';

const ReportDashboard = () => {
    const tabData = [
        {
            title: 'Lead Count Status Wise Ratio',
            key: '1',
            content: <LeadCountStatusWiseRatioReport />,
        },
        {
            title: 'Industry Type',
            key: '2',
            content: <IndustryTypeReport />,
        },
        {
            title: 'Call Stats',
            key: '3',
            content: <UserWiseCallStats />,
        },
        {
            title: 'Meeting Stats',
            key: '4',
            content: <UserWiseMeetingStats />,
        },
        {
            title: 'Status-wise Lead Count',
            key: '5',
            content: <UserWiseStatusWiseLeadCount />,
        },
    ];

    return (
        <div>
            <h1 style={styles.sectionTitle}>Reports</h1>
            <CommonTabs tabData={tabData} />
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        // padding: "20px",
        // border: "1px solid #ccc",
        borderRadius: "5px",
    },
    sectionTitle: {
        fontSize: "2.2em",
        marginBottom: "20px",
        fontWeight: "600",
    },
    lifecycleContainer: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginBottom: "20px",
    },
    lifecycleStageContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    textArea: {
        width: "100%",
        minHeight: "100px",
        padding: "8px",
        fontSize: "16px",
        marginBottom: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    button: {
        padding: "8px 16px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    lifecycleStage: {
        marginRight: "10px",
        fontWeight: "bold",
    },
    lifecycleStageValue: {
        color: "var(--color-primary)",
    },
    statusContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    statusLabel: {
        fontWeight: "bold",
        marginBottom: "5px",
    },
    statusBar: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        flexWrap: "wrap",
    },
    status: {
        padding: "5px 10px",
        cursor: "pointer",
        border: "1px solid var(--color-primary)",
        borderRadius: "5px",
        backgroundColor: "var(--color-primary)",
        color: "#fff",
    },
    statusConnector: {
        padding: "5px 10px",
        cursor: "pointer",

        border: "1px solid #ccc",
        borderRadius: "5px",
    },

    tags: {
        marginBottom: "20px",
        color: "var(--color-primary)",
        cursor: "pointer",
    },
    detailsContainer: {
        flex: "5",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
    },
    detailItem: {
        padding: "0px 10px",
        // border: "1px solid #ccc",
        borderRadius: "5px",
    },
    notesContainer: {
        flex: "2",
        // paddingBottom: "20px",
    },
    notesTitle: {
        fontSize: "1.2em",
        marginBottom: "10px",
    },
    noteItem: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginBottom: "10px",
    },
    "@media (max-width: 768px)": {
        detailsContainer: {
            gridTemplateColumns: "1fr",
        },
    },
};

export default ReportDashboard;


