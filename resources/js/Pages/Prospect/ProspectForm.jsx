import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import {
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Upload,
} from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingFallback from "../../components/LoadingFallback"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import { getItem } from "../../helpers"
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
  const [imageUrl, setImageUrl] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

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

          // form.setFieldsValue(forms)
          form.setFieldsValue({
            created_at: new Date(),
            prospect_number: "PROSPECT/SA001/2023",
            contact_name: "Dany Testing",
            status: "new",
            activity_total: 0,
            tag_name: "Cold",
          })
        } else {
          if (seletedContact) {
            form.setFieldValue("contact", {
              label: seletedContact?.label,
              value: seletedContact?.value,
            })
          }
        }
      })
      .catch((e) => setLoading(false))
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
            <table className="mb-4 table-auto">
              <tbody>
                <tr>
                  <td>
                    <span className="font-semibold">Created date</span>
                  </td>
                  <td>: Mon, 02 May 2022 | 13.00</td>
                </tr>
                <tr>
                  <td>
                    <span className="font-semibold">Created By</span>
                  </td>
                  <td>: Renata Putri</td>
                </tr>
              </tbody>
            </table>

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
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>

      <Card
        title="Prospect Details (${count})"
        className="mt-4"
        extra={
          <FormActivity
            initialValues={{
              user_id: userAddress?.id,
              nama: userAddress?.name,
              telepon: userAddress?.telepon || userAddress?.phone,
            }}
            refetch={() => console.log(userAddress?.id)}
          />
        }
      >
        <Table
          dataSource={
            userAddress?.address || [
              { alamat_detail: "testing123", created_at: new Date() },
            ]
          }
          columns={[
            {
              title: "No.",
              dataIndex: "no",
              key: "no",
              render: (_, record, index) => index + 1,
            },
            {
              title: "Activity",
              dataIndex: "alamat_detail",
              key: "alamat_detail",
            },
            {
              title: "Created On",
              dataIndex: "created_at",
              key: "created_at",
              render: (text) => {
                return moment(text).format("DD MMM YYYY")
              },
            },
            {
              title: "Pilih",
              dataIndex: "action",
              key: "action",
              render: (_, record) => {
                return (
                  <>
                    <button
                      onClick={() => showModal()}
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
                    >
                      <span className="ml-2">Show </span>
                    </button>
                  </>
                )
              },
            },
          ]}
          key={"id"}
          pagination={false}
        />
      </Card>

      <div className="float-right">
        <div className="  w-full mt-6 p-4 flex flex-row">
          <button
            onClick={() => {
              setStatus(1)
              setTimeout(() => {
                form.submit()
              }, 1000)
            }}
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center`}
          >
            <span className="ml-2">Save Prospect</span>
          </button>
        </div>
      </div>

      <Modal
        width={600}
        title={
          <>
            <span>Prospect Activity</span>
            <br />
            <span className="text-xs">
              You can conduct prospecting activities with a maximum limit of 7
              times.
            </span>
          </>
        }
        open={isModalOpen}
        onOk={() => {
          form.submit()
        }}
        cancelText={"Cancel"}
        onCancel={handleCancel}
        okText={"Simpan"}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          // initialValues={{
          //   user_approval: user.name,
          // }}
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="row">
            <div className="col-md-12">
              <Form.Item
                label="Prospet Date"
                name="transfer_date"
                rules={[
                  {
                    required: true,
                    message: "Field Tidak Boleh Kosong!",
                  },
                ]}
              >
                <DatePicker
                  placeholder="DD/MM/YYYY"
                  format={"DD/MM/YYYY"}
                  className="w-full"
                />
              </Form.Item>
            </div>

            <div className="col-md-12">
              <Form.Item
                label="Notes"
                name="notes"
                rules={[
                  {
                    required: false,
                    message: "Please input notes!",
                  },
                ]}
              >
                <TextArea placeholder="Please input your notes prospect here.." />
              </Form.Item>
            </div>

            <div className="col-md-6">
              <Form.Item
                label="Attactment Photo"
                name="upload_billing_photo"
                rules={[
                  {
                    required: false,
                    message: "Please input Photo!",
                  },
                ]}
              >
                <Upload
                  name="attachment"
                  listType="picture-card"
                  className="avatar-uploader w-100"
                  showUploadList={false}
                  multiple={false}
                  beforeUpload={() => false}
                  // onChange={(e) =>
                  //   handleChange({
                  //     ...e,
                  //     field: "attachment",
                  //   })
                  // }
                >
                  {imageUrl ? (
                    loading ? (
                      <LoadingOutlined />
                    ) : (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        className="max-h-[100px] h-28 w-28 aspect-square"
                      />
                    )
                  ) : (
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>

            <div className="col-md-6">
              <Form.Item
                label="Status"
                name="status_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Status!",
                  },
                ]}
              >
                <Select placeholder="Select Status">
                  {[
                    { id: 1, status_name: "New" },
                    { id: 2, status_name: "Process" },
                    { id: 3, status_name: "Followed Up" },
                  ].map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.status_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </Layout>
  )
}

export default ProspectForm
