import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  PrinterTwoTone,
  WarningFilled,
} from "@ant-design/icons"
import { Button, Card, Table, Tag } from "antd"
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"
import { formatDate, getItem, inArray } from "../../helpers"
import ModalNotes from "../Purchase/Components/ModalNotes"
import RejectModal from "../Purchase/Components/RejectModal"
import ModalPenerimaan from "./Components/ModalPenerimaan"
import { inventoryReturnStatus } from "./config"

const TableInformation = ({ title = "Company", value = "-" }) => {
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

const InventoryProductReturnDetail = () => {
  const navigate = useNavigate()
  const { inventory_id } = useParams()
  const [productNeed, setProductNeed] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [loadingApprove, setLoadingApprove] = React.useState(false)
  const [detail, setDetail] = React.useState({})

  const loadDetail = () => {
    setLoading(true)
    axios
      .get(`/api/inventory/product/return/detail/${inventory_id}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        setDetail(data)
      })
      .catch((e) => setLoading(false))
  }
  // console.log(productNeed, "productNeed")
  const approvePurchaseOrder = () => {
    setLoadingApprove(true)
    axios
      .post(`/api/inventory/product/return/verify/${inventory_id}`, {
        status: 2,
      })
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

  const updateStatusItem = (inventory, status) => {
    setLoadingApprove(true)
    axios
      .post(`/api/inventory/product/return/status/${inventory.id}`, {
        ...inventory,
        received_vendor: status,
      })
      .then((res) => {
        setLoadingApprove(false)
        toast.success("Data berhasil di simpan", {
          position: toast.POSITION.TOP_RIGHT,
        })
        loadDetail()
      })
      .catch((err) => {
        setLoadingApprove(false)
        toast.error("Data Gagal Disimpan", {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleComplete = () => {
    const received = detail.qty_received
    const pre_received = detail.qty_pre_received

    if (received == pre_received) {
      axios
        .post(`/api/inventory/product/return/completed/${inventory_id}`)
        .then((res) => {
          setLoadingApprove(false)
          loadDetail()
          toast.success("Status Berhasil Diupdate")
        })
        .catch((err) => {
          setLoadingApprove(false)
          return toast.error("Status Gagal Diupdate")
        })
    }

    return toast.error("Semua Barang Belum Diterima")
  }

  useEffect(() => {
    loadDetail()
  }, [])

  const role = getItem("role")
  const isWaitingApproval = detail?.status == "0"
  const isFinance = inArray(role, ["finance"])
  const isWarehouse = inArray(role, ["warehouse"])
  const isPurchasing = inArray(role, ["purchasing"])
  const canApprove = isWaitingApproval && isPurchasing
  const canAcceptProduct = true
  const rightContent = (
    <div className="flex items-center">
      {canApprove ? (
        <>
          <RejectModal
            refetch={() => loadDetail()}
            url={`/api/inventory/product/return/verify/${inventory_id}`}
            initialValues={{ status: 4 }}
          />
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
            title="Approve"
            onClick={() => approvePurchaseOrder()}
          >
            {loadingApprove ? (
              <LoadingOutlined />
            ) : (
              <CheckOutlined className="md:mr-2" />
            )}
            <span className="hidden md:block">Approve</span>
          </button>
        </>
      ) : null}
    </div>
  )

  const productNeedList = detail?.items

  return (
    <>
      <Layout
        title="Detail Product Return"
        href="/inventory-new/inventory-product-return"
        rightContent={rightContent}
      >
        <Card
          title="Detail Product Return"
          extra={
            <div className="flex items-center">
              <div className="flex justify-end items-center">
                <strong className="mr-2">Status :</strong>
                {inventoryReturnStatus(detail?.status)}
              </div>
              <a href={"/print/spr/" + detail?.uid_inventory} target="_blank">
                <Button className="ml-4" title="Reject">
                  <PrinterTwoTone />
                </Button>
              </a>
            </div>
          }
        >
          <div className="card-body grid md:grid-cols-3 gap-4">
            <TableInformation
              title="Company"
              value={detail?.company_account_name}
            />
            <TableInformation title="Nomor PR" value={detail?.nomor_sr} />
            <TableInformation title="Vendor Name" value={detail?.vendor} />
            <TableInformation
              title="Transaction Channel"
              value={detail?.transaction_channel}
            />
            <TableInformation
              title="Created Date"
              value={formatDate(detail?.created_at)}
            />
            <TableInformation
              title="Received WH"
              value={detail?.warehouse_name}
            />
            <TableInformation
              title="Received Date"
              value={detail?.received_date}
            />
            <TableInformation
              title="Created by"
              value={detail?.created_by_name}
            />
            <TableInformation
              title="Notes"
              value={<ModalNotes value={detail?.note || "-"} />}
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
          </div>
        </Card>
      </Layout>

      <div className="card p-4">
        <Card
          title={
            <div>
              <span className="mr-4">Informasi Product Return Product</span>
            </div>
          }
        >
          <div className="row">
            <div className="col-md-12 mt-4">
              <Table
                dataSource={productNeedList?.filter(
                  (item) => item.is_master > 0
                )}
                columns={[
                  {
                    title: "Product",
                    dataIndex: "product_name",
                    key: "product_name",
                  },
                  {
                    title: "SKU",
                    dataIndex: "sku",
                    key: "sku",
                  },
                  {
                    title: "UOFM",
                    dataIndex: "u_of_m",
                    key: "u_of_m",
                  },
                  {
                    title: "Qty",
                    dataIndex: "qty",
                    key: "qty",
                  },
                  {
                    title: "Notes",
                    dataIndex: "notes",
                    key: "notes",
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

      <div className="card p-4">
        <Card
          title={
            <div>
              <span className="mr-4">
                Informasi Penerimaan Barang Return Dari Customer
              </span>
            </div>
          }
          extra={
            <div className="flex justify-end items-center">
              {canAcceptProduct && (
                <ModalPenerimaan
                  refetch={() => loadDetail()}
                  products={detail?.items}
                  url={`/api/inventory/product/return/pre-received/${detail?.uid_inventory}`}
                  detail={detail}
                  type={"item_pre_received"}
                />
              )}
            </div>
          }
        >
          <div className="row">
            <div className="col-md-12 mt-4">
              <Table
                dataSource={detail?.item_pre_received}
                columns={[
                  {
                    title: "Product",
                    dataIndex: "product_name",
                    key: "product_name",
                  },
                  {
                    title: "SKU",
                    dataIndex: "sku",
                    key: "sku",
                  },
                  {
                    title: "UOFM",
                    dataIndex: "u_of_m",
                    key: "u_of_m",
                  },
                  {
                    title: "Qty",
                    dataIndex: "qty_diterima",
                    key: "qty_diterima",
                  },
                  {
                    title: "Dikirim ke vendor?",
                    dataIndex: "received_vendor",
                    key: "received_vendor",
                    render: (text) => {
                      if (text < 1) {
                        return "Waiting"
                      }
                      return text == 1 ? "Ya" : "Tidak"
                    },
                  },
                  {
                    title: "Notes",
                    dataIndex: "notes",
                    key: "notes",
                  },
                  {
                    title: "Action",
                    dataIndex: "action",
                    key: "action",
                    render: (value, record) => {
                      if (record.received_vendor < 1) {
                        return (
                          <div>
                            <button
                              onClick={() => updateStatusItem(record, 2)}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-4"
                            >
                              <CloseOutlined />
                            </button>
                            <button
                              onClick={() => updateStatusItem(record, 1)}
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-4"
                            >
                              <CheckOutlined />
                            </button>
                          </div>
                        )
                      }
                      return <Tag title="Sudah Diterima" color="green" />
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

      <div className="card p-4">
        <Card
          title={
            <div>
              <span className="mr-4">
                Informasi Penerimaan Barang Dari Vendor
              </span>
            </div>
          }
          extra={
            <div className="flex justify-end items-center">
              {canAcceptProduct && (
                <ModalPenerimaan
                  refetch={() => loadDetail()}
                  products={
                    detail?.item_pre_received?.filter(
                      (product) => product.received_vendor == 1
                    ) || []
                  }
                  url={`/api/inventory/product/return/received/${detail?.uid_inventory}`}
                  detail={detail}
                  type={"item_received"}
                />
              )}
            </div>
          }
        >
          <div className="row">
            <div className="col-md-12 mt-4">
              <Table
                dataSource={detail?.item_received}
                columns={[
                  {
                    title: "Received Number",
                    dataIndex: "received_number",
                    key: "received_number",
                  },
                  {
                    title: "Product",
                    dataIndex: "product_name",
                    key: "product_name",
                  },
                  {
                    title: "SKU",
                    dataIndex: "sku",
                    key: "sku",
                  },
                  {
                    title: "UOFM",
                    dataIndex: "u_of_m",
                    key: "u_of_m",
                  },
                  {
                    title: "Qty",
                    dataIndex: "qty_diterima",
                    key: "qty_diterima",
                  },
                  {
                    title: "Notes",
                    dataIndex: "notes",
                    key: "notes",
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

      {inArray(detail?.status, [2, 3]) && (
        <div className="card items-end p-3">
          <div>
            <button
              onClick={() => {
                return handleComplete()
              }}
              className={`ml-4 w-30 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
            >
              <span>Complete</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default InventoryProductReturnDetail
