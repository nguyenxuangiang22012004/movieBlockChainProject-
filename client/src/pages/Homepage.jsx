import React from 'react';

// Import các component con mà chúng ta sẽ tạo ở các bước tiếp theo
import HeroSlider from '../components/HeroSlider';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import PremiereSection from '../components/PremiereSection';
import PricingSection from '../components/PricingSection';
import PlanModal from '../components/PlanModal';

function HomePage() {
  return (
    <>
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Đây là wrapper chứa cả Filter và Catalog */}
      <div>
        {/* Filter (fixed position) */}
        <FilterBar />

        {/* Catalog */}
        <MovieGrid />
      </div>

      {/* Expected Premiere Section */}
      <PremiereSection />

      {/* Pricing Section */}
      <PricingSection />
      
      {/* Plan Modal (ẩn) */}
      <PlanModal />
    </>
  );
}

export default HomePage;