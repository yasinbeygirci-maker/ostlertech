import "server-only";

// Paddle-Signature denetimi saf modülde (lib/paddle-imza.ts, birim testli); bu dosya yalnız sunucu sınırını korur.
export { verifyPaddleSignature } from "@/lib/paddle-imza";
