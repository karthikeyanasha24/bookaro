Scope of Work (Based on Video Review)
1. Overview
This document defines the scope of work for the current phase of enhancements to the existing Real Estate SaaS platform.
 All requirements outlined below are derived strictly from the reviewed product walkthrough video, which serves as the primary and sole source of truth for this phase.
The scope focuses on:
UI/UX upgrades


Document-based declaration enhancements


QR code functionality


AI agent logging and integration validation
On demand services listing and purchase
Add more data point to lead cards in the transactional tool (Number of visits, number of offer, property search time)


No assumptions beyond what is visible or stated in the video are included.

2. UI Changes
2.1 Landing Page UI Upgrade
Objective:
 Improve the visual design and usability of the public landing page.
Scope:
Redesign and upgrade the landing page UI based on the provided or referenced designs


Improve layout, spacing, typography, and visual hierarchy


Ensure responsive behavior across devices


Out of Scope:
Backend logic changes


SEO strategy changes beyond layout readiness


Content rewriting unless required for layout alignment



2.2 Post-Login UI Updates
Objective:
 Ensure a consistent SaaS-style interface after user login, aligned with the new design direction.
Scope:
Update all primary UI components visible after login to match the new provided designs


Apply the new UI pattern consistently across:


Onboarding
Dashboards


Property-related screens


Transaction-related screens


Services-related screens (UI only)


Maintain existing navigation structure while applying updated visual styles


Out of Scope:
Functional changes to workflows


Backend refactoring


Feature additions beyond UI alignment



3. Document-Based Declaration Updates
3.1 Current State
The existing document-based declaration section currently contains three (3) questions.


These questions are already functional and stored in the system.


3.2 Required Enhancements
Objective:
 Expand the declaration process to capture more detailed user information.
Scope:
Add approximately 10–15 new questions to the document-based declaration section


Questions will follow the same interaction and validation pattern as existing ones


Ensure newly added questions:


Are stored correctly in the existing data structure (or extended structure if required)


Are visible and editable in the relevant UI flows


Out of Scope:
Redesign of the declaration logic


New scoring or evaluation algorithms


Any AI-based processing of declaration responses



4. QR Code Functionality
4.1 Objective
Enable property owners to generate QR codes that can be shared on external platforms and redirect users back to the platform’s property pages.

4.2 Functional Requirements
QR Code Generation
Generate a unique QR code for each property


QR code must be downloadable and reusable


Redirection Behavior
When a QR code is scanned:


The user is redirected to the platform


The user lands directly on the corresponding property detail page


Sharing Use Case
QR codes can be placed on:


External real estate platforms


Printed materials


Social media or messaging platforms



4.3 Technical Scope
Backend
Generate a unique tracking URL per property


Handle redirection logic from QR URL to property page


Ensure scalability and reliability of redirects


Frontend
UI option to generate QR code per property


UI option to download or share the QR code


Out of Scope (for this phase):
Advanced analytics dashboards


Source attribution reporting


Campaign-level QR tracking



5. AI Agent Logs and Tables
5.1 Objective
Introduce structured logging for AI agent communications to enable monitoring, auditing, and future enhancements.

5.2 Functional Requirements
Database Enhancements
Create new database tables to store:


AI agent messages


User responses


Interaction timestamps


Related context identifiers (user, property, transaction, event)


Logging Scope
Log all AI-to-user communications triggered by the system


Maintain a clear association between:


Trigger event


AI-generated response


Recipient user


Usage
Logs are intended for:


Monitoring interactions


Debugging


Operational review


No analytics or reporting UI is required in this phase



6. ChatGPT API Integration Review
6.1 Objective
Ensure the existing ChatGPT API integration remains functional and compatible with the newly introduced AI logging structure.

6.2 Scope
Review the current ChatGPT API integration


Validate:


API connectivity


Response handling


Error handling


Align the integration with the new AI agent logging tables


Ensure AI responses are correctly stored and retrievable


Out of Scope:
Model fine-tuning


Prompt optimization beyond compatibility


New AI capabilities or workflows



7. Source of Requirements & Assumptions
All scope items are derived exclusively from the reviewed product walkthrough video


The video is considered the single source of truth for this phase


Any requirement not explicitly visible or discussed in the video is considered out of scope


Additional features or enhancements will require:


Separate review


Revised scope


Updated estimates



8. Deliverables
Updated landing page UI


Updated logged-in UI aligned with new designs


Expanded document-based declaration section


QR code generation and redirection functionality


New AI agent communication log tables


Verified ChatGPT API integration


Updated source code reflecting the above changes



9. Exclusions (Explicit)
Mobile application development


Multilingual support


Advanced analytics dashboards


AI model training or fine-tuning


New payment logic or financial workflows


