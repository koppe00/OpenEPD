/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // De provider-kant werkt, dus dit pad is waarschijnlijk goed:
    "./apps/provider-dashboard/app/**/*.{js,ts,jsx,tsx,mdx}",
    
    // VOEG DIT PAD EXPLICIET TOE:
    "./apps/patient-portal/app/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Voor de zekerheid ook deze (mocht je components mappen hebben):
    "./apps/patient-portal/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Hier kun je later specifieke OpenEPD kleuren toevoegen
      colors: {
        emerald: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
}