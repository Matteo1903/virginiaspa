/**
 * Legal entity fields for privacy / terms templates.
 * Replace placeholders with the SPA’s registry data before go-live; have counsel review pages.
 */
import { spaEmail, spaLocality, spaPostalCode, spaRegion, spaStreetAddress, siteName, siteUrl } from "./site";

export const legalReviewNotice =
  "Testo modello per Virginia SPA — da revisionare da legale/commercialista prima del go-live.";

export const legalEntityName = "Virginia SPA (ragione sociale da confermare)";
export const legalVatNumber = "P.IVA da confermare";
export const legalRegisteredOffice = `${spaStreetAddress}, ${spaPostalCode} ${spaLocality} (${spaRegion})`;
export const legalRepresentative = "Titolare / legale rappresentante da confermare";
export const legalPec = "PEC da confermare";
export const privacyEmail = spaEmail;
export const legalBrandName = siteName;
export const legalSiteUrl = siteUrl;

/** Voucher validity used in terms and emails. */
export const voucherValidityMonths = 12;
