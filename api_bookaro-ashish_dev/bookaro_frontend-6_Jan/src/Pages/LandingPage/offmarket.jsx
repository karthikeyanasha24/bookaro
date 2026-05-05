import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";

const OffMarket = () => {
    const history = useNavigate()
    const steps = [
        {
            number: '1',
            title: 'List your property as Off-Market',
            description:
                'Create your property profile as Off-Market. Share key information that value your property.',
        },
        {
            number: '2',
            title: 'Define which leads can see it',
            description:
                'Open your property only to top-rated profiles, based on their likelihood of securing funding from submitted financial information.',
        },
        {
            number: '3',
            title: 'Open it gradually to a wider audience',
            description:
                'If no top-tier buyer is found, simply offer your property to the next tier. Your property stays confidential and doesn’t become stale.',
        },
    ];
     const steps2 = [
        {
            number: '1',
            title: 'Complete buyer or renter profile',
            description:
                'Safely provide your funding information—it stays confidential and is never shared for commercial or other uses.',
        },
        {
            number: '2',
            title: 'Likelihood of obtaining funding',
            description:
                'Based on shared financial data, our partner calculates your likelihood of funding approval. Regardless of the rate, it shows owners you are a serious candidate.',
        },
        {
            number: '3',
            title: 'Reveal hidden opportunities',
            description:
                'Based on your funding rate, the Off-market section gives privileged access to hidden opportunities, boosting your profile’s credibility and increasing your chances to secure the property.',
        },
    ];
    return (
        <PageLayout>
            <section className="bg-[#976DD0]/30 py-12">
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-5">
                        <div className="max-w-xl">
                            <h5 className="text-[16px] font-[600] text-[#976DD0] mb-1">Off-market sale or rental</h5>
                            <h1 className="text-[28px] font-[600] leading-tight mb-4">Release your property progressively to the market by defining which lead can see it</h1>
                            <p className="text-[15px] mb-4">With the Off-market mode you can open your property to top rated potential buyers or renters first and then progresively open it to a wider audience.</p>
                            <button className="text-sm border border-[#976DD0] hover:bg-[#976DD0] hover:text-[#fff] rounded-full px-6 py-1.5 text-[#976DD0]" onClick={()=>history("/property1")}>List a property</button>
                        </div>
                        <div className="w-full">
                            <img src="/assets/img/offmarket-banner.png" alt="img" className="w-auto h-auto sm:max-w-sm mx-auto" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12">
                <div className="container px-5 mx-auto">
                    <div className="max-w-2xl mx-auto mb-10">
                        <h3 className="text-center text-[24px] font-[600]">How it works for onwer?</h3>
                        <p className="text-[#5A6978] text-[16px] text-center">Get only qualified leads and avoid obsolescence of your property ad by gradually making it visible to the public of your choice</p>
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
                        <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={()=>history("/property1")}>List a property</button>
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
                    <div className="text-center flex justify-center gap-4 items-center flex-wrap mt-12">
                        <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={()=>history("/buyer-file")}>Create buyer file</button>
                         <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={()=>history("/renter-file")}>Create renter file</button>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}
export default OffMarket;