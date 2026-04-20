import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B0C0E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            color: "#F7F6F2",
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: -3.5,
            display: "flex",
          }}
        >
          RO
        </div>
        <svg
          width="34"
          height="24"
          viewBox="0 0 34 24"
          style={{ position: "absolute", right: 18, bottom: 22 }}
        >
          <path
            d="M3 13 L12 22 L31 3"
            stroke="#3B6FE3"
            strokeWidth="6"
            strokeLinecap="square"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
