import { Card, Form, Input, Table } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingFallback from "../../components/LoadingFallback"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import { formatDate, getItem } from "../../helpers"
import FormActivity from "../Prospect/Components/FormActivity"
import { searchContact } from "./service"

const ProspectForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { prospect_id } = useParams()

  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [contactList, setContactList] = useState([])
  const [userAddress, setUserAddress] = useState(null)
  const [seletedContact, setSeletedcontact] = useState(null)
  const [formList, setFormList] = useState([])
  const [formListData, setFormListData] = useState([])
  const user = getItem("user_data")

  const loadProductDetail = (updateForm = true) => {
    setLoading(true)
    axios
      .get(`/api/prospect/detail/${prospect_id}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        setDetail(data)

        if (updateForm) {
          setSeletedcontact({
            label: data?.contact_name,
            value: data?.contact_user?.id,
          })
          const forms = {
            ...data,
            contact: {
              label: data?.contact_name,
              value: data?.contact_user?.id,
            },
          }

          form.setFieldsValue(forms)
        } else {
          if (seletedContact) {
            form.setFieldValue("contact", {
              label: seletedContact?.label,
              value: seletedContact?.value,
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

  useEffect(() => {
    loadProductDetail()
    handleGetContact()
  }, [])

  const handleGetContact = () => {
    searchContact(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })
      setContactList(newResult)
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

  const onFinish = (values) => {
    axios
      .post("/api/prospect/create", {
        ...values,
        items: formListData,
        status: "new",
        tag: "cold",
        contact: values?.contact?.value,
      })
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        return navigate("/prospect")
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
      <Layout title="Detail" href="/prospect">
        <LoadingFallback />
      </Layout>
    )
  }

  return (
    <Layout
      title="Prospect Form"
      href="/prospect"
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
        <Card title="Prospect Info">
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Prospect ID" name="prospect_number">
                <Input disabled />
              </Form.Item>
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
                  onChange={(e) => {
                    setSeletedcontact(e)
                  }}
                />
              </Form.Item>
              <Form.Item label="Created By" name="created_by_name">
                <Input disabled />
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>

      <Card
        title="Prospect Details"
        className="mt-4"
        extra={
          <FormActivity
            initialValues={{
              prospect_id,
            }}
            refetch={(formData) => {
              const newFormData = new FormData()
              newFormData.append("submit_date", formData.submit_date)
              newFormData.append("notes", formData.notes)
              newFormData.append("status", formData.status)
              if (formData.attachment) {
                newFormData.append("attachment", formData.attachment)
              }

              // Add the newFormData to your list of form data
              setFormList([...formList, newFormData])
              setFormListData([...formListData, formData])
            }}
          />
        }
      >
        <Table
          dataSource={detail?.activities || formListData || []}
          columns={[
            {
              title: "No.",
              dataIndex: "no",
              key: "no",
              render: (_, record, index) => index + 1,
            },
            {
              title: "Activity",
              dataIndex: "notes",
              key: "notes",
            },
            {
              title: "Created On",
              dataIndex: "submit_date",
              key: "submit_date",
              render: (text) => {
                return moment(text).format("DD MMM YYYY")
              },
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
            },
            // {
            //   title: "Pilih",
            //   dataIndex: "action",
            //   key: "action",
            //   render: (_, record) => {
            //     return (
            //       <>
            //         <button
            //           onClick={() => showModal()}
            //           className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
            //         >
            //           <span className="ml-2">Show </span>
            //         </button>
            //       </>
            //     )
            //   },
            // },
          ]}
          key={"id"}
          pagination={false}
        />
      </Card>

      <div className="float-right">
        <div className="  w-full mt-6 p-4 flex flex-row">
          <button
            onClick={() => {
              form.submit()
            }}
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
          >
            <span className="ml-2">Save Prospect</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ProspectForm
