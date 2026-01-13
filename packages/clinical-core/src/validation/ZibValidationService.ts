import { z } from 'zod';
import * as Schemas from './schemas';
import { ZibTranslations } from './translations'; 

/**
 * ZibValidationService
 * Centrale engine voor de validatie en opslag-preparatie van ZIB 2024.1 bouwstenen.
 * 100% Gold Standard Compliance voor alle 10 hoofdgroepen (126 ZIB's).
 */
export class ZibValidationService {
  
  // Registry laden met ALLE schemas uit alle groepen
  private static registry: Record<string, z.ZodSchema> = {
    ...Schemas.Metingen,
    ...Schemas.KlinischeContext,
    ...Schemas.BehandelingEnProces,
    ...Schemas.Medicatie,
    ...Schemas.PatientenContext,
    ...Schemas.Administratief,
    ...Schemas.Scorelijsten,
    ...Schemas.Zelfzorg,
    ...Schemas.ProcesPatronen,
    ...Schemas.Subbouwstenen,
    ...Schemas.NarratieveVerslaglegging,
  };

  /**
   * Helper om velden te genereren (Fallback voor als ZIB_CONFIG ontbreekt)
   */
  static getFieldsForZib(zibId: string) {
    const schema = this.registry[zibId];
    if (!schema) return [];

    let targetSchema = schema;
    if (targetSchema instanceof z.ZodEffects) targetSchema = targetSchema._def.schema;
    if (!(targetSchema instanceof z.ZodObject)) return [];

    return Object.entries(targetSchema.shape).map(([fieldName, fieldSchema]: [string, any]) => {
      const label = fieldSchema.description || fieldName;
      let type = 'text';
      let options: { value: string, label: string }[] = [];

      if (fieldSchema instanceof z.ZodNumber) type = 'number';
      if (fieldSchema instanceof z.ZodBoolean) type = 'boolean';
      
      if (fieldSchema instanceof z.ZodEnum) {
        type = 'select';
        options = fieldSchema.options.map((opt: string) => ({
          value: opt,
          label: ZibTranslations[fieldName]?.[opt] || opt 
        }));
      }

      return { name: fieldName, type, options, label };
    });
  }

  /**
   * De "Total Set" Pre-processor.
   * Converteert HTML form strings naar de juiste datatypes o.b.v. ZIB 2024 definities.
   */
  private static preProcess(zibId: string, data: any) {
    const d = { ...data };

    // =========================================================================
    // 1. NUMERIEKE VELDEN (ZIB 2024 COMPLETE SET)
    // =========================================================================
    const numericFields = [
      // Groep 1: Metingen
      'respiratory_rate', 'spo2', 'systolic', 'diastolic', 'mean_arterial_pressure',
      'weight_value', 'length_value', 'temperature_value', 'head_circumference', 
      'waist_circumference', 'pulse_rate', 'heart_rate', 'result_value', 
      'reference_range_low', 'reference_range_high', 'visual_acuity', 'sphere', 
      'cylinder', 'axis', 'prism', 'vertex_distance', 'total_input', 'total_output', 'balance',

      // Groep 2: Klinische Context
      'width_value', 'depth_value', 'extent_percentage', 'lumen_count', 'gauge', 
      'insertion_length', 'gravidity', 'parity', 'frequency', 'quantity_per_feed',
      'apgar_1min', 'apgar_5min', 'apgar_10min',

      // Groep 4 & 5: Medicatie & Patienten Context
      'dosage_value', 'administered_amount', 'quantity', 'refills_remaining',
      'amount', 'pack_years', 'number_of_children', 'onset_age',
      'percentage', 'duration_minutes', 'frequency_per_week', 'calories_per_day',

      // Groep 7 & 8: Zelfzorg & Scorelijsten (Subscores)
      'walking_distance', 'appearance', 'pulse', 'grimace', 'activity', 'respiration',
      'eye_score', 'motor_score', 'verbal_score', 
      'bmi_score', 'weight_loss_score', 'illness_score', 'appetite_loss', 'weight_loss', 'capability_loss',
      'bowels', 'bladder', 'grooming', 'toilet_use', 'feeding', 'transfer', 'mobility', 
      'dressing', 'stairs', 'bathing', 'face', 'legs', 'cry', 'consolability',
      'alertness', 'calmness', 'respiratory_response', 'crying', 'physical_movement', 
      'muscle_tone', 'facial_tension', 'subjective_assessment', 'high_risk_disease', 
      'nutritional_intake', 'upper_arm_circumference',

      // Groep 10: Subbouwstenen
      'strength_value', 'duration_value', 'minimum_value', 'maximum_value',

      // Generieke scores
      'total_score', 'score', 'pain_score', 'visual_analog_score',
      'das28_score', 'tender_joint_count', 'swollen_joint_count', 'general_health_vas'
    ];

    numericFields.forEach(key => {
      if (key in d) {
        const value = d[key];
        if (value !== undefined && value !== null && value !== '' && !isNaN(Number(value))) {
          d[key] = Number(value);
        } else if (value === '') {
          d[key] = undefined; 
        }
      }
    });

    // =========================================================================
    // 2. BOOLEAN VELDEN (CHECKBOXES & TOGGLES)
    // =========================================================================
    const booleanFields = [
      'supplemental_oxygen', 'intubated', 'mask_used', 'pacemaker_present', 
      'extra_oxygen_administration', 'aid_used', 'multiple_birth', 
      'multiple_birth_indicator', 'interpreter_required', 'donor_registered', 
      'organ_donor', 'living_will_present', 'binge_drinking', 'passive_smoking',
      'initial_contact_permitted', 'alarm_signs', 'pregnancy_indicator',
      'is_emergency_contact', 'as_needed'
    ];

    booleanFields.forEach(key => {
      if (d[key] !== undefined) {
        const val = d[key];
        if (typeof val === 'string') {
          d[key] = val.toLowerCase() === 'true' || val === '1' || val === 'on';
        } else if (typeof val === 'number') {
          d[key] = val === 1;
        }
      }
    });

    // =========================================================================
    // 3. DATUM VELDEN (ROBUUSTE FIX VOOR DATE & DATETIME-LOCAL)
    // =========================================================================
    const dateFields = [
      'onset_date', 'end_date', 'date', 'start_date', 'insertion_date', 
      'removal_date', 'dressing_date', 'due_date', 'administration_date', 
      'date_last_change', 'last_defecation_date', 'effective_date', 'target_date', 
      'observation_date', 'start_time', 'end_time', 'dispense_date', 'expiry_date', 
      'request_date', 'administration_time', 'agreement_date', 'birth_date', 
      'contact_date_time', 'admission_date_time', 'discharge_date_time', 'date_time', 
      'assessment_date', 'request_date_time', 'collection_date_time', 
      'registration_date_time', 'start_date_time', 'end_date_time', 'consult_date',
      'examination_date', 'follow_up_date', 'diagnosis_date', 'observation_date'
    ];

    dateFields.forEach(key => {
      const val = d[key];
      if (val && typeof val === 'string') {
        // Regex voor YYYY-MM-DD of YYYY-MM-DDTHH:mm
        const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(val);
        const isDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val);

        if (isDateOnly || isDateTime) {
          d[key] = new Date(val).toISOString();
        }
      } else if (val === '') {
        d[key] = undefined;
      }
    });

    return d;
  }

  /**
   * Valideert data tegen het geregistreerde Zod schema
   */
  static validate(zibId: string, data: any) {
    const schema = this.registry[zibId];
    if (!schema) {
      throw new Error(`ZIB [${zibId}] is niet geconfigureerd in de registry.`);
    }
    const processedData = this.preProcess(zibId, data);
    return schema.safeParse(processedData);
  }

  /**
   * Bereidt data voor database inclusief verplichte meta-data kolommen
   */
  static prepareForStorage(
    patientId: string, 
    caregiverId: string, 
    zibId: string, 
    data: any
  ) {
    const validation = this.validate(zibId, data);

    if (!validation.success) {
      const errorMsg = validation.error.issues
        .map(i => `${i.path.join('.')}: ${i.message}`)
        .join(', ');
      throw new Error(`Validatie mislukt voor ${zibId}: ${errorMsg}`);
    }

    return {
      patient_id: patientId,
      caregiver_id: caregiverId,
      zib_id: zibId,
      zib_version: '2024',
      clinical_status: 'active',
      verification_status: 'confirmed',
      confidentiality_code: 'N',
      effective_at: new Date().toISOString(),
      storage_status: 'sync_pending',
      source_system: 'OpenEPD-Sovereign',
      content: validation.data
    };
  }

  static getSupportedZibs(): string[] {
    return Object.keys(this.registry);
  }
}