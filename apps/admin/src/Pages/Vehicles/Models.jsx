import MainLayout from "src/Components/Layouts/MainLayout";
import Wrapper from "src/Components/Common/Wrapper";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Select, Space, Table, Tag, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined, UploadOutlined, LoadingOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { getBase64, getImages, getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeModelsLoading, getBodyTypes, getBrands, getModels } from "src/Redux/vehicles";
import { getSiteSettings } from "src/Redux/general";

const { Search } = Input;

export default function Models() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);
  const searchInput = useRef(null);

  const dispatch = useDispatch();
  const { modelsLoading: dataLoading, models, bodyTypes, brands } = useSelector((state) => state.vehicles);
  const { siteSettings } = useSelector((state) => state.general);

  function getData() {
    dispatch(changeModelsLoading(true));
    dispatch(getModels());
    dispatch(getSiteSettings());
    dispatch(getBodyTypes());
    dispatch(getBrands());
  }

  let image = siteSettings.find((s) => s.key === "default_image")?.value;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, selectedKeys, dataIndex, confirm) => {
    clearFilters();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    function test() {
      handleFilter(confirm, selectedKeys, dataIndex);
    }
    test();
  };

  function handleFilter(confirm, selectedKeys, dataIndex) {
    confirm({
      closeDropdown: false,
    });
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Search
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onSearch={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => handleReset(clearFilters, selectedKeys, dataIndex, confirm)}
            size="small"
            type="text"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button type="text" size="small" onClick={() => handleFilter(confirm, selectedKeys, dataIndex)}>
            Filter
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Model Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, { collectionName, id, thumbnail }) => {
        let img = thumbnail ? getImages(id, collectionName, thumbnail) : image;
        return (
          <Flex gap={10} align="center">
            <img style={{ height: 50, width: 50, objectFit: "contain", border: "1px solid #eee", borderRadius: 5 }} src={img} />
            <span>{name}</span>
          </Flex>
        );
      },
      ...getColumnSearchProps("name"),
    },
    {
      title: "Brands",
      dataIndex: "brand",
      render: (_, { expand }) => {
        let { id, collectionName, image, name } = expand?.brand || {};
        return (
          <Flex gap={10} align="center">
            <img style={{ height: 40, width: 40, objectFit: "contain" }} src={getImages(id, collectionName, image)} />
            <span>{name}</span>
          </Flex>
        );
      },
      filters: brands?.map((b) => ({ text: b.name, value: b.id })),
      filterSearch: true,
      onFilter: (value, record) => record.brand.includes(value),
    },
    {
      title: "Body Type",
      dataIndex: "body_type",
      filters: bodyTypes?.map((b) => ({ text: b.name, value: b.id })),
      filterSearch: true,
      onFilter: (value, record) => record.body_types.includes(value),
      render: (_, { expand }) => {
        return (
          <>
            {expand?.body_types?.map(({ id, collectionName, image, name }) => (
              <Tag key={id}>
                <Flex gap={10} align="center">
                  <img style={{ height: 30, width: 30, objectFit: "contain" }} src={getImages(id, collectionName, image)} />
                  <span>{name.toUpperCase()}</span>
                </Flex>
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "created",
      defaultSortOrder: "descend",
      render: (text, record) => <span>{moment(record.created).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = models.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    setAddOpen(true);
  }

  function handleEdit(id) {
    setId(id);
    setEditOpen(true);
  }

  function rowEvent(record) {
    return {
      onClick: (event) => {
        event.preventDefault();
        handleEdit(record.id);
      },
    };
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Models" expanded="Vehicles" title="Models" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={models.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData, models, bodyTypes, brands }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, models, api, getData, bodyTypes, brands }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData, bodyTypes, brands }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  function closeDrawer() {
    setAddOpen(false);
    form.resetFields();
    setImageUrl(null);
  }
  function handleAddUser() {
    document.getElementById("submitBtn").click();
  }
  function handleChange(info) {
    getBase64(info.fileList[0].originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  }
  function handleRemove() {
    setImageUrl(null);
    form.setFieldValue("thumbnail", undefined);
  }
  async function handleSubmit(values) {
    let createData = new FormData();
    console.log(values);
    for (var key in values) {
      if (key === "thumbnail" && values.thumbnail) {
        createData.append("thumbnail", values.thumbnail.fileList[0].originFileObj);
      } else if (key === "body_types") {
        values?.body_types.map((bt) => {
          createData.append("body_types", bt);
        });
      } else {
        createData.append(key, values[key]);
      }
    }
    let [success, error] = notification(api, "create", "Models");
    try {
      await pb.collection("models").create(createData);
      success();
      setAddOpen(false);
      form.resetFields();
      setImageUrl(null);
      getData();
    } catch (err) {
      error();
    }
  }

  const footerAdd = (
    <Button onClick={handleAddUser} type="default" size="large" style={{ width: "100%" }}>
      Create Body Type
    </Button>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Drawer footer={footerAdd} title="Add New Model" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{}}>
        <Form.Item name="thumbnail" label="Thumbnail">
          <Upload
            id="avatarNew"
            name="thumbnail"
            listType="picture-circle"
            className="avatar-uploader-slider"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
            fileList={[]}
            accept="image/jpeg, image/*"
            style={{ width: "100%" }}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%", height: 100, objectFit: "contain" }} /> : uploadButton}
          </Upload>
          {imageUrl && (
            <Button onClick={handleRemove} size="small" type="default" icon={<CloseOutlined />} style={{ width: 100 }}>
              Remove
            </Button>
          )}
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input id="nameNew" size="large" placeholder="eg some body type" />
        </Form.Item>

        <Form.Item label="Body Types" name="body_types" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select Body Types"
            options={bodyTypes?.map(({ id: value, name: label }) => ({ label, value }))}
            mode="multiple"
          />
        </Form.Item>

        <Form.Item label="Brand" name="brand" rules={[{ required: true }]}>
          <Select showSearch placeholder="Select Brand" options={brands?.map(({ id: value, name: label }) => ({ label, value }))} />
        </Form.Item>

        <Form.Item style={{ display: "none" }}>
          <Button id="submitBtn" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

function EditUser({ editOpen, setEditOpen, id, models, setId, api, getData, brands, bodyTypes }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "models");
    try {
      await pb.collection("models").delete(id);
      setEditOpen(false);
      setId(null);
      delSuccess();
      getData();
    } catch (err) {
      delError();
    }
  }
  function closeDrawer() {
    setEditOpen(false);
    editForm.resetFields();
  }
  async function handleSubmit(val) {
    let values = Object.fromEntries(Object.entries(val).filter(([v]) => val[v] != (null || "" || 0)));

    let userData = new FormData();
    for (var key in values) {
      if (key === "thumbnail") {
        if (values.thumbnail?.file) {
          userData.append("thumbnail", values?.thumbnail.file);
        } else if (!imageUrl) {
          userData.append("image", "");
        } else {
          userData.delete("image");
        }
      } else if (key === "body_types") {
        values?.body_types.map((bt) => {
          userData.append("body_types", bt);
        });
      } else {
        userData.append(key, values[key]);
      }
    }
    let [editSuccess, editError] = notification(api, "update", "body Types");
    try {
      await pb.collection("models").update(editRecord?.id, userData);
      editSuccess();
      setEditOpen(false);
      editForm.resetFields();
      setImageUrl(null);
      getData();
    } catch (error) {
      editError();
    }
  }

  function handleChange(info) {
    editForm.setFieldsValue({ thumbnail: info });
    getBase64(info.fileList[0].originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  }

  useEffect(() => {
    let res = models[models.findIndex((e) => e.id === id)];
    editForm.setFieldsValue(res);
    setEditRecord(res);
    setImageUrl(getImages(res?.id, res?.collectionName, res?.thumbnail));
  }, [id]);

  const footer = (
    <Popconfirm {...getPopMessage("Models")} onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Body Type
      </Button>
    </Popconfirm>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Drawer forceRender footer={footer} title={`Edit ${editRecord?.name}`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="thumbnail" label="Thumbnail">
          <Upload
            name="thumbnail"
            listType="picture-circle"
            className="avatar-uploader-slider"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
            fileList={[]}
            accept="image/jpeg, image/*"
            style={{ width: "100%" }}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%", height: 100, objectFit: "contain" }} /> : uploadButton}
          </Upload>
          {imageUrl && (
            <Button onClick={() => setImageUrl(null)} size="small" type="default" icon={<CloseOutlined />} style={{ width: 100 }}>
              Remove
            </Button>
          )}
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input size="large" placeholder="eg some Title" />
        </Form.Item>

        <Form.Item label="Body Types" name="body_types" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select Body Types"
            options={bodyTypes?.map(({ id: value, name: label }) => ({ label, value }))}
            mode="multiple"
          />
        </Form.Item>

        <Form.Item label="Brand" name="brand" rules={[{ required: true }]}>
          <Select showSearch placeholder="Select Brand" options={brands?.map(({ id: value, name: label }) => ({ label, value }))} />
        </Form.Item>

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Body Type
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
