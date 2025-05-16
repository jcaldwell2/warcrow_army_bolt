
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import PatreonSupportSection from '@/components/about/PatreonSupportSection';
import SupportersList from '@/components/about/SupportersList';
import LatestPosts from '@/components/about/LatestPosts';
import { Footer } from '@/components/landing/Footer';
import { Container } from '@/components/ui/custom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { aboutTranslations } from '@/i18n/about';
import { Github, Mail, Globe } from 'lucide-react';

const AboutUs = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={aboutTranslations.aboutTitle[language]} />
      
      <Container className="py-8 pb-24 px-4 md:px-6">
        {/* Move the Patreon support section to the top */}
        <div className="mb-16">
          <PatreonSupportSection />
        </div>
        
        <div className="max-w-4xl mx-auto mb-16">
          <Separator className="my-10 bg-warcrow-gold/20" />
          
          <h1 className="text-4xl font-bold text-warcrow-gold mb-6 text-center">
            {aboutTranslations.aboutDescription[language]}
          </h1>
          
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-center mb-8 text-warcrow-text/80">
              {language === 'en' 
                ? 'Warcrow Army Builder is an unofficial application developed by fans of Warcrow to help the community build and share army lists for the game.' 
                : language === 'es' 
                ? 'El Constructor de Ejércitos de Warcrow es una aplicación no oficial desarrollada por fans de Warcrow para ayudar a la comunidad a crear y compartir listas de ejércitos para el juego.'
                : 'Le Constructeur d\'Armée Warcrow est une application non officielle développée par des fans de Warcrow pour aider la communauté à construire et partager des listes d\'armée pour le jeu.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-black/40 border border-warcrow-gold/30 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-warcrow-gold mb-4">
                  {language === 'en' ? 'Our Mission' : 
                  language === 'es' ? 'Nuestra Misión' : 
                  'Notre Mission'}
                </h2>
                <p>
                  {language === 'en'
                    ? 'Our goal is to provide a useful tool that enhances the gaming experience while respecting the intellectual property of Corvus Belli.'
                    : language === 'es'
                    ? 'Nuestro objetivo es proporcionar una herramienta útil que mejore la experiencia de juego, respetando la propiedad intelectual de Corvus Belli.'
                    : 'Notre objectif est de fournir un outil utile qui améliore l\'expérience de jeu tout en respectant la propriété intellectuelle de Corvus Belli.'}
                </p>
              </div>
              
              <div className="bg-black/40 border border-warcrow-gold/30 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-warcrow-gold mb-4">
                  {language === 'en' ? 'Our Team' : 
                  language === 'es' ? 'Nuestro Equipo' : 
                  'Notre Équipe'}
                </h2>
                <p>
                  {language === 'en'
                    ? 'This application is maintained by a small team of volunteers who are passionate about the game. We are always looking for ways to improve the app and welcome feedback from the community.'
                    : language === 'es'
                    ? 'Esta aplicación es mantenida por un pequeño equipo de voluntarios apasionados por el juego. Siempre estamos buscando formas de mejorar la aplicación y agradecemos los comentarios de la comunidad.'
                    : 'Cette application est maintenue par une petite équipe de bénévoles passionnés par le jeu. Nous cherchons toujours des moyens d\'améliorer l\'application et accueillons les commentaires de la communauté.'}
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-10 bg-warcrow-gold/20" />
          
          <h2 className="text-3xl font-bold text-warcrow-gold mb-8 text-center">
            {aboutTranslations.teamTitle[language]}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-warcrow-accent border-2 border-warcrow-gold/50 mr-4">
                    <AspectRatio ratio={1/1}>
                      <img 
                        src="/art/portrait/grand_captain_portrait.jpg" 
                        alt="James Caldwell" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-warcrow-gold">James Caldwell</h3>
                    <p className="text-sm text-warcrow-text/80">
                      {language === 'en' ? 'Lead Developer & Designer' : 
                      language === 'es' ? 'Desarrollador Principal y Diseñador' : 
                      'Développeur Principal et Designer'}
                    </p>
                  </div>
                </div>
                <p className="text-warcrow-text/90">
                  {language === 'en' 
                    ? 'Creator and maintainer of the Warcrow Army Builder application. Passionate about game design and web development.' 
                    : language === 'es' 
                    ? 'Creador y mantenedor de la aplicación Constructor de Ejércitos de Warcrow. Apasionado por el diseño de juegos y el desarrollo web.'
                    : 'Créateur et mainteneur de l\'application Constructeur d\'Armée Warcrow. Passionné par le design de jeux et le développement web.'}
                </p>
                <div className="flex mt-4 space-x-3">
                  <a href="#" className="text-warcrow-text/60 hover:text-warcrow-gold">
                    <Github size={18} />
                  </a>
                  <a href="#" className="text-warcrow-text/60 hover:text-warcrow-gold">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-black/50 border border-warcrow-gold/30 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-warcrow-accent border-2 border-warcrow-gold/50 mr-4">
                    <AspectRatio ratio={1/1}>
                      <img 
                        src="/art/portrait/lady_telia_portrait.jpg" 
                        alt="Jayrol San Jose" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-warcrow-gold">Jayrol San Jose</h3>
                    <p className="text-sm text-warcrow-text/80">
                      {language === 'en' ? 'Content Expert, UI Expert & Project Manager' : 
                      language === 'es' ? 'Experto en Contenido, UI y Gestor de Proyectos' : 
                      'Expert en Contenu, UI et Chef de Projet'}
                    </p>
                  </div>
                </div>
                <p className="text-warcrow-text/90">
                  {language === 'en' 
                    ? 'Leads content strategy, user experience design, and project management. Ensures the application meets player needs and expectations.' 
                    : language === 'es' 
                    ? 'Dirige la estrategia de contenido, el diseño de experiencia de usuario y la gestión de proyectos. Asegura que la aplicación cumpla con las necesidades y expectativas de los jugadores.'
                    : 'Dirige la stratégie de contenu, la conception de l\'expérience utilisateur et la gestion de projet. S\'assure que l\'application répond aux besoins et aux attentes des joueurs.'}
                </p>
                <div className="flex mt-4 space-x-3">
                  <a href="#" className="text-warcrow-text/60 hover:text-warcrow-gold">
                    <Globe size={18} />
                  </a>
                  <a href="#" className="text-warcrow-text/60 hover:text-warcrow-gold">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community section with supporters and latest posts */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-warcrow-gold mb-8 text-center">
            {aboutTranslations.communityTitle[language]}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Supporters list on the left */}
            <div>
              <SupportersList />
            </div>
            
            {/* Latest posts on the right */}
            <div>
              <LatestPosts />
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center max-w-2xl mx-auto px-4">
          <p className="text-warcrow-text/60 text-sm">
            {language === 'en' 
              ? 'Warcrow is a trademark of Corvus Belli S.L. This app is unofficial and not affiliated with Corvus Belli.' 
              : language === 'es' 
              ? 'Warcrow es una marca registrada de Corvus Belli S.L. Esta aplicación es no oficial y no está afiliada con Corvus Belli.'
              : 'Warcrow est une marque déposée de Corvus Belli S.L. Cette application est non officielle et n\'est pas affiliée à Corvus Belli.'}
          </p>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
