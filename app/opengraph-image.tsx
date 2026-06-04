import { ImageResponse } from "next/og";

export const alt = "Jeevan Adhikari - Full Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(212,246,0,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              fontSize: 14,
              color: "#555",
              marginBottom: 16,
            }}
          >
            <span>~</span>
            <span style={{ color: "#d4f600" }}>&gt;</span>
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#e0e0e0",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Jeevan
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#d4f600",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Adhikari
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#555",
              marginTop: 16,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Full Stack Engineer
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#333",
              marginTop: 8,
            }}
          >
            jeevanadhikari.com.np
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
