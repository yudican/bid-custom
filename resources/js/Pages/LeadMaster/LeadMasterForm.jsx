import { Card, Form, Input, Select } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import LoadingFallback from "../../components/LoadingFallback"
import { getItem, inArray } from "../../helpers"
import { searchContact, searchSales } from "./service"

const LeadMasterForm = () => {
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem("user_data"))
  const role = localStorage.getItem("role")
  const [form] = Form.useForm()
  const { uid_lead } = useParams()
  const [warehouses, setWarehouses] = useState([])
  const [termOfPayments, setTermOfPayments] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [contactList, setContactList] = useState([])
  const [salesList, setSalesList] = useState([])
  const [status, setStatus] = useState(0)
  const [detail, setDetail] = useState(null)
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

  const loadProductDetail = () => {
    setLoading(true)
    axios
      .get(`/api/lead-master/detail/${uid_lead}`)
      .then((res) => {
        const { data } = res.data
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
          payment_term: data?.payment_term?.id,
          brand_id: data?.brand_ids,
        }

        if (role === "sales") {
          forms.sales = {
            label: userData.name,
            value: userData.id,
          }
        }
        setDetail(data)
        form.setFieldsValue(forms)
        setLoading(false)
      })
      .catch((e) => setLoading(false))
  }

  useEffect(() => {
    loadBrand()
    loadWarehouse()
    loadTop()
    loadProductDetail()
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

  const onFinish = (values) => {
    let url = uid_lead
      ? "/api/lead-master/update/" + uid_lead
      : "/api/lead-master/create"

    axios
      .post(url, {
        ...values,
        status,
        uid_lead,
        contact: values.contact.value,
        sales: values.sales.value,
        account_id: getItem("account_id"),
      })
      .then((res) => {
        toast.success(res?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        return navigate("/lead-master")
      })
      .catch((err) => {
        toast.error("Lead Gagal Disimpan", {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  if (loading) {
    return (
      <Layout title="Lead Master Form" href="/lead-master">
        <LoadingFallback />
      </Layout>
    )
  }

  const isCreate = detail ? false : true

  return (
    <Layout
      title="Create New Lead"
      href="/lead-master"
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
        <Card title="Form New Lead">
          <div className="card-body row">
            <div className="col-md-4">
              <Form.Item
                label="Type Lead"
                name="lead_type"
                rules={[
                  {
                    required: true,
                    message: "Please input Type Lead!",
                  },
                ]}
              >
                <Select placeholder="Select Type Lead">
                  <Select.Option value={"new"} key={"new"}>
                    New Lead
                  </Select.Option>
                  <Select.Option value={"existing"} key={"existing"}>
                    Existing Lead
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
                <Select placeholder="Select Brand" mode="multiple" allowClear>
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
                  className="w-full"
                  defaultOptions={contactList}
                />
              </Form.Item>
              <Form.Item
                label="Payment Term"
                name="payment_term"
                rules={[
                  {
                    required: true,
                    message: "Please input your Payment Term!",
                  },
                ]}
              >
                <Select placeholder="Select Payment Term">
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
                <Select placeholder="Select Warehouse">
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

      <div className="float-right">
        <div className="  w-full mt-6 p-4 flex flex-row">
          {isCreate && (
            <button
              onClick={() => {
                setStatus(7)
                setTimeout(() => {
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
              setStatus(0)
              setTimeout(() => {
                form.submit()
              }, 1000)
            }}
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
          >
            <span className="ml-2">Save Lead</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default LeadMasterForm
