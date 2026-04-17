"use client";
import { Button, Flex, Select, Slider } from "antd";
import styles from "./index.module.scss";
import { useState } from "react";
import { BodyTypesCard } from "@/components/Common";
import { Container } from "@/components/Utility";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";

function AdvSearch({ bodyTypes }) {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  function TabPane1() {
    const [value, setValue] = useState([3000, 20000]);
    const [min, max] = [...value];
    function handleChange(value) {
      setValue(value);
    }
    return (
      <Flex vertical gap={30} style={{ paddingTop: 0 }}>
        <Flex
          align="center"
          justify="start"
          gap={10}
          wrap="wrap"
          style={{ paddingTop: 0, paddingBottom: 10 }}
          className={styles.contentWrapper}
        >
          <Select
            placeholder="Select Make"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Model"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Make"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Model"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Make"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Model"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Model"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Make"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Model"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
        </Flex>
        <div className={styles.bodyTypesList}>
          {bodyTypes.map((bt) => (
            <BodyTypesCard {...{ ...bt, selected, setSelected }} key={bt.id} />
          ))}
        </div>
        <Flex
          align="center"
          justify="start"
          gap={10}
          wrap="wrap"
          style={{ paddingTop: 0, paddingBottom: 10 }}
          className={styles.contentWrapper}
        >
          <Select
            placeholder="Select Make"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Model"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Make"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
          <Select
            placeholder="Select Model"
            showSearch
            className={styles.selectUsed}
            onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
        </Flex>
        <div>
          <span>
            PRICE: <span style={{ fontWeight: "bold" }}>{min}</span> to{" "}
            <span style={{ fontWeight: "bold" }}>{max}</span> USD
          </span>
          <Slider range defaultValue={[min, max]} min={0} max={50000} onAfterChange={handleChange} />
        </div>
        <Flex
          align="center"
          justify="start"
          gap={10}
          wrap="wrap"
          style={{ paddingTop: 20, paddingBottom: 10 }}
          className={styles.contentWrapper}
        >
          <Button className={styles.button}>Advance Search</Button>
          <Button onClick={() => router.push("/used/search")} className={styles.button} type="primary">
            Search Cars
          </Button>
        </Flex>
      </Flex>
    );
  }
  return (
    <Container className="advSearch">
      <div className={styles.searchwrapper}>
        <Title level={3} style={{ paddingTop: 10, fontWeight: 500 }}>
          Search Used Cars
        </Title>
        <TabPane1 />
      </div>
    </Container>
  );
}

export default AdvSearch;
