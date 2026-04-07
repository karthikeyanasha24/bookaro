import { useEffect, useRef, useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { useId } from "react";

const TrainingVideoCard = ({ videoId, title,duration, thumbnail }) => {
    const [showVideo, setShowVideo] = useState(false);
    const iframeRef = useRef(null);
    const hiddenPlayerRef = useRef(null);
    const uniqueId = useId();

    const handlePlayClick = () => {
        setShowVideo(true);
        setTimeout(() => {
            if (iframeRef.current?.requestFullscreen) {
                iframeRef.current.requestFullscreen();
            }
        }, 200);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setShowVideo(false);
            }
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);


    const getEmbedUrl = (id) =>
        `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;


    return (
        <div className="border-t border-[#BEBEBE] p-3">
            <div className="flex">
                <div
                    className="w-[160px] relative min-w-[160px] aspect-video rounded overflow-hidden cursor-pointer"
                    onClick={handlePlayClick}
                >
                    {!showVideo ? (
                        <>
                            <img
                                src={thumbnail}
                                alt="Play video"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bg-[#000]/30 top-0 left-0 w-full h-full flex items-center justify-center text-white">
                                <FaRegCirclePlay size={26} />
                            </div>
                        </>
                    ) : (
                        <iframe
                            ref={iframeRef}
                            src={getEmbedUrl(videoId)}
                            className="w-full h-full"
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>

                <div className="ms-4">
                    <p className="text-[#47525E] text-[14px]">{title}</p>
                    <span className="text-[#47525E] text-[14px] font-[600]">
                        {duration}
                    </span>
                </div>
            </div>

            <div ref={hiddenPlayerRef} style={{ display: "none" }} />
        </div>
    );
};

export default TrainingVideoCard;
