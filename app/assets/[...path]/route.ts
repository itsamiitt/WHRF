import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const assetRoot = path.resolve(process.cwd(), "assets");

const contentTypeByExtension = new Map<string, string>([
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"],
  [".webp", "image/webp"]
]);

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  const { path: requestedSegments } = await context.params;
  const requestedPath = path.resolve(assetRoot, ...requestedSegments);

  if (!requestedPath.startsWith(assetRoot)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(requestedPath);
    const extension = path.extname(requestedPath).toLowerCase();
    const contentType =
      contentTypeByExtension.get(extension) ?? "application/octet-stream";

    const isStyle = extension === ".css" || extension === ".js";
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": isStyle ? "no-cache, must-revalidate" : "public, max-age=86400"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
