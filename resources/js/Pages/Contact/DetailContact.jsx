import {
  ArrowRightOutlined,
  DeleteOutlined,
  HomeFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tabs,
  Upload,
} from "antd"
import { Option } from "antd/lib/mentions"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { ReactComponent as InvoiceActiveIcon } from "../../Assets/Icons/fa6-solid_file-invoice-dollar.svg"
import { ReactComponent as TotalDebtIcon } from "../../Assets/Icons/flat-color-icons_debt.svg"
import { ReactComponent as TotalAmountIcon } from "../../Assets/Icons/jam_coin-f.svg"
import Layout from "../../components/layout"
import LoadingFallback from "../../components/LoadingFallback"
import {
  formatNumber,
  getBase64,
  getItem,
  getStatusLeadOrder,
  handleString,
  inArray,
  RenderIf,
} from "../../helpers"
import ModalContactLayer from "./Components/ModalContactLayer"
import {
  contactCaseHistory,
  contactTransaction,
  memberLayerList,
  orderLeadListColumn,
} from "./config"
import ContactAddress from "./ContactAddress"
import { ReactComponent as DepositoIcon } from "../../Assets/Icons/ri_luggage-deposit-fill.svg"
import { prospectListColumn } from "../Prospect/config"

const { TabPane } = Tabs

const DetailContact = () => {
  const [form] = Form.useForm()
  const params = useParams()
  const [activeTabKey, setActiveTabKey] = useState("1")
  const [detailContact, setDetailContact] = useState(null)
  const [transactionActive, setTransactionActive] = useState([])
  const [transactionHistory, setTransactionHistory] = useState([])
  const [contactDownlines, setContactDownlines] = useState([])
  const [orderLead, setOrderLead] = useState(null)
  const [prospectData, setProspectData] = useState([])
  const [orderLeadList, setOrderLeadList] = useState([])
  const [caseHistory, setCaseHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(false)
  const [fileList, setFileList] = useState(false)

  const loadDetailContact = () => {
    setLoading(true)
    axios.get(`/api/contact/detail/${params.user_id}`).then((res) => {
      const { data, order_lead, prospects } = res.data
      setActiveTabKey("1")
      setOrderLead(order_lead)
      setProspectData(prospects || [])
      const orderList =
        order_lead &&
        order_lead.list.map((item) => {
          return {
            ...item,
            contact: item.contact_name,
            sales: item.sales_name,
            created_by: item.created_by_name,
            payment_term: item.payment_term_name,
            amount_total: formatNumber(parseInt(item.amount)),
            created_on: moment(item.created_at).format("DD-MM-YYYY"),
            status: getStatusLeadOrder(item?.status),
          }
        })
      const downlines = data.contact_downlines.map((item) => {
        return {
          id: item.userData?.id,
          name: item.userData?.name,
          email: item.userData?.email,
          phone: item.userData?.phone,
        }
      })
      setContactDownlines(downlines)
      setOrderLeadList(orderList)
      setImageUrl(data.profile_photo_url)
      setDetailContact(data)
      setLoading(false)
    })
  }
  const handleBlaclist = () => {
    axios.get(`/api/contact/black-list/${params.user_id}`).then((res) => {
      const { message } = res.data
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      loadDetailContact()
    })
  }

  const loadTransaction = (type = "active") => {
    setLoading(true)
    axios
      .get(`/api/contact/detail/transaction/${type}/${params.user_id}`)
      .then((res) => {
        const { data } = res.data

        const newData = data.map((transaction) => {
          return {
            id: transaction.id,
            name: transaction?.user?.name,
            nominal: transaction.nominal,
            tanggal_transaksi: transaction.created_at,
            id_transaksi: transaction?.id_transaksi,
            payment_method: transaction?.payment_method?.nama_bank,
            status: transaction.status,
            status_delivery: transaction.status_delivery,
          }
        })
        type === "active"
          ? setTransactionActive(newData)
          : setTransactionHistory(newData)
        setLoading(false)
      })
  }

  const loadCasehistory = () => {
    setLoading(true)
    axios
      .get(`/api/contact/detail/case/history/${params.user_id}`)
      .then((res) => {
        const { data } = res.data

        const newData = data.map((caseItem) => {
          return {
            id: caseItem.id,
            title: caseItem.title,
            contact: caseItem.contact_user.name,
            type: caseItem.type_case.type_name,
            category: caseItem.category_case.category_name,
            priority: caseItem.priority_case.priority_name,
            created_by: caseItem.created_user.name,
            created_at: caseItem.created_at,
          }
        })
        setCaseHistory(newData)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadDetailContact()
  }, [])

  const handleChangeTab = (key) => {
    setActiveTabKey(key)

    switch (key) {
      case "2":
        loadTransaction("active")
        break

      case "3":
        loadTransaction("history")
        break

      case "4":
        loadCasehistory()
        break

      default:
        break
    }
  }

  const handleChange = ({ fileList }) => {
    const list = fileList.pop()
    setLoading(true)
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
      setFileList(list.originFileObj)
    }, 1000)
  }

  const onFinish = (value) => {
    let formData = new FormData()

    if (fileList) {
      formData.append("profile_image", fileList)
    }

    formData.append("user_id", detailContact.id)
    formData.append("name", value.name)
    formData.append("email", value.email)
    formData.append("telepon", value.telepon)
    formData.append("gender", value.gender)
    formData.append("password", value.password)
    formData.append("bod", value.bod.format("YYYY-MM-DD"))
    axios.post(`/api/contact/detail/update`, formData).then((res) => {
      const { data } = res.data
      loadDetailContact()
      setFileList(null)
      toast.success("Contact Berhasil Diupdate", {
        position: toast.POSITION.TOP_RIGHT,
      })
    })
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  )

  const { company, address_users, brand, user_created } = detailContact || {}
  const isBlacklist = detailContact?.status == 0 ? true : false

  // const show = getItem("role") != "adminsales" && getItem("role") != "admin";
  const show = !inArray(getItem("role"), [
    "adminsales",
    "leadsales",
    "warehouse",
  ])

  if (loading) {
    return (
      <Layout title="Detail" href="/contact/list">
        <LoadingFallback />
      </Layout>
    )
  }

  const handleSaveMember = (values) => {
    setLoading(true)
    axios
      .post(`/api/contact/downline/member/save/${values.user_id}`, values)
      .then((res) => {
        const { data } = res.data
        loadDetailContact()
        setFileList(null)
        toast.success("Member Berhasil Disimpan", {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoading(false)
      })
  }

  const deleteMember = (user_id) => {
    axios
      .post(`/api/contact/downline/member/delete/${user_id}`, {
        _method: "DELETE",
      })
      .then((res) => {
        toast.success("Data berhasil dihapus")
        loadDetailContact()
      })
      .catch((err) => {
        toast.error("Data gagal dihapus")
      })
  }

  return (
    <Layout title="Detail" href="/contact/list">
      <Tabs activeKey={activeTabKey} onChange={handleChangeTab}>
        <TabPane key={"1"} tab="Contact Info">
          <div className="row">
            <RenderIf isTrue={true}>
              <div className="row w-full pl-3">
                <div className="col-md-4">
                  <div className="card bg-gradient-to-r from-white via-white to-[#1595001F]/20">
                    <div className="p-3 border-b-[1px] border-b-[#159500]/50 flex justify-between">
                      <div className="flex items-center">
                        <TotalAmountIcon className="mr-2 h-6" />
                        <strong className="text-base font-semibold text-[#159500]">
                          Komisi
                        </strong>
                      </div>

                      <div>
                        <ArrowRightOutlined
                          onClick={() => setActiveTabKey("5")}
                          style={{
                            color: "#159500",
                          }}
                        />
                      </div>
                    </div>
                    <div className="card-body">
                      <strong className="text-[#159500] text-xl">
                        Rp. {formatNumber(orderLead?.total_invoice_amount)}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-gradient-to-r from-white via-white to-[#7B61FF]/20">
                    <div className="p-3 border-b-[1px] border-b-[#7B61FF]/50 flex justify-between">
                      <div className="flex items-center">
                        <InvoiceActiveIcon className="mr-2 h-6" />
                        <strong className="text-base font-semibold text-[#7B61FF]">
                          Stock Mitra
                        </strong>
                      </div>

                      <div>
                        <ArrowRightOutlined
                          onClick={() => setActiveTabKey("5")}
                          style={{
                            color: "#7B61FF",
                          }}
                        />
                      </div>
                    </div>
                    <div className="card-body">
                      <strong className="text-[#7B61FF] text-xl">
                        {formatNumber(orderLead?.total_invoice_active)}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-gradient-to-r from-white via-white to-[#fac014]/20">
                    <div className="p-3 border-b-[1px] border-b-[#fac014]/50 flex justify-between">
                      <div className="flex items-center">
                        <DepositoIcon
                          style={{ color: "#fac014" }}
                          className="mr-2 h-6"
                        />
                        <strong className="text-base font-semibold text-[#fac014]">
                          Deposito
                        </strong>
                      </div>

                      <div>
                        <ArrowRightOutlined
                          onClick={() => setActiveTabKey("5")}
                          style={{
                            color: "#fac014",
                          }}
                        />
                      </div>
                    </div>
                    <div className="card-body">
                      <strong className="text-[#fac014] text-xl">
                        {`Rp ${formatNumber(detailContact?.deposit)}`}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </RenderIf>

            <div className="col-md-4">
              <div
                className={`card card-profile ${getItem("text-style")}
              `}
              >
                <div className="card-header">
                  <div className="profile-picture">
                    <div className="avatar avatar-xl">
                      <img
                        src={detailContact?.profile_photo_url}
                        alt="..."
                        className="avatar-img rounded-circle"
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="user-profile text-center">
                    <div className="name flex justify-content-center align-items-center mb-3">
                      <img
                        src="https://img.icons8.com/color/48/000000/verified-badge.png"
                        style={{ height: 30 }}
                      />
                      <span>{detailContact?.name}</span>
                    </div>
                    <div className="job">{detailContact?.role?.role_name}</div>
                  </div>
                </div>
                <div
                  className={`p-0 
                   
                  `}
                >
                  <div className="list-group p-0 m-0">
                    <div
                      className={`list-group-item d-flex justify-content-between align-items-center`}
                    >
                      Libur
                      <Switch checked={isBlacklist} onChange={handleBlaclist} />
                    </div>
                    <div
                      className={`list-group-item d-flex justify-content-between align-items-center`}
                    >
                      Blacklist
                      <Switch checked={isBlacklist} onChange={handleBlaclist} />
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center ">
                      Create Date
                      <span>
                        {moment(detailContact?.created_at).format("DD-MM-YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td className="py-2">
                          <strong>Customer Code</strong>
                        </td>
                        <td>: {handleString(detailContact?.uid)}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>Email</strong>
                        </td>
                        <td>: {detailContact?.email}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>Birth of Date</strong>
                        </td>
                        <td>: {detailContact?.bod}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>Gender</strong>
                        </td>
                        <td>: {detailContact?.gender}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>Phone</strong>
                        </td>
                        <td>: {detailContact?.telepon}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>Brand</strong>
                        </td>
                        <td>: {brand?.name}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>Owner</strong>
                        </td>
                        <td>: {user_created?.name}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>No. NPWP</strong>
                        </td>
                        <td>: {handleString(company?.npwp)}</td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <strong>NPWP Name</strong>
                        </td>
                        <td>: {handleString(company?.npwp_name)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* company */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h1 className="text-lg text-bold ">Company Detail</h1>
                </div>
                <div className="card-body row">
                  <div className="col-md-6">
                    <table className="w-100" style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>Company Name</strong>
                          </td>
                          <td>: {handleString(company?.name)}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>Business Entity</strong>
                          </td>
                          <td>
                            : {handleString(company?.business_entity?.title)}
                          </td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>Company Email</strong>
                          </td>
                          <td>: {handleString(company?.email)}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>Company Phone</strong>
                          </td>
                          <td>: {handleString(company?.phone)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="w-100" style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>PIC Sales</strong>
                          </td>
                          <td>: {handleString(company?.pic_name)}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>PIC Phone</strong>
                          </td>
                          <td>: {handleString(company?.phone)}</td>
                        </tr>

                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>Owner Name</strong>
                          </td>
                          <td>: {handleString(company?.owner_name)}</td>
                        </tr>
                        <tr>
                          <td style={{ width: "50%" }} className="py-2">
                            <strong>Owner Phone</strong>
                          </td>
                          <td>: {handleString(company?.owner_phone)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* layer */}
            {inArray(company?.layer_type, ["distributor"]) && (
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header flex justify-between items-center">
                    <h1 className="text-lg text-bold ">Member</h1>
                    <ModalContactLayer
                      handleOk={(val) => handleSaveMember(val)}
                      user_id={params?.user_id}
                    />
                  </div>
                  <div className="card-body">
                    <Table
                      scroll={{ x: "max-content" }}
                      tableLayout={"auto"}
                      dataSource={contactDownlines}
                      columns={[
                        ...memberLayerList,
                        {
                          title: "Action",
                          dataIndex: "id",
                          key: "id",
                          render: (text, record) => {
                            return (
                              <div className="flex items-center">
                                <Popconfirm
                                  title="Yakin Hapus Data ini?"
                                  onConfirm={() => deleteMember(record.id)}
                                  okText="Ya, Hapus"
                                  cancelText="Batal"
                                >
                                  <button className="text-white bg-red-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2">
                                    <DeleteOutlined />
                                  </button>
                                </Popconfirm>
                              </div>
                            )
                          },
                        },
                      ]}
                      pagination={false}
                      rowKey="id"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* address */}
            <div className="col-md-12">
              <ContactAddress
                data={address_users}
                contact={detailContact}
                refetch={() => loadDetailContact()}
              />
            </div>
          </div>
        </TabPane>
        <TabPane tab="Active Transaction" key="2">
          <Table
            dataSource={transactionActive}
            columns={contactTransaction}
            // loading={loading}
            pagination={false}
            rowKey="id"
            scroll={{ x: "max-content" }}
            tableLayout={"auto"}
          />
        </TabPane>
        <TabPane tab="History Transaction" key="3">
          <Table
            dataSource={transactionHistory}
            columns={contactTransaction}
            // loading={loading}
            pagination={false}
            rowKey="id"
            scroll={{ x: "max-content" }}
            tableLayout={"auto"}
          />
        </TabPane>
        <TabPane tab="History Prospect" key="4">
          <Table
            dataSource={prospectData}
            columns={prospectListColumn}
            // loading={loading}
            pagination={false}
            rowKey="id"
            scroll={{ x: "max-content" }}
            tableLayout={"auto"}
          />
        </TabPane>
        {show && (
          <TabPane tab="Setting Profile" key="5">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              initialValues={{
                name: detailContact?.name,
                email: detailContact?.email,
                telepon: detailContact?.telepon,
                gender: detailContact?.gender,
                bod: moment(detailContact?.bod ?? new Date(), "YYYY-MM-DD"),
              }}
              onFinish={onFinish}
              //   onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
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
                <Input />
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
                <Input />
              </Form.Item>
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
                <Input />
              </Form.Item>
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
                  <Option value="Laki-Laki">Laki-Laki</Option>
                  <Option value="Perempuan">Perempuan</Option>
                </Select>
              </Form.Item>

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

              <Form.Item
                label="Profile Photo"
                name="profile_image"
                rules={[
                  {
                    required: detailContact?.profile_photo_path,
                    message: "Please input Photo!",
                  },
                ]}
              >
                <Upload
                  name="profile_image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  multiple={false}
                  beforeUpload={() => false}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    loading ? (
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

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <div className="col-md-12 ">
                <div className="float-right">
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </TabPane>
        )}
      </Tabs>
    </Layout>
  )
}

export default DetailContact
