import { CheckOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Card, Form, Input, Select, Upload } from "antd"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import RichtextEditor from "../../../components/RichtextEditor"
import { getBase64 } from "../../../helpers"
// import "../../../index.css";

const ProductMasterForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { product_id } = useParams()

  const [dataBrand, setDataBrand] = useState([])
  const [dataCategories, setDataCategories] = useState([])
  const [dataSku, setDataSku] = useState([])
  const [imageLoading, setImageLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(false)
  const [fileList, setFileList] = useState(false)
  const [fileListMultiple, setFileListMultiple] = useState([])

  const [loadingBrand, setLoadingBrand] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const loadDetailProduct = () => {
    if (product_id) {
      axios.get(`/api/product-management/product/${product_id}`).then((res) => {
        const { data } = res.data
        setImageUrl(data.image_url)

        const images = data.product_images.map((item) => {
          return {
            uid: item.id,
            name: item.name,
            status: "done",
            url: item.image_url,
          }
        })
        setFileListMultiple(images)
        form.setFieldsValue({
          ...data,
          stock: data.final_stock,
        })
      })
    }
  }

  const loadBrand = () => {
    setLoadingBrand(true)
    axios
      .get("/api/master/brand")
      .then((res) => {
        setDataBrand(res.data.data)
        setLoadingBrand(false)
      })
      .catch((err) => setLoadingBrand(false))
  }

  const loadCategories = () => {
    setLoadingCategories(true)
    axios
      .get("/api/master/categories")
      .then((res) => {
        setDataCategories(res.data.data)
        setLoadingCategories(false)
      })
      .catch((err) => setLoadingCategories(false))
  }

  const loadSku = () => {
    axios.get("/api/master/sku").then((res) => {
      const { data } = res.data
      setDataSku(data)
    })
  }

  useEffect(() => {
    loadSku()
    loadBrand()
    loadCategories()
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

  const handleChangeMultiple = ({ fileList: newFileList }) => {
    setFileListMultiple(newFileList)
  }

  const onFinish = (values) => {
    setLoadingSubmit(true)
    let formData = new FormData()
    if (fileList) {
      formData.append("image", fileList)
    }

    fileListMultiple.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images[]", file.originFileObj)
      }
    })

    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("weight", values.weight)
    // formData.append("stock", values.stock)
    formData.append("sku", values.sku)
    formData.append("product_like", values.product_like)
    formData.append("brand_id", values.brand_id)
    formData.append("category_id", JSON.stringify(values.category_ids))
    formData.append("status", values.status)

    const url = product_id
      ? `/api/product-management/product/save/${product_id}`
      : "/api/product-management/product/save"

    axios
      .post(url, formData)
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoadingSubmit(false)
        return navigate("/product-management/product")
      })
      .catch((err) => {
        const { message } = err.response.data
        setLoadingSubmit(false)
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleRemoveMultiple = ({ uid }) => {
    axios
      .post(`/api/product-management/product/images/delete/${uid}`, {
        uid,
        _method: "DELETE",
      })
      .then((res) => {
        toast.success("Product Image berhasil di hapus")
        loadDetailProduct()
      })
      .catch((err) => {
        toast.error("Product Image gagal di hapus")
      })
  }

  console.log("fileListMultiple", fileListMultiple)

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
      href="/product-management/product"
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
                label="Product Like"
                name="product_like"
                rules={[
                  {
                    required: false,
                    message: "Please input your Product Like!",
                  },
                ]}
              >
                <Input placeholder="Ketik Product Like" type="number" />
              </Form.Item>
              <Form.Item
                label="Product stock"
                name="stock"
                rules={[
                  {
                    required: false,
                    message: "Please input your Product Stock!",
                  },
                ]}
              >
                <Input
                  placeholder="Ketik Product Stock"
                  type="number"
                  disabled
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
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
                <Select
                  // mode="multiple"
                  allowClear
                  className="w-full"
                  placeholder="Select Brand"
                  loading={loadingBrand}
                >
                  {dataBrand.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Category"
                name="category_ids"
                rules={[
                  {
                    required: true,
                    message: "Please input your category!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  className="w-full"
                  placeholder="Select Category"
                  loading={loadingCategories}
                >
                  {dataCategories.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
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
                >
                  {dataSku.map((item) => (
                    <Select.Option key={item.id} value={item.sku}>
                      {item.sku} - {item.package_name}
                    </Select.Option>
                  ))}
                </Select>
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

        <Card title="Product Image" className="mt-4">
          <div className="card-body row">
            <div className="col-md-2">
              <Form.Item
                label="Product Cover"
                name="image"
                rules={[
                  {
                    required: product_id ? false : true,
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
                label="Product Images"
                name="images"
                rules={[
                  {
                    required: product_id ? false : true,
                    message: "Please input Product Images!",
                  },
                ]}
              >
                <Upload
                  name="images"
                  className="avatar-uploader"
                  multiple={true}
                  beforeUpload={() => false}
                  listType="picture-card"
                  fileList={fileListMultiple}
                  onChange={handleChangeMultiple}
                  onRemove={handleRemoveMultiple}
                >
                  {fileListMultiple.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </div>
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

export default ProductMasterForm
