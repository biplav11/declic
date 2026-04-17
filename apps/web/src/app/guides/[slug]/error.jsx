"use client"; // Error components must be Client Components
import { Button, Result } from "antd";

export default function Error({ error }) {
    return (
        <Result
            status="500"
            title="500"
            subTitle={error.message}
            extra={<Button type="primary">Back Home</Button>}
        />
    );
}
