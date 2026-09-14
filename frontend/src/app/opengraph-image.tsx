import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TaskFlow Preview";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 128,
          fontWeight: 800,
          color: "#171717",
          letterSpacing: "-0.05em",
        }}
      >
        TaskFlow
      </div>
      <div style={{ fontSize: 48, color: "#4f46e5", marginTop: 20 }}>
        Master your work with absolute clarity.
      </div>
    </div>,
    {
      ...size,
    },
  );
}
