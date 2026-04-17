"use client";
import { Button, Flex, Select, Tabs } from "antd";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import { Container } from "@/components/Utility";

import { useRouter } from "next/navigation";
import { BodyTypesCard } from "@/components/Common";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: y, label: String(y) };
});

const MILEAGE_OPTIONS = [10, 25, 50, 75, 100, 150, 200, 300].map((k) => ({
  value: k * 1000,
  label: `Under ${k.toLocaleString()}k km`,
}));

const SELLER_TYPE_OPTIONS = [
  { value: "dealership", label: "Dealership" },
  { value: "seller", label: "Private Seller" },
  { value: "user", label: "Individual" },
];

function AdvSearch({ bodyTypes, brands = [], models = [] }) {
  const [selectedBody, setSelectedBody] = useState(null);
  const router = useRouter();

  const brandOptions = useMemo(
    () => brands.map((b) => ({ value: b.id, label: b.name })),
    [brands]
  );

  function modelsForBrand(brandId) {
    if (!brandId) return [];
    return models
      .filter((m) => m.brand === brandId)
      .map((m) => ({ value: m.id, label: m.name }));
  }

  function NewCarsPane() {
    const [brand, setBrand] = useState(null);
    const [model, setModel] = useState(null);

    function handleBrandChange(val) {
      setBrand(val);
      setModel(null);
    }

    function search() {
      const params = new URLSearchParams();
      if (brand) params.set("brand", brand);
      if (model) params.set("model", model);
      if (selectedBody) params.set("body", selectedBody);
      const qs = params.toString();
      router.push(qs ? `/new/search?${qs}` : "/new/brand");
    }

    return (
      <Flex vertical gap={30} style={{ paddingTop: 30 }}>
        <div className={styles.bodyTypesList}>
          {bodyTypes.map((bt) => (
            <BodyTypesCard
              {...{ ...bt, selected: selectedBody, setSelected: setSelectedBody }}
              key={bt.id}
            />
          ))}
        </div>
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
              placeholder="Select Make"
              showSearch
              className={styles.select}
              value={brand || undefined}
              onChange={handleBrandChange}
              options={brandOptions}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              allowClear
            />
            <Select
              placeholder={brand ? "Select Model" : "Pick a make first"}
              showSearch
              className={styles.select}
              value={model || undefined}
              onChange={setModel}
              options={modelsForBrand(brand)}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              disabled={!brand}
              allowClear
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
            <Button className={styles.button} onClick={() => router.push("/new/search")}>
              Advance Search
            </Button>
            <Button onClick={search} className={styles.button} type="primary">
              Search Cars
            </Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  function UsedCarsPane() {
    const [brand, setBrand] = useState(null);
    const [model, setModel] = useState(null);
    const [maxMileage, setMaxMileage] = useState(null);
    const [minYear, setMinYear] = useState(null);
    const [sellerType, setSellerType] = useState(null);

    function handleBrandChange(val) {
      setBrand(val);
      setModel(null);
    }

    function search() {
      const params = new URLSearchParams();
      if (brand) params.set("brand", brand);
      if (model) params.set("model", model);
      if (maxMileage != null) params.set("maxMileage", maxMileage);
      if (minYear != null) params.set("minYear", minYear);
      if (sellerType) params.set("sellerType", sellerType);
      const qs = params.toString();
      router.push(qs ? `/used/search?${qs}` : "/used");
    }

    return (
      <div>
        <Flex
          align="center"
          justify="start"
          gap={10}
          wrap="wrap"
          style={{ paddingTop: 0, paddingBottom: 10 }}
          className={styles.contentWrapper}
        >
          <Select
            placeholder="Select Brand"
            showSearch
            className={styles.selectUsed}
            value={brand || undefined}
            onChange={handleBrandChange}
            options={brandOptions}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
          <Select
            placeholder={brand ? "Select Model" : "Pick a brand first"}
            showSearch
            className={styles.selectUsed}
            value={model || undefined}
            onChange={setModel}
            options={modelsForBrand(brand)}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            disabled={!brand}
            allowClear
          />
          <Select
            placeholder="Max Mileage"
            className={styles.selectUsed}
            value={maxMileage ?? undefined}
            onChange={setMaxMileage}
            options={MILEAGE_OPTIONS}
            allowClear
          />
          <Select
            placeholder="Min Year"
            className={styles.selectUsed}
            value={minYear ?? undefined}
            onChange={setMinYear}
            options={YEAR_OPTIONS}
            allowClear
          />
          <Select
            placeholder="Seller Type"
            className={styles.selectUsed}
            value={sellerType || undefined}
            onChange={setSellerType}
            options={SELLER_TYPE_OPTIONS}
            allowClear
          />
        </Flex>
        <Flex
          align="center"
          justify="end"
          gap={10}
          wrap="wrap"
          style={{ paddingTop: 10, paddingBottom: 10 }}
          className={styles.contentWrapper}
        >
          <Button className={styles.button} onClick={() => router.push("/used/search")}>
            Advance Search
          </Button>
          <Button className={styles.button} type="primary" onClick={search}>
            Search Cars
          </Button>
        </Flex>
      </div>
    );
  }

  const Items = [
    { key: 1, label: "New Cars", children: <NewCarsPane /> },
    { key: 2, label: "Used Cars", children: <UsedCarsPane /> },
  ];

  return (
    <Container className="advSearch">
      <div className={styles.searchwrapper}>
        <Tabs defaultActiveKey="1" size="small" items={Items} />
      </div>
    </Container>
  );
}

export default AdvSearch;
