
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Users, Search, Trash2, Ban } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { updateUserWabAdminStatus, getWabAdmins } from "@/utils/email/adminManagement";
import { WabAdmin } from "@/utils/email/types";
import { useUserSearch } from "@/hooks/useUserSearch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const UserManagement = () => {
  const [adminList, setAdminList] = useState<WabAdmin[]>([]);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    searchUsers 
  } = useUserSearch();

  useEffect(() => {
    // Fetch admin list when component mounts
    fetchAdminList();
  }, []);

  const fetchAdminList = async () => {
    try {
      const admins = await getWabAdmins();
      setAdminList(admins);
    } catch (error: any) {
      console.error("Failed to fetch admin list:", error);
      toast.error(`Failed to fetch admin list: ${error.message}`);
    }
  };

  const handleUpdateAdminStatus = async () => {
    if (!userIdentifier) {
      toast.error("Please enter a User ID, Email, or WAB ID.");
      return;
    }

    try {
      setIsLoading(true);
      
      // If the identifier is an email or WAB ID, we need to find the user ID first
      let actualUserId = userIdentifier;
      
      if (userIdentifier.includes('@') || userIdentifier.includes('WAB-')) {
        // Try to find the user by email or WAB ID
        const { data: userData, error: searchError } = await supabase
          .from("profiles")
          .select("id")
          .or(`wab_id.eq.${userIdentifier}${userIdentifier.includes('@') ? '' : ',email.eq.' + userIdentifier}`)
          .limit(1)
          .single();
          
        if (searchError || !userData) {
          toast.error("User not found with the provided identifier");
          return;
        }
        
        actualUserId = userData.id;
      }
      
      const result = await updateUserWabAdminStatus(actualUserId, isAdmin);
      toast.success(result.message);
      fetchAdminList(); // Refresh the admin list after update
    } catch (error: any) {
      console.error("Failed to update admin status:", error);
      toast.error(`Failed to update admin status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      searchUsers(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBanUser = async (userId: string, username: string | null) => {
    if (!userId) return;

    try {
      setIsBanning(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      // Check if user is admin
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
        'is_wab_admin',
        { user_id: session.user.id }
      );

      if (adminCheckError || !isAdmin) {
        toast.error("You don't have permission to ban users");
        return;
      }

      // Update profile to set banned status 
      // First check if the banned column exists, if not we'll need to add it
      const { error } = await supabase
        .from('profiles')
        .update({ banned: true })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast.success(`User ${username || userId} has been banned`);
      // Refresh search results
      if (searchQuery) searchUsers(searchQuery);
    } catch (error: any) {
      console.error("Failed to ban user:", error);
      toast.error(`Failed to ban user: ${error.message}`);
    } finally {
      setIsBanning(false);
    }
  };

  const handleRemoveUser = async (userId: string, username: string | null) => {
    if (!userId) return;

    if (!confirm(`Are you sure you want to remove user ${username || userId}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsRemoving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      // Check if user is admin
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
        'is_wab_admin',
        { user_id: session.user.id }
      );

      if (adminCheckError || !isAdmin) {
        toast.error("You don't have permission to remove users");
        return;
      }

      // Update profile to set deactivated status
      const { error } = await supabase
        .from('profiles')
        .update({ 
          deactivated: true,
          username: `REMOVED_${Date.now()}_${username || ''}`.substring(0, 50),
          bio: null,
          avatar_url: null
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast.success(`User ${username || userId} has been removed`);
      // Refresh search results
      if (searchQuery) searchUsers(searchQuery);
    } catch (error: any) {
      console.error("Failed to remove user:", error);
      toast.error(`Failed to remove user: ${error.message}`);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-warcrow-gold mb-4 flex items-center">
          <Users className="mr-2 h-6 w-6" />
          User Management
        </h1>
        <p className="text-warcrow-muted mb-6">
          Manage user permissions and admin status across the platform.
        </p>
      </div>

      {/* User Search Section */}
      <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black mb-6">
        <h2 className="text-lg font-semibold mb-4 text-warcrow-gold flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Find Users
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Input
              type="text"
              placeholder="Search by email, username, or WAB ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold focus:outline-none"
            />
            <Button 
              onClick={handleSearch}
              className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="border-warcrow-gold/20">
                  <TableHead className="text-warcrow-gold/80">Username</TableHead>
                  <TableHead className="text-warcrow-gold/80">WAB ID</TableHead>
                  <TableHead className="text-warcrow-gold/80">User ID</TableHead>
                  <TableHead className="text-warcrow-gold/80">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((user) => (
                  <TableRow key={user.id} className="border-warcrow-gold/20">
                    <TableCell className="font-medium text-warcrow-gold">
                      {user.username || 'No username'}
                    </TableCell>
                    <TableCell className="text-warcrow-muted">
                      {user.wab_id || 'No WAB ID'}
                    </TableCell>
                    <TableCell className="text-warcrow-muted truncate max-w-[120px]">
                      {user.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setUserIdentifier(user.id);
                            setIsAdmin(true);
                          }}
                          className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBanUser(user.id, user.username)}
                          className="border-red-500/30 bg-black text-red-500 hover:bg-red-900/20"
                          disabled={isBanning}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveUser(user.id, user.username)}
                          className="border-red-700/30 bg-black text-red-700 hover:bg-red-900/20"
                          disabled={isRemoving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {searchQuery && searchResults.length === 0 && !isSearching && (
            <Alert className="bg-black border border-warcrow-gold/20 text-warcrow-gold">
              <AlertTitle>No users found</AlertTitle>
              <AlertDescription>
                No users match your search criteria. Try a different search term.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Admin User Management Section */}
      <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black mb-6">
        <h2 className="text-lg font-semibold mb-4 text-warcrow-gold flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Update User Admin Status
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-warcrow-text">User ID, Email, or WAB ID</label>
            <Input
              type="text"
              placeholder="Enter ID, Email, or WAB ID"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold focus:outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="rounded border-warcrow-gold/30 bg-black text-warcrow-gold focus:ring-warcrow-gold"
            />
            <label htmlFor="isAdmin" className="text-warcrow-text">Is Admin</label>
          </div>
          
          <Button 
            onClick={handleUpdateAdminStatus}
            className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </Card>

      {/* Current Admins Section */}
      <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
        <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Current Admins</h2>
        {adminList.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-warcrow-gold/20">
                <TableHead className="text-warcrow-gold/80">Username</TableHead>
                <TableHead className="text-warcrow-gold/80">Email</TableHead>
                <TableHead className="text-warcrow-gold/80">WAB ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminList.map((admin) => (
                <TableRow key={admin.id} className="border-warcrow-gold/20">
                  <TableCell className="font-medium text-warcrow-gold">{admin.username}</TableCell>
                  <TableCell className="text-warcrow-muted">{admin.email}</TableCell>
                  <TableCell className="text-warcrow-muted">{admin.wab_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-warcrow-muted italic">No admins found</p>
        )}
      </Card>
    </>
  );
};

export default UserManagement;
