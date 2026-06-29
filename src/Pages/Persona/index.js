import React, { useEffect, useState } from "react";
import Layout from "../../components/global/layout";
import View from "./View";
import AddEdit from "./AddEdit";
import ApiClient from "../../methods/api/apiClient";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import loader from "../../methods/loader";

const Persona = () => {
  const [personas, setPersonas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const getPersonas = () => {
    loader(true);
    ApiClient.get("persona/list").then((res) => {
      if (res.success) {
        setPersonas(res.data || []);
      }
      loader(false);
    });
  };

  useEffect(() => {
    getPersonas();
  }, []);

  const handleAdd = () => {
    setSelectedPersona(null);
    setIsModalOpen(true);
  };

  const handleEdit = (persona) => {
    setSelectedPersona(persona);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedPersona(null);
  };

  const handleSave = () => {
    getPersonas();
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this persona?")) {
      loader(true);
      ApiClient.delete(`persona/${id}`).then((res) => {
        if (res.success) {
          getPersonas();
        }
        loader(false);
      });
    }
  };

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Persona Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
        >
          Add Persona
        </Button>
      </div>
      <View
        personas={personas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AddEdit
        open={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        persona={selectedPersona}
      />
    </Layout>
  );
};

export default Persona;
