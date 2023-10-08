import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Form, Input, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/layout";
import { getBase64 } from "../../../helpers";
import CustomerList from "./Components/CustomerList";

const { TextArea } = Input;

const FormBrand = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { brand_id } = useParams();

  const costomerSupports = {
    key: 0,
    id: null,
    value: null,
    type: null,
    status: false,
  };
  const [listCustomerSuport, setListCustomerSuport] = useState([
    costomerSupports,
  ]);

  const [dataBrand, setDataBrand] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(false);
  const [fileList, setFileList] = useState(false);

  const [provinsi, setProvinsi] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [kelurahan, setKelurahan] = useState([]);

  // loading
  const [loadingProvinsi, setLoadingProvinsi] = useState(false);
  const [loadingKabupaten, setLoadingKabupaten] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingKelurahan, setLoadingKelurahan] = useState(false);

  const loadDetailBrand = () => {
    axios.get(`/api/master/brand/${brand_id}`).then((res) => {
      const { data } = res.data;
      const dataCs =
        data.brand_customer_support &&
        data.brand_customer_support.map((cs, index) => {
          return {
            ...cs,
            status: cs.status === "1" ? true : false,
            key: index,
          };
        });
      if (dataCs.length > 0) {
        setListCustomerSuport(dataCs);
      }
      setImageUrl(data.logo_url);
      setDataBrand(data);
      form.setFieldsValue(data);
    });
  };

  const loadProvinsi = () => {
    setLoadingProvinsi(true);
    axios
      .get("/api/master/provinsi")
      .then((res) => {
        setProvinsi(res.data.data);
        setLoadingProvinsi(false);
      })
      .catch((err) => setLoadingProvinsi(false));
  };
  const loadKabupaten = (provinsi_id) => {
    setLoadingKabupaten(true);
    axios
      .get("/api/master/kabupaten/" + provinsi_id)
      .then((res) => {
        setKabupaten(res.data.data);
        setLoadingKabupaten(false);
      })
      .catch((err) => setLoadingKabupaten(false));
  };
  const loadKecamatan = (kabupaten_id) => {
    setLoadingKecamatan(true);
    axios
      .get("/api/master/kecamatan/" + kabupaten_id)
      .then((res) => {
        setKecamatan(res.data.data);
        setLoadingKecamatan(false);
      })
      .catch((err) => setLoadingKecamatan(false));
  };
  const loadKelurahan = (kelurahan_id) => {
    setLoadingKelurahan(true);
    axios
      .get("/api/master/kelurahan/" + kelurahan_id)
      .then((res) => {
        setKelurahan(res.data.data);
        setLoadingKelurahan(false);
      })
      .catch((err) => setLoadingKelurahan(false));
  };

  useEffect(() => {
    loadDetailBrand();
  }, []);

  useEffect(() => {
    loadProvinsi();
    if (dataBrand?.provinsi_id) {
      loadKabupaten(dataBrand?.provinsi_id);
    }
    if (dataBrand?.kabupaten_id) {
      loadKecamatan(dataBrand?.kabupaten_id);
    }
    if (dataBrand?.kecamatan_id) {
      loadKelurahan(dataBrand?.kecamatan_id);
    }
  }, [
    dataBrand?.provinsi_id,
    dataBrand?.kabupaten_id,
    dataBrand?.kecamatan_id,
  ]);

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

  const handleChangeProductItem = ({ dataIndex, value, key }) => {
    const records = [...listCustomerSuport];
    records[key][dataIndex] = value;
    setListCustomerSuport(records);
  };

  const handleClickProductItem = ({ type, key }) => {
    const records = [...listCustomerSuport];
    if (type === "add") {
      const lastData = records[records.length - 1];
      records.push({
        key: lastData.key + 1,
        id: null,
        value: null,
        type: null,
        status: null,
      });

      return setListCustomerSuport(records);
    }

    if (type === "delete") {
      records.splice(key, 1);
      return setListCustomerSuport(records);
    }
  };

  const onFinish = (values) => {
    const csList = listCustomerSuport.every((item) => {
      if (item.value === null || item.type === null) {
        return false;
      }
      return true;
    });

    if (!csList) {
      return toast.error("Customer support tidak boleh kosong");
    }

    let formData = new FormData();
    if (fileList) {
      formData.append("logo", fileList);
    }

    formData.append("code", values.code);
    formData.append("phone", values.phone);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("twitter", values.twitter || "");
    formData.append("instagram", values.instagram || "");
    formData.append("facebook", values.facebook || "");
    formData.append("address", values.address);
    formData.append("provinsi_id", values.provinsi_id);
    formData.append("status", values.status);
    formData.append("kabupaten_id", values.kabupaten_id);
    formData.append("kecamatan_id", values.kecamatan_id);
    formData.append("kelurahan_id", values.kelurahan_id);
    formData.append("kodepos", values.kodepos);
    formData.append("description", values.description);
    formData.append("customerlist", JSON.stringify(listCustomerSuport));

    const url = brand_id
      ? `/api/master/brand/save/${brand_id}`
      : "/api/master/brand/save";
    console.log(formData, "formData");
    axios
      .post(url, formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        return navigate("/master/brand");
      })
      .catch((err) => {
        const { message } = err.response.data;
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
        <span className="ml-2">Simpan</span>
      </button>
    </div>
  );

  return (
    <Layout
      title="Brand"
      href="/master/brand"
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
        <Card title="Brand Data">
          <div className="card-body row">
            <div className="col-md-6">
              <Form.Item
                label="Kode Brand"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your Kode Brand!",
                  },
                ]}
              >
                <Input placeholder="Ketik Kode Brand" />
              </Form.Item>

              <Form.Item
                label="Telepon"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your Telepon!",
                  },
                ]}
              >
                <Input placeholder="Ketik No Telepon" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Nama Brand"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Nama Brand!",
                  },
                ]}
              >
                <Input placeholder="Ketik Nama Brand" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input placeholder="Ketik Email" />
              </Form.Item>
            </div>

            <div className="col-md-4">
              <Form.Item
                label="Link Twitter"
                name="twitter"
                rules={[
                  {
                    message: "Please input your Link Twitter!",
                  },
                ]}
              >
                <Input placeholder="Ketik Link Twitter" />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                label="Link Instagram"
                name="instagram"
                rules={[
                  {
                    message: "Please input your Link Instagram!",
                  },
                ]}
              >
                <Input placeholder="Ketik Link Instagram" />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                label="Link Facebook"
                name="facebook"
                rules={[
                  {
                    message: "Please input your Link Facebook!",
                  },
                ]}
              >
                <Input placeholder="Ketik Link Facebook" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Alamat Brand"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your Alamat Brand!",
                  },
                ]}
              >
                <TextArea placeholder="Ketik Alamat Brand" />
              </Form.Item>
              <Form.Item
                label="Provinsi"
                name="provinsi_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Provinsi!",
                  },
                ]}
              >
                <Select
                  loading={loadingProvinsi}
                  allowClear
                  className="w-full mb-2"
                  placeholder="Pilih Provinsi"
                  onChange={(value) => loadKabupaten(value)}
                >
                  {provinsi.map((item) => (
                    <Select.Option key={item.pid} value={item.pid}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
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
                <Select placeholder="Select Status">
                  <Select.Option value="1">Active</Select.Option>
                  <Select.Option value="0">Non Active</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Kabupaten"
                name="kabupaten_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Kabupaten!",
                  },
                ]}
              >
                <Select
                  allowClear
                  className="w-full mb-2"
                  placeholder="Pilih Kabupaten"
                  loading={loadingKabupaten}
                  onChange={(value) => loadKecamatan(value)}
                >
                  {kabupaten.map((item) => (
                    <Select.Option key={item.pid} value={item.pid}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Kecamatan"
                name="kecamatan_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Kecamatan!",
                  },
                ]}
              >
                <Select
                  allowClear
                  className="w-full mb-2"
                  placeholder="Pilih Kecamatan"
                  loading={loadingKecamatan}
                  onChange={(value) => loadKelurahan(value)}
                >
                  {kecamatan.map((item) => (
                    <Select.Option key={item.pid} value={item.pid}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                label="Kelurahan"
                name="kelurahan_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Kelurahan!",
                  },
                ]}
              >
                <Select
                  allowClear
                  className="w-full mb-2"
                  placeholder="Pilih Kelurahan"
                  loading={loadingKelurahan}
                  onChange={(value) => {
                    const data = kelurahan.find((item) => item.pid === value);
                    form.setFieldValue("kodepos", data.zip);
                  }}
                >
                  {kelurahan.map((item) => (
                    <Select.Option key={item.pid} value={item.pid}>
                      {item.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                label="Kode Pos"
                name="kodepos"
                rules={[
                  {
                    required: true,
                    message: "Please input your Kode Pos!",
                  },
                ]}
              >
                <Input placeholder="Ketik Kode Pos" />
              </Form.Item>
            </div>
            <div className="col-md-10">
              <Form.Item
                label="Deskripsi"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your Deskripsi!",
                  },
                ]}
              >
                <TextArea
                  placeholder="Ketik Deskripsi"
                  rows={3}
                  style={{ height: 106 }}
                />
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item
                label="Brand Logo"
                name="logo"
                rules={[
                  {
                    required: brand_id ? false : true,
                    message: "Please input Brand Logo!",
                  },
                ]}
              >
                <Upload
                  name="logo"
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
          </div>
        </Card>
      </Form>
      <Card title="Customer Support" className="mt-4">
        <CustomerList
          data={listCustomerSuport}
          handleChange={handleChangeProductItem}
          handleClick={handleClickProductItem}
          loading={false}
        />
      </Card>

      <div className="float-right mt-6">
        <button
          onClick={() => form.submit()}
          className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
        >
          <span className="ml-2">Simpan</span>
        </button>
      </div>
    </Layout>
  );
};

export default FormBrand;
