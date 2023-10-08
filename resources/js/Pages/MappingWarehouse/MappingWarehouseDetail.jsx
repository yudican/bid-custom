import { CheckOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card, DatePicker, Form, Input, Select } from "antd"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"

import "../../index.css"

const MappingWarehouseDetail = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { id } = useParams()

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [packages, setPackages] = useState([])
  const [detail, setDetail] = useState(null)

  const loadDetailTicket = () => {
    axios.get(`/api/mapping/warehouse/detail/${id}`).then((res) => {
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
      title="Warehouse Detail"
      href="/mapping/warehouse"
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
                                <strong>Warehouse Tiktok ID</strong>
                                </td>
                                <td>: {detail?.tiktok_warehouse_id || "-"}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Warehouse Name</strong>
                                </td>
                                <td>: {detail?.warehouse_name || "-"}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Warehouse City</strong>
                                </td>
                                <td>
                                : {detail?.warehouse_city || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Warehouse Contact</strong>
                                </td>
                                <td>
                                : {detail?.warehouse_contact || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Warehouse Address</strong>
                                </td>
                                <td>
                                : {detail?.warehouse_address || "-"}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Warehouse Phone</strong>
                                </td>
                                <td>
                                : {detail?.warehouse_phone || "-"}
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

export default MappingWarehouseDetail
