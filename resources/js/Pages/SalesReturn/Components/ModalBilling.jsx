import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { DatePicker, Form, Input, Modal, Upload } from "antd"
import { useForm } from "antd/es/form/Form"
import React, { useState } from "react"
import { toast } from "react-toastify"
import { getBase64 } from "../../../helpers"
import "../../../index.css"
const ModalBilling = ({ refetch, detail }) => {
  const [form] = useForm()
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loading, setLoading] = useState({
    attachment: false,
    struct: false,
  })

  const [imageUrl, setImageUrl] = useState({
    attachment: null,
    struct: null,
  })

  const [fileUploaded, setFileList] = useState({
    attachment: null,
    struct: null,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const formFields = ["account_name", "account_bank", "total_transfer"]

  const handleChange = ({ fileList, field }) => {
    const list = fileList.pop()
    setLoading({ ...loading, [field]: true })
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setLoading({ ...loading, [field]: false })
        setImageUrl({ ...imageUrl, [field]: url })
      })
      setFileList({ ...fileUploaded, [field]: list.originFileObj })
    }, 1000)
  }
  const onFinish = (value) => {
    setLoadingSubmit(true)
    let formData = new FormData()

    if (fileUploaded.attachment) {
      formData.append("upload_billing_photo", fileUploaded.attachment)
    }

    if (fileUploaded.struct) {
      formData.append("upload_transfer_photo", fileUploaded.struct)
    }
    console.log(value, "value")
    formData.append("uid_retur", detail.uid_retur)
    formData.append("account_name", value.account_name)
    formData.append("account_bank", value.account_bank)
    formData.append("total_transfer", value.total_transfer)
    formData.append("notes", value.notes)
    formData.append("transfer_date", value.transfer_date.format("YYYY-MM-DD"))

    axios
      .post(`/api/order/sales-return/billing`, formData)
      .then((res) => {
        const { message } = res.data
        refetch()
        setFileList({
          attachment: null,
          struct: null,
        })
        setImageUrl({
          attachment: null,
          struct: null,
        })
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setIsModalOpen(false)
        setLoadingSubmit(false)
      })
      .catch((e) => {
        const { message } = e.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setLoadingSubmit(false)
      })
  }

  return (
    <div>
      <button
        onClick={() => showModal()}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
      >
        <PlusOutlined />
        <span className="ml-2">Tambah Data</span>
      </button>

      <Modal
        title="Informasi Penagihan"
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
          // initialValues={initialValues}
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="row">
            <div className="col-md-12">
              {formFields.map((field) => (
                <Form.Item
                  label={field.replace("_", " ").toUpperCase()}
                  name={field}
                  rules={[
                    {
                      required: true,
                      message: "Field Tidak Boleh Kosong!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              ))}
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
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Billing Photo"
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
                  onChange={(e) =>
                    handleChange({
                      ...e,
                      field: "attachment",
                    })
                  }
                >
                  {imageUrl.attachment ? (
                    loading.attachment ? (
                      <LoadingOutlined />
                    ) : (
                      <img
                        src={imageUrl.attachment}
                        alt="avatar"
                        style={{
                          height: 104,
                        }}
                      />
                    )
                  ) : (
                    <div style={{ width: "100%" }}>
                      {loading.attachment ? (
                        <LoadingOutlined />
                      ) : (
                        <PlusOutlined />
                      )}
                      <div
                        style={{
                          marginTop: 8,
                          width: "100%",
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
                label="Transfer Photo"
                name="upload_transfer_photo"
                rules={[
                  {
                    required: false,
                    message: "Please input Photo!",
                  },
                ]}
              >
                <Upload
                  name="struct"
                  listType="picture-card"
                  className="avatar-uploader w-100"
                  showUploadList={false}
                  multiple={false}
                  beforeUpload={() => false}
                  onChange={(e) => handleChange({ ...e, field: "struct" })}
                >
                  {imageUrl.struct ? (
                    loading.struct ? (
                      <LoadingOutlined />
                    ) : (
                      <img
                        src={imageUrl.struct}
                        alt="avatar"
                        style={{
                          height: 104,
                        }}
                      />
                    )
                  ) : (
                    <div className="w-100">
                      {loading.struct ? <LoadingOutlined /> : <PlusOutlined />}
                      <div
                        style={{
                          marginTop: 8,
                          width: "100%",
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalBilling
