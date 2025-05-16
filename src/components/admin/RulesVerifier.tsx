
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Languages, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Import our refactored components
import { ChaptersTab } from './rules/ChaptersTab';
import { SectionsTab } from './rules/SectionsTab';
import { TranslationsTab } from './rules/TranslationsTab';
import { VerifyTab } from './rules/VerifyTab';
import { TranslationEditDialog } from './rules/TranslationEditDialog';
import { useRulesVerifier } from './rules/useRulesVerifier';
import { LanguageVerificationPanel, Language } from './rules/LanguageVerificationPanel';
import { DeleteConfirmationDialog } from './rules/DeleteConfirmationDialog';
import { AddItemDialog } from './rules/AddItemDialog';
import BatchTranslationPanel from './rules/BatchTranslationPanel';

export const RulesVerifier = () => {
  const {
    chapters,
    sections,
    isLoading,
    editingItem,
    setEditingItem,
    translationEditDialogOpen,
    setTranslationEditDialogOpen,
    searchQuery,
    setSearchQuery,
    saveInProgress,
    missingTranslations,
    filteredSections,
    filteredChapters,
    stats,
    fetchRulesData,
    handleEditTranslation,
    saveTranslation,
    runVerification,
    verificationLanguage,
    setVerificationLanguage,
    // Batch translation function
    batchTranslateRules,
    // Other management functions
    handleDeleteItem,
    confirmDelete,
    deleteConfirmDialogOpen,
    setDeleteConfirmDialogOpen,
    deleteItem,
    isDeleting,
    showAddDialog,
    addItemDialogOpen,
    setAddItemDialogOpen,
    addItemType,
    saveNewItem
  } = useRulesVerifier();

  const [activeTab, setActiveTab] = useState<'chapters' | 'sections' | 'translations' | 'verify'>('chapters');
  
  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-warcrow-gold flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            Rules Content Translation Manager
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={runVerification}
              disabled={isLoading}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <CheckCircle className={`h-4 w-4 mr-2`} />
              Verify Translations
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchRulesData}
              disabled={isLoading}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Add Language Verification Panel */}
        <LanguageVerificationPanel 
          currentLanguage={verificationLanguage as Language}
          onLanguageChange={setVerificationLanguage}
        />

        {/* Add Batch Translation Panel */}
        <BatchTranslationPanel
          chapters={chapters}
          sections={sections}
          targetLanguage={verificationLanguage as Language}
          isLoading={isLoading}
          onTranslate={batchTranslateRules}
        />

        <div className="mb-4">
          <Input
            placeholder="Search rules content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-warcrow-gold/30 bg-black text-warcrow-text"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-2">
            <TabsTrigger value="chapters" className={activeTab === 'chapters' ? "bg-warcrow-gold text-black" : ""}>
              Chapters ({filteredChapters.length})
            </TabsTrigger>
            <TabsTrigger value="sections" className={activeTab === 'sections' ? "bg-warcrow-gold text-black" : ""}>
              Sections ({filteredSections.length})
            </TabsTrigger>
            <TabsTrigger value="translations" className={activeTab === 'translations' ? "bg-warcrow-gold text-black" : ""}>
              <Languages className="h-4 w-4 mr-2" />
              Translations
            </TabsTrigger>
            <TabsTrigger value="verify" className={activeTab === 'verify' ? "bg-warcrow-gold text-black" : ""}>
              <Badge variant="destructive" className="ml-2">{missingTranslations.length}</Badge>
              Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chapters">
            <ChaptersTab
              isLoading={isLoading}
              filteredChapters={filteredChapters}
              handleEditTranslation={handleEditTranslation}
              verificationLanguage={verificationLanguage as Language}
              handleDeleteItem={handleDeleteItem}
              showAddDialog={showAddDialog}
            />
          </TabsContent>

          <TabsContent value="sections">
            <SectionsTab
              isLoading={isLoading}
              filteredSections={filteredSections}
              chapters={chapters}
              handleEditTranslation={handleEditTranslation}
              verificationLanguage={verificationLanguage as Language}
              handleDeleteItem={handleDeleteItem}
              showAddDialog={showAddDialog}
            />
          </TabsContent>

          <TabsContent value="translations">
            <TranslationsTab
              isLoading={isLoading}
              chapters={chapters}
              sections={sections}
              stats={stats}
            />
          </TabsContent>

          <TabsContent value="verify">
            <VerifyTab
              isLoading={isLoading}
              missingTranslations={missingTranslations}
              chapters={chapters}
              handleEditTranslation={handleEditTranslation}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-sm text-warcrow-text/60">
          <p className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 
            All rules content is stored in Supabase and loaded directly from the database
          </p>
          <p className="flex items-center">
            <Languages className="h-4 w-4 mr-2" />
            View translations in Spanish or French to verify content
          </p>
        </div>
      </div>
      
      {/* Translation edit dialog */}
      <TranslationEditDialog
        open={translationEditDialogOpen}
        onOpenChange={setTranslationEditDialogOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        saveInProgress={saveInProgress}
        onSave={saveTranslation}
      />

      {/* Delete confirmation dialog */}
      {deleteItem && (
        <DeleteConfirmationDialog
          open={deleteConfirmDialogOpen}
          onOpenChange={setDeleteConfirmDialogOpen}
          onConfirm={confirmDelete}
          title={`Delete ${deleteItem.type}`}
          description={`Are you sure you want to delete the ${deleteItem.type} "${deleteItem.title}"? This action cannot be undone.`}
          isDeleting={isDeleting}
        />
      )}

      {/* Add item dialog */}
      <AddItemDialog
        open={addItemDialogOpen}
        onOpenChange={setAddItemDialogOpen}
        type={addItemType}
        chapters={chapters}
        onSave={saveNewItem}
        saveInProgress={saveInProgress}
      />
    </Card>
  );
};

export default RulesVerifier;
