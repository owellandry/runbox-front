import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4 border-b border-anthropic-light-gray/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight">Privacy Policy</h1>
          <p className="text-lg font-lora text-anthropic-mid-gray">Last updated: April 11, 2026</p>
        </header>

        <section className="flex flex-col gap-6 font-lora text-anthropic-light-gray leading-relaxed">
          <h2 className="text-2xl font-poppins font-medium text-anthropic-light">1. Introduction</h2>
          <p>
            Welcome to Runboxjs. We respect your privacy and are committed to protecting your personal data. 
            Because Runboxjs operates entirely within your browser tab, we do not collect, transmit, or store 
            any of the code you write, execute, or the files you manipulate within the virtual environment.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">2. Data We Collect</h2>
          <p>
            We collect minimal analytics data to understand how our landing page and documentation are used. 
            This may include standard web metrics such as page views, browser types, and referral sources.
            None of this data is linked to the code you execute in the Runboxjs environment.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">3. Local Storage and Execution</h2>
          <p>
            All execution happens on your local machine using WebAssembly and modern browser APIs. 
            If you choose to persist data using our FileSystem API, that data remains strictly within 
            your browser's local storage mechanisms (like IndexedDB or OPFS) and never leaves your device.
          </p>

          <h2 className="text-2xl font-poppins font-medium text-anthropic-light mt-8">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;