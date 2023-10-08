import { CheckOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Card, Form, Input, Select, Upload } from "antd"
import TextArea from "antd/lib/input/TextArea"
import React, { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import RichtextEditor from "../../../components/RichtextEditor"
import { getBase64 } from "../../../helpers"

const NotificationTemplateForm = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { template_id } = useParams()

  const [dataRole, setDataRole] = useState([])

  const [loadingRole, setLoadingRole] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const loadDetailData = () => {
    axios
      .get(`/api/setting/notification-template/${template_id}`)
      .then((res) => {
        const { data } = res.data
        form.setFieldsValue(data)
      })
  }

  const loadRole = () => {
    setLoadingRole(true)
    axios
      .get("/api/master/role")
      .then((res) => {
        setDataRole(res.data.data)
        setLoadingRole(false)
      })
      .catch((err) => setLoadingRole(false))
  }

  useEffect(() => {
    loadRole()
    loadDetailData()
  }, [])

  const onFinish = (values) => {
    setLoadingSubmit(true)

    const url = template_id ? `save/${template_id}` : "save"

    axios
      .post(`/api/setting/notification-template/${url}`, {
        ...values,
        role_ids: JSON.stringify(values.role_ids),
      })
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoadingSubmit(false)
        return navigate("/setting/notification-template")
      })
      .catch((err) => {
        const { message } = err.response.data
        setLoadingSubmit(false)
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  return (
    <>
      <Layout
        title="Tambah Template Notifikasi"
        href="/setting/notification-template"
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
          <Card title="Notification Data">
            <div className="card-body row">
              <div className="col-md-4">
                <Form.Item
                  label="Notification Code"
                  name="notification_code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Notification Code!",
                    },
                  ]}
                >
                  <Input placeholder="Ketik Notification Code" />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item
                  label="Role"
                  name="role_ids"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Role!",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    className="w-full"
                    placeholder="Select Role"
                    loading={loadingRole}
                  >
                    {dataRole.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.role_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item
                  label="Notification Type"
                  name="notification_type"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Notification Type!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    className="w-full"
                    placeholder="Select Notification Type"
                  >
                    <Select.Option value={"email"}>Email</Select.Option>
                    <Select.Option value={"alert"}>Alert</Select.Option>
                    <Select.Option value={"amail-alert"}>
                      Email & Alert
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Notification Title"
                  name="notification_title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Notification Title!",
                    },
                  ]}
                >
                  <Input placeholder="Ketik Notification Title" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Notification Sub Title"
                  name="notification_subtitle"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Notification Sub Title!",
                    },
                  ]}
                >
                  <Input placeholder="Ketik Notification Sub Title" />
                </Form.Item>
              </div>

              <div className="col-md-12">
                <Form.Item
                  label="Notification Body"
                  name="notification_body"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Notification Body!",
                    },
                  ]}
                >
                  <RichtextEditor
                    value={form.getFieldValue("notification_body")}
                    form={form}
                    name={"notification_body"}
                  />
                </Form.Item>

                <Form.Item label="Notification Note" name="notification_note">
                  <TextArea placeholder="Ketik Notification Note" rows={5} />
                </Form.Item>
              </div>
            </div>
          </Card>

          <div className="float-right mt-6"></div>
        </Form>
      </Layout>

      <div className="card ">
        <div className="card-body flex justify-end">
          <button
            onClick={() => form.submit()}
            className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
          >
            {loadingSubmit ? <LoadingOutlined /> : <CheckOutlined />}
            <span className="ml-2">Simpan</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default NotificationTemplateForm
