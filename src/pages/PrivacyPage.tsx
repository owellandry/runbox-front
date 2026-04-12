import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4 border-b border-anthropic-light-gray/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight">Política de Privacidad</h1>
          <p className="text-lg font-lora text-anthropic-mid-gray">Última actualización: 11 de Abril, 2026</p>
        </header>

        <section className="flex flex-col gap-6 font-lora text-anthropic-light-gray leading-relaxed">
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light">1. Introducción</h2>
          <p>
            Bienvenido a Runboxjs. Respetamos tu privacidad y estamos comprometidos a proteger tus datos personales. 
            Debido a que Runboxjs opera enteramente dentro de la pestaña de tu navegador, no recopilamos, transmitimos, ni almacenamos 
            ningún código que escribas, ejecutes, ni los archivos que manipules dentro del entorno virtual.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">2. Datos que Recopilamos</h2>
          <p>
            Recopilamos datos analíticos mínimos para entender cómo se utilizan nuestra página de inicio y nuestra documentación. 
            Esto puede incluir métricas web estándar como vistas de página, tipos de navegador y fuentes de referencia.
            Ninguno de estos datos está vinculado al código que ejecutas en el entorno de Runboxjs.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">3. Almacenamiento y Ejecución Local</h2>
          <p>
            Toda la ejecución ocurre en tu máquina local usando WebAssembly y APIs modernas del navegador. 
            Si decides persistir datos usando nuestra API de FileSystem, esos datos permanecen estrictamente dentro 
            de los mecanismos de almacenamiento local de tu navegador (como IndexedDB u OPFS) y nunca salen de tu dispositivo.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">4. Contáctanos</h2>
          <p>
            Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos a través de nuestro repositorio en GitHub.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;