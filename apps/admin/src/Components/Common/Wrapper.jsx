import { Empty, Flex, Spin } from "antd";

export default function Wrapper(props) {
  if (props.empty) {
    return <NoData />;
  }
  return <Spin spinning={props.loading}>{props.children}</Spin>;
}
const NoData = () => (
  <Flex style={{ height: "100%" }} align="center" justify="center">
    <Empty />
  </Flex>
);
