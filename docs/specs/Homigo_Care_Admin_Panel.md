# HOMIGO CARE --- Admin Panel

## 1. Purpose

Create a dedicated administrative experience for HOMIGO CARE platform
operators. The Admin Panel is used to oversee platform activity, manage
users and professionals, review professional verification, manage
service configuration, and monitor booking and service workflows.

**Brand:** HOMIGO CARE\
**Tagline:** Because Care Begins at Home.

HOMIGO CARE has three distinct role experiences: 1. Patient App 2.
Healthcare Professional App 3. Admin Panel

The Admin Panel is a privileged operational interface. It must be
separated from ordinary patient and healthcare-professional functions
through secure role-based authorization.

## 2. Core objectives

-   Provide administrators with appropriate oversight of platform
    operations.
-   Review and manage professional onboarding and verification.
-   Manage patient and professional accounts according to authorized
    permissions.
-   Oversee service categories and availability/configuration.
-   Monitor booking requests, statuses, and service completion.
-   Ensure required professional service notes are submitted before a
    request is closed.
-   Support responsible handling of feedback, complaints, and
    operational issues.
-   Protect patient health information and maintain accountability for
    administrative access.

## 3. Intended users and access

The Admin Panel is intended only for authorized HOMIGO CARE
administrators and staff with explicitly assigned administrative
permissions.

Do not grant full administrator access merely because a user is a
healthcare professional. Professional and administrator roles must
remain distinct, even if the existing product places their experiences
within a shared application shell.

Where the project supports multiple administrative permission levels,
apply least-privilege access so staff only receive the controls and
information required for their duties.

## 4. Administrative dashboard

Provide an overview of relevant platform activity using data that
actually exists in the system. Depending on implemented functionality,
useful operational summaries may include:

-   Patient account count.
-   Professional account count.
-   Professionals awaiting verification.
-   Approved and rejected professional applications.
-   Incoming and active booking requests.
-   Accepted, rejected, and completed bookings.
-   Requests awaiting required service documentation.
-   Relevant feedback or complaints requiring review.

Dashboard figures must be calculated from real application data. Do not
use hardcoded demonstration numbers or imply that prototype data
represents real operational activity.

## 5. Professional verification management

Administrators must be able to review professional applications through
the intended three-step verification process.

### Step 1 --- Credential verification

Review submitted qualifications, registration/licensing documents, and
relevant certifications.

### Step 2 --- Employment and experience verification

Review submitted employment history and relevant professional
experience.

### Step 3 --- Knowledge assessment and administrative review

Review the MCQ-based knowledge assessment and complete the
administrative evaluation.

Administrative actions should allow authorized reviewers to record the
outcome and update the application's verification status. Where
appropriate, record review notes and identify missing or insufficient
information so the applicant can be informed of the next required
action.

The system must: - Distinguish pending, under-review, approved,
rejected, and resubmission-required states where supported by the
workflow. - Prevent an applicant from being treated as verified before
approval. - Record the reviewer and timestamp for important decisions. -
Protect uploaded credentials and internal review notes from public or
unauthorized access. - Avoid claiming that an MCQ assessment alone
proves clinical competence.

## 6. User and account management

Provide authorized administrators with appropriate controls to review
and manage patient and professional accounts.

Possible actions, subject to existing application capabilities and
permissions, include: - View account status and relevant profile
information. - Review account-related reports. - Manage account
activation or restriction where policy permits. - Resolve account access
or profile issues. - Review a professional's verification status.

Administrative access to patient health records must not be unrestricted
by default. Account-management permissions do not automatically justify
access to all clinical information.

## 7. Service and category management

Allow authorized administrators to manage the service categories that
HOMIGO CARE actually supports. Potential service areas in the product
concept include:

-   Home nursing.
-   Doctor consultations.
-   Hospital Companion Nurse.
-   Hospital Navigator Nurse.
-   Laboratory services.
-   Pharmacy services.
-   Nutrition support.

Administrators should be able to manage service availability and
relevant service information using the application's existing
configuration model.

Do not activate, advertise, or make a service bookable solely because it
appears in this planning document. A service must be configured and
operationally supported before being presented as available.

## 8. Booking and request oversight

Administrators should be able to monitor booking requests and their
lifecycle, including:

1.  Patient submits a request.
2.  Professional receives the request.
3.  Professional accepts or rejects it.
4.  Patient receives the updated status.
5.  Service is delivered.
6.  Professional submits required service notes.
7.  Request proceeds to completion/closure only after required
    documentation is submitted.

The Admin Panel should make it possible for authorized administrators to
identify requests that are pending, accepted, rejected, in progress,
awaiting documentation, or completed, according to the actual status
model.

Do not silently change a booking's status or bypass required workflow
checks. Any authorized administrative intervention must be recorded with
the actor, timestamp, and reason where appropriate.

## 9. Mandatory service documentation and closure oversight

A service request must not be considered fully completed or closed
merely because the appointment time has passed.

The responsible doctor, nurse, or healthcare provider must submit the
required notes about the service delivered. The Admin Panel should allow
authorized administrators to identify requests that remain open because
documentation is missing.

The system must: - Clearly distinguish service delivery from
documentation completion. - Prevent closure while required service notes
are missing. - Show the documentation status to authorized
administrators. - Preserve who submitted the notes and when. - Maintain
a traceable amendment history for changes to submitted clinical notes. -
Avoid allowing an administrator to fabricate or enter clinical notes on
behalf of a professional.

Any exceptional administrative override, if the product owner later
authorizes one, must be tightly permissioned, justified, and auditable.
Do not introduce an override merely for convenience.

## 10. Ratings, feedback, and complaints

Patients can rate professionals and provide feedback after services. The
Admin Panel should support appropriate oversight of submitted ratings
and feedback.

Where supported by the product's policies, authorized administrators may
review reports or complaints, investigate inappropriate content, and
record moderation outcomes.

-   Preserve the original feedback and relevant audit history.
-   Do not allow professionals to edit patient-submitted ratings.
-   Do not treat ordinary ratings as a substitute for a clinical
    incident-management process.
-   Restrict sensitive complaint and patient information to staff who
    need it.

## 11. Patient data privacy and administrative access

Patient health information is sensitive. Administrative status must not
automatically grant every staff member unrestricted access to every
patient's complete Digital Health Passport.

Enforce: - Role-based administrative permissions. - Minimum-necessary
access. - Purpose limitation for access to clinical information. -
Appropriate consent and authorization requirements. - Server-side/API
permission checks. - Audit logs for access to sensitive patient
information and important administrative actions. - Secure handling of
credentials, reports, prescriptions, and clinical notes.

The platform's professional access model must also remain purpose-based:
a professional should only see patient information relevant and
necessary for the specific service they are assigned to provide.

## 12. Operational oversight and auditability

Record important administrative actions, including verification
decisions, account restrictions, service configuration changes, and
booking interventions. Audit records should identify the responsible
account, action, timestamp, and relevant context.

Do not expose audit logs or internal administrative notes to ordinary
patients or professionals unless an explicitly authorized product
workflow requires it.

## 13. Admin Panel experience requirements

The Admin Panel should feel like a professional operational workspace,
distinct from the patient-facing and professional-facing experiences. It
should prioritize clarity, efficient review, accurate status
information, and safe administrative controls.

This document does not prescribe a particular visual layout, color
palette, navigation structure, or technology. The coding agent must
inspect the existing HOMIGO CARE application and adapt the Admin Panel
to the established design language while making its administrative
purpose clear.

## 14. Security and safeguards

-   Restrict access to authenticated, authorized administrators.
-   Enforce permissions on backend/API operations, not only in the UI.
-   Prevent privilege escalation between patient, professional, and
    admin roles.
-   Protect patient data and professional verification documents.
-   Validate administrative actions and inputs.
-   Preserve audit history for sensitive operations.
-   Do not hardcode administrator credentials or bypass authentication.
-   Do not expose real patient or professional data in test fixtures,
    logs, or public pages.
-   Do not claim that a verification process guarantees clinical
    outcomes or eliminates risk.

## 15. Implementation and verification instructions

Before implementation, inspect the complete existing repository,
authentication and role model, route structure, user-management
features, professional verification workflow, service configuration,
booking lifecycle, clinical-note storage, feedback handling, and audit
capabilities.

Implement the Admin Panel as a distinct, securely authorized role
experience. Reuse the existing architecture and components where
suitable. Determine the necessary frontend, backend, database, API, and
security changes from the actual project rather than imposing a new
stack.

Protect existing functionality: - Do not redesign the entire
application. - Do not unnecessarily modify, remove, or replace unrelated
screens, components, workflows, configurations, or database records. -
Make only the changes necessary to implement and integrate the Admin
Panel. - Preserve existing functionality, architecture, and data.

Implement real administrative behavior rather than static dashboard
mockups. Enforce authorization at every privileged operation. Handle
loading, empty, error, invalid, and unauthorized states. Use real data
and avoid fabricated metrics.

Test role separation, administrator authorization, verification review
and decisions, account management permissions, service configuration,
booking oversight, documentation-dependent closure, feedback review,
audit logging, and patient-data access restrictions. Verify that patient
and professional experiences continue to work and that no unauthorized
role can access administrative functions. Fix regressions and report
exactly what was implemented and tested. Never claim completion without
actual verification.
