import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import methodModel from '../../../methods/methods';

const ImageSlider = ({ images }) => {
    return (
        <AwesomeSlider>
            {images && images.length > 0 ? (
                images.map((img, index) => (
                    <div key={index} data-src={methodModel.noImg(img?.file || img)} />
                ))
            ) : (<div>No Images Available</div>)}
        </AwesomeSlider>
    );
};

export default ImageSlider;
