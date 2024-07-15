export interface cveInput {
  cve_id: string;
  description: string;
  severity: string;
  cvss_score: string;
  indicators: string[];
  mitigation: string[];
  references: string[];
  affected_software: string[];
  detection_methods: string[];
  tests_to_run: [];
}
export interface DBCve extends cveInput {
  _id?: string;
}
