import { FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import PageLayout from "../../components/global/PageLayout";

const SearchAlert = () => {
  return (
    <PageLayout>
      <section className="py-10 bg-[#976DD0]/10">
        <div className="container px-5 mx-auto">
          <div className="min-h-[60vh] flex flex-col justify-between px-4 text-center">
            <div>
              <h2 className="text-gray-500 text-xl">Search alerts</h2>
              <h3 className="text-2xl font-semibold text-gray-800 mb-10">
                Be informed first
              </h3>

              {/* Alert Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
                <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-start">
                      <p className="text-sm text-gray-600 font-[600]">Search name ABDC</p>
                      <p className="text-[12px] text-gray-500">
                        Sale. Paris, 18eme (75018)
                      </p>
                      <p className="mt-2 font-semibold text-black">
                        20 new results
                      </p>
                    </div>
                    <button className="text-gray-500 hover:text-red-500">
                      <FaTrashAlt />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <a
                      href="#"
                      className="text-sm text-[#976DD0] font-semibold hover:underline"
                    >
                      AroundMe
                    </a>
                    <div className="flex items-center space-x-2">
                      <FaInfoCircle className="text-gray-400" />
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-black transition-all duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-4"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button className="bg-gray-800 text-white rounded-full px-6 py-2 hover:bg-gray-700 transition">
                Create new alert
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
export default SearchAlert;
