import React, { useEffect, useState } from 'react';
import { axiosInstance } from "../../lib/axios"; // Importing axiosInstance
import { Loader } from 'lucide-react';

const InstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInstitutes = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/admin/institutes'); // Using axiosInstance for the request
        setInstitutes(response.data);
      } catch (error) {
        console.error('Error fetching institutes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstitutes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader size={24} className="animate-spin" />
        <span className="ml-2">Loading institutes...</span>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">
                Institute Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black">
                Joining Date
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                Payment Status
              </th>
              <th className="py-4 px-4 font-medium text-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {institutes.map((institute, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black">{institute.name}</h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p className="text-black">
                    {new Date(institute.joinDate).toLocaleDateString()}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      institute.paymentStatus === 'Paid'
                        ? 'bg-success text-success'
                        : institute.paymentStatus === 'Unpaid'
                        ? 'bg-danger text-danger'
                        : 'bg-warning text-warning'
                    }`}
                  >
                    {institute.paymentStatus}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <div className="flex items-center space-x-3.5">
                    {/* SVG icons or other action buttons here */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstituteList;
