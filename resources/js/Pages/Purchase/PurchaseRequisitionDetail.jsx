import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  PrinterTwoTone,
  WarningFilled,
} from "@ant-design/icons"
import { Button, Card, Form, Input, Select, Table, Tag } from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"
import { formatNumber, inArray } from "../../helpers"
import ModalNotes from "./Components/ModalNotes"
import { renderStatusRequisitionComponent } from "./config"

const TableInformation = ({ title = "Company", value = "PT AIMI Group" }) => {
  return (
    <div>
      <tr>
        <td className="w-28 lg:w-36 ">
          <h3 className="font-semibold">{title}</h3>
        </td>
        <td className="w-4">:</td>
        <td>
          <h3>{value}</h3>
        </td>
      </tr>
    </div>
  )
}

const PurchaseRequisitionDetail = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { purchase_requisition_id } = useParams()
  const [loading, setLoading] = React.useState(false)
  const [loadingApprove, setLoadingApprove] = React.useState(false)
  const [detail, setDetail] = React.useState({})
  const role = localStorage.getItem("role")
  const [roles, setRoles] = useState([])

  const loadDetail = () => {
    setLoading(true)
    axios
      .get(`/api/purchase/purchase-requitition/${purchase_requisition_id}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        const newLeadApproval = data.approval_leads.map((item) => {
          return {
            ...item,
            show: inArray(role, [item.role_type]),
          }
        })
        setDetail({
          ...data,
          approval_leads: newLeadApproval,
        })
        const forms = {
          received_by_name: data.received_by_name,
          received_role_id: data.received_role_id,
          received_address: data.received_address,
        }

        form.setFieldsValue(forms)
      })
      .catch((e) => setLoading(false))
  }

  const approvePurchaseOrder = () => {
    setLoadingApprove(true)
    axios
      .post(
        `/api/purchase/purchase-requitition/approve/${purchase_requisition_id}`,
        {
          status: 1,
        }
      )
      .then((res) => {
        setLoadingApprove(false)
        toast.success("Approve Berhasil", {
          position: toast.POSITION.TOP_RIGHT,
        })
        loadDetail()
      })
      .catch((err) => {
        setLoadingApprove(false)
        toast.error("Approve Gagal", {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const rejectPurchaseOrder = () => {
    setLoadingApprove(true)
    axios
      .post(
        `/api/purchase/purchase-requitition/reject/${purchase_requisition_id}`,
        {
          status: 3,
        }
      )
      .then((res) => {
        setLoadingApprove(false)
        toast.success("Approve Berhasil", {
          position: toast.POSITION.TOP_RIGHT,
        })
        loadDetail()
      })
      .catch((err) => {
        setLoadingApprove(false)
        toast.error("Approve Gagal", {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleComplete = () => {
    axios
      .post(
        `/api/purchase/purchase-requitition/complete/${purchase_requisition_id}`
      )
      .then((res) => {
        setLoadingApprove(false)
        toast.success("Status Berhasil Diupdate")
        loadDetail()
      })
      .catch((err) => {
        setLoadingApprove(false)
        toast.error("Status Gagal Diupdate")
      })
  }

  const updateApprovalStatus = (approval_id, status) => {
    axios
      .post(
        `/api/purchase/purchase-requitition/approval/status/${approval_id}`,
        {
          status,
          purchase_requisition_id,
        }
      )
      .then((res) => {
        toast.success("Status Berhasil Diupdate Berhasil", {
          position: toast.POSITION.TOP_RIGHT,
        })
        loadDetail()
      })
      .catch((err) => {
        toast.error("Status Berhasil Diupdate Gagal", {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const loadRole = () => {
    console.log(role, "role")
    axios.get(`/api/master/role/${role}`).then((res) => {
      setRoles(res.data.data)
    })
  }

  useEffect(() => {
    loadRole()
    loadDetail()
  }, [])

  // const role = getItem("role")
  const isWaitingApproval = detail?.request_status === "0"
  const isFinance = inArray(role, [
    "finance",
    "lead_finance",
    "superadmin",
    "admin",
  ])
  const canApprove = isFinance && isWaitingApproval
  const canPrintPdf = inArray(role, [
    "finance",
    "purchasing",
    "superadmin",
    "lead_finance",
  ])
  const roleApproval =
    detail?.approval_leads?.map((item) => item.role_type) || []
  const canVerifOrder = inArray(role, [...roleApproval, "superadmin"])
  const canComplete = detail?.approval_count == 3
  const rightContent = (
    <div className="flex items-center">
      {canComplete && (
        <button
          onClick={() => handleComplete()}
          className="mr-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
          title="Reject"
        >
          <CheckOutlined className="md:mr-2" />{" "}
          <span className="hidden md:block">Complete</span>
        </button>
      )}
      {canApprove ? (
        <>
          <button
            onClick={() => rejectPurchaseOrder()}
            className="mr-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
            title="Reject"
          >
            <CloseOutlined className="md:mr-2" />{" "}
            <span className="hidden md:block">Reject</span>
          </button>

          <button
            onClick={() => approvePurchaseOrder()}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
            title="Reject"
          >
            {loadingApprove ? (
              <LoadingOutlined />
            ) : (
              <CheckCircleOutlined className="md:mr-2" />
            )}
            <span className="hidden md:block">Approve</span>
          </button>
        </>
      ) : null}
    </div>
  )

  return (
    <>
      <Layout
        title="Proses Data Purchase Requisition"
        href="/purchase/purchase-requisition"
        rightContent={rightContent}
      >
        <Card
          title="Informasi Purchase Requisition"
          extra={
            <div className="flex items-center">
              <div className="flex justify-end items-center">
                <strong className="mr-2">Status :</strong>
                {renderStatusRequisitionComponent(detail?.request_status)}
              </div>
              {canPrintPdf && (
                <a
                  href={"/purchase/purchase-requitition/print/" + detail?.id}
                  target="_blank"
                >
                  <Button className="ml-4" title="Reject">
                    <PrinterTwoTone />
                  </Button>
                </a>
              )}
            </div>
          }
        >
          <div className="card-body grid md:grid-cols-3 gap-4">
            <TableInformation
              title="Company"
              value={detail?.company_account_name}
            />
            <TableInformation title="Vendor Code" value={detail?.vendor_code} />
            <TableInformation title="Vendor Name" value={detail?.vendor_name} />
            <TableInformation
              title="Request by"
              value={detail?.request_by_name}
            />
            <TableInformation title="Currency ID" value={"Rp (Rupiah)"} />
            <TableInformation
              title="Payment Term"
              value={detail?.payment_term_name}
            />
            <TableInformation
              title="Role"
              value={detail?.request_by_division}
            />
            <TableInformation
              title="Created by"
              value={detail?.created_by_name || detail?.request_by_name}
            />
            <TableInformation
              title="Notes"
              value={<ModalNotes value={detail?.request_note || "-"} />}
            />

            {detail?.rejected_reason && (
              <div className="md:col-span-3 bg-red-50">
                <Tag
                  className="p-2 w-full"
                  icon={<WarningFilled />}
                  color="warning"
                >
                  Reject Reason : {detail?.rejected_reason}
                </Tag>
              </div>
            )}

            <div className="lg:col-span-3 mt-4">
              <h1 className="border-b-2  text-base font-medium pb-4 mb-4">
                Detail Item
              </h1>
              <Table
                // rowSelection={rowSelection}
                dataSource={detail?.items || []}
                columns={[
                  {
                    title: "No",
                    align: "center",
                    render: (text, record, index) => index + 1,
                  },
                  {
                    title: "Nama Item",
                    dataIndex: "item_name",
                    key: "item_name",
                  },
                  {
                    title: "UofM",
                    dataIndex: "item_unit",
                    key: "item_unit",
                  },
                  {
                    title: "Price",
                    dataIndex: "item_price",
                    key: "item_price",
                    render: (text, record, index) => {
                      return formatNumber(text, "Rp. ")
                    },
                  },
                  {
                    title: "Tax",
                    dataIndex: "item_tax",
                    key: "item_tax",
                  },
                  {
                    title: "Subtotal",
                    dataIndex: "item_subtotal",
                    key: "item_subtotal",
                    render: (text, record, index) => {
                      return formatNumber(text, "Rp. ")
                    },
                  },
                  {
                    title: "Notes",
                    dataIndex: "notes",
                    key: "notes",
                    render: (text, record, index) => {
                      return text ? text : "-"
                    },
                  },
                ]}
                loading={loading}
                pagination={false}
                rowKey="id"
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
              />
            </div>
          </div>
        </Card>
      </Layout>

      {canVerifOrder && (
        <div className="card p-4">
          <Card
            title={
              <div>
                <span className="mr-4">Informasi Approval</span>
              </div>
            }
          >
            <div className="row">
              <div className="col-md-12 mt-4">
                <Table
                  // rowSelection={rowSelection}
                  dataSource={detail?.approval_leads || []}
                  columns={[
                    {
                      title: "No",
                      align: "center",
                      render: (text, record, index) => index + 1,
                    },
                    {
                      title: "Approval",
                      dataIndex: "label",
                      key: "label",
                    },
                    {
                      title: "Contact",
                      dataIndex: "user_name",
                      key: "user_name",
                    },
                    {
                      title: "Role",
                      dataIndex: "role_name",
                      key: "role_name",
                    },
                    {
                      title: "Action",
                      dataIndex: "action",
                      key: "action",
                      render: (text, record, index) => {
                        if (record.show) {
                          if (record.status == 1) {
                            return <Tag color="green">Approved</Tag>
                          }
                          if (record.status == 2) {
                            return <Tag color="red">Rejected</Tag>
                          }
                          return (
                            <div>
                              <Button
                                size="small"
                                className="mr-2"
                                onClick={() =>
                                  updateApprovalStatus(record.id, 2)
                                }
                              >
                                <CloseOutlined style={{ color: "red" }} />
                              </Button>
                              <Button
                                size="small"
                                onClick={() =>
                                  updateApprovalStatus(record.id, 1)
                                }
                              >
                                <CheckOutlined style={{ color: "green" }} />
                              </Button>
                            </div>
                          )
                        } else {
                          if (record.status == 1) {
                            return <Tag color="green">Approved</Tag>
                          }
                          if (record.status == 2) {
                            return <Tag color="red">Rejected</Tag>
                          }
                          return <Tag color="gold">Waiting</Tag>
                        }
                      },
                    },
                  ]}
                  loading={loading}
                  pagination={false}
                  rowKey="id"
                  scroll={{ x: "max-content" }}
                  tableLayout={"auto"}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="card p-4">
        <Card title="Informasi Penerimaan Item">
          <Form form={form} layout="vertical">
            <div className="card-body grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Received By"
                name="received_by_name"
                rules={[
                  {
                    required: true,
                    message: "Please input Received By!",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Role (Automatic)"
                name="received_role_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Role!",
                  },
                ]}
              >
                <Select
                  disabled
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

              <div className="md:col-span-2">
                <Form.Item
                  requiredMark={"Automatic"}
                  label="Detail Alamat Penerima"
                  name="received_address"
                  rules={[
                    {
                      required: false,
                      message: "Please input your Warehouse!",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Silahkan input catatan.."
                    showCount
                    disabled
                    maxLength={100}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default PurchaseRequisitionDetail
