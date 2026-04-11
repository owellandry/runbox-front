import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4 border-b border-anthropic-light-gray/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight">Terms of Service</h1>
          <p className="text-lg font-lora text-anthropic-mid-gray">Last updated: April 11, 2026</p>
        </header>

        <section className="flex flex-col gap-6 font-lora text-anthropic-light-gray leading-relaxed">
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light">1. Agreement to Terms</h2>
          <p>
            By accessing or using Runboxjs, you agree to be bound by these Terms. 
            If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">2. Use of Service</h2>
          <p>
            Runboxjs provides an in-browser Node.js runtime environment. The service is provided 
            "as is" and "as available". We do not guarantee that the service will be uninterrupted, 
            secure, or error-free.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">3. Acceptable Use</h2>
          <p>
            You agree not to use Runboxjs to execute malicious code, distribute malware, or 
            engage in any activity that violates local, national, or international law. Even though 
            execution happens locally, using our tools for illegal purposes is strictly prohibited.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">4. Open Source License</h2>
          <p>
            The core Runboxjs library is open-source and subject to the terms of the MIT License. 
            Your use, modification, and distribution of the library itself are governed by that license.
          </p>
          
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">5. Limitation of Liability</h2>
          <p>
            In no event shall Runboxjs or its contributors be liable for any direct, indirect, 
            incidental, special, consequential, or punitive damages arising out of your access 
            to or use of or inability to access or use the service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;