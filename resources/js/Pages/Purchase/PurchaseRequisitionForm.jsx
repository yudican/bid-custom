import {
  DeleteOutlined,
  LoadingOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { Button, Card, Form, Input, Modal, Select, Table } from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import { getItem } from "../../helpers"
import { columns } from "./config"
import { searchUserApproval } from "./services"

const PurchaseRequisitionForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [formTambahData] = Form.useForm()
  const { purchase_requisition_id } = useParams()

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(0)
  const [productNeed, setProductNeed] = useState([])
  const [companyLists, setCompanyList] = useState([])
  const [termOfPayments, setTermOfPayments] = useState([])
  const [roles, setRoles] = useState([])
  const [approvalLists, setApprovalLists] = useState([])

  // modal state
  const [openTambahItem, setOpenTambahItem] = useState(false)

  const loadRole = () => {
    axios.get(`/api/master/role`).then((res) => {
      setRoles(res.data.data)
    })
  }

  const loadDetail = () => {
    setLoading(true)
    axios
      .get(`/api/purchase/purchase-requitition/${purchase_requisition_id}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        data.approval_leads.forEach((item) => {
          if (item.label === "Verified By") {
            form.setFieldsValue({
              verified_by: {
                label: item?.user_name,
                value: item?.user_value,
              },
              verified_role_id: item?.role_id,
            })
          }
          if (item.label === "Approved By") {
            form.setFieldsValue({
              approved_by: {
                label: item?.user_name,
                value: item?.user_value,
              },
              approved_role_id: item?.role_id,
            })
          }
          if (item.label === "Excecuted By") {
            form.setFieldsValue({
              executed_by: {
                label: item?.user_name,
                value: item?.user_value,
              },
              executed_role_id: item?.role_id,
            })
          }
        })
        const forms = {
          ...data,
          received_by: {
            label: data?.received_by_name,
            value: data?.received_by,
          },
        }
        const newItems = data?.items.map((item) => {
          return {
            ...item,
            subtotal: item.item_subtotal,
          }
        })
        setProductNeed(newItems)
        form.setFieldsValue(forms)
      })
      .catch((e) => setLoading(false))
  }

  const loadTop = () => {
    axios.get("/api/master/top").then((res) => {
      setTermOfPayments(res.data.data)
    })
  }

  const loadCompanyAccount = () => {
    axios.get("/api/master/company-account").then((res) => {
      setCompanyList(res.data.data)
    })
  }

  // load user
  const handleSearchUserApproval = async (e) => {
    return searchUserApproval(e).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id, role_id: result.role_id }
      })

      return newResult
    })
  }

  // debounced search
  const handleGetContact = () => {
    searchUserApproval(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id, role_id: result.role_id }
      })
      setApprovalLists(newResult)
    })
  }

  useEffect(() => {
    if (purchase_requisition_id) {
      loadDetail()
    }
    loadCompanyAccount()
    handleGetContact()
    loadTop()
    loadRole()
    form.setFieldsValue({
      currency_id: "Rp",
      company_account_id: getItem("account_id"),
    })
  }, [purchase_requisition_id])

  const onFinish = (values) => {
    setLoading(true)
    const approvals = [
      {
        user_id: values?.verified_by?.value,
        role_id: values?.verified_role_id,
        status: 0,
        label: "Verified By",
      },
      {
        user_id: values?.approved_by?.value,
        role_id: values?.approved_role_id,
        status: 0,
        label: "Approved By",
      },

      {
        user_id: values?.executed_by?.value,
        role_id: values?.executed_role_id,
        status: 0,
        label: "Excecuted By",
      },
    ]

    delete values.verified_by
    delete values.approved_by
    delete values.executed_by
    delete values.verified_role_id
    delete values.approved_role_id
    delete values.executed_role_id

    const url = purchase_requisition_id
      ? `/save/${purchase_requisition_id}`
      : "/save"
    axios
      .post(`/api/purchase/purchase-requitition${url}`, {
        ...values,
        approvals,
        items: productNeed,
        status,
        received_by: values?.received_by?.value,
        brand_id: 1,
      })
      .then((res) => {
        setLoading(false)
        toast.success("Data berhasil disimpan")
        navigate("/purchase/purchase-requisition")
      })
      .catch((e) => {
        setLoading(false)
        toast.error("Data gagal disimpan")
      })
  }
  return (
    <>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Layout
          title="Tambah Data Purchase Requisition"
          href="/purchase/purchase-requisition"
          // rightContent={rightContent}
        >
          <Card
            title="Informasi Purchase Requisition"
            extra={
              <div className="flex justify-end items-center">
                <strong>Status :</strong>
                <Button
                  type="outline"
                  size={"middle"}
                  style={{
                    marginLeft: 10,
                  }}
                >
                  Draft
                </Button>
              </div>
            }
          >
            <div className="row">
              <div className="col-md-12">
                <Form.Item
                  label="Account"
                  name="company_account_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input Account!",
                    },
                  ]}
                >
                  <Select placeholder="Silahkan pilih">
                    {companyLists.map((company) => (
                      <Select.Option key={company?.id} value={`${company.id}`}>
                        {company.account_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Vendor Code"
                  name="vendor_code"
                  rules={[
                    {
                      required: true,
                      message: "Please input Vendor Code!",
                    },
                  ]}
                >
                  <Input placeholder="Silahkan input vendor code.." />
                </Form.Item>

                <Form.Item
                  label="Payment Term"
                  name="payment_term_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Payment Term!",
                    },
                  ]}
                >
                  <Select placeholder="Silahkan pilih">
                    {termOfPayments.map((top) => (
                      <Select.Option key={top.id} value={top.id}>
                        {top.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Vendor Name"
                  name="vendor_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input Vendor Name!",
                    },
                  ]}
                >
                  <Input placeholder="Silahkan input vendor name.." />
                </Form.Item>
                <Form.Item
                  label="Currency ID"
                  name="currency"
                  rules={[
                    {
                      required: false,
                      message: "Please input your Currency ID!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Silahkan input.."
                    defaultValue={"Rp"}
                    disabled
                  />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item
                  label="Request by"
                  name="request_by_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input Type Po!",
                    },
                  ]}
                >
                  <Input placeholder="Silahkan input request name.." />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item
                  label="Request Email"
                  name="request_by_email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Email!",
                    },
                  ]}
                >
                  <Input placeholder="Silahkan input Request Email.." />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item
                  label="Request Division"
                  name="request_by_division"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Division!",
                    },
                  ]}
                >
                  <Input placeholder="Silahkan input Request Division.." />
                </Form.Item>
              </div>

              <div className="col-md-12">
                <Form.Item
                  requiredMark={"optional"}
                  label="Notes"
                  name="request_note"
                  rules={[
                    {
                      required: false,
                      message: "Please input your notes!",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Silahkan input catatan.."
                    showCount
                    maxLength={100}
                    rows={3}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </Layout>

        <div className="card p-4">
          <Card title="Informasi Approval">
            <div className="card-body grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Verified By"
                name="verified_by"
                rules={[
                  {
                    required: true,
                    message: "Please input Verified By!",
                  },
                ]}
              >
                <DebounceSelect
                  showSearch
                  placeholder="Cari Verified By"
                  fetchOptions={handleSearchUserApproval}
                  filterOption={false}
                  className="w-full"
                  defaultOptions={approvalLists}
                  onChange={(e) => {
                    const role = approvalLists.find(
                      (item) => item.value === e.value
                    )
                    form.setFieldValue("verified_role_id", role?.role_id)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Role (Automatic)"
                name="verified_role_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Role!",
                  },
                ]}
              >
                <Select disabled placeholder="Select Role">
                  {roles.map((role) => (
                    <Select.Option value={role.id} key={role.id}>
                      {role.role_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Approved By"
                name="approved_by"
                rules={[
                  {
                    required: true,
                    message: "Please input Approved By!",
                  },
                ]}
              >
                <DebounceSelect
                  showSearch
                  placeholder="Cari Approved By"
                  fetchOptions={handleSearchUserApproval}
                  filterOption={false}
                  className="w-full"
                  defaultOptions={approvalLists}
                  onChange={(e) => {
                    const role = approvalLists.find(
                      (item) => item.value === e.value
                    )
                    form.setFieldValue("approved_role_id", role?.role_id)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Role (Automatic)"
                name="approved_role_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Role!",
                  },
                ]}
              >
                <Select disabled placeholder="Select Role">
                  {roles.map((role) => (
                    <Select.Option value={role.id} key={role.id}>
                      {role.role_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Executed By"
                name="executed_by"
                rules={[
                  {
                    required: true,
                    message: "Please input Executed By!",
                  },
                ]}
              >
                <DebounceSelect
                  showSearch
                  placeholder="Cari Executed By"
                  fetchOptions={handleSearchUserApproval}
                  filterOption={false}
                  className="w-full"
                  defaultOptions={approvalLists}
                  onChange={(e) => {
                    const role = approvalLists.find(
                      (item) => item.value === e.value
                    )
                    form.setFieldValue("executed_role_id", role?.role_id)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Role (Automatic)"
                name="executed_role_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Role!",
                  },
                ]}
              >
                <Select disabled placeholder="Select Role">
                  {roles.map((role) => (
                    <Select.Option value={role.id} key={role.id}>
                      {role.role_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Card>
        </div>

        <div className="card p-4">
          <Card title="Informasi Penerimaan Item">
            <div className="card-body grid md:grid-cols-2 gap-4">
              <Form.Item
                label="Contact"
                name="received_by"
                rules={[
                  {
                    required: true,
                    message: "Please input Contact!",
                  },
                ]}
              >
                <DebounceSelect
                  showSearch
                  placeholder="Cari Contact"
                  fetchOptions={handleSearchUserApproval}
                  filterOption={false}
                  className="w-full"
                  defaultOptions={approvalLists}
                  onChange={(e) => {
                    const role = approvalLists.find(
                      (item) => item.value === e.value
                    )
                    form.setFieldValue("role_contact_id", role?.role_id)
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Role (Automatic)"
                name="role_contact_id"
                rules={[
                  {
                    required: false,
                    message: "Please input your Role!",
                  },
                ]}
              >
                <Select disabled placeholder="Select Role">
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
                      message: "Please input your alamat!",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Silahkan input catatan.."
                    showCount
                    maxLength={100}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>

        <div className="card p-4">
          <Card
            title={`Detail Item`}
            extra={
              <Button
                className="block"
                size="middle"
                onClick={() => {
                  setOpenTambahItem(true)
                }}
                style={{
                  backgroundColor: "#1890FF",
                  // color: "white",
                  // paddingLeft: 24,
                }}
                type="primary"
                icon={<PlusOutlined />}
              >
                Tambah Data
              </Button>
            }
          >
            <Table
              columns={[
                ...columns,
                {
                  title: "Action",
                  key: "operation",
                  fixed: "right",
                  width: 100,
                  render: (text, record, index) => (
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        const newData = [...productNeed]
                        newData.splice(index, 1)
                        setProductNeed(newData)
                      }}
                    >
                      <DeleteOutlined />
                    </Button>
                  ),
                },
              ]}
              dataSource={productNeed}
              scroll={{
                x: 1300,
              }}
            />
          </Card>
        </div>

        <div className="card p-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setStatus(5)
                setTimeout(() => {
                  form.submit()
                }, 1000)
              }}
              type="button"
              className={`text-blue-700 bg-white border hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
              disabled={loading}
            >
              {loading ? (
                <LoadingOutlined />
              ) : (
                <span className="">Simpan Sebagai Draft</span>
              )}
            </button>

            <button
              onClick={() => {
                setStatus(0)
                setTimeout(() => {
                  form.submit()
                }, 1000)
              }}
              type="button"
              className={`ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : <span className="">Simpan</span>}
            </button>
          </div>
        </div>

        <Modal
          title="Tambah Data Item"
          centered
          open={openTambahItem}
          // confirmLoading={confirmLoading}
          onCancel={() => {
            setOpenTambahItem(false)
          }}
          cancelText="Cancel"
          okText="Simpan"
          onOk={() => {
            setOpenTambahItem(false)
            formTambahData.submit()
          }}
          // cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { backgroundColor: "#1890FF" } }}
        >
          <Form
            form={formTambahData}
            name="basic"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={(e) => {
              const items = [...productNeed]
              items.push(e)
              setProductNeed(items)
            }}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 border-y py-4">
              {/* brand */}
              <Form.Item
                label="Nama Item"
                name="item_name"
                rules={[
                  {
                    required: true,
                    message: "Please input Item Name!",
                  },
                ]}
              >
                <Input placeholder="Input item.." />
              </Form.Item>

              {/* project name */}
              <Form.Item
                label="Qty"
                name="item_qty"
                rules={[
                  {
                    required: true,
                    message: "Please input Qty!",
                  },
                ]}
              >
                <Input
                  placeholder="Input Qty.."
                  style={{ textAlign: "center" }}
                  value={1}
                  addonBefore={
                    <MinusOutlined
                      onClick={() => {
                        const item_qty =
                          formTambahData.getFieldValue("item_qty")
                        if (item_qty > 1) {
                          formTambahData.setFieldsValue({
                            item_qty: item_qty - 1,
                          })
                        }
                      }}
                    />
                  }
                  addonAfter={
                    <PlusOutlined
                      onClick={() => {
                        const item_qty =
                          formTambahData.getFieldValue("item_qty")
                        if (item_qty > 1) {
                          formTambahData.setFieldsValue({
                            item_qty: parseInt(item_qty) + 1,
                          })
                        } else {
                          formTambahData.setFieldsValue({
                            item_qty: 2,
                          })
                        }
                      }}
                    />
                  }
                />
              </Form.Item>

              {/* request by */}
              <Form.Item
                label="UoM"
                name="item_unit"
                rules={[
                  {
                    required: true,
                    message: "Please input UoM!",
                  },
                ]}
              >
                <Input placeholder="Input Unit.." />
              </Form.Item>

              {/* harga satuan */}
              <Form.Item
                label="Harga Satuan"
                name="item_price"
                rules={[
                  {
                    required: true,
                    message: "Please input Harga Satuan!",
                  },
                ]}
              >
                <Input
                  addonBefore={<Form.Item noStyle>Rp</Form.Item>}
                  placeholder="0"
                  onChange={(e) => {
                    const { value } = e.target
                    const item_tax = formTambahData.getFieldValue("item_tax")
                    if (item_tax > 0) {
                      const subtotal = (item_tax * value) / 100
                      formTambahData.setFieldsValue({
                        subtotal: parseInt(value) + parseInt(subtotal),
                      })
                    } else {
                      formTambahData.setFieldsValue({
                        subtotal: value ? parseInt(value) : 0,
                      })
                    }
                  }}
                />
              </Form.Item>

              {/* tax */}
              <Form.Item
                label="TAX (%)"
                name="item_tax"
                rules={[
                  {
                    required: false,
                    message: "Please input TAX..",
                  },
                ]}
              >
                <Input
                  placeholder="Input TAX.."
                  onChange={(e) => {
                    const { value } = e.target
                    const item_price =
                      formTambahData.getFieldValue("item_price")
                    if (item_price > 0) {
                      const subtotal = (item_price * value) / 100
                      formTambahData.setFieldsValue({
                        subtotal: parseInt(item_price) + parseInt(subtotal),
                      })
                    }
                  }}
                />
              </Form.Item>

              {/* subtotal */}

              <Form.Item
                label="Sub Total (Auto)"
                name="subtotal"
                rules={[
                  {
                    required: true,
                    // message: "Please input Divisi!",
                  },
                ]}
              >
                <Input
                  addonBefore={<Form.Item noStyle>Rp</Form.Item>}
                  disabled
                  placeholder="0"
                />
              </Form.Item>

              {/* deskripsi */}
              <Form.Item
                className="md:col-span-2"
                requiredMark={"optional"}
                label="Deskripsi"
                name="item_note"
                rules={[
                  {
                    required: false,
                    message: "Please input Type Lead!",
                  },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={100}
                  rows={3}
                  placeholder="Silahkan input deskripsi.."
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </Form>
    </>
  )
}

export default PurchaseRequisitionForm
