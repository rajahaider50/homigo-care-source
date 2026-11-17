# HOMIGO CARE --- Patient App

## 1. Purpose

Create a dedicated, patient-facing application experience for HOMIGO
CARE. This app is for patients and family members who arrange or manage
healthcare services. It must make it straightforward to discover
suitable care, request and manage services, communicate with providers,
and follow the patient's healthcare journey.

**Brand:** HOMIGO CARE\
**Tagline:** Because Care Begins at Home.

The Patient App is one of three distinct HOMIGO CARE experiences: 1.
Patient App 2. Healthcare Professional App 3. Admin Panel

This document defines the intended Patient App experience. It is a
product and implementation brief, not permission to redesign or replace
the existing project wholesale.

## 2. Core objectives

-   Help patients and families access appropriate healthcare services.
-   Make it easier to find and book suitable healthcare professionals.
-   Support care at home and relevant hospital-based support.
-   Keep booking information and service status understandable.
-   Support communication between patients/families and providers.
-   Help patients maintain an organized healthcare journey.
-   Provide visibility into the care delivered and allow patients to
    rate services.

## 3. Intended users

-   Patients arranging care for themselves.
-   Family members arranging care for another person.
-   Patients requiring regular assistance, including older adults.
-   Patients with chronic conditions requiring ongoing care.
-   Post-surgical patients requiring recovery support.
-   Patients with limited mobility or difficulty travelling.
-   Families coordinating care for different members.

The app should support a family member arranging care on behalf of a
patient without confusing the identity of the person receiving care with
the identity of the person making the booking.

## 4. Patient-facing service areas

The app should present the services that are actually configured and
available in the existing product. Potential service categories in the
HOMIGO CARE concept include:

-   Home nursing and nursing assistance.
-   Doctor consultations.
-   Hospital Companion Nurse.
-   Hospital Navigator Nurse.
-   Laboratory services.
-   Pharmacy services.
-   Nutrition support.
-   Digital Health Passport.
-   Patient--provider chat and care coordination.

Do not display a service as bookable if it is not configured, available,
or supported by the current implementation. Clearly distinguish live
services from planned or coming-soon services.

### 4.1 Hospital Companion Nurse

This service is intended to provide bedside support to a patient during
a hospital admission. The patient/family should be able to understand
that this role focuses on support during the hospital stay, including
appropriate daily-care assistance, comfort, mobility support, and
communicating relevant concerns to the responsible clinical team.

The service must not imply that the companion nurse replaces the
hospital's treating team or can independently change prescribed
treatment.

### 4.2 Hospital Navigator Nurse

This service is intended to help patients and families navigate the
wider healthcare journey, particularly follow-up and coordination after
discharge. Relevant support may include organizing follow-up
appointments, helping coordinate specialist visits, organizing reports
and prescriptions, and clarifying next steps already recommended by the
treating team.

The service must not imply independent diagnosis or prescribing.

## 5. Patient account and profile

Provide a patient profile that allows the user to manage relevant
account and contact information. Where a family member is arranging care
for another person, make the patient/recipient of care clear throughout
the booking and service workflow.

Use the existing application's authentication, profile, and account
conventions wherever possible. Do not introduce duplicate account
systems if suitable systems already exist.

## 6. Service discovery and booking

The patient should be able to:

1.  Browse available services.
2.  Review relevant service information.
3.  Browse suitable healthcare professionals where applicable.
4.  Review professional profiles, including qualifications, experience,
    specialization, services offered, availability, and verification
    status where these fields are available.
5.  Select a suitable service or professional.
6.  Select an available date and time.
7.  Submit a booking request.
8.  Receive a clear confirmation that the request has been submitted.

Only show genuine availability returned by the application's existing
booking logic. Prevent accidental duplicate submissions and clearly
communicate unavailable or invalid time slots.

## 7. Booking lifecycle and status visibility

The patient should be able to view the status of each booking/request.
The intended workflow is:

1.  Patient submits a request.
2.  The selected professional receives the request.
3.  The professional accepts or rejects the request.
4.  The patient is informed of the decision and current status.
5.  If accepted, the service proceeds as scheduled.
6.  After the service is delivered, the responsible healthcare
    professional must submit the required service notes.
7.  The request must remain open/incomplete until the required notes are
    submitted.
8.  Once the required documentation is submitted and the application's
    completion rules are satisfied, the request can be marked
    completed/closed.
9.  The patient can rate the professional and provide feedback.

Do not mark a service completed merely because its scheduled time has
passed. The service documentation requirement is an important part of
the completion workflow.

The exact closure rule should follow the existing product workflow. If
the current system has no defined rule beyond provider submission of
notes, implement the agreed requirement that the required provider notes
must be submitted before closure. Do not invent an additional
patient-approval gate.

## 8. Patient--provider communication

Provide a patient--provider communication area for:

-   Booking-related questions.
-   Appointment coordination.
-   Relevant care-related questions and professional guidance.
-   Follow-up coordination.

Communication must be associated with the correct patient and booking
where appropriate. Protect health information and ensure that only
authorized participants can access a conversation. The interface should
not imply that chat is an emergency service or a substitute for urgent
medical attention.

## 9. Digital Health Passport

Provide an organized digital health record area for relevant patient
information, subject to the permissions and consent model implemented by
the application. Information may include:

-   Relevant medical history and diagnoses.
-   Current medications and prescriptions.
-   Allergies and important clinical alerts.
-   Laboratory reports and investigation results.
-   Previous treatment and consultation records.
-   Discharge summaries and care instructions.
-   Follow-up requirements and care plans.

### 9.1 Privacy and access control

The patient's information must not be exposed indiscriminately to every
professional. Access must be limited to information relevant and
necessary for the specific service being provided.

For example, a nurse booked for wound dressing may need access to
relevant allergies, medication information, medical history, and
wound-care instructions, but must not automatically receive access to
unrelated health information.

Implement appropriate role-based and purpose-based access,
minimum-necessary permissions, patient consent where required, and
auditable access records. Any emergency access exception must be
controlled, justified, and logged. Follow applicable privacy and
security requirements identified by the project.

## 10. Nutrition support and future features

Nutrition support is intended to be considered for an early version of
the product, subject to the services actually configured for launch.

Medication reminders and similar extended patient-support features are
future-version ideas, not confirmed initial-release requirements. Do not
present them as active functionality unless the existing project already
implements them and the product owner confirms they are in scope.

## 11. Ratings and feedback

After a service has been delivered, patients should be able to rate the
healthcare professional and submit feedback about their experience.

-   Associate the rating and feedback with the relevant completed
    service and professional.
-   Prevent ratings for services that have not reached the appropriate
    completion state.
-   Avoid duplicate submissions unless the product's existing rules
    explicitly allow editing.
-   Make feedback visible only to authorized users and administrators
    according to the application's existing permissions.
-   Do not treat a rating as a substitute for formal clinical incident
    reporting.

## 12. Notifications

Use the existing notification mechanisms to inform patients about
relevant booking events, such as request submission, acceptance,
rejection, and important status changes. Do not create a separate
notification architecture if the application already has one.

## 13. Patient App experience requirements

The Patient App must feel like a dedicated, coherent patient product
rather than an administrative or provider dashboard. Prioritize clarity,
accessibility, readable service information, straightforward booking,
and understandable status updates.

The coding agent must inspect the existing HOMIGO CARE application and
adapt all screens to its established visual identity, components,
navigation, and responsive behavior. Do not invent a new brand system.

## 14. Boundaries and safeguards

-   Do not claim that planned services are already operational.
-   Do not allow patients to view another patient's private information
    without appropriate authorization.
-   Do not expose a professional's private or administrative information
    unnecessarily.
-   Do not permit unauthorized access to clinical records or
    conversations.
-   Do not represent the platform as a replacement for emergency
    services, hospitals, or treating clinicians.
-   Preserve the distinction between Hospital Companion Nurse and
    Hospital Navigator Nurse.

## 15. Implementation and verification instructions

Before implementation, inspect the complete existing repository, routes,
authentication, user roles, components, data models, APIs, and current
booking/record workflows.

Implement the Patient App as a distinct role-specific experience while
reusing suitable existing components and services. Determine the
appropriate technical implementation from the existing architecture
rather than imposing a new stack.

Protect existing functionality: - Do not redesign the entire
application. - Do not remove or replace unrelated screens or
workflows. - Do not damage existing data or configurations. - Make only
the changes necessary to create and integrate the Patient App
experience.

Implement real functionality, not only static mockups. Validate
authorization on the server/API layer as well as in the interface.
Handle loading, empty, error, unavailable, and invalid states.

Test patient registration/login flows where applicable, service
discovery, booking submission, booking status updates, chat access,
health-record permissions, provider-note-dependent completion, ratings,
and responsive behavior. Verify that other user roles and existing
application functions continue to work. Report what was implemented,
what was tested, and any remaining limitations honestly.
