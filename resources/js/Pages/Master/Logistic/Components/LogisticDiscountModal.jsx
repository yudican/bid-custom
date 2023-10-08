import { TagOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Modal, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LogisticDiscountModal = ({ logisticId }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getDiscountSet = () => {
    axios
      .get("/api/master/shipping-method/logistic/rates/discount/" + logisticId)
      .then((res) => {
        const { data } = res.data;
        form.setFieldsValue({
          ...data,
          shipping_price_discount_start: moment(
            data.shipping_price_discount_start || new Date(),
            "YYYY-MM-DD HH:mm:ss"
          ),
          shipping_price_discount_end: moment(
            data.shipping_price_discount_end || new Date(),
            "YYYY-MM-DD HH:mm:ss"
          ),
        });
      });
  };

  const onFinish = (values) => {
    setConfirmLoading(true);
    axios
      .post("/api/master/shipping-method/logistic/rates/discount/save", {
        ...values,
        logistic_rate_id: logisticId,
        shipping_price_discount_start:
          values.shipping_price_discount_start.format("YYYY-MM-DD HH:mm:ss"),
        shipping_price_discount_end: values.shipping_price_discount_end.format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      })
      .then((res) => {
        setConfirmLoading(false);
        form.resetFields();
        setOpen(false);
        toast.success("Diskon Berhasil Di simpan");
      })
      .catch((err) => {
        setConfirmLoading(false);
        toast.error("Diskon gagal Di simpan");
      });
  };

  return (
    <div>
      <button
        onClick={() => {
          setOpen(true);
          getDiscountSet();
        }}
        className="text-white bg-[#008BE1] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
      >
        <TagOutlined />
        <span className="ml-2">Set Discount</span>
      </button>

      <Modal
        title="Set Discount"
        visible={open}
        onOk={() => {
          form.submit();
        }}
        cancelText={"Cancel"}
        onCancel={() => setOpen(false)}
        okText={"Save"}
        confirmLoading={confirmLoading}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Discount Amount"
            name="shipping_price_discount"
            rules={[
              {
                required: true,
                message: "Please input your Discount Amount!",
              },
            ]}
          >
            <Input type="number" placeholder="Ketik Discount Amount" />
          </Form.Item>
          <Form.Item
            label="Minimum Transaction"
            name="shipping_price_discount_start"
            rules={[
              {
                required: true,
                message: "Please input your Minimum Transaction!",
              },
            ]}
          >
            <DatePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            label="Max Transaction"
            name="shipping_price_discount_end"
            rules={[
              {
                required: true,
                message: "Please input your Max Transaction!",
              },
            ]}
          >
            <DatePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="shipping_price_discount_status"
            rules={[
              {
                required: true,
                message: "Please input your Status!",
              },
            ]}
          >
            <Select placeholder="Select Status">
              <Select.Option value="1">Active</Select.Option>
              <Select.Option value="0">Non Active</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LogisticDiscountModal;
