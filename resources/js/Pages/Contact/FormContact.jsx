import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
} from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"
import { getBase64, handleString, pluck } from "../../helpers"
import ModalTautanTelegram from "./Components/ModalTautanTelegram"

const FormContact = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const params = useParams()
  const role = localStorage.getItem("role")
  const [brands, setBrands] = useState([])
  const [roles, setRoles] = useState([])
  const [contact, setContact] = useState([])
  const [bussinessEntity, setBussinnesEntity] = useState([])
  const [message, setMessage] = useState("")

  const [roleSelected, setRoleSelected] = useState(null)

  const [loading, setLoading] = useState({
    file_nib: false,
  })

  const [imageUrl, setImageUrl] = useState({
    file_nib: null,
  })

  const [fileList, setFileList] = useState({
    file_nib: null,
  })

  const loadBrand = () => {
    axios.get("/api/master/brand").then((res) => {
      setBrands(res.data.data)
    })
  }

  const loadDetailContact = () => {
    axios.get(`/api/contact/detail/${params?.user_id}`).then((res) => {
      const { data } = res.data
      setContact(data)
      setRoleSelected(data?.role?.role_type)
      form.setFieldsValue({
        ...data,
        bod: moment(data.bod ?? new Date(), "YYYY-MM-DD"),
        role_id: data?.role?.id,
        brand_id: pluck(data?.brands, "id"),
        company_name: handleString(data?.company?.name),
        company_email: handleString(data?.company?.email),
        company_telepon: handleString(data?.company?.phone),
        business_entity: data?.company?.business_entity?.id,
        owner_name: handleString(data?.company?.owner_name),
        pic_name: handleString(data?.company?.pic_name),
        owner_phone: handleString(data?.company?.owner_phone),
        pic_phone: handleString(data?.company?.pic_phone),
        company_address: handleString(data?.company?.address),
        layer_type: handleString(data?.company?.layer_type),
        npwp: handleString(data?.company?.npwp),
        npwp_name: handleString(data?.company?.npwp_name),
        nib: handleString(data?.company?.nib),
      })
    })
  }

  const loadBussinnesEntity = () => {
    axios.get("/api/master/bussiness-entity").then((res) => {
      setBussinnesEntity(res.data.data)
    })
  }

  const loadRole = () => {
    axios.get(`/api/master/role`).then((res) => {
      setRoles(res.data.data)
    })
  }

  const handleChange = ({ fileList, field }) => {
    const list = fileList.pop()
    setLoading({ ...loading, [field]: true })
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setLoading({ ...loading, [field]: false })
        setImageUrl({ ...imageUrl, [field]: url })
      })
      setFileList({ ...fileList, [field]: list.originFileObj })
    }, 1000)
  }

  useEffect(() => {
    loadDetailContact()
    loadBrand()
    loadBussinnesEntity()
    loadRole()
  }, [])

  const onFinish = (values) => {
    let formData = new FormData()
    if (fileList.file_nib) {
      formData.append("file_nib", fileList.file_nib)
    }

    if (params?.user_id) {
      formData.append("user_id", params?.user_id)
    }
    formData.append("bod", values.bod.format("YYYY-MM-DD"))
    formData.append("sales_channel", JSON.stringify(values.sales_channels))
    formData.append("name", values.name || null)
    formData.append("uid", values.uid || null)
    formData.append("telepon", values.telepon || null)
    formData.append("email", values.email || null)
    formData.append("gender", values.gender || null)
    formData.append("brand_id", values.brand_id || null)
    formData.append("role_id", values.role_id || null)
    formData.append("layer_type", values.layer_type || null)
    formData.append("company_name", values.company_name || null)
    formData.append("company_email", values.company_email || null)
    formData.append("npwp", values.npwp || null)
    formData.append("npwp_name", values.npwp_name || null)
    formData.append("company_telepon", values.company_telepon || null)
    formData.append("business_entity", values.business_entity || null)
    formData.append("owner_name", values.owner_name || null)
    formData.append("owner_phone", values.owner_phone || null)
    formData.append("nib", values.nib || null)
    formData.append("pic_name", values.pic_name || null)
    formData.append("pic_phone", values.pic_phone || null)
    formData.append("company_address", values.company_address || null)

    axios
      .post("/api/contact/save-contact", formData)
      .then((res) => {
        setMessage(res.data.message)
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        return navigate("/contact/list")
      })
      .catch((err) => {
        const { message, type } = err.response.data

        if (type === "company_email") {
          form.setFields([
            {
              name: "company_email",
              errors: ["company email has been registered"],
            },
          ])
        }

        if (type === "company_name") {
          form.setFields([
            {
              name: "company_name",
              errors: ["company name has been registered"],
            },
          ])
        }
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const disabledNotification = () => {
    axios
      .post("/api/contact/disabled-telegram", { user_id: contact?.id })
      .then((res) => {
        setMessage(res.data.message)
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        return loadDetailContact()
      })
      .catch((err) => {
        const { message, type } = err.response.data

        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const isTelegramVerified = contact?.telegram_chat_id ? true : false
  return (
    <Layout title="Tambah Contact Baru" href="/contact/list">
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Card title="User Info">
          <div className="card-body row">
            <div className="col-md-6">
              <Form.Item
                label="Nama lengkap"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your nama lengkap!",
                  },
                ]}
              >
                <Input placeholder="Ketik Nama Lengkap" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Customer Code"
                name="uid"
                rules={[
                  {
                    required: true,
                    message: "Please input your Customer Code!",
                  },
                ]}
              >
                <Input placeholder="Ketik Customer Code" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Telepon"
                name="telepon"
                rules={[
                  {
                    required: true,
                    message: "Please input your Telepon!",
                  },
                ]}
                tooltip={
                  "Untuk menggunakan notifikasi melalui telegram, anda perlu mendaftarkan nomor telepon anda ke telegram terlebih dahulu"
                }
                className="mb-2"
              >
                <Input placeholder="Ketik No Telepon" />
              </Form.Item>
              <ModalTautanTelegram
                checked={isTelegramVerified}
                data={contact}
                onDisabled={() => disabledNotification()}
              />
            </div>
            <div className="col-md-6">
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
                label="Jenis Kelamin"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please input your Jenis Kelamin!",
                  },
                ]}
              >
                <Select placeholder="Select Jenis Kelamin">
                  <Select.Option value="Laki-Laki">Laki-Laki</Select.Option>
                  <Select.Option value="Perempuan">Perempuan</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Birth of Date"
                name="bod"
                rules={[
                  {
                    required: true,
                    message: "Please input your Birth of Date!",
                  },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Brand"
                name="brand_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Brand!",
                  },
                ]}
              >
                <Select placeholder="Select Brand" mode="multiple">
                  {brands.map((brand) => (
                    <Select.Option value={brand.id} key={brand.id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Role"
                name="role_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Role!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Role"
                  onChange={(e) => {
                    const role = roles.find((role) => role.id === e)
                    setRoleSelected(role.role_type)
                  }}
                >
                  {roles.map((role) => (
                    <Select.Option value={role.id} key={role.id}>
                      {role.role_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {roleSelected === "agent" && (
              <div className="col-md-6">
                <Form.Item
                  label="Type Layer"
                  name="layer_type"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Type Layer!",
                    },
                  ]}
                >
                  <Select placeholder="Select Type Layer">
                    <Select.Option value={"distributor"}>
                      Main Mitra
                    </Select.Option>
                    <Select.Option value={"sub-distributor"}>
                      Sub Mitra
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
            )}
            <div className="col-md-6">
              <Form.Item
                label="Sales Tag"
                name="sales_channels"
                rules={[
                  {
                    required: true,
                    message: "Please input your Sales Channel!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  className="w-full mb-2"
                  placeholder="Select Sales Channel"
                >
                  <Select.Option value={"mitra"}>Mitra</Select.Option>
                  <Select.Option value={"distributor"}>
                    Distributor
                  </Select.Option>
                  <Select.Option value={"e-store"}>E-Store</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </Card>
        <Card title="Company Info" className="mt-2">
          <div className="card-body row">
            <div className="col-md-6">
              <Form.Item
                label="Company Name"
                name="company_name"
                rules={[
                  {
                    required: false,
                    message: "Please input your Company Name!",
                  },
                ]}
              >
                <Input placeholder="Ketik Company Name" />
              </Form.Item>
              <Form.Item
                label="Company Email"
                name="company_email"
                rules={[
                  {
                    required: false,
                    message: "Please input your Company Email!",
                  },
                  // {
                  //   message: "company email has been registered",
                  //   validator: (_, value) => {
                  //     if (message === "Company Email sudah terdaftar") {
                  //       return Promise.resolve();
                  //     } else {
                  //       return Promise.reject("Some message here");
                  //     }
                  //   },
                  // },
                ]}
              >
                <Input placeholder="Ketik Company Email" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="No. NPWP"
                name="npwp"
                rules={[
                  {
                    required: false,
                    message: "Please input your NPWP Number!",
                  },
                ]}
              >
                <Input placeholder="Ketik No. NPWP" />
              </Form.Item>
              <Form.Item label="Nama NPWP" name="npwp_name">
                <Input placeholder="Ketik Nama NPWP" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Company Telepon"
                name="company_telepon"
                rules={[
                  {
                    required: false,
                    message: "Please input your Company Telepon!",
                  },
                ]}
              >
                <Input placeholder="Ketik Owner Name" />
              </Form.Item>
              <Form.Item
                label="Business Entity"
                name="business_entity"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please input your Business Entity!",
                //   },
                // ]}
              >
                <Select placeholder="Select Business Entity">
                  {bussinessEntity.map((be) => (
                    <Select.Option value={be.id} key={be.id}>
                      {be.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Owner Name"
                name="owner_name"
                rules={[
                  {
                    required: false,
                    message: "Please input your Owner Name!",
                  },
                ]}
              >
                <Input placeholder="Ketik Owner Name" />
              </Form.Item>
              <Form.Item
                label="Owner Telepon"
                name="owner_phone"
                rules={[
                  {
                    required: false,
                    message: "Please input your Owner Telepon!",
                  },
                ]}
              >
                <Input placeholder="Ketik Owner Telepon" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item label="NIB" name="nib">
                <Input placeholder="Ketik NIB" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="file_nib"
                name="file_nib"
                rules={[
                  {
                    required: false,
                    message: "Please input file_nib!",
                  },
                ]}
              >
                <Upload
                  name="file_nib"
                  listType="picture-card"
                  className="avatar-uploader w-100"
                  showUploadList={false}
                  multiple={false}
                  beforeUpload={() => false}
                  onChange={(e) =>
                    handleChange({
                      ...e,
                      field: "file_nib",
                    })
                  }
                >
                  {imageUrl.file_nib ? (
                    loading.file_nib ? (
                      <LoadingOutlined />
                    ) : (
                      <img
                        src={imageUrl.file_nib}
                        alt="avatar"
                        style={{
                          height: 104,
                        }}
                      />
                    )
                  ) : (
                    <div style={{ width: "100%" }}>
                      {loading.file_nib ? (
                        <LoadingOutlined />
                      ) : (
                        <PlusOutlined />
                      )}
                      <div
                        style={{
                          marginTop: 8,
                          width: "100%",
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="PIC Name"
                name="pic_name"
                rules={[
                  {
                    required: false,
                    message: "Please input your PIC Name!",
                  },
                ]}
              >
                <Input placeholder="Ketik PIC Name" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="PIC Telepon"
                name="pic_phone"
                rules={[
                  {
                    required: false,
                    message: "Please input your PIC Telepon!",
                  },
                ]}
              >
                <Input placeholder="Ketik PIC Telepon" />
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item
                label="Company Address"
                name="company_address"
                rules={[
                  {
                    required: false,
                    message: "Please input your Company Address!",
                  },
                ]}
              >
                <TextArea placeholder="Ketik Company Address" />
              </Form.Item>
            </div>

            <div className="col-md-12 ">
              <div className="float-right">
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save Contact
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>
        </Card>
      </Form>
    </Layout>
  )
}

export default FormContact
