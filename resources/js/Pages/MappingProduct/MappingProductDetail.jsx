import { CheckOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card, DatePicker, Form, Input, Select } from "antd"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"

import "../../index.css"

const MappingProductDetail = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { id } = useParams()

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [packages, setPackages] = useState([])
  const [detail, setDetail] = useState(null)

  const loadDetailTicket = () => {
    axios.get(`/api/mapping/product/detail/${id}`).then((res) => {
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
      title="Product Detail"
      href="/mapping/product"
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
                                <strong>Product Tiktok ID</strong>
                                </td>
                                <td>: {detail?.tiktok_product_id || "-"}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>Name</strong>
                                </td>
                                <td>: {detail?.name || "-"}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "30%" }} className="py-2">
                                <strong>SKU ID</strong>
                                </td>
                                <td>
                                : {detail?.sku_id || "-"}
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
                                <strong>Price</strong>
                                </td>
                                <td>
                                : {detail?.price || "-"}
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                    <br/><br/>
                    <b>Detail Stock Warehouse</b>
                    <table className="table table-bordered" style={{ width: "100%" }}>
                        <tr>
                            <td>Warehouse Tiktok Id</td>
                            <td>Warehouse Name</td>
                            <td>Stock</td>
                        </tr>
                        {detail?.warehouse.map((row, index) => {
                            return (
                                <tr>
                                    <td> {row.warehouse_tiktok_id} </td>
                                    <td> {row.warehouse_name} </td>
                                    <td> {row.stock} </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            </div>
        </Card>
    </Layout>
  )
}

export default MappingProductDetail
