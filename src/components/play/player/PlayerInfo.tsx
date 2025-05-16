import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import ListUploader from '@/components/play/ListUploader';
import { Unit, Faction, Player } from '@/types/game';
import { toast } from 'sonner';

import PlayerNameInput from './PlayerNameInput';
import WabIdInput from './WabIdInput';
import SavedListSelector from './SavedListSelector';
import ListMetadataDisplay from './ListMetadataDisplay';
import PlayerUnitsList from './PlayerUnitsList';
import { useWabIdVerification } from '@/hooks/useWabIdVerification';
import { useSavedLists } from '@/hooks/useSavedLists';

interface PlayerInfoProps {
  playerId: string;
  index: number;
}

interface ListMetadata {
  title?: string;
  faction?: string;
  commandPoints?: string;
  totalPoints?: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerId, index }) => {
  const { state, dispatch } = useGame();
  const player = state.players[playerId];
  const [playerName, setPlayerName] = useState(player?.name || '');
  const [playerWabId, setPlayerWabId] = useState(player?.wab_id || '');
  const [listMetadata, setListMetadata] = useState<ListMetadata>({});

  const { isVerifying, verifyWabId } = useWabIdVerification(playerId, player, setPlayerName, dispatch);
  const { savedLists, isLoadingSavedLists, fetchLists } = useSavedLists(player);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setPlayerName(name);
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: { name }
      }
    });
  };

  const handleWabIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wab_id = e.target.value;
    setPlayerWabId(wab_id);
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: { wab_id }
      }
    });
    
    if (wab_id && wab_id.length >= 12) {
      console.log("WAB ID changed to valid length, fetching lists");
      fetchLists(wab_id);
    }
  };

  useEffect(() => {
    if (playerWabId) {
      console.log("WAB ID entered:", playerWabId);
    }
  }, [playerWabId]);

  const handleVerifyWabId = () => {
    verifyWabId(playerWabId);
  };

  const handleFactionSelect = (faction: Faction) => {
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: {
          faction
        }
      }
    });
  };

  const handleListUpload = (
    playerId: string, 
    listContent: string, 
    parsedUnits?: Unit[], 
    metadata?: ListMetadata
  ) => {
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: { list: listContent }
      }
    });

    if (parsedUnits && parsedUnits.length > 0) {
      dispatch({
        type: 'ADD_PLAYER_UNITS',
        payload: {
          playerId,
          units: parsedUnits
        }
      });
    }

    if (metadata) {
      setListMetadata(metadata);
    }
  };

  const handleSavedListSelect = (listId: string) => {
    console.log("Selected list ID:", listId);
    const selectedList = savedLists.find(list => list.id === listId);
    console.log("Found selected list:", selectedList);
    
    if (!selectedList) {
      console.error("Selected list not found");
      return;
    }
    
    const listText = `${selectedList.name}\n${selectedList.faction}\n\n`;
    const units: Unit[] = selectedList.units.map((unit, index) => ({
      id: `unit-${playerId}-${index}`,
      name: unit.name,
      player: playerId
    }));

    const metadata: ListMetadata = {
      title: selectedList.name,
      faction: selectedList.faction,
      totalPoints: `${selectedList.units.reduce((sum, unit) => sum + (unit.pointsCost * unit.quantity), 0)} pts`
    };

    handleListUpload(playerId, listText, units, metadata);
    
    toast.success(`List "${selectedList.name}" loaded successfully`);
  };

  const playerUnits = state.units.filter(unit => unit.player === playerId);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="neo-card p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-center">
        Player {index + 1}
      </h3>

      <div className="space-y-4">
        <PlayerNameInput 
          playerName={playerName}
          onChange={handleNameChange}
          index={index}
        />

        <WabIdInput 
          playerWabId={playerWabId}
          onChange={handleWabIdChange}
          onVerify={handleVerifyWabId}
          isVerifying={isVerifying}
          isVerified={!!player?.verified}
          index={index}
        />

        <SavedListSelector 
          savedLists={savedLists}
          playerWabId={playerWabId}
          isLoadingSavedLists={isLoadingSavedLists}
          onSelectList={handleSavedListSelect}
        />

        <div>
          <Label>Manually Enter List</Label>
          <div className="mt-1">
            <ListUploader
              playerId={playerId}
              onListUpload={handleListUpload}
              hasUploadedList={!!player?.list}
            />
          </div>
        </div>

        {player?.list && (
          <ListMetadataDisplay listMetadata={listMetadata} />
        )}

        {player?.list && (
          <>
            <Separator className="my-4" />
            <PlayerUnitsList units={playerUnits} />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerInfo;
