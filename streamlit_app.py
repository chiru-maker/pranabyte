import streamlit as st
import json
from datetime import datetime

st.set_page_config(
    page_title="Patient Story Engine — Evidence-Linked Intake",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Modern Healthcare Dark Theme & Status Badges
st.markdown("""
<style>
    .main {
        background-color: #0b0f19;
    }
    .stApp {
        background-color: #0b0f19;
        color: #f1f5f9;
    }
    .metric-card {
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .badge-confirmed {
        background-color: #064e3b;
        color: #34d399;
        padding: 3px 10px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        border: 1px solid #059669;
    }
    .badge-documented {
        background-color: #0c4a6e;
        color: #38bdf8;
        padding: 3px 10px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        border: 1px solid #0284c7;
    }
    .badge-uncertain {
        background-color: #451a03;
        color: #fbbf24;
        padding: 3px 10px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        border: 1px solid #d97706;
    }
    .badge-conflicting {
        background-color: #4c0519;
        color: #fb7185;
        padding: 3px 10px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        border: 1px solid #e11d48;
    }
    .red-flag-box {
        background: rgba(153, 27, 27, 0.25);
        border: 1px solid #ef4444;
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 12px;
    }
    .conflict-box {
        background: rgba(136, 19, 55, 0.25);
        border: 1px solid #f43f5e;
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 12px;
    }
    .ask-less-banner {
        background: rgba(12, 74, 110, 0.35);
        border: 1px solid #0284c7;
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 12px;
    }
    .brief-card {
        background: linear-gradient(135deg, rgba(8, 47, 73, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
        border: 1px solid #0284c7;
        border-radius: 14px;
        padding: 18px;
        margin-bottom: 14px;
    }
    .journey-step {
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 10px;
    }
</style>
""", unsafe_allow_html=True)

# Session State Initialization
if "lang" not in st.session_state:
    st.session_state.lang = "en"
if "role" not in st.session_state:
    st.session_state.role = "doctor"
if "aspirin_resolved" not in st.session_state:
    st.session_state.aspirin_resolved = False
if "red_flag_ack" not in st.session_state:
    st.session_state.red_flag_ack = False
if "patient_intake_step" not in st.session_state:
    st.session_state.patient_intake_step = 1
if "questions_avoided" not in st.session_state:
    st.session_state.questions_avoided = 12
if "copilot_messages" not in st.session_state:
    st.session_state.copilot_messages = [
        {
            "role": "ai",
            "content": "Hello Dr. Priya! I am your Clinical Intelligence Copilot for Rahul Kumar (58M). Ask me anything regarding active medications, allergies, contradictions, or timeline citations.",
            "citations": []
        }
    ]

# Sidebar Controls
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/caduceus.png", width=64)
    st.title("Patient Story Engine")
    st.caption("Evidence-Linked Clinical Intake & Triage (Indian Hospital Prototype)")
    
    st.divider()
    
    # Language Selector
    lang_choice = st.radio(
        "Language / भाषा / ಭಾಷೆ",
        ["English", "हिन्दी (Hindi)", "ಕನ್ನಡ (Kannada)"],
        index=0
    )
    st.session_state.lang = "en" if "English" in lang_choice else "hi" if "हिन्दी" in lang_choice else "kn"
    
    # Role Selector
    st.subheader("User Portal")
    role_choice = st.selectbox(
        "Switch Role",
        ["Doctor Portal", "Patient Intake", "Hospital Staff Queue"]
    )
    if role_choice == "Doctor Portal":
        st.session_state.role = "doctor"
    elif role_choice == "Patient Intake":
        st.session_state.role = "patient"
    else:
        st.session_state.role = "staff"

    st.divider()
    
    # 1-Click Flagship Demo Reset
    if st.button("✨ Reset to Flagship Demo (Rahul Kumar)", use_container_width=True):
        st.session_state.aspirin_resolved = False
        st.session_state.red_flag_ack = False
        st.session_state.role = "doctor"
        st.session_state.copilot_messages = [
            {
                "role": "ai",
                "content": "Hello Dr. Priya! I am your Clinical Intelligence Copilot for Rahul Kumar (58M). Ask me anything regarding active medications, allergies, contradictions, or timeline citations.",
                "citations": []
            }
        ]
        st.rerun()

    st.info("💡 **Core USP**:\n- 🧠 Ask Less, Know More (Context Engine)\n- 🔗 Evidence-Linked Facts (4 States)\n- ⚠️ Contradiction & Red-Flag Cluster\n- 🤖 Clinical AI Copilot & 30s Brief\n- 🌐 HL7 FHIR R4 Ready")

# Flagship Patient: Rahul Kumar (58M)
patient_data = {
    "name": "Rahul Kumar",
    "age": 58,
    "sex": "Male",
    "id": "PAT-2026-0891",
    "abha": "91-8273-9912-0041",
    "phone": "+91 98765 43210",
    "visit": "VISIT-2026-904",
    "date": "21-Sep-2026",
    "complaint": "Central chest pain for 3 days with intermittent breathlessness on mild exertion."
}

# --- PATIENT ROLE VIEW ---
if st.session_state.role == "patient":
    st.title("🗣️ Patient Zero-Form Intake & Self-Review")
    st.caption("Multilingual, low-typing intake for Indian patients. AI collects symptoms and links to medical records.")

    tab1, tab2, tab3, tab4 = st.tabs(["1. Spoken Intake", "2. Adaptive Q&A (Ask Less)", "3. Document Upload & OCR", "4. Patient Review & Confirmation"])
    
    with tab1:
        st.markdown("""
        <div class="ask-less-banner">
            <strong>Informed Consent (v1.0.0) Active</strong>: Your spoken statements and uploaded prescriptions will be structured for your doctor. <em>AI assists organization and does not diagnose.</em>
        </div>
        """, unsafe_allow_html=True)

        col1, col2 = st.columns([2, 1])
        with col1:
            spoken_text = st.text_area(
                "Spoken Transcript (Voice-to-Text Input):",
                value="I stopped taking aspirin two months ago and I've been having chest pain for three days. Sometimes I feel breathless.",
                height=100
            )
            if st.button("🎤 Simulate Voice Recording / Parse Statement", type="primary"):
                st.success("✓ Voice Statement Analyzed. Extracted: Chest Pain (3 Days), Breathlessness (Dyspnea), and Aspirin Stopped Mention.")
        
        with col2:
            st.markdown("##### Quick Touch Select")
            if st.button("+ Chest Pain (3 Days)"):
                st.toast("Added symptom to case")
            if st.button("+ Shortness of breath"):
                st.toast("Added symptom to case")
            if st.button("+ Stopped Aspirin 2 Mo. Ago"):
                st.toast("Flagged medication cessation")

    with tab2:
        st.markdown(f"""
        <div class="ask-less-banner">
            <span style="font-size:18px;">✨</span> <strong>Ask Less, Know More Engine Active</strong><br/>
            <strong>{st.session_state.questions_avoided} questions avoided</strong> using existing hospital records & prescription:<br/>
            • <span style="color:#34d399;">✓ 'Do you have diabetes?' skipped</span> — Already confirmed from previous records (Type 2 Diabetes Mellitus)<br/>
            • <span style="color:#34d399;">✓ 'Do you have high blood pressure?' skipped</span> — Already documented in records (Essential Hypertension)<br/>
            • <span style="color:#34d399;">✓ 'Do you have known drug allergies?' streamlined</span> — Documented Penicillin allergy found
        </div>
        """, unsafe_allow_html=True)

        st.subheader("Adaptive Follow-up Question")
        st.info("❓ **'Does the chest pain spread or radiate to your left arm, shoulder, jaw, neck, or upper back?'**")
        
        ans = st.text_input("Your Response:", placeholder="e.g. Yes, it radiates to my left shoulder and arm.")
        if st.button("Submit Response", type="primary"):
            st.success("Response recorded and linked to clinical evidence.")

    with tab3:
        st.subheader("📄 Upload Prescription or Lab Report (OCR)")
        uploaded_file = st.file_uploader("Upload PDF or Image", type=["pdf", "jpg", "png"])
        if st.button("Run OCR Extraction on Apollo Hospital Prescription"):
            st.markdown("""
            **Document Detected**: `Apollo_Prescription_14Aug2026.pdf`
            - `[Condition]` **Type 2 Diabetes Mellitus** <span class="badge-documented">🔵 DOCUMENTED</span>
            - `[Condition]` **Essential Systemic Hypertension** <span class="badge-documented">🔵 DOCUMENTED</span>
            - `[Medication]` **Tab. Metformin 500mg (1-0-1)** <span class="badge-documented">🔵 DOCUMENTED</span>
            - `[Medication]` **Tab. Ecosprin (Aspirin) 75mg (0-1-0) [ACTIVE]** <span class="badge-documented">🔵 DOCUMENTED</span>
            - `[Medication]` **Tab. Amlodipine 5mg? (Morning) [Blurry Text]** <span class="badge-uncertain">🟡 UNCERTAIN</span>
            - `[Allergy]` **Penicillin (Severe Cutaneous Reaction)** <span class="badge-documented">🔵 DOCUMENTED</span>
            """, unsafe_allow_html=True)

    with tab4:
        st.subheader("🛡️ Patient Story Confirmation")
        st.write("Please review your summarized clinical details before meeting Dr. Priya Sharma:")
        
        st.checkbox("✓ Chief Reason: Chest pain for 3 days and breathlessness on exertion", value=True)
        st.checkbox("✓ Known History: Type 2 Diabetes (2024), Hypertension (2025)", value=True)
        st.checkbox("✓ Medication Notice: You stopped Aspirin 2 months ago", value=True)
        st.checkbox("✓ Drug Allergy: Penicillin allergy noted", value=True)
        
        if st.button("✅ I Confirm My Case Summary — Enter OPD Queue", type="primary"):
            st.balloons()
            st.success("Your case has been confirmed and forwarded to Dr. Priya Sharma's screen.")

# --- DOCTOR ROLE VIEW ---
elif st.session_state.role == "doctor":
    st.title("👨‍⚕️ Clinician Consultation Portal")
    st.caption("Dr. Priya Sharma (Cardiology) • Verified Clinician Authority")

    # Patient Header
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"**Patient:** {patient_data['name']} ({patient_data['sex']}, {patient_data['age']}Y)")
        st.markdown(f"**Patient ID:** `{patient_data['id']}`")
    with col2:
        st.markdown(f"**ABHA ID:** `{patient_data['abha']}`")
        st.markdown(f"**Visit No:** `{patient_data['visit']}`")
    with col3:
        st.markdown(f"**Date:** {patient_data['date']}")
        st.markdown("**Status:** `Ready for Doctor`")
    with col4:
        st.metric(label="Data Completeness", value="85%", delta=f"{st.session_state.questions_avoided} Qs Avoided")

    st.divider()

    # Safety Red Flag Alert Box
    if not st.session_state.red_flag_ack:
        st.markdown("""
        <div class="red-flag-box">
            <h4 style="color:#f87171; margin-top:0;">🚨 SAFETY RED FLAG: Cardiopulmonary Symptom Cluster</h4>
            <p style="margin-bottom:6px; font-size:13px; color:#fecaca;">
                Patient reports acute retrosternal chest pain (3 days) with concurrent dyspnea in a diabetic/hypertensive profile with recent aspirin cessation.<br/>
                <strong>Recommendation:</strong> Urgent clinician review and 12-lead ECG evaluation recommended. <em>(Non-diagnostic safety rule)</em>
            </p>
        </div>
        """, unsafe_allow_html=True)
        col_rf1, col_rf2 = st.columns([1, 5])
        with col_rf1:
            if st.button("✓ Acknowledge Red Flag"):
                st.session_state.red_flag_ack = True
                st.rerun()

    # Contradiction Alert Box
    if not st.session_state.aspirin_resolved:
        st.markdown("""
        <div class="conflict-box">
            <h4 style="color:#fb7185; margin-top:0;">🔴 SOURCE CONTRADICTION DETECTED: Aspirin 75mg Active Status</h4>
            <p style="font-size:13px; color:#ffe4e6; margin-bottom:8px;">
                • <strong>Source A (Apollo Prescription 14-Aug-2026):</strong> Tab. Ecosprin 75mg OD — Documented ACTIVE Daily<br/>
                • <strong>Source B (Patient Spoken Intake 21-Sep-2026):</strong> "I stopped taking aspirin two months ago."<br/>
                <em>System does not silently overwrite either source. Doctor verification required.</em>
            </p>
        </div>
        """, unsafe_allow_html=True)
        c_a, c_b, c_c = st.columns(3)
        with c_a:
            if st.button("Confirm Patient Stopped (Set Inactive)"):
                st.session_state.aspirin_resolved = True
                st.success("Resolved: Marked Aspirin as Discontinued by Patient.")
                st.rerun()
        with c_b:
            if st.button("Keep Active (Reinforce Adherence)"):
                st.session_state.aspirin_resolved = True
                st.info("Resolved: Reinforcing daily aspirin therapy.")
                st.rerun()
        with c_c:
            if st.button("Edit Prescription / Dose"):
                st.session_state.aspirin_resolved = True
                st.rerun()

    # Main Clinical Navigation Tabs
    doc_tab1, doc_tab2, doc_tab3, doc_tab4, doc_tab5, doc_tab6, doc_tab7 = st.tabs([
        "⚡ 30-Sec Doctor Brief",
        "🔗 Evidence View (4 States)",
        "🤖 Doctor AI Copilot",
        "🚀 Case Journey",
        "🔄 What's Changed",
        "⏱️ Timeline",
        "🌐 FHIR R4 & Print"
    ])

    with doc_tab1:
        st.markdown("""
        <div class="brief-card">
            <h3 style="color:#38bdf8; margin-top:0;">⚡ 30-Second Doctor Brief &mdash; Rahul Kumar (58M)</h3>
            <p style="font-size:15px; font-weight:600; color:#f8fafc;">
                58-year-old male with history of T2DM & HTN presenting with 3-day retrosternal chest pain and breathlessness. ⚠️ 1 High-Priority Cardiopulmonary Red Flag Active.
            </p>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0;" />
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size:13px;">
                <div>
                    <strong>Triage Vitals:</strong> BP 142/90 mmHg | HR 78 bpm | SpO2 98% (Room Air)<br/>
                    <strong>Active Meds:</strong> Metformin 500mg BD, Amlodipine 5mg OD
                </div>
                <div>
                    <strong>Allergies:</strong> Penicillin (Cutaneous rash)<br/>
                    <strong>Discrepancy to Clarify:</strong> Aspirin stopped ~2 months ago without consult
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.subheader("Consultation Checklist")
        st.checkbox("1. Order Stat 12-lead ECG and bedside troponin-I", value=True)
        st.checkbox("2. Clarify exact reason for Aspirin discontinuation with patient", value=True)
        st.checkbox("3. Review glycemic and blood pressure medication compliance", value=True)

    with doc_tab2:
        st.info("💡 **Evidence View**: Every clinical fact below is evidence-linked. Expand any item to inspect the verbatim transcript quote or prescription citation.")

        col_left, col_right = st.columns(2)
        with col_left:
            st.markdown("#### 1. Chief Complaint & Symptoms")
            with st.expander("Chest Pain for 3 Days (Moderate-Severe) — 🟢 CONFIRMED"):
                st.markdown("**Status:** <span class='badge-confirmed'>🟢 CONFIRMED</span>", unsafe_allow_html=True)
                st.markdown("**Evidence Source:** 🎙️ Patient Spoken Intake (21-Sep-2026, 10:42 AM)")
                st.code('Transcript: "I\'ve been having chest pain for three days."')
                st.caption("Confidence: 96% • Verified by patient statement")

            with st.expander("Shortness of Breath (Dyspnea on Exertion) — 🟢 CONFIRMED"):
                st.markdown("**Status:** <span class='badge-confirmed'>🟢 CONFIRMED</span>", unsafe_allow_html=True)
                st.markdown("**Evidence Source:** 🎙️ Patient Spoken Intake")
                st.code('Transcript: "Sometimes I feel breathless."')

            st.markdown("#### 2. Past Medical History")
            with st.expander("Type 2 Diabetes Mellitus (T2DM) — 🔵 DOCUMENTED"):
                st.markdown("**Status:** <span class='badge-documented'>🔵 DOCUMENTED</span>", unsafe_allow_html=True)
                st.markdown("**Evidence Source:** 📄 Apollo Multispeciality Records (2024)")
                st.code("Diagnosis: Type 2 Diabetes Mellitus. Fasting Blood Glucose: 162 mg/dL. Metformin 500mg initiated.")

            with st.expander("Essential Hypertension — 🔵 DOCUMENTED"):
                st.markdown("**Status:** <span class='badge-documented'>🔵 DOCUMENTED</span>", unsafe_allow_html=True)
                st.markdown("**Evidence Source:** 📄 Apollo OPD Record (2025)")
                st.code("BP: 148/94 mmHg. Initiated on Amlodipine 5mg OD.")

        with col_right:
            st.markdown("#### 3. Medications & Regimen")
            with st.expander("Tab. Metformin 500mg BD (After Food) — 🔵 DOCUMENTED"):
                st.markdown("**Status:** <span class='badge-documented'>🔵 DOCUMENTED</span>", unsafe_allow_html=True)
                st.markdown("**Evidence Source:** 📄 Apollo Prescription (14-Aug-2026)")
                st.code("Rx: Tab. Metformin 500mg - 1 tab twice daily after meals. Active.")

            with st.expander("Tab. Amlodipine 5mg? (Morning) — 🟡 UNCERTAIN"):
                st.markdown("**Status:** <span class='badge-uncertain'>🟡 UNCERTAIN (Low OCR Confidence: 72%)</span>", unsafe_allow_html=True)
                st.markdown("**Evidence Source:** 📄 Blurry handwritten scan snippet")
                st.warning("OCR detected 'Amlo... 5mg?'. Clinician verification requested.")

            with st.expander(f"Tab. Ecosprin (Aspirin) 75mg OD — {'🟢 RESOLVED' if st.session_state.aspirin_resolved else '🔴 CONFLICTING'}"):
                if st.session_state.aspirin_resolved:
                    st.success("Doctor Verified: Patient reported stoppage 2 months ago. Status updated.")
                else:
                    st.markdown("**Status:** <span class='badge-conflicting'>🔴 CONFLICTING</span>", unsafe_allow_html=True)
                    st.markdown("• **Source 1:** Prescription (14-Aug-2026) -> Active Daily\n• **Source 2:** Patient statement -> Stopped 2 months ago")

            st.markdown("#### 4. Allergies & Diagnostics")
            with st.expander("Penicillin Allergy (Severe Rash) — 🔵 DOCUMENTED"):
                st.markdown("**Status:** <span class='badge-documented'>🔵 DOCUMENTED</span>", unsafe_allow_html=True)
                st.markdown("**Evidence Source:** 📄 Prior Hospital Allergy Registry")
                st.code("Allergy: Documented severe cutaneous allergic reaction / rash to Penicillin.")

    with doc_tab3:
        st.subheader("🤖 Doctor AI Copilot")
        st.caption("Ask questions about this patient's case with automatic provenance citations.")

        for msg in st.session_state.copilot_messages:
            if msg["role"] == "doctor":
                with st.chat_message("user"):
                    st.write(msg["content"])
            else:
                with st.chat_message("assistant"):
                    st.write(msg["content"])
                    if msg.get("citations"):
                        st.markdown("**📌 Citations:**")
                        for cit in msg["citations"]:
                            st.caption(f"- **{cit['key']}**: {cit['value']} ({cit['citation']})")

        copilot_query = st.chat_input("Ask about medications, allergies, vitals, or contradictions...")
        
        col_q1, col_q2, col_q3 = st.columns(3)
        with col_q1:
            if st.button("💊 What medications is he on?"):
                copilot_query = "What medications is this patient on?"
        with col_q2:
            if st.button("⚠️ Any drug allergies?"):
                copilot_query = "Any documented drug allergies?"
        with col_q3:
            if st.button("🚨 Explain Aspirin conflict"):
                copilot_query = "Explain the active contradiction regarding Aspirin"

        if copilot_query:
            st.session_state.copilot_messages.append({"role": "doctor", "content": copilot_query})
            
            # Formulate response
            q_low = copilot_query.lower()
            if "med" in q_low or "drug" in q_low:
                ans = "The patient has 2 documented active medications and 1 flagged stoppage:\n\n• **Metformin 500mg BD**: Active for T2DM [DOCUMENTED]\n• **Amlodipine 5mg OD**: Active for Hypertension [DOCUMENTED]\n• **Ecosprin 75mg OD**: Flagged discrepancy — Prescription lists active, but patient verbally reported stopping 2 months ago [CONFLICTING]"
                cits = [{"key": "Apollo Rx", "value": "Metformin 500mg, Ecosprin 75mg", "citation": "Prescription 14-Aug-2026"}]
            elif "allergy" in q_low:
                ans = "⚠️ **Penicillin Allergy** documented in previous hospital records (Severe cutaneous rash / hives). Avoid beta-lactam antibiotics."
                cits = [{"key": "Allergy Registry", "value": "Penicillin - Severe Cutaneous Rash", "citation": "Prior Medical Record"}]
            elif "aspirin" in q_low or "conflict" in q_low:
                ans = "🔴 **Aspirin Contradiction Details**:\n\n1. **Prescription Source**: Apollo Hospital Rx (14-Aug-2026) specifies Ecosprin 75mg OD active daily.\n2. **Voice Intake Source**: Patient stated on 21-Sep-2026 that he stopped aspirin ~2 months ago due to self-assessed gastric acidity without consulting a physician."
                cits = [{"key": "Voice vs Rx", "value": "Aspirin Active vs Stopped 2 Mo Ago", "citation": "Contradiction Engine"}]
            else:
                ans = f"**Clinical Overview for {patient_data['name']}**:\n\n• Presenting with central chest pain for 3 days and exertional dyspnea.\n• Known Type 2 Diabetes Mellitus (2024) and Essential Hypertension (2025).\n• 1 active red flag alert (cardiopulmonary symptom cluster).\n• 1 active medication discrepancy (Aspirin cessation)."
                cits = [{"key": "Case Summary", "value": "Rahul Kumar 58M", "citation": "EHR Master File"}]

            st.session_state.copilot_messages.append({"role": "ai", "content": ans, "citations": cits})
            st.rerun()

    with doc_tab4:
        st.subheader("🚀 Multimodal Case Journey")
        st.caption("Live trace of intake pipeline from patient check-in to clinician verification.")

        steps = [
            ("1. Registration & Consent", "ABHA 91-8273-9912-0041 linked. Consent v1.0.0 accepted.", "COMPLETED", "09:15 AM"),
            ("2. Multimodal Intake", "Hindi/English voice recorded. Apollo Rx OCR parsed at 98% confidence.", "COMPLETED", "09:18 AM"),
            ("3. Evidence Linking", "8 clinical facts tagged with 🟢 CONFIRMED, 🔵 DOCUMENTED, or 🟡 UNCERTAIN states.", "COMPLETED", "09:19 AM"),
            ("4. Safety & Conflict Scan", "Cardiopulmonary red-flag & Aspirin stoppage discrepancy flagged.", "COMPLETED", "09:20 AM"),
            ("5. Doctor Verification", "Dr. Priya Sharma reviewing 30s Brief and verifying facts.", "ACTIVE", "Current"),
            ("6. Interoperable Export", "FHIR R4 Bundle and A4 Case Sheet generation.", "PENDING", "Next")
        ]

        for title, desc, stat, tm in steps:
            color = "#34d399" if stat == "COMPLETED" else "#38bdf8" if stat == "ACTIVE" else "#94a3b8"
            st.markdown(f"""
            <div class="journey-step">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#f8fafc; font-size:14px;">{title}</strong>
                    <span style="font-size:11px; font-weight:700; color:{color};">{stat} ({tm})</span>
                </div>
                <p style="font-size:12px; color:#cbd5e1; margin-top:4px; margin-bottom:0;">{desc}</p>
            </div>
            """, unsafe_allow_html=True)

    with doc_tab5:
        st.subheader("🔄 What's Changed Since Last Visit (Patient Memory Engine)")
        st.caption("Differential comparison with previous visit: **14 Jan 2026 (Cardiology OPD)**")

        changes = [
            ("NEW", "Acute Retrosternal Chest Pain", "Onset 3 days ago, radiating to left arm with breathlessness on exertion (not present in Jan 2026).", "High priority: rule out acute coronary syndrome."),
            ("MODIFIED", "Aspirin 75mg Stoppage", "Patient stopped taking daily Aspirin approximately 2 months ago without medical consult.", "Clarify reasons and evaluate resumption."),
            ("INCREASED", "Blood Pressure Trend", "Current BP is 142/90 mmHg (previously 128/82 mmHg on 14 Jan 2026).", "Review antihypertensive compliance."),
            ("UNCHANGED", "Penicillin Allergy", "Cutaneous allergic reaction / rash.", "Avoid beta-lactam class.")
        ]

        for badge, title, desc, rec in changes:
            badge_color = "#f43f5e" if badge == "NEW" else "#f59e0b" if badge in ["MODIFIED", "INCREASED"] else "#0284c7"
            st.markdown(f"""
            <div style="background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px; margin-bottom:10px;">
                <span style="background:{badge_color}; color:#fff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px;">{badge}</span>
                <strong style="color:#fff; font-size:13px; margin-left:8px;">{title}</strong>
                <p style="font-size:12px; color:#cbd5e1; margin-top:6px; margin-bottom:4px;">{desc}</p>
                <span style="font-size:11px; color:#38bdf8;"><strong>Clinician Action:</strong> {rec}</span>
            </div>
            """, unsafe_allow_html=True)

    with doc_tab6:
        st.markdown("### ⏱️ Chronological Medical Story Timeline")
        timeline_items = [
            ("2024", "Type 2 Diabetes Documented", "Diagnosed at Apollo Clinic. Fasting Blood Glucose 162 mg/dL. Metformin 500mg initiated.", "DOCUMENTED"),
            ("2025", "Hypertension & Daily Aspirin Started", "Elevated BP (148/94 mmHg). Started on Amlodipine 5mg and Aspirin 75mg.", "DOCUMENTED"),
            ("14-Aug-2026", "Prescription Uploaded", "Active meds: Metformin 500mg, Ecosprin 75mg, Amlodipine 5mg. Penicillin allergy noted.", "DOCUMENTED"),
            ("July 2026 (~2 Mo. Ago)", "Patient Discontinued Aspirin", "Self-reported stoppage due to mild gastric irritation without physician consult.", "CONFLICTING"),
            ("18-Sep-2026 (3 Days Ago)", "Chest Pain & Dyspnea Onset", "Substernal chest pain and shortness of breath on exertion.", "CONFIRMED"),
            ("Today", "Current Consultation & Triage", "Intake synthesized. 12 questions avoided from prior history. Red flag evaluated.", "CONFIRMED")
        ]
        for dt, title, desc, stat in timeline_items:
            badge_class = f"badge-{stat.lower()}"
            st.markdown(f"""
            <div style="border-left: 3px solid #0284c7; padding-left: 12px; margin-bottom: 14px;">
                <span style="font-family:monospace; font-size:11px; color:#38bdf8;"><strong>{dt}</strong></span> — 
                <strong>{title}</strong> <span class="{badge_class}">{stat}</span>
                <p style="font-size:12px; color:#cbd5e1; margin-top:2px;">{desc}</p>
            </div>
            """, unsafe_allow_html=True)

    with doc_tab7:
        st.markdown("### 🌐 HL7 FHIR R4 Bundle & Printable Case Sheet")
        
        col_f1, col_f2 = st.columns(2)
        with col_f1:
            fhir_bundle = {
                "resourceType": "Bundle",
                "id": f"bundle-patient-{patient_data['id']}",
                "type": "document",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "entry": [
                    {
                        "resource": {
                            "resourceType": "Patient",
                            "id": patient_data["id"],
                            "name": [{"text": patient_data["name"]}],
                            "gender": patient_data["sex"].lower(),
                            "identifier": [{"system": "https://healthid.ndhm.gov.in", "value": patient_data["abha"]}]
                        }
                    },
                    {
                        "resource": {
                            "resourceType": "Encounter",
                            "id": patient_data["visit"],
                            "status": "in-progress",
                            "reasonCode": [{"text": patient_data["complaint"]}]
                        }
                    },
                    {
                        "resource": {
                            "resourceType": "Condition",
                            "clinicalStatus": "active",
                            "code": {"text": "Type 2 Diabetes Mellitus"},
                            "note": [{"text": "Evidence Status: DOCUMENTED | Source: Apollo Records 2024"}]
                        }
                    },
                    {
                        "resource": {
                            "resourceType": "MedicationStatement",
                            "status": "stopped" if st.session_state.aspirin_resolved else "active",
                            "medicationCodeableConcept": {"text": "Tab. Ecosprin (Aspirin) 75mg"},
                            "note": [{"text": "Evidence Status: CONFLICTING / Doctor Verified"}]
                        }
                    }
                ]
            }
            json_str = json.dumps(fhir_bundle, indent=2)
            st.download_button(
                label="⬇️ Download HL7 FHIR R4 Bundle (.json)",
                data=json_str,
                file_name=f"FHIR_Bundle_{patient_data['id']}.json",
                mime="application/json",
                use_container_width=True
            )

        with col_f2:
            case_sheet_html = f"""<!DOCTYPE html>
<html>
<head><title>Case Sheet - {patient_data['name']}</title></head>
<body style="font-family: Arial; padding: 20px;">
    <h2>PATIENT STORY ENGINE - OPD CASE SHEET</h2>
    <p><strong>Patient:</strong> {patient_data['name']} (Age: {patient_data['age']}, Sex: {patient_data['sex']}) | <strong>ID:</strong> {patient_data['id']}</p>
    <hr/>
    <h3>1. Chief Complaint</h3>
    <p>{patient_data['complaint']}</p>
    <h3>2. Documented Medical History</h3>
    <ul><li>Type 2 Diabetes Mellitus (2024)</li><li>Essential Hypertension (2025)</li></ul>
    <h3>3. Medications & Regimen</h3>
    <ul><li>Metformin 500mg BD</li><li>Amlodipine 5mg OD</li><li>Aspirin 75mg (Patient stopped ~2 mo. ago)</li></ul>
    <h3>4. Drug Allergies</h3>
    <ul><li>Penicillin (Severe cutaneous reaction / rash)</li></ul>
    <br/><br/>
    <p><strong>Attending Physician:</strong> Dr. Priya Sharma, MD</p>
</body>
</html>"""
            st.download_button(
                label="🖨️ Download Printable Case Sheet (.html)",
                data=case_sheet_html,
                file_name=f"Case_Sheet_{patient_data['id']}.html",
                mime="text/html",
                use_container_width=True
            )

# --- HOSPITAL STAFF VIEW ---
else:
    st.title("🏥 Hospital Staff & Triage Queue")
    st.caption("OPD Department Coordinator • Apollo Multispeciality Bangalore")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Waiting Patients", "7")
    with col2:
        st.metric("Ready for Doctor", "4")
    with col3:
        st.metric("Requires Verification", "2")
    with col4:
        st.metric("Red-Flag Alerts", "1", delta="Urgent", delta_color="inverse")

    st.divider()
    st.subheader("Active Patient Triage Queue")
    
    queue_data = [
        {"Name": "Rahul Kumar", "Age/Sex": "58 M", "Status": "🚨 RED FLAG ALERT", "Complaint": "Chest pain + Breathlessness for 3 days", "Time": "10:42 AM"},
        {"Name": "Meenakshi Sundaram", "Age/Sex": "64 F", "Status": "Ready for Doctor", "Complaint": "Diabetic Retinopathy follow-up", "Time": "10:50 AM"},
        {"Name": "Siddharth Varma", "Age/Sex": "34 M", "Status": "Requires Verification", "Complaint": "Uncertain allergy declaration", "Time": "11:05 AM"},
        {"Name": "Kavita Joshi", "Age/Sex": "49 F", "Status": "Waiting Intake", "Complaint": "Hypertension checkup", "Time": "11:15 AM"}
    ]
    st.table(queue_data)
    
    if st.button("Open Rahul Kumar (Flagship Case) in Doctor Portal", type="primary"):
        st.session_state.role = "doctor"
        st.rerun()
