import { CheckOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card, Form, Input, Select, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import LoadingFallback from "../../components/LoadingFallback"
import { formatNumber, getItem } from "../../helpers"
import ModalBillingReject from "../OrderLead/Components/ModalBillingReject"
import ModalBilling from "./Components/ModalBilling"
import ProductList from "./Components/ProductList"
import { billingColumns } from "./config"
import { searchContact, searchSales } from "./service"

const OrderManualLeadForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const role = getItem("role")
  const userData = getItem("user_data", true)
  const { uid_lead } = useParams()
  const defaultItems = [
    {
      product_id: null,
      price: null,
      qty: 1,
      tax_id: null,
      discount_id: null,
      final_price: null,
      total_price: null,
      uid_lead,
      margin_price: 0,
      price_product: 0,
      price_nego: 0,
      total_price_nego: 0,
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
  const [billingData, setBilingData] = useState([])
  const [loading, setLoading] = useState(false)
  const [contactList, setContactList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [showBilling, setShowBilling] = useState(false)
  const [status, setStatus] = useState(0)
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
      //   // const stock_warehouse =
      //   //   (item.stock_warehouse &&
      //   //     item.stock_warehouse.length > 0 &&
      //   //     item?.stock_warehouse) ||
      //   //   []
      //   // const stock_off_market = stock_warehouse.find(
      //   //   (item) => item.id == warehouse_id
      //   // )
      //   return {
      //     ...item,
      //     // stock_off_market: stock_off_market?.stock || 0,
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

  const getOrderBilling = () => {
    axios.get(`/api/order-manual/billing/list/${uid_lead}`).then((res) => {
      const { data } = res.data
      if (data && data.length > 0) {
        const dataBillings = data.map((item) => {
          return {
            id: item.id,
            account_name: item.account_name,
            account_bank: item.account_bank,
            total_transfer: formatNumber(item.total_transfer),
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
        setBilingData(dataBillings)
      }
    })
  }

  const loadProductDetail = (updateForm = true) => {
    setLoading(true)
    axios
      .get(`/api/order-manual/${uid_lead}`)
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
          setShowBilling(forms.payment_terms === 4 ? true : false)
          loadProducts(data?.warehouse_id)
        }

        getOrderBilling()
      })
      .catch((e) => setLoading(false))
  }

  const getProductNeed = () => {
    axios.get(`/api/order-manual/product-need/${uid_lead}`).then((res) => {
      const { data } = res.data
      if (data && data.length > 0) {
        const newData = data?.map((item, index) => {
          return {
            key: index,
            id: item.id,
            product: item?.product?.name || "-",
            product_id: item?.product_id,
            price: formatNumber(item?.prices?.final_price),
            qty: item?.qty,
            total_price: formatNumber(item?.prices?.final_price * item?.qty),
            final_price: formatNumber(item?.final_price),
            margin_price: formatNumber(item?.margin_price),
            discount_id: item?.discount_id,
            tax_id: item?.tax_id,
            tax_amount: formatNumber(item?.tax_amount),
            uid_lead,
            price_nego: item?.price_nego,
            price_product: formatNumber(item?.price),
            total_price_nego: formatNumber(item?.price_nego),
            disabled_discount: item?.disabled_discount,
            disabled_price_nego: item?.disabled_price_nego,
          }
        })
        setProductItems(newData)
        loadProductDetail(false)
      }
    })
  }

  useEffect(() => {
    getOrderBilling()
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

  const handleChangeProductPrice = ({ dataIndex, value, key }) => {
    console.log(dataIndex, value, "handle change product price")
    const data = [...productItems]
    // if (dataIndex ==='qty'){}
    data[key][dataIndex] = value
    setProductItems(data)
  }

  const handleChangeProductItem = ({ dataIndex, value, key }) => {
    console.log(dataIndex, value, "handle change product")
    const record = productItems.find((item) => item.id === key) || {}
    setProductLoading(true)
    axios
      .post("/api/lead-master/product-needs", {
        ...record,
        [dataIndex]: parseInt(value),
        final_price: record?.price_nego,
        price: record?.price_product,
        key,
        item_id: key > 0 ? key : null,
      })
      .then((res) => {
        setProductLoading(false)
        getProductNeed()
      })
  }

  const productItem = (value) => {
    const item = value.type === "add" ? defaultItems[0] : {}
    setProductLoading(true)
    axios
      .post(`/api/order-manual/product-items/${value.type}`, {
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

    const billingStatus = showBilling ? 2 : 1
    const status_save = status < 0 ? status : billingStatus
    axios
      .post("/api/order-manual/form/save", {
        ...values,
        status: status_save,
        status_save: detail?.status,
        uid_lead,
        contact: values.contact.value,
        sales: values.sales.value,
        kode_unik: detail?.kode_unik,
        product_items: productItems,
        account_id: getItem("account_id"),
        type: "manual",
      })
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        return navigate("/order/manual/order-lead")
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
      <Layout title="Detail" href="/order/manual/order-lead">
        <LoadingFallback />
      </Layout>
    )
  }

  const billingActionColumn = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        if (record.status == 0) {
          if (detail?.amount_billing_approved > 0) {
            if (detail?.amount_billing_approved < detail?.amount) {
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
                    deposite: detail?.amount_deposite,
                    billing_approved: detail?.amount_billing_approved,
                    amount: detail?.amount,
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

  return (
    <Layout
      title="Order Manual Form"
      href="/order/manual/order-lead"
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
                  onChange={(e) => {
                    setShowBilling(e === 4 ? true : false)
                  }}
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
          onChange={handleChangeProductPrice}
          handleChange={handleChangeProductItem}
          handleClick={handleClickProductItem}
          loading={productLoading}
          summary={(pageData) => {
            if (productItems.length > 0) {
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell>Subtotal</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      {formatNumber(detail?.subtotal, "Rp ")}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell>Tax</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      {formatNumber(detail?.tax_amount, "Rp ")}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell>Discount</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      {formatNumber(detail?.discount_amount, "Rp ")}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell />
                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      {formatNumber(detail?.amount, "Rp ")}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                  </Table.Summary.Row>
                </>
              )
            }
          }}
        />
      </Card>

      {showBilling && (
        <div className="card mt-8">
          <div className="card-header flex justify-between items-center">
            <h1 className="header-title">Informasi Penagihan</h1>
            <ModalBilling
              detail={{ ...detail, uid_lead }}
              refetch={getOrderBilling}
              user={userData}
            />
          </div>
          <div className="card-body">
            <Table
              dataSource={billingData}
              columns={[...billingColumns]}
              loading={loading}
              pagination={false}
              rowKey="id"
              scroll={{ x: "max-content" }}
              tableLayout={"auto"}
            />
          </div>
        </div>
      )}

      {/* <div className="card mt-6 p-4 items-end">
        <button
          onClick={() => {
            if (productLoading) {
              toast.error("Please wait for the product to load")
              return
            }
            form.submit()
          }}
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
        >
          {productLoading && <LoadingOutlined />}{" "}
          <span className="ml-2">Save Order</span>
        </button>
      </div> */}
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

export default OrderManualLeadForm
