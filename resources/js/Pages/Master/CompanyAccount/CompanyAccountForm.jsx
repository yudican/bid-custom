import { LoadingOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons"
import { Card, Form, Input, Select, Upload } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import { getBase64 } from "../../../helpers"

const { TextArea } = Input

const CompanyAccountForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { company_account_id } = useParams()

  const [dataBrand, setDataBrand] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(false)
  const [fileList, setFileList] = useState(false)

  const [provinsi, setProvinsi] = useState([])
  const [kabupaten, setKabupaten] = useState([])
  const [kecamatan, setKecamatan] = useState([])
  const [kelurahan, setKelurahan] = useState([])

  // loading
  const [loading, setLoading] = useState(false)
  const [loadingProvinsi, setLoadingProvinsi] = useState(false)
  const [loadingKabupaten, setLoadingKabupaten] = useState(false)
  const [loadingKecamatan, setLoadingKecamatan] = useState(false)
  const [loadingKelurahan, setLoadingKelurahan] = useState(false)

  const loadDetailBrand = () => {
    axios
      .get(`/api/master/company-account/${company_account_id}`)
      .then((res) => {
        const { data } = res.data
        setImageUrl(data.account_logo_url)
        setDataBrand(data)
        form.setFieldsValue({
          ...data,
          code: data.account_code,
          name: data.account_name,
          email: data.account_email,
          phone: data.account_phone,
          address: data.account_address,
          description: data.account_description,
        })
      })
  }

  const loadProvinsi = () => {
    setLoadingProvinsi(true)
    axios
      .get("/api/master/provinsi")
      .then((res) => {
        setProvinsi(res.data.data)
        setLoadingProvinsi(false)
      })
      .catch((err) => setLoadingProvinsi(false))
  }
  const loadKabupaten = (provinsi_id) => {
    setLoadingKabupaten(true)
    axios
      .get("/api/master/kabupaten/" + provinsi_id)
      .then((res) => {
        setKabupaten(res.data.data)
        setLoadingKabupaten(false)
      })
      .catch((err) => setLoadingKabupaten(false))
  }
  const loadKecamatan = (kabupaten_id) => {
    setLoadingKecamatan(true)
    axios
      .get("/api/master/kecamatan/" + kabupaten_id)
      .then((res) => {
        setKecamatan(res.data.data)
        setLoadingKecamatan(false)
      })
      .catch((err) => setLoadingKecamatan(false))
  }
  const loadKelurahan = (kelurahan_id) => {
    setLoadingKelurahan(true)
    axios
      .get("/api/master/kelurahan/" + kelurahan_id)
      .then((res) => {
        setKelurahan(res.data.data)
        setLoadingKelurahan(false)
      })
      .catch((err) => setLoadingKelurahan(false))
  }

  useEffect(() => {
    loadDetailBrand()
  }, [])

  useEffect(() => {
    loadProvinsi()
    if (dataBrand?.provinsi_id) {
      loadKabupaten(dataBrand?.provinsi_id)
    }
    if (dataBrand?.kabupaten_id) {
      loadKecamatan(dataBrand?.kabupaten_id)
    }
    if (dataBrand?.kecamatan_id) {
      loadKelurahan(dataBrand?.kecamatan_id)
    }
  }, [dataBrand?.provinsi_id, dataBrand?.kabupaten_id, dataBrand?.kecamatan_id])

  const handleChange = ({ fileList }) => {
    const list = fileList.pop()
    setImageLoading(true)
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setImageLoading(false)
        setImageUrl(url)
      })
      setFileList(list.originFileObj)
    }, 1000)
  }

  const onFinish = (values) => {
    setLoading(true)
    let formData = new FormData()
    if (fileList) {
      formData.append("account_logo", fileList)
    }

    formData.append("account_code", values.code)
    formData.append("account_phone", values.phone)
    formData.append("account_name", values.name)
    formData.append("account_email", values.email)
    formData.append("account_address", values.address)
    formData.append("provinsi_id", values.provinsi_id)
    formData.append("kabupaten_id", values.kabupaten_id)
    formData.append("kecamatan_id", values.kecamatan_id)
    formData.append("kelurahan_id", values.kelurahan_id)
    formData.append("kodepos", values.kodepos)
    formData.append("status", values.status)
    formData.append("account_description", values.description || null)

    const url = company_account_id ? `save/${company_account_id}` : "save"

    axios
      .post(`/api/master/company-account/${url}`, formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoading(false)
        return navigate("/master/company-account")
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoading(false)
      })
  }

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
  )

  return (
    <Layout title="Brand" href="/master/company-account">
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Card title="Brand Data">
          <div className="card-body row">
            <div className="col-md-6">
              <Form.Item
                label="Kode Company Account"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input your Kode Company Account!",
                  },
                ]}
              >
                <Input placeholder="Ketik Kode Company Account" />
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
                label="Nama Company Account"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Nama Company Account!",
                  },
                ]}
              >
                <Input placeholder="Ketik Nama Company Account" />
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

            <div className="col-md-6">
              <Form.Item
                label="Alamat Company Account"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your Alamat Company Account!",
                  },
                ]}
              >
                <Input placeholder="Ketik Alamat Company Account" />
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
                    const data = kelurahan.find((item) => item.pid === value)
                    form.setFieldValue("kodepos", data.zip)
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
                    required: false,
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
                    required: false,
                    message: "Please input Company Account Logo!",
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

      <div className="float-right mt-6">
        <button
          onClick={() => {
            loading ? null : form.submit()
          }}
          className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
          disabled={loading}
        >
          {loading ? <LoadingOutlined /> : <SaveOutlined />}
          <span className="ml-2">Simpan</span>
        </button>
      </div>
    </Layout>
  )
}

export default CompanyAccountForm
