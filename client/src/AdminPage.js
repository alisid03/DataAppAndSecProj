// AdminPage.js
import React, { useEffect, useState } from 'react';

function AdminPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('http://localhost:8080/getPendingRequests');
                const data = await res.json();
                setRequests(data);
            } catch (err) {
                console.error('Error fetching requests:', err);
            }
        };
        fetchRequests();
    }, []);

    const handleApprove = async (username, page) => {
        await fetch('http://localhost:8080/approveAccess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, page })
        });
    alert(`Approved access for ${username}`);
    };

    const handleReject = async (username, page) => {
        await fetch('http://localhost:8080/rejectAccess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, page })
        });
        alert(`Rejected access for ${username}`);
    };
    return (
        <div>
            <h1>Admin Access Requests</h1>
            {requests.length === 0 ? (
                <p>No pending requests</p>
            ): (
                <table border="1" cellPadding="10">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Page</th>
                        <th>Requested At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((req, index) => (
                        <tr key={index}>
                            <td>{req.username}</td>
                            <td>{req.page}</td>
                            <td>{new Date(req.request_time).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleApprove(req.username, req.page)}>Approve</button>
                                <button onClick={() => handleReject(req.username, req.page)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default AdminPage;