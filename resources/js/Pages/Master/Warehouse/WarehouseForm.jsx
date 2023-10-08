import { CheckOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card, Form, Input, Select } from "antd"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import "../../../index.css"
import WarehouseContact from "./Components/WarehouseContact"
import axios from "axios"

const contactLists = [
  {
    key: 0,
    contact: null,
    status: 0,
  },
]

const WarehouseForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { warehouse_id } = useParams()
  const [detail, setDetail] = useState({})
  const [contacts, setContacts] = useState(contactLists)

  const [provinsi, setProvinsi] = useState([])
  const [kabupaten, setKabupaten] = useState([])
  const [kecamatan, setKecamatan] = useState([])
  const [kelurahan, setKelurahan] = useState([])
  const [warehouseTiktok, setWarehouseTiktok] = useState([])

  // loading
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingProvinsi, setLoadingProvinsi] = useState(false)
  const [loadingKabupaten, setLoadingKabupaten] = useState(false)
  const [loadingKecamatan, setLoadingKecamatan] = useState(false)
  const [loadingKelurahan, setLoadingKelurahan] = useState(false)

  const loadDetailBrand = () => {
    axios.get(`/api/master/warehouse/${warehouse_id}`).then((res) => {
      const { data } = res.data
      setDetail(data)
      form.setFieldsValue(data)

      if (data.users && data.users.length > 0) {
        const users = data.users.map((user, index) => {
          return {
            key: index,
            contact: {
              label: user.name,
              value: user.id,
            },
            status: 1,
          }
        })

        setContacts(users)
      }
    })
  }

  const loadWarehouseTiktok = () => {
    axios.get("/api/master/warehousetiktok").then((res) => {
      const { data } = res.data
      setWarehouseTiktok(data)
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
    if (detail?.provinsi_id) {
      loadKabupaten(detail?.provinsi_id)
    }
    if (detail?.kabupaten_id) {
      loadKecamatan(detail?.kabupaten_id)
    }
    if (detail?.kecamatan_id) {
      loadKelurahan(detail?.kecamatan_id)
    }
  }, [detail?.provinsi_id, detail?.kabupaten_id, detail?.kecamatan_id])

  useEffect(() => {
    loadProvinsi()
    loadDetailBrand()
    loadWarehouseTiktok()
  }, [])

  const onFinish = (values) => {
    setLoadingSubmit(true)
    const checkContact = contacts.every((contact) => contact.contact)
    if (!checkContact) {
      toast.error("Mohon lengkapi kontak")
      setLoadingSubmit(false)
      return
    }
    let formData = new FormData()

    formData.append("name", values.name)
    formData.append("location", values.location)
    formData.append("address", values.alamat)
    formData.append("status", 1)
    formData.append("telepon", values.telepon)
    formData.append("provinsi_id", values.provinsi_id)
    formData.append("kabupaten_id", values.kabupaten_id)
    formData.append("kecamatan_id", values.kecamatan_id)
    formData.append("kelurahan_id", values.kelurahan_id)
    formData.append("warehouse_tiktok_id", values.warehouse_tiktok_id)
    formData.append("kodepos", values.kodepos)
    const newContacts = contacts.map((contact) => {
      return {
        user_id: contact.contact.value,
        status: contact.status,
      }
    })
    formData.append("contacts", JSON.stringify(newContacts))

    const url = warehouse_id
      ? `/api/master/warehouse/save/${warehouse_id}`
      : "/api/master/warehouse/save"

    axios
      .post(url, formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoadingSubmit(false)
        return navigate("/master/warehouse")
      })
      .catch((err) => {
        const { message } = err.response.data
        setLoadingSubmit(false)
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleChangeCell = ({ value, dataIndex, key }) => {
    const newData = [...contacts]
    newData[key][dataIndex] = value
    if (value?.value) {
      newData[key]["contact"] = {
        label: value.label,
        value: value.value,
      }
      value = value.value
    }
    setContacts(newData)
  }

  const handleClickCell = ({ key, type }) => {
    const newData = [...contacts]
    if (type === "plus") {
      newData.push({
        key: newData.length,
        contact: null,
        status: 0,
      })
      setContacts(newData)
    } else if (type === "delete") {
      newData.splice(key, 1)
      setContacts(newData)
    }
  }

  return (
    <Layout
      title="Warehouse"
      href="/master/warehouse"
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
        <Card title="Warehouse Data">
          <div className="grid grid-cols-3 gap-4">
            {/* <Form.Item
              label="Warehouse Tiktok"
              name="sku_tiktok"
              rules={[
                {
                  required: true,
                  message: "Please input your Sku!",
                },
              ]}
            >
              <Select
                // mode="multiple"
                allowClear
                className="w-full"
                placeholder="Select Sku Tiktok"
              >
                {warehouseTiktok.map((item) => (
                  <Select.Option
                    key={item.tiktok_warehouse_id}
                    value={item.tiktok_warehouse_id}
                  >
                    {item.tiktok_warehouse_id} - {item.warehouse_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
          </div>
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                label="Warehouse Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Warehouse Name!",
                  },
                ]}
              >
                <Input placeholder="Ketik Warehouse Name" />
              </Form.Item>
              <Form.Item
                label="Warehouse Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Warehouse Name!",
                  },
                ]}
              >
                <Input placeholder="Ketik Warehouse Name" />
              </Form.Item>
              <Form.Item
                label="Warehouse Tiktok"
                name="warehouse_tiktok_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Warehouse Tiktok!",
                  },
                ]}
              >
                <Select
                  // mode="multiple"
                  allowClear
                  className="w-full"
                  placeholder="Select Warehouse Tiktok"
                >
                  {warehouseTiktok.map((item) => (
                    <Select.Option
                      key={item.tiktok_warehouse_id}
                      value={item.tiktok_warehouse_id}
                    >
                      {item.tiktok_warehouse_id} - {item.warehouse_name}
                    </Select.Option>
                  ))}
                </Select>
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
            <div className="col-md-6">
              <Form.Item
                label="Lokasi Warehouse"
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Please input your Warehouse Location!",
                  },
                ]}
              >
                <Input placeholder="Ketik Warehouse Location " />
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
            <div className="col-md-6">
              <Form.Item
                label="Nama Jalan"
                name="alamat"
                rules={[
                  {
                    required: true,
                    message: "Please input your Nama Jalan!",
                  },
                ]}
              >
                <Input />
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
                <Input type="number" />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                label="Telepon"
                name="telepon"
                rules={[
                  {
                    required: true,
                    message: "Please input your Telepon!",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </div>
          </div>
        </Card>
        <hr className="mt-4" />
        <Card title="Contact" className="mt-4">
          <WarehouseContact
            handleChangeCell={handleChangeCell}
            handleClickCell={handleClickCell}
            dataSource={contacts}
          />
        </Card>

        <div className="float-right mt-6">
          <button className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2">
            {loadingSubmit ? <LoadingOutlined /> : <CheckOutlined />}
            <span className="ml-2">Simpan</span>
          </button>
        </div>
      </Form>
    </Layout>
  )
}

export default WarehouseForm
