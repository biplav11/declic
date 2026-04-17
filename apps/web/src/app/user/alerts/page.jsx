"use client";
import { Container } from "@/components/Utility";
import { Button, Flex, List, Select } from "antd";
import Alert from "antd/es/alert/Alert";
import styles from "./page.module.scss";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import pb from "@/utlls/pocketbase";

export default function Page() {
  const handleChangeMake = (value) => {
    setSelectedMake(value);
    console.log(`selected ${value}`);
  };

  const handleChangeModel = (value) => {
    setSelectedModel(value);
    console.log(`selected ${value}`);
  };

  function handleClick() {
    setData([...data, `${selectedMake} ${selectedModel}`]);
  }

  const _data = ["Acura MDX", "Toyota 4Runner", "Audi Q5"];
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [data, setData] = useState(_data);

  useEffect(() => {
    pb.collection("brands")
      .getFullList({ requestKey: null })
      .then((res) => setBrands(res));
    pb.collection("models")
      .getFullList({ requestKey: null })
      .then((res) => setModels(res));
  }, []);

  return (
    <Container>
      <Alert
        message="Receive an email alert if a new ad matching the models you are looking for is posted."
        type="info"
        showIcon
      />
      <Flex align="center" justify="space-between" wrap="wrap">
        <Flex
          align="center"
          justify="start"
          gap={10}
          wrap="wrap"
          style={{ paddingTop: 20, paddingBottom: 10 }}
          className={styles.contentWrapper}
        >
          <Select
            value={selectedMake}
            placeholder="Select Make"
            showSearch
            className={styles.select}
            onChange={handleChangeMake}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            options={brands.map((item) => ({ value: item.name, label: item.name }))}
          />
          <Select
            value={selectedModel}
            placeholder="Select Model"
            showSearch
            className={styles.select}
            onChange={handleChangeModel}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            options={models.map((item) => ({ value: item.name, label: item.name }))}
          />
        </Flex>
        <Flex
          align="center"
          justify="start"
          gap={10}
          wrap="wrap"
          style={{ paddingTop: 20, paddingBottom: 10 }}
          className={styles.contentWrapper}
        >
          <Button className={styles.button} icon={<PlusOutlined />} onClick={handleClick}>
            Add New Alert
          </Button>
        </Flex>
      </Flex>
      <List
        size="large"
        header={<span className={styles.title}>Email Alerts List</span>}
        bordered
        dataSource={data}
        renderItem={(item, i) => (
          <List.Item
            key={item}
            actions={[
              <Button
                key={item}
                type="text"
                size="small"
                onClick={() => {
                  let _data = [...data].filter((val) => val !== data[i]);
                  setData(_data);
                }}
              >
                Delete
              </Button>,
            ]}
          >
            {item}
          </List.Item>
        )}
      />
    </Container>
  );
}
