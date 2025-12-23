// dashboard.js
import { mountScreenWidget } from "./screen.js";
import { initVitalsWidget } from "./vitals.js";
import { mountCoffeeMoodWidget } from "./test.js";
import { mountPainMapWidget } from "./pain-widget.js";

import { mountClinicalAlertsWidget } from "./clinical_alert.js";
import { mountLabReportsWidget } from "./lab_reports.js";
import { mountDailyPrescriptionWidget } from "./daily_prescription.js";
import { mountHelplineDeskWidget } from "./helpline_desk.js";

document.addEventListener("DOMContentLoaded", () => {
  mountScreenWidget(document.getElementById("mount-screen"));
  initVitalsWidget(document.getElementById("mount-vitals"));
  mountCoffeeMoodWidget(document.getElementById("mount-coffee"));
  mountPainMapWidget(document.getElementById("mount-pain"));

  mountLabReportsWidget(document.getElementById("mount-labs"));
  mountClinicalAlertsWidget(document.getElementById("mount-alerts"));

  mountDailyPrescriptionWidget(document.getElementById("mount-prescription"));
  mountHelplineDeskWidget(document.getElementById("mount-helpline"));
});
