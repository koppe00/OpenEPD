// Verander de eerste regel van listmodels.js:
require('dotenv').config({ path: './.env.local' }); 

console.log("Sleutel gecheckt in script:", process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "Aanwezig" : "Niet gevonden");


const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
  console.log("📡 Vragen aan Google welke modellen beschikbaar zijn...");
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ FOUT BIJ GOOGLE:", data.error.message);
      console.log("👉 Waarschijnlijk moet je een nieuwe API key maken.");
    } else if (data.models) {
      console.log("✅ GEVONDEN MODELLEN:");
      data.models.forEach(model => {
        // We tonen alleen modellen die content kunnen genereren
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
          console.log(`   - ${model.name.replace('models/', '')}`);
        }
      });
      console.log("\n💡 KIES EEN VAN DEZE NAMEN VOOR IN JE SCRIPT.");
    } else {
      console.log("⚠️ Geen modellen gevonden. Heel vreemd.");
      console.log(data);
    }
  } catch (error) {
    console.error("❌ Netwerkfout:", error);
  }
}

listModels();