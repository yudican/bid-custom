import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Form, Input, Select, Space, Tag } from "antd"
import TextArea from "antd/lib/input/TextArea"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import {
  capitalizeEachWord,
  capitalizeString,
  formatNumber,
  getItem,
} from "../../helpers"
import ProductAdditionalList from "./Components/ProductAdditionalList"
import { searchContact } from "./services"

const notes = `Pembayaran akan diproses dengan dokumen-dokumen berikut 
-	Invoice Asli 
-	Faktur Pajak 
-	Surat Jalan 
-	Copy PO (Purchase Order) 
-	Jumlah pengiriman barang harus sesuai dengan PO (Purchase Order) \n
Semua dokumen diatas mohon dikirimkan ke PT Anugrah Inovasi Makmur Indonesia, Jl. Boulevard Raya, Ruko Malibu Blok J 128-129, Cengkareng Jakarta Barat.`

const PurchaseOrderForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { purchase_order_id } = useParams()

  // state
  const defaultItems = [
    {
      key: 0,
      id: null,
      product_id: null,
      sku: null,
      uom: null,
      harga_satuan: 0,
      qty: 1,
      tax_id: null,
      subtotal: 0,
      total: 0,
      tax_total: 0,
    },
  ]
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(0)
  const [productNeed, setProductNeed] = useState(defaultItems)
  const [warehouses, setWarehouses] = useState([])
  const [warehouseUsers, setWarehouseUsers] = useState([])
  const [companyLists, setCompanyList] = useState([])
  const [termOfPayments, setTermOfPayments] = useState([])
  const [products, setProducts] = useState([])
  const [productAdditionals, setProductAdditionals] = useState([])
  const [typePo, setTypePo] = useState("product")
  const [taxs, setTaxs] = useState([])
  const [packages, setPackages] = useState([])
  const [vendorCode, setVendorCode] = useState(null)
  const [showSelect, setShowSelect] = useState(false)
  const [vendors, setVendors] = useState([])
  const channelDistribution = ["sales-offline", "marketplace"]
  const [channel, setChannel] = useState(channelDistribution)

  const loadDetail = () => {
    setLoading(true)
    axios
      .get(`/api/purchase/purchase-order/${purchase_order_id}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        const forms = {
          ...data,
          warehouse_pic: {
            label: data?.warehouse_user_name,
            value: data?.warehouse_user_id,
          },
        }
        form.setFieldsValue(forms)
        if (data?.type_po === "product") {
          const items = data?.items.map((item, index) => {
            return {
              ...item,
              key: index,
              id: item.id,
              product_id: item.product_id,
              sku: item.product.sku,
              uom: item.product.u_of_m,
              harga_satuan: formatNumber(item.product.price.final_price),
              qty: item.qty,
              tax_id: item.tax_id,
              subtotal: formatNumber(item.subtotal),
              total: formatNumber(item.total_amount),
              tax_total: item.tax_amount,
            }
          })

          setProductNeed(items)
        } else {
          const items = data?.items.map((item, index) => {
            return {
              ...item,
              key: index,
              id: item.id,
              product_id: item.product_id,
              sku: item.product.sku,
              uom: item.product.u_of_m,
              harga_satuan: item.price,
              qty: item.qty,
              tax_id: item.tax_id,
              subtotal: item.subtotal,
              total: item.total_amount,
              tax_total: item.tax_amount,
            }
          })

          setProductNeed(items)
        }
      })
      .catch((e) => setLoading(false))
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

  const loadVendors = () => {
    axios.get("/api/master/vendors").then((res) => {
      setVendors(res.data.data)
    })
  }

  const loadProducts = () => {
    axios.get("/api/master/product-lists").then((res) => {
      setProducts(res.data.data)
    })
  }

  const loadProductAdditionals = (type) => {
    axios.get("/api/master/products/additional/" + type).then((res) => {
      setProductAdditionals(res.data.data)
    })
  }

  const loadTaxs = () => {
    axios.get("/api/master/taxs").then((res) => {
      setTaxs(res.data.data)
    })
  }
  const loadCompanyAccount = () => {
    axios.get("/api/master/company-account").then((res) => {
      setCompanyList(res.data.data)
    })
  }

  // load user
  const handleSearchContact = async (e) => {
    return searchContact(e).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      return newResult
    })
  }

  // debounced search
  const handleGetContact = () => {
    searchContact(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })
      setWarehouseUsers(newResult)
    })
  }

  const loadPackages = () => {
    axios.get("/api/master/package").then((res) => {
      const { data } = res.data
      setPackages(data)
    })
  }

  useEffect(() => {
    if (purchase_order_id) {
      loadDetail()
    }
    loadCompanyAccount()
    handleGetContact()
    loadWarehouse()
    loadTop()
    loadProducts()
    loadTaxs()
    loadPackages()
    loadVendors()
    form.setFieldsValue({
      currency_id: "Rp",
      notes,
      company_id: parseInt(getItem("account_id")),
    })
  }, [purchase_order_id])

  const handleChangeProductItem = ({ dataIndex, value, key, poType }) => {
    const datas = [...productNeed]
    const qty = datas[key]["qty"]
    const tax_id = datas[key]["tax_id"]
    const tax_total = datas[key]["tax_total"]
    const price = datas[key]["harga_satuan"]
    const subtotal = datas[key]["subtotal"]
    const total = datas[key]["total"]

    if (dataIndex === "product_id") {
      let product = products.find((product) => product.id === value)
      if (poType === "additional") {
        product = productAdditionals.find((product) => product.id === value)
      }

      datas[key]["sku"] = product?.sku
      datas[key]["uom"] = product?.u_of_m || null
      datas[key]["product_id"] = value
      datas[key]["harga_satuan"] = 0 || 0
      datas[key]["subtotal"] = 0 * qty || 0
      datas[key]["total"] = 0 * qty + tax_total || 0
    } else if (dataIndex === "harga_satuan") {
      datas[key]["harga_satuan"] = value
      datas[key]["qty"] = qty
      datas[key]["subtotal"] = qty * value

      const tax = taxs.find((tax) => tax.id === tax_id)
      if (tax?.tax_percentage > 0) {
        const taxPercentage = tax.tax_percentage / 100
        const totalTax = qty * value * taxPercentage
        datas[key]["tax_total"] = totalTax
        datas[key]["subtotal"] = qty * value
        datas[key]["total"] = qty * value + totalTax
      } else {
        datas[key]["total"] = qty * value
      }
    } else if (dataIndex === "qty") {
      datas[key]["qty"] = value
      datas[key]["subtotal"] = price * value
      datas[key]["total"] = price * value + tax_total
    } else if (dataIndex === "tax_id") {
      const tax = taxs.find((tax) => tax.id === value)
      datas[key][dataIndex] = value
      if (tax.tax_percentage > 0) {
        const taxPercentage = tax.tax_percentage / 100
        const totalTax = subtotal * taxPercentage
        datas[key]["tax_total"] = totalTax
        datas[key]["subtotal"] = subtotal
        datas[key]["total"] = total + totalTax
      } else {
        datas[key]["total"] = subtotal * qty
      }
    } else {
      datas[key][dataIndex] = value
    }
    setProductNeed(datas)
  }

  const handleClickProductItem = ({ key, type, poType }) => {
    const datas = [...productNeed]
    if (type === "add") {
      const lastData = datas[datas.length - 1]
      datas.push({
        key: lastData.key + 1,
        id: null,
        product_id: null,
        sku: null,
        uom: null,
        harga_satuan: 0,
        qty: 1,
        tax_id: null,
        subtotal: 0,
        total: 0,
        tax_total: 0,
      })
      return setProductNeed(datas)
    }

    if (type === "add-qty") {
      const item = datas[key]
      const qty = item.qty + 1
      const tax = taxs.find((tax) => tax.id === item.tax_id)
      datas[key]["qty"] = qty
      const subtotal = item.harga_satuan * qty
      if (tax) {
        if (tax.tax_percentage > 0) {
          const taxPercentage = tax.tax_percentage / 100
          const totalTax = subtotal * taxPercentage
          datas[key]["tax_total"] = totalTax
          datas[key]["subtotal"] = subtotal
          datas[key]["total"] = subtotal + totalTax
        } else {
          datas[key]["total"] = subtotal
        }
      } else {
        datas[key]["subtotal"] = subtotal
        datas[key]["total"] = subtotal
      }
      return setProductNeed(datas)
    }

    if (type === "remove-qty") {
      const item = datas[key]
      if (item.qty > 1) {
        const qty = item.qty - 1
        const tax = taxs.find((tax) => tax.id === item.tax_id)
        datas[key]["qty"] = qty
        const subtotal = item.harga_satuan * qty
        if (tax) {
          if (tax.tax_percentage > 0) {
            const taxPercentage = tax.tax_percentage / 100
            const totalTax = subtotal * taxPercentage
            datas[key]["tax_total"] = totalTax
            datas[key]["subtotal"] = subtotal
            datas[key]["total"] = subtotal + totalTax
          } else {
            datas[key]["total"] = subtotal
          }
        } else {
          datas[key]["subtotal"] = subtotal
          datas[key]["total"] = subtotal
        }
        return setProductNeed(datas)
      }
      return setProductNeed(datas)
    }

    const newData = datas.filter((item) => item.key !== key)
    return setProductNeed(newData)
  }

  const onFinish = (values) => {
    setLoading(true)
    console.log(productNeed, values)
    let items = productNeed.map((item) => {
      if (item.product_id) {
        return {
          id: item?.id,
          product_id: item.product_id,
          qty: item.qty,
          tax_id: item.tax_id,
          uom: item.uom,
          price: item.harga_satuan,
          account_id: getItem("account_id"),
        }
      }
    })

    const form = {
      ...values,
      warehouse_user_id: values.warehouse_pic.value,
      channel: values.channel.join(""),
      status,
      items,
    }

    const url = purchase_order_id ? `/save/${purchase_order_id}` : "/save"
    axios
      .post("/api/purchase/purchase-order" + url, form)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoading(false)
        return navigate("/purchase/purchase-order")
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoading(false)
      })
  }

  return (
    <>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Layout
          title="Tambah Data Purchase Order"
          href="/purchase/purchase-order"
          // rightContent={rightContent}
        >
          <Card
            title="Informasi Purchase Order"
            extra={
              <div className="flex justify-end items-center">
                <strong>Status :</strong>
                <Button
                  type="outline"
                  size={"middle"}
                  style={{
                    marginLeft: 10,
                  }}
                >
                  Draft
                </Button>
              </div>
            }
          >
            <div className="row">
              <div className="col-md-12">
                <Form.Item
                  label="Company"
                  name="company_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input Company!",
                    },
                  ]}
                >
                  <Select placeholder="Silahkan pilih">
                    {companyLists.map((company) => (
                      <Select.Option key={company.id} value={company.id}>
                        {company.account_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Vendor Code"
                  name="vendor_code"
                  rules={[
                    {
                      required: true,
                      message: "Please input Vendor Code!",
                    },
                  ]}
                >
                  {/* <Input placeholder="Silahkan input vendor code.." /> */}
                  <Select
                    className="w-full"
                    placeholder="Pilih vendor code"
                    onChange={(value) => {
                      const vendor = vendors.find((item) => item.code === value)
                      form.setFieldsValue({
                        vendor_code: value,
                        vendor_name: vendor.name,
                      })
                      setShowSelect(false)
                    }}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider
                          style={{
                            margin: "8px 0",
                          }}
                        />
                        <Space
                          style={{
                            padding: "0 8px 4px",
                          }}
                        >
                          <Input
                            placeholder="Please enter item"
                            value={vendorCode}
                            onChange={(e) => setVendorCode(e.target.value)}
                            className="w-full"
                          />
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              form.setFieldsValue({
                                vendor_code: vendorCode,
                                vendor_name: null,
                              })
                              setShowSelect(false)
                            }}
                          >
                            Add item
                          </Button>
                        </Space>
                      </>
                    )}
                    options={vendors.map((vendor) => {
                      return {
                        value: vendor.code,
                        label: vendor.code,
                      }
                    })}
                  />
                </Form.Item>
                <Form.Item
                  label="Type Po"
                  name="type_po"
                  rules={[
                    {
                      required: true,
                      message: "Please input Type Po!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Silahkan pilih"
                    onChange={(e) => {
                      setTypePo(e)
                      if (e !== "product") {
                        return loadProductAdditionals(e)
                      }
                    }}
                  >
                    <Select.Option value={"product"}>Product</Select.Option>
                    <Select.Option value={"pengemasan"}>
                      Pengemasan
                    </Select.Option>
                    <Select.Option value={"perlengkapan"}>
                      Perlengkapan
                    </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Payment Term"
                  name="payment_term_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Payment Term!",
                    },
                  ]}
                >
                  <Select placeholder="Silahkan pilih">
                    {termOfPayments.map((top) => (
                      <Select.Option key={top.id} value={top.id}>
                        {top.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Vendor Name"
                  name="vendor_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input Vendor Name!",
                    },
                  ]}
                >
                  <Input placeholder="Silahkan input vendor name.." />
                </Form.Item>
                <Form.Item
                  label="Channel Distribution (Tag)"
                  name="channel"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input Channel Distribution!",
                  //   },
                  // ]}
                >
                  <Select
                    onChange={(value, options) => {
                      // update data only when select one item or clear action
                      if (options?.length === 0 || options?.length === 1) {
                        setChannel(value)
                      }
                    }}
                    mode="tags"
                    placeholder="Silahkan pilih"
                    onDeselect={() => setChannel(channelDistribution)} // revert channel selection
                  >
                    {channel.map((value, index) => (
                      <Select.Option key={index} value={value}>
                        {capitalizeEachWord(value.replace("-", " "))}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Currency ID"
                  name="currency"
                  rules={[
                    {
                      required: false,
                      message: "Please input your Currency ID!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Silahkan input.."
                    defaultValue={"Rp"}
                    disabled
                  />
                </Form.Item>
              </div>

              <div className="col-md-12">
                <Form.Item
                  requiredMark={"optional"}
                  label="Notes"
                  name="notes"
                  rules={[
                    {
                      required: false,
                      message: "Please input your Warehouse!",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Silahkan input catatan.."
                    showCount
                    maxLength={100}
                    rows={12}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </Layout>

        <div className="card p-4">
          <Card title="Informasi Penerimaan Barang">
            <div className="card-body grid md:grid-cols-2 gap-4">
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
                  placeholder="Silahkan pilih"
                  onChange={(e) => {
                    // get address
                    const warehouse = warehouses.find(
                      (warehouse) => warehouse.id === e
                    )
                    form.setFieldsValue({
                      warehouse_address: warehouse.alamat,
                    })
                  }}
                >
                  {warehouses.map((warehouse) => (
                    <Select.Option value={warehouse.id}>
                      {warehouse.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="PIC Warehouse"
                name="warehouse_pic"
                rules={[
                  {
                    required: true,
                    message: "Please input your PIC Warehouse!",
                  },
                ]}
              >
                <DebounceSelect
                  showSearch
                  placeholder="Silahkan pilih"
                  fetchOptions={handleSearchContact}
                  filterOption={false}
                  className="w-full"
                  defaultOptions={warehouseUsers}
                />
              </Form.Item>

              <div className="md:col-span-2">
                <Form.Item
                  requiredMark={"Automatic"}
                  label="Detail Alamat Warehouse (Automatic)"
                  name="warehouse_address"
                  rules={[
                    {
                      required: false,
                      message: "Please input your Warehouse!",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Silahkan input catatan.."
                    showCount
                    maxLength={100}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>

          <Card title={`Detail ${typePo}`}>
            <ProductAdditionalList
              data={productNeed}
              products={typePo === "product" ? products : productAdditionals}
              packages={packages}
              type={typePo}
              taxs={taxs}
              handleChange={(value) =>
                handleChangeProductItem({
                  ...value,
                  poType: typePo === "product" ? "product" : "additional",
                })
              }
              handleClick={(value) =>
                handleClickProductItem({
                  ...value,
                  poType: typePo === "product" ? "product" : "additional",
                })
              }
            />
          </Card>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setStatus(0)
                setTimeout(() => {
                  form.submit()
                }, 1000)
              }}
              type="button"
              className={`text-blue-700 bg-white border hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
              disabled={loading}
            >
              {loading ? (
                <LoadingOutlined />
              ) : (
                <span className="">Simpan Sebagai Draft</span>
              )}
            </button>

            <button
              onClick={() => {
                setStatus(5)
                setTimeout(() => {
                  form.submit()
                }, 1000)
              }}
              type="button"
              className={`ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : <span className="">Simpan</span>}
            </button>
          </div>
        </div>
      </Form>
    </>
  )
}

export default PurchaseOrderForm
