
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UnifiedSearchProvider } from "@/contexts/UnifiedSearchContext";

import Index from '@/pages/Index';
import Play from '@/pages/Play';
import SharedList from '@/pages/SharedList';
import Setup from '@/pages/Setup';
import Deployment from '@/pages/Deployment';
import Game from '@/pages/Game';
import Scoring from '@/pages/Scoring';
import Summary from '@/pages/Summary';
import Profile from '@/pages/Profile';
import Missions from '@/pages/Missions';
import UnitStats from '@/pages/UnitStats';
import Activity from '@/pages/Activity';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import Rules from '@/pages/Rules';
import FAQ from '@/pages/FAQ';
import AboutUs from '@/pages/AboutUs';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';
import Mail from '@/pages/Mail';
import Admin from '@/pages/Admin';
import AdminAlerts from '@/pages/AdminAlerts';
import DeveloperOptions from '@/pages/DeveloperOptions';
import Landing from '@/pages/Landing';
import DeploymentManagement from '@/pages/DeploymentManagement';
import ChangelogEditor from '@/pages/ChangelogEditor';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/builder" element={<Index />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/faq" element={<Rules />} /> {/* Use Rules component with faq tab active */}
      <Route path="/unit-stats" element={<UnitStats />} />
      <Route path="/game" element={<Game />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/play" element={<Play />} />
      <Route path="/play/:gameId" element={<Play />} />
      <Route path="/deployment" element={<Deployment />} />
      <Route path="/deployment/:gameId" element={<Deployment />} />
      <Route path="/scoring" element={<Scoring />} />
      <Route path="/scoring/:gameId" element={<Scoring />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/summary/:gameId" element={<Summary />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/mail" element={<Mail />} />
      <Route path="/shared-list/:listCode" element={<SharedList />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/alerts" element={<AdminAlerts />} />
      <Route path="/admin/deployment" element={<DeploymentManagement />} />
      <Route path="/admin/changelog" element={<ChangelogEditor />} />
      <Route path="/admin/dev-options" element={<DeveloperOptions />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
