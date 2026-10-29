import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#efeae1",
          color: "#1c1915",
          padding: "72px",
        }}
      >
        <img src={src} alt="" width={280} height={197} />
        <div style={{ display: "flex", fontSize: 76, lineHeight: 0.95, letterSpacing: -2, maxWidth: 920 }}>
          Websites that earn their keep.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5e584e" }}>Design, engineering, and hosting.</div>
      </div>
    ),
    size,
  );
}
