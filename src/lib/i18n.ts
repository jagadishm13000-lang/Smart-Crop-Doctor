import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "Smart Crop Doctor",
      "slogan": "AI Powered Agricultural Excellence",
      "login": "Login",
      "login_subtitle": "Securely access your farm's digital assistant",
      "continue_google": "Continue with Google",
      "login_phone": "Login with Phone",
      "phone_placeholder": "Enter Mobile Number",
      "send_otp": "Send OTP",
      "verify_otp": "Verify OTP",
      "enter_otp": "Enter 4-digit OTP",
      "verify_success": "Verification Successful",
      "welcome": "Welcome",
      "onboarding_title": "Choose Your Language",
      "onboarding_subtitle": "Select a language for your farming journey",
      "current_lang": "Language",
      "dashboard": "Dashboard",
      "marketplace": "Marketplace",
      "schemes": "Schemes",
      "chatbot": "ChatBot",
      "logout": "Logout",
      "explore": "Explore",
      "start_farming": "Start Your Farming Journey",
      "scanner_mode": "AI Disease Scanner",
      "weather_advisor": "Weather Advisor",
      "voice_assistant": "Voice Assistant"
    }
  },
  kn: {
    translation: {
      "app_name": "ಸ್ಮಾರ್ಟ್ ಕ್ರಾಪ್ ಡಾಕ್ಟರ್",
      "slogan": "AI ಚಾಲಿತ ಕೃಷಿ ಉತ್ಕೃಷ್ಟತೆ",
      "login": "ಲಾಗಿನ್",
      "login_subtitle": "ನಿಮ್ಮ ಜಮೀನಿನ ಡಿಜಿಟಲ್ ಸಹಾಯಕರನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಪ್ರವೇಶಿಸಿ",
      "continue_google": "ಗೂಗಲ್ ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ",
      "login_phone": "ಫೋನ್ ಮೂಲಕ ಲಾಗಿನ್ ಮಾಡಿ",
      "phone_placeholder": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
      "send_otp": "OTP ಕಳುಹಿಸಿ",
      "verify_otp": "OTP ಪರಿಶೀಲಿಸಿ",
      "enter_otp": "4-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
      "verify_success": "ಪರಿಶೀಲನೆ ಯಶಸ್ವಿಯಾಗಿದೆ",
      "welcome": "ಸ್ವಾಗತ",
      "onboarding_title": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
      "onboarding_subtitle": "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಯಾಣಕ್ಕಾಗಿ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      "current_lang": "ಭಾಷೆ",
      "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "marketplace": "ಮಾರುಕಟ್ಟೆ",
      "schemes": "ಯೋಜನೆಗಳು",
      "chatbot": "ಚಾಟ್‌ಬಾಟ್",
      "logout": "ನಿರ್ಗಮಿಸಿ",
      "explore": "ಅನ್ವೇಷಿಸಿ",
      "start_farming": "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ",
      "scanner_mode": "AI ರೋಗ ಸ್ಕ್ಯಾನರ್",
      "weather_advisor": "ಹವಾಮಾನ ಸಲಹೆಗಾರ",
      "voice_assistant": "ಧ್ವನಿ ಸಹಾಯಕ"
    }
  },
  hi: {
    translation: {
      "app_name": "स्मार्ट क्रॉप डॉक्टर",
      "slogan": "AI संचालित कृषि उत्कृष्टता",
      "login": "लॉगिन",
      "login_subtitle": "अपने खेत के डिजिटल सहायक तक सुरक्षित पहुंचें",
      "continue_google": "गूगल के साथ जारी रखें",
      "login_phone": "फोन से लॉगिन करें",
      "phone_placeholder": "मोबाइल नंबर दर्ज करें",
      "send_otp": "OTP भेजें",
      "verify_otp": "OTP सत्यापित करें",
      "enter_otp": "4-अंकीय OTP दर्ज करें",
      "verify_success": "सत्यापन सफल",
      "welcome": "स्वागत है",
      "onboarding_title": "अपनी भाषा चुनें",
      "onboarding_subtitle": "अपनी कृषि यात्रा के लिए भाषा चुनें",
      "current_lang": "भाषा",
      "dashboard": "डैशबोर्ड",
      "marketplace": "बाजार",
      "schemes": "योजनाएं",
      "chatbot": "चैटबॉट",
      "logout": "लॉगआउट",
      "explore": "एक्सप्लोर करें",
      "start_farming": "अपनी कृषि यात्रा शुरू करें",
      "scanner_mode": "AI रोग स्कैनर",
      "weather_advisor": "मौसम सलाहकार",
      "voice_assistant": "आवाज सहायक"
    }
  },
  ta: { translation: { "onboarding_title": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", "current_lang": "மொழி" } },
  te: { translation: { "onboarding_title": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಎంచుకోండి", "current_lang": "ಭಾಷೆ" } },
  mr: { translation: { "onboarding_title": "तुमची भाषा निवडा", "current_lang": "भाषा" } },
  ml: { translation: { "onboarding_title": "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക", "current_lang": "ഭാഷ" } },
  bn: { translation: { "onboarding_title": "আপনার ভাষা চয়ন করুন", "current_lang": "ভাষা" } },
  gu: { translation: { "onboarding_title": "તમારી ભાષા પસંદ કરો", "current_lang": "ભાષા" } },
  pa: { translation: { "onboarding_title": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ", "current_lang": "ਭਾਸ਼ਾ" } }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('agro_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
