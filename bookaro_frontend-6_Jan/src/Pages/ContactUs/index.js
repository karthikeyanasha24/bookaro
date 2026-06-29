import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import SelectDropdown from "../../components/common/SelectDropdown";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import PageLayout from "../../components/global/PageLayout";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const ContactUs = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: params.has("traningVideo")?"traning video":"Genric Contact Form",
    message: "",
  });
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const [ifaqs, setIfaqs] = useState([]);
  const [pfaqs, setPfaqs] = useState([]);
  const getIfaqs = () => {
    loader(true);
    let filter = { page: 1, count: 5, type: "individual" };
    ApiClient.get("faqs/listing", filter).then((res) => {
      if (res.success) {
        setIfaqs(res.data);
      }
      loader(false);
    });
  };
  const getPfaqs = () => {
    loader(true);
    let filter = { page: 1, count: 5, type: "pro" };
    ApiClient.get("faqs/listing", filter).then((res) => {
      if (res.success) {
        setPfaqs(res.data);
      }
      loader(false);
    });
  };

  useEffect(() => {
    getIfaqs();
    getPfaqs();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form?.email || !form?.name || !form?.subject || !form?.subSubject) {
      return
    }
    loader(true);
    const payload = {
      ...form,
      type: form?.subject
    };
    delete payload?.subject
    ApiClient.post("contactTeam/addNew", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        setForm({name:"",email:"",type:params.has("traningVideo")?"traning video":"",subSubject:"",message:""})
      }
      loader(false);
    });
  };

  return (
    <>
      <PageLayout>
        <div className="contact-us-banner bg-[#E7E1EF]">
          <div className="container mx-auto py-16 px-8">
            <div className="grid grid-cols-12">
              <div className="md:col-span-6 col-span-full">
                <h1 className="text-black  font-bold text-[40px]">
                  Help & Contact
                </h1>
                <p className="my-3 font-bold">
                  Do you have a question or request regarding the website or
                  application?
                </p>
                <p>
                  Find all the useful information below or contact us if you
                  cannot find the answer to your question.
                </p>
              </div>
              <div className="md:col-span-6 col-span-full">
                <img
                  src="assets/img/contact-img.png"
                  className="w-[300px] ml-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-8 px-8 mt-5">
          <h4 className="font-bold mb-4 text-[20px] text-[#976DD0]">
            Individuals
          </h4>
          {ifaqs?.map((itm, i) => (
            <div className="mt-5 ">
              <Accordion
                defaultExpanded={false}
                className="mb-5 border border-[#eaeaea] shadow-none "
              >
                <AccordionSummary
                  expandIcon={<MdOutlineKeyboardArrowDown />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="p-3"
                >
                  <Typography>
                    <span className="text-[16px] font-[600] ">
                      {itm?.question}
                    </span>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: itm?.answer || "No content available",
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </div>
        <div className="container mx-auto py-8 px-8">
          <h4 className="font-bold mb-4 text-[20px] text-[#976DD0]">
            Professionals
          </h4>
          {pfaqs?.map((itm, i) => (
            <Accordion
              defaultExpanded={i === 0}
              className="mb-5 border border-[#eaeaea] shadow-none border-t-0"
            >
              <AccordionSummary
                expandIcon={<MdOutlineKeyboardArrowDown />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-3 "
              >
                <Typography>
                  <span className="text-[16px] font-[600] p-3 ">
                    {itm?.question}
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  dangerouslySetInnerHTML={{
                    __html: itm?.answer || "No content available",
                  }}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        <div className="container mx-auto  mb-6  px-8 py-5">
          <div className=" bg-[#f5f7fa] p-5">
            <h2 className="text-[20px] font-[600] ">
              {" "}
              Contact customer service
            </h2>
            <p className="font-[600] mt-4">
              For any other request concerning the website or application...
            </p>
            <p className="mb-5">Use the following contact form: </p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-12 md:gap-6 gap-0 ">
                <div className="lg:col-span-4 col-span-12">
                  <div className="sticky top-[100px]">
                    <input
                      value={form?.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      type="text"
                      placeholder="Name*"
                      className="border border-[#929292] rounded-[4px] h-[40px] px-[12px] block w-full"
                    />
                    <input
                      value={form?.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      type="email"
                      placeholder="Email*"
                      className="border border-[#929292] rounded-[4px] h-[40px] px-[12px] my-4 block w-full"
                    />
                    <SelectDropdown
                      className="border border-[#929292] rounded-[4px]  px-[12px] my-3 block w-full"
                      displayValue="name"
                      placeholder="Select any option"
                      isClearable={false}
                      intialValue={form?.subject}
                      result={(e) => {
                        setForm({
                          ...form,
                          subject: e.value,
                        });
                      }}
                      options={[
                        { id: "genric contact form", name: "Subject" },
                        { id: "traning video", name: "Traning Video" },
                      ]}
                    />
                    <input
                      value={form?.subSubject}
                      onChange={(e) => handleChange("subSubject", e.target.value)}
                      type="text"
                      placeholder="Sub Subject"
                      className="border border-[#929292] rounded-[4px] h-[40px] px-[12px] my-4 block w-full"
                    />
                  </div>
                </div>
                <div className="lg:col-span-8 col-span-12 ">
                  <textarea
                    value={form?.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="border border-[#929292] rounded-[4px] w-full px-[12px] py-4 h-full"
                    placeholder="Your Message *"
                  ></textarea>
                </div>
                <div className=" col-span-12 pt-2">
                  <button type="submit" className="bg-[#976DD0] text-[14px] rounded-[50px] py-[8px] px-[20px] text-white font-bold block ml-auto">
                    Send my Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default ContactUs;
