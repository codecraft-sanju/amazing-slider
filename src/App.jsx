import React, { useState, useEffect, useRef } from 'react';
import './App.css'; 


const images = [
  {
    url: 'https://wallpaperaccess.com/full/2493384.jpg',
    caption: 'Beautiful Landscape',
  },
  {
    url: 'https://tse3.mm.bing.net/th?id=OIP._AQB5bs__31KG6qozVRAsQHaFI&pid=Api&P=0&h=220',
    caption: 'Serene Beach',
  },
  {
    url: 'http://www.officechai.com/wp-content/uploads/2015/06/Dhoni-tte-collector.jpg',
    caption: 'Inspirational Leader',
  },
  {
    url: 'https://tse4.mm.bing.net/th?id=OIP.RbIT-WWgOHLGB3u4rE7bTwHaE7&pid=Api&P=0&h=220',
    caption: 'Golden Sunset',
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const sliderRef = useRef(null);
  const progressRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetProgress();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetProgress();
  };

  const resetProgress = () => {
    setProgress(0);
    if (progressRef.current) {
      clearInterval(progressRef.current);
      startProgress();
    }
  };

  const startProgress = () => {
    let counter = 0;
    progressRef.current = setInterval(() => {
      if (counter >= 100) {
        clearInterval(progressRef.current);
        nextSlide();
      } else {
        counter += 2;
        setProgress(counter);
      }
    }, 60);
  };

  // Autoplay logic
  useEffect(() => {
    if (isPlaying) {
      startProgress();
    } else if (progressRef.current) {
      clearInterval(progressRef.current);
    }
    return () => clearInterval(progressRef.current);
  }, [isPlaying]);

  // Lazy load images
  const lazyLoadImage = (src) => {
    const img = new Image();
    img.src = src;
    return img.src;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto slider-container">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 slider-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        ref={sliderRef}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative min-w-full overflow-hidden bg-center bg-cover slide h-72"
            style={{
              backgroundImage: `url(${lazyLoadImage(image.url)})`,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
              <h3 className="text-lg font-semibold">{image.caption}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute p-2 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full nav-btn left top-1/2 left-4"
        onClick={prevSlide}
      >
        &lt;
      </button>
      <button
        className="absolute p-2 text-white transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full nav-btn right top-1/2 right-4"
        onClick={nextSlide}
      >
        &gt;
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-4 space-x-2 thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail w-16 h-16 border-2 ${
              index === currentIndex ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => setCurrentIndex(index)}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

      {/* Play/Pause */}
      <button
        className="absolute px-4 py-2 text-white bg-black bg-opacity-50 rounded bottom-4 right-4"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Slider />
    </div>
  );
}
