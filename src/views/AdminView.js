import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Typography, theme } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostView from "./PostView";
const { Header, Sider, Content } = Layout;
const AdminView = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1"); // Thêm trạng thái cho selectedKey
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleClick = () => {
    navigate("/");
  };

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key); // Cập nhật selectedKey khi nhấp vào menu item
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <PostView />;
      case "2":
        return <div>Nội dung cho nav 2</div>;
      case "3":
        return <div>Nội dung cho nav 3</div>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* <Typography>
          <Title level={3} code={true} style={{color: "rgba(0, 0, 0, 0.6)"}}>
            Confession Hub
          </Title>
        </Typography> */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedKey]} // Chọn menu item tương ứng với selectedKey
          onClick={handleMenuClick} // Xử lý sự kiện khi nhấp vào menu item
          items={[
            {
              label: "Confession Hub",
              title: "Confession Hub",
              // disabled: true,
              // style: { color: "rgba(0,0,0)" },
            },
            {
              disabled: true,
            },
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
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
