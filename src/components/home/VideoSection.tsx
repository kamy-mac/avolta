import React from 'react';

export default function VideoSection() {
  return (
    <section className="py-24 bg-sand">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>
          <h2 className="text-4xl font-bold text-night mb-4">Découvrez Avolta Belgique</h2>
          <p className="text-night/60 max-w-xl mx-auto">
            Plongez dans l'univers d'Avolta et découvrez comment nous façonnons l'avenir des aéroports.
          </p>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              video.muted = true;
            }}
            poster="https://images.unsplash.com/photo-1436491865332-7a61a109cc05"
          >
            <source src="https://www.avoltaworld.com/sites/default/files/2023-10/Hero-video-with-centred-text_compressed.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          <div className="absolute inset-0 bg-night/10 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}