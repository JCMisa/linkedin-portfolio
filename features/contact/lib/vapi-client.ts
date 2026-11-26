import Vapi from "@vapi-ai/web";
import { env } from "@/lib/env";

export const vapi = new Vapi(env.NEXT_PUBLIC_VAPI_API_KEY);
