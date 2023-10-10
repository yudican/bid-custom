import { Card, Form, Input, Table } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LoadingFallback from "../../components/LoadingFallback"
import Layout from "../../components/layout"
import { formatDate, getItem } from "../../helpers"

const ProspectDetail = () => {
  const [form] = Form.useForm()
  const { prospect_id } = useParams()

  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const user = getItem("user_data")

  const loadProductDetail = (updateForm = true) => {
    setLoading(true)
    axios
      .get(`/api/prospect/detail/${prospect_id}`)
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        setDetail(data)

        const forms = {
          ...data,
        }

        form.setFieldsValue(forms)
      })
      .catch((e) => setLoading(false))
  }

  useEffect(() => {
    loadProductDetail()
  }, [])

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
        // onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Card title="Prospect Info">
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Prospect ID" name="prospect_number">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Contact" name="contact_name">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Created By" name="created_by_name">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Role" name="role_name">
                <Input disabled />
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>

      <Card title="Prospect Details" className="mt-4">
        <Table
          dataSource={detail?.activities || []}
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
              dataIndex: "created_at",
              key: "created_at",
              render: (text) => {
                return moment(text).format("DD MMM YYYY")
              },
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
    </Layout>
  )
}

export default ProspectDetail
