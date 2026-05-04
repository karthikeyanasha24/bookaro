import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useSelector } from "react-redux";

const TransactionTool = () => {

    const Navigate = useNavigate()
    const { user } = useSelector((state) => state);
    const data = [
        {
            icon: '/assets/img/tool-icon-1.png',
            title: 'Lead financial background check',
            text: 'Each lead financial background is check so that you increase your chance of seilling the first time.'
        },
        {
            icon: '/assets/img/tool-icon-2.png',
            title: 'Limit the number of leads who can apply',
            text: "Don't get overwelmed with lead sollicitations with the lead limit."
        },
        {
            icon: '/assets/img/tool-icon-3.png',
            title: 'Shared calendar to arrange visits',
            text: 'Open visit slots and send individual or automated invite to leads so that they can book a slot.'
        },
        {
            icon: '/assets/img/tool-icon-4.png',
            title: 'Share ID card to secure the visit',
            text: 'Both owner and lead can share their ID so that both parties go safely to the visit.'
        },
        {
            icon: '/assets/img/tool-icon-5.png',
            title: 'Visit reviews to help owner',
            text: 'After a visit lead can review the visit. Reviews are shared with owner to improve next visits.'
        },
        {
            icon: '/assets/img/tool-icon-6.png',
            title: 'Request or share property documents',
            text: 'Lead can request property document before to make an offer or apply. Owner can share them through App.'
        },
        {
            icon: '/assets/img/tool-icon-7.png',
            title: 'Buyer or renter file',
            text: 'Both renter or buyer can create their file in App so that it can be shared easily with owner when applying for a property.'
        },
        {
            icon: '/assets/img/tool-icon-8.png',
            title: 'Apply or make an offer for a property',
            text: 'Through App lead can apply or make an official offer for a property purchase.'
        },
        {
            icon: '/assets/img/tool-icon-9.png',
            title: 'Answer a lead proposal',
            text: 'Through App owner can answer a offer or an application for a property purchase.'
        },
        {
            icon: '/assets/img/tool-icon-10.png',
            title: 'Chat with lead during the transaction',
            text: 'Discuss through the App to speed up your transaction and get to the closing.'
        },
        {
            icon: '/assets/img/tool-icon-11.png',
            title: 'Shared calendar for signing the contract',
            text: 'Open signing slots and let the buyer book a suitable slot directly in your agenda.'
        },
        {
            icon: '/assets/img/tool-icon-12.png',
            title: 'Transaction historical',
            text: 'Keep track of all stages of your transaction.'
        },
        {
            icon: '/assets/img/tool-icon-13.png',
            title: 'Transfer property profile ownership',
            text: 'After completing your property sale, transfer the ownership of the property profile to the new owner.'
        }
    ]
    const data2 = [
        {
            icon: '/assets/img/tool-icon-14.png',
            title: 'Need help on any step of the process?',
            text: 'To secure your transaction, ask your AI assistant any question or doubt.'
        },
        {
            icon: '/assets/img/tool-icon-15.png',
            title: 'Video training content',
            text: 'At each step of your transaction get trining video to help you sell alone.'
        },
        {
            icon: '/assets/img/tool-icon-16.png',
            title: 'Neep support on specific actions?',
            text: 'Our partner real estates agents can help you with a fix fee  per action (host visit, seller file...)'
        }
    ]
    return (
        <PageLayout>
            <section className="bg-white py-12 md:py-16">
                <div className="container px-5 mx-auto">
                    <div class="w-full">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                            <div className="order-2 md:order-1 text-center md:!text-start">
                                <p class="inline-flex items-center border border-[#E8E0F4] rounded-full px-3 py-1 text-[12px] font-semibold text-[#976DD0] mb-3">
                                    Discover features
                                </p>

                                <h1 class="md:max-w-xl text-[30px] leading-[38px] lg:text-[44px] lg:leading-[52px] font-[700] text-[#18181B] mb-4">
                                    The only AI powered tool that secures and simplifies transactions for sellers and buyers
                                </h1>

                                <p class="mb-5 md:max-w-xl text-[#4B5563] text-[15px] leading-[24px]">
                                    Our transaction workflow guides you from prospect qualification to contract signature
                                    with smart recommendations and automated actions that save time.
                                </p>

                                <button class="px-9 py-2 bg-[#976DD0] text-white rounded-full border border-[#976DD0] transition hover:opacity-90"
                                    onClick={(e) => {
                                        if (user?.loggedIn) {
                                            Navigate("/real-estate-transaction-owner")
                                        } else {
                                            Navigate("/login")
                                        }
                                    }}
                                >
                                    {user?.loggedIn ? "Open transaction tool" : "Sign up and discover"}
                                </button>
                            </div>
                            <div class="flex justify-center order-1 md:order-2">
                                <img
                                    src="/assets/img/transaction-tool.png"
                                    alt="Dashboard mockup"
                                    class="w-[430px] rounded-[22px] border border-[#EEE7F7] shadow-sm"
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </section>
            <section className="py-12 bg-[#FCFBFE]">
                <div className="container px-5 mx-auto">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-2">Main Features</h2>
                        <p className="text-[#5A6978]">Our unique tool offer a various set of features to empower individual to sell their property with more ease and less stress.</p>
                    </div>
                    <h5 className="text-center font-semibold mt-12 mb-8">Features only on Bookaroo</h5>
                    <p className="text-[16px] font-[400] border-b-[2px] border-[#7E55F3]/30 pb-2">Secure and speed-up you transaction</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 my-12">
                        {data.map((item, i) =>
                            <div key={i} className="max-w-[180px] sm:max-w-[150px] mx-auto">
                                <div className="text-center mb-2">
                                    <img src={item.icon} alt="img" className="max-w-[35px] mx-auto" />
                                </div>
                                <h5 className="text-[16px] font-semibold leading-tight mb-1">{item.title}</h5>
                                <p className="text-[#5A6978] text-[14px]">{item.text}</p>
                            </div>
                        )}
                    </div>
                    <p className="text-[16px] font-[400] border-b-[2px] border-[#7E55F3]/30 pb-2">Get external help at each step of your transaction</p>
                    <div className="grid grid-cols-4 gap-6 gap-y-12 mt-12">
                        {data2.map((item, i) =>
                            <div key={i} className="max-w-[180px] sm:max-w-[150px] mx-auto">
                                <div className="text-center mb-2">
                                    <img src={item.icon} alt="img" className="max-w-[35px] mx-auto" />
                                </div>
                                <h5 className="text-[16px] font-semibold leading-tight mb-1">{item.title}</h5>
                                <p className="text-[#5A6978] text-[14px]">{item.text}</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-16">
                        <button class="px-8 py-1 bg-primary hover:opacity-80 text-[#fff] rounded-full  border border-[#976DD0] transition"
                            onClick={(e) => {
                                if (user?.loggedIn) {
                                    Navigate("/real-estate-transaction-owner")
                                } else {
                                    Navigate("/login")
                                }
                            }
                            }
                        >
                            {user?.loggedIn ? " Go To Transcation Tool" : "Sell My Property"}
                        </button>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}
export default TransactionTool;