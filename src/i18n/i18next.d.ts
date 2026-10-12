import 'i18next';
import type en from './locales/en.json';

// Typed translation keys: t('unknown_key') does not compile
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translations';
        resources: { translations: typeof en };
        keySeparator: false;
    }
}
