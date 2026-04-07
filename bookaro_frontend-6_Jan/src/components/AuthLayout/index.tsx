
const AuthLayout = ({ children }: any) => {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center h-screen mx-auto">
            <div className=" w-full   mx-auto  ">
              <div className="relative w-full h-screen flex bg-[#f2edf8]">
                <div className="h-full  md:w-6/12  w-full md:block hidden ">
                  <div className="bg-img h-full ">
                    <img src="/assets/img/auth_img.jpg" className="w-full h-screen object-cover"></img>
                  </div>
                </div>
                <div className="flex justify-center  md:w-6/12 w-full z-20 py-6 px-8   z-20 overflow-auto">
                  {children}
                </div>
              </div>
            </div>
          </div>
    </>
  );
};

export default AuthLayout;
