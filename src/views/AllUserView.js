import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Button, Space } from "antd";
import { getAllUsers, deleteUser } from "../api/admin";
import { isLoggedIn } from "../helpers/authHelper";

const AllUserView = () => {
  const admin = isLoggedIn();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getAllUsers(admin);
    setGridData(res);
    setLoading(false);
  };

  const handleDelete = async (value) => {
    await deleteUser(value._id, admin);
    const users = await getAllUsers(admin);
    setGridData(users);
  };

  const columns = [
    {
      dataIndex: "_id",
      hidden: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "Posts",
      dataIndex: "postCount",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) =>
        gridData.length >= 1 ? (
          <Space>
            <Popconfirm
              title="Are you sure want to delete this user?"
              onConfirm={() => handleDelete(record)}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ].filter((record) => record.hidden !== true);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={gridData}
        bordered
        loading={loading}
      />
    </div>
  );
};

export default AllUserView;
