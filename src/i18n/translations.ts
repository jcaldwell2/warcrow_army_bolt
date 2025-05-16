
import { TranslationsType } from './types';
import { armyTranslations } from './army';
import { authTranslations } from './auth';
import { playTranslations } from './play';
import { missionTranslations } from './missions';
import { landingTranslations } from './landing';
import { rulesTranslations } from './rules/index';
import { commonTranslations } from './common';
import { uiTranslations } from './ui';
import { aboutTranslations } from './about';
import { profileTranslations } from './profile';
import { faqTranslations } from './faq';
import { activityTranslations } from './activity';

export const translations: TranslationsType = {
  // Common translations
  loading: {
    en: 'Loading...',
    es: 'Cargando...',
    fr: 'Chargement...'
  },
  save: {
    en: 'Save',
    es: 'Guardar',
    fr: 'Enregistrer'
  },
  cancel: {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler'
  },
  delete: {
    en: 'Delete',
    es: 'Eliminar',
    fr: 'Supprimer'
  },
  edit: {
    en: 'Edit',
    es: 'Editar',
    fr: 'Modifier'
  },
  close: {
    en: 'Close',
    es: 'Cerrar',
    fr: 'Fermer'
  },
  confirm: {
    en: 'Confirm',
    es: 'Confirmar',
    fr: 'Confirmer'
  },
  search: {
    en: 'Search',
    es: 'Buscar',
    fr: 'Rechercher'
  },
  submit: {
    en: 'Submit',
    es: 'Enviar',
    fr: 'Soumettre'
  },
  back: {
    en: 'Back',
    es: 'Atrás',
    fr: 'Retour'
  },
  next: {
    en: 'Next',
    es: 'Siguiente',
    fr: 'Suivant'
  },
  language: {
    en: 'Language',
    es: 'Idioma',
    fr: 'Langue'
  },
  previous: {
    en: 'Previous',
    es: 'Anterior',
    fr: 'Précédent'
  },
  yes: {
    en: 'Yes',
    es: 'Sí',
    fr: 'Oui'
  },
  no: {
    en: 'No',
    es: 'No',
    fr: 'Non'
  },
  add: {
    en: 'Add',
    es: 'Añadir',
    fr: 'Ajouter'
  },
  remove: {
    en: 'Remove',
    es: 'Eliminar',
    fr: 'Supprimer'
  },
  create: {
    en: 'Create',
    es: 'Crear',
    fr: 'Créer'
  },
  update: {
    en: 'Update',
    es: 'Actualizar',
    fr: 'Mettre à jour'
  },
  view: {
    en: 'View',
    es: 'Ver',
    fr: 'Voir'
  },
  share: {
    en: 'Share',
    es: 'Compartir',
    fr: 'Partager'
  },
  copy: {
    en: 'Copy',
    es: 'Copiar',
    fr: 'Copier'
  },
  download: {
    en: 'Download',
    es: 'Descargar',
    fr: 'Télécharger'
  },
  upload: {
    en: 'Upload',
    es: 'Subir',
    fr: 'Téléverser'
  },
  select: {
    en: 'Select',
    es: 'Seleccionar',
    fr: 'Sélectionner'
  },
  filter: {
    en: 'Filter',
    es: 'Filtrar',
    fr: 'Filtrer'
  },
  sort: {
    en: 'Sort',
    es: 'Ordenar',
    fr: 'Trier'
  },
  clear: {
    en: 'Clear',
    es: 'Limpiar',
    fr: 'Effacer'
  },
  reset: {
    en: 'Reset',
    es: 'Reiniciar',
    fr: 'Réinitialiser'
  },
  apply: {
    en: 'Apply',
    es: 'Aplicar',
    fr: 'Appliquer'
  },
  settings: {
    en: 'Settings',
    es: 'Configuración',
    fr: 'Paramètres'
  },
  help: {
    en: 'Help',
    es: 'Ayuda',
    fr: 'Aide'
  },
  about: {
    en: 'About',
    es: 'Acerca de',
    fr: 'À propos'
  },
  contact: {
    en: 'Contact',
    es: 'Contacto',
    fr: 'Contact'
  },
  privacyPolicy: {
    en: "Privacy Policy",
    es: "Política de Privacidad",
    fr: "Politique de Confidentialité"
  },
  termsOfService: {
    en: "Terms of Service",
    es: "Términos de Servicio",
    fr: "Conditions d'Utilisation"
  },
  logoAlt: {
    en: "Warcrow Army Builder Logo",
    es: "Logo del Constructor de Ejércitos Warcrow",
    fr: "Logo du Constructeur d'Armée Warcrow"
  },
  rules: {
    en: "Rules",
    es: "Reglas",
    fr: "Règles"
  },
  testersOnly: {
    en: "Testers Only",
    es: "Solo para Probadores",
    fr: "Réservé aux Testeurs"
  },
  testersOnlyDescription: {
    en: "This feature is currently only available to testers. Please contact the admin if you would like to become a tester.",
    es: "Esta función actualmente solo está disponible para probadores. Póngase en contacto con el administrador si desea convertirse en probador.",
    fr: "Cette fonctionnalité n'est actuellement disponible que pour les testeurs. Veuillez contacter l'administrateur si vous souhaitez devenir testeur."
  },
  haveFeedback: {
    en: "Have feedback or found a bug? Contact us at:",
    es: "¿Tienes comentarios o encontraste un error? Contáctanos en:",
    fr: "Vous avez des commentaires ou trouvé un bug ? Contactez-nous à :"
  },
  contactEmail: {
    en: "warcrowarmy@gmail.com",
    es: "warcrowarmy@gmail.com",
    fr: "warcrowarmy@gmail.com"
  },
  copyright: {
    en: "Warcrow © 2024 Corvus Belli S.L. - All rights reserved. This is an unofficial fan-made tool.",
    es: "Warcrow © 2024 Corvus Belli S.L. - Todos los derechos reservados. Esta es una herramienta no oficial creada por fans.",
    fr: "Warcrow © 2024 Corvus Belli S.L. - Tous droits réservés. Ceci est un outil non officiel créé par des fans."
  },
  
  // Include all landing page translations
  ...landingTranslations,
  
  // Include auth translations
  ...authTranslations,
  
  // Include army translations
  ...armyTranslations,
  
  // Include play translations
  ...playTranslations,
  
  // Include missions translations
  ...missionTranslations,
  
  // Include rules translations
  ...rulesTranslations,
  
  // Include common translations
  ...commonTranslations,
  
  // Include UI translations
  ...uiTranslations,
  
  // Include about translations
  ...aboutTranslations,
  
  // Include profile translations
  ...profileTranslations,
  
  // Include FAQ translations
  ...faqTranslations,
  
  // Include activity translations
  ...activityTranslations,
  
  // Unit explorer translations
  unitExplorer: {
    en: 'Unit Explorer',
    es: 'Explorador de Unidades',
    fr: 'Explorateur d\'Unités'
  },
  totalUnits: {
    en: 'Total Units',
    es: 'Unidades Totales',
    fr: 'Unités Totales'
  },
  noUnitsMatch: {
    en: 'No units match your search criteria',
    es: 'Ninguna unidad coincide con tus criterios de búsqueda',
    fr: 'Aucune unité ne correspond à vos critères de recherche'
  },
  faction: {
    en: 'Faction',
    es: 'Facción',
    fr: 'Faction'
  },
  type: {
    en: 'Type',
    es: 'Tipo',
    fr: 'Type'
  },
  name: {
    en: 'Name',
    es: 'Nombre',
    fr: 'Nom'
  },
  keywords: {
    en: 'Keywords',
    es: 'Palabras Clave',
    fr: 'Mots-clés'
  },
  specialRules: {
    en: 'Special Rules',
    es: 'Reglas Especiales',
    fr: 'Règles Spéciales'
  }
};
