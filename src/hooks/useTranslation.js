import { useCallback } from 'react';
import { translations } from '../translations';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = useCallback((key, variables = {}) => {
    const translation = translations[language]?.[key] || translations.en[key] || key;
    
    if (typeof variables === 'object' && Object.keys(variables).length > 0) {
      return Object.entries(variables).reduce((text, [key, value]) => {
        return text.replace(`\${${key}}`, value);
      }, translation);
    }
    
    return translation;
  }, [language]);

  return { t, language };
};
