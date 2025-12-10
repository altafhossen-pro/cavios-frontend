"use client";

export default function ProductSkeleton({ count = 12, gridClass = "" }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`card-product ${gridClass}`}
        >
          <div className="card-product-wrapper">
            {/* Image skeleton */}
            <div 
              className="product-img" 
              style={{ 
                position: 'relative', 
                width: '100%', 
                paddingBottom: '133.33%',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <div
                className="skeleton-shimmer"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            </div>
          </div>
          <div className="card-product-info" style={{ paddingTop: '12px' }}>
            {/* Title skeleton */}
            <div
              className="skeleton-shimmer"
              style={{
                width: '80%',
                height: '18px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                marginBottom: '10px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
            {/* Price skeleton */}
            <div
              className="skeleton-shimmer"
              style={{
                width: '60%',
                height: '16px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>
        </div>
      ))}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  );
}

