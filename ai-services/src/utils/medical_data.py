"""Comprehensive medical reference data for the MedAssist Global platform."""

# ---------------------------------------------------------------------------
# Symptom -> Specialty mapping  (60+ symptoms)
# Each symptom maps to a list of potentially relevant specialties and a
# base urgency weight (0.0 - 1.0) that feeds into the urgency classifier.
# ---------------------------------------------------------------------------

SYMPTOM_SPECIALTY_MAP: dict[str, dict] = {
    # --- Head / Neuro ---
    "headache":             {"specialties": ["Neurology", "General Medicine"], "urgency_weight": 0.3},
    "severe_headache":      {"specialties": ["Neurology", "Emergency Medicine"], "urgency_weight": 0.7},
    "migraine":             {"specialties": ["Neurology"], "urgency_weight": 0.4},
    "dizziness":            {"specialties": ["Neurology", "ENT", "General Medicine"], "urgency_weight": 0.4},
    "fainting":             {"specialties": ["Cardiology", "Neurology", "Emergency Medicine"], "urgency_weight": 0.7},
    "seizure":              {"specialties": ["Neurology", "Emergency Medicine"], "urgency_weight": 0.9},
    "confusion":            {"specialties": ["Neurology", "Emergency Medicine"], "urgency_weight": 0.8},
    "memory_loss":          {"specialties": ["Neurology", "Psychiatry"], "urgency_weight": 0.5},
    "numbness":             {"specialties": ["Neurology"], "urgency_weight": 0.5},
    "tingling":             {"specialties": ["Neurology", "General Medicine"], "urgency_weight": 0.3},
    "vision_changes":       {"specialties": ["Ophthalmology", "Neurology"], "urgency_weight": 0.5},
    "blurred_vision":       {"specialties": ["Ophthalmology"], "urgency_weight": 0.4},
    "sudden_vision_loss":   {"specialties": ["Ophthalmology", "Emergency Medicine"], "urgency_weight": 0.9},
    "speech_difficulty":    {"specialties": ["Neurology", "Emergency Medicine"], "urgency_weight": 0.9},

    # --- Cardiovascular ---
    "chest_pain":           {"specialties": ["Cardiology", "Emergency Medicine"], "urgency_weight": 0.9},
    "heart_palpitations":   {"specialties": ["Cardiology"], "urgency_weight": 0.5},
    "irregular_heartbeat":  {"specialties": ["Cardiology"], "urgency_weight": 0.6},
    "high_blood_pressure":  {"specialties": ["Cardiology", "General Medicine"], "urgency_weight": 0.5},
    "swollen_legs":         {"specialties": ["Cardiology", "Vascular Surgery"], "urgency_weight": 0.5},
    "shortness_of_breath":  {"specialties": ["Pulmonology", "Cardiology", "Emergency Medicine"], "urgency_weight": 0.7},

    # --- Respiratory ---
    "cough":                {"specialties": ["Pulmonology", "General Medicine"], "urgency_weight": 0.2},
    "chronic_cough":        {"specialties": ["Pulmonology"], "urgency_weight": 0.4},
    "wheezing":             {"specialties": ["Pulmonology", "Allergy & Immunology"], "urgency_weight": 0.5},
    "difficulty_breathing": {"specialties": ["Pulmonology", "Emergency Medicine"], "urgency_weight": 0.8},
    "coughing_blood":       {"specialties": ["Pulmonology", "Emergency Medicine"], "urgency_weight": 0.9},
    "sore_throat":          {"specialties": ["ENT", "General Medicine"], "urgency_weight": 0.2},

    # --- GI ---
    "abdominal_pain":       {"specialties": ["Gastroenterology", "General Surgery"], "urgency_weight": 0.5},
    "severe_abdominal_pain":{"specialties": ["Gastroenterology", "Emergency Medicine", "General Surgery"], "urgency_weight": 0.8},
    "nausea":               {"specialties": ["Gastroenterology", "General Medicine"], "urgency_weight": 0.3},
    "vomiting":             {"specialties": ["Gastroenterology", "General Medicine"], "urgency_weight": 0.4},
    "vomiting_blood":       {"specialties": ["Gastroenterology", "Emergency Medicine"], "urgency_weight": 0.9},
    "diarrhea":             {"specialties": ["Gastroenterology", "General Medicine"], "urgency_weight": 0.3},
    "bloody_stool":         {"specialties": ["Gastroenterology", "General Surgery"], "urgency_weight": 0.7},
    "constipation":         {"specialties": ["Gastroenterology", "General Medicine"], "urgency_weight": 0.2},
    "heartburn":            {"specialties": ["Gastroenterology"], "urgency_weight": 0.2},
    "difficulty_swallowing":{"specialties": ["Gastroenterology", "ENT"], "urgency_weight": 0.5},
    "bloating":             {"specialties": ["Gastroenterology", "General Medicine"], "urgency_weight": 0.2},
    "jaundice":             {"specialties": ["Gastroenterology", "Hepatology"], "urgency_weight": 0.6},

    # --- Musculoskeletal ---
    "back_pain":            {"specialties": ["Orthopedics", "General Medicine"], "urgency_weight": 0.3},
    "joint_pain":           {"specialties": ["Orthopedics", "Rheumatology"], "urgency_weight": 0.3},
    "muscle_pain":          {"specialties": ["Orthopedics", "General Medicine"], "urgency_weight": 0.2},
    "bone_fracture":        {"specialties": ["Orthopedics", "Emergency Medicine"], "urgency_weight": 0.8},
    "joint_swelling":       {"specialties": ["Rheumatology", "Orthopedics"], "urgency_weight": 0.4},
    "neck_pain":            {"specialties": ["Orthopedics", "Neurology"], "urgency_weight": 0.3},
    "limited_mobility":     {"specialties": ["Orthopedics", "Physical Medicine"], "urgency_weight": 0.4},

    # --- Skin ---
    "rash":                 {"specialties": ["Dermatology", "Allergy & Immunology"], "urgency_weight": 0.3},
    "skin_infection":       {"specialties": ["Dermatology", "General Medicine"], "urgency_weight": 0.4},
    "severe_burn":          {"specialties": ["Emergency Medicine", "Plastic Surgery"], "urgency_weight": 0.9},
    "wound":                {"specialties": ["Emergency Medicine", "General Surgery"], "urgency_weight": 0.5},
    "allergic_reaction":    {"specialties": ["Allergy & Immunology", "Emergency Medicine"], "urgency_weight": 0.6},
    "severe_allergic_reaction": {"specialties": ["Emergency Medicine"], "urgency_weight": 1.0},
    "itching":              {"specialties": ["Dermatology"], "urgency_weight": 0.2},
    "hives":                {"specialties": ["Dermatology", "Allergy & Immunology"], "urgency_weight": 0.4},

    # --- Urinary / Renal ---
    "painful_urination":    {"specialties": ["Urology", "General Medicine"], "urgency_weight": 0.4},
    "blood_in_urine":       {"specialties": ["Urology", "Nephrology"], "urgency_weight": 0.6},
    "frequent_urination":   {"specialties": ["Urology", "Endocrinology"], "urgency_weight": 0.3},
    "kidney_pain":          {"specialties": ["Nephrology", "Urology"], "urgency_weight": 0.6},

    # --- General / Systemic ---
    "fever":                {"specialties": ["General Medicine", "Infectious Disease"], "urgency_weight": 0.4},
    "high_fever":           {"specialties": ["General Medicine", "Emergency Medicine", "Infectious Disease"], "urgency_weight": 0.7},
    "fatigue":              {"specialties": ["General Medicine", "Endocrinology"], "urgency_weight": 0.2},
    "weight_loss":          {"specialties": ["General Medicine", "Endocrinology", "Oncology"], "urgency_weight": 0.4},
    "night_sweats":         {"specialties": ["General Medicine", "Infectious Disease", "Oncology"], "urgency_weight": 0.5},
    "swollen_lymph_nodes":  {"specialties": ["General Medicine", "Oncology", "Infectious Disease"], "urgency_weight": 0.5},
    "dehydration":          {"specialties": ["General Medicine", "Emergency Medicine"], "urgency_weight": 0.5},

    # --- Mental Health ---
    "anxiety":              {"specialties": ["Psychiatry", "Psychology"], "urgency_weight": 0.3},
    "depression":           {"specialties": ["Psychiatry", "Psychology"], "urgency_weight": 0.4},
    "insomnia":             {"specialties": ["Psychiatry", "Neurology"], "urgency_weight": 0.3},
    "panic_attack":         {"specialties": ["Psychiatry", "Emergency Medicine"], "urgency_weight": 0.5},

    # --- ENT ---
    "ear_pain":             {"specialties": ["ENT"], "urgency_weight": 0.3},
    "hearing_loss":         {"specialties": ["ENT", "Audiology"], "urgency_weight": 0.4},
    "nasal_congestion":     {"specialties": ["ENT", "General Medicine"], "urgency_weight": 0.2},
    "nosebleed":            {"specialties": ["ENT", "Emergency Medicine"], "urgency_weight": 0.4},

    # --- Eyes ---
    "eye_pain":             {"specialties": ["Ophthalmology"], "urgency_weight": 0.4},
    "eye_redness":          {"specialties": ["Ophthalmology"], "urgency_weight": 0.3},
    "eye_discharge":        {"specialties": ["Ophthalmology"], "urgency_weight": 0.3},

    # --- Dental ---
    "toothache":            {"specialties": ["Dentistry"], "urgency_weight": 0.3},
    "tooth_abscess":        {"specialties": ["Dentistry", "Oral Surgery"], "urgency_weight": 0.5},
    "jaw_pain":             {"specialties": ["Dentistry", "ENT"], "urgency_weight": 0.4},

    # --- Reproductive ---
    "pregnancy_complications": {"specialties": ["Obstetrics & Gynecology", "Emergency Medicine"], "urgency_weight": 0.8},
    "menstrual_irregularity":  {"specialties": ["Obstetrics & Gynecology"], "urgency_weight": 0.3},
    "pelvic_pain":             {"specialties": ["Obstetrics & Gynecology", "Urology"], "urgency_weight": 0.4},
}

# Urgency thresholds
URGENCY_THRESHOLDS = {
    "LOW": (0.0, 0.3),
    "MEDIUM": (0.3, 0.6),
    "HIGH": (0.6, 0.8),
    "EMERGENCY": (0.8, 1.01),
}

# Age modifiers - children and elderly are generally higher urgency
AGE_URGENCY_MODIFIER = {
    "child": 0.15,       # 0-12
    "adolescent": 0.05,  # 13-17
    "adult": 0.0,        # 18-64
    "elderly": 0.1,      # 65+
}

# Suggested actions per urgency level
URGENCY_ACTIONS = {
    "LOW": [
        "Schedule a routine appointment with a general practitioner",
        "Monitor symptoms for 24-48 hours",
        "Try over-the-counter remedies as appropriate",
        "Stay hydrated and rest",
    ],
    "MEDIUM": [
        "Schedule an appointment within the next 1-2 days",
        "Consult with a specialist if symptoms persist",
        "Avoid strenuous activity until evaluated",
        "Keep a symptom diary to share with your doctor",
    ],
    "HIGH": [
        "Seek medical attention within the next few hours",
        "Visit an urgent care center or walk-in clinic",
        "Do not drive yourself - have someone accompany you",
        "Bring a list of current medications",
    ],
    "EMERGENCY": [
        "Call emergency services (911) or go to the nearest emergency room IMMEDIATELY",
        "Do not wait - this requires urgent medical evaluation",
        "If possible, have someone drive you or call an ambulance",
        "Bring identification and insurance documents if readily available",
    ],
}

# ---------------------------------------------------------------------------
# Specialty descriptions
# ---------------------------------------------------------------------------

SPECIALTY_DESCRIPTIONS: dict[str, str] = {
    "General Medicine": "Primary care for diagnosis and treatment of common illnesses and preventive health.",
    "Emergency Medicine": "Immediate medical care for acute and life-threatening conditions.",
    "Cardiology": "Diagnosis and treatment of heart and cardiovascular system disorders.",
    "Neurology": "Treatment of disorders of the nervous system including brain and spinal cord.",
    "Pulmonology": "Diagnosis and treatment of lung and respiratory system diseases.",
    "Gastroenterology": "Treatment of digestive system disorders including stomach, intestines, and liver.",
    "Hepatology": "Specialized care for liver, gallbladder, biliary tree, and pancreas diseases.",
    "Orthopedics": "Treatment of musculoskeletal system including bones, joints, and muscles.",
    "Dermatology": "Diagnosis and treatment of skin, hair, and nail conditions.",
    "ENT": "Ear, Nose, and Throat specialist for conditions of the head and neck.",
    "Ophthalmology": "Medical and surgical care for eye conditions and vision disorders.",
    "Urology": "Treatment of urinary tract and male reproductive system disorders.",
    "Nephrology": "Kidney care including treatment of kidney diseases and dialysis.",
    "Psychiatry": "Diagnosis and treatment of mental health disorders.",
    "Psychology": "Psychological evaluation and therapy for mental health conditions.",
    "Rheumatology": "Treatment of autoimmune and inflammatory conditions affecting joints.",
    "Oncology": "Diagnosis and treatment of cancer.",
    "Endocrinology": "Treatment of hormonal disorders including diabetes and thyroid conditions.",
    "Allergy & Immunology": "Diagnosis and treatment of allergies and immune system disorders.",
    "Infectious Disease": "Treatment of infections including tropical and travel-related diseases.",
    "General Surgery": "Surgical treatment of abdominal organs, hernias, and soft tissue.",
    "Vascular Surgery": "Surgical treatment of blood vessel disorders.",
    "Plastic Surgery": "Reconstructive and cosmetic surgical procedures.",
    "Oral Surgery": "Surgical treatment of conditions affecting the mouth and jaw.",
    "Dentistry": "Oral health care including teeth and gum treatments.",
    "Obstetrics & Gynecology": "Women's reproductive health, pregnancy, and childbirth care.",
    "Physical Medicine": "Rehabilitation and physical therapy for movement disorders.",
    "Audiology": "Hearing evaluation and treatment of hearing disorders.",
}

# ---------------------------------------------------------------------------
# Procedures & typical costs by region (USD)
# ---------------------------------------------------------------------------

PROCEDURES: dict[str, dict] = {
    "general_consultation": {
        "name": "General Consultation",
        "category": "consultation",
        "costs_by_region": {
            "North America": {"min": 150, "max": 400},
            "Western Europe": {"min": 80, "max": 250},
            "Eastern Europe": {"min": 30, "max": 80},
            "South Asia": {"min": 10, "max": 40},
            "Southeast Asia": {"min": 15, "max": 60},
            "East Asia": {"min": 30, "max": 120},
            "Middle East": {"min": 40, "max": 150},
            "Latin America": {"min": 20, "max": 80},
            "Africa": {"min": 10, "max": 50},
        },
    },
    "specialist_consultation": {
        "name": "Specialist Consultation",
        "category": "consultation",
        "costs_by_region": {
            "North America": {"min": 250, "max": 600},
            "Western Europe": {"min": 120, "max": 350},
            "Eastern Europe": {"min": 40, "max": 120},
            "South Asia": {"min": 15, "max": 60},
            "Southeast Asia": {"min": 25, "max": 100},
            "East Asia": {"min": 50, "max": 200},
            "Middle East": {"min": 60, "max": 250},
            "Latin America": {"min": 30, "max": 120},
            "Africa": {"min": 15, "max": 70},
        },
    },
    "blood_test": {
        "name": "Blood Test (Complete Panel)",
        "category": "diagnostic",
        "costs_by_region": {
            "North America": {"min": 100, "max": 500},
            "Western Europe": {"min": 50, "max": 200},
            "Eastern Europe": {"min": 15, "max": 60},
            "South Asia": {"min": 5, "max": 30},
            "Southeast Asia": {"min": 10, "max": 50},
            "East Asia": {"min": 20, "max": 100},
            "Middle East": {"min": 25, "max": 120},
            "Latin America": {"min": 10, "max": 60},
            "Africa": {"min": 5, "max": 40},
        },
    },
    "xray": {
        "name": "X-Ray",
        "category": "diagnostic",
        "costs_by_region": {
            "North America": {"min": 100, "max": 1000},
            "Western Europe": {"min": 50, "max": 300},
            "Eastern Europe": {"min": 20, "max": 80},
            "South Asia": {"min": 10, "max": 40},
            "Southeast Asia": {"min": 15, "max": 60},
            "East Asia": {"min": 25, "max": 150},
            "Middle East": {"min": 30, "max": 150},
            "Latin America": {"min": 15, "max": 80},
            "Africa": {"min": 10, "max": 50},
        },
    },
    "mri_scan": {
        "name": "MRI Scan",
        "category": "diagnostic",
        "costs_by_region": {
            "North America": {"min": 500, "max": 3000},
            "Western Europe": {"min": 300, "max": 1500},
            "Eastern Europe": {"min": 100, "max": 400},
            "South Asia": {"min": 50, "max": 200},
            "Southeast Asia": {"min": 80, "max": 350},
            "East Asia": {"min": 100, "max": 600},
            "Middle East": {"min": 150, "max": 700},
            "Latin America": {"min": 80, "max": 400},
            "Africa": {"min": 60, "max": 300},
        },
    },
    "ct_scan": {
        "name": "CT Scan",
        "category": "diagnostic",
        "costs_by_region": {
            "North America": {"min": 300, "max": 2000},
            "Western Europe": {"min": 200, "max": 1000},
            "Eastern Europe": {"min": 60, "max": 250},
            "South Asia": {"min": 30, "max": 120},
            "Southeast Asia": {"min": 50, "max": 200},
            "East Asia": {"min": 80, "max": 400},
            "Middle East": {"min": 100, "max": 500},
            "Latin America": {"min": 50, "max": 250},
            "Africa": {"min": 40, "max": 200},
        },
    },
    "ultrasound": {
        "name": "Ultrasound",
        "category": "diagnostic",
        "costs_by_region": {
            "North America": {"min": 200, "max": 1000},
            "Western Europe": {"min": 100, "max": 400},
            "Eastern Europe": {"min": 30, "max": 100},
            "South Asia": {"min": 15, "max": 50},
            "Southeast Asia": {"min": 20, "max": 80},
            "East Asia": {"min": 30, "max": 200},
            "Middle East": {"min": 40, "max": 200},
            "Latin America": {"min": 20, "max": 100},
            "Africa": {"min": 15, "max": 60},
        },
    },
    "emergency_room_visit": {
        "name": "Emergency Room Visit",
        "category": "emergency",
        "costs_by_region": {
            "North America": {"min": 500, "max": 3000},
            "Western Europe": {"min": 200, "max": 1000},
            "Eastern Europe": {"min": 50, "max": 250},
            "South Asia": {"min": 20, "max": 100},
            "Southeast Asia": {"min": 30, "max": 200},
            "East Asia": {"min": 50, "max": 500},
            "Middle East": {"min": 80, "max": 500},
            "Latin America": {"min": 30, "max": 200},
            "Africa": {"min": 20, "max": 100},
        },
    },
    "ambulance_service": {
        "name": "Ambulance Service",
        "category": "emergency",
        "costs_by_region": {
            "North America": {"min": 500, "max": 5000},
            "Western Europe": {"min": 0, "max": 500},
            "Eastern Europe": {"min": 30, "max": 200},
            "South Asia": {"min": 10, "max": 80},
            "Southeast Asia": {"min": 20, "max": 150},
            "East Asia": {"min": 30, "max": 300},
            "Middle East": {"min": 50, "max": 400},
            "Latin America": {"min": 20, "max": 200},
            "Africa": {"min": 10, "max": 100},
        },
    },
    "dental_cleaning": {
        "name": "Dental Cleaning",
        "category": "dental",
        "costs_by_region": {
            "North America": {"min": 75, "max": 300},
            "Western Europe": {"min": 50, "max": 200},
            "Eastern Europe": {"min": 20, "max": 60},
            "South Asia": {"min": 10, "max": 30},
            "Southeast Asia": {"min": 15, "max": 50},
            "East Asia": {"min": 20, "max": 100},
            "Middle East": {"min": 30, "max": 120},
            "Latin America": {"min": 15, "max": 60},
            "Africa": {"min": 10, "max": 40},
        },
    },
    "dental_filling": {
        "name": "Dental Filling",
        "category": "dental",
        "costs_by_region": {
            "North America": {"min": 100, "max": 500},
            "Western Europe": {"min": 60, "max": 250},
            "Eastern Europe": {"min": 20, "max": 80},
            "South Asia": {"min": 10, "max": 40},
            "Southeast Asia": {"min": 15, "max": 60},
            "East Asia": {"min": 25, "max": 120},
            "Middle East": {"min": 30, "max": 150},
            "Latin America": {"min": 15, "max": 70},
            "Africa": {"min": 10, "max": 50},
        },
    },
    "root_canal": {
        "name": "Root Canal",
        "category": "dental",
        "costs_by_region": {
            "North America": {"min": 500, "max": 1500},
            "Western Europe": {"min": 300, "max": 800},
            "Eastern Europe": {"min": 80, "max": 250},
            "South Asia": {"min": 30, "max": 100},
            "Southeast Asia": {"min": 50, "max": 200},
            "East Asia": {"min": 80, "max": 400},
            "Middle East": {"min": 100, "max": 500},
            "Latin America": {"min": 50, "max": 250},
            "Africa": {"min": 30, "max": 150},
        },
    },
    "appendectomy": {
        "name": "Appendectomy",
        "category": "surgery",
        "costs_by_region": {
            "North America": {"min": 10000, "max": 35000},
            "Western Europe": {"min": 4000, "max": 15000},
            "Eastern Europe": {"min": 1500, "max": 5000},
            "South Asia": {"min": 500, "max": 2000},
            "Southeast Asia": {"min": 1000, "max": 4000},
            "East Asia": {"min": 2000, "max": 8000},
            "Middle East": {"min": 3000, "max": 10000},
            "Latin America": {"min": 1000, "max": 5000},
            "Africa": {"min": 500, "max": 3000},
        },
    },
    "knee_replacement": {
        "name": "Knee Replacement",
        "category": "surgery",
        "costs_by_region": {
            "North America": {"min": 30000, "max": 70000},
            "Western Europe": {"min": 15000, "max": 35000},
            "Eastern Europe": {"min": 5000, "max": 12000},
            "South Asia": {"min": 3000, "max": 8000},
            "Southeast Asia": {"min": 5000, "max": 15000},
            "East Asia": {"min": 8000, "max": 25000},
            "Middle East": {"min": 10000, "max": 30000},
            "Latin America": {"min": 5000, "max": 15000},
            "Africa": {"min": 3000, "max": 10000},
        },
    },
    "hip_replacement": {
        "name": "Hip Replacement",
        "category": "surgery",
        "costs_by_region": {
            "North America": {"min": 30000, "max": 75000},
            "Western Europe": {"min": 12000, "max": 30000},
            "Eastern Europe": {"min": 5000, "max": 12000},
            "South Asia": {"min": 4000, "max": 9000},
            "Southeast Asia": {"min": 6000, "max": 16000},
            "East Asia": {"min": 8000, "max": 25000},
            "Middle East": {"min": 10000, "max": 30000},
            "Latin America": {"min": 5000, "max": 15000},
            "Africa": {"min": 3500, "max": 10000},
        },
    },
    "heart_bypass": {
        "name": "Heart Bypass Surgery (CABG)",
        "category": "surgery",
        "costs_by_region": {
            "North America": {"min": 70000, "max": 200000},
            "Western Europe": {"min": 30000, "max": 80000},
            "Eastern Europe": {"min": 10000, "max": 30000},
            "South Asia": {"min": 5000, "max": 15000},
            "Southeast Asia": {"min": 10000, "max": 30000},
            "East Asia": {"min": 15000, "max": 50000},
            "Middle East": {"min": 20000, "max": 60000},
            "Latin America": {"min": 10000, "max": 30000},
            "Africa": {"min": 8000, "max": 25000},
        },
    },
    "cataract_surgery": {
        "name": "Cataract Surgery",
        "category": "surgery",
        "costs_by_region": {
            "North America": {"min": 3000, "max": 7000},
            "Western Europe": {"min": 1500, "max": 4000},
            "Eastern Europe": {"min": 500, "max": 1500},
            "South Asia": {"min": 200, "max": 800},
            "Southeast Asia": {"min": 400, "max": 1500},
            "East Asia": {"min": 600, "max": 2500},
            "Middle East": {"min": 800, "max": 3000},
            "Latin America": {"min": 400, "max": 1500},
            "Africa": {"min": 200, "max": 1000},
        },
    },
    "physiotherapy_session": {
        "name": "Physiotherapy Session",
        "category": "therapy",
        "costs_by_region": {
            "North America": {"min": 75, "max": 250},
            "Western Europe": {"min": 40, "max": 150},
            "Eastern Europe": {"min": 15, "max": 50},
            "South Asia": {"min": 5, "max": 25},
            "Southeast Asia": {"min": 10, "max": 40},
            "East Asia": {"min": 15, "max": 80},
            "Middle East": {"min": 25, "max": 100},
            "Latin America": {"min": 10, "max": 50},
            "Africa": {"min": 5, "max": 30},
        },
    },
    "prescription_medication": {
        "name": "Prescription Medication (30-day supply)",
        "category": "medication",
        "costs_by_region": {
            "North America": {"min": 30, "max": 500},
            "Western Europe": {"min": 10, "max": 200},
            "Eastern Europe": {"min": 5, "max": 80},
            "South Asia": {"min": 2, "max": 30},
            "Southeast Asia": {"min": 3, "max": 50},
            "East Asia": {"min": 5, "max": 100},
            "Middle East": {"min": 5, "max": 100},
            "Latin America": {"min": 3, "max": 60},
            "Africa": {"min": 2, "max": 40},
        },
    },
    "hospital_stay_per_night": {
        "name": "Hospital Stay (per night)",
        "category": "hospitalization",
        "costs_by_region": {
            "North America": {"min": 1000, "max": 5000},
            "Western Europe": {"min": 500, "max": 2000},
            "Eastern Europe": {"min": 100, "max": 400},
            "South Asia": {"min": 30, "max": 150},
            "Southeast Asia": {"min": 50, "max": 300},
            "East Asia": {"min": 100, "max": 800},
            "Middle East": {"min": 150, "max": 800},
            "Latin America": {"min": 50, "max": 400},
            "Africa": {"min": 30, "max": 200},
        },
    },
}

# City -> Region mapping
CITY_REGION_MAP: dict[str, str] = {
    # North America
    "new york": "North America", "los angeles": "North America",
    "chicago": "North America", "houston": "North America",
    "toronto": "North America", "vancouver": "North America",
    "mexico city": "Latin America", "miami": "North America",
    "san francisco": "North America", "seattle": "North America",
    # Western Europe
    "london": "Western Europe", "paris": "Western Europe",
    "berlin": "Western Europe", "amsterdam": "Western Europe",
    "zurich": "Western Europe", "madrid": "Western Europe",
    "rome": "Western Europe", "vienna": "Western Europe",
    "munich": "Western Europe", "barcelona": "Western Europe",
    # Eastern Europe
    "prague": "Eastern Europe", "warsaw": "Eastern Europe",
    "budapest": "Eastern Europe", "bucharest": "Eastern Europe",
    "istanbul": "Eastern Europe", "moscow": "Eastern Europe",
    # South Asia
    "mumbai": "South Asia", "delhi": "South Asia",
    "bangalore": "South Asia", "chennai": "South Asia",
    "kolkata": "South Asia", "hyderabad": "South Asia",
    "colombo": "South Asia", "dhaka": "South Asia",
    "kathmandu": "South Asia",
    # Southeast Asia
    "bangkok": "Southeast Asia", "singapore": "Southeast Asia",
    "kuala lumpur": "Southeast Asia", "jakarta": "Southeast Asia",
    "manila": "Southeast Asia", "ho chi minh city": "Southeast Asia",
    "hanoi": "Southeast Asia",
    # East Asia
    "tokyo": "East Asia", "seoul": "East Asia",
    "beijing": "East Asia", "shanghai": "East Asia",
    "hong kong": "East Asia", "taipei": "East Asia",
    # Middle East
    "dubai": "Middle East", "abu dhabi": "Middle East",
    "doha": "Middle East", "riyadh": "Middle East",
    "tel aviv": "Middle East", "amman": "Middle East",
    # Latin America
    "sao paulo": "Latin America", "rio de janeiro": "Latin America",
    "buenos aires": "Latin America", "bogota": "Latin America",
    "lima": "Latin America", "santiago": "Latin America",
    "medellin": "Latin America",
    # Africa
    "cairo": "Africa", "cape town": "Africa",
    "nairobi": "Africa", "lagos": "Africa",
    "johannesburg": "Africa", "accra": "Africa",
    "casablanca": "Africa",
}

# Hospital tier cost multipliers
HOSPITAL_TIER_MULTIPLIER: dict[str, float] = {
    "basic": 0.6,
    "standard": 1.0,
    "premium": 1.5,
    "luxury": 2.2,
}

# Supported languages for translation
SUPPORTED_LANGUAGES = [
    "english", "spanish", "french", "german", "italian", "portuguese",
    "japanese", "korean", "chinese", "arabic", "hindi", "thai",
    "turkish", "russian", "dutch", "swedish", "greek", "polish",
    "vietnamese", "indonesian", "malay",
]

# Common medical phrases for fallback translation
MEDICAL_PHRASES: dict[str, dict[str, str]] = {
    "I need a doctor": {
        "spanish": "Necesito un doctor",
        "french": "J'ai besoin d'un medecin",
        "german": "Ich brauche einen Arzt",
        "italian": "Ho bisogno di un medico",
        "portuguese": "Preciso de um medico",
        "japanese": "Isha ga hitsuyou desu",
        "korean": "Uisa-ga pilyohamnida",
        "chinese": "Wo xuyao yisheng",
        "arabic": "Ahtaj tabib",
        "hindi": "Mujhe doctor chahiye",
        "thai": "Chan tongkan mor",
        "turkish": "Bir doktora ihtiyacim var",
        "russian": "Mne nuzhen vrach",
    },
    "Where is the hospital": {
        "spanish": "Donde esta el hospital",
        "french": "Ou est l'hopital",
        "german": "Wo ist das Krankenhaus",
        "italian": "Dove si trova l'ospedale",
        "portuguese": "Onde fica o hospital",
        "japanese": "Byouin wa doko desu ka",
        "korean": "Byeongwon-i eodi-e issseumnikka",
        "chinese": "Yiyuan zai nali",
        "arabic": "Ayna al-mustashfa",
        "hindi": "Aspatal kahan hai",
        "thai": "Rong phayaban yuu thi nai",
        "turkish": "Hastane nerede",
        "russian": "Gde bolnitsa",
    },
    "I am allergic to": {
        "spanish": "Soy alergico a",
        "french": "Je suis allergique a",
        "german": "Ich bin allergisch gegen",
        "italian": "Sono allergico a",
        "portuguese": "Sou alergico a",
        "japanese": "Watashi wa ... ni arerugii desu",
        "korean": "Jeo-neun ... e allereugi-ga issseubnida",
        "chinese": "Wo dui ... guomin",
        "arabic": "Ana ladai hasasiya min",
        "hindi": "Mujhe ... se allergy hai",
        "thai": "Chan phae ...",
        "turkish": "... alerjim var",
        "russian": "U menya allergiya na",
    },
    "I have pain here": {
        "spanish": "Tengo dolor aqui",
        "french": "J'ai mal ici",
        "german": "Ich habe hier Schmerzen",
        "italian": "Ho dolore qui",
        "portuguese": "Tenho dor aqui",
        "japanese": "Koko ga itai desu",
        "korean": "Yeogi-ga apayo",
        "chinese": "Zhe li tong",
        "arabic": "Andi alam huna",
        "hindi": "Yahan dard hai",
        "thai": "Jep trong ni",
        "turkish": "Burada agrim var",
        "russian": "U menya zdes bolit",
    },
    "I need an ambulance": {
        "spanish": "Necesito una ambulancia",
        "french": "J'ai besoin d'une ambulance",
        "german": "Ich brauche einen Krankenwagen",
        "italian": "Ho bisogno di un'ambulanza",
        "portuguese": "Preciso de uma ambulancia",
        "japanese": "Kyuukyuusha wo yonde kudasai",
        "korean": "Gugeupcha-reul bulleo juseyo",
        "chinese": "Wo xuyao jiuhuche",
        "arabic": "Ahtaj sayarat is'af",
        "hindi": "Mujhe ambulance chahiye",
        "thai": "Chan tongkan rot phayaban",
        "turkish": "Bir ambulansa ihtiyacim var",
        "russian": "Mne nuzhna skoraya pomoshch",
    },
    "I have a fever": {
        "spanish": "Tengo fiebre",
        "french": "J'ai de la fievre",
        "german": "Ich habe Fieber",
        "italian": "Ho la febbre",
        "portuguese": "Tenho febre",
        "japanese": "Netsu ga arimasu",
        "korean": "Yeol-i namnida",
        "chinese": "Wo fashao le",
        "arabic": "Andi humma",
        "hindi": "Mujhe bukhar hai",
        "thai": "Chan pen khai",
        "turkish": "Atesim var",
        "russian": "U menya temperatura",
    },
    "Emergency": {
        "spanish": "Emergencia",
        "french": "Urgence",
        "german": "Notfall",
        "italian": "Emergenza",
        "portuguese": "Emergencia",
        "japanese": "Kinkyuu",
        "korean": "Eungeup",
        "chinese": "Jinji qingkuang",
        "arabic": "Tawari",
        "hindi": "Apatkal",
        "thai": "Chukchin",
        "turkish": "Acil durum",
        "russian": "Ekstrennaya situatsiya",
    },
    "My blood type is": {
        "spanish": "Mi tipo de sangre es",
        "french": "Mon groupe sanguin est",
        "german": "Meine Blutgruppe ist",
        "italian": "Il mio gruppo sanguigno e",
        "portuguese": "Meu tipo sanguineo e",
        "japanese": "Watashi no ketsueki-gata wa ... desu",
        "korean": "Je hyeol-aek-hyeong-eun ... imnida",
        "chinese": "Wo de xuexing shi",
        "arabic": "Fasilat dami hiya",
        "hindi": "Mera blood group ... hai",
        "thai": "Kruup lueat khong chan khuue",
        "turkish": "Kan grubum",
        "russian": "Moya gruppa krovi",
    },
    "I take this medication": {
        "spanish": "Tomo esta medicacion",
        "french": "Je prends ce medicament",
        "german": "Ich nehme dieses Medikament",
        "italian": "Prendo questo farmaco",
        "portuguese": "Tomo esta medicacao",
        "japanese": "Kono kusuri wo nonde imasu",
        "korean": "I yag-eul meoggo issseubnida",
        "chinese": "Wo zai chi zhe zhong yao",
        "arabic": "Ana atanawal hatha al-dawa",
        "hindi": "Main yeh dawai leta/leti hoon",
        "thai": "Chan kin ya ni",
        "turkish": "Bu ilaci kullaniyorum",
        "russian": "Ya prinimayu eto lekarstvo",
    },
    "I cannot breathe": {
        "spanish": "No puedo respirar",
        "french": "Je ne peux pas respirer",
        "german": "Ich kann nicht atmen",
        "italian": "Non riesco a respirare",
        "portuguese": "Nao consigo respirar",
        "japanese": "Iki ga dekimasen",
        "korean": "Sum-eul swil su eopseoyo",
        "chinese": "Wo wu fa huxi",
        "arabic": "La astati an atanaffas",
        "hindi": "Mujhe saans nahi aa rahi",
        "thai": "Chan hai jai mai dai",
        "turkish": "Nefes alamiyorum",
        "russian": "Ya ne mogu dyshat",
    },
}
