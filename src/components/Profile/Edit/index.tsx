import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login_success } from "../../../actions/user";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import formModel from "../../../models/form.model";
import Html from "./Html";
import "./style.scss";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [form, setForm]: any = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    mobileNo: user?.mobileNo || "",
    id: user?.id || user?._id || "",
    image: user?.image || "",
    kwh: user?.kwh || 0,
  });

  const validate = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]+$/;
    if (!form.firstName || form.firstName?.trim() === "") {
      toast.error("enter firstname")
      return false;
    } else if (!form.lastName || form.lastName?.trim() === "") {
      toast.error("enter lastname")
      return false;
    } else if (!emailRegex.test(form.email)) {
      toast.error("enter valid email")
      return false;
    } else if (!form.mobileNo || form.mobileNo?.trim() === "") {
      toast.error("enter mobileNo")
      return false;
      // } else if (!phoneRegex.test(form.phoneNumber)) {
      //   toast.error("enter valid mobileNo")
      //   return false;
    } else if (!form.kwh || form.kwh?.trim() === "") {
      toast.error("enter average price KWH")
      return false;
    } else if (+form.kwh === 0) {
      toast.error("enter valid average price KWH")
      return false;
    }
    return true;
  }
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validate()) return
    let value = {
      ...form,
    };
    loader(true);
    ApiClient.put("user/admin/update-profile", value).then((res) => {
      if (res.success) {
        let data = { ...user, ...value, fullName: value?.firstName + " " + value?.lastName };
        dispatch(login_success(data));
        navigate("/profile");
      }
      loader(false);
    });
  };

  const ImageUpload = (e: any) => {
    let files = e.target.files
    let file = files.item(0)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']; // Add more image types if needed
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }
    loader(true)
    ApiClient.postFormData('upload/image', { file: file }).then(res => {
      if (res.success) {
        setForm({ ...form, image: res?.fileName })
      }
      loader(false)
    })
  }

  return (
    <>
      <Html
        handleSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        ImageUpload={ImageUpload}
      />
    </>
  );
};

export default EditProfile;
