import { Link } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { MdEdit } from "react-icons/md";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { FiEye } from "react-icons/fi";


const BillingHistory = () => {
  return (
    <PageLayout>
      <div className="bg-[#976dd021]">
        <div className="container mx-auto py-14 px-8">
          <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center ">
            Plan and billing
          </h2>
          <div className="mt-14">
            <h3 className="text-black text-[18px] mb-8">
              Plan and billing method
            </h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="xl:col-span-4 lg:col-span-6 col-span-full">
                <div className="bg-white  rounded-[12px]  ">
                  <div className="p-5">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-[#976DD0]  rounded-full w-[35px]">
                          <img
                            src="/assets/img/transaction/magic-w.png"
                            className="w-[35px] p-1"
                          />
                        </div>
                        <h4 className="text-[#5A6978] font-[600] ms-3">
                          Smart starter
                        </h4>
                        <p className="bg-[#EAEAEA] text-[#5A6978] rounded-[7px] text-[14px] px-3 py-1 ms-4">
                          Monthly
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[#5A6978] font-[600] text-[18px]">
                          9,99 €{" "}
                          <span className="font-[400] text-[13px]">/Month</span>
                        </h4>
                      </div>
                    </div>
                    <p className="text-[#5A6978] text-[14px] mt-5 mb-1">
                      1 out of 3 properties listed{" "}
                    </p>
                    <div class="w-[80%] bg-[#CECECE] rounded-full h-[8px] dark:bg-gray-700 mb-2">
                      <div class="bg-[#976DD0] h-[8px] rounded-full w-[45%]"></div>
                    </div>
                  </div>
                  <div className="border-t border-[#C5C5C5] px-5 py-4 text-end">
                    <Link className="text-[#976DD0] font-[600] text-end">
                      Upgrade plan
                    </Link>
                  </div>
                </div>
              </div>
              <div className="xl:col-span-4 lg:col-span-6 col-span-full">
                <div className="bg-white  rounded-[12px]  ">
                  <div className="p-5">
                    <h4 className="text-[#5A6978] font-[600]">
                      Payment method
                    </h4>
                    <p className="text-[#5A6978] text-[14px] mt-2">
                      You can edit your payment method here.
                    </p>
                    <div className="border border-[#B8B9BB] flex justify-between items-center p-3 rounded-[8px] mt-6 mb-3">
                      <div className="flex items-center">
                        <div className="me-4">
                          <img
                            src="/assets/img/visa.png"
                            className="w-[35px] p-1 rounded-[5px] border border-[#AAADB1]"
                          />
                        </div>
                        <div>
                          <h4 className="text-[#5A6978] font-[600] text-[13px]">
                            Card ending in 1234
                          </h4>
                          <p className="text-[#5A6978] font-[400] text-[13px]">
                            Expiring in 07/25
                          </p>
                        </div>
                      </div>
                      <p className="border border-[#AAADB1] px-3 py-2 rounded-[5px]">
                        <MdEdit />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16">
             <div className="flex items-center mb-7 justify-between">
             <h3 className="text-black text-[18px]  ">Billing history</h3>
              <div className="border border-[#B1B1B1] rounded-[50px] px-4 py-2">
                <button className="text-[14px] text-[#343F4B]">Download invoices</button>
              </div>
             </div>
             <div className="relative table-responsive overflow-x-auto border border-[#eee] sm:rounded-lg ">
                <table className="table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-sm text-[#986dcd] font-[600] capitalize bg-white dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="px-2 py-3   cursor-pointer whitespace-nowrap text-[#343F4B] font-[600]">
                          Invoice
                          </th>
                          <th className="px-2 py-3   cursor-pointer whitespace-nowrap text-[#343F4B] font-[600]">
                          Date
                          </th>
                          <th className="px-2 py-3   cursor-pointer whitespace-nowrap text-[#343F4B] font-[600]">
                          Amount
                          </th>
                          <th className="px-2 py-3   cursor-pointer whitespace-nowrap text-[#343F4B] font-[600]">
                          Currency
                          </th>
                          <th className="px-2 py-3   cursor-pointer whitespace-nowrap text-[#343F4B] font-[600]">
                          Status
                          </th>
                          <th className="px-2 py-3   cursor-pointer whitespace-nowrap text-[#343F4B] font-[600]">
                         Actions
                          </th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-[#343F4B]">Invoice #001</p>
                        <span className="text-[#969FAA] text-[14px]">Smart starter plan</span>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-[#343F4B]">12/02/2025</p>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-[#343F4B]">9,99</p>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-[#343F4B]">€</p>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-[#343F4B]">Paid</p>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                            <ul className="flex items-center">
                              <li>
                              <Link className="w-[20px] h-[20px] inline-block"><FiEye className="w-full h-full text-black"/></Link>
                              
                              </li>
                              <li>  <Link  className="w-[20px] h-[20px] inline-block ms-4"><RiDownloadCloud2Line className="w-full h-full text-black"/></Link></li>
                            </ul>
                        </td>
                      </tr>
                    </tbody>
                </table>
             </div>
            </div>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
};

export default BillingHistory;
