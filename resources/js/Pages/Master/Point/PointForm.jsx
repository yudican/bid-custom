import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { Card, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/layout";

const PointForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { master_point_id } = useParams();

  const [dataBrand, setDataBrand] = useState([]);
  const [typePoint, setTypePoint] = useState("product");

  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadDetailBrand = () => {
    axios.get(`/api/master/point/${master_point_id}`).then((res) => {
      const { data } = res.data;
      if (!data) {
        form.setFieldValue("type", "product");
      }
      form.setFieldsValue(data);
    });
  };

  const loadBrand = () => {
    setLoadingBrand(true);
    axios
      .get("/api/master/brand")
      .then((res) => {
        setDataBrand(res.data.data);
        setLoadingBrand(false);
      })
      .catch((err) => setLoadingBrand(false));
  };

  useEffect(() => {
    loadBrand();
    loadDetailBrand();
  }, []);

  const onFinish = (values) => {
    setLoadingSubmit(true);
    let formData = new FormData();

    formData.append("type", values.type);
    formData.append("point", values.point);
    formData.append("min_trans", values.min_trans);
    formData.append("max_trans", values.max_trans);
    formData.append("brand_id", JSON.stringify(values.brand_ids));
    formData.append("point", values.point);

    const url = master_point_id
      ? `/api/master/point/save/${master_point_id}`
      : "/api/master/point/save";

    axios
      .post(url, formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoadingSubmit(false);
        return navigate("/master/point");
      })
      .catch((err) => {
        const { message } = err.response.data;
        setLoadingSubmit(false);
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const rightContent = (
    <div className="flex justify-between items-center">
      <button
        onClick={() => form.submit()}
        className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        {loadingSubmit ? <LoadingOutlined /> : <CheckOutlined />}
        <span className="ml-2">Simpan</span>
      </button>
    </div>
  );

  return (
    <>
      <Layout
        title="Tambah Data Point"
        href="/master/point"
        // rightContent={rightContent}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Card title="Point Data">
            <div className="card-body ">
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input your Type!",
                  },
                ]}
              >
                <Select
                  allowClear
                  className="w-full mb-2"
                  placeholder="Select Type"
                  onChange={(value) => setTypePoint(value)}
                >
                  <Select.Option key={"product"} value={"product"}>
                    Per Product
                  </Select.Option>
                  <Select.Option key={"transaction"} value={"transaction"}>
                    Per Transaction
                  </Select.Option>
                </Select>
              </Form.Item>

              {typePoint === "product" ? (
                <>
                  <Form.Item
                    label="Point"
                    name="point"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Point!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Ketik Point" />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    label="Point"
                    name="point"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Point!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Ketik Point" />
                  </Form.Item>
                  <Form.Item
                    label="Minimum Transaction"
                    name="min_trans"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Minimum Transaction!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Ketik Minimum Transaction"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Max Transaction"
                    name="max_trans"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Max Transaction!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Ketik Max Transaction" />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Brand"
                name="brand_ids"
                rules={[
                  {
                    required: true,
                    message: "Please input your Brand!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  className="w-full mb-2"
                  placeholder="Select Brand"
                  loading={loadingBrand}
                >
                  {dataBrand.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Card>
        </Form>
      </Layout>

      <div className="card">
        <div className="card-body flex justify-end">
          <button
            onClick={() => form.submit()}
            className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
          >
            {loadingSubmit ? <LoadingOutlined /> : <CheckOutlined />}
            <span className="ml-2">Simpan</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PointForm;
