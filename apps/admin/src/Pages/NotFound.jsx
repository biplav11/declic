import { Button, Flex, Result } from "antd";
import { Link } from "react-router-dom";
const App = () => (
  <Flex align="center" justify="center" style={{ height: "100vh" }}>
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  </Flex>
);
export default App;
