import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios"; // Update the path as necessary
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Dialog from "@radix-ui/react-dialog";

const JoinNetwork = () => {
  const [institutes, setInstitutes] = useState([]);
  const [schools, setSchools] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [allNetworks, setAllNetworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form states without the name field
  const [formData, setFormData] = useState({
    network: "",
    rollNumber: "",
    batch: "",
    courseName: "", // Added Course Name field
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [instituteRes, schoolRes, corporateRes] = await Promise.all([
          axiosInstance.get("/admin/institutes"),
          axiosInstance.get("/admin/schools"),
          axiosInstance.get("/admin/corporates"),
        ]);
        setInstitutes(instituteRes.data);
        setSchools(schoolRes.data);
        setCorporates(corporateRes.data);
        // Combine all networks into one list
        setAllNetworks([
          ...instituteRes.data.map((item) => ({
            id: item._id,
            type: "Institute",
            name: item.name,
          })),
          ...schoolRes.data.map((item) => ({
            id: item._id,
            type: "School",
            name: item.name,
          })),
          ...corporateRes.data.map((item) => ({
            id: item._id,
            type: "Corporate",
            name: item.name,
          })),
        ]);
      } catch (error) {
        console.error("Error fetching networks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter networks based on search query
  const filteredNetworks = allNetworks.filter((network) =>
    network.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.network) newErrors.network = "Please select a network.";
    if (!formData.rollNumber || !/^[a-zA-Z0-9]+$/.test(formData.rollNumber))
      newErrors.rollNumber = "Roll Number must contain only letters and numbers.";
    if (!formData.batch || !/^\d+$/.test(formData.batch))
      newErrors.batch = "Batch must be a number.";
    if (!formData.courseName) newErrors.courseName = "Course Name is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const recipientUserId = formData.network; // Assuming 'network' holds recipientUserId
        if (!recipientUserId) {
          return alert('Recipient user ID is missing.');
        }

        const response = await axiosInstance.post(
          `/links/request/${recipientUserId}`,
          formData
        );

        console.log("Request sent successfully:", response.data);
        setFormData({
          network: "",
          rollNumber: "",
          batch: "",
          courseName: "",
        });
      } catch (error) {
        console.error("Error sending request:", error.response?.data || error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader size={24} className="animate-spin" />
        <span className="ml-2">Loading networks...</span>
      </div>
    );
  }

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="outline">Join a network</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-bold">Join Network</Dialog.Title>
            <Dialog.Description className="text-gray-500 mt-2 mb-4">
              Select your preferred network and enter your details.
            </Dialog.Description>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Enter Details</CardTitle>
                <CardDescription>Fill in the required information to join a network.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    {/* Network Selection */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="network">Network</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            network: value,
                          }))
                        }
                      >
                        <SelectTrigger id="network">
                          <SelectValue placeholder="Select a network" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <div className="p-2">
                            <Input
                              placeholder="Search network..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          {filteredNetworks.length > 0 ? (
                            filteredNetworks.map((network) => (
                              <SelectItem key={network.id} value={network.id}>
                                {network.name} ({network.type})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled>No results found</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.network && <p className="text-red-500 text-sm">{errors.network}</p>}
                    </div>

                    {/* Roll Number */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="rollNumber">College Admission Number</Label>
                      <Input
                        id="rollNumber"
                        name="rollNumber"
                        placeholder="Enter your roll number"
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                      />
                      {errors.rollNumber && <p className="text-red-500 text-sm">{errors.rollNumber}</p>}
                    </div>

                    {/* Batch */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="batch">Batch</Label>
                      <Input
                        id="batch"
                        name="batch"
                        placeholder="Enter your batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        type="number"
                      />
                      {errors.batch && <p className="text-red-500 text-sm">{errors.batch}</p>}
                    </div>

                    {/* Course Name */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        name="courseName"
                        placeholder="Enter Course Name"
                        value={formData.courseName}
                        onChange={handleInputChange}
                      />
                      {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName}</p>}
                    </div>
                  </div>
                  <CardFooter className="flex justify-between mt-4">
                    <Button type="submit">Submit</Button>
                    <Button variant="outline" onClick={() => setFormData({})}>
                      Reset
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default JoinNetwork;
