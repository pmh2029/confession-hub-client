import { Form, Input, Modal } from "antd";
import React, { useEffect } from "react";

const EditCategory = ({ open, onClose, category, onEditCategory }) => {
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (category) {
      editForm.setFieldsValue({
        categoryName: category.categoryName,
        url: category.url.join(", "),
      });
    }
  }, [category, editForm]);

  const handleEdit = () => {
    editForm
      .validateFields()
      .then((values) => {
        editForm.resetFields();
        const editedCategory = {
          ...category,
          categoryName: values.categoryName,
          url: values.url.split(",").map((url) => url.trim()),
        };
        onEditCategory(editedCategory);
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      title="Edit Category"
      open={open}
      onCancel={onClose}
      okText="Edit"
      onOk={handleEdit}
    >
      <Form form={editForm} layout="vertical" name="edit_form">
        <Form.Item name="categoryName" label="Category Name">
          <Input />
        </Form.Item>
        <Form.Item name="url" label="Category Image">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategory;
