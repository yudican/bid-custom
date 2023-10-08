import { LoadingOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, Select, Upload } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import LoadingFallback from "../../components/LoadingFallback"
import Layout from "../../components/layout"
import { getBase64 } from "../../helpers"

const ProfileList = () => {
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detailContact, setDetailContact] = useState(null)
  const [fileList, setFileList] = useState(false)

  const loadProfile = () => {
    setLoading(true)
    axios.get(`/api/profile/detail`).then((res) => {
      const { data } = res.data

      console.log(data, "data profile")

      setImageUrl(data.profile_photo_url)
      setDetailContact(data)
      form.setFieldsValue({
        ...data,
        name: data?.name || detailContact?.name,
        email: data?.email || detailContact?.email,
        telepon: data?.telepon || detailContact?.telepon,
        gender: data?.gender || detailContact?.gender,
        bod: moment(data?.bod || detailContact?.bod, "YYYY-MM-DD"),
      })

      setLoading(false)

      // toast.success("Load Profile Berhasil!", {
      //   position: toast.POSITION.TOP_RIGHT,
      // })
    })
  }
  useEffect(() => {
    loadProfile()
  }, [])

  // const handleChange = (page, pageSize = 10) => {
  //   loadProfile(`/api/ticket/?page=${page}`, pageSize, {
  //     search,
  //     page,
  //     ...filterData,
  //   })
  // }
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

  const uploadButton = (
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
  )

  const onFinish = (value) => {
    setLoading(true)
    let formData = new FormData()

    if (fileList) {
      formData.append("profile_image", fileList)
    }

    formData.append("user_id", detailContact.id)
    formData.append("name", value.name)
    formData.append("email", value.email)
    formData.append("telepon", value.telepon)
    formData.append("gender", value.gender)
    formData.append("password", value.password)
    formData.append("bod", value.bod.format("YYYY-MM-DD"))
    axios.post(`/api/contact/detail/update`, formData).then((res) => {
      const { data } = res.data
      console.log(res, "res update contact")
      setLoading(false)
      setFileList(null)
      toast.success("Contact Berhasil Diupdate", {
        position: toast.POSITION.TOP_RIGHT,
      })
      loadProfile()
    })
  }

  const rightContent = <div className="flex justify-between items-center"></div>

  if (loading) {
    return (
      <Layout title="My Profile">
        <LoadingFallback />
      </Layout>
    )
  }

  return (
    <Layout rightContent={rightContent} title="My Profile">
      <div className="row mb-4">
        <div className="col-md-12">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            //   onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Nama lengkap"
              name="name"
              value={detailContact?.name || "-"}
              rules={[
                {
                  required: true,
                  message: "Please input your nama lengkap!",
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
                  message: "Please input your password!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Telepon"
              name="telepon"
              rules={[
                {
                  required: true,
                  message: "Please input your Telepon!",
                },
              ]}
            >
              <Input />
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
                <Select.Option value="Laki-Laki">Laki-Laki</Select.Option>
                <Select.Option value="Perempuan">Perempuan</Select.Option>
              </Select>
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
              label="Profile Photo"
              name="profile_image"
              rules={[
                {
                  required: !detailContact?.profile_photo_path,
                  message: "Please input Photo!",
                },
              ]}
            >
              <Upload
                name="profile_image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                multiple={false}
                beforeUpload={() => false}
                onChange={handleChange}
                // action={imageUrl}
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
                  uploadButton
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div className="col-md-12 ">
              <div className="float-right">
                <Form.Item>
                  <Button
                    icon={<SaveOutlined />}
                    type="primary"
                    htmlType="submit"
                  >
                    Simpan
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  )
}

export default ProfileList
