import {
  CheckOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  DownCircleFilled,
  FileExcelOutlined,
  LinkOutlined,
  LoadingOutlined,
  PrinterOutlined,
  PrinterTwoTone,
  RightOutlined,
} from "@ant-design/icons"
import { Dropdown, Form, Menu, Select, Steps, Table, message } from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingFallback from "../../components/LoadingFallback"
import ModalBillingOrder from "../../components/Modal/ModalBillingOrder"
import ModalOngkosKirim from "../../components/Modal/ModalOngkosKirim"
import ModalSplitDeliveryOrder from "../../components/Modal/ModalSplitDeliveryOrder"
import UpdateUniqueCode from "../../components/UpdateUniqueCode"
import Button from "../../components/atoms/Button"
import Layout from "../../components/layout"
import { RenderIf, formatNumber, getItem, inArray } from "../../helpers"
import ContactAddress from "../Contact/ContactAddress"
import ModalBillingReject from "../OrderLead/Components/ModalBillingReject"
import OrderDetailInfo from "./Components/OrderDetailInfo"
import Reminder from "./Components/Reminder"
import {
  activityColumns,
  billingColumns,
  negotiationsColumns,
  orderDeliveryColumns,
  productNeedListColumn,
  trackingListColumn,
} from "./config"

const { Step } = Steps

const OrderOnlineDetail = () => {
  const [form] = Form.useForm()
  const params = useParams()
  const userData = getItem("user_data", true)
  const [orderDetail, setDetailOrder] = useState(null)
  // console.log(orderDetail?.ethix_items, "ethix")
  const [warehouse, setWarehouse] = useState([])
  const [productNeed, setProductNeed] = useState([])
  const [billingData, setBilingData] = useState([])
  const [activityData, setActivityData] = useState([])
  const [negotiationsData, setNegotiationsData] = useState([])
  const [printUrl, setPrintUrl] = useState(null)
  const [taxs, setTaxs] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [notes, setNotes] = useState(null)
  const [loadingExport, setLoadingExport] = useState(false)
  const [orderDelivery, setOrderDelivery] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [reminders, setReminders] = useState([
    {
      key: 0,
      contact: null,
      before_7_day: false,
      before_3_day: false,
      before_1_day: false,
      after_7_day: false,
    },
  ])

  const [loading, setLoading] = useState(false)
  const [loadingWarehouse, setLoadingWarehouse] = useState(false)
  const loadDetailOrderLead = () => {
    setLoading(true)
    axios.get(`/api/order-manual/${params.uid_lead}`).then((res) => {
      const { data, print } = res.data
      setPrintUrl(print)
      setDetailOrder(data)
      setNotes(data.notes)
      const orderDeliveryNew = data?.order_delivery.map((item) => {
        return {
          ...item,
          product: item?.product_name,
        }
      })
      setOrderDelivery(orderDeliveryNew)
      if (data.reminders.length > 0) {
        const reminderData = data.reminders.map((reminder, index) => {
          return {
            key: index,
            reminder_id: reminder.id,
            contact: reminder.contactUser,
            before_7_day: reminder.before_7_day > 0 ? true : false,
            before_3_day: reminder.before_3_day > 0 ? true : false,
            before_1_day: reminder.before_1_day > 0 ? true : false,
            after_7_day: reminder.after_7_day > 0 ? true : false,
          }
        })
        setReminders(reminderData)
      }
      const dataBillings = data?.billings?.map((item) => {
        return {
          id: item.id,
          account_name: item.account_name,
          account_bank: item.account_bank,
          total_transfer: item.total_transfer,
          transfer_date: item.transfer_date,
          upload_billing_photo: item.upload_billing_photo_url,
          upload_transfer_photo: item.upload_transfer_photo_url,
          status: item.status,
          notes: item.notes ?? "-",
          approved_by_name: item.approved_by_name,
          approved_at: item.approved_at || "-",
          payment_number: item.payment_number || "-",
        }
      })
      const productNeeds =
        data.product_needs &&
        data.product_needs.map((item) => {
          let newData = {
            id: item.id,
            // product: item?.product?.name,
            // price: formatNumber(item?.prices?.final_price),
            // qty: item?.qty,
            // subtotal: formatNumber(item?.subtotal),
            // total_price: formatNumber(item?.total),
            // final_price: formatNumber(item?.price_nego),
            // tax_id: item?.tax_id,
            // discount_id: item?.discount_id,
            sku: item?.product?.sku,
            product: item?.product?.name || "-",
            product_id: item?.product_id,
            price: item?.prices?.final_price,
            qty: item?.qty,
            qty_delivery: item?.qty_delivery,
            total_price: item?.total,
            final_price: item?.final_price,
            margin_price: item?.margin_price,
            discount_id: item?.discount_id,
            tax_id: item?.tax_id,
            tax_amount: item?.tax_amount,
            price_nego: item?.price_nego,
            price_product: item?.price,
            total_price_nego: item?.price_nego * item?.qty,
            subtotal: item?.prices?.final_price * item?.qty,
            disabled_discount: item?.disabled_discount,
            disabled_price_nego: item?.disabled_price_nego,
            disabled: data?.status > 1 ? true : false,
            is_invoice: item?.is_invoice,
            print_si_url: item?.print_si_url,
          }

          return newData
        })
      setProductNeed(productNeeds)
      setBilingData(dataBillings)
      setActivityData(data?.lead_activities)
      setNegotiationsData(data?.negotiations)
      setLoading(false)
    })
  }

  const handleChangeProductItem = ({ dataIndex, value, id, index }) => {
    axios
      .post("/api/general/update-product-need", {
        value,
        field: dataIndex,
        uid_lead: params.uid_lead,
        item_id: id,
      })
      .then((res) => {
        const data = res.data
        const newData = [...productNeed]
        newData[index][dataIndex] = value
        setProductNeed(newData)
        message.success(data.message)
        loadDetailOrderLead(false)
      })
  }

  const loadWarehouse = () => {
    setLoadingWarehouse(true)
    axios.get(`/api/general/warehouse-user`).then((res) => {
      const { data } = res.data
      setWarehouse(data)
      setLoadingWarehouse(false)
    })
  }

  const assignWarehouse = () => {
    setLoading(true)
    axios
      .get(`/api/order-manual/assign-warehouse/${params.uid_lead}`)
      .then((res) => {
        setLoading(false)
        loadDetailOrderLead()
        message.success("Assign Warehouse Success")
      })
      .catch((err) => {
        const { data } = err.response
        setLoading(false)
        message.error(data.message)
      })
  }

  const loadTaxs = () => {
    axios.get("/api/master/taxs").then((res) => {
      setTaxs(res.data.data)
    })
  }

  const loadDiscounts = () => {
    axios.get("/api/master/discounts/sales-offline").then((res) => {
      setDiscounts(res.data.data)
    })
  }

  useEffect(() => {
    loadDetailOrderLead()
    loadWarehouse()
    loadTaxs()
    loadDiscounts()
  }, [])

  const handleChangeCell = ({ value, dataIndex, key, reminder_id }) => {
    const newData = [...reminders]
    newData[key][dataIndex] = value
    if (value?.value) {
      newData[key]["contact"] = {
        label: value.label,
        value: value.value,
      }
      value = value.value
    }
    setReminders(newData)
    axios
      .post(`/api/order-manual/reminder/update`, {
        field: dataIndex,
        value,
        reminder_id,
        uid_lead: params.uid_lead,
      })
      .then((res) => {
        // loadDetailOrderLead();
      })
      .catch((err) => {})
  }

  const handleAddReminder = () => {
    axios
      .post(`/api/order-manual/reminder/save`, {
        uid_lead: params.uid_lead,
      })
      .then((res) => {
        loadDetailOrderLead()
      })
      .catch((err) => {})
  }

  const handleClickCell = ({ key, type }) => {
    if (type === "plus") {
      handleAddReminder()
      if (reminders && reminders.length === 1) {
        const reminder = reminders.find((item) => !item.reminder_id)
        if (reminder) {
          handleAddReminder()
        }
      }
    } else if (type === "delete") {
      axios
        .get(`/api/order-manual/reminder/delete/${key}`)
        .then((res) => {
          loadDetailOrderLead()
        })
        .catch((err) => {})
    }
  }

  const handleChangeKurir = (courier) => {
    if (orderDetail?.courier !== courier) {
      axios
        .post(`/api/order-manual/change-courier`, {
          courier,
          uid_lead: orderDetail.uid_lead,
        })
        .then((res) => {
          loadDetailOrderLead()
          message.success("Berhasil mengubah kurir")
        })
        .catch((err) => {
          message.error("Gagal mengubah kurir")
        })
    }
  }
  const setClosed = () => {
    axios
      .get(`/api/order-manual/closed/${orderDetail.uid_lead}`)
      .then((res) => {
        loadDetailOrderLead()
        message.success("Order Lead berhasil di tutup")
      })
  }

  const updateNotes = () => {
    axios
      .post(`/api/general/order/update-notes`, {
        uid_lead: orderDetail.uid_lead,
        notes,
        type: "manual",
      })
      .then((res) => {
        message.success("Notes Berhasil Disimpan")
      })
  }

  const handleVerifyBilling = (value, status) => {
    const msg = status === 1 ? "Approve" : "Reject"
    axios
      .post(`/api/order-manual/billing/verify`, { status, ...value })
      .then((res) => {
        loadDetailOrderLead()
        message.success(`${msg} Billing Success`)
      })
      .catch((err) => {
        message.error(`${msg} Billing Failed`)
      })
  }

  const onFinishSaveResi = (values) => {
    // split-delivery-order
    axios
      .post("/api/order-manual/split-delivery-order", values)
      .then((res) => {
        message.success("Resi Berhasil Disimpan")
        loadDetailOrderLead()
      })
      .catch((err) => {
        message.error("Resi Gagal Disimpan")
      })
  }

  const insertInvoice = (id, multiple = false) => {
    if (multiple) {
      return axios
        .post(`/api/order-manual/product-need/invoice`, {
          is_invoice: 1,
          items: selectedRowKeys,
        })
        .then((res) => {
          loadDetailOrderLead()
          return message.success("Data Berhasil Disimpan")
        })
    } else {
      axios
        .post(`/api/order-manual/product-need/invoice/${id}`, {
          is_invoice: 1,
        })
        .then((res) => {
          loadDetailOrderLead()
          message.success("Data Berhasil Disimpan")
        })
    }
  }

  const summaries = [
    {
      label: "Sub Total",
      value: formatNumber(parseInt(orderDetail?.subtotal)),
    },
    {
      label: "Kode Unik",
      value: orderDetail?.kode_unik,
    },
    {
      label: "Ongkir",
      value: orderDetail?.ongkir,
    },
    {
      label: "Tax Total",
      value: formatNumber(parseInt(orderDetail?.tax_amount)),
    },
    {
      label: "Diskon",
      value: formatNumber(parseInt(orderDetail?.discount_amount)),
    },
    {
      label: "Total",
      value: formatNumber(parseInt(orderDetail?.amount)),
    },
  ]

  const SummaryItem = ({ item, disabled = false }) => {
    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}></Table.Summary.Cell>
        <Table.Summary.Cell index={1}></Table.Summary.Cell>
        <Table.Summary.Cell index={2}></Table.Summary.Cell>
        <Table.Summary.Cell index={3}></Table.Summary.Cell>
        <Table.Summary.Cell index={4}></Table.Summary.Cell>
        <Table.Summary.Cell index={5}></Table.Summary.Cell>
        <RenderIf isTrue={item.label === "Kode Unik"}>
          <Table.Summary.Cell index={6}>
            <UpdateUniqueCode
              item={item}
              order={orderDetail}
              refetch={loadDetailOrderLead}
              url={"/api/order-manual/update/kode-unik"}
              disabled={disabled}
            />
          </Table.Summary.Cell>
        </RenderIf>
        <RenderIf isTrue={item.label === "Ongkir"}>
          <Table.Summary.Cell index={6}>
            <ModalOngkosKirim
              disabled={disabled}
              initialValues={{
                ongkir: orderDetail.ongkir,
              }}
              refetch={loadDetailOrderLead}
              url={`/api/order-manual/update/ongkir/${orderDetail.uid_lead}`}
            />
          </Table.Summary.Cell>
        </RenderIf>
        <RenderIf isTrue={!inArray(item.label, ["Kode Unik", "Ongkir"])}>
          <Table.Summary.Cell index={6}>
            <strong>{item.label}</strong>
          </Table.Summary.Cell>
        </RenderIf>
        <Table.Summary.Cell index={7}>{item.value}</Table.Summary.Cell>
      </Table.Summary.Row>
    )
  }

  const show = !inArray(getItem("role"), [
    "adminsales",
    "leadwh",
    "leadsales",
    "leadcs",
    "warehouse",
  ])

  const billingActionColumn = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        if (record.status == 0) {
          if (orderDetail.amount_billing_approved > 0) {
            if (orderDetail.amount_billing_approved > orderDetail.amount) {
              return "-"
            }
          }
        }
        if (record.status == 2) {
          return (
            <div className="flex items-center justify-around">
              <button
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
                title="Approve"
              >
                Rejected
              </button>
            </div>
          )
        }
        if (record.status == 1) {
          return (
            <div className="flex items-center justify-around">
              <button
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
                title="Approve"
              >
                Approved
              </button>
            </div>
          )
        }
        if (!show) return null
        return (
          <div className="flex items-center justify-around">
            <ModalBillingReject
              handleClick={(value) =>
                handleVerifyBilling({ id: record.id, ...value }, 2)
              }
              user={userData}
            />
            <button
              onClick={() =>
                handleVerifyBilling(
                  {
                    id: record.id,
                    deposite: orderDetail.amount_deposite,
                    billing_approved: orderDetail.amount_billing_approved,
                    amount: orderDetail.amount,
                  },
                  1
                )
              }
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
              title="Approve"
            >
              <CheckOutlined />
            </button>
          </div>
        )
      },
    },
  ]

  const productNeedColumns = [
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text, record, index) => {
        // console.log(record, "record")
        return (
          <Select
            disabled={record.disabled}
            placeholder="Select Tax"
            value={record.tax_id}
            onChange={(e) =>
              handleChangeProductItem({
                value: e,
                dataIndex: "tax_id",
                id: record.id,
                index,
              })
            }
          >
            {taxs.map((tax) => (
              <Select.Option value={tax.id} key={tax.id}>
                {tax.tax_code}
              </Select.Option>
            ))}
          </Select>
        )
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text, record, index) => {
        return (
          <Select
            disabled={record.disabled || record.disabled_discount}
            placeholder="Select Discount"
            value={record.discount_id}
            onChange={(e) =>
              handleChangeProductItem({
                value: e,
                dataIndex: "discount_id",
                id: record.id,
                index,
              })
            }
          >
            {discounts.map((discount) => (
              <Select.Option value={discount.id} key={discount.id}>
                {discount.title}
              </Select.Option>
            ))}
          </Select>
        )
      },
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (text) => formatNumber(text),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (text) => formatNumber(text),
    },
  ]

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      .post(`/api/order-manual/export/detail/${params.uid_lead}`)
      .then((res) => {
        const { data } = res.data
        window.open(data)
        setLoadingExport(false)
      })
      .catch((e) => setLoadingExport(false))
  }

  const rightContent = (
    <div className="flex justify-between items-center">
      <button
        className="ml-3 text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2"
        onClick={() => handleExportContent()}
      >
        {loadingExport ? <LoadingOutlined /> : <FileExcelOutlined />}
        <span className="ml-2">Export</span>
      </button>
    </div>
  )

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      return setSelectedRowKeys(newSelectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: inArray(record.is_invoice, [1]), // Column configuration not to be checked
    }),
  }

  const {
    address_user,
    order_shipping,
    total_qty,
    total_qty_delivery,
    total_qty_payment,
  } = orderDetail || {}

  if (loading) {
    return (
      <Layout
        title="Detail"
        rightContent={rightContent}
        href="/order/order-manual"
      >
        <LoadingFallback />
      </Layout>
    )
  }

  return (
    <Layout
      title="Detail"
      rightContent={rightContent}
      href="/order/order-manual"
    >
      <Steps
        size="small"
        current={`${parseInt(orderDetail?.status) + 1}`}
        style={{ marginBottom: 16 }}
      >
        <Step title="Draft" />
        <Step title="New" />
        <Step title="Open" />
        <Step
          status={orderDetail?.status === "4" ? "error" : null}
          title={orderDetail?.status === "4" ? "Canceled" : "Closed"}
        />
      </Steps>

      {/* New */}
      <RenderIf isTrue={inArray(orderDetail?.status, ["1"])}>
        <div>
          <OrderDetailInfo order={orderDetail} printUrl={printUrl} />

          <ContactAddress
            title="Address Information"
            data={orderDetail?.contact_user?.address_users || []}
            contact={orderDetail?.contact_user}
            refetch={() => loadDetailOrderLead()}
          />

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Produk</h1>
              {/* <RenderIf isTrue={userData?.role.role_type !== "sales"}>
                <ModalInputResi
                  hasInputed={order_shipping}
                  onFinish={(values) => onFinishSaveResi(values)}
                  initialValues={order_shipping}
                  fields={{ uid_lead: orderDetail?.uid_lead }}
                />
              </RenderIf> */}
            </div>
            <div className="card-body">
              <table>
                <tbody>
                  <tr>
                    <td className="w-32 md:w-56">Order No</td>
                    <td className="w-4">:</td>
                    <td>{orderDetail?.order_number}</td>
                  </tr>
                  <tr>
                    <td className="w-32 md:w-56">Alamat</td>
                    <td className="w-4">:</td>
                    <td>{orderDetail?.selected_address}</td>
                  </tr>
                </tbody>
              </table>
              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                className="mb-4"
                dataSource={productNeed}
                columns={[...productNeedListColumn, ...productNeedColumns]}
                loading={loading}
                pagination={false}
                rowKey="id"
                summary={() => {
                  if (productNeed.length > 0) {
                    return (
                      <>
                        {summaries.map((item, index) => (
                          <SummaryItem item={item} key={index} />
                        ))}
                      </>
                    )
                  }

                  return null
                }}
              />

              <RenderIf
                isTrue={
                  userData?.role.role_type !== "sales" &&
                  (userData?.role.role_type === "adminsales" ||
                    userData?.role.role_type === "leadwh" ||
                    userData?.role.role_type === "leadsales" ||
                    userData?.role.role_type === "superadmin")
                }
              >
                <p>
                  Silahkan pilih PIC kurir untuk pengiriman sales order dibawah
                  ini:
                </p>
                <div>
                  <label htmlFor="" className="text-bold mb-2">
                    PIC Warehouse
                  </label>
                  <Select
                    loading={loadingWarehouse}
                    allowClear
                    className="w-full mb-2"
                    placeholder="Select Kurir"
                    onChange={(e) => handleChangeKurir(e)}
                    value={orderDetail?.courier}
                  >
                    {warehouse &&
                      warehouse.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item?.name}
                        </Select.Option>
                      ))}
                  </Select>
                  <small>
                    <i>
                      Anda dapat melakukan perubahan saat data belum masuk ke
                      dalam proses assign to warehouse
                    </i>
                  </small>
                </div>
              </RenderIf>
            </div>
          </div>

          {/* informasi pengiriman */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Pengiriman</h1>
              <RenderIf isTrue={userData?.role.role_type !== "sales"}>
                <ModalSplitDeliveryOrder
                  onFinish={(values) => onFinishSaveResi(values)}
                  fields={{ uid_lead: orderDetail?.uid_lead }}
                  products={productNeed.filter(
                    (item) => item.qty > item.qty_delivery
                  )}
                />
              </RenderIf>
            </div>
            <div className="card-body">
              <table className="mb-4">
                <tbody>
                  <tr>
                    <td className="w-32 md:w-56">Order No</td>
                    <td className="w-4">:</td>
                    <td>{orderDetail?.order_number}</td>
                  </tr>
                  <tr>
                    <td>Tipe Pengiriman</td>
                    <td>:</td>
                    <td>Normal</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{orderDetail?.selected_address}</td>
                  </tr>
                </tbody>
              </table>
              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                className="mb-4"
                dataSource={orderDelivery}
                columns={[
                  ...orderDeliveryColumns,
                  {
                    title: "Action",
                    key: "id",
                    align: "center",
                    fixed: "right",
                    width: 100,
                    render: (text, record) => (
                      <Dropdown.Button
                        style={{
                          width: 90,
                        }}
                        overlay={
                          <Menu
                            onClick={({ key }) => {
                              if (key === "print") {
                                return window.open(record?.print_sj_url)
                              }

                              if (key === "cancel") {
                                axios
                                  .get(
                                    `/api/order-lead/delivery/cancel/${record?.id}`
                                  )
                                  .then((res) => {
                                    loadDetailOrderLead()
                                    message.success(
                                      "Pengiriman berhasil di batalkan"
                                    )
                                  })
                                  .catch((err) => {
                                    message.error(
                                      "Pengiriman gagal di batalkan"
                                    )
                                  })
                              }
                            }}
                            itemIcon={<RightOutlined className="ml-8" />}
                            items={[
                              {
                                label: "Print SJ",
                                key: "print",
                                icon: <PrinterOutlined />,
                                disabled: record?.status === "cancel",
                              },
                              {
                                label: "Cancel",
                                key: "cancel",
                                icon: <CloseCircleOutlined />,
                                disabled: record?.status === "cancel",
                              },
                            ]}
                            // onContextMenu={(e) => {
                            //   console.log(e, "context menu");
                            //   console.log("Right Click", e.pageX, e.pageY);
                            // }}
                          />
                        }
                      ></Dropdown.Button>
                    ),
                  },
                ]}
                loading={loading}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>

          {/* <div className="card p-4">
            <Card title={"Ethix"}>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <Table
                    dataSource={orderDetail?.ethix_items || []}
                    columns={ethixColumns}
                    loading={loading}
                    pagination={false}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    tableLayout={"auto"}
                  />
                </div>
              </div>
            </Card>
          </div> */}

          <RenderIf
            isTrue={
              userData?.role.role_type !== "sales" &&
              (userData?.role.role_type === "adminsales" ||
                userData?.role.role_type === "leadwh" ||
                userData?.role.role_type === "leadsales" ||
                userData?.role.role_type === "superadmin")
            }
          >
            <div className="card">
              <div className="card-body">
                <p>Notes</p>
                <TextArea
                  // autoSize={{
                  //   minRows: 2,
                  //   maxRows: 6,
                  // }}
                  placeholder="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={updateNotes}
                />
              </div>
            </div>
          </RenderIf>

          {/* payment info */}
          {/* <PaymentDetail order={orderDetail} /> */}

          {/* submit */}
          {orderDetail?.status == 1 && (
            <RenderIf
              isTrue={
                userData?.role.role_type !== "sales" &&
                (userData?.role.role_type === "adminsales" ||
                  userData?.role.role_type === "leadwh" ||
                  userData?.role.role_type === "leadsales" ||
                  userData?.role.role_type === "superadmin")
              }
            >
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2 float-right"
                onClick={() => {
                  if (loading) {
                    return null
                  }

                  console.log(
                    orderDetail?.courier === null || !orderDetail?.courier,
                    "kurir warehouse"
                  )

                  if (orderDetail?.courier === null || !orderDetail?.courier) {
                    return message.error(
                      "Mohon Pilih PIC Warehouse Terlebih Dahulu"
                    )
                  }

                  return assignWarehouse()
                }}
                disabled={loading}
              >
                {loading && <LoadingOutlined />}
                Assign To Warehouses
              </button>
            </RenderIf>
          )}
        </div>
      </RenderIf>

      {/* Open */}
      <RenderIf isTrue={orderDetail?.status === "2"}>
        <div>
          <OrderDetailInfo order={orderDetail} printUrl={printUrl} />
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Produk</h1>
              {/* <RenderIf isTrue={userData?.role.role_type !== "sales"}>
                <ModalInputResi
                  hasInputed={order_shipping}
                  onFinish={(values) => onFinishSaveResi(values)}
                  initialValues={order_shipping}
                  fields={{ uid_lead: orderDetail?.uid_lead }}
                />
              </RenderIf> */}
            </div>
            <div className="card-body">
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "20%" }} className="text-bold">
                      Order No
                    </td>
                    <td>: {orderDetail?.order_number}</td>
                  </tr>
                  <tr>
                    <td className="text-bold">Tipe Pengiriman</td>
                    <td>: Normal</td>
                  </tr>
                  <tr>
                    <td className="text-bold">Alamat</td>
                    <td>: {orderDetail?.selected_address || "-"}</td>
                  </tr>
                  {order_shipping && (
                    <>
                      <tr>
                        <td>Pengirim</td>
                        <td>: {order_shipping?.sender_name}</td>
                      </tr>
                      <tr>
                        <td>Telfon Pengirim</td>
                        <td>: {order_shipping?.sender_phone}</td>
                      </tr>
                      <tr>
                        <td>Nama Ekspedisi</td>
                        <td>: {order_shipping?.expedition_name}</td>
                      </tr>
                      <tr>
                        <td>Resi</td>
                        <td>: {order_shipping?.resi}</td>
                      </tr>
                      {order_shipping?.attachment_url?.length > 0 && (
                        <tr>
                          <td>Attachment</td>
                          <td>
                            <span>: </span>
                            <a href={order_shipping?.attachment_url[0]}>
                              <LinkOutlined />
                              <span>Attachment 1</span>
                            </a>
                          </td>
                        </tr>
                      )}
                      {order_shipping?.attachment_url?.map((item, index) => {
                        if (index > 0) {
                          return (
                            <tr key={index}>
                              <td></td>
                              <td>
                                <span>: </span>
                                <a href={item}>
                                  <LinkOutlined />
                                  <span>Attachment {index + 1}</span>
                                </a>
                              </td>
                            </tr>
                          )
                        }
                      })}
                    </>
                  )}
                </tbody>
              </table>
              <div className="mt-4">
                <Table
                  scroll={{ x: "max-content" }}
                  tableLayout={"auto"}
                  dataSource={productNeed}
                  columns={[...productNeedListColumn, ...productNeedColumns]}
                  loading={loading}
                  pagination={false}
                  rowKey="id"
                  summary={() => {
                    if (productNeed.length > 0) {
                      return (
                        <>
                          {summaries.map((item, index) => (
                            <SummaryItem item={item} key={index} />
                          ))}
                        </>
                      )
                    }

                    return null
                  }}
                />
              </div>
            </div>
          </div>

          {/* informasi pengiriman */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Pengiriman</h1>
              <div className=" flex items-center space-x-2">
                <Button
                  label="Insert Invoice"
                  className={"mr-4"}
                  disabled={selectedRowKeys.length < 1}
                  onClick={() => insertInvoice(null, true)}
                />
                <RenderIf isTrue={userData?.role.role_type !== "sales"}>
                  <ModalSplitDeliveryOrder
                    onFinish={(values) => onFinishSaveResi(values)}
                    fields={{ uid_lead: orderDetail?.uid_lead }}
                    products={productNeed.filter(
                      (item) => item.qty > item.qty_delivery
                    )}
                  />
                </RenderIf>
              </div>
            </div>
            <div className="card-body">
              <table className="mb-4">
                <tbody>
                  <tr>
                    <td className="w-32 md:w-56">Order No</td>
                    <td className="w-4">:</td>
                    <td>{orderDetail?.order_number}</td>
                  </tr>
                  <tr>
                    <td>Tipe Pengiriman</td>
                    <td>:</td>
                    <td>Normal</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{orderDetail?.selected_address}</td>
                  </tr>
                </tbody>
              </table>
              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                className="mb-4"
                dataSource={orderDelivery}
                rowSelection={rowSelection}
                columns={[
                  ...orderDeliveryColumns,
                  {
                    title: "Action",
                    key: "id",
                    align: "center",
                    fixed: "right",
                    width: 100,
                    render: (text, record) => (
                      <Dropdown.Button
                        style={{
                          width: 90,
                        }}
                        overlay={
                          <Menu
                            onClick={({ key }) => {
                              if (key === "print") {
                                window.open(record?.print_sj_url)
                              }
                              if (key === "invoice") {
                                return insertInvoice(record.product_need_id)
                              }

                              if (key === "cancel") {
                                axios
                                  .get(
                                    `/api/order-lead/delivery/cancel/${record?.id}`
                                  )
                                  .then((res) => {
                                    loadDetailOrderLead()
                                    message.success(
                                      "Pengiriman berhasil di batalkan"
                                    )
                                  })
                                  .catch((err) => {
                                    message.error(
                                      "Pengiriman gagal di batalkan"
                                    )
                                  })
                              }
                            }}
                            itemIcon={<RightOutlined className="ml-8" />}
                            items={[
                              {
                                label: "Print SJ",
                                key: "print",
                                icon: <PrinterOutlined />,
                                disabled: record?.status === "cancel",
                              },
                              {
                                label: "Cancel",
                                key: "cancel",
                                icon: <CloseCircleOutlined />,
                                disabled: record?.status === "cancel",
                              },
                              {
                                label: "Invoice",
                                key: "invoice",
                                icon: <DownCircleFilled />,
                                disabled: record?.is_invoice == 1,
                              },
                            ]}
                            // onContextMenu={(e) => {
                            //   console.log(e, "context menu");
                            //   console.log("Right Click", e.pageX, e.pageY);
                            // }}
                          />
                        }
                      ></Dropdown.Button>
                    ),
                  },
                ]}
                loading={loading}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Invoice Pengiriman</h1>
            </div>
            <div className="card-body">
              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                className="mb-4"
                dataSource={productNeed.filter((item) => item.is_invoice == 1)}
                columns={[
                  ...productNeedListColumn,
                  {
                    title: "Action",
                    key: "id",
                    align: "center",
                    fixed: "right",
                    width: 100,
                    render: (text, record) => (
                      <Dropdown.Button
                        style={{
                          width: 90,
                        }}
                        overlay={
                          <Menu
                            onClick={({ key }) => {
                              if (key === "print") {
                                return window.open(record?.print_si_url)
                              }
                            }}
                            itemIcon={<RightOutlined className="ml-8" />}
                            items={[
                              {
                                label: "Print SI",
                                key: "print",
                                icon: <PrinterOutlined />,
                                disabled: record?.status === "cancel",
                              },
                            ]}
                            // onContextMenu={(e) => {
                            //   console.log(e, "context menu");
                            //   console.log("Right Click", e.pageX, e.pageY);
                            // }}
                          />
                        }
                      ></Dropdown.Button>
                    ),
                  },
                ]}
                loading={loading}
                pagination={false}
                rowKey="id"
                summary={(currentData) => {
                  const price = currentData.reduce(
                    (acc, curr) => parseInt(acc) + parseInt(curr.price),
                    0
                  )
                  const tax_amount = currentData.reduce(
                    (acc, curr) => parseInt(acc) + parseInt(curr.tax_amount),
                    0
                  )
                  const total = price + tax_amount

                  return (
                    <Table.Summary>
                      <Table.Summary.Row>
                        <Table.Summary.Cell align="right" colSpan={4}>
                          <strong>DPP :</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="left" colSpan={1}>
                          <strong>Rp. {formatNumber(price)}</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell />
                      </Table.Summary.Row>
                      <Table.Summary.Row>
                        <Table.Summary.Cell align="right" colSpan={4}>
                          <strong>PPN :</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="left" colSpan={1}>
                          <strong>Rp. {formatNumber(tax_amount)}</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell />
                      </Table.Summary.Row>
                      <Table.Summary.Row>
                        <Table.Summary.Cell align="right" colSpan={4}>
                          <strong>Total Amount (DPP + PPN) :</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="left" colSpan={1}>
                          <strong>Rp. {formatNumber(total)}</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell />
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                }}
              />
            </div>
          </div>

          {/* ethix */}
          {/* <div className="card p-4">
            <Card title={"Ethix"}>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <Table
                    dataSource={orderDetail?.ethix_items || []}
                    columns={ethixColumns}
                    loading={loading}
                    pagination={false}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    tableLayout={"auto"}
                  />
                </div>
              </div>
            </Card>
          </div> */}

          {/* Informasi Tracking */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Tracking</h1>
            </div>

            <div className="card-body">
              {/* <Steps progressDot direction="vertical" size="small" current={0}>
                {orderDetail?.ethix_items.reverse().map((row, index) => {
                  return (
                    <Step
                      key={index}
                      title={moment(row.created_at).format(
                        "ddd, DD MMM YYYY - LT"
                      )}
                      subTitle={row.description}
                    />
                  )
                })}
              </Steps> */}

              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                className="mb-4"
                dataSource={orderDetail?.ethix_items.reverse()}
                columns={[...trackingListColumn]}
                loading={loading}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>

          {/* payment info */}
          {/* <PaymentDetail order={orderDetail} /> */}

          {/* informasi penagihan */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-title">Informasi Penagihan</h1>
              <ModalBillingOrder
                detail={orderDetail}
                refetch={loadDetailOrderLead}
                user={userData}
              />
            </div>
            <div className="card-body">
              <Table
                dataSource={billingData}
                columns={
                  userData?.role?.role_type !== "sales"
                    ? [...billingColumns, ...billingActionColumn]
                    : [...billingColumns]
                }
                loading={loading}
                pagination={false}
                rowKey="id"
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
              />
            </div>
          </div>

          {/* reminders */}
          <Reminder
            handleChangeCell={handleChangeCell}
            handleClickCell={handleClickCell}
            dataSource={reminders}
          />

          <div className="card">
            <div className="card-body">
              <p>Notes</p>
              <TextArea
                // autoSize={{
                //   minRows: 2,
                //   maxRows: 6,
                // }}
                placeholder="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={updateNotes}
              />
            </div>
          </div>

          <RenderIf
            isTrue={
              userData?.role.role_type !== "sales" &&
              (userData?.role.role_type === "finance" ||
                userData?.role.role_type === "superadmin")
            }
          >
            <div className="card">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <p style={{ width: "60%" }}>
                    <i>
                      Pastikan Anda telah mendownload surat jalan dan melakukan
                      pengemasan terlebih dahulu untuk melanjutkan ke proses
                      Pengiriman Product
                    </i>
                  </p>
                  <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
                    onClick={() => {
                      const hasInvoiced = productNeed.every(
                        (item) => item.is_invoice > 0
                      )
                      if (!hasInvoiced) {
                        return toast.error(
                          "Pastikan Semua Barang Sudah Invoiced"
                        )
                      }

                      if (parseInt(total_qty_delivery) < parseInt(total_qty)) {
                        return toast.error(
                          "Pastikan Semua Barang Sudah Dikirim"
                        )
                      }

                      if (parseInt(total_qty_payment) < parseInt(total_qty)) {
                        return toast.error(
                          "Pastikan Semua Barang Sudah Ditagih"
                        )
                      }

                      return setClosed()
                    }}
                  >
                    <CreditCardOutlined />
                    <span className="ml-2">Payment Proccess</span>
                  </button>
                </div>
              </div>
            </div>
          </RenderIf>
        </div>
      </RenderIf>

      {/* Closed */}
      <RenderIf isTrue={orderDetail?.status === "3"}>
        <div>
          <OrderDetailInfo order={orderDetail} printUrl={printUrl} />
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-title">Lead Activity</h1>
              <div>
                <Dropdown.Button
                  style={{ borderRadius: 10 }}
                  icon={<PrinterTwoTone />}
                  overlay={
                    <Menu>
                      <Menu.Item className="flex justify-between items-center">
                        <PrinterTwoTone />{" "}
                        <a href={printUrl?.si} target="_blank">
                          <span>Print SI</span>
                        </a>
                      </Menu.Item>
                      <Menu.Item className="flex justify-between items-center">
                        <PrinterTwoTone />{" "}
                        <a href={printUrl?.so} target="_blank">
                          <span>Print SO</span>
                        </a>
                      </Menu.Item>
                      <Menu.Item className="flex justify-between items-center">
                        <PrinterTwoTone />{" "}
                        <a href={printUrl?.sj} target="_blank">
                          <span>Print SJ</span>
                        </a>
                      </Menu.Item>
                    </Menu>
                  }
                ></Dropdown.Button>
              </div>
            </div>
            <div className="card-body">
              <Table
                dataSource={activityData}
                columns={activityColumns}
                loading={loading}
                pagination={false}
                rowKey="id"
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h1 className="header-titl">Informasi Produk</h1>
            </div>
            <div className="card-body">
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "20%" }} className="text-bold">
                      Order No
                    </td>
                    <td>: {orderDetail?.order_number}</td>
                  </tr>
                  <tr>
                    <td className="text-bold">Tipe Pengiriman</td>
                    <td>: Normal</td>
                  </tr>
                  <tr>
                    <td className="text-bold">Alamat</td>
                    <td>: {address_user?.alamat_detail || "-"}</td>
                  </tr>
                  {order_shipping && (
                    <>
                      <tr>
                        <td>Pengirim</td>
                        <td>: {order_shipping?.sender_name}</td>
                      </tr>
                      <tr>
                        <td>Telfon Pengirim</td>
                        <td>: {order_shipping?.sender_phone}</td>
                      </tr>
                      <tr>
                        <td>Nama Ekspedisi</td>
                        <td>: {order_shipping?.expedition_name}</td>
                      </tr>
                      <tr>
                        <td>Resi</td>
                        <td>: {order_shipping?.resi}</td>
                      </tr>
                      {order_shipping?.attachment_url?.length > 0 && (
                        <tr>
                          <td>Attachment</td>
                          <td>
                            <span>: </span>
                            <a href={order_shipping?.attachment_url[0]}>
                              <LinkOutlined />
                              <span>Attachment 1</span>
                            </a>
                          </td>
                        </tr>
                      )}
                      {order_shipping?.attachment_url?.map((item, index) => {
                        if (index > 0) {
                          return (
                            <tr key={index}>
                              <td></td>
                              <td>
                                <span>: </span>
                                <a href={item}>
                                  <LinkOutlined />
                                  <span>Attachment {index + 1}</span>
                                </a>
                              </td>
                            </tr>
                          )
                        }
                      })}
                    </>
                  )}
                </tbody>
              </table>
              <div className="mt-4">
                <Table
                  scroll={{ x: "max-content" }}
                  tableLayout={"auto"}
                  dataSource={productNeed}
                  columns={[...productNeedListColumn, ...productNeedColumns]}
                  loading={loading}
                  pagination={false}
                  rowKey="id"
                  summary={() => {
                    if (productNeed.length > 0) {
                      return (
                        <>
                          {summaries.map((item, index) => (
                            <SummaryItem item={item} key={index} disabled />
                          ))}
                        </>
                      )
                    }

                    return null
                  }}
                />
              </div>
            </div>
          </div>

          {/* informasi pengiriman */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Pengiriman</h1>

              <div className="card-body">
                <table className="mb-4">
                  <tbody>
                    <tr>
                      <td className="w-32 md:w-56">Order No</td>
                      <td className="w-4">:</td>
                      <td>{orderDetail?.order_number}</td>
                    </tr>
                    <tr>
                      <td>Tipe Pengiriman</td>
                      <td>:</td>
                      <td>Normal</td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td>{orderDetail?.selected_address}</td>
                    </tr>
                  </tbody>
                </table>
                <Table
                  scroll={{ x: "max-content" }}
                  tableLayout={"auto"}
                  className="mb-4"
                  dataSource={orderDelivery}
                  columns={[...orderDeliveryColumns]}
                  loading={loading}
                  pagination={false}
                  rowKey="id"
                />
              </div>
            </div>
          </div>

          {/* ethix */}
          {/* <div className="card p-4">
            <Card title={"Ethix"}>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <Table
                    dataSource={orderDetail?.ethix_items || []}
                    columns={ethixColumns}
                    loading={loading}
                    pagination={false}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    tableLayout={"auto"}
                  />
                </div>
              </div>
            </Card>
          </div> */}

          {/* Informasi Tracking */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Tracking</h1>
            </div>

            <div className="card-body">
              {/* <Steps progressDot direction="vertical" size="small" current={0}>
                {orderDetail?.ethix_items.reverse().map((row, index) => {
                  return (
                    <Step
                      key={index}
                      title={moment(row.created_at).format(
                        "ddd, DD MMM YYYY - LT"
                      )}
                      subTitle={row.description}
                    />
                  )
                })}
              </Steps> */}
              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                className="mb-4"
                dataSource={orderDetail?.ethix_items.reverse()}
                columns={[...trackingListColumn]}
                loading={loading}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-title">Product Need</h1>
            </div>
            <div className="card-body">
              <Table
                dataSource={productNeed}
                columns={productNeedListColumn}
                loading={loading}
                pagination={false}
                rowKey="id"
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-title">Informasi Penagihan</h1>
            </div>
            <div className="card-body">
              <Table
                dataSource={billingData}
                columns={
                  userData?.role?.role_type !== "sales"
                    ? [...billingColumns]
                    : [...billingColumns]
                }
                loading={loading}
                pagination={false}
                rowKey="id"
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-title">Negotiation</h1>
            </div>
            <div className="card-body">
              <Table
                dataSource={negotiationsData}
                columns={negotiationsColumns}
                loading={loading}
                pagination={false}
                rowKey="id"
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
              />
            </div>
          </div>
        </div>
      </RenderIf>

      {/* Canceled */}
      <RenderIf isTrue={inArray(orderDetail?.status, ["-1", "4"])}>
        <div>
          <OrderDetailInfo order={orderDetail} printUrl={printUrl} />
          <div className="card">
            <div className="card-header">
              <h1 className="header-titl">Informasi Produk</h1>
            </div>
            <div className="card-body">
              <table>
                <tbody>
                  <tr>
                    <td className="w-32 md:w-56">Order No</td>
                    <td className="w-4">:</td>
                    <td>{orderDetail?.order_number}</td>
                  </tr>
                  <tr>
                    <td className="w-32 md:w-56">Tipe Pengiriman</td>
                    <td className="w-4">:</td>
                    <td>Normal</td>
                  </tr>
                  <tr>
                    <td className="w-32 md:w-56">Alamat</td>
                    <td className="w-4">:</td>
                    <td>{orderDetail?.selected_address}</td>
                  </tr>
                </tbody>
              </table>
              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                className="mb-4"
                dataSource={productNeed}
                columns={[...productNeedListColumn, ...productNeedColumns]}
                loading={loading}
                pagination={false}
                rowKey="id"
                summary={() => {
                  if (productNeed.length > 0) {
                    return (
                      <>
                        {summaries.map((item, index) => (
                          <SummaryItem item={item} key={index} disabled />
                        ))}
                      </>
                    )
                  }

                  return null
                }}
              />
              {orderDetail?.status > 0 && (
                <div>
                  <p>
                    Silahkan pilih PIC kurir untuk pengiriman sales order
                    dibawah ini:
                  </p>
                  <div>
                    <label htmlFor="" className="text-bold mb-2">
                      PIC Warehouse
                    </label>
                    <Select
                      disabled={orderDetail?.status === "4"}
                      loading={loadingWarehouse}
                      allowClear
                      className="w-full mb-2"
                      placeholder="Pilih PIC Warehouse"
                      onChange={(e) => handleChangeKurir(e)}
                      value={orderDetail?.courier}
                    >
                      {warehouse &&
                        warehouse.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item?.name}
                          </Select.Option>
                        ))}
                    </Select>
                    <small>
                      <i>
                        Anda dapat melakukan perubahan saat data belum masuk ke
                        dalam proses assign to warehouse
                      </i>
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <div className="card p-4">
            <Card title={"Ethix"}>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <Table
                    dataSource={orderDetail?.ethix_items || []}
                    columns={ethixColumns}
                    loading={loading}
                    pagination={false}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    tableLayout={"auto"}
                  />
                </div>
              </div>
            </Card>
          </div> */}

          {/* informasi pengiriman */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Pengiriman</h1>

              <div className="card-body">
                <table className="mb-4">
                  <tbody>
                    <tr>
                      <td className="w-32 md:w-56">Order No</td>
                      <td className="w-4">:</td>
                      <td>{orderDetail?.order_number}</td>
                    </tr>
                    <tr>
                      <td>Tipe Pengiriman</td>
                      <td>:</td>
                      <td>Normal</td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td>{orderDetail?.selected_address}</td>
                    </tr>
                  </tbody>
                </table>
                <Table
                  scroll={{ x: "max-content" }}
                  tableLayout={"auto"}
                  className="mb-4"
                  dataSource={orderDelivery}
                  columns={[...orderDeliveryColumns]}
                  loading={loading}
                  pagination={false}
                  rowKey="id"
                />
              </div>
            </div>
          </div>

          {orderDetail?.status > 0 && (
            <div className="card">
              <div className="card-body">
                <p>Notes</p>
                <TextArea
                  disabled={orderDetail?.status === "4"}
                  // autoSize={{
                  //   minRows: 2,
                  //   maxRows: 6,
                  // }}
                  placeholder="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={updateNotes}
                />
              </div>
            </div>
          )}

          {orderDetail?.status == 1 && (
            <RenderIf
              isTrue={
                userData?.role.role_type !== "sales" &&
                (userData?.role.role_type === "adminsales" ||
                  userData?.role.role_type === "leadwh" ||
                  userData?.role.role_type === "leadsales" ||
                  userData?.role.role_type === "superadmin")
              }
            >
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2 float-right"
                onClick={() => {
                  if (loading) {
                    return null
                  }

                  if (!orderDetail?.courier) {
                    return message.error(
                      "Mohon Pilih PIC Warehouse Terlebih Dahuku"
                    )
                  }

                  assignWarehouse()
                }}
                disabled={loading}
              >
                {loading && <LoadingOutlined />}
                Assign To Warehouse
              </button>
            </RenderIf>
          )}
        </div>
      </RenderIf>
    </Layout>
  )
}

export default OrderOnlineDetail
