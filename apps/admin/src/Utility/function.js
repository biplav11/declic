import { API_URL } from "./variables";

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export function getEditorImage(id) {
  return `${API_URL}/_/images/avatars/avatar${id}.svg`;
}

export const getImages = (id, collection, src) => {
  if (src) {
    return `${API_URL}/api/files/${collection}/${id}/${src}`;
  }
  return "";
};

export function _notification(api, message, description, type = "open") {
  api[type]({ message, description });
}

export function getPastTense(string) {
  switch (string) {
    case "create":
      return "created";
    case "update":
      return "updated";
    case "delete":
      return "deleted";
    default:
      break;
  }
}

export function getIng(string) {
  switch (string) {
    case "create":
      return "creating";
    case "update":
      return "updating";
    case "delete":
      return "deleting";
    default:
      break;
  }
}

export function capitalize(str) {
  let string = str.toLowerCase().split(" ");
  string = string.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  return string;
}

export function notification(api, action, collection) {
  const success = () => api["success"]({ message: "Success", description: capitalize(`${collection} ${getPastTense(action)} successfully.`) });
  const error = () =>
    api["error"]({ message: "Error", description: `Oops!! There was a problem ${getIng(action)} ${collection}. Please try again.` });
  return [success, error];
}

export function getAvatarId() {
  return Math.floor(Math.random() * 10);
}

export function getPopMessage(collection) {
  return {
    title: `Delete ${capitalize(collection)}?`,
    description: `Are you sure you want to delete this ${collection}?`,
  };
}

export function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

// const Individual = ({ records }) => {
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const onSelectChange = (newSelectedRowKeys) => {
//     console.error("selectedRowKeys changed: ", newSelectedRowKeys);
//     setSelectedRowKeys(newSelectedRowKeys);
//   };

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: onSelectChange,
//     selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
//   };

//   return;
// };
