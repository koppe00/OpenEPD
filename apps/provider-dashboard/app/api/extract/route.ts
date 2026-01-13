import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import extractFromTranscript from '../../../lib/extractionEngine';
import { ZibValidationService } from '@openepd/clinical-core';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript, patientId, metadata, caregiverId, context } = body;

    if (!transcript) return NextResponse.json({ error: 'transcript required' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine caregiver_id: from request body, or use patient as fallback
    const effectiveCaregiverId = caregiverId || patientId;

    // Extract user context for AI config resolution
    const aiContext = context || {};

    // 1) Extract structured ZIBs using Gemini with context-aware configuration
    console.log('[Extract API] Starting extraction for transcript length:', transcript.length);
    console.log('[Extract API] AI Context:', aiContext);
    const extraction = await extractFromTranscript(transcript, undefined, aiContext);
    console.log('[Extract API] Extraction result:', {
      zibCount: extraction.zibs?.length || 0,
      zibTypes: extraction.zibs?.map((z: any) => z.zib_id) || []
    });

    // 2) Persist raw AI extraction for audit trail
    const { data: aiRow, error: aiError } = await supabase
      .from('ai_extractions')
      .insert([
        {
          patient_id: patientId || null,
          transcript,
          extraction,
          metadata: metadata || null,
          source: 'gemini-ai',
        },
      ])
      .select('*')
      .single();

    if (aiError) {
      console.error('[Extract API] ai_extractions insert error:', aiError);
    }

    // 3) Validate and persist ALL ZIBs via ZibValidationService
    const validationResults: any[] = [];
    const insertResults: any[] = [];

    if (patientId && Array.isArray(extraction.zibs) && extraction.zibs.length > 0) {
      for (const zib of extraction.zibs) {
        try {
          // Validate ZIB using official schemas
          const validation = ZibValidationService.validate(zib.zib_id, zib.values);
          
          const isValid = validation.success;
          const errors = validation.success ? [] : validation.error?.issues?.map(i => `${i.path.join('.')}: ${i.message}`) || [];
          
          validationResults.push({
            zib_id: zib.zib_id,
            valid: isValid,
            errors: errors
          });

          if (!isValid) {
            console.warn(`[Extract API] ZIB validation failed for ${zib.zib_id}:`, errors);
            // Continue anyway - store invalid data for manual review
          }

          // Prepare ZIB for database insertion
          const zibRow = {
            patient_id: patientId,
            caregiver_id: effectiveCaregiverId,
            zib_id: zib.zib_id,
            zib_version: '2020-NL',
            content: zib.values,
            effective_at: zib.effective_at || new Date().toISOString(),
            source_system: 'OpenEPD-AI',
            recorded_at: new Date().toISOString(),
            clinical_status: 'active',
            verification_status: isValid ? 'unverified' : 'invalid'
          };

          // Insert ZIB into database
          const { data, error } = await supabase
            .from('zib_compositions')
            .insert([zibRow])
            .select('*')
            .single();

          if (error) {
            console.error(`[Extract API] Failed to insert ${zib.zib_id}:`, error);
            insertResults.push({ zib_id: zib.zib_id, success: false, error: error.message });
          } else {
            console.log(`[Extract API] Successfully inserted ${zib.zib_id}`);
            insertResults.push({ zib_id: zib.zib_id, success: true, id: data.id });
          }

        } catch (e) {
          console.error(`[Extract API] Error processing ${zib.zib_id}:`, e);
          insertResults.push({ 
            zib_id: zib.zib_id, 
            success: false, 
            error: e instanceof Error ? e.message : String(e) 
          });
        }
      }
    }

    console.log('[Extract API] Processing complete:', {
      totalZibs: extraction.zibs?.length || 0,
      successful: insertResults.filter(r => r.success).length,
      failed: insertResults.filter(r => !r.success).length,
      validationIssues: validationResults.filter(v => !v.valid).length
    });

    return NextResponse.json({
      success: true,
      extraction: extraction, // Return full extraction with zibs array for ReviewConsoleModal
      stats: {
        zibs_extracted: extraction.zibs?.length || 0,
        zibs_validated: validationResults.filter(v => v.valid).length,
        zibs_stored: insertResults.filter(r => r.success).length
      },
      validation_results: validationResults,
      insert_results: insertResults,
      ai_extraction_id: aiRow?.id || null,
    });

  } catch (error) {
    console.error('[Extract API] Fatal error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
