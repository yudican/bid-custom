import {
  CheckOutlined,
  CreditCardOutlined,
  FileExcelOutlined,
  LoadingOutlined,
  PrinterTwoTone,
} from "@ant-design/icons"
import { Dropdown, Form, Menu, message, Select, Steps, Table } from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Layout from "../../components/layout"
import LoadingFallback from "../../components/LoadingFallback"
import ModalInputResi from "../../components/Modal/ModalInputResi"
import ModalOngkosKirim from "../../components/Modal/ModalOngkosKirim"
import UpdateUniqueCode from "../../components/UpdateUniqueCode"
import { formatNumber, getItem, inArray, RenderIf } from "../../helpers"
import ContactAddress from "../Contact/ContactAddress"
import ModalBilling from "./Components/ModalBilling"
import ModalBillingReject from "./Components/ModalBillingReject"
import OrderDetailInfo from "./Components/OrderDetailInfo"
import Reminder from "./Components/Reminder"
import {
  activityColumns,
  billingColumns,
  productNeedListColumn,
} from "./config"

const { Step } = Steps

const OrderLeadDetail = () => {
  const [form] = Form.useForm()
  const params = useParams()
  const userData = getItem("user_data", true)
  const [orderDetail, setDetailOrder] = useState(null)
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
  const loadDetailOrderLead = (refresh = true) => {
    setLoading(refresh)
    axios.get(`/api/order-lead/${params.uid_lead}`).then((res) => {
      const { data, print } = res.data
      setPrintUrl(print)
      setDetailOrder(data)
      setNotes(data.notes)
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
            product: item?.product?.name,
            price: formatNumber(item?.prices?.final_price),
            qty: item?.qty,
            subtotal: formatNumber(item?.subtotal),
            total_price: formatNumber(item?.total),
            final_price: formatNumber(item?.price_nego),
            tax_id: item?.tax_id,
            discount_id: item?.discount_id,
            disabled: data.status > 1 ? true : false,
            disabled_discount: item?.disabled_discount,
            disabled_price_nego: item?.disabled_price_nego,
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

  const loadWarehouse = () => {
    setLoadingWarehouse(true)
    axios.get(`/api/general/warehouse-user`).then((res) => {
      const { data } = res.data
      setWarehouse(data)
      setLoadingWarehouse(false)
    })
  }

  const assignWarehouse = () => {
    axios
      .get(`/api/order-lead/assign-warehouse/${params.uid_lead}`)
      .then((res) => {
        loadDetailOrderLead()
        message.success("Assign Warehouse Success")
      })
      .catch((err) => {
        message.error("Assign Warehouse Failed")
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

  const handleVerifyBilling = (value, status) => {
    const statusNote = status > 1 ? "Reject" : "Approve"
    axios
      .post(`/api/order-lead/billing/verify`, { status, ...value })
      .then((res) => {
        loadDetailOrderLead()
        message.success(statusNote + " Billing Success")
      })
      .catch((err) => {
        message.error(statusNote + " Billing Failed")
      })
  }

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
      .post(`/api/order-lead/reminder/update`, {
        field: dataIndex,
        value,
        reminder_id,
        uid_lead: params.uid_lead,
      })
      .then((res) => {
        // loadDetailOrderLead(false);
      })
      .catch((err) => {})
  }

  const handleAddReminder = () => {
    axios
      .post(`/api/order-lead/reminder/save`, {
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
        .get(`/api/order-lead/reminder/delete/${key}`)
        .then((res) => {
          console.log(res, "delete")
          loadDetailOrderLead()
        })
        .catch((err) => {
          console.log(err, "delete")
        })
    }
  }
  // console.log(reminders, "reminders");
  const handleChangeTab = (key) => {}

  const handleChangeKurir = (courier) => {
    if (orderDetail?.courier !== courier) {
      axios
        .post(`/api/order-lead/change-courier`, {
          courier,
          uid_lead: orderDetail.uid_lead,
        })
        .then((res) => {
          message.success("Berhasil mengubah kurir")
          loadDetailOrderLead()
        })
        .catch((err) => {
          message.error("Gagal mengubah kurir")
        })
    }
  }
  const setClosed = () => {
    axios.get(`/api/order-lead/closed/${orderDetail.uid_lead}`).then((res) => {
      loadDetailOrderLead()
      message.success("Order Lead berhasil di tutup")
    })
  }

  const updateNotes = () => {
    axios
      .post(`/api/general/order/update-notes`, {
        uid_lead: orderDetail.uid_lead,
        notes,
        type: "lead",
      })
      .then((res) => {
        message.success("Notes Berhasil Disimpan")
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

  const onFinishSaveResi = (values) => {
    axios
      .post("/api/order-lead/shipping/save", values)
      .then((res) => {
        message.success("Resi Berhasil Disimpan")
        loadDetailOrderLead()
      })
      .catch((err) => {
        message.error("Resi Gagal Disimpan")
      })
  }

  const productNeedColumns = [
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text, record, index) => {
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
        // console.log(record, "record order lead")
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
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
  ]

  const show = !inArray(getItem("role"), [
    "adminsales",
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
            if (orderDetail.amount < orderDetail.amount_billing_approved) {
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
      value: formatNumber(orderDetail?.ongkir),
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
              url={"/api/order-lead/update/kode-unik"}
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
              url={`/api/order-lead/update/ongkir/${orderDetail.uid_lead}`}
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

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      .post(`/api/order-lead/export/detail/${params.uid_lead}`)
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

  const { address_user, order_shipping } = orderDetail || {}
  if (loading) {
    return (
      <Layout
        title="Detail"
        rightContent={rightContent}
        href="/order/order-lead"
      >
        <LoadingFallback />
      </Layout>
    )
  }
  console.log(orderDetail?.status)
  return (
    <Layout title="Detail" rightContent={rightContent} href="/order/order-lead">
      <Steps
        size="small"
        current={orderDetail?.status}
        style={{ marginBottom: 16 }}
      >
        <Step title="New" />
        <Step title="Open" />
        <Step
          status={orderDetail?.status === "4" ? "error" : null}
          title={orderDetail?.status === "4" ? "Canceled" : "Closed"}
        />
      </Steps>

      {/* New */}
      <RenderIf isTrue={orderDetail?.status == "1"}>
        <div>
          <OrderDetailInfo order={orderDetail} printUrl={printUrl} />

          <ContactAddress
            title="Address Information"
            data={orderDetail?.contact_user?.address_users || []}
            contact={orderDetail?.contact_user}
            refetch={() => loadDetailOrderLead()}
          />

          <div className="card">
            <div className="card-header">
              <h1 className="header-titl">Informasi Pengiriman</h1>
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
                    userData?.role.role_type === "leadsales" ||
                    userData?.role.role_type === "superadmin")
                }
              >
                <p>
                  Produk akan dikirim dengan kurir perusahaan. Silahkan assign
                  nama pic kurir / bagian warehouse dibawah ini :
                </p>
                <div>
                  <label htmlFor="" className="text-bold mb-2">
                    Pic Kurir / Bagian Warehouses
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
          <RenderIf
            isTrue={inArray(getItem("role"), [
              "adminsales",
              "leadsales",
              "superadmin",
            ])}
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

          {/* submit */}
          {orderDetail?.status == 1 && (
            <RenderIf
              isTrue={inArray(getItem("role"), [
                "adminsales",
                "leadsales",
                "superadmin",
              ])}
            >
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2 float-right"
                onClick={() => {
                  if (loading) {
                    return null
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

      {/* Open */}
      <RenderIf isTrue={orderDetail?.status == "2"}>
        <div>
          <OrderDetailInfo order={orderDetail} printUrl={printUrl} />
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-titl">Informasi Pengiriman</h1>
              <RenderIf isTrue={userData?.role.role_type !== "sales"}>
                <ModalInputResi
                  hasInputed={order_shipping}
                  onFinish={(values) => onFinishSaveResi(values)}
                  initialValues={order_shipping}
                  fields={{ uid_lead: orderDetail?.uid_lead }}
                />
              </RenderIf>
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
                    <td>Tipe Pengiriman</td>
                    <td>:</td>
                    <td>Normal</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{orderDetail?.selected_address || "-"}</td>
                  </tr>
                  {order_shipping && (
                    <>
                      <tr>
                        <td>Pengirim</td>
                        <td>:</td>
                        <td>{order_shipping?.sender_name}</td>
                      </tr>
                      <tr>
                        <td>Telfon Pengirim</td>
                        <td>:</td>
                        <td>{order_shipping?.sender_phone}</td>
                      </tr>
                      <tr>
                        <td>Nama Ekspedisi</td>
                        <td>:</td>
                        <td>{order_shipping?.expedition_name}</td>
                      </tr>
                      <tr>
                        <td>Resi</td>
                        <td>:</td>
                        <td>{order_shipping?.resi}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
              <div className="mt-4">
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
              </div>
            </div>
          </div>

          {/* informasi penagihan */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="header-title">Informasi Penagihan</h1>
              <RenderIf isTrue={userData?.role.role_type !== "sales"}>
                <ModalBilling
                  detail={orderDetail}
                  refetch={loadDetailOrderLead}
                  user={userData}
                />
              </RenderIf>
            </div>
            <div className="card-body">
              <Table
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                dataSource={billingData}
                columns={
                  userData?.role?.role_type !== "sales"
                    ? [...billingColumns, ...billingActionColumn]
                    : [...billingColumns]
                }
                loading={loading}
                pagination={false}
                rowKey="id"
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
            isTrue={inArray(getItem("role"), ["finance", "superadmin"])}
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
                    onClick={setClosed}
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
      <RenderIf isTrue={orderDetail?.status == "3"}>
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
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                dataSource={activityData}
                columns={activityColumns}
                loading={loading}
                pagination={false}
                rowKey="id"
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h1 className="header-titl">Informasi Pengiriman</h1>
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
                    <td>Tipe Pengiriman</td>
                    <td>:</td>
                    <td>Normal</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{address_user?.alamat_detail || "-"}</td>
                  </tr>
                  {order_shipping && (
                    <>
                      <tr>
                        <td>Pengirim</td>
                        <td>:</td>
                        <td>{order_shipping?.sender_name}</td>
                      </tr>
                      <tr>
                        <td>Telfon Pengirim</td>
                        <td>:</td>
                        <td>{order_shipping?.sender_phone}</td>
                      </tr>
                      <tr>
                        <td>Nama Ekspedisi</td>
                        <td>:</td>
                        <td>{order_shipping?.expedition_name}</td>
                      </tr>
                      <tr>
                        <td>Resi</td>
                        <td>:</td>
                        <td>{order_shipping?.resi}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
              <div className="mt-4">
                <Table
                  scroll={{ x: "max-content" }}
                  tableLayout={"auto"}
                  className="mb-4"
                  dataSource={productNeed}
                  columns={[...productNeedListColumn, ...productNeedColumns]}
                  loading={loading}
                  pagination={false}
                  rowKey="id"
                />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h1 className="header-titl">Informasi Pengiriman</h1>
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
                      <td>Tipe Pengiriman</td>
                      <td>:</td>
                      <td>Normal</td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td>{address_user?.alamat_detail || "-"}</td>
                    </tr>
                    {order_shipping && (
                      <>
                        <tr>
                          <td>Nama Ekspedisi</td>
                          <td>:</td>
                          <td>{order_shipping?.expedition_name}</td>
                        </tr>
                        <tr>
                          <td>Resi</td>
                          <td>:</td>
                          <td>{order_shipping?.resi}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <div className="mt-4">
                  <Table
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
                </div>
              </div>
            </div>

            {/* informasi penagihan */}
            <div className="card">
              <div className="card-header">
                <h1 className="header-title">Informasi Penagihan</h1>
              </div>
              <div className="card-body">
                <Table
                  dataSource={billingData}
                  columns={[...billingColumns]}
                  loading={loading}
                  pagination={false}
                  rowKey="id"
                />
              </div>
            </div>

            {/* reminders */}
            {/* <Reminder
              handleChangeCell={handleChangeCell}
              handleClickCell={handleClickCell}
              dataSource={reminders}
            /> */}

            <div className="card">
              <div className="card-body">
                <p>Notes</p>
                <TextArea placeholder="notes" value={notes} readOnly />
              </div>
            </div>
          </div>
        </div>
      </RenderIf>

      {/* Canceled */}
      <RenderIf isTrue={orderDetail?.status == "4"}>
        <div>
          <OrderDetailInfo order={orderDetail} printUrl={printUrl} />
          <div className="card">
            <div className="card-header">
              <h1 className="header-titl">Informasi Pengiriman</h1>
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
                dataSource={productNeed}
                columns={[...productNeedListColumn, ...productNeedColumns]}
                loading={loading}
                pagination={false}
                rowKey="id"
                summary={() => {
                  if (productNeed?.length > 0) {
                    return (
                      <>
                        {summaries?.map((item, index) => (
                          <SummaryItem item={item} key={index} disabled />
                        ))}
                      </>
                    )
                  }

                  return null
                }}
              />

              <p>
                Produk akan dikirim dengan kurir perusahaan. Silahkan assign
                nama pic kurir / bagian warehouse dibawah ini :
              </p>
              <div>
                <label htmlFor="" className="text-bold mb-2">
                  Pic Kurir / Bagian Warehouses
                </label>
                <Select
                  disabled={orderDetail?.status === "4"}
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
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p>Notes</p>
              <TextArea
                disabled={orderDetail?.status === "4"}
                placeholder="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={updateNotes}
              />
            </div>
          </div>

          {orderDetail?.status == 1 && (
            <RenderIf
              isTrue={inArray(getItem("role"), [
                "adminsales",
                "leadsales",
                "superadmin",
              ])}
            >
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2 float-right"
                onClick={() => {
                  if (loading) {
                    return null
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

export default OrderLeadDetail
