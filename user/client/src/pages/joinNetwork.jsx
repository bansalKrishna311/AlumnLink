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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch institutes
  useEffect(() => {
    const fetchInstitutes = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/admin/institutes");
        setInstitutes(response.data);
      } catch (error) {
        console.error("Error fetching institutes:", error);
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
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="outline">Join a network</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
          >
            <Dialog.Title className="text-lg font-bold">Join Network</Dialog.Title>
            <Dialog.Description className="text-gray-500 mt-2 mb-4">
              Select your preferred network and enter your details.
            </Dialog.Description>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Enter Details</CardTitle>
                <CardDescription>
                  Fill in the required information to join a network.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    {/* Network Selection */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="network">Network</Label>
                      <Select>
                        <SelectTrigger id="network">
                          <SelectValue placeholder="Select a network" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {institutes.map((institute, index) => (
                            <SelectItem key={index} value={institute.name}>
                              {institute.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Name */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    {/* Roll Number */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="roll-number">Roll Number</Label>
                      <Input
                        id="roll-number"
                        placeholder="Enter your roll number"
                      />
                    </div>
                    {/* Batch */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="batch">Batch</Label>
                      <Input id="batch" placeholder="Enter your batch" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button>Submit</Button>
              </CardFooter>
            </Card>
            <Dialog.Close asChild>
              <Button variant="ghost" className="absolute top-2 right-2">
                Close
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default JoinNetwork;
