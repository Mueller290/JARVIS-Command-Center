# Aliyah Mueller Enterprises — Brand Architecture

## Parent identity

**Aliyah Mueller Enterprises** is the proposed umbrella brand for the founder's portfolio of businesses, products, and internal platforms.

**Positioning:** One coordinated business group. Distinct brands. Shared operations.

**Suggested public descriptor:** A multi-brand business group building services, technology, creative products, commerce, and education.

## Portfolio

| Division | Brand / platform | Role |
|---|---|---|
| Technology & Innovation | JARVIS Command Center | Internal operating system and AI-assisted command center |
| Creative & Digital | Starlight Dust Studios | Creative services, design, and digital projects |
| Healthcare Services | West Valley Mobile Phlebotomy | Mobile phlebotomy service brand |
| Retail & E-Commerce | Shopify stores and beauty brands | Consumer products and online retail |
| Education | Starlight Learning | Educational media and learning resources |
| Data & Analytics | Starlight Dust Studios / analytics division | Analytics, reporting, and consulting |

## Shared technology standards

- Use the parent identity in the central business portal, administrative documents, internal dashboards, and shared operating procedures.
- Keep each customer-facing business brand distinct where its audience, compliance obligations, or market positioning require it.
- Centralize identity and access management where technically appropriate, but preserve separate permissions and data boundaries between businesses.
- Use least-privilege access, multifactor authentication, secure secret storage, and row-level access controls.
- Do not place service-role keys, private API keys, payment credentials, or health/customer records in public repositories or client-side code.
- Require owner approval before purchases, domain transfers, legal filings, payment changes, publishing, or external commitments.

## Domain and deployment convention

The parent company should have one primary corporate domain. Individual brands may retain their existing domains and use clearly labeled links or subdomains where appropriate. Do not replace existing domains, change DNS, or update production redirect settings until the new domain is purchased, verified, and approved by the owner.

## Legal and operational note

This document defines a proposed brand and technology structure only. It does **not** establish a legal holding company, merge existing entities, change ownership, or create DBAs. Legal entity names, registrations, tax treatment, licenses, insurance, banking, and healthcare compliance must be confirmed separately with the relevant professionals and authorities before representing that all businesses are legally owned or operated by one entity.

## Rollout checklist

- [ ] Confirm the parent brand name and public descriptor.
- [ ] Check state entity-name and trademark conflicts.
- [ ] Select and register an approved parent-company domain.
- [ ] Map each existing app, account, domain, and integration to its business division.
- [ ] Update the JARVIS portal branding and portfolio navigation.
- [ ] Configure production hosting and Supabase Auth URLs only after domain verification.
- [ ] Update Canva brand assets and templates.
- [ ] Update Shopify store footer/about references where appropriate.
- [ ] Update business profiles, invoices, email signatures, and social profiles after legal and brand review.
- [ ] Test each integration and confirm account ownership and access controls.

## Current implementation status

This architecture is documented in the JARVIS repository. It is not yet deployed to production or propagated to connected third-party apps. Existing brands and production settings remain unchanged until individually reviewed and approved.
