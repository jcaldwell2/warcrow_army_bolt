
import { useNavigate } from "react-router-dom";
import { SavedList } from "@/types/army";

export const useProfileNavigation = () => {
  const navigate = useNavigate();

  const handleListSelect = (list: SavedList) => {
    navigate('/builder', { state: { selectedFaction: list.faction, loadList: list } });
  };

  return { handleListSelect };
};
