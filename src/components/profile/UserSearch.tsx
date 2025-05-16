
import { useProfileSession } from "@/hooks/useProfileSession";
import { UserSearchTrigger } from "./search/UserSearchTrigger";

export const UserSearch = () => {
  const { userId } = useProfileSession();

  if (!userId) {
    return null; // Don't show search if user is not logged in
  }

  return <UserSearchTrigger />;
};
