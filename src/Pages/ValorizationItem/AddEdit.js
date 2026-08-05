import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared from "./shared";

const AddEdit = () => {
  const history = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    label: "",
    label_en: "",
    category: "",
    order: 0,
    isActive: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success && res.data) {
          setForm({
            label: res.data.label || "",
            label_en: res.data.label_en || "",
            category: res.data.category || "",
            order: res.data.order || 0,
            isActive: res.data.isActive !== false,
          });
        }
      });
    }
  }, [id]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.label.trim()) {
      setError("Label is required");
      return;
    }
    setError("");
    loader(true);
    const api = isEdit ? shared.editApi : shared.addApi;
    const method = isEdit ? "put" : "post";
    ApiClient.allApi(api, { ...form, id }, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-box p-6">
        <h3 className="text-2xl font-semibold text-[#111827] mb-6">
          {isEdit ? "Edit" : "Add"} {shared.addTitle}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label (FR) *</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => handleChange("label", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#976DD0] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label (EN)</label>
            <input
              type="text"
              value={form.label_en}
              onChange={(e) => handleChange("label_en", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#976DD0] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => handleChange("order", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#976DD0] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-4 h-4 accent-[#976DD0]"
              id="isActive"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => history(`/${shared.url}`)}
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-[#976DD0] text-white hover:bg-[#7d55b5]"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEdit;
