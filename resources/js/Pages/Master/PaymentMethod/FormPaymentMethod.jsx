import {
  CheckOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Card, Form, Input, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/layout";
import RichtextEditor from "../../../components/RichtextEditor";
import { getBase64 } from "../../../helpers";
import "../../../index.css";

const FormPaymentMethod = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { payment_method_id } = useParams();

  const [parents, setParents] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(false);
  const [fileList, setFileList] = useState(false);

  const [typePembayaran, setTypePembayaran] = useState(null);
  const [paymentChannel, setPaymentChannel] = useState(null);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadDetailData = () => {
    axios.get(`/api/master/payment-method/${payment_method_id}`).then((res) => {
      const { data } = res.data;
      setImageUrl(data.logo);
      setTypePembayaran(data.payment_type);
      setPaymentChannel(data.payment_channel);
      setParentId(data.parent_id);
      form.setFieldsValue(data);
    });
  };

  const getParents = () => {
    axios.get(`/api/master/payment-method-parents`).then((res) => {
      const { data } = res.data;
      setParents(data);
    });
  };

  useEffect(() => {
    getParents();
    loadDetailData();
  }, []);

  const handleChange = ({ fileList }) => {
    const list = fileList.pop();
    setImageLoading(true);
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setImageLoading(false);
        setImageUrl(url);
      });
      setFileList(list.originFileObj);
    }, 1000);
  };

  const onFinish = (values) => {
    setLoadingSubmit(true);
    let formData = new FormData();
    if (fileList) {
      formData.append("logo_bank", fileList);
    }

    formData.append("nama_bank", values.nama_bank);
    formData.append("nomor_rekening_bank", values.nomor_rekening_bank);
    formData.append("nama_rekening_bank", values.nama_rekening_bank);
    formData.append("parent_id", values.parent_id);
    formData.append("payment_type", values.payment_type);
    formData.append("payment_channel", values.payment_channel);
    formData.append("payment_code", values.payment_code);
    formData.append("payment_va_number", values.payment_va_number);
    formData.append("status", values.status);

    const url = payment_method_id
      ? `/api/master/payment-method/save/${payment_method_id}`
      : "/api/master/payment-method/save";

    axios
      .post(url, formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoadingSubmit(false);
        return navigate("/master/payment-method");
      })
      .catch((err) => {
        const { message } = err.response.data;
        setLoadingSubmit(false);
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

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

  const isPaymentAuto = typePembayaran === "Otomatis" ? true : false;
  const isHavePaymentVaNumber =
    paymentChannel === "bank_transfer" || paymentChannel === "echannel";
  const canInputVaNumber = isPaymentAuto && isHavePaymentVaNumber && true;
  return (
    <>
      <Layout
        title="Tambah Data Payment Method"
        href="/master/payment-method"
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
          <Card title="Payment Method Data">
            <div className="card-body row">
              <div className="col-md-6">
                <Form.Item
                  label="Jenis Metode Pembayaran"
                  name="parent_id"
                  rules={[
                    {
                      required: false,
                      message: "Please input your Jenis Metode Pembayaran!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    className="w-full"
                    placeholder="Select Jenis Metode Pembayaran"
                    onChange={(e) => setParentId(e)}
                  >
                    {parents.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.nama_bank}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {parentId > 0 && (
                  <Form.Item
                    label="Type Pembayaran"
                    name="payment_type"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Type Pembayaran!",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      className="w-full"
                      placeholder="Select Payment Type"
                      onChange={(e) => {
                        setTypePembayaran(e);
                        if (e === "Manual") {
                          form.setFieldValue(
                            "payment_channel",
                            "bank_transfer"
                          );
                        } else {
                          form.setFieldValue("payment_channel", paymentChannel);
                        }
                      }}
                    >
                      <Select.Option key={1} value={"Otomatis"}>
                        Otomatis
                      </Select.Option>
                      <Select.Option key={0} value={"Manual"}>
                        Manual
                      </Select.Option>
                    </Select>
                  </Form.Item>
                )}
                {getPaymentCode(paymentChannel, typePembayaran).length > 0 && (
                  <Form.Item
                    label="Payment Code"
                    name="payment_code"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Payment Code!",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      className="w-full"
                      placeholder="Select Payment Code"
                    >
                      {getPaymentCode(paymentChannel, typePembayaran).map(
                        (item) => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.name}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                )}

                {canInputVaNumber && (
                  <Form.Item
                    label="Nomor Virtual Account"
                    name="payment_va_number"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Nomor Virtual Account!",
                      },
                    ]}
                  >
                    <Input placeholder="Ketik Nomor Virtual Account" />
                  </Form.Item>
                )}

                {typePembayaran === "Manual" && (
                  <Form.Item
                    label="Nama Rekening"
                    name="nama_rekening_bank"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Nama Rekening!",
                      },
                    ]}
                  >
                    <Input placeholder="Ketik Nama Rekening" />
                  </Form.Item>
                )}
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Nama Pembayaran"
                  name="nama_bank"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Nama Pembayaran!",
                    },
                  ]}
                >
                  <Input placeholder="Ketik Nama Pembayaran" />
                </Form.Item>
                {typePembayaran === "Otomatis" && (
                  <Form.Item
                    label="Payment Channel"
                    name="payment_channel"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Payment Channel!",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      className="w-full"
                      placeholder="Select Payment Channel"
                      onChange={(e) => setPaymentChannel(e)}
                    >
                      <Select.Option value="bank_transfer">
                        Bank transfer
                      </Select.Option>
                      <Select.Option value="echannel">echannel</Select.Option>
                      <Select.Option value="bca_klikpay">
                        Bca klikpay
                      </Select.Option>
                      <Select.Option value="bca_klikbca">
                        Bca klikbca
                      </Select.Option>
                      <Select.Option value="bri_epay">bri_epay</Select.Option>
                      <Select.Option value="gopay">gopay</Select.Option>
                      <Select.Option value="shopeepay">shopeepay</Select.Option>
                      <Select.Option value="qris">Qris</Select.Option>
                      <Select.Option value="mandiri_clickpay">
                        Mandiri Clickpay
                      </Select.Option>
                      <Select.Option value="cimb_clicks">
                        Cimb Clicks
                      </Select.Option>
                      <Select.Option value="danamon_online">
                        Danamon online
                      </Select.Option>
                      <Select.Option value="cstore">cstore</Select.Option>
                      <Select.Option value="cod_jne">cod jne</Select.Option>
                      <Select.Option value="cod_jxe">cod jxe</Select.Option>
                    </Select>
                  </Form.Item>
                )}

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Status!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    className="w-full"
                    placeholder="Select Status"
                  >
                    <Select.Option key={"1"} value={"1"}>
                      Active
                    </Select.Option>
                    <Select.Option key={"0"} value={"0"}>
                      Non Active
                    </Select.Option>
                  </Select>
                </Form.Item>

                {typePembayaran === "Manual" && (
                  <Form.Item
                    label="Nomor Rekening"
                    name="nomor_rekening_bank"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Nomor Rekening!",
                      },
                    ]}
                  >
                    <Input placeholder="Ketik Nomor Rekening" />
                  </Form.Item>
                )}
              </div>

              {parentId > 0 && (
                <div className="col-md-2">
                  <Form.Item
                    label="Logo Bank"
                    name="logo_bank"
                    rules={[
                      {
                        required: payment_method_id ? false : true,
                        message: "Please input Logo Bank!",
                      },
                    ]}
                  >
                    <Upload
                      name="logo_bank"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      multiple={false}
                      beforeUpload={() => false}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        imageLoading ? (
                          <LoadingOutlined />
                        ) : (
                          <img
                            src={imageUrl}
                            alt="avatar"
                            className="max-h-[100px] h-28 w-28 aspect-square"
                          />
                        )
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              )}
            </div>
          </Card>
        </Form>
      </Layout>

      <div className="card ">
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

const getPaymentCode = (channel = null, type = "Otomatis") => {
  if (type === "Otomatis") {
    switch (channel) {
      case "bank_transfer":
        return [
          {
            name: "BNI",
            value: "bni",
          },
          {
            name: "BRI",
            value: "bri",
          },
          {
            name: "BCA",
            value: "bca",
          },
        ];

      case "echannel":
        return [
          {
            name: "Mandiri",
            value: "mandiri",
          },
        ];
      case "cstore":
        return [
          {
            name: "Alfamart",
            value: "alfamart",
          },
          {
            name: "Indomart",
            value: "indomart",
          },
        ];

      default:
        return [];
    }
  }

  return [];
};

export default FormPaymentMethod;
