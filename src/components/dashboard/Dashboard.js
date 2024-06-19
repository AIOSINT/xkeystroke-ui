import React from 'react';
import './Dashboard.css';
import OpenReports from './widgets/OpenReports';
import PendingCaptchas from './widgets/PendingCaptchas';
import WorkflowAudits from './widgets/WorkflowAudits';
import APICalls from './widgets/APICalls';
import ActiveProxies from './widgets/ActiveProxies';

const Dashboard = () => {
    // Replace these numbers with actual data fetching logic
    const openReportsCount = 10;
    const pendingCaptchasCount = 5;
    const workflowAuditsCount = 7;
    const apiCallsCount = 20;
    const activeProxiesCount = 3;

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard-widgets">
                <OpenReports count={openReportsCount} />
                <PendingCaptchas count={pendingCaptchasCount} />
                <WorkflowAudits count={workflowAuditsCount} />
                <APICalls count={apiCallsCount} />
                <ActiveProxies count={activeProxiesCount} />
            </div>
        </div>
    );
};

export default Dashboard;
