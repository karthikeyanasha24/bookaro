import { FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import PageLayout from "../../components/global/PageLayout";
import { BiCoin } from "react-icons/bi";

const Wallet = () => {
  return (
    <PageLayout>
      <section className="py-10 bg-[#976DD0]/30">
        <div className="container px-5 mx-auto lg:px-20">
          <div>
            <h3 className="text-2xl text-center font-semibold text-gray-800 mb-10">
              Coins wallet
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
              <div className="bg-[#976DD0] rounded-[12px] text-start shadow-md p-5 pb-10 w-full space-y-2">
                <h4 className="text-[#fff] text-[18px]">Your balance</h4>
                <h3 className="text-[#fff] text-[20px] font-[600] flex items-center gap-3">
                  10 000 <BiCoin />
                </h3>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-5">
              How can you spend your coins?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center mb-10">
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-5  w-full text-center flex items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  Unlock one month access to Off-Market for home-seeker
                </h4>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-5  w-full text-center flex items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  Unlock educational content
                </h4>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-5  w-full text-center flex items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  Unlock one month access to past transactions
                </h4>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-5  w-full text-center flex items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  Unlock one Peer-To-Peer property estimation
                </h4>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-5">
              How can you spend your coins?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center mb-10">
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">Create an account</h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  List a property in Directory
                </h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  List a property any status
                </h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">Estimate a property</h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  Share the app with friends
                </h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  Share a property ith friends
                </h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">Buy coins</h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
              <div className="bg-[#976DD0] rounded-[12px] shadow-md p-6  w-full text-center flex flex-col gap-3 items-center justify-center">
                <h4 className="text-[#fff] text-[18px]">
                  Estimated 100 properties
                </h4>
                <h3 className="text-[#fff] text-[22px] font-[600]">1000</h3>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-5">
              Transaction history
            </h4>
            <div className="bg-white rounded-xl p-6 w-full ">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead>
                    <tr className="font-semibold text-gray-800 border-0 h-10 pb-2">
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2 divide-y divide-transparent">
                    {[
                      [
                        "23/02/2025",
                        "Estimating a property",
                        "100",
                        "Credit",
                        "100",
                      ],
                      [
                        "23/02/2025",
                        "Estimating a property",
                        "100",
                        "Credit",
                        "100",
                      ],
                      [
                        "23/02/2025",
                        "Estimating a property",
                        "100",
                        "Credit",
                        "100",
                      ],
                      [
                        "23/02/2025",
                        "Property listing",
                        "300",
                        "Credit",
                        "300",
                      ],
                      [
                        "23/02/2025",
                        "Property listing",
                        "300",
                        "Credit",
                        "300",
                      ],
                      ["23/02/2025", "Share a property", "300", "300", "300"],
                      [
                        "23/02/2025",
                        "Invite friend to app",
                        "300",
                        "300",
                        "300",
                      ],
                      [
                        "23/02/2025",
                        "Unlock monthly access to OffMarket",
                        "300",
                        "300",
                        "300",
                      ],
                      [
                        "23/02/2025",
                        "Unlock monthly access to OffMarket",
                        "300",
                        "300",
                        "300",
                      ],
                      [
                        "23/02/2025",
                        "Unlock educational content - How to define my property price",
                        "300",
                        "300",
                        "300",
                      ],
                    ].map(([date, desc, amount, type, balance], index) => (
                      <tr key={index} className="h-10 border-0">
                        <td className="px-2">{date}</td>
                        <td className="whitespace-nowrap px-2">{desc}</td>
                        <td className="px-2">{amount}</td>
                        <td className="px-2">{type}</td>
                        <td className="px-2">{balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
export default Wallet;
