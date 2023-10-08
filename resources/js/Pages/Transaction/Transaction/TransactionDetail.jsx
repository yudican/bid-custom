import { Card, Table, Tag } from "antd"
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Layout from "../../../components/layout"
import { formatDate, formatNumber, handleString } from "../../../helpers"
import { transactionProductListColumn } from "./config"

const TransactionDetail = ({ type = "agent" }) => {
  const navigate = useNavigate()
  const { transaction_id } = useParams()
  const [loading, setLoading] = React.useState(false)
  const [detail, setDetail] = React.useState({})
  const [products, setProducts] = React.useState([])

  const loadDetail = () => {
    setLoading(true)
    const params = type === "agent" ? "detail/agent" : "detail"
    axios
      .get(`/api/transaction/${params}/${transaction_id}`)
      .then((res) => {
        const { data } = res.data

        setLoading(false)
        setDetail(data)
        const newProducts = data?.transaction_detail?.map((item) => {
          return {
            product_id: item?.product_variant?.product_id,
            product_name: item?.product_variant?.name,
            sku: item?.product_variant?.sku,
            price: item?.product_variant?.price["final_price"],
            u_of_m: item?.product_variant?.u_of_m,
            qty: item.qty,
            subtotal: item.subtotal,
          }
        })
        setProducts(newProducts)
      })
      .catch((e) => setLoading(false))
  }

  useEffect(() => {
    loadDetail()
  }, [])

  return (
    <Layout
      title="Transaction Detail"
      href="#"
      // rightContent={rightContent}
    >
      <Card
        title={detail?.id_transaksi}
        extra={
          <div>
            <span className="mr-2">Status:</span>
            <Tag color={"blue"}>{detail?.final_status}</Tag>
          </div>
        }
      >
        <div className="row">
          <div className="col-md-4">
            <table className="w-100" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Nama Custommer</strong>
                  </td>
                  <td>: {detail?.user_info?.name || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>No. Handphone</strong>
                  </td>
                  <td>: {detail?.user_info?.phone || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Email</strong>
                  </td>
                  <td>: {detail?.user_info?.email || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <table className="w-100" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "40%" }} className="py-2">
                    <strong>Brand</strong>
                  </td>
                  <td>: {handleString(detail?.brand_name)}</td>
                </tr>
                <tr>
                  <td style={{ width: "40%" }} className="py-2">
                    <strong>Metode Pembayaran</strong>
                  </td>
                  <td>: {detail?.payment_method_name || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "40%" }} className="py-2">
                    <strong>Metode Pengiriman</strong>
                  </td>
                  <td>: {detail?.shipping_type?.shipping_type_name || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <table className="w-100" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "40%" }} className="py-2">
                    <strong>Tanggal Transaksi</strong>
                  </td>
                  <td>: {formatDate(detail?.created_at)}</td>
                </tr>
                <tr>
                  <td style={{ width: "40%" }} className="py-2">
                    <strong>Batas Pembayaran</strong>
                  </td>
                  <td>: {formatDate(detail?.expire_payment)}</td>
                </tr>
                <tr>
                  <td style={{ width: "40%" }} className="py-2">
                    <strong>Status Pengiriman</strong>
                  </td>
                  <td>: {handleString(detail?.status_delivery_name)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* products */}
      <Card title={"Detail Product"} className={"mt-4"}>
        <Table
          columns={transactionProductListColumn}
          dataSource={products}
          rowKey={"product_id"}
          pagination={false}
          summary={(pageData) => {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <strong>Total QTY</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {detail?.qty_total}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </Card>

      <div className="row mt-4">
        <div className="col-md-7">
          <Card title={"Detail Pengiriman"}>
            <div className="mt-4 p-2 rounded-md border-2 border-[#008BE1] bg-[#D8F0FF] text-[#004AA6]">
              <p> Detail Alamat Pengiriman Customer</p>
              <table width={"100%"}>
                <tbody>
                  <tr>
                    <td width={"20%"}>Nama</td>
                    <td>: {handleString(detail?.user_info?.name)}</td>
                  </tr>
                  <tr>
                    <td width={"20%"}>No. Handphone</td>
                    <td>: {handleString(detail?.user_info?.phone)}</td>
                  </tr>
                  <tr>
                    <td width={"20%"}>Alamat Email</td>
                    <td>: {handleString(detail?.user_info?.email)}</td>
                  </tr>

                  <tr>
                    <td width={"20%"}>Alamat Lengkap</td>
                    <td>
                      : {handleString(detail?.address_user?.alamat_detail)}
                    </td>
                  </tr>
                  <tr>
                    <td width={"20%"}>Notes</td>
                    <td>: {handleString(detail?.note)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div className="col-md-5">
          <Card title={"Detail Pembayaran"}>
            <table className="w-100" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Subtotal</strong>
                  </td>
                  <td>: {formatNumber(detail?.subtotal, "Rp. ")}</td>
                </tr>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Diskon</strong>
                  </td>
                  <td>: {formatNumber(detail?.diskon, "Rp. ")}</td>
                </tr>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Ongkos Kirim</strong>
                  </td>
                  <td>: {formatNumber(detail?.ongkir, "Rp. ")}</td>
                </tr>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Biaya Lainnya</strong>
                  </td>
                  <td>: {formatNumber(detail?.biaya_lainnya, "Rp. ")}</td>
                </tr>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Kode Unik</strong>
                  </td>
                  <td>: {formatNumber(detail?.payment_unique_code, "Rp. ")}</td>
                </tr>
                <tr>
                  <td style={{ width: "35%" }} className="py-2">
                    <strong>Total</strong>
                  </td>
                  <td>: {formatNumber(detail?.nominal, "Rp. ")}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default TransactionDetail
