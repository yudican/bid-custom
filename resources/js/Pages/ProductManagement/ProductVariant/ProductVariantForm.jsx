import { CheckOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Card, Form, Input, Select, Table, Upload } from "antd"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import RichtextEditor from "../../../components/RichtextEditor"
import { getBase64 } from "../../../helpers"
import ProductModal from "./Components/ProductModal"
// import "../../../index.css";

const ProductVariantForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { product_variant_id } = useParams()

  const [prices, setPrices] = useState([])
  const [packages, setDataPackages] = useState([])
  const [variants, setDataVariants] = useState([])
  const [dataSku, setDataSku] = useState([])
  const [dataSkuTiktok, setDataSkuTiktok] = useState([])

  const [imageLoading, setImageLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(false)
  const [fileList, setFileList] = useState(false)

  const [loadingBrand, setLoadingBrand] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingSku, setLoadingSku] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)

  const loadDetailProduct = () => {
    const id = product_variant_id ? `/${product_variant_id}` : ""
    axios
      .get(`/api/product-management/product-variant/detail${id}`)
      .then((res) => {
        const { product, prices } = res.data.data
        setPrices(prices)
        if (product) {
          setImageUrl(product?.image_url)
          setSelectedProduct(product?.product)
          form.setFieldsValue(product)
        }
      })
  }

  const loadPackages = () => {
    axios.get("/api/master/package").then((res) => {
      const { data } = res.data
      setDataPackages(data)
    })
  }

  const loadSku = () => {
    axios.get("/api/master/sku").then((res) => {
      const { data } = res.data
      setDataSku(data)
    })
  }

  const loadSkuTiktok = () => {
    axios.get("/api/master/skutiktok").then((res) => {
      const { data } = res.data
      setDataSkuTiktok(data)
    })
  }

  const loadVariant = () => {
    axios.get("/api/master/variant").then((res) => {
      const { data } = res.data
      setDataVariants(data)
    })
  }

  useEffect(() => {
    loadPackages()
    loadSku()
    loadSkuTiktok()
    loadVariant()
    loadDetailProduct()
  }, [])

  const handleChange = ({ fileList }) => {
    const list = fileList.pop()
    setImageLoading(true)
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setImageLoading(false)
        setImageUrl(url)
      })
      setFileList(list.originFileObj)
    }, 1000)
  }

  const onFinish = (values) => {
    setLoadingSubmit(true)
    let formData = new FormData()
    if (fileList) {
      formData.append("image", fileList)
    }

    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("sales_channel", JSON.stringify(values.sales_channels))
    formData.append("weight", values.weight)
    formData.append("product_id", values.product_id)
    formData.append("sku", values.sku)
    formData.append("sku_tiktok", values.sku_tiktok)
    formData.append("package_id", values.package_id)
    formData.append("variant_id", values.variant_id)
    formData.append("sku_variant", values.sku_variant)
    formData.append("qty_bundling", values.qty_bundling)
    formData.append("status", values.status)
    formData.append("prices", JSON.stringify(prices))

    const url = product_variant_id
      ? `/api/product-management/product-variant/save/${product_variant_id}`
      : "/api/product-management/product-variant/save"

    axios
      .post(url, formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoadingSubmit(false)
        return navigate("/product-management/product-variant")
      })
      .catch((err) => {
        const { message } = err.response.data
        setLoadingSubmit(false)
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  )

  return (
    <Layout
      title="Product"
      href="/product-management/product-variant"
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
        <Card title="Product Data">
          <div className="card-body row">
            <div className="col-md-6">
              <Form.Item
                label="Pilih Produk"
                name="product_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Pilih Produk!",
                  },
                ]}
              >
                <ProductModal
                  handleSelect={(e) => {
                    setSelectedProduct(e)
                    console.log(e, "setSelectedProduct(e)")
                  }}
                  selectedProduct={selectedProduct}
                  form={form}
                />
              </Form.Item>

              <Form.Item
                label="Sku"
                name="sku"
                rules={[
                  {
                    required: true,
                    message: "Please input your Sku!",
                  },
                ]}
              >
                <Select
                  // mode="multiple"
                  allowClear
                  className="w-full"
                  placeholder="Select Sku"
                  onChange={(e) => {
                    const packageSelected = dataSku.find(
                      (item) => item.id === e
                    )
                    form.setFieldsValue({
                      package_id: packageSelected?.package_id,
                    })
                  }}
                >
                  {dataSku.map((item) => (
                    <Select.Option key={item.sku} value={item.sku}>
                      {item.sku}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Berat Product (gram)"
                name="weight"
                rules={[
                  {
                    required: true,
                    message: "Please input your Berat Product (gram)!",
                  },
                ]}
              >
                <Input placeholder="Ketik Berat Product (gram)" type="number" />
              </Form.Item>
              <Form.Item
                label="Sku Variant"
                name="sku_variant"
                rules={[
                  {
                    required: true,
                    message: "Please input your Sku Variant!",
                  },
                ]}
              >
                <Input placeholder="Ketik Sku Variant" />
              </Form.Item>

              <Form.Item
                label="Product Stock"
                name="stock"
                rules={[
                  {
                    required: false,
                    message: "Please input your Product Stock!",
                  },
                ]}
              >
                <Input placeholder="0" type="number" disabled />
              </Form.Item>

              <Form.Item
                label="Sales Channel"
                name="sales_channels"
                rules={[
                  {
                    required: true,
                    message: "Please input your Sales Channel!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  className="w-full mb-2"
                  placeholder="Select Sales Channel"
                >
                  <Select.Option value={"customer-portal"}>
                    Customer Portal
                  </Select.Option>
                  <Select.Option value={"agent-portal"}>
                    Agent Portal
                  </Select.Option>
                  <Select.Option value={"sales-offline"}>
                    Sales Offline
                  </Select.Option>
                  <Select.Option value={"marketplace"}>
                    Marketplace
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Nama Produk"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Nama Produk!",
                  },
                ]}
              >
                <Input placeholder="Ketik Nama Produk" />
              </Form.Item>

              <Form.Item
                label="Sku Tiktok"
                name="sku_tiktok"
                rules={[
                  {
                    required: true,
                    message: "Please input your Sku!",
                  },
                ]}
              >
                <Select
                  // mode="multiple"
                  allowClear
                  className="w-full"
                  placeholder="Select Sku Tiktok"
                >
                  {dataSkuTiktok.map((item) => (
                    <Select.Option key={item.sku_id} value={item.sku_id}>
                      {item.sku_id}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Package"
                name="package_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Package!",
                  },
                ]}
              >
                <Select
                  allowClear
                  className="w-full"
                  placeholder="Select Package"
                >
                  {packages.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Variant"
                name="variant_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Variant!",
                  },
                ]}
              >
                <Select
                  allowClear
                  className="w-full"
                  placeholder="Select Variant"
                >
                  {variants.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Qty Bundling"
                name="qty_bundling"
                rules={[
                  {
                    required: true,
                    message: "Please input your Qty Bundling!",
                  },
                ]}
              >
                <Input placeholder="Ketik Qty Bundling" type="number" />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please input your Status!",
                  },
                ]}
              >
                <Select
                  allowClear
                  className="w-full mb-2"
                  placeholder="Select Status"
                >
                  <Select.Option key={"1"} value={"1"}>
                    Active
                  </Select.Option>
                  <Select.Option key={"0"} value={"0"}>
                    Non Active
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>

         
            <div className="col-md-12">
              <Form.Item
                label="Product Cover"
                name="image"
                rules={[
                  {
                    required: product_variant_id ? false : true,
                    message: "Please input Product Cover!",
                  },
                ]}
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  multiple={true}
                  beforeUpload={() => false}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    imageLoading ? (
                      <LoadingOutlined />
                    ) : (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        className="max-h-[100px] h-28 w-28 aspect-square"
                      />
                    )
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your Description!",
                  },
                ]}
              >
                <RichtextEditor
                  value={form.getFieldValue("description")}
                  form={form}
                  name={"description"}
                />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Card title="Product Price" className="mt-4">
          <div className="card-body">
            <Table
              scroll={{ x: "max-content" }}
              tableLayout={"auto"}
              dataSource={prices}
              columns={[
                {
                  title: "Level Name",
                  key: "name",
                  dataIndex: "name",
                },
                {
                  title: "Basic Price",
                  key: "basic_price",
                  dataIndex: "basic_price",
                  render: (text, record, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        let data = [...prices]
                        data[index].basic_price = parseInt(e.target.value)
                        setPrices(data)
                      }}
                      type={"number"}
                    />
                  ),
                },
                {
                  title: "Final Price",
                  key: "final_price",
                  dataIndex: "final_price",
                  render: (text, record, index) => (
                    <Input
                      value={text}
                      onChange={(e) => {
                        let data = [...prices]
                        data[index].final_price = parseInt(e.target.value)
                        setPrices(data)
                      }}
                      type={"number"}
                    />
                  ),
                },
              ]}
              pagination={false}
              rowKey="id"
            />
          </div>
        </Card>

        <div className="float-right mt-6">
          <button className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2">
            {loadingSubmit ? <LoadingOutlined /> : <CheckOutlined />}
            <span className="ml-2">Simpan</span>
          </button>
        </div>
      </Form>
    </Layout>
  )
}

export default ProductVariantForm
