"use client";

import { Col, Divider, Flex, Row, Spin } from "antd";
import { useState } from "react";

export default function Maps({ addresses }) {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  function getLat() {
    if (addresses.length) {
      if (addresses.length >= selected) {
        return addresses[selected];
      }
    } else {
      return { lat: 0, lng: 0 };
    }
  }
  let { lat, lng } = getLat();
  function onClick(i) {
    setSelected(i);
  }
  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: 400 }}>
        <Spin />
      </Flex>
    );
  }
  return (
    <Row gutter={20}>
      <Col xs={24} md={12}>
        <Map {...{ lat, lng }} />
      </Col>
      <Col xs={24} md={12}>
        {addresses.map((add, i) => {
          return (
            <>
              <Flex vertical gap={5} key={add.id} onClick={() => onClick(i)}>
                <span>{add.name}</span>
                <span>{add.address}</span>
              </Flex>
              {i + 1 < addresses.length && (
                <Divider style={{ margin: "10px 0" }} />
              )}
            </>
          );
        })}
      </Col>
    </Row>
  );
}

function Map({ lat, lng }) {
  return (
    <div id="embedded-map-display" style={{ height: 300, width: "100%" }}>
      <iframe
        style={{ height: "100%", width: "100%", border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?q=${lat},+${lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
      ></iframe>
    </div>
  );
}
