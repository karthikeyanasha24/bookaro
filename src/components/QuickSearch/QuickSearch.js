import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../../methods/api/apiClient';
import { capLetter } from '../../models/string.model';

const QuickSearch = () => {
    const navigate = useNavigate();
    const [quickSearch, setQuickSearch] = useState({
        sale: [],
        rent: [],
        offmarket: [],
        directory: [],
    });

    const getQuickSearch = (propertyType) => {
        ApiClient.get("quicksearch/list", {
            page: 1,
            count: 10,
            propertyType: propertyType,
        }).then((res) => {
            if (res.success) {
                let data = res?.data;
                setQuickSearch((prev) => ({
                    ...prev,
                    [propertyType]: data,
                }));
            }
        });
    };

    useEffect(() => {
        ["sale", "rent", "directory","transaction"].forEach((type) => getQuickSearch(type));
    }, []);


    return (
        <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid  2xl:px-[120px] xl:px-[90px] md:px-[40px] px-[20px]">
                <div className="grid grid-cols-12 ">
                    <div className="col-span-12  mb-[40px]">
                        <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                            Real estate property profile
                            <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                        </h2>
                    </div>
                    <div className="col-span-12  ">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                                <h3 className="text-[#47525E] font-bold mb-4">
                                    Properties for sale
                                </h3>
                                <ul>
                                    {quickSearch.sale?.map((itm, i) => (
                                        <li>
                                            <p
                                                onClick={() => navigate(`/properties?propertyType=sale&type=${itm?.type}&search=${itm?.city}`)}
                                                className="text-[#47525E] underline lg:text-[16px] text-[14px] cursor-pointer"
                                            >
                                                {`${capLetter(itm?.type)} for sale in ${itm?.city}`}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                                <h3 className="text-[#47525E] font-bold mb-4">
                                    Properties for rent
                                </h3>
                                <ul>
                                    {quickSearch.rent?.map((itm, i) => (
                                        <li>
                                            <p
                                                onClick={() => navigate(`/properties?propertyType=rent&type=${itm?.type}&search=${itm?.city}`)}
                                                className="text-[#47525E] underline lg:text-[16px] text-[14px] cursor-pointer"
                                            >
                                                {`${capLetter(itm?.type)} for rent in ${itm?.city}`}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                                <h3 className="text-[#47525E] font-bold mb-4">
                                    Properties in directory
                                </h3>
                                <ul>
                                    {quickSearch.directory?.map((itm, i) => (
                                        <li>
                                            <p
                                                onClick={() => navigate(`/properties?propertyType=directory&type=${itm?.type}&search=${itm?.city}`)}
                                                className="text-[#47525E] underline lg:text-[16px] text-[14px] cursor-pointer"
                                            >
                                                {`${capLetter(itm?.type)} for directory in ${itm?.city}`}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                                <h3 className="text-[#47525E] font-bold mb-4">
                                    Past transactions
                                </h3>
                                <ul>
                                    {quickSearch.transaction?.map((itm, i) => (
                                        <li>
                                            <p
                                                onClick={() => navigate(`/past-transation-list?search=${itm?.city}`)}
                                                className="text-[#47525E] underline lg:text-[16px] text-[14px] cursor-pointer"
                                            >
                                                {`Propeties sold in ${itm?.city}`}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QuickSearch
