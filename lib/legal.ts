/**
 * Legal entity fields from visura camerale 23/04/2026 (impresa individuale Emanuele Virginia).
 * Privacy, cookie and terms copy still needs counsel review before go-live.
 */
import { spaEmail, spaLocality, spaPostalCode, spaRegion, spaStreetAddress, siteName, siteUrl } from "./site";

export const legalReviewNotice =
  "Testo modello per Virginia SPA — da revisionare da legale/commercialista prima del go-live.";

export const legalEntityName = "Emanuele Virginia";
export const legalVatNumber = "P.IVA 03256800594";
export const legalFiscalCode = "MNLVGN85C55A323R";
export const legalRea = "LT-320255";
export const legalRegisteredOffice = `${spaStreetAddress}, ${spaPostalCode} ${spaLocality} (${spaRegion})`;
export const legalRepresentative = "Emanuele Virginia";
export const legalPec = "virginiaemanuele@pec.it";
export const privacyEmail = spaEmail;
export const legalBrandName = siteName;
export const legalSiteUrl = siteUrl;

/** Voucher validity used in terms and emails. */
export const voucherValidityMonths = 12;
