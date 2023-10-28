import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { DatePicker, Form, Modal, Select, Upload } from "antd"
import TextArea from "antd/lib/input/TextArea"
import moment from "moment"
import React, { useState } from "react"
import { getBase64 } from "../../../helpers"

const FormActivity = ({ initialValues = {}, refetch, update = false }) => {
  console.log(initialValues, "initialValues")
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [fileList, setFileList] = useState(null)
  // console.log(fileList, "fileList")
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleChange = ({ fileList }) => {
    const list = fileList.pop()
    setLoading(true)
    setTimeout(() => {
      getBase64(list.originFileObj, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
      setFileList(list.originFileObj)
    }, 1000)
  }

  const handleSaveAddress = (values) => {
    if (!update) {
      form.resetFields()
    }
    setIsModalOpen(false)
    return refetch({
      ...values,
      attachment: fileList,
      image_url: imageUrl,
    })
  }

  return (
    <div>
      {!update ? (
        <button
          onClick={() => showModal()}
          className="text-white bg-blueColor hover:bg-blueColor/70 focus:ring-4 focus:outline-none focus:ring-blueColor font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
        >
          <PlusOutlined />
          <span className="ml-2">Tambah Activity</span>
        </button>
      ) : (
        <span
          className={`${
            initialValues.status === "followed up"
              ? "text-gray-400"
              : "text-blueColor cursor-pointer"
          }`}
          onClick={() => initialValues.status !== "followed up" && showModal()}
        >
          Update
        </span>
      )}

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
        onCancel={() => setIsModalOpen(false)}
        okText={"Simpan"}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{
            ...initialValues,
            submit_date: moment(
              initialValues.submit_date ?? new Date(),
              "YYYY-MM-DD"
            ),
          }}
          onFinish={handleSaveAddress}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="row">
            <div className="col-md-12">
              <Form.Item
                label="Prospet Date"
                name="submit_date"
                rules={[
                  {
                    required: true,
                    message: "Field Tidak Boleh Kosong!",
                  },
                ]}
              >
                <DatePicker
                  // placeholder="DD/MM/YYYY"
                  // format={"DD/MM/YYYY"}
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
                name="attachment"
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
                  onChange={(e) => handleChange(e)}
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
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please input your Status!",
                  },
                ]}
              >
                <Select placeholder="Select Status">
                  {[
                    { id: "new", status_name: "New" },
                    { id: "proccess", status_name: "Process" },
                    { id: "followed up", status_name: "Followed Up" },
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
    </div>
  )
}

export default FormActivity
