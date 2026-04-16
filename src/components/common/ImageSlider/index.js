import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { useTranslation } from "react-i18next";
import methodModel from '../../../methods/methods';

const ImageSlider = ({ images, setActiveImg = () => { },slideClick=()=>{}}) => {
    const { t } = useTranslation();

    const handleTransition = (currentIndex) => {
        setActiveImg(currentIndex + 1);
    };
    return (
        <AwesomeSlider onTransitionRequest={(e) => handleTransition(e.nextIndex)}>
            {images && images.length > 0 ? (
                images.map((img, index) => (
                    <div key={index} data-src={methodModel.noImg(img?.file || img)} onClick={()=>slideClick(img?.file || img)} />
                ))
            ) : (<div>{t("messages.noImagesAvailable")}</div>)}
        </AwesomeSlider>
    );
};

export default ImageSlider;
