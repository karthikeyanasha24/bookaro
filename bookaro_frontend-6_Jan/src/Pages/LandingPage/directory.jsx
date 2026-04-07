import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useEffect, useState } from "react";

const Directory = () => {
    const history = useNavigate()
    const texts = ["a street", "a neighborhood", "a city", "a country"];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); 
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % texts.length);
                setFade(true); 
            }, 500);

        }, 3000); 

        return () => clearInterval(interval);
    }, []);
    const steps = [
        {
            number: '1',
            title: 'Browse Directory properties',
            description:
                'Find the property that matches 100% of your search criteria among all properties listed, no matter they are on the market or not.',
        },
        {
            number: '2',
            title: 'Create your own opportunity',
            description:
                'With Bookaroo you can buy properties that are not for sale! Contact owners of your dreamed house to discuss a potential transaction.',
        },
        {
            number: '3',
            title: 'Plan the future transaction',
            description:
                'Anticipate and define freely with owner when the purchase or the rental will take place, in months or years, and what will be the deal conditions.',
        },
    ];
    const steps2 = [
        {
            number: '1',
            title: 'List your property in the Directory',
            description:
                'Create anonymously your property profile and share key information for valuating your property.',
        },
        {
            number: '2',
            title: 'Generate leads for future transaction',
            description:
                'Let your property profile generate leads for you and increase your property attractivity and value.',
        },
        {
            number: '3',
            title: 'Plan the future transaction',
            description:
                'Commit with a buyer or a renter for an immediate or future transaction at your own condition and pace.',
        },
    ];
    return (
        <PageLayout>
            <section className="bg-[#976DD0]/30 py-12">
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-5">
                        <div className="max-w-xl lg:max-w-lg">
                            <h5 className="text-[16px] font-[600] text-[#976DD0] mb-1">Real estate Directory</h5>
                            <h1 className="text-[28px] font-[600] leading-tight mb-4">All existing real estate properties of <br />  <span
                                className={`text-primary !text-[28px] border-[#976DD0] transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                {texts[index]}
                            </span> listed in the same place</h1>
                            <p className="text-[15px] mb-4">By listing all real estate properties that are not for sale or rental, our Real Estate Directory let you anticipate your project and find today the property you will buy in 6 months or in 2 years!</p>
                            <button className="text-sm border border-[#976DD0] hover:bg-[#976DD0] hover:text-[#fff] rounded-full px-6 py-1.5 text-[#976DD0]" onClick={() => history("/properties?propertyType=directory")}>Browse Directory</button>
                        </div>
                        <div className="w-full">
                            <img src="/assets/img/directory-landing.png" alt="img" className="w-auto h-auto sm:max-w-sm lg:max-w-xl mx-auto" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12">
                <div className="container px-5 mx-auto">
                    <div className="max-w-2xl mx-auto mb-10">
                        <h3 className="text-center text-[24px] font-[600]">How it works for buyer or renter?</h3>
                        <p className="text-[#5A6978] text-[16px] text-center">Directory is the place that allow you to anticipate your real estate project and  where finding your dreamed property becomes possible without abandoning your criteria. </p>
                    </div>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold text-lg">
                                    {step.number}
                                </div>
                                <div className="text-start">
                                    <h3 className="font-semibold">{step.title}</h3>
                                    <p className="text-sm text-gray-500 max-w-xs">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={() => history("/properties?propertyType=directory")}>Browse Directory</button>
                    </div>
                </div>
            </section>
            <section className="py-12">
                <div className="container px-5 mx-auto">
                    <div className="max-w-2xl mx-auto mb-10">
                        <h3 className="text-center text-[24px] font-[600]">How it works for owner?</h3>
                        <p className="text-[#5A6978] text-[16px] text-center">Directory let you find buyer or renter even before putting your property on the market. </p>
                    </div>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
                        {steps2.map((step, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold text-lg">
                                    {step.number}
                                </div>
                                <div className="text-start">
                                    <h3 className="font-semibold">{step.title}</h3>
                                    <p className="text-sm text-gray-500 max-w-xs">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={() => history("/property1")}>List my property</button>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}
export default Directory;