import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageLayout from "../../components/global/PageLayout";

const OffMarket = () => {
    const { t } = useTranslation();
    const history = useNavigate()
    const steps = [
        {
            number: '1',
            titleKey: 'offMarketPage.ownerSteps.step1.title',
            descriptionKey: 'offMarketPage.ownerSteps.step1.description',
        },
        {
            number: '2',
            titleKey: 'offMarketPage.ownerSteps.step2.title',
            descriptionKey: 'offMarketPage.ownerSteps.step2.description',
        },
        {
            number: '3',
            titleKey: 'offMarketPage.ownerSteps.step3.title',
            descriptionKey: 'offMarketPage.ownerSteps.step3.description',
        },
    ];
     const steps2 = [
        {
            number: '1',
            titleKey: 'offMarketPage.buyerSteps.step1.title',
            descriptionKey: 'offMarketPage.buyerSteps.step1.description',
        },
        {
            number: '2',
            titleKey: 'offMarketPage.buyerSteps.step2.title',
            descriptionKey: 'offMarketPage.buyerSteps.step2.description',
        },
        {
            number: '3',
            titleKey: 'offMarketPage.buyerSteps.step3.title',
            descriptionKey: 'offMarketPage.buyerSteps.step3.description',
        },
    ];
    return (
        <PageLayout>
            <section className="bg-[#976DD0]/30 py-12">
                <div className="container px-5 mx-auto">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-5">
                        <div className="max-w-xl">
                            <h5 className="text-[16px] font-[600] text-[#976DD0] mb-1">{t("offMarketPage.heroTag")}</h5>
                            <h1 className="text-[28px] font-[600] leading-tight mb-4">{t("offMarketPage.heroTitle")}</h1>
                            <p className="text-[15px] mb-4">{t("offMarketPage.heroDescription")}</p>
                            <button className="text-sm border border-[#976DD0] hover:bg-[#976DD0] hover:text-[#fff] rounded-full px-6 py-1.5 text-[#976DD0]" onClick={()=>history("/property1")}>{t("buttons.listProperty")}</button>
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
                        <h3 className="text-center text-[24px] font-[600]">{t("offMarketPage.ownerSectionTitle")}</h3>
                        <p className="text-[#5A6978] text-[16px] text-center">{t("offMarketPage.ownerSectionDescription")}</p>
                    </div>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold text-lg">
                                    {step.number}
                                </div>
                                <div className="text-start">
                                    <h3 className="font-semibold">{t(step.titleKey)}</h3>
                                    <p className="text-sm text-gray-500 max-w-xs">{t(step.descriptionKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={()=>history("/property1")}>{t("buttons.listProperty")}</button>
                    </div>
                </div>
            </section>
            <section className="py-12">
                <div className="container px-5 mx-auto">
                    <div className="max-w-2xl mx-auto mb-10">
                        <h3 className="text-center text-[24px] font-[600]">{t("offMarketPage.buyerSectionTitle")}</h3>
                        <p className="text-[#5A6978] text-[16px] text-center">{t("offMarketPage.buyerSectionDescription")}</p>
                    </div>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
                        {steps2.map((step, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold text-lg">
                                    {step.number}
                                </div>
                                <div className="text-start">
                                    <h3 className="font-semibold">{t(step.titleKey)}</h3>
                                    <p className="text-sm text-gray-500 max-w-xs">{t(step.descriptionKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center flex justify-center gap-4 items-center flex-wrap mt-12">
                        <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={()=>history("/buyer-file")}>{t("offMarketPage.createBuyerFile")}</button>
                         <button className="bg-[#976DD0] text-[#fff] rounded-full px-5 py-1.5" onClick={()=>history("/renter-file")}>{t("offMarketPage.createRenterFile")}</button>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}
export default OffMarket;