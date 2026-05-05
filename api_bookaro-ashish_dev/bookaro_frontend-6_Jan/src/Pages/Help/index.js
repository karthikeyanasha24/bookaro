import PageLayout from '../../components/global/PageLayout';
import AcountSidebar from '../Settings/AcountSidebar';

const Help = () => {
    return (
        <PageLayout>
            <section className="py-14 lg:py-16 bg-[#f2ecf8]">
                <div className="container items-center  px-8 mx-auto xl:px-5">
                    <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
                        <div className="grid grid-cols-12 lg:gap-12  gap-0">
                            <AcountSidebar />
                            <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8">
                                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                                    Manage your account
                                </h2>
                                <div className="p-10 md:px-14 px-8  flex flex-col justify-between border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0">
                                    <form className="flex  flex-col h-full">
                                        <div>
                                            <div className="mb-8">
                                                <h4 className="text-black font-bold text-[19px]  mb-0">
                                                    help center
                                                </h4>
                                                <p className="text-black text-[16px] mb-2  ">
                                                    Improving your experience is our top priority. Allow us to secure your account with your phone number.
                                                </p>
                                            </div>
                                        </div>
                                        {/* <div className="mt-20 flex items-center justify-end">
                                            <button
                                                type="submit"
                                                className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                                            >
                                                Save
                                            </button>
                                        </div> */}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}

export default Help
