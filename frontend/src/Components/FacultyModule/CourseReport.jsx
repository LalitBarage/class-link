import React, { useState } from "react";

const CourseReport = () => {
    const [showModal, setShowModal] = useState(false);
    const [labId, setLabId] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [currentData, setCurrentData] = useState([]);
    const [recentData, setRecentData] = useState([
        {
            id: 13,
            course: "Python Programming",
            type: "TY",
            batch: "B",
            session: "T2",
            professor: "Prof. XYZ",
        },
    ]);

    const handleScheduleLab = () => {
        setShowModal(true);
    };

    const handleAddLab = () => {
        const newLab = {
            id: currentData.length + 1,
            course: `Lab ${labId}`,
            type: "Lab",
            batch: "-",
            session: timeSlot,
            professor: "-",
        };
        setCurrentData([newLab, ...currentData]); // Add new entry to current data
        setShowModal(false);
        setLabId("");
        setTimeSlot("");
    };

    const handleAttendance = (index) => {
        const labToMove = currentData[index];
        setCurrentData(currentData.filter((_, i) => i !== index));
        setRecentData([labToMove, ...recentData]); // Move to recent data after attendance
    };

    return (
        <div className="bg-white text-black min-h-screen">
            <div className=" bg-gray-400 text-white p-5 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Course Report</h1>
                <button 
                    onClick={handleScheduleLab}
                    className="p-3 bg-gray-300 rounded bg-gray-800">
                 Schedule Course 
                </button>
            </div>
            <div className="p-5">
                <h2 className="text-xl font-bold mb-4">Current</h2>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="p-3 border-b">#</th>
                                <th className="p-3 border-b">Course</th>
                                <th className="p-3 border-b">Type</th>
                                <th className="p-3 border-b">Batch</th>
                                <th className="p-3 border-b">Session</th>
                                <th className="p-3 border-b">Professor</th>
                                <th className="p-3 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((row, index) => (
                                <tr key={index} className="odd:bg-gray-200 even:bg-gray-100">
                                    <td className="p-3">{row.id}</td>
                                    <td className="p-3">{row.course}</td>
                                    <td className="p-3">{row.type}</td>
                                    <td className="p-3">{row.batch}</td>
                                    <td className="p-3">{row.session}</td>
                                    <td className="p-3">{row.professor}</td>
                                    <td className="p-3 flex gap-2">
                                        <button 
                                            onClick={() => handleAttendance(index)}
                                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                                            Attendance
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-bold mb-4">Recent</h2>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="p-3 border-b">#</th>
                                <th className="p-3 border-b">Course</th>
                                <th className="p-3 border-b">Type</th>
                                <th className="p-3 border-b">Batch</th>
                                <th className="p-3 border-b">Session</th>
                                <th className="p-3 border-b">Professor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentData.map((row, index) => (
                                <tr key={index} className="odd:bg-gray-200 even:bg-gray-100">
                                    <td className="p-3">{row.id}</td>
                                    <td className="p-3">{row.course}</td>
                                    <td className="p-3">{row.type}</td>
                                    <td className="p-3">{row.batch}</td>
                                    <td className="p-3">{row.session}</td>
                                    <td className="p-3">{row.professor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-5 w-96">
                        <h2 className="text-xl font-bold mb-4">Schedule Lab</h2>
                        <div className="mb-4">
                            
                            <input 
                                type="text" 
                                value={labId}
                                onChange={(e) => setLabId(e.target.value)}
                                className="w-full p-2 border rounded" 
                                placeholder="Lab ID"
                            />
                        </div>
                        <div className="mb-4">

                            <input 
                                type="text" 
                                value={timeSlot}
                                onChange={(e) => setTimeSlot(e.target.value)}
                                className="w-full p-2 border rounded" 
                                placeholder="Time Slot"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-2 bg-gray-300 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddLab}
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Add Lab
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseReport;