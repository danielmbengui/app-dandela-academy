import { NextResponse } from "next/server";

/**
 * Proxy pour images externes (ex. Firebase Storage).
 * Contourne CORS lors de l'export PDF (html2canvas) en récupérant l'image côté serveur.
 * Usage : /api/proxy-image?url=https://...
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(url, { headers: { "User-Agent": "Dandela-Academy-PDF-Export/1.0" } });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
    }
    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[proxy-image]", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 502 });
  }
}
