import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEs = i18n.resolvedLanguage?.startsWith('es');

  const copy = isEs
    ? {
        title: 'Politica de Privacidad',
        updated: 'Ultima actualizacion: April 11, 2026',
        introTitle: '1. Introduccion',
        introBody:
          'Bienvenido a Runboxjs. Respetamos tu privacidad y protegemos tus datos. Como Runboxjs opera dentro de tu navegador, no recopilamos ni almacenamos el codigo o archivos que ejecutas en el entorno virtual.',
        dataTitle: '2. Datos que recopilamos',
        dataBody:
          'Solo recopilamos analitica minima para entender uso del sitio y la documentacion, como vistas de pagina, navegador y referencia. Estos datos no se vinculan al codigo que ejecutas.',
        localTitle: '3. Almacenamiento y ejecucion local',
        localBody:
          'Toda la ejecucion ocurre localmente usando WebAssembly y APIs modernas. Si persistes datos con nuestra API de filesystem, quedan en almacenamiento local del navegador y no salen de tu dispositivo.',
        contactTitle: '4. Contacto',
        contactBody:
          'Si tienes preguntas sobre esta politica, contactanos por medio de nuestro repositorio en GitHub.',
      }
    : {
        title: 'Privacy Policy',
        updated: 'Last updated: April 11, 2026',
        introTitle: '1. Introduction',
        introBody:
          'Welcome to Runboxjs. We respect your privacy and protect your personal data. Because Runboxjs runs entirely in your browser tab, we do not collect, transmit, or store the code or files you execute in the virtual environment.',
        dataTitle: '2. Data We Collect',
        dataBody:
          'We only collect minimal analytics to understand usage of our landing page and docs, such as page views, browser types, and referral sources. None of this data is linked to code executed in Runboxjs.',
        localTitle: '3. Local Storage and Execution',
        localBody:
          'All execution happens on your local machine using WebAssembly and modern browser APIs. If you persist data through our filesystem API, it remains in local browser storage and never leaves your device.',
        contactTitle: '4. Contact',
        contactBody:
          'If you have any questions about this policy, contact us through our GitHub repository.',
      };

  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4 border-b border-anthropic-light-gray/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight">{copy.title}</h1>
          <p className="text-lg font-lora text-anthropic-mid-gray">{copy.updated}</p>
        </header>

        <section className="flex flex-col gap-6 font-lora text-anthropic-light-gray leading-relaxed">
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light">{copy.introTitle}</h2>
          <p>{copy.introBody}</p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">{copy.dataTitle}</h2>
          <p>{copy.dataBody}</p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">{copy.localTitle}</h2>
          <p>{copy.localBody}</p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">{copy.contactTitle}</h2>
          <p>{copy.contactBody}</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
