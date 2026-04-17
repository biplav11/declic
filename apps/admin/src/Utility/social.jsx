import {
  FacebookFilled,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeFilled,
  LinkedinFilled,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LikeOutlined,
  TrophyOutlined,
  DislikeOutlined,
} from "@ant-design/icons";

export function getIcons(string, style = {}) {
  switch (string.toLowerCase()) {
    case "facebook":
      return <FacebookFilled style={style} />;
    case "instagram":
      return <InstagramOutlined style={style} />;
    case "twitter":
      return <TwitterOutlined style={style} />;
    case "linkedin":
      return <LinkedinFilled style={style} />;
    case "youtube":
      return <YoutubeFilled style={style} />;

    default:
      break;
  }
}

export function getStatusIcons(string, style = {}) {
  switch (string.toLowerCase()) {
    case "unfollowed":
      return <ClockCircleOutlined style={style} />;
    case "followed":
      return <CheckCircleOutlined style={style} />;
    case "interested":
      return <LikeOutlined style={style} />;
    case "won":
      return <TrophyOutlined style={style} />;
    case "lost":
      return <DislikeOutlined style={style} />;

    default:
      break;
  }
}
