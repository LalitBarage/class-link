import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';


const AddLab = () => {
  const [labs, setLabs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLab, setCurrentLab] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    labName: '',
    class: '',
    division: '',
    batch: '',
    faculty: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEditLab = () => {
    // Log the form data to the console
    console.log('Form Data:', formData);

    if (currentLab !== null) {
      const updatedLabs = labs.map((lab, index) =>
        index === currentLab ? formData : lab
      );
      setLabs(updatedLabs);
    } else {
      setLabs([...labs, formData]);
    }

    setShowAddModal(false);
    setFormData({
      id: '',
      labName: '',
      class: '',
      division: '',
      batch: '',
      faculty: '',
    });
    setCurrentLab(null);
  };

  const handleDeleteLab = () => {
    setLabs(labs.filter((_, index) => index !== currentLab));
    setShowDeleteModal(false);
    setCurrentLab(null);
  };

  const handleSearch = () => {
    setLabs(
      labs.filter((lab) =>
        lab.labName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  return (
    <div className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search lab..."
              className="bg-gray-100 border rounded-md p-2 shadow-sm w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-gray-800"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div>
            <button
              className="bg-black text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-gray-800"
              onClick={() => setShowAddModal(true)}
            >
              Add Lab
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100 text-sm font-semibold">
              <th className="px-4 py-3 border border-gray-300">ID</th>
              <th className="px-4 py-3 border border-gray-300">Lab Name</th>
              <th className="px-4 py-3 border border-gray-300">Class</th>
              <th className="px-4 py-3 border border-gray-300">Division</th>
              <th className="px-4 py-3 border border-gray-300">Batch</th>
              <th className="px-4 py-3 border border-gray-300">Faculty</th>
              <th className="px-4 py-3 border border-gray-300 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 border-b border-gray-300"
              >
                <td className="px-4 py-3 border border-gray-300">{lab.id}</td>
                <td className="px-4 py-3 border border-gray-300">{lab.labName}</td>
                <td className="px-4 py-3 border border-gray-300">{lab.class}</td>
                <td className="px-4 py-3 border border-gray-300">{lab.division}</td>
                <td className="px-4 py-3 border border-gray-300">{lab.batch}</td>
                <td className="px-4 py-3 border border-gray-300">{lab.faculty}</td>
                <td className="px-4 py-3 border border-gray-300 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                      onClick={() => {
                        setCurrentLab(index);
                        setFormData(lab);
                        setShowAddModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                      onClick={() => {
                        setCurrentLab(index);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Showing {labs.length} out of {labs.length} entries
        </p>
      </div>

      {/* Add/Edit Lab Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {currentLab !== null ? 'Edit Lab' : 'Add Lab'}
            </h2>
            <div className="mb-2">
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="id"
                placeholder="Lab Id"
                value={formData.id}
                onChange={handleInputChange}
              />
              </div>
              <div className='mb-2'>
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                name="faculty"
                placeholder="Faculty Id"
                value={formData.faculty}
                onChange={handleInputChange}
              />
              </div>
              <div className="flex gap-4 mb-2">
                <input
                  type="text"
                  className="w-full p-3 border rounded-md bg-gray-100"
                  name="startRollNo"
                  placeholder="Start Roll No"
                  value={formData.startRollNo}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className="w-full p-3 border rounded-md bg-gray-100"
                  name="endRollNo"
                  placeholder="End Roll No"
                  value={formData.endRollNo}
                  onChange={handleInputChange}
                />
              </div>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleAddOrEditLab}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">
              Do you really want to delete this record? This process cannot be
              undone.
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleDeleteLab}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLab;