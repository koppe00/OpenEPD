import axios from 'axios';

// Configuratie (in een echte app komt dit uit .env)
const EHRBASE_URL = 'http://localhost:8080/ehrbase/rest/openehr/v1';
const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:password').toString('base64'),
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// De archetype ID voor de EHR Status zelf
const EHR_STATUS_ARCHETYPE_ID = 'openEHR-EHR-EHR_STATUS.ehr_status.v1'; 

async function runMedicalHelloWorld() {
  console.log("🏥 OPEN-EPD: Start verbinding met Klinische Kern...");

  try {
    // NIEUW: De onnodige en defecte System Check is verwijderd.
    // We gaan direct naar de hoofdtaak.
    
    // STAP 1: Maak een Patiënt Dossier (EHR)
    console.log("   ...Nieuw dossier aanmaken...");
    
    const response = await axios.post(
      `${EHRBASE_URL}/ehr`,
      {
        "_type": "EHR_STATUS",
        "archetype_node_id": EHR_STATUS_ARCHETYPE_ID, 
        "is_queryable": true,
        "is_modifiable": true,
        "subject": {
          "external_ref": {
            "id": {
              "_type": "HIER_OBJECT_ID",
              "value": `PATIENT-${Math.floor(Math.random() * 9000) + 1000}`
            },
            "namespace": "OPEN-EPD",
            "type": "PERSON"
          }
        }
      },
      { headers: AUTH_HEADER }
    );

    const ehrId = response.data.ehr_id.value;
    
    console.log("\n✅ SUCCES! Gedeeld Dossier Aangemaakt.");
    console.log("---------------------------------------------------");
    console.log(`📂 EHR ID (De Kern):   ${ehrId}`);
    console.log(`🔗 Status:   Klaar voor de Agentic Architectuur`);
    console.log("---------------------------------------------------");

  } catch (error: any) {
    console.error("\n❌ FOUT: De communicatie faalde bij de hoofdtaak.");
    if (error.response) {
       console.error("   Melding:", error.response.data);
    } else {
       console.error("   Melding:", error.message);
    }
  }
}

runMedicalHelloWorld();