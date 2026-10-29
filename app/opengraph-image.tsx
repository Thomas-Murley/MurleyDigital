import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4 }}>MURLEY DIGITAL</div>
        <div style={{ display: "flex", fontSize: 84, lineHeight: 0.95, letterSpacing: -2, maxWidth: 900 }}>
          Websites that earn their keep.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5e584e" }}>Design, engineering, and hosting.</div>
      </div>
    ),
    size,
  );
}
