import React, { useRef, useState, useEffect } from 'react';

// Small LazyImage component: uses native loading="lazy" when available,
// and falls back to IntersectionObserver to set src when the image comes into view.
export default function LazyImage({
  src,
  alt = '',
  className = '',
  style = {},
  placeholder = null,
  ...props
}) {
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;
    // If browser supports native lazy loading, no need for IntersectionObserver
    if ('loading' in HTMLImageElement.prototype) {
      setVisible(true);
      return;
    }

    let observer;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '200px'
        }
      );
      observer.observe(imgRef.current);
    } catch (e) {
      // IntersectionObserver not supported -> show image
      setVisible(true);
    }

    return () => {
      if (observer && observer.disconnect) observer.disconnect();
    };
  }, [src]);

  // If not visible yet and a placeholder provided, render the placeholder element
  if (!visible && placeholder) {
    if (React.isValidElement(placeholder)) return placeholder;
    return (
      <div className={className} style={{ ...style }}>
        {placeholder}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={visible ? src : undefined}
      data-src={src}
      loading="lazy"
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  );
}
