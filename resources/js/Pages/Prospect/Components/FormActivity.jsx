import { PlusOutlined } from "@ant-design/icons"
import { DatePicker, Form, Input, Modal, Select } from "antd"
import { Option } from "antd/lib/mentions"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
const FormActivity = ({ initialValues = {}, refetch, update = false }) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  // useEffect(() => {
  //   loadProvinsi()
  //   if (initialValues?.provinsi_id) {
  //     loadKabupaten(initialValues?.provinsi_id)
  //   }
  //   if (initialValues?.kabupaten_id) {
  //     loadKecamatan(initialValues?.kabupaten_id)
  //   }
  //   if (initialValues?.kecamatan_id) {
  //     loadKelurahan(initialValues?.kecamatan_id)
  //   }
  // }, [
  //   initialValues?.provinsi_id,
  //   initialValues?.kabupaten_id,
  //   initialValues?.kecamatan_id,
  // ])

  const handleSaveAddress = (values) => {
    axios
      .post("/api/contact/address/save-address", {
        ...initialValues,
        ...values,
      })
      .then((res) => {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setIsModalOpen(false)
        refetch()
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  return (
    <div>
      {!update ? (
        <button
          onClick={() => showModal()}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
        >
          <PlusOutlined />
          <span className="ml-2">Tambah Activity</span>
        </button>
      ) : (
        <span onClick={() => showModal()}>Update</span>
      )}

      <Modal
        title="Form Activity"
        open={isModalOpen}
        onOk={() => {
          form.submit()
          // setIsModalOpen(false);
        }}
        cancelText={"Batal"}
        onCancel={() => setIsModalOpen(false)}
        okText={"Simpan"}
        // width={1000}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSaveAddress}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="">
            <Form.Item
              label="Fullname"
              name="nama"
              rules={[
                {
                  required: true,
                  message: "Please input your Fullname!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="No Telepon"
              name="telepon"
              rules={[
                {
                  required: true,
                  message: "Please input your No Telepon!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Birth of Date"
              name="bod"
              rules={[
                {
                  required: true,
                  message: "Please input your Birth of Date!",
                },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Jenis Kelamin"
              name="gender"
              rules={[
                {
                  required: true,
                  message: "Please input your Jenis Kelamin!",
                },
              ]}
            >
              <Select placeholder="Select Jenis Kelamin">
                <Option value="Laki-Laki">Laki-Laki</Option>
                <Option value="Perempuan">Perempuan</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default FormActivity
