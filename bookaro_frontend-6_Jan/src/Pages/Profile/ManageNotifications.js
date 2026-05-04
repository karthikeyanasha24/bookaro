import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import AcountSidebar from "../Settings/AcountSidebar";
import "./profile.scss";

const DEFAULT_NOTIFICATION_SETTING = {
  new_messages: {
    mail: true,
    phone: true,
  },
  property_profile: {
    mail: true,
    phone: true,
  },
  new_like: {
    phone: true,
  },
  new_follow: {
    phone: true,
  },
  new_share: {
    mail: true,
    phone: true,
  },
  new_status_update: {
    mail: true,
    phone: true,
  },
  new_key_update: {
    mail: true,
    phone: true,
  },
  new_share_follow: {
    mail: true,
    phone: true,
  },
  new_blog_post: {
    mail: true,
    phone: true,
  },
  new_feature_release: {
    mail: true,
    phone: true,
  },
};

function mergeNestedSetting(incoming, fallback) {
  const base =
    fallback && typeof fallback === "object" && !Array.isArray(fallback)
      ? { ...fallback }
      : {};
  if (incoming && typeof incoming === "object" && !Array.isArray(incoming)) {
    return { ...base, ...incoming };
  }
  return base;
}

const ManageNotifications = () => {
  const user = useSelector((state) => state.user);
  const [setting, setSetting] = useState(() => ({
    ...DEFAULT_NOTIFICATION_SETTING,
  }));

  const changeSetting = (key, key2, value) => {
    const prev =
      setting[key] && typeof setting[key] === "object" && !Array.isArray(setting[key])
        ? setting[key]
        : {};
    setSetting({
      ...setting,
      [key]: { ...prev, [key2]: !value },
    });
  };
  const getSettings = () => {
    ApiClient.get("setting/detail/", { user_id: user?._id }).then((res) => {
      if (res.success) {
        let data = res.data;
        if (data) {
          setSetting({
            new_blog_post: mergeNestedSetting(
              data.new_blog_post,
              DEFAULT_NOTIFICATION_SETTING.new_blog_post
            ),
            new_feature_release: mergeNestedSetting(
              data.new_feature_release,
              DEFAULT_NOTIFICATION_SETTING.new_feature_release
            ),
            new_follow: mergeNestedSetting(
              data.new_follow,
              DEFAULT_NOTIFICATION_SETTING.new_follow
            ),
            new_key_update: mergeNestedSetting(
              data.new_key_update,
              DEFAULT_NOTIFICATION_SETTING.new_key_update
            ),
            new_like: mergeNestedSetting(
              data.new_like,
              DEFAULT_NOTIFICATION_SETTING.new_like
            ),
            new_messages: mergeNestedSetting(
              data.new_messages,
              DEFAULT_NOTIFICATION_SETTING.new_messages
            ),
            new_share: mergeNestedSetting(
              data.new_share,
              DEFAULT_NOTIFICATION_SETTING.new_share
            ),
            new_share_follow: mergeNestedSetting(
              data.new_share_follow,
              DEFAULT_NOTIFICATION_SETTING.new_share_follow
            ),
            new_status_update: mergeNestedSetting(
              data.new_status_update,
              DEFAULT_NOTIFICATION_SETTING.new_status_update
            ),
            property_profile: mergeNestedSetting(
              data.property_profile,
              DEFAULT_NOTIFICATION_SETTING.property_profile
            ),
          });
        }
      }
      loader(false);
    });
  };
  useEffect(() => {
    getSettings();
  }, [user?._id]);

  const updateSetting = () => {
    loader(true);
    const payload = {
      user_id: user?._id,
      ...setting
    };
    ApiClient.put("setting/update", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        getSettings()
      }
      loader(false);
    });
  }

  return (
    <PageLayout>
      <section className="py-14   lg:py-16 bg-[#f2ecf8]">
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
            <div className="grid grid-cols-12 lg:gap-12  gap-0">
              <AcountSidebar />
              <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8">
                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                  Manage your notifications
                </h2>
                <div className="p-6 md:px-14 px-6 border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0">
                  <h4 className="text-black font-bold text-[19px]  mb-0">
                    Notifications
                  </h4>
                  <p className="text-black text-[18px] mb-14">
                    Define when to be alerted
                  </p>

                  <div>
                    <h3 className="text-[#5A5A5A] font-bold mt-8 text-[20px] pb-2 border-b border-[#976DD0]">
                      Message Box
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-[#5A5A5A] mb-5 mt-5">New messages</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_messages", "phone", setting?.new_messages?.phone)}>
                            <img src={`/assets/img/web${setting?.new_messages?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_messages", "mail", setting?.new_messages?.mail)}>
                            <img src={`/assets/img/mail${setting?.new_messages?.mail ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px] ms-2" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#5A5A5A] font-bold mt-8 text-[20px] pb-2 border-b border-[#976DD0]">
                      My property profile events
                    </h3>
                    <div className="flex items-center justify-between mb-4 mt-5">
                      <p className="text-[#5A5A5A]  ">Listing of my property profile</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("property_profile", "phone", setting?.property_profile?.phone)}>
                            <img src={`/assets/img/web${setting?.property_profile?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("property_profile", "mail", setting?.property_profile?.mail)}>
                            <img src={`/assets/img/mail${setting?.property_profile?.mail ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px] ms-2" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#5A5A5A] ">New Like</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_like", "phone", setting?.new_like?.phone)}>
                            <img src={`/assets/img/web${setting?.new_like?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li className="w-[30px] ms-2">

                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#5A5A5A] ">New Follow</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_follow", "phone", setting?.new_follow?.phone)}>
                            <img src={`/assets/img/web${setting?.new_follow?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li className="w-[30px] ms-2">

                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#5A5A5A] ">New Share</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_share", "phone", setting?.new_share?.phone)}>
                            <img src={`/assets/img/web${setting?.new_share?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li className="w-[30px] ms-2">

                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#5A5A5A] font-bold mt-8 text-[20px] pb-2 border-b border-[#976DD0]">
                      Property profile I follow
                    </h3>
                    <div className="flex items-center justify-between mb-4 mt-5">
                      <p className="text-[#5A5A5A]  ">New Status update</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_status_update", "phone", setting?.new_status_update?.phone)}>
                            <img src={`/assets/img/web${setting?.new_status_update?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_status_update", "mail", setting?.new_status_update?.mail)}>
                            <img src={`/assets/img/mail${setting?.new_status_update?.mail ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px] ms-2" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#5A5A5A] ">New key update</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_key_update", "phone", setting?.new_key_update?.phone)}>
                            <img src={`/assets/img/web${setting?.new_key_update?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_key_update", "mail", setting?.new_key_update?.mail)}>
                            <img src={`/assets/img/mail${setting?.new_key_update?.mail ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px] ms-2" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#5A5A5A] ">New Share</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_share_follow", "phone", setting?.new_share_follow?.phone)}>
                            <img src={`/assets/img/web${setting?.new_share_follow?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_share_follow", "mail", setting?.new_share_follow?.mail)}>
                            <img src={`/assets/img/mail${setting?.new_share_follow?.mail ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px] ms-2" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#5A5A5A] font-bold mt-8 text-[20px] pb-2 border-b border-[#976DD0]">
                      Bookaroo content
                    </h3>
                    <div className="flex items-center justify-between mb-4 mt-5">
                      <p className="text-[#5A5A5A]  ">New blog post</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_blog_post", "phone", setting?.new_blog_post?.phone)}>
                            <img src={`/assets/img/web${setting?.new_blog_post?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_blog_post", "mail", setting?.new_blog_post?.mail)}>
                            <img src={`/assets/img/mail${setting?.new_blog_post?.mail ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px] ms-2" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#5A5A5A] ">New feature release</p>
                      <ul className="flex items-center">
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_feature_release", "phone", setting?.new_feature_release?.phone)}>
                            <img src={`/assets/img/web${setting?.new_feature_release?.phone ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px]" />
                          </Link>
                        </li>
                        <li>
                          <Link className=""
                            onClick={() => changeSetting("new_feature_release", "mail", setting?.new_feature_release?.mail)}>
                            <img src={`/assets/img/mail${setting?.new_feature_release?.mail ? "" : "-cancel"}.png`}
                              alt="" className="w-[30px] ms-2" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#5A5A5A] font-bold mt-8 text-[20px] pb-2 border-b border-[#976DD0]">
                      Notifications frequency
                    </h3>
                    <div className="flex items-center justify-between mb-4 mt-5">
                      <p className="text-[#5A5A5A]  ">Send me notifications:</p>
                      <select className="border border-[#976DD0] bg-white rounded-[4px] p-3">
                        <option>
                          for each event
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-20 mx-auto flex items-center justify-end">
                    <button
                      onClick={() => updateSetting()}
                      className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ManageNotifications;
