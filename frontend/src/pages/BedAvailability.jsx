import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// --- Assets ---
import bedHero from '../assets/bed-hero.jpg';

// --- Icon Components ---
const BedIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const BedAvailability = () => {
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("availability");

    useEffect(() => {
        const fetchBeds = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/beds');
                setBeds(res.data);
            } catch (error) {
                console.error("Failed to fetch bed data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBeds();
    }, []);

    // ✅ Search aur sort ka logic theek kar diya hai
    const filteredAndSortedBeds = useMemo(() => {
        let result = beds.filter(ward => 
            // Pehle check karo ki ward.ward hai ya nahi
            ward.ward && ward.ward.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortBy === 'availability') {
            result.sort((a, b) => b.available - a.available);
        } else if (sortBy === 'name') {
            result.sort((a, b) => a.ward.localeCompare(b.ward));
        }
        return result;
    }, [beds, searchTerm, sortBy]);

    const formatLastUpdated = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className="bg-gray-50">
            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20">
                <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${bedHero})` }}>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl font-extrabold text-white">Live Bed Status</h1>
                    <p className="text-xl text-gray-200 mt-4">Real-time updates on bed availability across all wards.</p>
                </div>
            </section>
            
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* --- Controls: Search and Sort --- */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-1/3">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon /></span>
                        <input 
                            type="text"
                            placeholder="Search by ward name..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort By:</label>
                        <select 
                            className="p-2 border rounded-lg"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="availability">Most Available</option>
                            <option value="name">Ward Name (A-Z)</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-lg text-gray-600 py-20">Loading bed status...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAndSortedBeds.map(ward => {
                            const occupied = (ward.total || 0) - (ward.available || 0);
                            const occupancy = (ward.total || 0) > 0 ? (occupied / ward.total) * 100 : 0;
                            const borderColor = occupancy > 90 ? 'border-red-500' : occupancy > 75 ? 'border-yellow-500' : 'border-blue-500';

                            return (
                                <div key={ward._id} className={`bg-white p-6 rounded-xl shadow-lg border-t-4 ${borderColor}`}>
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-2xl font-bold text-gray-800">{ward.ward} Ward</h2>
                                        <p className="text-xs text-gray-500">Last Updated: {formatLastUpdated(ward.updatedAt)}</p>
                                    </div>
                                    <div className="space-y-4 mt-4">
                                        <div className="flex justify-between items-center text-lg">
                                            <span className="text-gray-600">Total Beds:</span>
                                            <span className="font-bold">{ward.total || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg">
                                            <span className="text-green-600">Available:</span>
                                            <span className="font-bold text-green-600">{ward.available || 0}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-500 mb-1">Occupancy</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div 
                                                className="bg-red-500 h-2.5 rounded-full" 
                                                style={{ width: `${occupancy}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-right text-sm font-semibold mt-1">{occupancy.toFixed(1)}% Full</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default BedAvailability;