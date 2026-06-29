import { Table, Tag, Button, Space, Popconfirm } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";

const View = ({ trainingTopics, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: "Persona",
      dataIndex: ["persona", "name"],
      key: "persona",
      render: (text, record) => (
        <Tag color="blue">
          {record.persona?.name || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<MdEdit />}
            onClick={() => onEdit(record)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Training Topic"
            description="Are you sure you want to delete this training topic?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<MdDelete />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={trainingTopics.map((t) => ({ ...t, key: t.id }))}
        pagination={{ pageSize: 10 }}
        loading={false}
        locale={{ emptyText: "No training topics found" }}
      />
    </div>
  );
};

export default View;
