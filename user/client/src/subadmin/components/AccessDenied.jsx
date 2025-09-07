import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Mail } from 'lucide-react';

const AccessDenied = ({ requiredLevel, userLevel, userHierarchy }) => {
  const navigate = useNavigate();

  const getRequiredLevelName = (level) => {
    switch(level) {
      case 1: return 'Management';
      case 2: return 'Head of Department';
      case 3: return 'Faculty';
      default: return 'Alumni';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600">
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Your Level:</span>
              <span className="ml-2 text-gray-900">{userHierarchy || 'Alumni'}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Required Level:</span>
              <span className="ml-2 text-gray-900">{getRequiredLevelName(requiredLevel)} or higher</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800 mb-1">Need Access?</p>
                <p className="text-blue-700">
                  Contact your AlumnLink manager to request access to this feature.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/subadmin/dashboard')}
              className="flex-1 bg-[#fe6019] hover:bg-[#fe6019]/90"
            >
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
