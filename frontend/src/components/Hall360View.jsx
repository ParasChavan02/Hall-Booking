import { useState, useEffect, useRef } from "react";

export default function Hall360View({ panoramaUrl, hallName }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        setRotation((prev) => prev + deltaX * 0.5);
        setStartX(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const deltaX = e.touches[0].clientX - startX;
      setRotation((prev) => prev + deltaX * 0.5);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Auto-rotate when not dragging
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 0.2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '1rem',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {panoramaUrl ? (
          <img
            src={panoramaUrl}
            alt={hallName}
            style={{
              width: 'auto',
              height: '100%',
              minWidth: '200%',
              objectFit: 'cover',
              transform: `translateX(${-rotation}px)`,
              transition: isDragging ? 'none' : 'transform 0.05s linear',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-primary)">
                  <div style="font-size: 4rem; margin-bottom: 1rem">🏛️</div>
                  <p style="color: var(--text-muted)">360° view image failed to load</p>
                  <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem">${hallName}</p>
                </div>
              `;
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏛️</div>
            <p style={{ color: 'var(--text-muted)' }}>360° view not available</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {hallName}
            </p>
          </div>
        )}
      </div>
      
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'white',
          fontSize: '0.875rem'
        }}
      >
        <span>🔄</span>
        <span>{isDragging ? 'Drag to rotate' : 'Auto-rotating'}</span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        {Math.round((rotation % 360 + 360) % 360)}°
      </div>
    </div>
  );
}
