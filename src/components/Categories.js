import React, { useState, useEffect } from "react";
import { Table, Button, Space, Form, Input } from "antd";
import { isLoggedIn } from "../helpers/authHelper";
import { getAllCategories } from "../api/categories";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Stack, Typography } from "@mui/material";
import HorizontalStack from "./HorizontalStack";
import { BiCategory } from "react-icons/bi";
import { CLIENT_URL } from "../config";

const Categories = () => {
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
    const res = await getAllCategories();
    setGridData(res);
    setLoading(false);
  };

  const dataWithKey = gridData.map((item) => ({
    ...item,
    key: item._id,
  }));

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
      title: "Category Name",
      dataIndex: "categoryName",
      align: "center",
      editTable: true,
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      sortOrder: sortedInfo.columnKey === "categoryName" && sortedInfo.order,
      render: (text, record) => (
        <a href={CLIENT_URL + `posts/categories/${record._id}`}>{text}</a>
      ),
    },
    {
      title: "Posts",
      dataIndex: "postCount",
      align: "center",
      sorter: (a, b) => a.postCount - b.postCount,
      sortOrder: sortedInfo.columnKey === "postCount" && sortedInfo.order,
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

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      loadData();
    }
  };

  const globalSearch = () => {
    filteredData = dataWithKey.filter((value) => {
      return value.categoryName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setGridData(filteredData);
  };

  return (
    <Card>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <HorizontalStack>
            <BiCategory />
            <Typography>Category</Typography>
          </HorizontalStack>
        </HorizontalStack>
        <Space
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Input
              placeholder="Type keywords..."
              onChange={handleInputChange}
              type="text"
              allowClear
              value={searchText}
              style={{
                marginRight: 10,
              }}
            />
            <Button
              onClick={globalSearch}
              icon={<SearchOutlined />}
              shape="circle"
              style={{
                marginRight: 10,
              }}
            ></Button>
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
            pagination={{ defaultPageSize: 3 }}
          />
        </Form>
      </Stack>
    </Card>
  );
};

export default Categories;
