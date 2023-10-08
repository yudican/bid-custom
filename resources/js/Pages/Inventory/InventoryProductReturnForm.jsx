import { DatePicker, Form, Input, message, Select } from "antd"
import axios from "axios"
import { Button } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"
import { formatNumber, getItem } from "../../helpers"
import ProductList from "./Components/ProductList"
import TextArea from "antd/lib/input/TextArea"
import { productListReturnColumns } from "./config"

const InventoryProductReturnForm = () => {
  const [form] = Form.useForm()
  const { inventory_id } = useParams()
  // hooks
  const navigate = useNavigate()
  // state
  const intialProduct = {
    key: 0,
    product_id: null,
    u_of_m: null,
    sku: null,
    case_return: null,
    qty: 100000,
    qty_alocation: 1,
  }
  const [productData, setProductData] = useState([intialProduct])
  const [caseLists, setCaseLists] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [companies, setCompanies] = useState([])
  const [vendors, setVendors] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [status, setStatus] = useState("draft")
  const [selectedCase, setSelectedCase] = useState(null)
  const [newCaselists, setNewCaselists] = useState([])
  const [caseProducts, setCaseProducts] = useState([])

  // api
  const loadProducts = () => {
    axios.get("/api/master/products").then((res) => {
      setProducts(res.data.data)
    })
  }
  const loadProductCase = (data) => {
    axios.post("/api/master/list-case", data).then((res) => {
      const productData = res.data.data
      if (productData.length > 0) {
        const newProductData = productData.map((item, index) => {
          return {
            key: index,
            product_id: item.product_id,
            u_of_m: item.u_of_m,
            sku: item.sku,
            case_return: selectedCase,
            qty: item.qty,
            qty_alocation: 1,
          }
        })

        setProductData(newProductData)
      }
    })
  }

  const loadWarehouse = () => {
    axios.get("/api/master/warehouse").then((res) => {
      setWarehouses(res.data.data)
    })
  }

  const loadVendor = () => {
    axios.get("/api/master/vendors").then((res) => {
      setVendors(res.data.data)
    })
  }

  const loadCompanies = () => {
    axios.get("/api/master/company-account").then((res) => {
      setCompanies(res.data.data)
    })
  }

  const loadInventoryDetail = () => {
    axios
      .get(`/api/inventory/product/return/detail/${inventory_id}`)
      .then((res) => {
        const { data } = res.data
        setDisabled(data?.status !== "draft")
        setStatus(data?.status)
        form.setFieldsValue({
          ...data,
          received_date: moment(data.received_date || new Date(), "YYYY-MM-DD"),
          expired_date: moment(data.expired_date || new Date(), "YYYY-MM-DD"),
        })
        const newProducts = data.items.map((item, index) => {
          return {
            key: index,
            product_id: item.product_id,
            price: item.price,
            qty: item.qty,
            sub_total: item.subtotal,
            sku: item.sku,
            u_of_m: item.u_of_m,
          }
        })
        setProductData(newProducts)
      })
  }

  const getCreatedInfo = () => {
    axios.get("/api/inventory/info/created").then((res) => {
      form.setFieldsValue(res.data)
    })
  }

  const loadCaseLists = () => {
    axios.get("/api/master/list-case").then((res) => {
      const { data } = res.data
      setCaseLists(data)
    })
  }

  // cycle
  useEffect(() => {
    loadProducts()
    loadWarehouse()
    loadVendor()
    loadCompanies()
    loadCaseLists()
    if (inventory_id) {
      loadInventoryDetail()
    } else {
      getCreatedInfo()
    }

    form.setFieldsValue({
      company_account_id: parseInt(getItem("account_id")),
    })
  }, [])

  const handleChangeProductItem = ({
    dataIndex,
    value,
    key,
    product_id,
    type,
  }) => {
    const datas = [...productData]
    datas[key][dataIndex] = value
    if (type === "change-product") {
      const product = products.find((item) => item.id === product_id)
      datas[key]["u_of_m"] = product?.package_name
      datas[key]["sku"] = product?.sku
    }

    setProductData(datas)
  }

  const handleClickProductItem = ({ key, type }) => {
    const datas = [...productData]
    if (type === "add") {
      const lastData = datas[datas.length - 1]
      datas.push({
        key: lastData.key + 1,
        product_id: null,
        u_of_m: null,
        sku: null,
        case_return: null,
        qty: 1,
        qty_alocation: 1,
      })
      return setProductData(datas)
    }

    if (type === "add-qty") {
      const item = datas[key]
      const qty = parseInt(item.qty_alocation) + 1
      datas[key]["qty_alocation"] = qty
      return setProductData(datas)
    }

    if (type === "remove-qty") {
      const item = datas[key]
      if (item.qty_alocation > 1) {
        const qty = item.qty_alocation - 1
        datas[key]["qty_alocation"] = qty
        return setProductData(datas)
      }
      return setProductData(datas)
    }

    const newData = datas.filter((item) => item.key !== key)
    return setProductData(newData)
  }

  const onFinish = (values) => {
    const productItem = productData.every((item) => item.product_id)
    if (!productItem) {
      return message.error("Please select product")
    }

    const data = {
      ...values,
      items: productData,
      account_id: getItem("account_id"),
    }
    let url = "/api/inventory/product/return/save"
    if (inventory_id) {
      data.inventory_id = inventory_id
      url = `/api/inventory/product/return/update/${inventory_id}`
    }
    axios
      .post(url, data)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        return navigate(-1)
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  return (
    <Layout onClick={() => navigate(-1)} title="Tambah Stok Produk">
      <div className="">
        <div className="flex justify-end items-center">
          <strong>Status :</strong>
          <Button
            type="primary"
            size={"middle"}
            style={{
              marginLeft: 10,
              backgroundColor: "#E3A008",
              borderColor: "#E3A008",
            }}
          >
            {status.toUpperCase()}
          </Button>
        </div>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item label="Nomor SR" name="nomor_sr">
                <Input placeholder="Input Nomor SR" disabled />
              </Form.Item>

              <Form.Item
                label="Sales Channel"
                name="transaction_channel"
                rules={[
                  {
                    required: true,
                    message: "Please input Sales Channel!",
                  },
                ]}
              >
                <Select placeholder="Select Sales Channel">
                  <Select.Option value={"corner"}>Corner</Select.Option>
                  <Select.Option value={"agent-portal"}>
                    Agent Portal
                  </Select.Option>
                  <Select.Option value={"distributor"}>
                    Distributor
                  </Select.Option>
                  <Select.Option value={"super-agent"}>
                    Super Agent
                  </Select.Option>
                  <Select.Option value={"modern-store"}>
                    Modern Store
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Warehouse"
                name="warehouse_id"
                rules={[
                  {
                    required: true,
                    message: "Please input Warehouse!",
                  },
                ]}
              >
                <Select placeholder="Select Warehouse">
                  {warehouses.map((warehouse) => (
                    <Select.Option value={warehouse.id} key={warehouse.id}>
                      {warehouse.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Created By" name="created_by_name">
                <Input placeholder=" Created By" readOnly={true} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              {/* <Form.Item
                label="Barcode"
                name="barcode"
                rules={[
                  {
                    required: true,
                    message: "Please input Barcode!",
                  },
                ]}
              >
                <Input placeholder="Input Barcode" />
              </Form.Item> */}
              <Form.Item label="Company" name="company_account_id">
                <Select placeholder="Select Company" disabled>
                  {companies.map((company) => (
                    <Select.Option value={company.id} key={company.id}>
                      {company.account_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Received Date"
                name="received_date"
                rules={[
                  {
                    required: true,
                    message: "Please input Received Date!",
                  },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                label="Return to Vendor"
                name="vendor"
                rules={[
                  {
                    required: true,
                    message: "Please Return vendor!",
                  },
                ]}
              >
                <Select placeholder="Select Return vendor">
                  {vendors.map((vendor) => (
                    <Select.Option value={vendor.name} key={vendor.code}>
                      {vendor.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item
                label="Expired Date"
                name="expired_date"
                rules={[
                  {
                    required: true,
                    message: "Please input Expired Date!",
                  },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item> */}
              <Form.Item label="Created On" name="created_on">
                <Input placeholder=" Created On" readOnly={true} />
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item label="Notes" name="note">
                <TextArea placeholder=" Notes" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Case Type"
                name="case_type"
                rules={[
                  {
                    required: true,
                    message: "Please input Case Type!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Case Type"
                  className="w-full"
                  onChange={(e) => {
                    setSelectedCase(e)
                    setNewCaselists(caseLists.filter((item) => item.type === e))
                    form.setFieldsValue({ case_return: null })
                  }}
                >
                  <Select.Option value={"manual"}>Manual</Select.Option>
                  <Select.Option value={"refund"}>Refund</Select.Option>
                  <Select.Option value={"return"}>Return</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Case Return"
                name="case_title"
                rules={[
                  {
                    required: selectedCase ? true : false,
                    message: "Please input Case Return!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Case Return"
                  className="w-full"
                  disabled={!selectedCase}
                  onChange={(e) => {
                    const caseSelected = newCaselists.find(
                      (item) => item.name === e
                    )
                    loadProductCase({
                      case_type: caseSelected.type,
                      case_title: caseSelected.name,
                    })
                  }}
                >
                  {newCaselists.map((caseList) => (
                    <Select.Option value={caseList.name} key={caseList.id}>
                      {caseList.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>

      <div className="card mt-8">
        <div className="card-header">
          <div className="header-titl">
            <strong>Informasi Product Return Product</strong>
          </div>
        </div>

        <div className="card-body">
          <ProductList
            data={productData}
            products={products}
            cases={caseLists}
            disabled={{
              product_id: false,
              qty_alocation: false,
            }}
            columns={productListReturnColumns}
            handleChange={handleChangeProductItem}
            handleClick={handleClickProductItem}
          />
        </div>
      </div>

      {/* <div className="card p-6 ">
        <table width={"20%"} className="table-auto">
          <tr>
            <td>Total Qty</td>
            <td>:</td>
            <td>{productData.reduce((prev, curr) => prev + curr.qty, 0)}</td>
          </tr>
          <tr>
            <td>Sub Total</td>
            <td>:</td>
            <td>{subTotal}</td>
          </tr>
          <tr>
            <td>
              <strong>Total Price</strong>
            </td>
            <td>:</td>
            <td>
              <strong>{totalPrice}</strong>
            </td>
          </tr>
        </table>
      </div> */}

      <div className="card p-6 ">
        <div className="flex justify-end">
          <Button color={"success"} onClick={() => form.submit()}>
            Simpan
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default InventoryProductReturnForm
