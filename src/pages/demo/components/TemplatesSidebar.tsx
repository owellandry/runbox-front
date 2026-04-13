import React from 'react';
import { useTranslation } from 'react-i18next';
import { templates } from '../constants/templates';

interface TemplatesSidebarProps {
  onSelectTemplate: (templateName: string, files: Record<string, string>) => void;
  onConfirmTemplateLoad: (templateName: string) => Promise<boolean>;
}

export const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({ onSelectTemplate, onConfirmTemplateLoad }) => {
  const { t } = useTranslation();

  return (
    <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
      <div className="flex items-center px-4 py-3">
        <span className="text-xs font-poppins font-medium text-[#faf9f5]">{t('demo.templates.title')}</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-3">
        {templates.map(tpl => (
          <div
            key={tpl.id}
            onClick={async () => {
              const templateName = t(tpl.nameKey);
              const confirmLoad = await onConfirmTemplateLoad(templateName);
              if (confirmLoad) {
                onSelectTemplate(templateName, tpl.files);
              }
            }}
            className="p-3 rounded-lg border border-[#b0aea5]/10 bg-[#1e1e1d] hover:border-[#d97757]/50 hover:bg-[#1e1e1d]/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center justify-center w-6 h-6">{tpl.icon}</div>
              <span className="text-sm font-medium text-[#faf9f5] group-hover:text-[#d97757] transition-colors">{t(tpl.nameKey)}</span>
            </div>
            <p className="text-xs text-[#b0aea5] leading-relaxed">
              {t(tpl.descriptionKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
