"use client";

import dynamic from "next/dynamic";

/**
 * Admin-only dialogs, code-split with next/dynamic: visitors never download
 * them (or react-hook-form / zod / the date picker they pull in). The chunk
 * is fetched only when an admin view actually renders one.
 */
export const ProjectFormDialog = dynamic(() => import("./ProjectFormDialog"));
export const DeleteProject = dynamic(() => import("./DeleteProject"));
