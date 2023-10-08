import {
  FileOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import { Button, Card, Form, Input, Select, Upload } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import LoadingFallback from "../../components/LoadingFallback"
import { getBase64, getItem } from "../../helpers"
import ProductList from "./Components/ProductList"
import { searchContact, searchSales } from "./service"

const OrderFreebiesForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const role = getItem("role")
  const userData = getItem("user_data", true)
  const { uid_lead } = useParams()
  const defaultItems = [
    {
      product_id: null,
      price: null,
      price_nego: null,
      qty: 1,
      tax_id: null,
      discount_id: null,
      total: null,
      uid_retur: uid_lead,
      id: 0,
      key: 0,
    },
  ]
  const [detail, setDetail] = useState(null)
  const [warehouses, setWarehouses] = useState([])
  const [termOfPayments, setTermOfPayments] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [taxs, setTaxs] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [productItems, setProductItems] = useState(defaultItems)
  const [productLoading, setProductLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contactList, setContactList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [status, setStatus] = useState(0)

  // attachments
  const [loadingAtachment, setLoadingAtachment] = useState({
    attachment: false,
  })

  const [fileUrl, setFileUrl] = useState({
    attachment: null,
    original_file_name: null,
  })

  const [fileList, setFileList] = useState({
    attachment: null,
  })

  const handleChange = ({ fileList, file, field }) => {
    const list = fileList.pop()
    setLoadingAtachment((loading) => ({ ...loading, [field]: true }))
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setLoadingAtachment((loading) => ({ ...loading, [field]: false }))
        setFileUrl((fileUrl) => ({
          ...fileUrl,
          original_file_name: file.name,
          [field]: url,
        }))
      })
      setFileList((fileList) => ({ ...fileList, [field]: list.originFileObj }))
    }, 1000)
  }

  const loadBrand = () => {
    axios.get("/api/master/brand").then((res) => {
      setBrands(res.data.data)
    })
  }

  const loadWarehouse = () => {
    axios.get("/api/master/warehouse").then((res) => {
      setWarehouses(res.data.data)
    })
  }

  const loadTop = () => {
    axios.get("/api/master/top").then((res) => {
      setTermOfPayments(res.data.data)
    })
  }

  const loadProducts = (warehouse_id) => {
    axios.get("/api/master/products/sales-offline").then((res) => {
      const { data } = res.data
      // const newData = data.map((item) => {
      //   const stock_warehouse =
      //     (item.stock_warehouse &&
      //       item.stock_warehouse.length > 0 &&
      //       item?.stock_warehouse) ||
      //     []
      //   const stock_off_market = stock_warehouse.find(
      //     (item) => item.id == warehouse_id
      //   )
      //   return {
      //     ...item,
      //     stock_off_market: stock_off_market?.stock || 0,
      //   }
      // })
      setProducts(data)
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

  const loadProductDetail = (updateForm = true) => {
    setLoading(true)
    axios
      .get(`/api/freebies/${uid_lead}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        setDetail(data)
        if (updateForm) {
          const forms = {
            ...data,
            contact: {
              label: data?.contact_name,
              value: data?.contact_user?.id,
            },
            sales: {
              label: data?.sales_user?.name,
              value: data?.sales_user?.id,
            },
            payment_terms: data?.payment_term?.id,
          }

          if (role === "sales") {
            forms.sales = {
              label: userData.name,
              value: userData.id,
            }
          }
          form.setFieldsValue(forms)
          loadProducts(data?.warehouse_id)
        }
        setFileUrl({
          original_file_name: data?.attachment,
          attachment: data?.attachment,
        })
      })
      .catch((e) => setLoading(false))
  }

  const getProductNeed = () => {
    axios.get(`/api/freebies/product-need/${uid_lead}`).then((res) => {
      const { data } = res.data
      if (data && data.length > 0) {
        const newData = data?.map((item, index) => {
          return {
            product_id: item.product_id,
            price: item?.prices?.final_price,
            price_nego: item.price_nego,
            qty: item.qty,
            tax_id: item.tax_id,
            discount_id: item.discount_id,
            total: item.total,
            uid_retur: uid_lead,
            id: item.id,
            key: index,
          }
        })
        setProductItems(newData)
        loadProductDetail(false)
      }
    })
  }

  useEffect(() => {
    loadBrand()
    loadWarehouse()
    loadTop()
    loadTaxs()
    loadDiscounts()
    loadProductDetail()
    getProductNeed()
    handleGetContact()
    handleGetSales()
  }, [])

  const handleGetContact = () => {
    searchContact(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })
      setContactList(newResult)
    })
  }

  const handleGetSales = () => {
    searchSales(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      setSalesList(newResult)
    })
  }

  const handleSearchContact = async (e) => {
    return searchContact(e).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      return newResult
    })
  }

  const handleSearchSales = async (e) => {
    return searchSales(e).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      return newResult
    })
  }

  const handleChangeItem = ({ dataIndex, value, uid_retur, key }) => {
    const newData = [...productItems]
    const index = newData.findIndex((item) => key === item.id)
    if (index > -1) {
      const item = newData[index]
      newData.splice(index, 1, { ...item, [dataIndex]: value })
      setProductItems(newData)
    }
  }
  const handleChangeProductItem = ({ dataIndex, value, uid_retur, key }) => {
    console.log(dataIndex, value, uid_retur, key)
    const record = productItems.find((item) => item.id === key) || {}
    setProductLoading(true)
    axios
      .post("/api/freebies/product-items", {
        ...record,
        [dataIndex]: value,
        uid_lead: uid_retur,
        key,
        item_id: key > 0 ? key : null,
      })
      .then((res) => {
        getProductNeed()
        setProductLoading(false)
      })
  }

  const productItem = (value) => {
    const item = value.type === "add" ? defaultItems[0] : {}
    setProductLoading(true)
    axios
      .post(`/api/freebies/product-items/${value.type}`, {
        ...value,
        ...item,
        item_id: value.key,
        uid_lead,
      })
      .then((res) => {
        const { message } = res.data
        getProductNeed()
        setProductLoading(false)
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }
  const handleClickProductItem = (value) => {
    productItem({ ...value, newData: false })
    if (productItems.length === 1 && productItems[0].id === 0) {
      productItem({ ...value, newData: true })
    }
  }

  const onFinish = (values) => {
    const hasProduct = productItems.every((item) => item.product_id)
    if (!hasProduct) {
      toast.error("Product harus diisi", {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }

    let formData = new FormData()

    if (fileList.attachment) {
      formData.append("attachment", fileList.attachment)
    }

    formData.append("uid_lead", uid_lead)
    formData.append("type_customer", values.type_customer)
    formData.append("brand_id", values.brand_id)
    formData.append("payment_terms", values.payment_terms)
    formData.append("warehouse_id", values.warehouse_id)
    formData.append("customer_need", values.customer_need)
    formData.append("contact", values.contact.value)
    formData.append("sales", values.sales.value)
    formData.append("status", status)
    formData.append("kode_unik", detail?.kode_unik)
    formData.append("product_items", JSON.stringify(productItems))
    formData.append("account_id", getItem("account_id"))
    formData.append("type", "freebies")

    axios
      .post("/api/freebies/form/save", formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setFileList({
          attachment: null,
        })
        setFileUrl({
          attachment: null,
          struct: null,
        })
        return navigate("/order/freebies")
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  if (loading) {
    return (
      <Layout title="Detail" href="/order/freebies">
        <LoadingFallback />
      </Layout>
    )
  }
  return (
    <Layout
      title="Order Manual Form"
      href="/order/freebies"
      // rightContent={rightContent}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Card title="Form Order">
          <div className="card-body row">
            <div className="col-md-4">
              <Form.Item
                label="Type Customer"
                name="type_customer"
                rules={[
                  {
                    required: true,
                    message: "Please input Type Customer!",
                  },
                ]}
              >
                <Select placeholder="Select Type Customer">
                  <Select.Option value={"new"} key={"new"}>
                    New Customer
                  </Select.Option>
                  <Select.Option value={"existing"} key={"existing"}>
                    Existing Customer
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Brand"
                name="brand_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Brand!",
                  },
                ]}
              >
                <Select placeholder="Select Brand">
                  {brands.map((brand) => (
                    <Select.Option value={brand.id} key={brand.id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                label="Contact"
                name="contact"
                rules={[
                  {
                    required: true,
                    message: "Please input Contact!",
                  },
                ]}
              >
                <DebounceSelect
                  showSearch
                  placeholder="Cari Contact"
                  fetchOptions={handleSearchContact}
                  filterOption={false}
                  defaultOptions={contactList}
                  className="w-full"
                  onChange={(val) => {
                    loadAddress(val?.value)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Payment Term"
                name="payment_terms"
                rules={[
                  {
                    required: true,
                    message: "Please input your Payment Term!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Payment Term"
                  onChange={(e) => getDueDate({ payment_terms: e })}
                >
                  {termOfPayments.map((top) => (
                    <Select.Option value={top.id} key={top.id}>
                      {top.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                label="Sales"
                name="sales"
                rules={[
                  {
                    required: true,
                    message: "Please input Sales!",
                  },
                ]}
              >
                <DebounceSelect
                  disabled={role === "sales"}
                  defaultOptions={
                    role === "sales"
                      ? [{ label: userData.name, value: userData.id }]
                      : salesList
                  }
                  showSearch
                  placeholder="Cari Sales"
                  fetchOptions={handleSearchSales}
                  filterOption={false}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                label="Warehouse"
                name="warehouse_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Warehouse!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Warehouse"
                  onChange={(e) => {
                    loadProducts(e)
                  }}
                >
                  {warehouses.map((warehouse) => (
                    <Select.Option value={warehouse.id} key={warehouse.id}>
                      {warehouse.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item label="Customer Need" name="customer_need">
                <Input placeholder="Ketik Customer Need" />
              </Form.Item>
              <Form.Item
                label="Attachment"
                name="attachment"
                rules={[
                  {
                    required: false,
                    message: "Please Attachment!",
                  },
                ]}
              >
                <Upload
                  name="attachments"
                  showUploadList={false}
                  multiple={false}
                  beforeUpload={() => false}
                  onChange={(e) => {
                    handleChange({
                      ...e,
                      field: "attachment",
                    })
                  }}
                >
                  {fileUrl.attachment ? (
                    loadingAtachment.attachment ? (
                      <LoadingOutlined />
                    ) : (
                      <Button icon={<LinkOutlined />}>
                        <span>{fileUrl?.original_file_name}</span>
                      </Button>
                    )
                  ) : (
                    <Button
                      icon={<UploadOutlined />}
                      loading={loadingAtachment.attachment}
                    >
                      Upload
                    </Button>
                  )}
                </Upload>
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>
      <Card title="Detail Product" className="mt-4">
        <ProductList
          data={productItems}
          products={products}
          taxs={taxs}
          discounts={discounts}
          handleChange={handleChangeProductItem}
          handleLocalChange={handleChangeItem}
          handleClick={handleClickProductItem}
          loading={productLoading}
        />
      </Card>

      <div className="float-right">
        <div className="  w-full mt-6 p-4 flex flex-row">
          {!detail && (
            <button
              onClick={() => {
                setStatus(-1)
                setTimeout(() => {
                  console.log("status", status)
                  form.submit()
                }, 1000)
              }}
              className={`text-blue bg-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 border font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2`}
            >
              <span className="ml-2">Save Draft</span>
            </button>
          )}
          <button
            onClick={() => {
              setStatus(1)
              setTimeout(() => {
                form.submit()
              }, 1000)
            }}
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
          >
            <span className="ml-2">Save Order</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default OrderFreebiesForm
