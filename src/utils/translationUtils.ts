
import { useTranslateKeyword } from './translation/useTranslateKeyword';
import { landingTranslations } from '@/i18n/landing';
import { commonTranslations } from '@/i18n/common';
import { uiTranslations } from '@/i18n/ui';
import { batchTranslate, translateText, translateToFrench } from './translation/batchTranslate';
import toast from '@/components/ui/toast-core';
import { useUnitNameTranslations } from './translation/hooks/useUnitNameTranslations';
import { useKeywordTranslations } from './translation/hooks/useKeywordTranslations';
import { useSpecialRuleTranslations } from './translation/hooks/useSpecialRuleTranslations';
import { useCharacteristicTranslations } from './translation/hooks/useCharacteristicTranslations';
import { batchTranslateAndUpdate, translateAllMissingContent } from './translation/deepLBatchTranslator';

export { 
  useTranslateKeyword, 
  useUnitNameTranslations,
  useKeywordTranslations,
  useSpecialRuleTranslations,
  useCharacteristicTranslations,
  landingTranslations, 
  commonTranslations, 
  uiTranslations,
  batchTranslate,
  translateText,
  translateToFrench,
  toast,
  batchTranslateAndUpdate,
  translateAllMissingContent
};
