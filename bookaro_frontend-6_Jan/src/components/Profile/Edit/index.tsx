import { useState } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import "./style.scss";
import Html from "./Html";
import { useNavigate } from "react-router-dom";
import formModel from "../../../models/form.model";
import { useDispatch, useSelector } from "react-redux";
import { login_success } from "../../../actions/user";
import { toast } from "react-toastify";

const EditProfile = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [form, setForm]: any = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    mobileNo: user?.mobileNo || "",
    id: user?._id || "",
    image: user?.image || ""
  });
  const history = useNavigate();
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let invalid = formModel.getFormError("profileForm");
    if (invalid) return;
    let value = {
      ...form,
    };
    loader(true);
    ApiClient.put("user/admin/update-profile", value).then((res) => {
      if (res.success) {
        let data = { ...user, ...value, fullName: value?.firstName + " " + value?.lastName };
        dispatch(login_success(data));
        history("/profile");
      }
      loader(false);
    });
  };

  const ImageUpload = (e: any) => {
    let files = e.target.files
    let file = files.item(0)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
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
        setForm={setForm}
        form={form}
        ImageUpload={ImageUpload}
      />
    </>
  );
};

export default EditProfile;
