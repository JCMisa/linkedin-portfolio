"use client";

import dynamic from "next/dynamic";

/** Admin-only dialogs, code-split so visitors never download them. */
export const CertificateFormDialog = dynamic(
  () => import("./CertificateFormDialog"),
);
export const DeleteCertificate = dynamic(() => import("./DeleteCertificate"));
