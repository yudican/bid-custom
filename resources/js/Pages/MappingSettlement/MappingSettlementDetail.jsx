import { CheckOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card, DatePicker, Form, Input, Select } from "antd"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"

import "../../index.css"

const MappingSettlementDetail = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { id } = useParams()

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [packages, setPackages] = useState([])
  const [detail, setDetail] = useState(null)

  const loadDetailTicket = () => {
    axios.get(`/api/mapping/settlement/detail/${id}`).then((res) => {
      const { data } = res.data
      console.log(data)
      setDetail(data)
    //   const forms = {
    //     ...data,
    //     customer_name: data?.customer_name,
    //     expired_at: moment(data?.expired_at ?? new Date(), "YYYY-MM-DD"),
    //   }
    //   form.setFieldsValue(forms)
    })
  }

  const loadPackages = () => {
    axios.get("/api/master/package").then((res) => {
      const { data } = res.data
      setPackages(data)
    })
  }

  useEffect(() => {
    loadDetailTicket()
    loadPackages()
  }, [])



  return (
    <Layout
      title="Settlement Detail"
      href="/mapping/settlement"
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
                                <strong>Settlement Tiktok ID</strong>
                                </td>
                                <td>: {detail?.tiktok_settlement_id || "-"}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Order Id</strong>
                                </td>
                                <td>: {detail?.order_id || "-"}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Fee Type</strong>
                                </td>
                                <td>
                                : {detail?.fee_type || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Currency</strong>
                                </td>
                                <td>
                                : {detail?.currency || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Flat Fee</strong>
                                </td>
                                <td>
                                : {detail?.flat_fee || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Platform Promotion</strong>
                                </td>
                                <td>
                                : {detail?.platform_promotion || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Sales Fee</strong>
                                </td>
                                <td>
                                : {detail?.sales_fee || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Settlement Ammount</strong>
                                </td>
                                <td>
                                : {detail?.settlement_amount || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Service Fee</strong>
                                </td>
                                <td>
                                : {detail?.sfp_service_fee || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Subtotal After Seller Discounts</strong>
                                </td>
                                <td>
                                : {detail?.subtotal_after_seller_discounts || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>User Pay</strong>
                                </td>
                                <td>
                                : {detail?.user_pay || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>VAT</strong>
                                </td>
                                <td>
                                : {detail?.vat || "-"}
                                </td>
                            </tr>
                           
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    </Layout>
  )
}

export default MappingSettlementDetail
