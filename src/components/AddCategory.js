import { Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { createCategory } from "../api/admin";
import { isLoggedIn } from "../helpers/authHelper";
import { getAllCategories } from "../api/categories";

const AddCategory = ({ open, onClose, onAddCategory }) => {
  const admin = isLoggedIn();
  const [addForm] = Form.useForm();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  const handleAdd = () => {
    addForm
      .validateFields()
      .then(async (values) => {
        addForm.resetFields();
        const newCategory = {
          ...values,
          categoryName: values.categoryName,
        };
        await createCategory(newCategory, admin);
        setCategories([newCategory, ...categories]);
        onAddCategory(newCategory);
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      title="Add Category"
      open={open}
      onCancel={onClose}
      okText="Add"
      onOk={handleAdd}
    >
      <Form form={addForm} layout="vertical" name="add_form">
        <Form.Item
          name="categoryName"
          label="Category Name"
          rules={[
            {
              required: true,
              message: "Please enter a category name",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategory;