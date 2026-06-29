import { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { MdCategory } from "react-icons/md";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import View from "./View";
import AddEdit from "./AddEdit";

const TrainingTopic = () => {
  const [trainingTopics, setTrainingTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    getTrainingTopics();
  }, []);

  const getTrainingTopics = () => {
    loader(true);
    ApiClient.get("trainingTopic/list").then((res) => {
      if (res.success) {
        setTrainingTopics(res.data || []);
      }
      loader(false);
    });
  };

  const handleAdd = () => {
    setSelectedTopic(null);
    setIsModalOpen(true);
  };

  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    loader(true);
    ApiClient.delete(`trainingTopic/${id}`).then((res) => {
      if (res.success) {
        getTrainingTopics();
      }
      loader(false);
    });
  };

  const handleSave = (topic) => {
    if (selectedTopic?.id) {
      // Update
      loader(true);
      ApiClient.put(`trainingTopic/${selectedTopic.id}`, topic).then((res) => {
        if (res.success) {
          getTrainingTopics();
          setIsModalOpen(false);
        }
        loader(false);
      });
    } else {
      // Create
      loader(true);
      ApiClient.post("trainingTopic/create", topic).then((res) => {
        if (res.success) {
          getTrainingTopics();
          setIsModalOpen(false);
        }
        loader(false);
      });
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  return (
    <Layout>
      <div className="flex items-center mb-8">
        <Tooltip placement="top" title="Back">
          <Link
            to={`/funnelvideo`}
            className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
          >
            <i className="fa fa-angle-left text-lg"></i>
          </Link>
        </Tooltip>
        <div>
          <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
            Training Topics
          </h3>
          <p className="text-xs lg:text-sm font-normal text-[#75757A]">
            Manage training topics for your courses
          </p>
        </div>
      </div>

      <div className="shadow-box overflow-auto rounded-lg bg-white gap-4">
        <div>
          <h4 className="p-4 border-b font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center justify-between text-[#976DD0]">
            <div className="flex items-center">
              <div className="me-3 bg-[#996dca21] p-3 rounded-md">
                <MdCategory className="text-[18px]" />
              </div>
              Training Topics
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-[#976DD0] text-white rounded-lg hover:opacity-80 transition-all"
            >
              Add Topic
            </button>
          </h4>
        </div>

        <View
          trainingTopics={trainingTopics}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <AddEdit
          topic={selectedTopic}
          isOpen={isModalOpen}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </Layout>
  );
};

export default TrainingTopic;
