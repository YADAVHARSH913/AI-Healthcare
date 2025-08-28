// components/BroadcastBanner.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BroadcastBanner = () => {
    const [broadcast, setBroadcast] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchBroadcast = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/broadcast/latest");
                if (res.data) {
                    setBroadcast(res.data);
                }
            } catch (error) {
                console.error("Could not fetch broadcast message.");
            }
        };
        fetchBroadcast();
    }, []);

    if (!broadcast || !isVisible) {
        return null;
    }

    return (
        <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold">Important Announcement</p>
                    <p>{broadcast.message}</p>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-2xl font-bold">&times;</button>
            </div>
        </div>
    );
};

export default BroadcastBanner;