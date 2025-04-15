import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader, Search, X, CheckCircle, ArrowRight, Building, School, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const NetworkTypeIcon = ({ type }) => {
  switch (type) {
    case "Institute":
      return <Building className="h-4 w-4 text-indigo-500" />;
    case "School":
      return <School className="h-4 w-4 text-emerald-500" />;
    case "Corporate":
      return <Briefcase className="h-4 w-4 text-amber-500" />;
    default:
      return null;
  }
};

const JoinNetwork = () => {
  const [institutes, setInstitutes] = useState([]);
  const [schools, setSchools] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [allNetworks, setAllNetworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    network: "",
    rollNumber: "",
    batch: "",
    courseName: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedNetworkDetails, setSelectedNetworkDetails] = useState(null);

  useEffect(() => {
    if (isDialogOpen) {
      fetchNetworks();
    }
  }, [isDialogOpen]);

  const fetchNetworks = async () => {
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
      toast.error("Failed to load networks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!formData.network) newErrors.network = "Please select a network";
    if (!formData.rollNumber || !/^[a-zA-Z0-9]+$/.test(formData.rollNumber))
      newErrors.rollNumber = "Only letters and numbers allowed";
    if (!formData.batch || !/^\d+$/.test(formData.batch))
      newErrors.batch = "Must be a number";
    if (!formData.courseName) newErrors.courseName = "Course name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNetworkSelect = (value) => {
    const selected = allNetworks.find(network => network.id === value);
    setSelectedNetworkDetails(selected);
    setFormData((prev) => ({ ...prev, network: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const recipientUserId = formData.network;
        if (!recipientUserId) {
          toast.error('Please select a network');
          return;
        }

        const response = await axiosInstance.post(
          `/links/request/${recipientUserId}`,
          formData
        );

        console.log("Request sent successfully:", response.data);
        setShowSuccess(true);
        
        setTimeout(() => {
          setFormData({
            network: "",
            rollNumber: "",
            batch: "",
            courseName: "",
          });
          setSelectedNetworkDetails(null);
          setShowSuccess(false);
          setIsDialogOpen(false);
        }, 2000);
        
      } catch (error) {
        console.error("Error sending request:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Failed to send request");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      network: "",
      rollNumber: "",
      batch: "",
      courseName: "",
    });
    setSelectedNetworkDetails(null);
    setErrors({});
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="group relative flex w-full max-w-lg items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg">
            {/* Main text that slides out */}
            <span className="transform transition-all duration-500 group-hover:translate-x-96">
              Join a network
            </span>
            
            {/* Arrow icon that slides in */}
            <span className="absolute inset-0 flex transform items-center justify-center opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight className="h-5 w-5" />
            </span>
            
            {/* Hover effect overlay */}
            <span className="absolute inset-0 transform bg-black opacity-0 transition-all duration-300 group-hover:opacity-10" />
          </button>
        </Dialog.Trigger>
        
        <Dialog.Portal>
          <Dialog.Overlay 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 transition-all duration-300"
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95, y: '60%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '60%' }}
          >
            <div className="absolute right-4 top-4">
              <Dialog.Close asChild>
                <button 
                  className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={resetForm}
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-green-500 mb-2">Request Sent!</h2>
                  <p className="text-gray-600 dark:text-gray-300">Your network join request has been submitted successfully.</p>
                </motion.div>
              ) : (
                <Card className="w-full border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-br from-violet-700 to-indigo-600 bg-clip-text text-transparent">
                      Join Network
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Connect with your institution or organization
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-10">
                        <Loader size={24} className="animate-spin text-indigo-600" />
                        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading networks...</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Network Selection */}
                        <div className="space-y-2">
                          <Label htmlFor="network" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Network
                          </Label>
                          
                          {selectedNetworkDetails ? (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                              <div className="flex items-center gap-2">
                                <NetworkTypeIcon type={selectedNetworkDetails.type} />
                                <span className="font-medium">{selectedNetworkDetails.name}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300">
                                  {selectedNetworkDetails.type}
                                </span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedNetworkDetails(null);
                                  setFormData(prev => ({ ...prev, network: "" }));
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <Select onValueChange={handleNetworkSelect}>
                              <SelectTrigger className="w-full rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <SelectValue placeholder="Choose your network" />
                              </SelectTrigger>
                              <SelectContent position="popper" className="max-h-60">
                                <div className="sticky top-0 p-2 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800">
                                  <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder="Search networks..."
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      className="pl-8 rounded-md"
                                    />
                                  </div>
                                </div>
                                <div className="py-2">
                                  {filteredNetworks.length > 0 ? filteredNetworks.map((network) => (
                                    <SelectItem 
                                      key={network.id} 
                                      value={network.id}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2">
                                        <NetworkTypeIcon type={network.type} />
                                        <span>{network.name}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                          {network.type}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  )) : (
                                    <div className="px-2 py-4 text-center text-gray-500 dark:text-gray-400">
                                      No networks found matching "{searchQuery}"
                                    </div>
                                  )}
                                </div>
                              </SelectContent>
                            </Select>
                          )}
                          {errors.network && <p className="text-sm text-red-500 mt-1">{errors.network}</p>}
                        </div>

                        {/* Roll Number */}
                        <div className="space-y-2">
                          <Label htmlFor="rollNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Admission/ID Number
                          </Label>
                          <Input
                            id="rollNumber"
                            name="rollNumber"
                            placeholder="Enter your ID number"
                            value={formData.rollNumber}
                            onChange={handleInputChange}
                            className="rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {errors.rollNumber && <p className="text-sm text-red-500 mt-1">{errors.rollNumber}</p>}
                        </div>

                        {/* Batch */}
                        <div className="space-y-2">
                          <Label htmlFor="batch" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Batch Year
                          </Label>
                          <Input
                            id="batch"
                            name="batch"
                            placeholder="YYYY"
                            value={formData.batch}
                            onChange={handleInputChange}
                            type="number"
                            className="rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {errors.batch && <p className="text-sm text-red-500 mt-1">{errors.batch}</p>}
                        </div>

                        {/* Course Name */}
                        <div className="space-y-2">
                          <Label htmlFor="courseName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Course/Department
                          </Label>
                          <Input
                            id="courseName"
                            name="courseName"
                            placeholder="e.g. Computer Science, Marketing"
                            value={formData.courseName}
                            onChange={handleInputChange}
                            className="rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {errors.courseName && <p className="text-sm text-red-500 mt-1">{errors.courseName}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg py-2 px-4 font-medium transition-all hover:from-violet-500 hover:to-indigo-500"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader size={16} className="animate-spin mr-2" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Request"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                            className="border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg py-2 px-4 font-medium transition-colors"
                          >
                            Reset
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default JoinNetwork;