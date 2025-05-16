
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Mail, Info, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminOnly } from "@/utils/adminUtils";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminAlertType, sendAdminAlert, sendTestAdminAlert } from "@/utils/email/adminAlerts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminAlerts = () => {
  const navigate = useNavigate();
  const { isWabAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<AdminAlertType>(AdminAlertType.INFO);
  const [alertSource, setAlertSource] = useState('Admin Panel');
  
  React.useEffect(() => {
    // Redirect non-admin users who directly access this URL
    if (!isWabAdmin) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [isWabAdmin, navigate]);
  
  const handleSendAlert = async () => {
    if (!alertTitle || !alertMessage) {
      toast.error("Please provide both a title and message for the alert");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await sendAdminAlert({
        title: alertTitle,
        message: alertMessage,
        type: alertType,
        source: alertSource
      });
      
      if (result.success) {
        toast.success("Alert sent successfully to admin(s)");
        // Clear form after successful submission
        setAlertTitle('');
        setAlertMessage('');
      } else {
        toast.error(`Failed to send alert: ${result.message}`);
      }
    } catch (error) {
      console.error("Error sending alert:", error);
      toast.error("An unexpected error occurred while sending the alert");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendTestAlert = async () => {
    setIsLoading(true);
    try {
      await sendTestAdminAlert();
    } catch (error) {
      console.error("Error sending test alert:", error);
      toast.error("Failed to send test alert");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminOnly isWabAdmin={isWabAdmin} fallback={null}>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/admin')}
              className="mr-4 border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-warcrow-gold">Admin Alerts</h1>
          </div>
          
          <Alert className="mb-6 border-warcrow-gold/30 bg-black/50">
            <AlertCircle className="h-5 w-5 text-warcrow-gold" />
            <AlertTitle className="text-warcrow-gold">Admin Alert System</AlertTitle>
            <AlertDescription className="text-warcrow-text">
              Send important alerts to all system administrators via email. Use this for critical system notifications or warnings.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
              <h2 className="text-lg font-semibold mb-4 text-warcrow-gold flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Send Admin Alert
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alert-type" className="text-warcrow-text">Alert Type</Label>
                  <Select 
                    value={alertType} 
                    onValueChange={(value) => setAlertType(value as AdminAlertType)}
                  >
                    <SelectTrigger className="border border-warcrow-gold/30 bg-black text-warcrow-text">
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent className="border border-warcrow-gold/30 bg-black text-warcrow-text">
                      <SelectItem value={AdminAlertType.INFO} className="text-blue-400">Information</SelectItem>
                      <SelectItem value={AdminAlertType.WARNING} className="text-amber-400">Warning</SelectItem>
                      <SelectItem value={AdminAlertType.ERROR} className="text-red-400">Error</SelectItem>
                      <SelectItem value={AdminAlertType.DOWNTIME} className="text-purple-400">Downtime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="alert-title" className="text-warcrow-text">Alert Title</Label>
                  <Input
                    id="alert-title"
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="Brief, descriptive title"
                    className="border border-warcrow-gold/30 bg-black text-warcrow-text"
                  />
                </div>
                
                <div>
                  <Label htmlFor="alert-message" className="text-warcrow-text">Alert Message</Label>
                  <Textarea
                    id="alert-message"
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    placeholder="Detailed explanation of the alert"
                    rows={5}
                    className="border border-warcrow-gold/30 bg-black text-warcrow-text resize-y"
                  />
                </div>
                
                <div>
                  <Label htmlFor="alert-source" className="text-warcrow-text">Alert Source</Label>
                  <Input
                    id="alert-source"
                    value={alertSource}
                    onChange={(e) => setAlertSource(e.target.value)}
                    placeholder="Where is this alert coming from?"
                    className="border border-warcrow-gold/30 bg-black text-warcrow-text"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleSendAlert}
                    className="flex-1 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium"
                    disabled={isLoading || !alertTitle || !alertMessage}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {isLoading ? 'Sending...' : 'Send Alert'}
                  </Button>
                  
                  <Button 
                    onClick={handleSendTestAlert}
                    variant="outline"
                    className="flex-1 border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30"
                    disabled={isLoading}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Send Test Alert
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
};

export default AdminAlerts;
