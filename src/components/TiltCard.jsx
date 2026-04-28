import { useRef, useState } from "react";

/**
 * 3D Tilt Card — tracks mouse position and applies perspective rotation
 * glowColor: the radial glow color that follows the cursor
 */
export default function TiltCard({ children, className = "", glowColor = "rgba(99,102,241,0.18)" }) {
  const cardRef = useRef(null);
  const [style, setStyle]     = useState({});
  const [glow, setGlow]       = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect    = cardRef.current.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const cx      = rect.width  / 2;
    const cy      = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) *  10;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`,
      transition: "transform 0.12s ease-out",
    });
    setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
      transition: "transform 0.45s ease-out",
    });
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ ...style, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      {/* Cursor-following glow */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-10 transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, ${glowColor}, transparent 65%)`,
          }}
        />
      )}

      {/* Content lifted toward viewer */}
      <div className="relative z-20 tilt-inner">
        {children}
      </div>

      {/* Card shadow that deepens on hover */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none -z-10 transition-all duration-300"
        style={{
          boxShadow: hovered
            ? "0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(99,102,241,0.15)"
            : "0 8px 24px rgba(0,0,0,0.4)",
          transform: "translateZ(-4px)",
        }}
      />
    </div>
  );
}
