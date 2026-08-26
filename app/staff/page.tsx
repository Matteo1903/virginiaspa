import type { Metadata } from "next";
import StaffVouchers from "./staff-vouchers";
export const metadata: Metadata = { title: "Gestione voucher", robots: { index: false, follow: false } };
export default function Page() { return <StaffVouchers />; }
