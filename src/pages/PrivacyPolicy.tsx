
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <div className="bg-black/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img 
                src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
                alt="Warcrow Logo" 
                className="h-16"
              />
              <h1 className="text-3xl font-bold text-warcrow-gold text-center md:text-left">
                {t('privacyPolicy')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/landing')}
              >
                <Home className="mr-2 h-4 w-4" />
                {t('home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8 bg-black/30 p-6 rounded-lg">
          {language === 'en' ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Privacy Policy</h2>
                <p className="mb-2">Last Updated: May 13, 2025</p>
                <p>This Privacy Policy describes how Warcrow Army Builder ("we", "us", or "our") collects, uses, and discloses your information when you use our application.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Information We Collect</h3>
                <p className="mb-2">When you use the Warcrow Army Builder application, we may collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Account information (email, username)</li>
                  <li>Profile information you provide</li>
                  <li>Army lists you create and save</li>
                  <li>Game data and statistics</li>
                  <li>Usage information and interactions with the application</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">How We Use Your Information</h3>
                <p className="mb-2">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide, maintain, and improve our application</li>
                  <li>Process and complete transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Develop new features and services</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Information Sharing</h3>
                <p>We do not sell your personal information. We may share information in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>With your consent</li>
                  <li>With service providers who perform services on our behalf</li>
                  <li>To comply with legal obligations</li>
                  <li>In connection with a merger, sale, or acquisition</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Data Storage</h3>
                <p>We use Supabase for data storage and authentication services. Your data is stored according to Supabase's security and privacy standards.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Your Rights</h3>
                <p className="mb-2">Depending on your location, you may have rights to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of your personal information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Object to our processing of your information</li>
                </ul>
                <p className="mt-2">To exercise these rights, please contact us at warcrowarmy@gmail.com.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Changes to This Privacy Policy</h3>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p className="mt-2">
                  <a href="mailto:warcrowarmy@gmail.com" className="text-warcrow-gold hover:underline">
                    warcrowarmy@gmail.com
                  </a>
                </p>
              </div>
            </>
          ) : language === 'es' ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Política de Privacidad</h2>
                <p className="mb-2">Última actualización: 13 de mayo de 2025</p>
                <p>Esta Política de Privacidad describe cómo Warcrow Army Builder ("nosotros" o "nuestro") recopila, utiliza y divulga su información cuando utiliza nuestra aplicación.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Información que Recopilamos</h3>
                <p className="mb-2">Cuando utiliza la aplicación Warcrow Army Builder, podemos recopilar:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Información de la cuenta (correo electrónico, nombre de usuario)</li>
                  <li>Información de perfil que proporciona</li>
                  <li>Listas de ejército que crea y guarda</li>
                  <li>Datos y estadísticas del juego</li>
                  <li>Información de uso e interacciones con la aplicación</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Cómo Utilizamos su Información</h3>
                <p className="mb-2">Utilizamos la información que recopilamos para:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Proporcionar, mantener y mejorar nuestra aplicación</li>
                  <li>Procesar y completar transacciones</li>
                  <li>Enviarle avisos técnicos y mensajes de soporte</li>
                  <li>Responder a sus comentarios y preguntas</li>
                  <li>Desarrollar nuevas funciones y servicios</li>
                  <li>Monitorear y analizar tendencias y uso</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Compartir Información</h3>
                <p>No vendemos su información personal. Podemos compartir información en las siguientes circunstancias:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Con su consentimiento</li>
                  <li>Con proveedores de servicios que realizan servicios en nuestro nombre</li>
                  <li>Para cumplir con obligaciones legales</li>
                  <li>En relación con una fusión, venta o adquisición</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Almacenamiento de Datos</h3>
                <p>Utilizamos Supabase para servicios de almacenamiento de datos y autenticación. Sus datos se almacenan de acuerdo con los estándares de seguridad y privacidad de Supabase.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Sus Derechos</h3>
                <p className="mb-2">Dependiendo de su ubicación, puede tener derechos a:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Acceder a la información personal que tenemos sobre usted</li>
                  <li>Solicitar la corrección de su información personal</li>
                  <li>Solicitar la eliminación de su cuenta y datos</li>
                  <li>Oponerse al procesamiento de su información</li>
                </ul>
                <p className="mt-2">Para ejercer estos derechos, contáctenos en warcrowarmy@gmail.com.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Cambios en esta Política de Privacidad</h3>
                <p>Podemos actualizar nuestra Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización".</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Contáctenos</h3>
                <p>Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en:</p>
                <p className="mt-2">
                  <a href="mailto:warcrowarmy@gmail.com" className="text-warcrow-gold hover:underline">
                    warcrowarmy@gmail.com
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Politique de Confidentialité</h2>
                <p className="mb-2">Dernière mise à jour : 13 mai 2025</p>
                <p>Cette Politique de Confidentialité décrit comment Warcrow Army Builder ("nous") collecte, utilise et divulgue vos informations lorsque vous utilisez notre application.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Informations que nous collectons</h3>
                <p className="mb-2">Lorsque vous utilisez l'application Warcrow Army Builder, nous pouvons collecter :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Informations de compte (e-mail, nom d'utilisateur)</li>
                  <li>Informations de profil que vous fournissez</li>
                  <li>Listes d'armée que vous créez et sauvegardez</li>
                  <li>Données et statistiques de jeu</li>
                  <li>Informations d'utilisation et interactions avec l'application</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Comment nous utilisons vos informations</h3>
                <p className="mb-2">Nous utilisons les informations que nous collectons pour :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fournir, maintenir et améliorer notre application</li>
                  <li>Traiter et compléter les transactions</li>
                  <li>Vous envoyer des avis techniques et des messages de support</li>
                  <li>Répondre à vos commentaires et questions</li>
                  <li>Développer de nouvelles fonctionnalités et services</li>
                  <li>Surveiller et analyser les tendances et l'utilisation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Partage d'informations</h3>
                <p>Nous ne vendons pas vos informations personnelles. Nous pouvons partager des informations dans les circonstances suivantes :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Avec votre consentement</li>
                  <li>Avec des prestataires de services qui effectuent des services en notre nom</li>
                  <li>Pour se conformer aux obligations légales</li>
                  <li>Dans le cadre d'une fusion, vente ou acquisition</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Stockage des données</h3>
                <p>Nous utilisons Supabase pour les services de stockage de données et d'authentification. Vos données sont stockées conformément aux normes de sécurité et de confidentialité de Supabase.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Vos droits</h3>
                <p className="mb-2">Selon votre emplacement, vous pouvez avoir des droits pour :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Accéder aux informations personnelles que nous détenons à votre sujet</li>
                  <li>Demander la correction de vos informations personnelles</li>
                  <li>Demander la suppression de votre compte et de vos données</li>
                  <li>Vous opposer à notre traitement de vos informations</li>
                </ul>
                <p className="mt-2">Pour exercer ces droits, veuillez nous contacter à warcrowarmy@gmail.com.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Modifications de cette Politique de Confidentialité</h3>
                <p>Nous pouvons mettre à jour notre Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle Politique de Confidentialité sur cette page et en mettant à jour la date de "Dernière mise à jour".</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">Contactez-nous</h3>
                <p>Si vous avez des questions concernant cette Politique de Confidentialité, veuillez nous contacter à :</p>
                <p className="mt-2">
                  <a href="mailto:warcrowarmy@gmail.com" className="text-warcrow-gold hover:underline">
                    warcrowarmy@gmail.com
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
