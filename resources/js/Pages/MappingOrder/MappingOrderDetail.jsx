import { Card, Empty, Spin, Steps, Table } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import Layout from "../../components/layout"
import "../../index.css"
import { productListColumn } from "./config"

const { Step } = Steps

const MappingOrderDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [detail, setDetail] = useState(null)
  const [detailTiktok, setDetailTiktok] = useState(null)
  const [detailTrackTiktok, setDetailTrackTiktok] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTrack, setLoadingTrack] = useState(false)

  const loadDetailTicket = () => {
    setLoading(true)
    axios
      .get(`/api/mapping/order/detail/${id}`)
      .then((res) => {
        const { data, tiktok } = res.data
        setLoading(false)
        setDetail(data)
        setDetailTiktok(tiktok?.order_list[0])
        loadDetailTrackOrder(data.tiktok_order_id)
      })
      .catch(() => setLoading(false))
  }

  const loadDetailTrackOrder = (tiktok_id) => {
    setLoadingTrack(true)
    axios
      .get(`/api/mapping/order/track/${tiktok_id}`)
      .then((res) => {
        const { data } = res.data
        setLoadingTrack(false)
        setDetailTrackTiktok(data[0]?.tracking_info ?? [])
      })
      .catch(() => setLoadingTrack(false))
  }

  useEffect(() => {
    loadDetailTicket()
  }, [])

  if (loading) {
    return (
      <Layout title="Order Detail" href="/mapping/order">
        <div className="h-96 flex justify-center items-center">
          <Spin />
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title="Order Detail"
      href="/mapping/order"
      // rightContent={rightContent}
    >
      <Card title="Data Detail">
        <div className="card-body row">
          <div className="col-md-12">
            <table className="w-100" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>ID</strong>
                  </td>
                  <td>: {detail?.id || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>Order Tiktok ID</strong>
                  </td>
                  <td>: {detail?.tiktok_order_id || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>Buyer UID</strong>
                  </td>
                  <td>: {detail?.buyer_uid || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>Delivery Option Description</strong>
                  </td>
                  <td>: {detail?.delivery_option_description || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>Payment Method</strong>
                  </td>
                  <td>: {detail?.payment_method || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>Shipping Provide</strong>
                  </td>
                  <td>: {detail?.shipping_provider || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>Tracking Number</strong>
                  </td>
                  <td>: {detail?.tracking_number || "-"}</td>
                </tr>
                <tr>
                  <td style={{ width: "30%" }} className="py-2">
                    <strong>Warehouse Id</strong>
                  </td>
                  <td>: {detail?.warehouse_id || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      <Card title="Produk Detail" className="mt-2">
        <Table
          dataSource={detailTiktok?.item_list}
          columns={productListColumn}
          pagination={false}
        />
      </Card>
      <Card title="Riwayat Transaksi" className="mt-2">
        {loadingTrack ? (
          <div className="h-96 flex justify-center items-center">
            <Spin />
          </div>
        ) : (
          <div className="mt-8">
            {detailTrackTiktok && detailTrackTiktok.length > 0 ? (
              <Steps progressDot direction="vertical" size="small" current={0}>
                {detailTrackTiktok.map((row, index) => {
                  return (
                    <Step
                      key={index}
                      title={moment(Number(row.update_time)).format(
                        "ddd, DD MMM YYYY - LT"
                      )}
                      subTitle={row.description}
                    />
                  )
                })}
              </Steps>
            ) : (
              <Empty />
            )}
          </div>
        )}
      </Card>
    </Layout>
  )
}

export default MappingOrderDetail
