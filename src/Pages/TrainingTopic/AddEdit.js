import { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import ApiClient from "../../methods/api/apiClient";

const AddEdit = ({ topic, isOpen, onSave, onClose }) => {
  const [form] = Form.useForm();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = () => {
    ApiClient.get("persona/list")
      .then((res) => {
        if (res.success && res.data) {
          setPersonas(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching personas:", error);
      });
  };

  useEffect(() => {
    if (topic) {
      form.setFieldsValue({
        name: topic.name || "",
        persona: topic.persona?.id || topic.persona?._id || topic.persona || "",
      });
    } else {
      form.resetFields();
    }
  }, [topic, form, isOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      onSave({ name: values.name.trim(), persona: values.persona });
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={topic ? "Edit Training Topic" : "Add Training Topic"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Save"
      cancelText="Cancel"
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Training Topic Name"
          rules={[
            { required: true, message: "Please enter training topic name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter training topic name" />
        </Form.Item>
        <Form.Item
          name="persona"
          label="Persona"
          rules={[{ required: true, message: "Please select a persona" }]}
        >
          <Select
            placeholder="Select a persona"
            options={personas.map((persona) => ({
              label: persona.name,
              value: persona.id || persona._id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEdit;
