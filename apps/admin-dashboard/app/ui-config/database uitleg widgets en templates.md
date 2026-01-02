De database gebruikt een slim, maar complex Mapping-systeem:

ui_widget_instances: Dit zijn de blokken op je scherm.
widget_sections: Deze tabel bevat de inhoudelijke velden van een widget. Cruciaal hier is de kolom zib_mapping.
zib_compositions: Hier staat de werkelijke medische data in de kolom content (type jsonb).
doc_sections: Deze tabel gebruikt target_zib_ref om naar dezelfde data te wijzen.

testqry: SELECT 
    inst.display_title AS widget_naam,
    sec.label AS veld_naam,
    sec.zib_mapping,
    comp.content->>'value' AS waarde, -- Haalt de waarde uit de JSON content
    comp.recorded_at
FROM ui_widget_instances inst
JOIN widget_definitions def ON inst.widget_definition_id = def.id
JOIN widget_sections sec ON sec.widget_definition_id = def.id
LEFT JOIN zib_compositions comp ON comp.zib_id = sec.zib_mapping
WHERE comp.patient_id = 'HIER_JE_PATIENT_UUID' -- Vul een test-ID in
ORDER BY inst.sort_order, sec.sort_order;