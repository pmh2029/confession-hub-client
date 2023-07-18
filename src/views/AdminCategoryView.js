import {
  List,
  Space,
  Button,
  Input,
  Form,
  Popconfirm,
  notification,
} from "antd";
import React, { useState, useEffect } from "react";
import { deleteCategory, updateCategory } from "../api/admin";
import { isLoggedIn } from "../helpers/authHelper";
import { getAllCategories } from "../api/categories";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import AddCategory from "../components/AddCategory";
import { createCategory } from "../api/admin";
import EditCategory from "../components/EditCategory";

const AdminCategoryView = () => {
  const admin = isLoggedIn();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  let [filteredData] = useState();
  const [open, setOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getAllCategories();
    setGridData(res);
    setLoading(false);
  };

  const handleDelete = async (value) => {
    try {
      await deleteCategory(value._id, admin);
      const categories = await getAllCategories();
      setGridData(categories);
      notification.success({
        message: "Success",
        description: "Category deleted successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete category!",
      });
    }
  };

  const reset = () => {
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

  const dataWithKey = gridData.map((item) => ({
    ...item,
    key: item._id,
  }));

  const handleAddCategory = async (newCategory) => {
    try {
      await createCategory(newCategory, admin);
      const categories = await getAllCategories();
      setGridData(categories);
      notification.success({
        message: "Success",
        description: "Category added successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add category!",
      });
    }
  };

  const handleEditCategory = async (editedCategory) => {
    try {
      const data = {
        categoryName: editedCategory.categoryName,
        url: editedCategory.url,
      };
      await updateCategory(editedCategory._id, admin, data);
      const updatedCategories = await getAllCategories();
      setGridData(updatedCategories);
      notification.success({
        message: "Success",
        description: "Category updated successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update category!",
      });
    }
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
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={dataWithKey}
        renderItem={(item) => (
          <>
            <List.Item
              extra={
                <>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {item.url.map((u, index) => {
                      return (
                        <img
                          key={index}
                          height={100}
                          width={100}
                          alt="logo"
                          src={u}
                          style={{ flex: "0 0 50%", objectFit: "contain" }}
                        />
                      );
                    })}
                  </div>
                </>
              }
            >
              <List.Item.Meta
                title={<a href={item.href}>{item.categoryName}</a>}
              />
              <div>
                <Space wrap>
                  <div>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSelectedCategory(item);
                        setEditCategoryOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <EditCategory
                      open={editCategoryOpen}
                      onClose={() => setEditCategoryOpen(false)}
                      category={selectedCategory}
                      onEditCategory={handleEditCategory}
                    />
                  </div>
                  <Popconfirm
                    placement="topLeft"
                    title="Are you sure want to delete this category?"
                    onConfirm={() => handleDelete(item)}
                  >
                    <Button danger type="primary">
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            </List.Item>
          </>
        )}
      />
    </div>
  );
};

export default AdminCategoryView;
