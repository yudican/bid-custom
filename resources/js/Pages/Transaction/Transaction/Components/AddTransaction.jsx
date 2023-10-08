import {
  CloseCircleFilled,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Button, Form, Input, Modal } from "antd"
import { useForm } from "antd/lib/form/Form"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import DebounceSelect from "../../../../components/atoms/DebounceSelect"
import { formatNumber, getItem } from "../../../../helpers"
import { searchKecamatan } from "../service"

const AddTransaction = ({ refetch }) => {
  const [form] = useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedKecamatan, setSelectedKecamatan] = useState(null)
  const [user, setUser] = useState({})
  const [adressUser, setAdressUser] = useState([])

  const totalQty = products?.reduce((prev, curr) => prev + curr.qty, 0)
  const totalPrice = products
    .reduce((acc, curr) => acc + curr.qty * curr.price.final_price, 0)
    .toFixed(0)
  const filteredProducts =
    products.filter((value) => value.name.toLowerCase().includes(search)) ||
    products

  const loadProducts = () => {
    axios.get("/api/master/products").then((res) => {
      if (res) {
        let data = res.data.data
        data.sort((a, b) => b.final_stock - a.final_stock)

        const withQty = data.map((value) => ({
          id: value.id,
          product_id: value.product_id,
          image_url: value.image_url,
          name: value.name,
          sku: value.sku,
          stock_off_market: value.stock_off_market,
          price: value.price,
          qty: 0,
        }))

        setProducts(withQty)
      }
    })
  }

  const handleSearchAddress = async (e) => {
    return searchKecamatan(e).then((results) => {
      const newResult = results.map((result) => {
        return result
      })

      return newResult
    })
  }

  const handleSearchUser = (phone) => {
    return axios
      .post("/api/master/search/user", { phone })
      .then((res) => {
        const { data } = res.data
        setUser({ ...data, user_id: data.id })
        form.setFieldsValue({ ...data, user_id: data.id })
        const newAdress = data.address.map((value) => {
          return {
            value: value.kec_id,
            label: value.kecamatan,
          }
        })

        setAdressUser(newAdress)
      })
      .catch((e) => [])
  }

  useEffect(() => {
    loadProducts()

    return () => {
      setProducts([])
    }
  }, [])

  const handleSubmit = (values) => {
    const data = {
      ...values,
      total_harga: totalPrice,
      company_id: getItem("account_id"),
      kecamatan_id: values.kecamatan_id.value,
      products: products.filter((product) => product.qty > 0),
    }
    // createTransaction(data)

    axios
      .post("/api/transaction/new-order", data)
      .then((res) => {
        console.log(res)
        setIsModalOpen(false)
        toast.success("Transaksi berhasil ditambahkan")
        form.resetFields()
        refetch()
      })
      .catch((e) => {
        console.log(e)
        setIsModalOpen(false)
        form.resetFields()
        toast.error("Transaksi gagal ditambahkan")
      })
  }

  return (
    <div>
      <button
        onClick={() => {
          setIsModalOpen(true)
        }}
        className="text-white bg-[#008BE1] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        <PlusOutlined />
        <span className="ml-2">Tambah Data</span>
      </button>

      <Modal
        title="Tambah Data Transaksi"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        width={"90%"}
        footer={[
          <div key="qty" className="flex justify-between">
            <div className="flex">
              <p className="font-semibold text-green-600 mr-16">
                Qty: {totalQty}
              </p>
              <p className="font-semibold text-red-600">
                Total : {`Rp ${formatNumber(totalPrice)}`}
              </p>
            </div>
            <Button
              key="link"
              // href="https://google.com"
              type="primary"
              onClick={() => {
                form.submit()
                // setIsModalOpen(false)
              }}
              // loading={loading}
              // onClick={handleOk}
            >
              Proses Transaksi
            </Button>
          </div>,
        ]}
      >
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Cari data produk disini.."
              size={"middle"}
              className="rounded mb-4"
              // onPressEnter={() => handleChangeSearch()}
              suffix={
                isSearch ? (
                  <CloseCircleFilled
                    onClick={() => {
                      // loadData(url)
                      // setSearch(null)
                      // setIsSearch(false)
                    }}
                  />
                ) : (
                  <SearchOutlined
                  // onClick={() => handleChangeSearch()}
                  />
                )
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="h-[40vh] lg:h-[65vh] overflow-y-auto">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`
                    mb-4 shadow-none rounded-md p-2 cursor-pointer bg-white
                    ${
                      selectedProduct == product.id
                        ? "border-[1px] border-blue-400 drop-shadow-md ring-blue-500"
                        : "border border-gray-400"
                    }
                  `}
                  onClick={() => {
                    setSelectedProduct(product.id)
                  }}
                  // disabled={product.stock === 0}
                >
                  <div className="flex max-w-[800px] justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={product.image_url}
                        alt="product_photo"
                        className="mr-3 w-14 h-14 rounded-md border"
                      />
                      <div>
                        <div className="block text-md line-clamp-1 font-medium max-w-md">
                          {product.name}{" "}
                        </div>
                        {/* <br /> */}
                        <div className="block text-gray-400 mt-2">
                          SKU : {product.sku}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <div>
                        <input
                          onChange={(e) => {
                            let newProduct = [...products]
                            newProduct[index] = {
                              ...newProduct[index],
                              qty: Number(e.target.value),
                            }
                            setProducts(newProduct)
                          }}
                          value={product.qty.toString()}
                          disabled={product.stock_off_market < 1}
                          type="number"
                          className="w-24 h-6 outline-none border rounded-sm"
                        />
                      </div>

                      <div className="mt-2">
                        <span className="text-red-500">
                          Sisa Stock: {product.stock_off_market}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:border-l pl-3">
            <div className="text-center">
              <h2 className="font-semibold">Form Tambah Data Transaksi</h2>
              <p className="text-gray-400 line-clamp-2">
                Silahkan lengkapi formulir di bawah ini untuk melanjutkan
                proses. Sistem akan melakukan pengecekan menggunakan nomor
                handphone yang terdaftar.
              </p>
            </div>

            <Form
              form={form}
              initialValues={{
                remember: true,
              }}
              autoComplete="off"
              layout="vertical"
              onFinish={(values) => handleSubmit(values)}
            >
              <Form.Item name="user_id" className="hidden">
                <Input type="hidden" />
              </Form.Item>
              <Form.Item
                label="Masukkan nomor handphone Customer"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your Telepon!",
                  },
                ]}
              >
                <Input
                  placeholder="Ketik No Telepon"
                  onBlur={(e) => {
                    const phone = e.target.value
                    handleSearchUser(phone)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Nama Lengkap Penerima"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Nama Lengkap Penerima!",
                  },
                ]}
              >
                <Input placeholder="Ketik nama lengkap Customer.." />
              </Form.Item>
              <Form.Item
                label="Alamat email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input placeholder="Ketik Email" />
              </Form.Item>
              <Form.Item
                label="Kecamatan"
                name="kecamatan_id"
                rules={[
                  {
                    required: true,
                    message: "Please input Kecamatan!",
                  },
                ]}
              >
                <DebounceSelect
                  showSearch
                  placeholder="Cari Kecamatan"
                  fetchOptions={handleSearchAddress}
                  filterOption={false}
                  className="w-full"
                  onChange={(value) => {
                    setSelectedKecamatan(value.label)
                  }}
                  defaultOptions={adressUser}
                />
              </Form.Item>
              <Form.Item label="Catatan" name="note">
                <TextArea placeholder="Catatan" />
              </Form.Item>

              <div className="mt-4 p-2 rounded-md border-2 border-[#008BE1] bg-[#D8F0FF] text-[#004AA6]">
                <p>Detail Customer</p>
                <table width={"100%"}>
                  <tbody>
                    <tr>
                      <td width={"20%"}>Nama</td>
                      <td>: {form.getFieldValue("name")}</td>
                    </tr>
                    <tr>
                      <td width={"20%"}>No. Handphone</td>
                      <td>: {form.getFieldValue("phone")}</td>
                    </tr>
                    <tr>
                      <td width={"20%"}>Alamat Email</td>
                      <td>: {form.getFieldValue("email")}</td>
                    </tr>
                    <tr>
                      <td width={"20%"}>Kecamatan</td>
                      <td>: {selectedKecamatan}</td>
                    </tr>
                    <tr>
                      <td width={"20%"}>Catatan</td>
                      <td>: {form.getFieldValue("note")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AddTransaction
