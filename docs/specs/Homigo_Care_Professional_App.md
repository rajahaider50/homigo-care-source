# HOMIGO CARE --- Healthcare Professional App

## 1. Purpose

Create a dedicated, professional-facing application experience for
HOMIGO CARE. It is intended for doctors, nurses, and other approved
healthcare service providers who deliver services through the platform.

**Brand:** HOMIGO CARE\
**Tagline:** Because Care Begins at Home.

HOMIGO CARE has three distinct role experiences: 1. Patient App 2.
Healthcare Professional App 3. Admin Panel

This document defines the Healthcare Professional App. It must not be
treated as the patient interface or the administrator's full
platform-management dashboard.

## 2. Core objectives

-   Give approved professionals a clear place to manage their
    professional presence on HOMIGO CARE.
-   Support credential submission and verification.
-   Let professionals manage service requests and availability.
-   Support clear communication and appointment coordination.
-   Require appropriate clinical/service documentation before a request
    can be closed.
-   Provide professionals with only the patient information necessary
    for the care they are assigned to provide.

## 3. Intended users

-   Nurses.
-   Doctors.
-   Other healthcare professionals or service providers supported by the
    platform.

The application should adapt available functions to the professional's
role, approved status, service category, and permissions. Do not assume
every professional can provide every service.

## 4. Professional onboarding and verification

The HOMIGO CARE concept includes a three-step professional verification
process:

### Step 1 --- Credential verification

Collect and review relevant professional credentials, such as
qualifications, registration/licensing documents, and applicable
certifications.

### Step 2 --- Employment and experience verification

Collect and review relevant work history and professional experience.

### Step 3 --- Knowledge assessment and administrative review

Provide the intended MCQ-based knowledge assessment and submit the
application for administrative evaluation before approval.

The professional should be able to understand their verification status
and whether further information or action is required. The system must
not represent an applicant as verified before the required review and
approval have actually occurred.

An MCQ assessment alone must not be represented as proof of clinical
competence. The verification process should be accurately described as
the platform's credential and onboarding review.

## 5. Professional profile

Approved professionals should have a profile containing relevant
information such as:

-   Name and professional identity.
-   Qualifications.
-   Relevant experience.
-   Specialization.
-   Services offered.
-   Availability.
-   Professional verification status.

Allow professionals to submit or update profile information as permitted
by the existing approval process. Changes to sensitive credential fields
may require administrative review before being displayed as verified.

Patients should see appropriate professional profile information to help
them make informed choices. Do not expose private administrative notes,
internal review comments, or sensitive verification documents on public
profiles.

## 6. Service requests and booking management

The professional should have a dedicated area to review incoming service
requests. The intended workflow is:

1.  A patient submits a booking request for a service, professional,
    date, and time.
2.  The relevant professional receives the request.
3.  The professional reviews the request and its permitted details.
4.  The professional can accept or reject the request.
5.  The patient receives the updated booking status.
6.  Accepted requests appear in the professional's relevant schedule or
    booking list.
7.  The professional provides the agreed service.
8.  The professional submits the required service notes.
9.  The request remains open/incomplete until the required notes have
    been submitted.
10. The request may then proceed to completion/closure according to the
    application's workflow.

Prevent professionals from accepting requests that are no longer
available or that conflict with the platform's booking rules. Handle
concurrent updates safely so that two professionals cannot
unintentionally accept the same request.

## 7. Clinical and service documentation --- mandatory completion requirement

This is a core HOMIGO CARE workflow requirement.

A service must not be considered fully completed or closed merely
because the appointment time has ended or the professional indicates
that the visit took place.

The responsible doctor, nurse, or healthcare provider must submit the
appropriate notes documenting the service provided. Depending on the
service and professional's scope, notes may include:

-   Service delivered.
-   Relevant observations.
-   Care or procedures performed.
-   Relevant patient response or outcome.
-   Follow-up advice or instructions within the professional's scope.
-   Any concern that needs escalation to the responsible clinical team.

The exact fields should be appropriate to the service type and the
professional's scope. Do not force every service to use an identical
clinical template if that would be inappropriate.

### Required workflow behavior

-   A request remains open/incomplete while required service notes are
    missing.
-   The professional must be able to save and submit the required notes
    through the relevant request.
-   The system must record which authorized professional submitted the
    notes and when.
-   The system must prevent a request from being marked completed/closed
    while required documentation is missing.
-   After valid submission, the request can move to the next completion
    state according to the agreed application workflow.
-   If a note needs correction, use a traceable amendment process rather
    than silently overwriting clinical history.
-   Preserve an appropriate audit trail for creation, submission, and
    amendment of service notes.

Do not invent an extra patient-confirmation requirement for closure
unless it already exists in the application or is separately approved by
the product owner.

## 8. Patient information and privacy

Professionals must only access patient information relevant and
necessary to the specific service they are providing.

For example, a nurse assigned to wound dressing may need access to
relevant medical history, allergies, medication information, and
wound-care instructions. That nurse must not automatically receive
access to unrelated patient information.

Implement and enforce:

-   Role-based access control.
-   Purpose-based access tied to the assigned service or care
    relationship.
-   Minimum-necessary access to patient records.
-   Appropriate patient consent and authorization.
-   Server-side/API authorization, not just hidden interface elements.
-   Access logs recording who accessed relevant information and when.
-   Controlled emergency access, if supported, with justification and
    audit trail.

Access should be restricted when a booking is rejected, cancelled,
unassigned, or otherwise no longer provides a valid reason for access,
subject to legitimate record-retention and care obligations.

## 9. Patient--provider communication

Provide communication capabilities for relevant:

-   Booking questions.
-   Appointment coordination.
-   Care-related questions and professional guidance.
-   Follow-up coordination.

A professional must only access conversations they are authorized to
participate in. Messages containing health information must be protected
according to the application's security and privacy model.

Do not imply that messaging is an emergency response channel.
Professionals must work within their scope and the applicable clinical
protocols.

## 10. Scheduling and availability

Allow professionals to manage their service availability using the
existing scheduling model. The system should ensure that patients are
shown valid available slots and that accepted bookings are reflected
consistently for both patient and professional.

Avoid duplicate booking systems. Reuse the existing scheduling and
booking infrastructure where suitable.

## 11. Ratings and feedback visibility

Patients can rate professionals and provide feedback after services. The
professional experience may show feedback that the professional is
authorized to see, in accordance with platform policy.

Do not allow professionals to alter or delete patient ratings. Any
moderation or dispute handling should remain under the appropriate
administrative controls.

## 12. Professional dashboard and navigation

The professional experience should prioritize the tasks relevant to
delivering care, such as:

-   Verification/onboarding status.
-   Professional profile.
-   Incoming service requests.
-   Accepted and upcoming bookings.
-   Booking history and service status.
-   Required service notes.
-   Authorized patient communication.
-   Availability management.
-   Relevant ratings/feedback.

These are functional areas, not a demand for a particular screen layout.
The coding agent should determine the best navigation and presentation
by inspecting the existing application.

## 13. Role and scope safeguards

-   Show only services the professional is approved and permitted to
    provide.
-   Do not allow an unapproved professional to appear as verified or
    accept restricted requests.
-   Do not permit independent diagnosis, prescribing, or treatment
    changes outside the professional's lawful scope.
-   Preserve the distinction between Hospital Companion Nurse and
    Hospital Navigator Nurse.
-   A Hospital Companion Nurse supports an admitted patient at the
    bedside within hospital policies and the treating team's orders.
-   A Hospital Navigator Nurse supports care navigation and
    coordination, including follow-up and post-discharge coordination,
    without replacing the treating clinician.
-   Do not expose administrative-only controls or other professionals'
    private records.

## 14. Implementation and verification instructions

Before implementation, thoroughly inspect the existing repository,
role/authentication model, professional onboarding, booking lifecycle,
scheduling, messaging, clinical records, and admin review workflows.

Implement a distinct Healthcare Professional App experience using the
existing architecture, design system, reusable components, and backend
services where appropriate. Determine the necessary frontend, backend,
database, and API changes independently from the codebase.

Protect existing functionality: - Do not redesign the entire
application. - Do not unnecessarily modify, remove, or replace unrelated
features. - Do not damage existing data, configurations, or workflows. -
Make only changes required to implement and integrate the professional
experience.

Implement complete behavior, not only static screens. Enforce
permissions on the server/API layer. Validate inputs, handle errors and
concurrency, and preserve an audit trail for important clinical and
booking actions.

Test onboarding and verification states, profile permissions, incoming
requests, accept/reject behavior, scheduling conflicts, patient-data
access restrictions, messaging permissions, clinical-note submission,
amendment history, and the rule that a request cannot close while
required notes are missing. Verify that patient and admin experiences
continue to function correctly. Never claim completion without actual
test evidence.
