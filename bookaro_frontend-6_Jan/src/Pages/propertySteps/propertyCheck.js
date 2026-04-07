
import { useSelector } from "react-redux";

const PropertyCheck = () => {
    const activePlan = useSelector((state) => state.activePlan);
    return (
        <>
            {(activePlan?.[0]?.otherDetails.createPropProfileSaleRentDirectory.key === "custom" && activePlan?.[0]?.otherDetails.createPropProfileSaleRentDirectory.value <= activePlan?.[0]?.propertyCount) &&
                <div className="bg-[#f2ecf8] text-center mt-4">
                    Note: You’ve reached the maximum property limit. You can’t add a new property right now, but you can save it as a draft.
                </div>}

        </>
    );
};

export default PropertyCheck;
