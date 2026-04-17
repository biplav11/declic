// import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Card } from "antd";
const { Meta } = Card;
const ListingCard = (props) => {
  let image = props.image || "https://catalogue.automobile.tn/max/2023/03/46894.webp?t=1693578970",
    title = props.title || "Toyota Sienna",
    description = props.price || "starting from DT 78,000";
  return (
    <Card style={{ width: 250 }} cover={<img alt="example" src={image} />}>
      <Meta {...{ title, description }} />
    </Card>
  );
};
export default ListingCard;
