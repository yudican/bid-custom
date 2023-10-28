import { Card, Form, Image, Input, Select, Table } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingFallback from "../../components/LoadingFallback"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import { getItem, inArray } from "../../helpers"
import FormActivity from "../Prospect/Components/FormActivity"
import WaLogo from "./assets/bi_whatsapp.svg"
import { searchContact } from "./service"

const ProspectForm = () => {
  const navigate = useNavigate()
  const { prospect_id } = useParams()
  const [form] = Form.useForm()

  // local state
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [contactList, setContactList] = useState([])
  const [contactAsyncList, setContactAsyncList] = useState([])
  const [seletedContact, setSeletedcontact] = useState(null)
  const [seletedAsync, setSeletedAsync] = useState(null)
  const [formList, setFormList] = useState([])
  const [formListData, setFormListData] = useState([])

  // local storage
  const user = getItem("user_data")
  const role = getItem("role")

  const loadProspectDetail = (updateForm = true) => {
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

  const handleGetContactAsync = () => {
    searchContact(null, ["cs"]).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })
      setContactAsyncList(newResult)
    })
  }

  useEffect(() => {
    loadProspectDetail()
    handleGetContact()
    handleGetContactAsync()
  }, [])
  useEffect(() => {
    if (!detail) {
      form.setFieldValue(
        "created_on",
        moment(new Date()).format("ddd, DD MMM YYYY | HH:mm")
      )
      form.setFieldValue("tag", "cold")
    }
  }, [])

  const handleSearchContact = async (e) => {
    return searchContact(e).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      return newResult
    })
  }

  const handleSearchContactAsync = async (e) => {
    return searchContact(e, ["cs"]).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      return newResult
    })
  }

  const onFinish = (values) => {
    axios
      .post(`/api/prospect/create`, {
        ...values,
        items: formListData,
        status: "new",
        tag: values.tag,
        contact: values?.contact?.value,
        prospect_id: prospect_id,
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

  console.log(form.getFieldsValue(), "field value")

  useEffect(() => {
    loadProspectDetail(true)
    handleGetContact()
  }, [])

  useEffect(() => {
    if (!detail) {
      form.setFieldValue(
        "created_on",
        moment(new Date()).format("ddd, DD MMM YYYY | HH:mm")
      )
      form.setFieldValue("tag", "cold")
    }
  }, [])

  if (loading) {
    return (
      <Layout title="Detail" href="/prospect">
        <LoadingFallback />
      </Layout>
    )
  }

  return (
    <Layout title="Prospect Form" href="/prospect">
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Card
          title="Prospect Info"
          extra={
            <button className="bg-green-400 hover:bg-green-400/50 p-2 rounded-lg text-white flex justify-center items-center">
              <img src={WaLogo} />
              <span className="ml-1">Chat Whatsapp</span>
            </button>
          }
        >
          <div className="card-body">
            <div className="grid grid-cols-3 gap-4">
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
                    form.setFieldValue("role", e?.label?.split(" - ")[1])
                  }}
                />
              </Form.Item>
              {inArray(role, ["admin", "superadmin"]) && (
                <Form.Item
                  label="Assign To"
                  name="async_to"
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
                    fetchOptions={handleSearchContactAsync}
                    filterOption={false}
                    defaultOptions={contactAsyncList}
                    className="w-full"
                    onChange={(e) => {
                      setSeletedAsync(e)
                    }}
                  />
                </Form.Item>
              )}

              <Form.Item label="Role" name="role">
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Tag"
                name="tag"
                rules={[
                  {
                    required: true,
                    message: "Please input Tag!",
                  },
                ]}
              >
                <Select placeholder="Select Tag">
                  {[
                    { name: "🔥 Hot", value: "hot", borderColor: "#CB3A31" },
                    { name: "❄️ Cold", value: "cold", borderColor: "#004AA7" },
                    { name: "🌤 Warm", value: "warm", borderColor: "#43936C" },
                  ].map((value, index) => (
                    <Select.Option value={value.value} key={index}>
                      {value.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Created Date" name="created_on">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Created By" name="created_by_name">
                <Input disabled />
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>

      <Card
        title={`Prospect Details${
          detail?.activities.length > 0 ? ` (${detail.activities.length})` : ""
        }`}
        className="mt-4"
        extra={
          <FormActivity
            initialValues={{
              prospect_id,
            }}
            refetch={(formData) => {
              const newFormData = new FormData()
              newFormData.append("prospect_id", detail?.id)
              newFormData.append("submit_date", formData.submit_date)
              newFormData.append("notes", formData.notes)
              newFormData.append("status", formData.status)
              if (formData.attachment) {
                newFormData.append("attachment", formData.attachment)
              }

              if (prospect_id) {
                axios
                  .post("/api/prospect/activity/create/", newFormData)
                  .then((res) => {
                    toast.success(res.data.message, {
                      position: toast.POSITION.TOP_RIGHT,
                    })
                    return loadProspectDetail()
                  })
                  .catch((err) => {
                    const { message } = err.response.data
                    toast.error(message, {
                      position: toast.POSITION.TOP_RIGHT,
                    })
                  })
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
            {
              title: "Attachment",
              dataIndex: "imageUrl",
              key: "imageUrl",
              render: (_, record) => {
                const image = record.image_url || record.attachment
                if (image) {
                  return (
                    <>
                      <Image src={image} width={30} height={30} />
                    </>
                  )
                }

                return "-"
              },
            },
            {
              title: "Action",
              // dataIndex: "imageUrl",
              // key: "imageUrl",
              render: (_, record) => {
                return (
                  <FormActivity
                    update
                    initialValues={{
                      prospect_id,
                      ...record,
                    }}
                    refetch={(formData) => {
                      const newFormData = new FormData()
                      newFormData.append("submit_date", formData.submit_date)
                      newFormData.append("notes", formData.notes)
                      newFormData.append("status", formData.status)
                      if (formData.attachment) {
                        newFormData.append("attachment", formData.attachment)
                      }

                      if (detail) {
                        axios
                          .post(
                            `/api/prospect/activity/update/${record.uuid}`,
                            newFormData
                          )
                          .then((res) => {
                            toast.success(res.data.message, {
                              position: toast.POSITION.TOP_RIGHT,
                            })
                            return loadProspectDetail()
                          })
                          .catch((err) => {
                            const { message } = err.response.data
                            toast.error(message, {
                              position: toast.POSITION.TOP_RIGHT,
                            })
                          })
                      }

                      // Add the newFormData to your list of form data
                      setFormList([...formList, newFormData])
                      setFormListData([...formListData, formData])
                    }}
                  />
                )
              },
            },
          ]}
          key={"id"}
          pagination={false}
        />
      </Card>

      <div className="float-right">
        <div className="w-full mt-6 p-4 flex flex-row">
          <button
            onClick={() => {
              form.submit()
            }}
            className={`text-white bg-blueColor hover:bg-blueColor/70 focus:ring-4 focus:outline-none focus:ring-blueColor font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
          >
            <span>{detail ? "Update" : "Save"} Prospect</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ProspectForm
