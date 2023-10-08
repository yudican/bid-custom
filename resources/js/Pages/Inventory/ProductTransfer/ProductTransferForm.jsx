import { Button, Form, Input, message, Select } from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import { formatDate, getItem, inArray } from "../../../helpers"
import ProductList from "../Components/ProductList"
import {
  productListAllocationHistoryColumns,
  productListColumns,
} from "../config"

const ProductTransferForm = () => {
  const [form] = Form.useForm()
  const { inventory_id } = useParams()
  // hooks
  const navigate = useNavigate()
  // state
  const intialProduct = {
    id: 0,
    key: 0,
    product_id: null,
    price: 0,
    qty: 1,
    qty_alocation: 0,
    sub_total: 0,
    from_warehouse_id: null,
    to_warehouse_id: null,
    sku: null,
    u_of_m: null,
  }
  const [productData, setProductData] = useState([intialProduct])
  const [historyAllocation, setHistoryAllocation] = useState([])
  const [selectedPo, setSelectedPo] = useState(null)
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [detailPo, setDetailPo] = useState(null)

  // api
  const loadProducts = () => {
    axios.get("/api/master/product-lists").then((res) => {
      setProducts(res.data.data)
    })
  }

  const loadWarehouse = () => {
    axios.get("/api/master/warehouse").then((res) => {
      setWarehouses(res.data.data)
    })
  }

  const loadProductStock = (value) => {
    axios.post("/api/master/product/stocks", value).then((res) => {
      const products = res.data.data

      const newProduct = products.map((item, index) => {
        return {
          ...item,
          key: index,
          qty_alocation: item?.qty,
        }
      })

      setProductData(newProduct)
    })
  }

  const loadInventoryDetail = () => {
    axios.get(`/api/inventory/product/detail/${inventory_id}`).then((res) => {
      const { data } = res.data
      form.setFieldsValue({
        ...data,
        from_warehouse_id: data?.warehouse_id,
        to_warehouse_id: data?.destination_warehouse_id,
        received_date: formatDate(data.received_date),
      })

      const newhistory = data.history_allocations.map((item, index) => {
        return {
          ...item,
          key: index,
          qty: item.quantity,
        }
      })

      loadProductStock({
        product_id: data.product_id,
        warehouse_id: data.warehouse_id,
      })

      setDetailPo(data?.selected_po)
      setSelectedPo(data?.selected_po)
      setHistoryAllocation(newhistory)
      // setProductData(newProducts)
    })
  }

  const getCreatedInfo = () => {
    axios.get("/api/inventory/info/created").then((res) => {
      form.setFieldsValue(res.data)
    })
  }

  // cycle
  useEffect(() => {
    loadProducts()
    loadWarehouse()
    if (inventory_id) {
      loadInventoryDetail()
    } else {
      getCreatedInfo()
    }
  }, [])
  const handleChangeProductItem = ({ dataIndex, value, key }) => {
    const datas = [...productData]
    const from_warehouse_id = datas[key].from_warehouse_id
    const to_warehouse_id = datas[key].to_warehouse_id

    if (value === null) {
      datas[key][dataIndex] = null
      return setProductData(datas)
    }

    if (dataIndex === "from_warehouse_id") {
      if (to_warehouse_id === value) {
        return message.error(
          "From warehouse tidak boleh sama dengan to warehouse"
        )
      }
      datas[key][dataIndex] = value
    }

    if (dataIndex === "to_warehouse_id") {
      if (from_warehouse_id === value) {
        return message.error(
          "From warehouse tidak boleh sama dengan to warehouse"
        )
      }
      const exist = datas.find((item) => item.to_warehouse_id === value)
      if (exist) {
        const newData = datas.filter((item) => item.key !== key)
        return setProductData(newData)
      } else {
        datas[key][dataIndex] = value
      }
    }

    if (dataIndex === "qty_alocation") {
      datas[key][dataIndex] = value
    }

    setProductData(datas)
  }

  const handleClickProductItem = ({ key, type }) => {
    const datas = [...productData]
    if (type === "add") {
      const lastData = datas[datas.length - 1]
      datas.push({
        key: lastData.key + 1,
        id: 0,
        product_id: lastData.product_id,
        price: 0,
        qty: 1,
        qty_alocation: 0,
        sub_total: 0,
        from_warehouse_id: lastData.from_warehouse_id,
        to_warehouse_id: null,
        sku: lastData.sku,
        u_of_m: lastData.u_of_m,
      })
      return setProductData(datas)
    }

    if (type === "add-qty") {
      const item = datas[key]
      if (item.qty_alocation + 1 <= item.qty) {
        const qty_alocation = item.qty_alocation + 1
        datas[key]["qty_alocation"] = qty_alocation
        return setProductData(datas)
      }

      return null
    }

    if (type === "remove-qty") {
      const item = datas[key]
      if (item.qty_alocation > 1) {
        const qty_alocation = item.qty_alocation - 1
        datas[key]["qty_alocation"] = qty_alocation
        return setProductData(datas)
      }
      return setProductData(datas)
    }

    const newData = datas.filter((item) => item.key !== key)
    return setProductData(newData)
  }

  const onFinish = (values) => {
    const productItem = productData.every((item) => item.to_warehouse_id)
    if (!productItem) {
      return message.error("Please select product")
    }

    const data = {
      ...values,
      po_number: selectedPo?.po_number,
      created_by: selectedPo?.created_by,
      items: productData,
      note: values.notes,
      account_id: getItem("account_id"),
    }
    let url = "/api/inventory/product/transfer/save"
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

  const canAllocated =
    inArray(getItem("role"), ["warehouse", "finance", "superadmin"]) &&
    productData.length > 0

  const disabled = inventory_id
  return (
    <Layout onClick={() => navigate(-1)} title="Detail Stock Product Transfer">
      <div className="card">
        <div className="card-header">
          <div className="header-titl">
            <strong>Form Received Product</strong>
          </div>
        </div>
        <div className="card-body">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <div className="row">
              <div className="col-md-12">
                <Form.Item
                  label="Product"
                  name="product_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input Product!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Product"
                    onChange={(e) => {
                      const newProduct = productData.map((item) => {
                        const product = products.find((row) => row.id === e)
                        return {
                          ...item,
                          product_id: e,
                          price: product.price,
                          sku: product.sku || "-",
                          u_of_m: product.u_of_m,
                          qty: product.stock,
                        }
                      })

                      setProductData(newProduct)
                    }}
                    disabled={disabled}
                  >
                    {products.map((product) => (
                      <Select.Option value={product.id} key={product.id}>
                        {product.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Created On" name="created_on">
                  <Input
                    placeholder=" Created On"
                    disabled
                    // bordered={false}
                  />
                </Form.Item>
                <Form.Item label="Created By" name="created_by_name">
                  <Input placeholder=" Created By" disabled />
                </Form.Item>
              </div>
              <div className="col-md-6">
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
                  <Select
                    placeholder="Select Warehouse"
                    onChange={(e) => {
                      setDetailPo({ warehouse_id: e })
                      const product_id = form.getFieldValue("product_id")
                      loadProductStock({
                        product_id,
                        warehouse_id: e,
                      })
                    }}
                    disabled={disabled}
                  >
                    {warehouses.map((warehouse) => (
                      <Select.Option value={warehouse.id} key={warehouse.id}>
                        {warehouse.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Destination Location"
                  name="to_warehouse_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input Destination Location!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Destination Location"
                    onChange={(e) => {
                      const newProduct = productData.map((item) => {
                        return {
                          ...item,
                          to_warehouse_id: e,
                        }
                      })
                      setProductData(newProduct)
                    }}
                    disabled={disabled}
                  >
                    {warehouses
                      .filter((item) => item.id !== detailPo?.warehouse_id)
                      .map((warehouse) => (
                        <Select.Option value={warehouse.id} key={warehouse.id}>
                          {warehouse.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Form.Item label="Notes" name="notes">
                  <TextArea placeholder=" Notes" disabled={disabled} />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="header-titl">
            <strong>Detail Product</strong>
          </div>
        </div>
        <div className="card-body">
          <ProductList
            data={productData}
            products={products}
            warehouses={warehouses}
            columns={productListColumns.filter(
              (item) => !inArray(item.dataIndex, ["action"])
            )}
            disabled={{
              from_warehouse_id: true,
              qty: true,
              product_id: true,
              to_warehouse_id: true,
              action: true,
              qty_alocation: inventory_id,
            }}
            handleChange={handleChangeProductItem}
            handleClick={handleClickProductItem}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="header-titl">
            <strong>Allocation History</strong>
          </div>
        </div>
        <div className="card-body">
          <ProductList
            data={historyAllocation}
            products={products}
            warehouses={warehouses}
            columns={productListAllocationHistoryColumns}
            disabled={{
              from_warehouse_id: true,
              qty: true,
              product_id: true,
              to_warehouse_id: true,
              qty_alocation: true,
            }}
            handleChange={handleChangeProductItem}
          />
        </div>
      </div>

      {canAllocated && (
        <>
          {!disabled && (
            <div className="card p-6 ">
              <div className="flex justify-end">
                <Button
                  style={{
                    backgroundColor: "#1A56DC",
                    borderColor: "#1A56DC",
                    color: "white",
                  }}
                  onClick={() => form.submit()}
                >
                  Proses Allocated
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export default ProductTransferForm
