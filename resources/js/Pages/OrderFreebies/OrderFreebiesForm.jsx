import {
  CheckOutlined,
  CloseOutlined,
  FileOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Switch,
  Table,
  Upload,
  message,
} from "antd"
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
import FormAddressModal from "../Contact/Components/FormAddressModal"

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
      qty: 0,
      tax_id: null,
      discount_id: null,
      total: null,
      uid_retur: uid_lead,
      id: 0,
      stock: 0,
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
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [contactList, setContactList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [showBin, setShowBin] = useState(false)
  const [masterBin, setMasterBin] = useState([])
  const [status, setStatus] = useState(0)
  const [userAddress, setUserAddress] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showDropdownAddress, setShowDropdownAddress] = useState(true)

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
    const size = list.size / 1024
    if (size > 1024) {
      setLoadingAtachment((loading) => ({ ...loading, [field]: false }))
      return message.error("Maksimum ukuran file adalah 1 MB")
    }
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

  const loadMasterBin = () => {
    axios.get("/api/master/bin").then((res) => {
      setMasterBin(res.data.data)
    })
  }

  const loadTop = () => {
    axios.get("/api/master/top").then((res) => {
      setTermOfPayments(res.data.data)
    })
  }

  const loadUserAddress = (id) => {
    axios.get("/api/general/user-with-address/" + id).then((res) => {
      setUserAddress(res.data.data)
    })
  }

  const loadProducts = (warehouse_id) => {
    axios.get("/api/master/products/sales-offline").then((res) => {
      const { data } = res.data
      const newData = data.map((item) => {
        const stock_warehouse =
          (item.stock_warehouse &&
            item.stock_warehouse.length > 0 &&
            item?.stock_warehouse) ||
          []
        const stock_off_market = stock_warehouse.find(
          (item) => item.id == warehouse_id
        )
        return {
          ...item,
          stock_off_market: stock_off_market?.stock || 0,
        }
      })

      // const newProductItems = productItems.map((item) => {
      //   return {
      //     ...item,
      //     product_id: null,
      //     price: null,
      //     price_nego: null,
      //     qty: 0,
      //     tax_id: null,
      //     discount_id: null,
      //     total: null,
      //     uid_retur: uid_lead,
      //     stock: 0,
      //   }
      // })
      // setProductItems(newProductItems)
      setProducts(newData)
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
          loadUserAddress(data?.contact_user?.id)
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
      console.log(data, "data")
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
            stock: item?.product?.stock_off_market,
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
    loadMasterBin()
    loadTop()
    loadTaxs()
    loadDiscounts()
    loadProductDetail()
    handleGetContact()
    handleGetSales()
    getProductNeed()
  }, [])

  useEffect(() => {
    if (!showDropdownAddress) {
      setTimeout(() => {
        setShowDropdownAddress(true)
      }, 1000)
    }
  }, [showDropdownAddress])

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
    setLoadingSubmit(true)
    const hasProduct = productItems.every((item) => item.product_id)
    if (!hasProduct) {
      setLoadingSubmit(false)
      toast.error("Product harus diisi", {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }

    const hasQty = productItems.every((item) => item.qty > 0)
    if (!hasQty) {
      setLoadingSubmit(false)
      toast.error("Minimal Pembalian adalah 1", {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
    if (!selectedAddress) {
      toast.error("Alamat Belum Dipilih", {
        position: toast.POSITION.TOP_RIGHT,
      })
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
    if (selectedAddress) {
      formData.append("address_id", selectedAddress)
    }
    if (values.contact.value) {
      formData.append("contact", values.contact.value)
    }

    if (values.sales.value) {
      formData.append("sales", values.sales.value)
    }
    formData.append("status", status)
    if (detail?.kode_unik) {
      formData.append("kode_unik", detail?.kode_unik)
    }
    if (values.customer_need) {
      formData.append("customer_need", values.customer_need)
    }
    formData.append("product_items", JSON.stringify(productItems))
    formData.append("account_id", getItem("account_id"))
    formData.append("type", "freebies")

    axios
      .post("/api/freebies/form/save", formData)
      .then((res) => {
        toast.success("Data berhasil disimpan", {
          position: toast.POSITION.TOP_RIGHT,
        })
        setFileList({
          attachment: null,
        })
        setFileUrl({
          attachment: null,
          struct: null,
        })
        setLoadingSubmit(false)
        return navigate("/order/freebies")
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error("Data Gagal Disimpan", {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoadingSubmit(false)
      })
  }

  if (loading) {
    return (
      <Layout title="Detail" href="/order/freebies">
        <LoadingFallback />
      </Layout>
    )
  }

  console.log(productItems)
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
                    loadUserAddress(val?.value)
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
                  onChange={(e) => {
                    setShowBin(e === 3 ? true : false)
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
            {showBin && (
              <div className={"col-md-4"}>
                <Form.Item
                  label=" Lokasi BIN"
                  name="master_bin_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Warehouse!",
                    },
                  ]}
                >
                  <Select placeholder="Pilih Lokasi BIN">
                    {masterBin.map((bin) => (
                      <Select.Option value={bin.id} key={bin.id}>
                        {bin.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            )}
            <div className={showBin ? "col-md-8" : "col-md-12"}>
              <Form.Item label="Customer Need" name="customer_need">
                <Input placeholder="Ketik Customer Need" />
              </Form.Item>
            </div>
            <div className="col-md-12">
              {/* <Form.Item
                label=" Contact Address"
                name="address_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Contact Address!",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Contact Address"
                  dropdownStyle={{ zIndex: 2 }}
                  dropdownRender={(menu) => (
                    <div className="px-2 mx-auto  z-50">
                      {menu}
                      <div className="text-center">
                        <Divider
                          style={{
                            margin: "8px 0",
                          }}
                        />

                        <FormAddressModal
                          initialValues={{
                            user_id: userAddress?.id,
                            nama: userAddress?.name,
                            telepon: userAddress?.telepon || userAddress?.phone,
                          }}
                          refetch={() => loadUserAddress(userAddress?.id)}
                        />
                      </div>
                    </div>
                  )}
                >
                  {userAddress?.address?.map((bin) => (
                    <Select.Option value={bin.id} key={bin.id}>
                      {bin.alamat_detail}
                    </Select.Option>
                  )) || []}
                </Select>
              </Form.Item> */}
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

      <Card
        title="Informasi Alamat"
        className="mt-4"
        extra={
          <FormAddressModal
            initialValues={{
              user_id: userAddress?.id,
              nama: userAddress?.name,
              telepon: userAddress?.telepon || userAddress?.phone,
            }}
            refetch={() => loadUserAddress(userAddress?.id)}
          />
        }
      >
        <Table
          dataSource={userAddress?.address || []}
          columns={[
            {
              title: "No.",
              dataIndex: "no",
              key: "no",
              render: (_, record, index) => index + 1,
            },
            {
              title: "Alamat",
              dataIndex: "alamat_detail",
              key: "alamat_detail",
            },
            {
              title: "Pilih",
              dataIndex: "action",
              key: "action",
              render: (_, record) => {
                return (
                  <Switch
                    onChange={(e) => {
                      // if (selectedAddress) {
                      //   return setSelectedAddress(null)
                      // }
                      return setSelectedAddress(record.id)
                    }}
                    checked={selectedAddress == record.id}
                  />
                )
              },
            },
          ]}
          key={"id"}
          pagination={false}
        />
      </Card>

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
                if (loadingSubmit) {
                  return null
                }
                setStatus(-1)
                setTimeout(() => {
                  console.log("status", status)
                  form.submit()
                }, 1000)
              }}
              className={`text-blue bg-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 border font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2`}
            >
              {loadingSubmit ? (
                <LoadingOutlined />
              ) : (
                <span className="ml-2">Save Draft</span>
              )}
            </button>
          )}
          <button
            onClick={() => {
              if (loadingSubmit) {
                return null
              }
              setStatus(1)
              setTimeout(() => {
                form.submit()
              }, 1000)
            }}
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
          >
            {loadingSubmit ? (
              <LoadingOutlined />
            ) : (
              <span className="ml-2">Save Order</span>
            )}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default OrderFreebiesForm
