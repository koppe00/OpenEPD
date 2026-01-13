--
-- PostgreSQL database dump
--

\restrict lQxldIJSFrp4MrF2TYzvtND5KVHE0CimC6HnPuJSJILF9P2MiRJP4PaDkFC3hGa

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organizations (id, name, org_type, parent_id, agb_code, created_at) FROM stdin;
0f367149-c72c-45a6-803c-33a59d7f7882	TesteZiekenhuis OpenEPD	\N	01012345	2025-12-19 11:21:15.907064+00
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.groups (id, code, display_name, description, group_type, parent_group_id, organization_id, is_active, display_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, role_key, display_name, description, is_system_role, created_at) FROM stdin;
c941f0b4-5701-417c-a5b8-fbfc170efeae	admin	Systeembeheerder	\N	t	2025-12-29 22:44:37.393605+00
93b87528-0eb7-4d50-a568-161d880bd2e7	md_specialist	Medisch Specialist	\N	t	2025-12-29 22:44:37.393605+00
42717220-da46-485a-a559-bb6f3de180d1	nurse	Verpleegkundige	\N	t	2025-12-29 22:44:37.393605+00
1094b5ed-9383-4a57-af46-73211138be1c	support	Support Medewerker	\N	t	2025-12-29 22:44:37.393605+00
36292722-895c-4602-8786-d3533ed91cd8	patient	Patiënt	Standaardrol voor patiënten met beperkte toegang tot eigen dossier	t	2025-12-30 13:35:25.807328+00
\.


--
-- Data for Name: specialisms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.specialisms (id, code, display_name, description, agb_code, dhd_code, nictiz_code, is_active, display_order, created_at, updated_at) FROM stdin;
36d0ceaa-e35f-418c-9e20-2c9ea92727e0	NEURO	Neurologie	\N	\N	\N	\N	t	20	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
ee63a2b2-5a19-454c-a417-94b9530b6c3f	ORTHO	Orthopedie	\N	\N	\N	\N	t	30	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
eb64d547-6614-484c-8fba-5ef0f2cbe3ef	ONCO	Oncologie	\N	\N	\N	\N	t	40	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
faf156d8-2f43-4eab-97d7-89616ee1b364	PSYCH	Psychiatrie	\N	\N	\N	\N	t	50	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
b0cfe7f2-fca1-4e3d-bbe5-5fe4f5afaba2	CHIR	Chirurgie	\N	\N	\N	\N	t	70	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
2dd7d191-f84b-4a67-a1cf-e4e3ee93022d	GYNE	Gynaecologie	\N	\N	\N	\N	t	80	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
6be4654c-e409-417e-a835-605d87aa598a	PEDI	Pediatrie	\N	\N	\N	\N	t	90	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
d75e1a8a-bf86-4386-bfe9-d7d5fad521ae	DERMA	Dermatologie	\N	\N	\N	\N	t	100	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
525c5dcc-7f7a-4619-a27c-583bb1fdfeda	LONGGENEESKUNDE	Longgeneeskunde	\N	\N	\N	\N	t	1	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
6ddcbcc4-addb-4f12-8f0d-f2027b15ac13	HUISARTS	Huisarts	Huisartsgeneeskunde	0101	01	0101	t	1	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
c3d26e91-f5d9-4c9e-b7a3-d447f140c849	PSYCHIATRIE	Psychiatrie	Psychiatrie	0301	03	0301	t	2	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
589edd4d-8bcb-4c47-a5e4-bf7ac4bf39d7	PLASTISCHE_CHIRURGIE	Plastische chirurgie	Plastische chirurgie	0304	03	0304	t	4	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
bd394ce9-84f3-4538-8e22-89167296c8ae	ORTHOPEDIE	Orthopedie	Orthopedische chirurgie	0305	03	0305	t	5	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
cf603a69-bc4c-4f54-a2f9-f5a1d5959d62	UROLOGIE	Urologie	Urologie	0306	03	0306	t	6	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
c804f648-9516-4a89-b328-f48a6f6386b7	GYNAECOLOGIE	Gynaecologie/Obstetrie	Verloskunde en gynaecologie	0307	03	0307	t	7	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
9a14a1fe-1afd-47f9-bd02-b773dc3d3fbd	NEUROCHIRURGIE	Neurochirurgie	Neurochirurgie	0308	03	0308	t	8	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
3457e851-9e69-43dd-b8e6-5ae31c1bcb65	OOGHEELKUNDE	Oogheelkunde	Oogheelkunde	0310	03	0310	t	9	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
9d3ed087-860f-42b0-a1d7-472365321f5b	CARDIO	Cardiologie	Cardiologie	0320	03	0320	t	10	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
19c593f2-758b-4683-9890-b07a16377bf1	INTERNE	Interne geneeskunde	Interne geneeskunde	0313	03	0313	t	11	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
8956f6bf-c71e-4489-9a68-bd5a262ea669	DERMATOLOGIE	Dermatologie	Dermatologie en venerologie	0316	03	0316	t	12	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
e5f24c45-89d1-4bc4-b684-53ef11cc79c6	LONGZIEKTEN	Longziekten	Longziekten en tuberculose	0320	03	0320	t	13	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
d604dc06-8231-4511-b0bb-816f214bdfb3	REUMATOLOGIE	Reumatologie	Reumatologie	0324	03	0324	t	14	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
6ac02b09-587f-4aab-a409-07d6777a4c4f	ALLERGOLOGIE	Allergologie	Allergologie	0326	03	0326	t	15	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
bd5dbddb-48db-48ea-9b85-8b7e2e10695f	REVALIDATIE	Revalidatiegeneeskunde	Revalidatiegeneeskunde	0327	03	0327	t	16	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
930787a8-b0d0-4e1c-bce7-1c77ddf8177d	CARDIOCHIRURGIE	Cardio-thoracale chirurgie	Cardio-thoracale chirurgie	0328	03	0328	t	17	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
5e508160-13b7-4094-b4da-211b6872ae3a	CONSULTATIEF	Consultatieve psychiatrie	Consultatieve psychiatrie en liaison psychiatrie	0329	03	0329	t	18	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
7f40edc3-dd1a-456c-ac77-34b219d93d19	KNO	KNO	Keel-neus-oorheelkunde	0362	03	0362	t	19	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
9061377c-57df-4319-bf19-2bb840d38870	KINDERGENEESKUNDE	Kindergeneeskunde	Kindergeneeskunde	0316	03	0316	t	20	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
f8235b5c-3d27-4b12-8c23-9cbf9b17aefe	NEUROLOGIE	Neurologie	Neurologie	0318	03	0318	t	21	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
68a5f8f6-94d4-4f06-840c-8c4303fdf247	RADIOLOGIE	Radiologie	Radiologie	0361	03	0361	t	22	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
2e683f01-e0d6-45b2-b660-8c2126330ab0	RADIOTHERAPIE	Radiotherapie	Radiotherapie	0362	03	0362	t	23	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
532b6b97-d39f-41dd-8591-c5139ab2879a	NUCLEAIRE_GENEESKUNDE	Nucleaire geneeskunde	Nucleaire geneeskunde	0363	03	0363	t	24	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
59d0abec-d937-4d51-86fa-38c9e1c7d7f4	ANESTHESIOLOGIE	Anesthesiologie	Anesthesiologie	0389	03	0389	t	25	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
fec1418e-ad54-4afa-8b66-189f0ed1139d	PATHOLOGIE	Pathologie	Pathologie	0390	03	0390	t	26	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
5737770f-25bf-45c0-af88-e581501d9943	KLINISCHE_CHEMIE	Klinische chemie	Klinische chemie	0391	03	0391	t	27	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
61e7f1c7-fefa-4f2a-9b88-047903adb7de	MICROBIOLOGIE	Medische microbiologie	Medische microbiologie	0392	03	0392	t	28	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
1c759583-1b7b-4a41-91d7-58a899e079ab	ZIEKENHUISAPOTHEEK	Ziekenhuisapotheek	Ziekenhuisfarmacie	0393	03	0393	t	29	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
90935eef-21d8-47e4-b26e-bba80a83fc55	BEDRIJFSGENEESKUNDE	Bedrijfsgeneeskunde	Arbeid en gezondheid	0400	04	0400	t	30	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
efe09d3c-7948-4787-b3d8-b0f2d8504772	VERZEKERINGSGENEESKUNDE	Verzekeringsgeneeskunde	Verzekeringsgeneeskunde	0403	04	0403	t	31	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
b2d71c39-5e7a-40c5-bb7b-dd5180aa5e24	SPORTGENEESKUNDE	Sportgeneeskunde	Sportgeneeskunde	0404	04	0404	t	32	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
8236e483-dafa-442a-ad36-a50c8dc0fea0	VERPLEEGHUISGENEESKUNDE	Verpleeghuisgeneeskunde	Ouderengeneeskunde en verpleeghuisgeneeskunde	0405	04	0405	t	33	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
\.


--
-- Data for Name: work_contexts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.work_contexts (id, code, display_name, description, context_type, organization_id, is_active, display_order, created_at, updated_at, theme_config, icon_name, care_setting_legacy, requires_patient, config_metadata) FROM stdin;
4df2f171-aef3-4a2d-bd32-47e5423d5a5f	DAG	Dagdienst	\N	shift	\N	t	70	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#475569", "primary": "#64748b", "secondary": "#f1f5f9"}	Building2	\N	t	{}
db09cb98-9bcc-4793-adbf-6454bee4cf7b	AVOND	Avonddienst	\N	shift	\N	t	80	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#475569", "primary": "#64748b", "secondary": "#f1f5f9"}	Building2	\N	t	{}
7a00e6c2-b599-483f-8f25-b2bfa767ac10	NACHT	Nachtdienst	\N	shift	\N	t	90	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#475569", "primary": "#64748b", "secondary": "#f1f5f9"}	Building2	\N	t	{}
c831d50f-8f44-4040-9174-e1d8e8a8a15b	KLINIEK	Kliniek (Opname)	\N	location	\N	t	2	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#8b5cf6", "primary": "#7c3aed", "secondary": "#ede9fe"}	Building2	clinical	t	{}
1c63560a-a655-4cec-8bf7-ea9648ced0cd	SEH	Spoedeisende Hulp	\N	location	\N	t	3	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#ef4444", "primary": "#dc2626", "secondary": "#fee2e2"}	Ambulance	emergency	t	{}
3d8cfe35-c984-48cf-ba25-2431a8d069e8	IC	Intensive Care	\N	location	\N	t	4	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#f97316", "primary": "#ea580c", "secondary": "#ffedd5"}	Activity	intensive_care	t	{}
843927ce-0b2d-490b-9976-2d04e39fab89	OK	Operatiekamer	\N	location	\N	t	5	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#06b6d4", "primary": "#0891b2", "secondary": "#cffafe"}	Scissors	operating_room	t	{}
a356ea45-8b92-4103-b6f1-e6d879b8b35f	DAGBEHANDELING	Dagbehandeling	\N	location	\N	t	6	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#10b981", "primary": "#059669", "secondary": "#d1fae5"}	Clock	day_treatment	t	{}
dc17d99b-d292-4c2c-8356-fda7bf6a71fc	ADMIN	Beheer	\N	admin	\N	t	999	2026-01-08 19:03:43.738181+00	2026-01-08 19:03:43.738181+00	{"accent": "#475569", "primary": "#64748b", "secondary": "#f1f5f9"}	Settings	admin	f	{}
26687d16-50f9-43ef-aae2-15f857b1ccb1	POLI	Polikliniek	\N	location	\N	t	1	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00	{"accent": "#3b82f6", "primary": "#2563eb", "secondary": "#dbeafe"}	Stethoscope	polyclinic	t	{}
\.


--
-- Data for Name: ai_config_scopes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ai_config_scopes (id, scope_type, scope_value, scope_label, priority, parent_scope_id, metadata, created_at, specialism_id, group_id, work_context_id, organization_id, role_id) FROM stdin;
b1184d4f-eea5-4dd7-951a-9847a1e59e85	global	default	Global Default	100	\N	{}	2026-01-06 15:41:51.398485+00	\N	\N	\N	\N	\N
f40bb04b-1e59-4151-b162-a5f637aa72e1	specialisme	InterneGeneeskunde	Interne Geneeskunde	40	\N	{}	2026-01-06 15:45:14.138081+00	\N	\N	\N	\N	\N
8d1b1b31-1f0f-4ec2-b47c-2a51eb18ccf7	specialisme	Nucleaire Geneeskunde	Nucleaire Geneeskunde	40	\N	{}	2026-01-06 15:49:16.637146+00	\N	\N	\N	\N	\N
\.


--
-- Data for Name: ai_config_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ai_config_assignments (id, feature_id, scope_id, config, override_mode, valid_from, valid_until, is_active, created_at, updated_at, created_by, notes) FROM stdin;
87de1fef-177a-46c7-be2b-941d1acd8dd5	zib_extraction	b1184d4f-eea5-4dd7-951a-9847a1e59e85	{"enabled_zibs": ["nl.zorg.Bloeddruk", "nl.zorg.Hartfrequentie", "nl.zorg.Lichaamsgewicht", "nl.zorg.Anamnese", "nl.zorg.LichamelijkOnderzoek", "nl.zorg.Evaluatie", "nl.zorg.Beleid", "nl.zorg.PoliklinischConsult", "nl.zorg.DBCDeclaratie"]}	merge	2026-01-06 15:41:51.398485+00	\N	t	2026-01-06 15:41:51.398485+00	2026-01-06 15:41:51.398485+00	\N	\N
c0b67271-1cf5-4e88-b130-448dd3d6a729	clinical_summarization	b1184d4f-eea5-4dd7-951a-9847a1e59e85	{}	merge	2026-01-06 15:41:51.398485+00	\N	t	2026-01-06 15:41:51.398485+00	2026-01-06 15:41:51.398485+00	\N	\N
1fb2b5fe-a5e2-40de-a78b-5c16c821e8a2	coding_assistant	b1184d4f-eea5-4dd7-951a-9847a1e59e85	{}	merge	2026-01-06 15:41:51.398485+00	\N	t	2026-01-06 15:41:51.398485+00	2026-01-06 15:41:51.398485+00	\N	\N
426eee86-8eab-4843-a69f-9fbe5c1a0336	zib_extraction	f40bb04b-1e59-4151-b162-a5f637aa72e1	{"enabled_zibs": ["nl.zorg.OvergevoeligheidIntolerantie", "nl.zorg.TabakGebruik", "nl.zorg.Diagnose"], "custom_prompt": "Extra focus op inwendige geneeskunde"}	merge	2026-01-06 15:45:54.234389+00	\N	t	2026-01-06 15:45:54.234389+00	2026-01-06 15:45:54.234389+00	\N	\N
4030c2ea-e3a5-4c4c-a3f3-f834c92b81c7	nucleaire_zib_extraction	8d1b1b31-1f0f-4ec2-b47c-2a51eb18ccf7	{"enabled_zibs": ["nl.zorg.Bloeddruk", "nl.zorg.Hartfrequentie", "nl.zorg.Anamnese", "nl.zorg.LichamelijkOnderzoek", "nl.zorg.Evaluatie", "nl.zorg.Beleid", "nl.zorg.PoliklinischConsult", "nl.zorg.LaboratoriumUitslag", "nl.zorg.DBCDeclaratie", "nl.zorg.OvergevoeligheidIntolerantie", "nl.zorg.Medicatieafspraak", "nl.zorg.AandoeningOfGesteldheid"], "custom_prompt": "Leg nadruk op schildklier parameters en isotopen informatie indien relevant."}	merge	2026-01-06 18:04:01.928391+00	\N	t	2026-01-06 18:04:01.928391+00	2026-01-06 18:04:01.928391+00	\N	\N
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, full_name, uzi_number, bsn_number, wid_status, date_of_birth, updated_at, specialty, big_registration_number, avatar_url, app_role, first_name, last_name, gender, phone, address_street, address_house_number, address_zipcode, address_city, is_patient, email, initials, name_prefix, nickname, name_use, administrative_gender, gender_identity, nationality, preferred_language, marital_status, multiple_birth_indicator, contact_preference, insurance_data, emergency_contacts, consents, is_active) FROM stdin;
93e82c1b-014c-4843-ae9b-dacb0e6fd079	Dr. Anna Visser	\N	\N	unverified	\N	2025-12-30 20:47:53.175+00	\N	\N	\N	md_specialist	Anna	Visser	\N	0612345678	Teststraat	1	1234AB	Teststad	f	annavisser@testkliniek.nl	AV	\N	\N	official	\N	\N	NL	nl-NL	\N	f	\N	[]	[]	{}	t
2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	Dr. Peter de Vries	\N	\N	unverified	\N	2025-12-30 20:51:22.92+00	\N	\N	\N	admin	Peter	de Vries	\N	0612345679	Hoofdstraat	2	5678CD	Testdorp	f	peterdevries@testkliniek.nl	PdV	\N	\N	official	\N	\N	NL	nl-NL	\N	f	\N	[]	[]	{}	t
b8c8e2be-cfd0-4714-adaf-3f670b5164ed	Test User	UZI-99988877	\N	unverified	\N	2025-12-30 14:57:20.45+00	\N	\N	\N	md_specialist	Test	User	\N	0612345680	Kerkstraat	3	9012EF	Testplaats	f	testuser@openepd.nl	TU	\N	\N	official	\N	\N	NL	nl-NL	\N	f	\N	[]	[]	{}	t
d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	J Pietersen	\N	091401112	unverified	2022-11-11	2025-12-27 15:55:39.306+00	\N	\N	\N	patient	J	Pietersen	M	0612345678	Teststraat	2	1234 AB	Testwpl	t	pietersen@openepd.nl	\N	\N	\N	official	\N	\N	\N	nl-NL	\N	f	\N	[]	[]	{}	t
295226cf-6c4c-40fc-8c28-33d2fdca4332	Cornelis Markering	\N	438317038	unverified	19990-07-18	2025-12-27 18:33:30.132+00	\N	\N	\N	patient	Cornelis	Markering	\N	0612345697	Marietjespad	1	2345BK	Testwpl	t	testemail	CE			maiden	M	\N	NL	nl-NL	\N	f	\N	[{"uzovi": "3311", "insurer_name": "CZ Zorgverzekeraar", "policy_number": "2546987"}]	[{"name": "Pietje", "phone": "06589741354", "relationship": "Moeder"}]	{}	t
70000000-0000-0000-0000-000000000001	Jan de Vries	\N	123456788	verified	1955-05-12	2025-12-19 15:23:53.327933+00	\N	\N	\N	patient	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	official	\N	\N	\N	nl-NL	\N	f	\N	[]	[]	{}	t
70000000-0000-0000-0000-000000000002	Lotte van Dam	\N	987654321	verified	1988-11-23	2025-12-19 15:23:53.327933+00	\N	\N	\N	patient	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	official	\N	\N	\N	nl-NL	\N	f	\N	[]	[]	{}	t
70000000-0000-0000-0000-000000000003	Henk Zwart	\N	456123789	verified	1942-02-10	2025-12-19 15:23:53.327933+00	\N	\N	\N	patient	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	official	\N	\N	\N	nl-NL	\N	f	\N	[]	[]	{}	t
70000000-0000-0000-0000-000000000004	Eva Mulder	\N	321654987	verified	2001-08-15	2025-12-19 15:23:53.327933+00	\N	\N	\N	patient	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	official	\N	\N	\N	nl-NL	\N	f	\N	[]	[]	{}	t
246e25e7-9b5f-4712-85b2-5033682d8226	Jan Jansen	\N	123456789	unverified	1965-05-12	2025-12-19 11:43:30.878444+00	\N	\N	\N	patient	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	official	\N	\N	\N	nl-NL	\N	f	\N	[]	[]	{}	t
d2d97183-c6cc-4a74-b0fb-c4054447f6ed	Dr. Lisa Jansen	\N	\N	unverified	\N	2025-12-30 13:13:21.997+00	\N	\N	\N	md_specialist	Lisa	Jansen	\N	0612345681	Dorpstraat	4	3456GH	Testwijk	f	lisajansen@testkliniek.nl	LJ	\N	\N	official	\N	\N	NL	nl-NL	\N	f	\N	[]	[]	{}	t
\.


--
-- Data for Name: ui_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ui_templates (id, context_id, name, parent_template_id, is_active, created_at, allowed_roles, allowed_specialisms, allowed_organizations, allowed_groups, allowed_work_contexts, require_all_contexts, work_context_id, specialty_id) FROM stdin;
30527fa7-d37f-4d2e-ae38-c1bed3fc13b2	d747611a-3bf4-4e72-9ba4-ae1ea1ce9f81	Gynaecologie Standaard	\N	t	2025-12-30 19:59:38.192525+00	{}	{}	{}	{}	{}	f	26687d16-50f9-43ef-aae2-15f857b1ccb1	2dd7d191-f84b-4a67-a1cf-e4e3ee93022d
05df9f49-04ef-477b-bad4-072b13dfc9da	d747611a-3bf4-4e72-9ba4-ae1ea1ce9f81	Geriatrie Standaard	\N	t	2025-12-30 19:59:38.192525+00	{}	{}	{}	{}	{}	f	26687d16-50f9-43ef-aae2-15f857b1ccb1	8236e483-dafa-442a-ad36-a50c8dc0fea0
c56b6114-1d3e-4c33-a520-705bb14a7b7a	d747611a-3bf4-4e72-9ba4-ae1ea1ce9f81	KNO Standaard	\N	t	2025-12-30 19:59:38.192525+00	{}	{}	{}	{}	{}	f	26687d16-50f9-43ef-aae2-15f857b1ccb1	7f40edc3-dd1a-456c-ac77-34b219d93d19
a3b9b56b-c5d8-452c-9438-9eed255561b4	d747611a-3bf4-4e72-9ba4-ae1ea1ce9f81	Longgeneeskunde Master	\N	t	2025-12-30 20:11:18.206668+00	{}	{}	{}	{}	{}	f	26687d16-50f9-43ef-aae2-15f857b1ccb1	525c5dcc-7f7a-4619-a27c-583bb1fdfeda
70f913b2-5488-44bb-a573-8482d8b9cb98	d747611a-3bf4-4e72-9ba4-ae1ea1ce9f81	Interne Geneeskunde Master	\N	t	2025-12-30 19:56:37.397576+00	{}	{}	{}	{}	{}	f	26687d16-50f9-43ef-aae2-15f857b1ccb1	19c593f2-758b-4683-9890-b07a16377bf1
671666a3-b2ab-45d7-af34-d0bfe2b17972	d747611a-3bf4-4e72-9ba4-ae1ea1ce9f81	Chirurgie Standaard	\N	t	2025-12-30 19:59:38.192525+00	{}	{}	{}	{}	{}	f	26687d16-50f9-43ef-aae2-15f857b1ccb1	19c593f2-758b-4683-9890-b07a16377bf1
\.


--
-- Data for Name: widget_definitions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.widget_definitions (id, component_key, name, description, default_icon, engine_type) FROM stdin;
e833feaf-0a03-4582-87e7-b659112463f5	chi_note	Operatieverslag/Consult	\N	\N	form
aea43a3e-6b77-4016-ac3f-02b23d88c28e	gyn_vitals	Obstetrie	\N	\N	list
f817d221-348e-4f4e-92ae-771e6406c007	gyn_note	Gynaecologisch Consult	\N	\N	form
4df6d1c3-ebc8-4e15-93d2-050961be472b	gyn_flow	Workflow	\N	\N	list
4a853632-f055-4fc2-a285-d92946e33732	ger_vitals	Functioneel	\N	\N	list
4d354692-69f2-4d4d-a08d-915e134dbd33	ger_note	Geriatrisch Assessment	\N	\N	form
52d992b4-0355-4377-8421-6db556764f3d	ger_flow	Sociale Context	\N	\N	list
573c3326-0259-4dec-9d6b-81f1e04e9260	kno_note	KNO Onderzoek	\N	\N	form
8112d3b6-33c5-4e12-9685-8bc8efb5eb28	kno_flow	Behandeling	\N	\N	list
6ecf4780-e844-4adf-8bf0-f6871ce62746	resp_monitor	Vitals & Gaswisseling	\N	\N	list
a7b5a675-0dca-4989-8189-63ed902cbabf	social_context	Sociale Context	\N	\N	list
6eee843b-e884-46b3-9ef4-388627f55ce6	care_workflow	Behandeling & Workflow	\N	\N	list
1e984711-d2ad-4715-b624-81565d70b97e	chi_vitals	Wond & Status	\N	\N	list
a5147811-9ee8-49e3-875f-4123fdda4387	chi_flow	Interventies	\N	\N	list
f96153ac-f424-4a73-a51f-b7feba68a86c	kno_vitals	Zintuigen	\N	\N	list
39b5cf26-c405-4e8b-b3f8-7f7fa0172314	workflow_widget	Orders & Beleid	\N	\N	list
d7a77313-50b4-4425-badf-1d9f65949870	patient_context_widget	Klinische Context	\N	\N	list
754f261f-633e-447d-9cbc-3a53235fe559	ai_copilot_widget	AI Clinical Copilot	\N	\N	ai_copilot
51d67d3b-2b08-4a72-ab25-e2257e0e66a9	AIAssistantCard	AI Klinisch Assistent	Real-time klinische besluitsteun op basis van AI.	sparkles	intelligence
c78130de-6505-409d-94e3-d8f5030f2644	SmartTemplateEditor	Smart Consult Editor	Editor voor consultvoering met ZIB-mapping.	edit-3	list
f5781bd8-df00-4c77-8a1d-0a1c51129868	voice_assistant	Voice Assistant	Configuratie voor Voice Assistant	\N	voice_assistant
c18a7fc9-288c-42c5-8f37-c5e52d0609ae	ConsentStatus	Toestemmingsbeheer	Inzicht in toestemmingen voor gegevensuitwisseling.	lock	consent_status
5b9ea2cb-82b6-4672-b9bf-ea2a41014d7b	GuidelineCheck	Richtlijn Validatie	Controleert patiëntdata tegen protocollen.	shield-check	guideline_check
1f4c17d3-c6dd-464e-96bc-c425b85fcef6	zib_vital_widget	Metingen & Vitals	\N	\N	list
da5c64eb-e4e5-4229-8239-40293c891283	zib_note_widget	Consultvoering Interne Geneeskunde	\N	\N	form
5c803864-055c-473a-883d-468fbdec3abb	clinical_note	Klinisch Consult	\N	\N	form
9ca2e0f0-4c54-4381-afb9-6e203f93e5ed	laatste_uitslagen	Laatste Uitslagen	Configuratie voor Laatste Uitslagen	\N	list
1e75e0bb-5465-46ce-9cca-c9ebef9d78f6	lab_uitslagen	Lab Uitslagen	Configuratie voor Lab Uitslagen	\N	list
\.


--
-- Data for Name: ui_widget_instances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ui_widget_instances (id, template_id, widget_definition_id, region, sort_order, display_title, configuration, created_at) FROM stdin;
6535512e-fe3c-43e0-86a2-5dfee283c017	70f913b2-5488-44bb-a573-8482d8b9cb98	c18a7fc9-288c-42c5-8f37-c5e52d0609ae	left_sidebar	0		{}	2026-01-10 19:47:34.673065+00
4e338b3d-1033-485d-9369-6e778a4af93e	70f913b2-5488-44bb-a573-8482d8b9cb98	1f4c17d3-c6dd-464e-96bc-c425b85fcef6	left_sidebar	1	Vitals & Lab	{}	2026-01-10 19:47:34.673065+00
c121f74b-28c1-4725-bc4b-19b86742b1d1	70f913b2-5488-44bb-a573-8482d8b9cb98	d7a77313-50b4-4425-badf-1d9f65949870	left_sidebar	2	Context & Alerts	{}	2026-01-10 19:47:34.673065+00
060e31d3-9699-4661-a3f1-d751b069de37	70f913b2-5488-44bb-a573-8482d8b9cb98	da5c64eb-e4e5-4229-8239-40293c891283	main_content	3	Huidig Consult	{}	2026-01-10 19:47:34.673065+00
bd49f282-d899-4471-ba55-bae53fedcc24	70f913b2-5488-44bb-a573-8482d8b9cb98	f5781bd8-df00-4c77-8a1d-0a1c51129868	right_sidebar	4		{}	2026-01-10 19:47:34.673065+00
1aa12112-33d3-4bad-91fe-b431dcb1ee7d	70f913b2-5488-44bb-a573-8482d8b9cb98	754f261f-633e-447d-9cbc-3a53235fe559	right_sidebar	5	AI Assistent	{}	2026-01-10 19:47:34.673065+00
a782365a-1c06-4469-9c7a-6c8d71f61e4e	70f913b2-5488-44bb-a573-8482d8b9cb98	5b9ea2cb-82b6-4672-b9bf-ea2a41014d7b	right_sidebar	6		{}	2026-01-10 19:47:34.673065+00
31cd7aa4-086a-490c-80ec-d17ba23386e2	70f913b2-5488-44bb-a573-8482d8b9cb98	39b5cf26-c405-4e8b-b3f8-7f7fa0172314	right_sidebar	7	Workflow & Orders	{}	2026-01-10 19:47:34.673065+00
19296028-5f0f-4949-81c1-545a8695f604	30527fa7-d37f-4d2e-ae38-c1bed3fc13b2	aea43a3e-6b77-4016-ac3f-02b23d88c28e	left_sidebar	1	Zwangerschap & Vitals	{}	2025-12-30 19:59:38.192525+00
0568636b-5504-4e5a-870f-e215972b04a7	30527fa7-d37f-4d2e-ae38-c1bed3fc13b2	f817d221-348e-4f4e-92ae-771e6406c007	main_content	1	Anamnese & Onderzoek	{}	2025-12-30 19:59:38.192525+00
cdc23939-e2df-4030-998c-900e6065db10	30527fa7-d37f-4d2e-ae38-c1bed3fc13b2	4df6d1c3-ebc8-4e15-93d2-050961be472b	right_sidebar	1	Aanvragen & Echo	{}	2025-12-30 19:59:38.192525+00
85d3660f-eb14-45d1-82ab-f33808056db1	05df9f49-04ef-477b-bad4-072b13dfc9da	4a853632-f055-4fc2-a285-d92946e33732	left_sidebar	1	Zelfzorg & Mobiliteit	{}	2025-12-30 19:59:38.192525+00
bdb6dade-a3cc-4f08-8bf0-8ca9185ebac6	05df9f49-04ef-477b-bad4-072b13dfc9da	4d354692-69f2-4d4d-a08d-915e134dbd33	main_content	1	Comprehensive Assessment	{}	2025-12-30 19:59:38.192525+00
defb8641-e2ea-4b39-92d4-45b0e28ebac5	05df9f49-04ef-477b-bad4-072b13dfc9da	52d992b4-0355-4377-8421-6db556764f3d	right_sidebar	1	Sociaal & Wilsverklaring	{}	2025-12-30 19:59:38.192525+00
fda2edfe-6625-4f04-b53a-9b02778b1af0	c56b6114-1d3e-4c33-a520-705bb14a7b7a	f96153ac-f424-4a73-a51f-b7feba68a86c	left_sidebar	1	Functie Horen/Zien	{}	2025-12-30 19:59:38.192525+00
377085ae-1394-41f0-82d8-ef385b2c23ea	c56b6114-1d3e-4c33-a520-705bb14a7b7a	573c3326-0259-4dec-9d6b-81f1e04e9260	main_content	1	KNO Consult	{}	2025-12-30 19:59:38.192525+00
aa4a4b1d-b0c2-4b78-8090-cb972d9f87e4	c56b6114-1d3e-4c33-a520-705bb14a7b7a	8112d3b6-33c5-4e12-9685-8bc8efb5eb28	right_sidebar	1	Verrichting & Beleid	{}	2025-12-30 19:59:38.192525+00
634a97d9-0151-4797-bb05-983912e873f1	70f913b2-5488-44bb-a573-8482d8b9cb98	9ca2e0f0-4c54-4381-afb9-6e203f93e5ed	left_sidebar	8		{}	2026-01-10 19:47:34.673065+00
f4d9802c-228e-40f1-b372-280acf85e372	70f913b2-5488-44bb-a573-8482d8b9cb98	1e75e0bb-5465-46ce-9cca-c9ebef9d78f6	left_sidebar	9		{}	2026-01-10 19:47:34.673065+00
7bc90161-ac3a-4578-9ed2-b5501d970491	671666a3-b2ab-45d7-af34-d0bfe2b17972	1e984711-d2ad-4715-b624-81565d70b97e	left_sidebar	0	Wond & Lokale Status	{}	2025-12-30 21:12:16.750924+00
b7e5a95a-9fab-4410-9985-ab195c849c12	671666a3-b2ab-45d7-af34-d0bfe2b17972	e833feaf-0a03-4582-87e7-b659112463f5	main_content	1	Chirurgisch Consult	{}	2025-12-30 21:12:16.750924+00
51ee37e4-a2f4-4950-9b62-837a0c1ca7b0	671666a3-b2ab-45d7-af34-d0bfe2b17972	a5147811-9ee8-49e3-875f-4123fdda4387	right_sidebar	2	Verrichtingen & Planning	{}	2025-12-30 21:12:16.750924+00
234c1699-b8f1-4dd2-b5d2-faaa4bac7486	671666a3-b2ab-45d7-af34-d0bfe2b17972	754f261f-633e-447d-9cbc-3a53235fe559	right_sidebar	3		{}	2025-12-30 21:12:16.750924+00
dacfb3aa-0adb-4c8a-ba7f-34750806c981	a3b9b56b-c5d8-452c-9438-9eed255561b4	6ecf4780-e844-4adf-8bf0-f6871ce62746	left_sidebar	0	Gaswisseling (SPO2/Adem)	{}	2026-01-10 19:36:25.269085+00
e58bad2a-e1bb-4821-a638-8e4cf0cfd8f9	a3b9b56b-c5d8-452c-9438-9eed255561b4	5c803864-055c-473a-883d-468fbdec3abb	main_content	1	Consult Longgeneeskunde	{}	2026-01-10 19:36:25.269085+00
ff14c5fa-0181-49c9-94d0-2aa80e01a9ff	a3b9b56b-c5d8-452c-9438-9eed255561b4	754f261f-633e-447d-9cbc-3a53235fe559	right_sidebar	2	AI Assistant	{}	2026-01-10 19:36:25.269085+00
1498bb06-d6a9-4ed9-99c4-d0bf3565973e	a3b9b56b-c5d8-452c-9438-9eed255561b4	a7b5a675-0dca-4989-8189-63ed902cbabf	left_sidebar	3	Leefstijl (Roken/Allergie)	{}	2026-01-10 19:36:25.269085+00
6dfcdbbb-74fe-48e0-bd69-fc17b0658c6b	a3b9b56b-c5d8-452c-9438-9eed255561b4	6eee843b-e884-46b3-9ef4-388627f55ce6	right_sidebar	4	Beleid & Medicatie	{}	2026-01-10 19:36:25.269085+00
106a07c4-a14d-42d0-93ce-997488c86c5a	a3b9b56b-c5d8-452c-9438-9eed255561b4	9ca2e0f0-4c54-4381-afb9-6e203f93e5ed	left_sidebar	5		{}	2026-01-10 19:36:25.269085+00
bd129b30-19da-4799-a1be-dfddbfa9c381	a3b9b56b-c5d8-452c-9438-9eed255561b4	1e75e0bb-5465-46ce-9cca-c9ebef9d78f6	left_sidebar	6		{}	2026-01-10 19:36:25.269085+00
\.


--
-- Data for Name: user_active_contexts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_active_contexts (id, user_id, active_organization_id, active_role_id, active_specialism_id, active_group_id, active_work_context_id, last_updated, session_id, created_at) FROM stdin;
2855c3c3-a9b2-4047-9e48-a8e13a923d53	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	\N	c941f0b4-5701-417c-a5b8-fbfc170efeae	\N	\N	\N	2026-01-06 19:22:57.245067+00	\N	2026-01-06 19:22:57.245067+00
03eeb8fc-8f27-45ce-94ac-50ab4ac55e65	70000000-0000-0000-0000-000000000001	\N	36292722-895c-4602-8786-d3533ed91cd8	\N	\N	\N	2026-01-06 19:22:57.245067+00	\N	2026-01-06 19:22:57.245067+00
f5978cd4-7160-42e3-a61d-c2b73ae380a7	70000000-0000-0000-0000-000000000002	\N	36292722-895c-4602-8786-d3533ed91cd8	\N	\N	\N	2026-01-06 19:22:57.245067+00	\N	2026-01-06 19:22:57.245067+00
bb7b78e1-98a7-4850-b5a4-444b43527182	70000000-0000-0000-0000-000000000003	\N	36292722-895c-4602-8786-d3533ed91cd8	\N	\N	\N	2026-01-06 19:22:57.245067+00	\N	2026-01-06 19:22:57.245067+00
3572ac73-4dcc-4e2b-8934-ea02998ea685	70000000-0000-0000-0000-000000000004	\N	36292722-895c-4602-8786-d3533ed91cd8	\N	\N	\N	2026-01-06 19:22:57.245067+00	\N	2026-01-06 19:22:57.245067+00
597a4b2c-dbc9-4248-b874-362c7f66242c	246e25e7-9b5f-4712-85b2-5033682d8226	\N	36292722-895c-4602-8786-d3533ed91cd8	\N	\N	\N	2026-01-06 19:22:57.245067+00	\N	2026-01-06 19:22:57.245067+00
05fcefd6-ce49-4d65-8df6-8dd41c133edb	d2d97183-c6cc-4a74-b0fb-c4054447f6ed	\N	93b87528-0eb7-4d50-a568-161d880bd2e7	\N	\N	\N	2026-01-06 19:22:57.245067+00	\N	2026-01-06 19:22:57.245067+00
9f647308-0ad6-4406-8fdf-069c1a654332	93e82c1b-014c-4843-ae9b-dacb0e6fd079	\N	93b87528-0eb7-4d50-a568-161d880bd2e7	b0cfe7f2-fca1-4e3d-bbe5-5fe4f5afaba2	\N	26687d16-50f9-43ef-aae2-15f857b1ccb1	2026-01-08 21:12:40.418+00	\N	2026-01-06 19:22:57.245067+00
93bc7599-89d1-452b-ab2b-f6c7d89c352c	295226cf-6c4c-40fc-8c28-33d2fdca4332	\N	\N	\N	\N	26687d16-50f9-43ef-aae2-15f857b1ccb1	2026-01-09 19:59:14.84293+00	\N	2026-01-09 19:59:14.84293+00
74b9d04c-921f-4f40-99a1-81a7fffa88a7	d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	\N	\N	\N	\N	26687d16-50f9-43ef-aae2-15f857b1ccb1	2026-01-09 19:59:14.84293+00	\N	2026-01-09 19:59:14.84293+00
4f3e47eb-347b-445f-a3e6-7eddda8d13fb	b8c8e2be-cfd0-4714-adaf-3f670b5164ed	\N	93b87528-0eb7-4d50-a568-161d880bd2e7	19c593f2-758b-4683-9890-b07a16377bf1	\N	26687d16-50f9-43ef-aae2-15f857b1ccb1	2026-01-13 18:31:51.663+00	\N	2026-01-06 19:22:57.245067+00
\.


--
-- Data for Name: user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_groups (id, user_id, group_id, role_in_group, is_primary, valid_from, valid_until, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_organizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_organizations (id, user_id, organization_id, function_level, is_primary, valid_from, valid_until, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (id, user_id, role_id, is_primary, valid_from, valid_until, created_at, updated_at) FROM stdin;
af676dd8-661f-48b5-b3d7-44ed322397b7	246e25e7-9b5f-4712-85b2-5033682d8226	36292722-895c-4602-8786-d3533ed91cd8	t	2026-01-06	\N	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
9d9eb64c-9f1d-422f-abb7-6785105290bd	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	c941f0b4-5701-417c-a5b8-fbfc170efeae	t	2026-01-06	\N	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
f186a8d3-7a0f-454a-ad3a-63d6c51af11d	70000000-0000-0000-0000-000000000001	36292722-895c-4602-8786-d3533ed91cd8	t	2026-01-06	\N	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
7d364249-b38b-436e-b993-888746eadac6	70000000-0000-0000-0000-000000000002	36292722-895c-4602-8786-d3533ed91cd8	t	2026-01-06	\N	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
8ffd1a62-223d-49ea-884f-aafc93afcaf1	70000000-0000-0000-0000-000000000003	36292722-895c-4602-8786-d3533ed91cd8	t	2026-01-06	\N	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
1ec4f662-483f-4866-a9a9-6fc5551a7cb4	70000000-0000-0000-0000-000000000004	36292722-895c-4602-8786-d3533ed91cd8	t	2026-01-06	\N	2026-01-06 19:22:57.245067+00	2026-01-06 19:22:57.245067+00
21e39924-d6d3-4d51-855a-3b3037ded2e3	93e82c1b-014c-4843-ae9b-dacb0e6fd079	93b87528-0eb7-4d50-a568-161d880bd2e7	t	2026-01-08	\N	2026-01-08 21:12:56.711392+00	2026-01-08 21:12:56.711392+00
f959c8b4-b2f5-454d-9fb2-4c6b3ecd73c4	d2d97183-c6cc-4a74-b0fb-c4054447f6ed	93b87528-0eb7-4d50-a568-161d880bd2e7	t	2026-01-08	\N	2026-01-08 21:14:11.175341+00	2026-01-08 21:14:11.175341+00
aa4f37d2-f4e9-4a5e-bf83-af50b2e4d491	b8c8e2be-cfd0-4714-adaf-3f670b5164ed	93b87528-0eb7-4d50-a568-161d880bd2e7	t	2026-01-10	\N	2026-01-10 18:51:56.984836+00	2026-01-10 18:51:56.984836+00
68d7b4ef-e1f0-4329-960d-4df6943f9860	b8c8e2be-cfd0-4714-adaf-3f670b5164ed	c941f0b4-5701-417c-a5b8-fbfc170efeae	f	2026-01-10	\N	2026-01-10 18:51:56.984836+00	2026-01-10 18:51:56.984836+00
\.


--
-- Data for Name: user_specialisms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_specialisms (id, user_id, specialism_id, is_primary, valid_from, valid_until, created_at, updated_at) FROM stdin;
6ccc467a-276d-4315-b5be-59250e22ebcf	93e82c1b-014c-4843-ae9b-dacb0e6fd079	19c593f2-758b-4683-9890-b07a16377bf1	t	2026-01-08	\N	2026-01-08 21:12:56.772957+00	2026-01-08 21:12:56.772957+00
350f8588-79f7-45dd-94f8-111338db6e58	d2d97183-c6cc-4a74-b0fb-c4054447f6ed	c804f648-9516-4a89-b328-f48a6f6386b7	t	2026-01-08	\N	2026-01-08 21:14:11.276128+00	2026-01-08 21:14:11.276128+00
eba5e615-61b0-4f87-ac11-08d38b5c660c	d2d97183-c6cc-4a74-b0fb-c4054447f6ed	532b6b97-d39f-41dd-8591-c5139ab2879a	f	2026-01-08	\N	2026-01-08 21:14:11.276128+00	2026-01-08 21:14:11.276128+00
4853e1f3-be08-42a6-a878-53c252df6f3c	d2d97183-c6cc-4a74-b0fb-c4054447f6ed	19c593f2-758b-4683-9890-b07a16377bf1	f	2026-01-08	\N	2026-01-08 21:14:11.276128+00	2026-01-08 21:14:11.276128+00
eff61600-8dff-4a66-8889-8d5d0ee01ec1	93e82c1b-014c-4843-ae9b-dacb0e6fd079	b0cfe7f2-fca1-4e3d-bbe5-5fe4f5afaba2	f	2026-01-08	\N	2026-01-08 21:12:56.772957+00	2026-01-08 21:12:56.772957+00
334dba14-3a80-4846-9817-3521207f6bea	b8c8e2be-cfd0-4714-adaf-3f670b5164ed	19c593f2-758b-4683-9890-b07a16377bf1	t	2026-01-10	\N	2026-01-10 18:51:57.089092+00	2026-01-10 18:51:57.089092+00
44ea9337-49b3-4b6e-9a2d-933393912dac	b8c8e2be-cfd0-4714-adaf-3f670b5164ed	b0cfe7f2-fca1-4e3d-bbe5-5fe4f5afaba2	f	2026-01-10	\N	2026-01-10 18:51:57.089092+00	2026-01-10 18:51:57.089092+00
\.


--
-- Data for Name: user_work_contexts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_work_contexts (id, user_id, work_context_id, is_primary, valid_from, valid_until, created_at, updated_at) FROM stdin;
841082de-16b9-4fa3-8e6d-31db157c1e12	93e82c1b-014c-4843-ae9b-dacb0e6fd079	26687d16-50f9-43ef-aae2-15f857b1ccb1	t	2026-01-08	\N	2026-01-08 21:12:56.839446+00	2026-01-08 21:12:56.839446+00
88b9292d-7a9f-41a5-9942-fb40d9c9f164	93e82c1b-014c-4843-ae9b-dacb0e6fd079	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-08	\N	2026-01-08 21:12:56.839446+00	2026-01-08 21:12:56.839446+00
d902987e-2735-4138-9117-d8c3d4495bfd	d2d97183-c6cc-4a74-b0fb-c4054447f6ed	26687d16-50f9-43ef-aae2-15f857b1ccb1	t	2026-01-08	\N	2026-01-08 21:14:11.374262+00	2026-01-08 21:14:11.374262+00
27c51b7b-c989-445f-825a-ad67ba701130	d2d97183-c6cc-4a74-b0fb-c4054447f6ed	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-08	\N	2026-01-08 21:14:11.374262+00	2026-01-08 21:14:11.374262+00
fcffb52e-5d08-4308-9fc7-4273ed451b44	246e25e7-9b5f-4712-85b2-5033682d8226	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
32f73be1-745c-4e76-8e29-38110e998792	246e25e7-9b5f-4712-85b2-5033682d8226	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
552990b4-4d2d-4f1c-9e3b-36551324f6e4	246e25e7-9b5f-4712-85b2-5033682d8226	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
311f07a5-6c6f-461e-9050-29aa6521245d	246e25e7-9b5f-4712-85b2-5033682d8226	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
99e439a0-7fe5-4d8f-a4dc-b6fc66c2cef7	246e25e7-9b5f-4712-85b2-5033682d8226	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
634cd50d-8d02-45e3-9ebd-7df9bd2e3a0c	246e25e7-9b5f-4712-85b2-5033682d8226	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
892d7dea-0ea9-41e1-b220-b863dadd7d74	70000000-0000-0000-0000-000000000003	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
013394e8-de20-4c96-8b4f-cc6a73124c32	70000000-0000-0000-0000-000000000003	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
fe120701-97dd-4e83-b273-ab599fb03b4f	70000000-0000-0000-0000-000000000003	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
41ca5c26-53cf-411c-877b-52d7292a5929	70000000-0000-0000-0000-000000000003	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
a09fc63f-2db6-4ba0-a0e3-cf6623c5255f	70000000-0000-0000-0000-000000000003	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
2b0d2365-fd68-4fbb-ad29-facbe521d3b8	70000000-0000-0000-0000-000000000003	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
3aa19fc6-e488-4bd3-a813-d34b0ca67fa1	295226cf-6c4c-40fc-8c28-33d2fdca4332	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
3bfba9fa-04aa-434a-960b-d7b52cc36ebb	295226cf-6c4c-40fc-8c28-33d2fdca4332	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
7205c669-e9bc-467d-a3b8-6bcb923261dd	295226cf-6c4c-40fc-8c28-33d2fdca4332	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
acbd19a1-9cf8-4cbe-b2e0-6c95bad32bcf	295226cf-6c4c-40fc-8c28-33d2fdca4332	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
e8b69a11-29e9-4fac-8ac4-5c5658549e39	295226cf-6c4c-40fc-8c28-33d2fdca4332	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
2c8ff392-bd55-45ef-8d21-2070f874c3a3	295226cf-6c4c-40fc-8c28-33d2fdca4332	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
c62031ea-b1cb-4f65-8082-7031794d4a1f	70000000-0000-0000-0000-000000000004	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
f1e789cb-091f-43e0-a1a9-1346c925503f	70000000-0000-0000-0000-000000000004	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
de6a7ded-2640-4ba8-8ace-a9c04dfb897a	70000000-0000-0000-0000-000000000004	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
fab4dd63-f1fc-4276-aacb-9d6c864901b4	70000000-0000-0000-0000-000000000004	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
68c71df1-4006-4975-b5b4-8f95845ea3dd	70000000-0000-0000-0000-000000000004	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
070c8270-8a74-40c0-a855-e2a754af3e0b	70000000-0000-0000-0000-000000000004	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
f3650a50-6e42-4259-a2fd-a2f5ea1092fd	70000000-0000-0000-0000-000000000002	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
6744ba52-2564-49ef-800d-1a979a464ae4	70000000-0000-0000-0000-000000000002	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
522aea47-4db5-447c-8600-7ba027dbb50c	70000000-0000-0000-0000-000000000002	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
b2aa8c96-021f-45e4-a27d-5e12a862715c	70000000-0000-0000-0000-000000000002	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
ccaec8ab-37d9-4225-a9b5-d8d4794473b8	70000000-0000-0000-0000-000000000002	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
1224253e-b88d-43a6-886d-0e65c990d482	70000000-0000-0000-0000-000000000002	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
b2d058d5-fed3-4e34-a987-3d90818682c8	70000000-0000-0000-0000-000000000001	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
4522a4ee-8487-4abd-8c3b-11d9e3210280	70000000-0000-0000-0000-000000000001	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
09dfe478-c6f5-4818-8933-6d06a9d09e9c	70000000-0000-0000-0000-000000000001	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
0b94692d-0257-4f85-9e71-cd99ca782807	70000000-0000-0000-0000-000000000001	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
1d08cff6-450f-490c-abf9-b1c389ec4f9a	70000000-0000-0000-0000-000000000001	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
14a13c49-e4b5-4dc9-bcdc-5fe99f9c4753	70000000-0000-0000-0000-000000000001	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
13677d77-1969-4128-a200-1e010eee405b	d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
97dde539-d2e1-40a0-87fc-b01f7627e102	d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
b4e6c294-6d69-4ede-a492-6a7313a06ecd	d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
3514c60b-09f0-40fe-876f-24b79b578815	d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
37870cc6-0ec3-433d-ab49-c105e8c237e1	d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
1a1313c8-91c0-4399-8af5-fc4b5aec529c	d91a9bb2-c638-4f7a-9f78-f28bf4e2d902	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
33b0a857-0760-40ec-a058-c4d1a38a4424	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
fb9118e5-299c-4f18-9183-5970fec494f6	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	1c63560a-a655-4cec-8bf7-ea9648ced0cd	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
e56ec2a6-8177-48dd-9801-118d67566213	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	3d8cfe35-c984-48cf-ba25-2431a8d069e8	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
4d40d73a-d2ce-4573-a9a1-a218b701f729	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	843927ce-0b2d-490b-9976-2d04e39fab89	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
58b26360-2ed8-4a65-802a-7f3235a6734a	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	a356ea45-8b92-4103-b6f1-e6d879b8b35f	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
5b8e212c-b6b8-4e41-b769-05ee3b35ec9e	2b68e940-92e1-4dbc-9460-a0f5ed3e8eb4	26687d16-50f9-43ef-aae2-15f857b1ccb1	f	2026-01-09	\N	2026-01-09 19:59:14.84293+00	2026-01-09 19:59:14.84293+00
135d19f1-9622-4bce-96ad-eceaf3aaea93	b8c8e2be-cfd0-4714-adaf-3f670b5164ed	26687d16-50f9-43ef-aae2-15f857b1ccb1	t	2026-01-10	\N	2026-01-10 18:51:57.205759+00	2026-01-10 18:51:57.205759+00
89c2b29e-86f8-4f11-aca9-450d95fe683d	b8c8e2be-cfd0-4714-adaf-3f670b5164ed	c831d50f-8f44-4040-9174-e1d8e8a8a15b	f	2026-01-10	\N	2026-01-10 18:51:57.205759+00	2026-01-10 18:51:57.205759+00
\.


--
-- PostgreSQL database dump complete
--

\unrestrict lQxldIJSFrp4MrF2TYzvtND5KVHE0CimC6HnPuJSJILF9P2MiRJP4PaDkFC3hGa

