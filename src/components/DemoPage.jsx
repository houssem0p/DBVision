import React, { useEffect, useState } from 'react';

const DemoPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Track the scroll position
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic scroll progress bar
  const progress = (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.add(entry.target.dataset.animation);
          } else {
            entry.target.classList.remove('opacity-100');
            entry.target.classList.remove(entry.target.dataset.animation);
          }
        });
      },
      { threshold: 0.25 }
    );

    document.querySelectorAll('.fadeIn').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-50"
        style={{ width: `${progress}%` }}
      />

      {/* Header Section */}
      <header className="relative py-40 text-center bg-gradient-to-r from-gray-800 to-black">
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-gradient-to-r from-gray-900 to-black"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight tracking-wide mb-4">
            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">DBVision</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            Réinventez la gestion de vos bases de données avec des tableaux de bord interactifs et des analyses en temps réel.
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 space-y-12 bg-gray-800">
        {[{
            title: "Tableaux de Bord Interactifs",
            description: "Visualisez vos données en temps réel avec des graphiques interactifs qui se mettent à jour dynamiquement.",
            icon: "📊",
            animation: "animate-bottom-to-top",
          },
          {
            title: "Gérer Vos Données",
            description: "Modifiez, filtrez et analysez vos données de manière intuitive avec des outils puissants.",
            icon: "⚙️",
            animation: "animate-top-to-bottom",
          },
          {
            title: "Mises à Jour en Temps Réel",
            description: "Restez informé de la santé de votre base de données avec des mises à jour en direct.",
            icon: "⏱️",
            animation: "animate-bottom-to-top",
          },
        ].map((feature, index) => (
          <div
            key={index}
            data-animation={feature.animation}
            className="bg-gray-700 rounded-lg shadow-xl p-8 opacity-0 fadeIn transform transition-opacity duration-1000"
          >
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4 text-indigo-500">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-indigo-400">{feature.title}</h3>
            </div>
            <p className="text-gray-300 text-lg">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Monitoring Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 space-y-12 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-4xl font-semibold text-indigo-500 text-center mb-6">
          Surveillance des Bases de Données en Temps Réel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[{
              title: "Analyse de Performance",
              icon: "📈",
              description: "Suivez la santé de votre base de données en temps réel avec des graphiques détaillés.",
            },
            {
              title: "Utilisation des Données",
              icon: "💾",
              description: "Visualisez et suivez l'utilisation du stockage de vos données.",
            },
            {
              title: "Vue d'Ensemble des Requêtes",
              icon: "🔍",
              description: "Analysez les requêtes fréquentes et leur impact sur les performances.",
            },
          ].map((item, index) => (
            <div
              key={index}
              data-animation={index % 2 === 0 ? "animate-bottom-to-top" : "animate-top-to-bottom"}
              className="bg-gray-700 p-6 rounded-lg shadow-xl opacity-0 fadeIn transform transition-opacity duration-1000"
            >
              <div className="text-4xl mb-4 text-indigo-500">{item.icon}</div>
              <h3 className="text-2xl font-semibold text-indigo-400 mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="flex justify-center py-12 bg-gradient-to-r from-indigo-700 to-blue-900">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-semibold py-4 px-10 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300"
          onClick={() => window.location.href = '/login'}
        >
          Connecter Votre Base de Données
        </button>
      </section>

      {/* Footer Section */}
      <footer className="py-6 text-center bg-gray-900">
        <p className="text-gray-400 text-sm">
          DBVision - Tous droits réservés | &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default DemoPage;
