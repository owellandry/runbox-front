import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEs = i18n.resolvedLanguage?.startsWith('es');

  const copy = isEs
    ? {
        title: 'Terminos de Servicio',
        updated: 'Ultima actualizacion: April 11, 2026',
        t1: '1. Aceptacion de los terminos',
        b1: 'Al acceder o usar Runboxjs, aceptas estos terminos. Si no estas de acuerdo con alguna parte, no debes usar el servicio.',
        t2: '2. Uso del servicio',
        b2: 'Runboxjs proporciona un entorno Node.js en navegador. El servicio se ofrece tal cual y segun disponibilidad, sin garantia de disponibilidad continua ni ausencia de errores.',
        t3: '3. Uso aceptable',
        b3: 'Aceptas no usar Runboxjs para codigo malicioso, malware o actividades ilegales. Aunque la ejecucion es local, el uso indebido esta prohibido.',
        t4: '4. Licencia open source',
        b4: 'La libreria principal de Runboxjs es open source y se distribuye bajo licencia MIT. Tu uso, modificacion y distribucion de la libreria se rige por esa licencia.',
        t5: '5. Limitacion de responsabilidad',
        b5: 'Runboxjs y sus contribuidores no seran responsables por danos directos o indirectos derivados del acceso o uso del servicio.',
      }
    : {
        title: 'Terms of Service',
        updated: 'Last updated: April 11, 2026',
        t1: '1. Acceptance of Terms',
        b1: 'By accessing or using Runboxjs, you agree to these terms. If you disagree with any part, you may not use the service.',
        t2: '2. Use of Service',
        b2: 'Runboxjs provides a browser-based Node.js runtime. The service is provided as is and as available, without guarantees of uninterrupted availability or error-free operation.',
        t3: '3. Acceptable Use',
        b3: 'You agree not to use Runboxjs for malicious code, malware distribution, or unlawful activity. Even though execution is local, misuse is prohibited.',
        t4: '4. Open Source License',
        b4: 'The core Runboxjs library is open source and licensed under MIT. Your use, modification, and distribution of the library are governed by that license.',
        t5: '5. Limitation of Liability',
        b5: 'Runboxjs and its contributors are not liable for direct or indirect damages arising from access to or use of the service.',
      };

  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4 border-b border-anthropic-light-gray/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight">{copy.title}</h1>
          <p className="text-lg font-lora text-anthropic-mid-gray">{copy.updated}</p>
        </header>

        <section className="flex flex-col gap-6 font-lora text-anthropic-light-gray leading-relaxed">
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light">{copy.t1}</h2>
          <p>{copy.b1}</p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">{copy.t2}</h2>
          <p>{copy.b2}</p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">{copy.t3}</h2>
          <p>{copy.b3}</p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">{copy.t4}</h2>
          <p>{copy.b4}</p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">{copy.t5}</h2>
          <p>{copy.b5}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
