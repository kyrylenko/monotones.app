
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        buy_us_coffee: "Monotones - is absolutely free. And our mission is to make the quality of life a little bit better.\r\nYour donation directly helps the maintenance and further development of Monotones.\r\nJust name a fair amount you willing to donate us",
        sleep: "Sleep",
        relax: "Relax",
        focus: "Focus",
        share: "Share",
        share_sounds: "Share sounds",
        donate: "Donate",
        playing_now: "Playing now",
        save_mixture: "Save mixture",
        mixture_name: "Mixture name",
        save: "Save",
        about: "About",
        terms: "Terms",
        contact: "Contact",
        email: "E-mail",
        cell: "Cell",
        privacy_policy: "Privacy Policy",
        privacy_policy_content: "Pavlo Kyrylenko built the Monotones app as a Freemium app. This SERVICE is provided by Pavlo Kyrylenko at no cost and is intended for use as is. This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service. If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy. The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Monotones unless otherwise defined in this Privacy Policy.",
        information_collection_and_use: "Information Collection and Use",
        information_collection_and_use_content: "For a better experience using our Service, I may require you to provide certain personal information. The information I request will be stored on your device and will not be collected by me in any way. The application uses third-party services that can collect information that is used to identify you. Link to the privacy policy of third-party service providers used by the application: Google Play Services",
        log_data: "Log Data",
        log_data_content: "I want to inform you that whenever you use my Service, in a case of an error in the app I collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing my Service, the time and date of your use of the Service, and other statistics.",
        сookies: "Cookies",
        сookies_content: "Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory. This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.",
        service_providers: "Service Providers",
        service_providers_header: "I may employ third-party companies and individuals due to the following reasons:",
        service_providers_one: "To facilitate our Service;",
        service_providers_two: "To provide the Service on our behalf;",
        service_providers_three: "To perform Service-related services; or",
        service_providers_four: "To assist us in analyzing how our Service is used.",
        service_providers_five: "I want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.",
        security: "Security",
        security_content: "I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.",
        links_to_other_sites: "Links to Other Sites",
        links_to_other_sites_content: "This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
        childrens_privacy: "Children’s Privacy",
        childrens_privacy_content: "These Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to do necessary actions.",
        changes_to_this_privacy_policy: "Changes to This Privacy Policy",
        changes_to_this_privacy_policy_content: "I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page",
        contact_us: "Contact Us",
        contact_us_content: "Don't hesitate to contact us if you have any questions.",
      }
    },
    uk: {
      translations: {
        buy_us_coffee: "Монотони - є і будуть абсолютно безкоштовні. Наша місія - хоча б трохи покращити якість життя.\r\nВаші пожертвування безпосередньо сприяють підтримці та подальшому розвитку Монотонів.\r\nПросто вкажіть суму, яку ви готові нам пожертвувати",
        sleep: "Сон",
        relax: "Релакс",
        focus: "Фокус",
        share: "Поширити",
        share_sounds: "Поширити звуки",
        donate: "Пожертва",
        playing_now: "Грають зараз",
        save_mixture: "Зберегти мікс",
        mixture_name: "Назва міксу",
        save: "Зберегти",
        about: "Про нас",
        terms: "Умови",
        contact: "Зв'язок",
        email: "Мейл",
        cell: "Моб",
        privacy_policy: "Політика конфіденційності",
        privacy_policy_content: "Павло Кириленко створив додаток Monotones як додаток Freemium. Ця СЛУЖБА надається Павлом Кириленком безкоштовно і призначена для використання як є. Ця сторінка використовується для інформування відвідувачів щодо моєї політики щодо збору, використання та розкриття особистої інформації, якщо хтось вирішив скористатися моєю службою. Якщо ви вирішили скористатися моєю службою, ви погоджуєтесь на збір та використання інформації стосовно цієї політики. Особиста інформація, яку я збираю, використовується для надання та вдосконалення Послуги. Я не буду використовувати або передавати вашу інформацію нікому, крім випадків, описаних у цій Політиці конфіденційності. Терміни, які використовуються в цій Політиці конфіденційності, мають те саме значення, що і в наших Загальних положеннях та умовах, яка доступна на Monotones, якщо інше не визначено в цій Політиці конфіденційності.",
        information_collection_and_use: "Збір та використання інформації",
        information_collection_and_use_content: "Для кращого досвіду, використовуючи нашу Службу, я можу вимагати від вас надати певну особисту інформацію. Інформація, яку я запитую, зберігатиметься на вашому пристрої і не збирається мною жодним чином. Додаток використовує сторонні сервіси, які можуть збирати інформацію, яка використовується для ідентифікації вас. Посилання на політику конфіденційності сторонніх постачальників послуг, якими користується додаток: Служби Google Play",
        log_data: "Логування Даних",
        log_data_content: "Хочу повідомити, що коли ви користуєтесь моєю Службою, у випадку помилки в додатку я збираю дані та інформацію (через сторонні продукти) на вашому телефоні під назвою Журнал даних. Ці дані журналу можуть містити інформацію, таку як Інтернет-протокол вашого пристрою (“IP”), ім’я пристрою, версія операційної системи, конфігурація програми при використанні моєї служби, час і дата використання вашої служби та інші статистичні дані.",
        сookies: "Файли cookie",
        сookies_content: "Файли cookie - це файли з невеликою кількістю даних, які зазвичай використовуються як анонімні унікальні ідентифікатори. Вони надсилаються у ваш браузер із веб-сайтів, які ви відвідуєте, і зберігаються у внутрішній пам’яті вашого пристрою. Ця Служба не використовує ці «куки» явно. Однак додаток може використовувати код третьої сторони та бібліотеки, які використовують «куки» для збору інформації та покращення своїх послуг. У вас є можливість прийняти або відмовитись від цих файлів cookie та знати, коли файл cookie надсилається на ваш пристрій. Якщо ви вирішите відмовитись від наших файлів cookie, ви, можливо, не зможете використовувати деякі частини цієї Служби.",
        service_providers: "Постачальники послуг",
        service_providers_header: "Я можу наймати сторонні компанії та фізичних осіб з наступних причин:",
        service_providers_one: "Щоб покращити наш Сервіс;",
        service_providers_two: "Щоб надавати Сервіс від нашого імені;",
        service_providers_three: "Надавати послуги, пов'язані з технічним обслуговуванням; або",
        service_providers_four: "Щоб проаналізувати, як використовується наша Служба.",
        service_providers_five: "Хочу повідомити користувачів цієї Служби, що ці треті сторони мають доступ до вашої особистої інформації. Причина - виконувати покладені на них завдання від нашого імені. Однак вони зобов'язані не розголошувати та не використовувати інформацію для будь-яких інших цілей.",
        security: "Безпека",
        security_content: "Я ціную вашу довіру в наданні нам вашої особистої інформації, тому ми прагнемо використовувати комерційно прийнятні засоби її захисту. Але пам’ятайте, що жоден спосіб передачі через Інтернет або метод електронного зберігання не є надійним і надійним на 100%, і я не можу гарантувати його абсолютну безпеку.",
        links_to_other_sites: "Посилання на інші сайти",
        links_to_other_sites_content: "Ця Служба може містити посилання на інші сайти. Якщо ви натиснете на сторонні посилання, ви перейдете на цей сайт. Зауважте, що ці зовнішні сайти не експлуатуються мною. Тому я настійно раджу переглянути політику конфіденційності цих веб-сайтів. Я не контролюю і не несу відповідальності за вміст, політику конфіденційності або практику будь-яких сторонніх сайтів чи служб.",
        childrens_privacy: "Конфіденційність для дітей",
        childrens_privacy_content: "Ці Служби не звертаються до когось молодше 13 років. Я свідомо не збираю особисту інформацію від дітей до 13 років. Якщо я виявлю, що дитина до 13 років надала мені особисту інформацію, я негайно видаляю її з наших серверів. Якщо ви є батьком чи опікуном, і ви знаєте, що ваша дитина надала нам особисту інформацію, будь ласка, зв’яжіться зі мною, щоб я зміг зробити необхідні дії.",
        changes_to_this_privacy_policy: "Зміни цієї Політики конфіденційності",
        changes_to_this_privacy_policy_content: "Я можу час від часу оновлювати нашу Політику конфіденційності. Таким чином, вам рекомендується періодично переглядати цю сторінку на предмет будь-яких змін. Я повідомляю вас про будь-які зміни, розміщуючи нову Політику конфіденційності на цій сторінці. Ці зміни набувають чинності відразу після публікації на цій сторінці.",
        contact_us: "Зв'яжіться з нами",
        contact_us_content: "Якщо у вас виникли запитання, не соромтеся зв'язатися з нами.",
      }
    },
  },
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

export default i18n;