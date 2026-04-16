import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TransactionTool = () => {
    const { t } = useTranslation();

    const Navigate = useNavigate()
    const { user } = useSelector((state) => state);
    const data = [
        {
            icon: '/assets/img/tool-icon-1.png',
            titleKey: 'transactionToolPage.features.bookaroo.f1.title',
            textKey: 'transactionToolPage.features.bookaroo.f1.text'
        },
        {
            icon: '/assets/img/tool-icon-2.png',
            titleKey: 'transactionToolPage.features.bookaroo.f2.title',
            textKey: 'transactionToolPage.features.bookaroo.f2.text'
        },
        {
            icon: '/assets/img/tool-icon-3.png',
            titleKey: 'transactionToolPage.features.bookaroo.f3.title',
            textKey: 'transactionToolPage.features.bookaroo.f3.text'
        },
        {
            icon: '/assets/img/tool-icon-4.png',
            titleKey: 'transactionToolPage.features.bookaroo.f4.title',
            textKey: 'transactionToolPage.features.bookaroo.f4.text'
        },
        {
            icon: '/assets/img/tool-icon-5.png',
            titleKey: 'transactionToolPage.features.bookaroo.f5.title',
            textKey: 'transactionToolPage.features.bookaroo.f5.text'
        },
        {
            icon: '/assets/img/tool-icon-6.png',
            titleKey: 'transactionToolPage.features.bookaroo.f6.title',
            textKey: 'transactionToolPage.features.bookaroo.f6.text'
        },
        {
            icon: '/assets/img/tool-icon-7.png',
            titleKey: 'transactionToolPage.features.bookaroo.f7.title',
            textKey: 'transactionToolPage.features.bookaroo.f7.text'
        },
        {
            icon: '/assets/img/tool-icon-8.png',
            titleKey: 'transactionToolPage.features.bookaroo.f8.title',
            textKey: 'transactionToolPage.features.bookaroo.f8.text'
        },
        {
            icon: '/assets/img/tool-icon-9.png',
            titleKey: 'transactionToolPage.features.bookaroo.f9.title',
            textKey: 'transactionToolPage.features.bookaroo.f9.text'
        },
        {
            icon: '/assets/img/tool-icon-10.png',
            titleKey: 'transactionToolPage.features.bookaroo.f10.title',
            textKey: 'transactionToolPage.features.bookaroo.f10.text'
        },
        {
            icon: '/assets/img/tool-icon-11.png',
            titleKey: 'transactionToolPage.features.bookaroo.f11.title',
            textKey: 'transactionToolPage.features.bookaroo.f11.text'
        },
        {
            icon: '/assets/img/tool-icon-12.png',
            titleKey: 'transactionToolPage.features.bookaroo.f12.title',
            textKey: 'transactionToolPage.features.bookaroo.f12.text'
        },
        {
            icon: '/assets/img/tool-icon-13.png',
            titleKey: 'transactionToolPage.features.bookaroo.f13.title',
            textKey: 'transactionToolPage.features.bookaroo.f13.text'
        }
    ]
    const data2 = [
        {
            icon: '/assets/img/tool-icon-14.png',
            titleKey: 'transactionToolPage.features.support.f1.title',
            textKey: 'transactionToolPage.features.support.f1.text'
        },
        {
            icon: '/assets/img/tool-icon-15.png',
            titleKey: 'transactionToolPage.features.support.f2.title',
            textKey: 'transactionToolPage.features.support.f2.text'
        },
        {
            icon: '/assets/img/tool-icon-16.png',
            titleKey: 'transactionToolPage.features.support.f3.title',
            textKey: 'transactionToolPage.features.support.f3.text'
        }
    ]
    return (
        <PageLayout>
            <section className="bg-[#976DD0]/30 py-12 md:py-16">
                <div className="container px-5 mx-auto">
                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                            <div className="order-2 md:order-1 text-center md:!text-start">
                                <p className="text font-semibold text-[#976DD0] font-medium mb-2">
                                    {t("transactionToolPage.heroTag")}
                                </p>

                                <h1 className="md:max-w-md text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug mb-4">
                                    {t("transactionToolPage.heroTitle")}
                                </h1>

                                <p className="mb-4 md:max-w-md font-[400]">
                                    {t("transactionToolPage.heroDescription")}
                                </p>

                                <button className="px-9 py-1 bg-transparent text-[#976DD0] rounded-full  border border-[#976DD0] transition"
                                    onClick={(e) => {
                                        if (user?.loggedIn) {
                                            Navigate("/real-estate-transaction-owner")
                                        } else {
                                            Navigate("/login")
                                        }
                                    }}
                                >
                                    {user?.loggedIn ? t("transactionToolPage.ctaGoToTool") : t("transactionToolPage.ctaSellMyProperty")}
                                </button>
                            </div>
                            <div className="flex justify-center order-1 md:order-2">
                                <img
                                    src="/assets/img/transaction-tool.png"
                                    alt="Dashboard mockup"
                                    className="w-[380px] "
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </section>
            <section className="py-12">
                <div className="container px-5 mx-auto">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-2">{t("transactionToolPage.mainFeaturesTitle")}</h2>
                        <p className="text-[#5A6978]">{t("transactionToolPage.mainFeaturesDescription")}</p>
                    </div>
                    <h5 className="text-center font-semibold mt-12 mb-8">{t("transactionToolPage.featuresOnlyBookaroo")}</h5>
                    <p className="text-[16px] font-[400] border-b-[2px] border-[#7E55F3]/30 pb-2">{t("transactionToolPage.sectionSecureSpeed")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 my-12">
                        {data.map((item, i) =>
                            <div key={i} className="max-w-[180px] sm:max-w-[150px] mx-auto">
                                <div className="text-center mb-2">
                                    <img src={item.icon} alt="img" className="max-w-[35px] mx-auto" />
                                </div>
                                <h5 className="text-[16px] font-semibold leading-tight mb-1">{t(item.titleKey)}</h5>
                                <p className="text-[#5A6978] text-[14px]">{t(item.textKey)}</p>
                            </div>
                        )}
                    </div>
                    <p className="text-[16px] font-[400] border-b-[2px] border-[#7E55F3]/30 pb-2">{t("transactionToolPage.sectionExternalHelp")}</p>
                    <div className="grid grid-cols-4 gap-6 gap-y-12 mt-12">
                        {data2.map((item, i) =>
                            <div key={i} className="max-w-[180px] sm:max-w-[150px] mx-auto">
                                <div className="text-center mb-2">
                                    <img src={item.icon} alt="img" className="max-w-[35px] mx-auto" />
                                </div>
                                <h5 className="text-[16px] font-semibold leading-tight mb-1">{t(item.titleKey)}</h5>
                                <p className="text-[#5A6978] text-[14px]">{t(item.textKey)}</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-16">
                        <button className="px-8 py-1 bg-primary hover:opacity-80 text-[#fff] rounded-full  border border-[#976DD0] transition"
                            onClick={(e) => {
                                if (user?.loggedIn) {
                                    Navigate("/real-estate-transaction-owner")
                                } else {
                                    Navigate("/login")
                                }
                            }
                            }
                        >
                            {user?.loggedIn ? t("transactionToolPage.ctaGoToTool") : t("transactionToolPage.ctaSellMyProperty")}
                        </button>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}
export default TransactionTool;