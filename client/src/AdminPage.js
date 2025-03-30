// AdminPage.js
import React, { useEffect, useState } from 'react';

function AdminPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch('/admin/getPendingRequests') // TODO: need to set this up in backend
            .then(res => res.json())
            .then(data => setRequests(data));
    }, []);

    const handleApprove = (username, page) => {
        fetch('/admin/approveAccess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, page })
        }).then(() => alert(`Approved access for ${username}`));
    };

    return (
        <div>
            <h1>Admin Page</h1>
            {requests.map(req => (
                <div key={req.id}>
                    <p>{req.username} wants access to {req.page}</p>
                    <button onClick={() => handleApprove(req.username, req.page)}>Approve</button>
                </div>
            ))}
        </div>
    );
}

export default AdminPage;