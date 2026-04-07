import { useEffect, useRef, useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { useId } from "react";
import ApiClient from "../../methods/api/apiClient";

const TrainingComponent = ({ index,videoId, title,duration, item, thumbnail }) => {
    const [showVideo, setShowVideo] = useState(false);
    const iframeRef = useRef(null);
    const hiddenPlayerRef = useRef(null);

    const handlePlayClick = () => {
        if(!duration) return
        setShowVideo(true);
        ApiClient.put(`funnelVideoLike/watching`, { funnelUrlId: item?._id }).then((res) => {
            if (res.success) {
            }
        });
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
        <div className="">
            <div className={`${index>0?"h-[200px]":"h-[350px]"} relative w-[100%] `}>
                <div
                    className={`w-full h-full relative aspect-video rounded overflow-hidden ${duration ? "cursor-pointer" : "cursor-default"}`}
                    onClick={handlePlayClick}
                >
                    {!showVideo ? (
                        <>
                            <img
                                src={thumbnail}
                                alt="Play video"
                                className="w-full h-full object-cover rounded-[18px]"
                            />
                            <div className="absolute rounded-[18px] bg-[#000]/30 top-0 left-0 w-full h-full flex items-center justify-center text-white">
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

                {/* <div className="ms-4"> */}
                {/* <p className="text-[#47525E] text-[14px]">{title}</p> */}
                <span className="text-[#fff] rounded-[8px] px-4 py-1.5 absolute bottom-4 right-4 bg-[#000]/50 text-[12px]">
                    {duration ? duration : "Video Not Valid"}
                </span>
                {/* </div> */}
            </div>

            <div ref={hiddenPlayerRef} style={{ display: "none" }} />
        </div>
    );
};

export default TrainingComponent;
