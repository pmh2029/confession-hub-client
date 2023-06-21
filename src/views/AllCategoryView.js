import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Button, Space, Form, Input } from "antd";
import { deleteCategory, updateCategory } from "../api/admin";
import { isLoggedIn } from "../helpers/authHelper";
import { getAllCategories } from "../api/categories";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import AddCategory from "../components/AddCategory";
import { createCategory } from "../api/admin";

const AllCategoryView = () => {
  const admin = isLoggedIn();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  let [filteredData] = useState();
  const [open, setOpen] = useState(false);

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

  const handleDelete = async (value) => {
    await deleteCategory(value._id, admin);
    const categories = await getAllCategories();
    setGridData(categories);
  };

  const isEditing = (record) => {
    return record.key === editRowKey;
  };

  const cancel = () => {
    setEditRowKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      await updateCategory(key, admin, row);
      const categories = await getAllCategories();
      setGridData(categories);
      setEditRowKey("");
    } catch (error) {
      console.log(error);
    }
  };

  const edit = (record) => {
    form.setFieldsValue({
      categoryName: "",
      ...record,
    });
    setEditRowKey(record.key);
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
    },
    {
      title: "Posts",
      dataIndex: "postCount",
      align: "center",
      sorter: (a, b) => a.postCount - b.postCount,
      sortOrder: sortedInfo.columnKey === "postCount" && sortedInfo.order,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return gridData.length >= 1 ? (
          <Space>
            {editable ? (
              <span>
                <Space size="middle">
                  <Button type="primary" onClick={() => save(record.key)}>
                    Save
                  </Button>
                  <Popconfirm
                    title="Are you sure to cancel?"
                    onConfirm={cancel}
                  >
                    <Button style={{ marginRight: 8 }}>Cancel</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Button type="primary" onClick={() => edit(record)}>
                Edit
              </Button>
            )}

            <Popconfirm
              title="Are you sure want to delete this category?"
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
      return value.categoryName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setGridData(filteredData);
  };

  const handleAddCategory = async (newCategory) => {
    await createCategory(newCategory, admin);
    const categories = await getAllCategories();
    setGridData(categories);
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Button
            icon={<PlusCircleOutlined />}
            type="dashed"
            size="large"
            onClick={() => setOpen(true)}
            style={{ backgroundColor: "#DCDCDC" }}
          >
            Add Category
          </Button>
          <AddCategory
            open={open}
            onClose={() => setOpen(false)}
            onAddCategory={handleAddCategory}
          />
        </div>
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

export default AllCategoryView;
