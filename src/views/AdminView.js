import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  FileZipOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import AdminUserView from "./AdminUserView";
import { logoutUser } from "../helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";
import AdminCategoryView from "./AdminCategoryView";
import AdminPostView from "./AdminPostView";

const { Header, Sider, Content } = Layout;
const AdminView = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1"); // Thêm trạng thái cho selectedKey

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key); // Cập nhật selectedKey khi nhấp vào menu item
  };

  const handleLogout = async (e) => {
    logoutUser();
    navigate("/admin/login");
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "0":
        return <AdminPostView contentType="posts" openInNewTab />;
      case "1":
        return <AdminPostView contentType="posts" openInNewTab />;
      case "2":
        return <AdminUserView />;
      case "3":
        return <AdminCategoryView />;
      // case "4":
      //   return <AdminPostView contentType="posts" openInNewTab adminReview/>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedKey]} // Chọn menu item tương ứng với selectedKey
          onClick={handleMenuClick} // Xử lý sự kiện khi nhấp vào menu item
          items={[
            {
              key: "0",
              label: "Confession Hub",
              title: "Confession Hub",
              // disabled: true,
            },
            {
              disabled: true,
            },
            {
              key: "1",
              icon: <FileZipOutlined />,
              label: "Post",
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "User",
            },
            {
              key: "3",
              icon: <BiCategoryAlt />,
              label: "Category",
            },
            // {
            //   key: "4",
            //   icon: <UploadOutlined />,
            //   label: "Admin Review",
            // },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div>
            Admin
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                fontSize: "16px",
                height: 64,
              }}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
          }}
        >
          {renderContent()} {/* Hiển thị nội dung tương ứng */}
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminView;
