from typing import Dict, Any, List
from datetime import datetime
from backend.app.models import Patient, Visit, ClinicalFact

class FHIRExportService:
    """
    FHIR R4 JSON Exporter.
    Translates internal evidence-linked clinical entities into standard HL7 FHIR resources:
    - Patient
    - Encounter
    - Condition
    - MedicationStatement
    - AllergyIntolerance
    - Observation
    """

    def export_patient_bundle(self, patient: Patient, visit: Visit, facts: List[ClinicalFact]) -> Dict[str, Any]:
        bundle_id = f"bundle-patient-{patient.patient_id_display}"
        now_iso = datetime.utcnow().isoformat() + "Z"

        entries = []

        # 1. Patient Resource
        patient_resource = {
            "fullUrl": f"urn:uuid:{patient.id}",
            "resource": {
                "resourceType": "Patient",
                "id": patient.id,
                "identifier": [
                    {
                        "system": "https://healthid.ndhm.gov.in",
                        "value": patient.abha_id or "DEMO-ABHA-9821-4432-1102"
                    },
                    {
                        "system": "urn:hospital:patient-id",
                        "value": patient.patient_id_display
                    }
                ],
                "active": True,
                "name": [{"text": patient.name, "family": patient.name.split()[-1] if len(patient.name.split()) > 1 else "", "given": [patient.name.split()[0]]}],
                "gender": patient.sex.lower(),
                "telecom": [{"system": "phone", "value": patient.phone, "use": "mobile"}]
            }
        }
        entries.append(patient_resource)

        # 2. Encounter Resource
        encounter_resource = {
            "fullUrl": f"urn:uuid:{visit.id}",
            "resource": {
                "resourceType": "Encounter",
                "id": visit.id,
                "status": "in-progress" if not visit.doctor_verified else "finished",
                "class": {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                    "code": "AMB",
                    "display": "ambulatory"
                },
                "subject": {"reference": f"urn:uuid:{patient.id}", "display": patient.name},
                "reasonCode": [{"text": visit.chief_complaint or "Cardiopulmonary Evaluation"}]
            }
        }
        entries.append(encounter_resource)

        # 3. Clinical Facts Mapping (Condition, MedicationStatement, AllergyIntolerance)
        for fact in facts:
            cat = fact.category
            if cat in ["past_history", "symptom", "chief_complaint"]:
                condition_resource = {
                    "fullUrl": f"urn:uuid:{fact.id}",
                    "resource": {
                        "resourceType": "Condition",
                        "id": fact.id,
                        "clinicalStatus": {
                            "coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "active"}]
                        },
                        "verificationStatus": {
                            "coding": [{
                                "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                                "code": "confirmed" if fact.status == "CONFIRMED" or fact.doctor_verified else "provisional"
                            }]
                        },
                        "code": {"text": f"{fact.key_name}: {fact.value}"},
                        "subject": {"reference": f"urn:uuid:{patient.id}"},
                        "note": [{"text": f"Evidence Status: {fact.status} | Source: {fact.source_citation or 'Voice/Doc'}"}]
                    }
                }
                entries.append(condition_resource)

            elif cat == "medication":
                med_resource = {
                    "fullUrl": f"urn:uuid:{fact.id}",
                    "resource": {
                        "resourceType": "MedicationStatement",
                        "id": fact.id,
                        "status": "active" if "active" in fact.value.lower() else "stopped",
                        "medicationCodeableConcept": {"text": fact.value},
                        "subject": {"reference": f"urn:uuid:{patient.id}"},
                        "note": [{"text": f"Life Cycle State: {fact.status} | Verified: {fact.doctor_verified}"}]
                    }
                }
                entries.append(med_resource)

            elif cat == "allergy":
                allergy_resource = {
                    "fullUrl": f"urn:uuid:{fact.id}",
                    "resource": {
                        "resourceType": "AllergyIntolerance",
                        "id": fact.id,
                        "clinicalStatus": {
                            "coding": [{"system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", "code": "active"}]
                        },
                        "verificationStatus": {
                            "coding": [{"system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification", "code": "confirmed"}]
                        },
                        "code": {"text": fact.value},
                        "patient": {"reference": f"urn:uuid:{patient.id}"}
                    }
                }
                entries.append(allergy_resource)

        return {
            "resourceType": "Bundle",
            "id": bundle_id,
            "type": "document",
            "timestamp": now_iso,
            "total": len(entries),
            "entry": entries
        }

fhir_service = FHIRExportService()
