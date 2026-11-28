# Aliyah Mueller Enterprises — Brand Architecture

## Parent identity

**Aliyah Mueller Enterprises** is the umbrella brand for the founder's portfolio of businesses, products, and internal platforms.

**Positioning:** One coordinated business group. Distinct brands. Shared operations.

**Primary corporate domain:** https://aliyahmuellerenterprises.com

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

The parent company's registered primary domain is **aliyahmuellerenterprises.com**. Individual brands may retain their existing domains and use clearly labeled links or subdomains where appropriate. Keep the former Aliyahmuellerwork.com address available during migration until hosting, DNS, certificates, redirects, and authentication have been tested. Do not cancel, transfer, or disconnect the old domain until the new domain is verified end-to-end.

## Legal and operational note

This document defines a proposed brand and technology structure only. It does **not** establish a legal holding company, merge existing entities, change ownership, or create DBAs. Legal entity names, registrations, tax treatment, licenses, insurance, banking, and healthcare compliance must be confirmed separately with the relevant professionals and authorities before representing that all businesses are legally owned or operated by one entity.

## Rollout checklist

- [x] Confirm the parent brand name and public descriptor.
- [x] Select and register an approved parent-company domain.
- [ ] Verify DNS, HTTPS certificate, and website hosting for the new domain.
- [ ] Map each existing app, account, domain, and integration to its business division.
- [ ] Update the JARVIS portal branding and portfolio navigation.
- [ ] Configure production hosting and Supabase Auth URLs after DNS and hosting are verified.
- [ ] Update Canva brand assets and templates.
- [ ] Update Shopify store footer/about references where appropriate.
- [ ] Update business profiles, invoices, email signatures, and social profiles after legal and brand review.
- [ ] Test each integration and confirm account ownership and access controls.

## Current implementation status

The parent-company domain is registered and documented. The JARVIS repository's sample environment file now points to the new domain on the feature branch. This is a development configuration/documentation change only; it does not change production hosting, DNS, Supabase Auth settings, or connected third-party applications. Existing brands and production settings remain unchanged until individually reviewed and verified.
