import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import methodModel from "../../methods/methods";
import CustomMap from "../Property/CustomMap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";

const NewImageSlider = ({
  images,
  setActiveImg = () => { },
  location,
  slideClick = () => { },
  onLastSlide = () => { },
}) => {
  const [dataLoad, setdataLoad] = useState(false)
  const sliderImages = [...images, { file: null }];

  useEffect(() => {
    setdataLoad(true)
  }, [])

  const handleTransition = (currentIndex) => {
    setActiveImg(currentIndex + 1);
    if (sliderImages && currentIndex === sliderImages.length - 1) {
      onLastSlide();
    }
  };
  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 left-2 !h-[30px] -translate-y-1/2 z-10 cursor-pointer text-white text-2xl bg-black bg-opacity-30 rounded-full p-1"
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 right-2 !h-[30px] -translate-y-1/2 z-10 cursor-pointer text-white text-2xl bg-black bg-opacity-30 rounded-full p-1"
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  );
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <Slider {...settings}>
        {sliderImages && sliderImages.length > 0 ? (
          sliderImages.map((img, index) => {
            if (index <= sliderImages.length - 2) {
              return (
                <div>
                  <img
                    className="h-[100%] md:h-[598px] w-full object-cover rounded-[10px]"
                    key={index}
                    src={methodModel.noImg(img?.file || img)}
                    onClick={() => slideClick(img?.file || img)}
                  />
                </div>
              );
            } else {
              return (
                <div key={index}>
                  {dataLoad && <CustomMap locations={location} />}
                </div>
              );
            }
          })
        ) : (
          <div>No Images Available</div>
        )}
      </Slider>
      {/* <AwesomeSlider onTransitionRequest={(e) => handleTransition(e.nextIndex)}>
            {sliderImages && sliderImages.length > 0 ? (
                sliderImages.map((img, index) => {
                    if (index <= sliderImages.length - 2) {
                        return <div
                            key={index}
                            data-src={methodModel.noImg(img?.file || img)}
                            onClick={() => slideClick(img?.file || img)}
                        />
                    } else {
                        return <div key={index}><CustomMap locations={location} /></div>
                    }
                })
            ) : (
                <div>No Images Available</div>
            )}
        </AwesomeSlider> */}
    </>
  );
};

export default NewImageSlider;
