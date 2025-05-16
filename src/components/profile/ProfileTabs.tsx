
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArmyListsSection } from '@/components/profile/ArmyListsSection';
import { FriendActivityFeed } from '@/components/profile/FriendActivityFeed';
import { ProfileComments } from '@/components/profile/ProfileComments';
import { useProfileContext } from '@/context/ProfileContext';
import { tabVariants, staggerChildren, profileFadeIn } from './animations';

interface ProfileTabsProps {
  onListSelect: (list: any) => void;
}

type TabType = 'lists' | 'activity' | 'comments';

export const ProfileTabs = ({ onListSelect }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('lists');
  const { profile } = useProfileContext();
  
  if (!profile) return null;
  
  return (
    <div className="mt-6 pt-4 border-t border-warcrow-gold/20">
      <div className="flex border-b border-warcrow-gold/20">
        <motion.button
          variants={tabVariants}
          initial="inactive"
          animate={activeTab === 'lists' ? 'active' : 'inactive'}
          className="px-4 py-2 text-sm font-medium"
          onClick={() => setActiveTab('lists')}
        >
          Army Lists
        </motion.button>
        <motion.button
          variants={tabVariants}
          initial="inactive"
          animate={activeTab === 'activity' ? 'active' : 'inactive'}
          className="px-4 py-2 text-sm font-medium"
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </motion.button>
        <motion.button
          variants={tabVariants}
          initial="inactive"
          animate={activeTab === 'comments' ? 'active' : 'inactive'}
          className="px-4 py-2 text-sm font-medium"
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </motion.button>
      </div>
      
      <motion.div
        key={activeTab}
        variants={profileFadeIn}
        initial="hidden"
        animate="visible"
        className="py-4"
      >
        {activeTab === 'lists' && (
          <ArmyListsSection onListSelect={onListSelect} />
        )}
        
        {activeTab === 'activity' && profile.id && (
          <FriendActivityFeed userId={profile.id} />
        )}
        
        {activeTab === 'comments' && profile.id && (
          <ProfileComments profileId={profile.id} />
        )}
      </motion.div>
    </div>
  );
};
