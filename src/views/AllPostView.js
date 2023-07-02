import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Button, Space, Form, Input } from "antd";
import { isLoggedIn } from "../helpers/authHelper";
import { SearchOutlined } from "@ant-design/icons";
import { deletePost, getAllPosts } from "../api/posts";
import { CLIENT_URL } from "../config";

const AllPostView = () => {
  const admin = isLoggedIn();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  let [filteredData] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getAllPosts();
    setGridData(res.data);
    setLoading(false);
  };

  const dataWithKey = gridData.map((item) => ({
    ...item,
    key: item._id,
  }));

  const handleDelete = async (value) => {
    await deletePost(value._id, admin);
    const res = await getAllPosts();
    setGridData(res.data);
  };

  const isEditing = (record) => {
    return record.key === editRowKey;
  };

  const handleChange = (...sorter) => {
    const { order, field } = sorter[2];
    setSortedInfo({
      columnKey: field,
      order,
    });
  };

  const columns = [
    {
      dataIndex: "_id",
      hidden: true,
    },
    {
      title: "#CFS",
      dataIndex: "postNumber",
      align: "center",
      editTable: true,
      sorter: (a, b) => a.postNumber - b.postNumber,
      sortOrder: sortedInfo.columnKey === "postNumber" && sortedInfo.order,
      render: (text, record) => (
        <a
          href={CLIENT_URL + `posts/${record._id}`}
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          #cfs{text}
        </a>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      align: "center",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder: sortedInfo.columnKey === "title" && sortedInfo.order,
    },
    {
      title: "Category",
      dataIndex: "category",
      align: "center",
      sorter: (a, b) =>
        a.category.categoryName.localeCompare(b.category.categoryName),
      sortOrder: sortedInfo.columnKey === "category" && sortedInfo.order,
      render: (_, record) => record.category.categoryName,
    },
    {
      title: "Upvote Count",
      dataIndex: "upvoteCount",
      align: "center",
      sorter: (a, b) => a.upvoteCount - b.upvoteCount,
      sortOrder: sortedInfo.columnKey === "upvoteCount" && sortedInfo.order,
    },
    {
      title: "Downvote Count",
      dataIndex: "downvoteCount",
      align: "center",
      sorter: (a, b) => a.downvoteCount - b.downvoteCount,
      sortOrder: sortedInfo.columnKey === "downvoteCount" && sortedInfo.order,
    },
    {
      title: "Report Count",
      dataIndex: "reportCount",
      align: "center",
      sorter: (a, b) => a.reportCount - b.reportCount,
      sortOrder: sortedInfo.columnKey === "reportCount" && sortedInfo.order,
    },
    {
      title: "Comment Count",
      dataIndex: "commentCount",
      align: "center",
      sorter: (a, b) => a.commentCount - b.commentCount,
      sortOrder: sortedInfo.columnKey === "commentCount" && sortedInfo.order,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return gridData.length >= 1 ? (
          <Space>
            <Popconfirm
              title="Are you sure want to delete this post?"
              onConfirm={() => handleDelete(record)}
            >
              <Button danger type="primary" disabled={editable}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ) : null;
      },
    },
  ].filter((record) => record.hidden !== true);

  const mergedColumns = columns.map((col) => {
    if (!col.editTable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record: record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => {
    const input = <Input />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please input ${title}`,
              },
            ]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const reset = () => {
    setSortedInfo({});
    setSearchText("");
    loadData();
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      loadData();
    }
  };

  const globalSearch = () => {
    filteredData = dataWithKey.filter((value) => {
      return value.title.toLowerCase().includes(searchText.toLowerCase());
    });
    setGridData(filteredData);
  };

  return (
    <div>
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Input
            placeholder="Type keywords..."
            onChange={handleInputChange}
            type="text"
            allowClear
            value={searchText}
            size="large"
            style={{
              marginRight: 10,
            }}
          />
          <Button
            onClick={globalSearch}
            size="large"
            icon={<SearchOutlined />}
            style={{
              marginRight: 10,
            }}
          >
            Search
          </Button>
          <Button
            onClick={reset}
            size="large"
            style={{
              color: "white",
              background: "green",
            }}
          >
            Reset
          </Button>
        </div>
      </Space>
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={
            filteredData && filteredData.length ? filteredData : dataWithKey
          }
          bordered
          loading={loading}
          onChange={handleChange}
        />
      </Form>
    </div>
  );
};

export default AllPostView;
