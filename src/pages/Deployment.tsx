
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PlayerInfo from '@/components/play/player/PlayerInfo';
import { toast } from 'sonner';
import { Map, Shield, ArrowLeftCircle, AlertCircle, Users, UserPlus } from 'lucide-react';
import JoinCodeShare from '@/components/play/JoinCodeShare';
import FriendInviteDialog from '@/components/play/FriendInviteDialog';
import MissionSelector from '@/components/play/MissionSelector';
import { useFriends } from '@/hooks/useFriends';
import { supabase } from '@/integrations/supabase/client';
import { Mission, Player } from '@/types/game';
import GameSetup from '@/components/play/GameSetup';

const Deployment = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [initialInitiativePlayerId, setInitialInitiativePlayerId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showInitiativeDialog, setShowInitiativeDialog] = useState(false);
  const [showJoinCodeDialog, setShowJoinCodeDialog] = useState(false);
  const [showFriendInviteDialog, setShowFriendInviteDialog] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    const getSession = async () => {
      setIsLoadingUser(true);
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.id) {
          setUserId(data.session.user.id);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, username, wab_id, avatar_url')
            .eq('id', data.session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
            setCurrentUser({
              id: profile.id,
              username: profile.username || data.session.user.email?.split('@')[0] || 'Player',
              wab_id: profile.wab_id,
              avatar_url: profile.avatar_url
            });
          }
        }
      } catch (err) {
        console.error('Error fetching session or profile:', err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    getSession();
  }, []);

  const { friends, isLoading: isFriendsLoading } = useFriends(userId || 'preview-user-id');

  useEffect(() => {
    const joinedGameId = localStorage.getItem('warcrow_joined_game');
    if (joinedGameId) {
      console.log('Joined game with ID:', joinedGameId);
      localStorage.removeItem('warcrow_joined_game');
    }
  }, []);

  const handleSelectFirstToDeploy = (playerId: string) => {
    dispatch({ type: 'SET_FIRST_TO_DEPLOY', payload: playerId });
    toast.success(`${state.players[playerId].name} will deploy first`);
  };

  const handleSelectInitiative = (playerId: string) => {
    dispatch({ type: 'SET_INITIAL_INITIATIVE', payload: playerId });
    setInitialInitiativePlayerId(playerId);
    setShowInitiativeDialog(false);
    
    dispatch({ 
      type: 'START_TURN', 
      payload: { 
        turnNumber: 1, 
        activePlayer: playerId 
      } 
    });
    
    dispatch({ type: 'SET_PHASE', payload: 'game' });
    toast.success('Starting the game!');
    navigate('/game');
  };

  const handleStartGame = () => {
    if (Object.keys(state.players).length < 2) {
      toast.error("You need at least two players to start a game");
      return;
    }

    if (!state.mission) {
      toast.error("You need to select a mission before starting the game");
      return;
    }

    setShowInitiativeDialog(true);
  };

  const handleShowJoinCode = () => {
    setShowJoinCodeDialog(true);
  };
  
  const handleShowFriendInvite = () => {
    setShowFriendInviteDialog(true);
  };

  const handleMissionSelect = (mission: Mission) => {
    setSelectedMission(mission);
    dispatch({ type: 'SET_MISSION', payload: mission });
    toast.success(`Selected mission: ${mission.name}`);
  };

  const handleSetupComplete = async (players: any[], mission: Mission) => {
    console.log('Setting up game with mission:', mission);
    
    dispatch({ type: 'RESET_GAME' });
    
    const verifiedWabIds = players
      .filter(p => p.verified && p.wab_id)
      .map(p => ({ wab_id: p.wab_id, name: p.name }));
    
    if (verifiedWabIds.length > 0) {
      localStorage.setItem('warcrow_verified_players', JSON.stringify(verifiedWabIds));
    }
    
    players.forEach(player => {
      dispatch({
        type: 'ADD_PLAYER',
        payload: {
          ...player,
          score: 0,
          roundScores: {},
          points: 0,
          objectivePoints: 0
        } as Player
      });
    });

    dispatch({ type: 'SET_MISSION', payload: mission });
    dispatch({ type: 'SET_PHASE', payload: 'deployment' });

    toast.success(`Game setup complete! Starting mission: ${mission.name}`);
  };

  const renderPlayerInfo = (playerId: string, index: number) => {
    return (
      <PlayerInfo
        key={playerId}
        playerId={playerId}
        index={index}
      />
    );
  };

  const getCurrentPlayerName = () => {
    if (!userId) return "A player";
    
    const playerEntry = Object.entries(state.players).find(
      ([_, player]) => player.wab_id && userId.includes(player.wab_id)
    );
    
    return playerEntry ? playerEntry[1].name : "A player";
  };

  const canShowDeployment = () => {
    return Object.keys(state.players).length > 0 && state.mission !== null;
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-warcrow-background text-warcrow-text container py-8 max-w-5xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-warcrow-gold text-center mb-8 tracking-wider">Game Setup</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-warcrow-gold mb-4">Player Setup</h2>
        <GameSetup
          onStartGame={() => {}}
          currentUser={currentUser}
          isLoading={isLoadingUser}
          onComplete={handleSetupComplete}
        />
      </div>
      
      <div className="flex justify-center mb-8 gap-4 flex-wrap">
        <Button
          variant="outline"
          onClick={handleShowJoinCode}
          className="flex items-center gap-2"
        >
          <Users className="h-5 w-5" />
          <span>Invite Player with Code</span>
        </Button>
        
        {userId && (
          <Button
            variant="outline"
            onClick={handleShowFriendInvite}
            className="flex items-center gap-2 border-warcrow-gold/50 bg-warcrow-background hover:bg-warcrow-gold/10"
          >
            <UserPlus className="h-5 w-5 text-warcrow-gold" />
            <span className="text-warcrow-gold">Invite Friends</span>
          </Button>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-warcrow-gold mb-4">Select Mission</h2>
        <MissionSelector onSelect={handleMissionSelect} />
      </div>
      
      {state.mission && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warcrow-accent border border-warcrow-gold/30 rounded-xl p-6 mb-8 shadow-md"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-warcrow-gold">
                  {state.mission?.name || "Mission"}
                </h2>
                <p className="text-warcrow-text/90 leading-relaxed">
                  {state.mission?.description || "No mission description available"}
                </p>
              </div>
              
              <div className="pt-2">
                <h3 className="font-medium mb-1 text-warcrow-gold text-lg">Objectives</h3>
                <p className="text-warcrow-text/90 leading-relaxed">
                  {state.mission?.objectiveDescription || "No objectives defined"}
                </p>
              </div>
              
              {state.mission?.specialRules && state.mission.specialRules.length > 0 && (
                <div className="pt-2">
                  <h3 className="font-medium mb-1 text-warcrow-gold text-lg">Special Rules</h3>
                  <ul className="text-warcrow-text/90 list-disc pl-5 space-y-1">
                    {state.mission.specialRules.map((rule, i) => (
                      <li key={i} className="leading-relaxed">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {state.mission?.mapImage && (
              <div className="flex-shrink-0">
                <div 
                  className="w-48 h-48 bg-warcrow-background border border-warcrow-gold/30 rounded-md overflow-hidden cursor-pointer shadow-md transition-transform hover:scale-105 hover:shadow-lg duration-300"
                  onClick={() => setShowMap(true)}
                >
                  <img 
                    src={state.mission.mapImage} 
                    alt="Mission map" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center mt-2 text-sm text-warcrow-gold flex justify-center items-center gap-1">
                  <Map size={16} />
                  <span>Click to expand</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {canShowDeployment() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {Object.entries(state.players).map(([playerId, _], index) => 
            renderPlayerInfo(playerId, index)
          )}
        </motion.div>
      )}
      
      {canShowDeployment() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-warcrow-accent border border-warcrow-gold/30 rounded-xl p-6 mb-8 shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-warcrow-gold">Deployment Order</h2>
          
          <div className="bg-warcrow-background/50 rounded-md p-6 border border-warcrow-gold/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="text-warcrow-gold w-5 h-5" />
              <h3 className="font-medium text-center text-warcrow-gold text-lg">Who deploys first?</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(state.players).map(([playerId, player]) => (
                <Button
                  key={playerId}
                  onClick={() => handleSelectFirstToDeploy(playerId)}
                  variant={state.firstToDeployPlayerId === playerId ? "default" : "outline"}
                  className={`py-6 flex flex-col gap-2 h-auto border border-warcrow-gold/30 ${
                    state.firstToDeployPlayerId === playerId 
                      ? "bg-warcrow-gold text-warcrow-background" 
                      : "bg-warcrow-background text-warcrow-text hover:bg-warcrow-gold/20"
                  }`}
                >
                  <span className="text-lg font-medium">{player.name}</span>
                  <span className="text-sm">Deploys First</span>
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {canShowDeployment() && (
        <div className="flex justify-center mt-8 mb-8">
          <Button
            onClick={handleStartGame}
            disabled={!state.firstToDeployPlayerId}
            size="lg"
            className={`px-10 py-6 text-lg ${
              !state.firstToDeployPlayerId 
                ? "bg-warcrow-accent/50 text-warcrow-text/50 cursor-not-allowed" 
                : "bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
            }`}
          >
            Start Game
          </Button>
        </div>
      )}
      
      <div className="flex justify-start mt-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/play')}
          className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10 flex items-center gap-2"
        >
          <ArrowLeftCircle size={18} />
          <span>Back to Play</span>
        </Button>
      </div>
      
      {state.mission?.mapImage && (
        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogContent className="max-w-3xl bg-warcrow-background border-warcrow-gold/30">
            <DialogHeader>
              <DialogTitle className="text-warcrow-gold">Mission Map: {state.mission.name}</DialogTitle>
            </DialogHeader>
            <div className="w-full overflow-hidden rounded-md border border-warcrow-gold/20">
              <img 
                src={state.mission.mapImage} 
                alt="Mission map" 
                className="w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showInitiativeDialog} onOpenChange={setShowInitiativeDialog}>
        <DialogContent className="max-w-md bg-warcrow-background border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Select First Player</DialogTitle>
            <DialogDescription className="text-warcrow-text/90">
              Choose which player has the initiative for the first turn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {Object.entries(state.players).map(([playerId, player]) => (
              <Button 
                key={playerId}
                className="py-8 flex flex-col gap-2 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
                onClick={() => handleSelectInitiative(playerId)}
              >
                <span className="text-xl font-bold">{player.name}</span>
                <span className="text-sm">Has First Initiative</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <JoinCodeShare 
        gameId={state.id} 
        hostName={getCurrentPlayerName()}
        isOpen={showJoinCodeDialog} 
        onClose={() => setShowJoinCodeDialog(false)}
      />
      
      <FriendInviteDialog
        gameId={state.id}
        playerName={getCurrentPlayerName()}
        isOpen={showFriendInviteDialog}
        onClose={() => setShowFriendInviteDialog(false)}
        friends={friends}
        isLoading={isFriendsLoading}
      />
    </motion.div>
  );
};

export default Deployment;
