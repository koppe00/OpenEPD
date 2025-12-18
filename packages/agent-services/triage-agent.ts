// packages/agent-services/triage-agent.ts

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';

// Load environment variables (zelfde betrouwbare methode)
dotenv.config({ path: path.join(process.cwd(), '.env.local') }); 

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

// We gebruiken de ANONYMOUS key voor leesacties, de RLS-regels zijn nog niet toegepast
const supabase = createClient(supabaseUrl, supabaseKey);

// --- MOCK Notifier Service (Zou later de echte packages/notifier zijn) ---
function sendUrgentNotification(ehrId: string, message: string) {
    console.log(`\n🚨 ACTIE VEREIST: ${ehrId}`);
    console.log(`✉️ Melding verstuurd: ${message}`);
    // In een echt systeem: Roept packages/notifier aan om mail/push te sturen.
}
// --------------------------------------------------------------------------

async function runTriageAgent() {
    console.log("🧠 Triage Agent (AI Layer) Gestart...");

    // 1. DATA OPHALEN (Query Store)
    const { data: vitals, error } = await supabase
        .from('vitals_read_store')
        .select('ehr_id, systolic, diastolic, recorded_at')
        .order('recorded_at', { ascending: false });

    if (error) {
        console.error("❌ FOUT bij lezen Query Store:", error.message);
        return;
    }

    if (!vitals || vitals.length === 0) {
        console.log("   Geen vitale functies gevonden om te analyseren.");
        return;
    }

    let triageCount = 0;
    
    // 2. ANALYSE (Business Rules / AI Inference)
    for (const vital of vitals) {
        // AI RULE (Zeer simpele versie): Systolische bloeddruk > 120 (normaal)
        const CRITICAL_SYSTOLIC_THRESHOLD = 120; 

        if (vital.systolic > CRITICAL_SYSTOLIC_THRESHOLD) {
            triageCount++;

            // 3. ACTIE (Agentic Response)
            const message = `Systolische bloeddruk is kritiek hoog (${vital.systolic} mmHg) op ${new Date(vital.recorded_at).toLocaleTimeString()}. Actie vereist!`;
            sendUrgentNotification(vital.ehr_id, message);
            
            // In een complexere Agent: Creëer een 'task' in de workflow-logic voor de arts.

            // Reset de teller om niet voor elke meting te waeren
            break; 
        }
    }

    if (triageCount === 0) {
        console.log("✅ Geen kritieke triage-gevallen gevonden. Systeem stabiel.");
    }
    
    console.log("\n---------------------------------------------------");
}

runTriageAgent();