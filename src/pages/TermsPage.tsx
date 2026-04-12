import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4 border-b border-anthropic-light-gray/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight">Términos de Servicio</h1>
          <p className="text-lg font-lora text-anthropic-mid-gray">Última actualización: 11 de Abril, 2026</p>
        </header>

        <section className="flex flex-col gap-6 font-lora text-anthropic-light-gray leading-relaxed">
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light">1. Aceptación de los Términos</h2>
          <p>
            Al acceder o usar Runboxjs, aceptas estar sujeto a estos Términos. 
            Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">2. Uso del Servicio</h2>
          <p>
            Runboxjs proporciona un entorno de ejecución de Node.js en el navegador. El servicio se proporciona 
            "tal cual" y "según disponibilidad". No garantizamos que el servicio será ininterrumpido, 
            seguro o libre de errores.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">3. Uso Aceptable</h2>
          <p>
            Aceptas no usar Runboxjs para ejecutar código malicioso, distribuir malware o 
            participar en cualquier actividad que viole la ley local, nacional o internacional. Aunque 
            la ejecución ocurre localmente, el uso de nuestras herramientas para fines ilegales está estrictamente prohibido.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">4. Licencia de Código Abierto</h2>
          <p>
            La biblioteca principal de Runboxjs es de código abierto y está sujeta a los términos de la Licencia MIT. 
            Tu uso, modificación y distribución de la biblioteca misma están regidos por esa licencia.
          </p>
          
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">5. Limitación de Responsabilidad</h2>
          <p>
            En ningún caso Runboxjs o sus contribuyentes serán responsables de ningún daño directo, indirecto, 
            incidental, especial, consecuente o punitivo que surja de tu acceso 
            a o uso o incapacidad de acceder o usar el servicio.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;