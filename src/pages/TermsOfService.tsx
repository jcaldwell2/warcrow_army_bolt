
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const TermsOfService = () => {
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
                {t('termsOfService')}
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
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Terms of Service</h2>
                <p className="mb-2">Last Updated: May 13, 2025</p>
                <p>Please read these Terms of Service carefully before using the Warcrow Army Builder application.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">1. Acceptance of Terms</h3>
                <p>By accessing or using the Warcrow Army Builder application ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access or use the Service.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">2. Use License</h3>
                <p className="mb-2">Warcrow Army Builder grants you a limited, non-exclusive, non-transferable license to use the Service for personal, non-commercial purposes. This license does not include:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for any commercial purpose</li>
                  <li>Attempting to decompile or reverse engineer any software contained within the Service</li>
                  <li>Removing any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">3. User Content</h3>
                <p>Users may create and share army lists and other content through the Service. You retain ownership of your content, but grant us a license to use, reproduce, and display your content in connection with operating and improving the Service.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">4. Disclaimer</h3>
                <p>Warcrow Army Builder is a fan-created application and is not affiliated with, endorsed, sponsored, or specifically approved by Corvus Belli S.L. All game content, images, and references to Warcrow are the property of Corvus Belli S.L.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">5. Limitations</h3>
                <p>The Service is provided "as is" without warranties of any kind. In no event shall Warcrow Army Builder be liable for any damages arising out of the use or inability to use the Service.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">6. Account Termination</h3>
                <p>We reserve the right to terminate or suspend access to the Service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users or us.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">7. Changes to Terms</h3>
                <p>We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "Last Updated" date.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">8. Contact Us</h3>
                <p>If you have any questions about these Terms, please contact us at:</p>
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
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Términos de Servicio</h2>
                <p className="mb-2">Última actualización: 13 de mayo de 2025</p>
                <p>Por favor, lee estos Términos de Servicio cuidadosamente antes de usar la aplicación Warcrow Army Builder.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">1. Aceptación de los Términos</h3>
                <p>Al acceder o utilizar la aplicación Warcrow Army Builder ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder o utilizar el Servicio.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">2. Licencia de Uso</h3>
                <p className="mb-2">Warcrow Army Builder te otorga una licencia limitada, no exclusiva y no transferible para utilizar el Servicio con fines personales y no comerciales. Esta licencia no incluye:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Modificar o copiar los materiales</li>
                  <li>Utilizar los materiales con fines comerciales</li>
                  <li>Intentar descompilar o realizar ingeniería inversa de cualquier software incluido en el Servicio</li>
                  <li>Eliminar cualquier notación de derechos de autor u otras notaciones de propiedad de los materiales</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">3. Contenido del Usuario</h3>
                <p>Los usuarios pueden crear y compartir listas de ejército y otro contenido a través del Servicio. Conservas la propiedad de tu contenido, pero nos otorgas una licencia para usar, reproducir y mostrar tu contenido en relación con la operación y mejora del Servicio.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">4. Descargo de Responsabilidad</h3>
                <p>Warcrow Army Builder es una aplicación creada por fans y no está afiliada, respaldada, patrocinada o específicamente aprobada por Corvus Belli S.L. Todo el contenido del juego, imágenes y referencias a Warcrow son propiedad de Corvus Belli S.L.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">5. Limitaciones</h3>
                <p>El Servicio se proporciona "tal cual" sin garantías de ningún tipo. En ningún caso Warcrow Army Builder será responsable por cualquier daño que surja del uso o la imposibilidad de usar el Servicio.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">6. Terminación de Cuenta</h3>
                <p>Nos reservamos el derecho de terminar o suspender el acceso al Servicio inmediatamente, sin previo aviso, por conducta que creemos viola estos Términos de Servicio o es dañina para otros usuarios o para nosotros.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">7. Cambios en los Términos</h3>
                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos a los usuarios de cualquier cambio publicando los nuevos Términos de Servicio en esta página y actualizando la fecha de "Última actualización".</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">8. Contáctanos</h3>
                <p>Si tienes alguna pregunta sobre estos Términos, contáctanos en:</p>
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
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Conditions d'Utilisation</h2>
                <p className="mb-2">Dernière mise à jour : 13 mai 2025</p>
                <p>Veuillez lire attentivement ces Conditions d'Utilisation avant d'utiliser l'application Warcrow Army Builder.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">1. Acceptation des Conditions</h3>
                <p>En accédant ou en utilisant l'application Warcrow Army Builder ("le Service"), vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous êtes en désaccord avec une partie de ces conditions, vous ne pouvez pas accéder ou utiliser le Service.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">2. Licence d'Utilisation</h3>
                <p className="mb-2">Warcrow Army Builder vous accorde une licence limitée, non exclusive et non transférable pour utiliser le Service à des fins personnelles et non commerciales. Cette licence n'inclut pas :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>La modification ou la copie des matériaux</li>
                  <li>L'utilisation des matériaux à des fins commerciales</li>
                  <li>La tentative de décompiler ou de faire de l'ingénierie inverse sur tout logiciel contenu dans le Service</li>
                  <li>La suppression de tout droit d'auteur ou autres notations propriétaires des matériaux</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">3. Contenu de l'Utilisateur</h3>
                <p>Les utilisateurs peuvent créer et partager des listes d'armée et d'autres contenus via le Service. Vous conservez la propriété de votre contenu, mais vous nous accordez une licence pour utiliser, reproduire et afficher votre contenu en relation avec l'exploitation et l'amélioration du Service.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">4. Avertissement</h3>
                <p>Warcrow Army Builder est une application créée par des fans et n'est pas affiliée, approuvée, sponsorisée ou spécifiquement approuvée par Corvus Belli S.L. Tout le contenu du jeu, les images et les références à Warcrow sont la propriété de Corvus Belli S.L.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">5. Limitations</h3>
                <p>Le Service est fourni "tel quel" sans garanties d'aucune sorte. En aucun cas, Warcrow Army Builder ne sera responsable des dommages résultant de l'utilisation ou de l'impossibilité d'utiliser le Service.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">6. Résiliation de Compte</h3>
                <p>Nous nous réservons le droit de résilier ou de suspendre l'accès au Service immédiatement, sans préavis, pour une conduite que nous croyons violer ces Conditions d'Utilisation ou être préjudiciable à d'autres utilisateurs ou à nous-mêmes.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">7. Modifications des Conditions</h3>
                <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Nous informerons les utilisateurs de tout changement en publiant les nouvelles Conditions d'Utilisation sur cette page et en mettant à jour la date de "Dernière mise à jour".</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-warcrow-gold mb-3">8. Contactez-nous</h3>
                <p>Si vous avez des questions concernant ces Conditions, veuillez nous contacter à :</p>
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

export default TermsOfService;
