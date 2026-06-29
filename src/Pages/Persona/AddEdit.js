import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, InputNumber } from "antd";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";

const AddEdit = ({ open, onClose, onSave, persona }) => {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [rank, setRank] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (persona) {
      form.setFieldsValue({
        name: persona.name,
        rank: persona.rank || 0,
        ctaTitle: persona.ctaTitle || "",
        ctaText: persona.ctaText || "",
        ctaButtonText: persona.ctaButtonText || "",
        ctaButtonUrl: persona.ctaButtonUrl || "",
      });
      setIsActive(persona.isActive !== false);
      setRank(persona.rank || 0);
      setShowCTA(persona.showCTA || false);
    } else {
      form.resetFields();
      setIsActive(true);
      setRank(0);
      setShowCTA(false);
    }
  }, [persona, form, open]);

  const handleSubmit = async (values) => {
    loader(true);
    try {
      const payload = {
        name: values.name,
        rank: values.rank || 0,
        isActive: isActive,
        showCTA: showCTA,
        ctaTitle: values.ctaTitle || "",
        ctaText: values.ctaText || "",
        ctaButtonText: values.ctaButtonText || "",
        ctaButtonUrl: values.ctaButtonUrl || "",
      };

      if (persona?.id) {
        // Update
        const res = await ApiClient.put(`persona/${persona.id}`, payload);
        if (res.success) {
          onSave();
        }
      } else {
        // Create
        const res = await ApiClient.post("persona/create", payload);
        if (res.success) {
          onSave();
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      loader(false);
    }
  };

  return (
    <Modal
      title={persona ? "Edit Persona" : "Add Persona"}
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      okText={persona ? "Update" : "Create"}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Persona Name"
          name="name"
          rules={[
            { required: true, message: "Please enter persona name" },
            { min: 2, message: "Persona name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter persona name" />
        </Form.Item>

        <Form.Item
          label="Rank (Display Order)"
          name="rank"
          rules={[
            { required: true, message: "Please enter rank" },
            { type: "number", min: 0, message: "Rank must be a positive number" },
          ]}
        >
          <InputNumber placeholder="1, 2, 3..." min={0} />
        </Form.Item>

        <Form.Item label="Status" className="mb-0">
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onChange={setIsActive}
            />
            <span>{isActive ? "Active" : "Inactive"}</span>
          </div>
        </Form.Item>

        <Form.Item label="Display CTA" className="mb-0 mt-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showCTA}
              onChange={setShowCTA}
            />
            <span>{showCTA ? "Yes" : "No"}</span>
          </div>
        </Form.Item>

        {showCTA && (
          <>
            <Form.Item
              label="CTA Title"
              name="ctaTitle"
              rules={[
                { required: true, message: "Please enter CTA title" },
              ]}
            >
              <Input placeholder="e.g., How much is your home worth as-is?" />
            </Form.Item>

            <Form.Item
              label="CTA Text"
              name="ctaText"
              rules={[
                { required: true, message: "Please enter CTA text" },
              ]}
            >
              <Input.TextArea 
                placeholder="e.g., Find out our tips to increase your property value over the time."
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="CTA Button Text"
              name="ctaButtonText"
              rules={[
                { required: true, message: "Please enter button text" },
              ]}
            >
              <Input placeholder="e.g., P2P Estimate it !" />
            </Form.Item>

            <Form.Item
              label="CTA Button URL"
              name="ctaButtonUrl"
              rules={[
                { required: true, message: "Please enter button URL" },
              ]}
            >
              <Input placeholder="e.g., /peertopeer" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AddEdit;
