import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export default function Ava(props) {
  if (props.src) {
    return <Avatar {...props} />;
  }
  return <Avatar style={{ backgroundColor: "#1d1d1c" }} icon={<UserOutlined />} />;
}
