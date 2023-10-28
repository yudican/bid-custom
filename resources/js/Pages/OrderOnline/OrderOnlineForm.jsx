import {
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  EyeFilled,
  LoadingOutlined,
  PlusOutlined,
  PrinterFilled,
  PrinterOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Pagination,
  Select,
  Table,
  Upload,
  message,
} from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import LoadingFallback from "../../components/LoadingFallback"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import { formatNumber, getInitials } from "../../helpers"
import { searchContact } from "./service"
import ModalProduct from "../../components/Modal/ModalProduct"

const statusSwitch = (text) => {
  switch (text) {
    case "New Order":
      return "#FF6600"
    case "Packing":
      return "#7B61FF"
    case "Delivery":
      return "#008BE1"
    case "Completed":
      return "#43936C"
    case "Cancelled":
      return "#CB3A31"
    default:
      return "black"
  }
}

const menu = (
  <Menu>
    <Menu.Item icon={<PrinterOutlined />}>
      <a href="#">Cetak Sales Invoice</a>
    </Menu.Item>
    <Menu.Item icon={<PrinterOutlined />}>
      <a href="#">Cetak Label</a>
    </Menu.Item>
  </Menu>
)

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  beforeUpload: (file) => {
    const isPNG = file.type === "image/png"
    const isJPG = file.type === "image/jpeg" || file.type === "image/jpg"
    if (!isPNG || !isJPG) {
      message.error(`${file.name} is not a png file`)
    }
    return isPNG || isJPG || Upload.LIST_IGNORE
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

const OrderOnlineForm = () => {
  const navigate = useNavigate()
  const { order_online_id } = useParams()
  const [form, contactForm] = Form.useForm()

  // local state
  const [detail, setDetail] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contactList, setContactList] = useState([])
  const [productList, setProductList] = useState([])
  console.log(productList, "productList")
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [filterData, setFilterData] = useState({})

  const [contactAsyncList, setContactAsyncList] = useState([])
  const [seletedContact, setSeletedcontact] = useState(null)
  const [seletedAsync, setSeletedAsync] = useState(null)
  const [warehouses, setWarehouses] = useState([])
  const [termOfPayments, setTermOfPayments] = useState([])
  const [roles, setRoles] = useState([])
  const [roleSelected, setRoleSelected] = useState(null)
  const loadRole = () => {
    axios.get(`/api/master/role`).then((res) => {
      setRoles(res.data.data)
    })
  }
  // contact
  const [initialName, setInitialName] = useState(null)
  const [provinsi, setProvinsi] = useState([])
  const [kabupaten, setKabupaten] = useState([])
  const [kecamatan, setKecamatan] = useState([])
  const [kelurahan, setKelurahan] = useState([])
  const [initialValues, setInitialValues] = useState({})

  // loading
  const [loadingProvinsi, setLoadingProvinsi] = useState(false)
  const [loadingKabupaten, setLoadingKabupaten] = useState(false)
  const [loadingKecamatan, setLoadingKecamatan] = useState(false)
  const [loadingKelurahan, setLoadingKelurahan] = useState(false)

  // modal
  const [isModalContactOpen, setIsModalContactOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState("Content of the modal")
  const showModal = () => {
    setIsModalContactOpen(true)
  }
  const handleOk = () => {
    setModalText("The modal will be closed after two seconds")
    setConfirmLoading(true)
    setTimeout(() => {
      setIsModalContactOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }
  const handleCancel = () => {
    console.log("Clicked cancel button")
    setIsModalContactOpen(false)
  }

  // modal activities
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const showModalActivities = () => {
    setIsActivityModalOpen(true)
  }
  const handleOkActivities = () => {
    setIsActivityModalOpen(false)
  }
  const handleCancelActivities = () => {
    setIsActivityModalOpen(false)
  }

  // modal upload bukti bayar
  const [isModalBuktiBayarOpen, setIsModalBuktiBayarOpen] = useState(false)
  const showModalBuktiBayar = () => {
    setIsModalBuktiBayarOpen(true)
  }
  const handleOkBuktiBayar = () => {
    setIsModalBuktiBayarOpen(false)
  }
  const handleCancelBuktiBayar = () => {
    setIsModalBuktiBayarOpen(false)
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

  const loadProductVariant = (
    url = "/api/product-management/product-variant",
    perpage = 10,
    params = { page: 1 }
  ) => {
    setLoading(true)
    axios
      .post(url, { perpage, ...params })
      .then((res) => {
        const { data, total, current_page } = res.data.data
        setTotal(total)
        setCurrentPage(current_page)
        const newData = data.map((item) => {
          return {
            ...item,
            id: item.id,
            name: item.name,
            package_name: item.package_name,
            variant_name: item.variant_name,
            product_image: item?.image_url,
            status: item?.status,
            stock: item?.stock,
            final_price: formatNumber(item?.price?.final_price, "Rp. "),
          }
        })

        setProductList(newData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const loadProspectDetail = (updateForm = true) => {
    setLoading(true)
    axios
      .get(`/api/order-online/detail/${order_online_id}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        setDetail(data)

        if (updateForm) {
          setSeletedcontact({
            label: data?.contact_name,
            value: data?.contact_user?.id,
          })
          setSeletedAsync({
            label: data?.async_contact_name,
            value: data?.async_contact_user?.id,
          })
          const forms = {
            ...data,
            contact: {
              label: data?.contact_name,
              value: data?.contact_user?.id,
            },
            role: data?.role_name,
            prospect_number: data?.prospect_number,
            created_on: moment(data?.created_at).format(
              "ddd, DD MMM YYYY | HH:mm"
            ),
          }

          console.log(forms, "forms")

          form.setFieldsValue(forms)
        } else {
          if (seletedContact) {
            form.setFieldValue("contact", {
              label: seletedContact?.label,
              value: seletedContact?.value,
            })
          }
          if (seletedAsync) {
            form.setFieldValue("async_to", {
              label: seletedAsync?.label,
              value: seletedAsync?.value,
            })
          }
        }
      })
      .catch((e) => {
        setLoading(false)
        const { data } = e.response
        form.setFieldsValue(data?.data || data)
      })
  }

  const handleGetContact = () => {
    searchContact(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })
      setContactList(newResult)
    })
  }

  const loadProvinsi = () => {
    setLoadingProvinsi(true)
    axios
      .get("/api/master/provinsi")
      .then((res) => {
        setProvinsi(res.data.data)
        setLoadingProvinsi(false)
      })
      .catch(() => setLoadingProvinsi(false))
  }
  const loadKabupaten = (provinsi_id) => {
    setLoadingKabupaten(true)
    axios
      .get("/api/master/kabupaten/" + provinsi_id)
      .then((res) => {
        setKabupaten(res.data.data)
        setLoadingKabupaten(false)
      })
      .catch(() => setLoadingKabupaten(false))
  }
  const loadKecamatan = (kabupaten_id) => {
    setLoadingKecamatan(true)
    axios
      .get("/api/master/kecamatan/" + kabupaten_id)
      .then((res) => {
        setKecamatan(res.data.data)
        setLoadingKecamatan(false)
      })
      .catch(() => setLoadingKecamatan(false))
  }
  const loadKelurahan = (kelurahan_id) => {
    setLoadingKelurahan(true)
    axios
      .get("/api/master/kelurahan/" + kelurahan_id)
      .then((res) => {
        setKelurahan(res.data.data)
        setLoadingKelurahan(false)
      })
      .catch(() => setLoadingKelurahan(false))
  }

  useEffect(() => {
    loadProvinsi()
    if (initialValues?.provinsi_id) {
      loadKabupaten(initialValues?.provinsi_id)
    }
    if (initialValues?.kabupaten_id) {
      loadKecamatan(initialValues?.kabupaten_id)
    }
    if (initialValues?.kecamatan_id) {
      loadKelurahan(initialValues?.kecamatan_id)
    }
  }, [
    initialValues?.provinsi_id,
    initialValues?.kabupaten_id,
    initialValues?.kecamatan_id,
  ])

  useEffect(() => {
    loadWarehouse()
    loadTop()
    loadRole()
    loadProductVariant()

    loadProspectDetail()
    handleGetContact()
  }, [])

  const handleSearchContact = async (e) => {
    return searchContact(e).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      return newResult
    })
  }

  const onFinish = (values) => {
    console.log(values, "on finish")
  }

  if (loading) {
    return (
      <Layout title="Detail" href="/order-online">
        <LoadingFallback />
      </Layout>
    )
  }

  return (
    <>
      <Layout title="Create Data Order" href="/order-online">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Card
            title={
              <>
                <div>
                  <span className="text-base font-medium">
                    Silahkan Input Data Order
                  </span>
                  <br />
                  <span className="text-sm font-light">
                    Pastikan Anda memberikan informasi yang benar dan lengkap
                    untuk memastikan pengiriman yang lancar.
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-base font-medium">Status</span> <br />
                    <span
                      className="font-semibold"
                      style={{ color: statusSwitch("New Order") }}
                    >
                      New Order
                    </span>
                  </div>
                  <div>
                    <Dropdown overlay={menu}>
                      <button
                        className="text-blueColor border bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center mr-2"
                        // onClick={() => handleExportContent()}
                      >
                        <PrinterFilled style={{ fontSize: 12 }} />
                        <span className="ml-2 mr-4">Print</span>
                        <DownOutlined style={{ fontSize: 8 }} />
                      </button>
                    </Dropdown>

                    <button
                      className="ml-2 text-white bg-green-500 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2"
                      // onClick={() => handleExportContent()}
                    >
                      Assign to Packaging
                    </button>
                    <button
                      className="ml-2 text-white bg-green-500 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2"
                      // onClick={() => handleExportContent()}
                    >
                      Get AWB Number
                    </button>
                  </div>
                </div>
              </>
            }
          >
            <div className="card-body">
              <div className="w-full py-10 flex justify-center items-center mb-4 border rounded-md">
                Segera lakukan proses Packing..
              </div>

              <div className="w-full py-10 px-11 flex justify-between items-center mb-4 border rounded-md">
                <div>
                  <span>Status Payment</span>
                  <br />
                  <strong>-</strong>
                </div>
                <div>
                  <span>Courier</span>
                  <br />
                  <strong>JNE Regular</strong>
                </div>
                <div>
                  <span>Print Invoice:</span>
                  <br />
                  <strong>-</strong>
                </div>
                <div>
                  <span>Print Label:</span>
                  <br />
                  <strong>-</strong>
                </div>
                <div>
                  <span>AWB Number</span>
                  <br />
                  <strong>-</strong>
                </div>

                <div className="h-10 border" />

                <button
                  className="text-orangeOrder border bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center mr-2"
                  onClick={showModalActivities}
                >
                  <span>Show Activities</span>
                  <EyeFilled className="ml-2" />
                </button>
              </div>

              <div className="grid grid-cols-2 pr-36 mb-4">
                <div>
                  <h3>Sales Order</h3>
                  <table className="table-auto">
                    <tr className="h-8">
                      <td className="w-40">Created Date</td>
                      <td className="text-neutralColor">
                        : 17 Oct 2023, 10:53 AM
                      </td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">Sales Tag</td>
                      <td className="text-neutralColor">: Order Whatsapp</td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">Order ID</td>
                      <td className="text-neutralColor">: SO-137033432</td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">Payment Method</td>
                      <td className="text-neutralColor">: Manual Transfer</td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">Shipping Method</td>
                      <td className="text-neutralColor">: JNE Regular</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <h3>Shipping Info</h3>
                  <table className="table-auto">
                    <tr className="h-8">
                      <td className="w-40">Nama Penerima</td>
                      <td>:</td>
                      <td className="text-neutralColor">Jessica Kumala Sari</td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">Email</td>
                      <td>:</td>
                      <td className="text-neutralColor">jessica@gmail.com</td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">No. Telepon</td>
                      <td>:</td>
                      <td className="text-neutralColor">081766556412</td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">Tipe Alamat</td>
                      <td>:</td>
                      <td className="text-neutralColor">Rumah</td>
                    </tr>
                    <tr className="h-8">
                      <td className="w-40">Alamat Lengkap</td>
                      <td>:</td>
                      <td className="text-neutralColor">
                        Jawa Timur, Tuban, Wonosobo, 15312 Jl. Raya Tuban
                        Wonosobo No.5
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="md:absolute right-10">
                  <button
                    className="text-gray-600 border bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center "
                    onClick={showModalBuktiBayar}
                  >
                    <UploadOutlined className="mr-2" />
                    <span>Upload Bukti Bayar</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <Form.Item
                  label="Nama Customer"
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
                    onChange={(e) => {
                      setSeletedcontact(e)
                      form.setFieldValue("role", e?.label?.split(" - ")[1])
                    }}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div className="py-1 flex w-full items-center justify-center">
                          <Button className="" type="text" onClick={showModal}>
                            <strong className="text-blue-500">
                              + Add Contact
                            </strong>
                          </Button>
                        </div>
                      </>
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label="Ship From"
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

                <Form.Item
                  label="Payment Method"
                  name="payment_term"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Payment Term!",
                    },
                  ]}
                >
                  <Select placeholder="Select Payment Method">
                    {termOfPayments.map((top) => (
                      <Select.Option value={top.id} key={top.id}>
                        {top.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Shipping Method"
                  name="shipping_method"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Shipping Method!",
                    },
                  ]}
                >
                  <Select placeholder="Select Shipping Method">
                    {termOfPayments.map((top) => (
                      <Select.Option value={top.id} key={top.id}>
                        {top.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <div className="">
                  <h3 className="text-sm">Shipping Info</h3>
                  <span className="text-xs font-base text-neutralColor">
                    Jessica Kumala Sari
                    <br /> Rumah
                    <br />
                    Indonesia, Jawa Timur, Tuban, Wonosobo, 15312 Jl. Raya Tuban
                    Wonosobo No.5
                    <br />
                    <br />
                    082767654541
                  </span>
                </div>

                <div className="">
                  <h3 className="text-sm">Billing Info</h3>
                  <span className="text-xs font-base text-neutralColor">
                    Jessica Kumala Sari
                    <br />
                    Indonesia, Jawa Timur, Tuban, Wonosobo, 15312 Jl. Raya Tuban
                    Wonosobo No.5
                    <br />
                    <br />
                    082767654541
                  </span>
                </div>
              </div>

              <Table
                dataSource={productList}
                pagination={false}
                scroll={{ x: "max-content" }}
                tableLayout={"auto"}
                columns={[
                  {
                    title: "No.",
                    dataIndex: "key",
                    key: "key",
                    render: (value, row, index) => index + 1,
                  },
                  {
                    title: "Products",
                    dataIndex: "name",
                    key: "name",
                    render: (text, record, index) => {
                      return (
                        <ModalProduct
                          products={productList}
                          disabled={disabled?.product_id}
                          stock={100}
                          value={record?.product_id}
                          // handleChange={} // need to add handle to choose product
                        />
                      )
                    },
                  },
                  {
                    title: "SKU",
                    dataIndex: "sku",
                    key: "sku",
                  },
                  {
                    title: "Qty",
                    dataIndex: "qty",
                    key: "qty",
                    render: (text) => {
                      return <InputNumber value={text} />
                    },
                  },
                  {
                    title: "Regular Price (Rp)",
                    dataIndex: "regular_price",
                    key: "regular_price",
                    // render: (text) => `Rp. ${formatNumber(text)}`,
                    render: (text) => (
                      <Input value={formatNumber(text, "Rp. ")} />
                    ),
                  },
                  {
                    title: "Selling Price (Rp)",
                    dataIndex: "selling_price",
                    key: "selling_price",
                    // render: (text) => `Rp. ${formatNumber(text)}`,
                    render: (text) => (
                      <Input value={formatNumber(text, "Rp. ")} />
                    ),
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    // render: (text) => `Rp. ${formatNumber(text)}`,
                    render: (text) => (
                      <Input value={formatNumber(text, "Rp. ")} />
                    ),
                  },
                  {
                    title: "Action",
                    align: "center",
                    fixed: "right",
                    width: 100,
                    render: (text, record) => {
                      return <Button icon={<DeleteOutlined />}></Button>
                    },
                  },
                ]}
                summary={(currentData) => {
                  const price = currentData.reduce(
                    (acc, curr) => parseInt(acc) + parseInt(curr.amount),
                    0
                  )
                  const disount = currentData.reduce(
                    (acc, curr) => parseInt(acc) + parseInt(curr.disount),
                    0
                  )
                  const total = price + disount

                  return (
                    <Table.Summary>
                      <Table.Summary.Cell colSpan={5}>
                        <div className="flex flex-row justify-between pt-4 pr-4">
                          <label className="w-1/3">Catatan Pembeli</label>
                          <Form.Item className="w-2/3" name="notes">
                            <TextArea
                              rows={6}
                              placeholder="Silahkan isi catatan pembelian disini.."
                              cols={30}
                            />
                          </Form.Item>
                        </div>
                      </Table.Summary.Cell>

                      <Table.Summary.Cell colSpan={3}>
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            Sub Total (Rp)
                          </Table.Summary.Cell>

                          <Table.Summary.Cell />

                          <Table.Summary.Cell align="right">
                            Rp. {formatNumber(price)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                        </Table.Summary.Row>

                        <Table.Summary.Row>
                          <Table.Summary.Cell>Discount (Rp)</Table.Summary.Cell>

                          <Table.Summary.Cell />

                          <Table.Summary.Cell align="right">
                            <Form.Item className="mt-4" name="discount">
                              <Input
                                placeholder="Rp 0"
                                style={{ textAlign: "right" }}
                              />
                            </Form.Item>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                        </Table.Summary.Row>

                        <Table.Summary.Row>
                          <Table.Summary.Cell>Total (Rp)</Table.Summary.Cell>

                          <Table.Summary.Cell />

                          <Table.Summary.Cell align="right">
                            Rp. {formatNumber(total)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell />
                        </Table.Summary.Row>
                      </Table.Summary.Cell>
                    </Table.Summary>
                  )
                }}
              />

              <div
                onClick={() => {}}
                className={`
                  w-full mt-4 cursor-pointer
                  ${
                    disabled
                      ? "text-gray-400 border-gray-400/70 bg-gray-400/5"
                      : " text-blueColor hover:text-blueColor bg-blueColor/20 border-blueColor/70 hover:border-blueColor"
                  }
                  border-2 border-dashed  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 inline-flex items-center justify-center
                `}
              >
                <PlusOutlined style={{ marginRight: 10 }} />
                <span>Add More</span>
              </div>
            </div>
          </Card>
        </Form>
      </Layout>

      <div className="w-full bg-white shadow-md rounded-md p-4 flex flex-row-reverse">
        <button
          onClick={() => {
            form.submit()
          }}
          className={`text-white bg-blueColor hover:bg-blueColor/70 focus:ring-4 focus:outline-none focus:ring-blueColor font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
        >
          <span>{detail ? "Update" : "Simpan"} Order</span>
        </button>
        <a
          href="/order-online"
          className={`mr-2 text-blueColor bg-blueColor/10 hover:bg-blueColor/5 focus:ring-4 focus:outline-none focus:ring-blueColor font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
        >
          <span>Kembali</span>
        </a>
      </div>

      <Modal
        title="Tambah Data Customer Baru"
        open={isModalContactOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Simpan"
      >
        <Form
          className="grid grid-cols-2 gap-x-4"
          layout="vertical"
          form={contactForm}
        >
          <Form.Item
            label="Customer Code"
            name="uid"
            rules={[
              {
                required: true,
                message: "Please input your Customer Code!",
              },
            ]}
          >
            <Input placeholder="Ketik Customer Code" />
          </Form.Item>

          <Form.Item
            label="Nama lengkap"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your nama lengkap!",
              },
            ]}
          >
            <Input
              placeholder="Ketik Nama Lengkap"
              onChange={(e) => {
                const { value } = e.target
                setInitialName(getInitials(value))
                form.setFieldValue("uid", getInitials(value) + "-23001")
              }}
            />
          </Form.Item>

          <Form.Item
            label="No. Telepon"
            name="telepon"
            rules={[
              {
                required: true,
                message: "Please input your Telepon!",
              },
            ]}
          >
            <Input placeholder="Ketik No Telepon" />
          </Form.Item>

          <Form.Item
            label="Email"
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
            label="Role"
            name="role_id"
            rules={[
              {
                required: true,
                message: "Please input your Role!",
              },
            ]}
          >
            <Select
              placeholder="Select Role"
              onChange={(e) => {
                const role = roles.find((role) => role.id === e)
                setRoleSelected(role.role_type)
              }}
            >
              {roles.map((role) => (
                <Select.Option value={role.id} key={role.id}>
                  {role.role_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Sales Tag"
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
              <Select.Option value={"marketplace"}>Marketplace</Select.Option>
              <Select.Option value={"toko-offline"}>Toko Offline</Select.Option>
              <Select.Option value={"whatsapp"}>Whatsapp</Select.Option>
            </Select>
          </Form.Item>

          <div className="col-span-2 mb-4">Informasi Alamat</div>

          <Form.Item
            label="Provinsi"
            name="provinsi_id"
            rules={[
              {
                required: true,
                message: "Please input your Provinsi!",
              },
            ]}
          >
            <Select
              loading={loadingProvinsi}
              allowClear
              className="w-full mb-2"
              placeholder="Pilih Provinsi"
              onChange={(value) => loadKabupaten(value)}
            >
              {provinsi.map((item) => (
                <Select.Option key={item.pid} value={item.pid}>
                  {item.nama}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kecamatan"
            name="kecamatan_id"
            rules={[
              {
                required: true,
                message: "Please input your Kecamatan!",
              },
            ]}
          >
            <Select
              allowClear
              className="w-full mb-2"
              placeholder="Pilih Kecamatan"
              loading={loadingKecamatan}
              onChange={(value) => loadKelurahan(value)}
            >
              {kecamatan.map((item) => (
                <Select.Option key={item.pid} value={item.pid}>
                  {item.nama}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kabupaten"
            name="kabupaten_id"
            rules={[
              {
                required: true,
                message: "Please input your Kabupaten!",
              },
            ]}
          >
            <Select
              allowClear
              className="w-full mb-2"
              placeholder="Pilih Kabupaten"
              loading={loadingKabupaten}
              onChange={(value) => loadKecamatan(value)}
            >
              {kabupaten.map((item) => (
                <Select.Option key={item.pid} value={item.pid}>
                  {item.nama}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kelurahan"
            name="kelurahan_id"
            rules={[
              {
                required: true,
                message: "Please input your Kelurahan!",
              },
            ]}
          >
            <Select
              allowClear
              className="w-full mb-2"
              placeholder="Pilih Kelurahan"
              loading={loadingKelurahan}
              onChange={(value) => {
                const data = kelurahan.find((item) => item.pid === value)
                form.setFieldValue("kodepos", data.zip)
              }}
            >
              {kelurahan.map((item) => (
                <Select.Option key={item.pid} value={item.pid}>
                  {item.nama}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Kode Pos"
            name="kodepos"
            rules={[
              {
                required: true,
                message: "Please input your Kode Pos!",
              },
            ]}
          >
            <Input placeholder="Auto Generate" />
          </Form.Item>

          <div />

          <Form.Item
            className="col-span-2"
            label="Nama Jalan"
            name="alamat"
            rules={[
              {
                required: true,
                message: "Please input your Nama Jalan!",
              },
            ]}
          >
            <Input placeholder="Jl. Raya Kuningan No.34" />
          </Form.Item>

          <Form.Item
            className="col-span-2"
            label="Nama Lengkap Penerima"
            name="nama"
            rules={[
              {
                required: true,
                message: "Please input your Nama Lengkap Penerima!",
              },
            ]}
          >
            <Input placeholder="Auto Generate" />
          </Form.Item>

          <Form.Item
            label="No. Telepon Penerima"
            name="nama"
            rules={[
              {
                required: true,
                message: "Please input your No. Telepon Penerima!",
              },
            ]}
          >
            <Input placeholder="Auto Generate" />
          </Form.Item>

          <Form.Item
            label="Tipe Alamat"
            name="nama"
            rules={[
              {
                required: true,
                message: "Please input your Tipe Alamat!",
              },
            ]}
          >
            <Input placeholder="Ex: Rumah, Kantor, dsb" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Order Activities"
        open={isActivityModalOpen}
        onOk={handleOkActivities}
        onCancel={handleCancelActivities}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Oke"
      >
        {[
          {
            date: "17 Oct 2023, 10.00",
            status: "Order Completed",
          },
          {
            date: "16 Oct 2023, 21.00",
            status: "Order is Delivered",
          },
          {
            date: "16 Oct 2023, 21.00",
            status: "Order is Shipped",
          },
          {
            date: "16 Oct 2023, 21.00",
            status: "Invoice Printed",
          },
          {
            date: "16 Oct 2023, 21.00",
            status: "Order Paid",
          },
          {
            date: "15 Oct 2023, 07.00",
            status: "Order Created",
          },
        ].map((value, index, array) => {
          const lastIndex = array.length - 1

          return (
            <table key={index}>
              <tbody>
                <tr className="h-20">
                  <td>
                    <div className="w-40">
                      <span className="text-black font-medium text-sm">
                        {value.date.split(", ")[0]}
                      </span>
                      <br />
                      <span className="text-black text-xs">
                        {value.date.split(", ")[1]}
                      </span>
                    </div>
                  </td>
                  <td className="relative">
                    <div className="flex flex-col items-center absolute top-6 -left-8">
                      <div className="w-4 h-4 bg-blueColor rounded-full" />{" "}
                      {index !== lastIndex && (
                        <div className="h-12 border-l-[1px] border-blueColor mt-2" />
                      )}
                    </div>
                  </td>
                  <td>
                    <p className="text-blueColor font-medium px-2">
                      {value.status}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          )
        })}
      </Modal>

      <Modal
        title="Upload Bukti Pembayaran"
        open={isModalBuktiBayarOpen}
        onOk={handleOkBuktiBayar}
        onCancel={handleCancelBuktiBayar}
        cancelText="Cancel"
        okText="Simpan Pembayaran"
      >
        <Form layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Nama Bank"
              name="account_bank"
              rules={[
                {
                  required: true,
                  message: "Field Tidak Boleh Kosong!",
                },
              ]}
            >
              <Input placeholder="Nama Bank" />
            </Form.Item>
            <Form.Item
              label={"Nama Pengirim"}
              name={"nama_pengirim"}
              rules={[
                {
                  required: true,
                  message: "Field Tidak Boleh Kosong!",
                },
              ]}
            >
              <Input placeholder="Nama Pengirim" />
            </Form.Item>
            <Form.Item
              label="Tanggal Transfer"
              name="transfer_date"
              rules={[
                {
                  required: true,
                  message: "Field Tidak Boleh Kosong!",
                },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label={"Jumlah Transfer (Rp.)"}
              name={"jumlah_transfer"}
              rules={[
                {
                  required: true,
                  message: "Field Tidak Boleh Kosong!",
                },
              ]}
            >
              <Input placeholder="Rp 0" type="number" />
            </Form.Item>

            <Form.Item label={"Upload By"} name={"upload_by"}>
              <Input placeholder="None" disabled />
            </Form.Item>

            <Form.Item
              label="Attachments (Jpg/Png)"
              name="attachment"
              rules={[
                {
                  required: true,
                  message: "Please input Photo!",
                },
              ]}
            >
              <Upload {...props}>
                <Button style={{ width: "100%" }}>
                  File Attachment
                  <span className="ml-2 pb-2">
                    <UploadOutlined />
                  </span>
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default OrderOnlineForm
