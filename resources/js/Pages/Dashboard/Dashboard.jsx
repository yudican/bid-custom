import { LoadingOutlined } from "@ant-design/icons"
import { Badge, Button, DatePicker, Input, Table } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import "react-circular-progressbar/dist/styles.css"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import Layout from "../../components/layout"
import { searchContact } from "../CaseManual/service"

const { Search } = Input

const Dashboard = () => {
  return (
    <Layout title="Dashboard">
      <ProspectDashboard />
    </Layout>
  )
}

export default Dashboard

const ProspectDashboard = () => {
  const [loading, setLoading] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)
  const [contactList, setContactList] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [prospect, setProspect] = useState([])
  const [totalActivity, setTotalActivity] = useState(0)
  const [prospectStatus, setProspectStatus] = useState([])
  const [prospectTags, setProspectTags] = useState([])

  const columns = [
    {
      title: "No",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Created Date",
      dataIndex: "age",
      key: "age",
      render: (text, record, index) =>
        moment(text).format("DD-MMM-YYYY | HH:mm"),
    },
    {
      title: "Prospect ID",
      dataIndex: "prospect_number",
      key: "prospect_number",
    },
    {
      title: "Contact",
      dataIndex: "contact_name",
      key: "contact_name",
    },
    {
      title: "Role",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "Activity",
      dataIndex: "activity_total",
      key: "activity_total",
    },
    {
      title: "Prospect Tag",
      dataIndex: "tag_name",
      key: "tag_name",
    },
  ]

  const countFormatter = (count) =>
    Number(count) >= 1000
      ? `${
          Number(count / 1000)
            .toFixed(1)
            .replace(/\.0$/, "") + "K"
        }`
      : count

  const handleGetContact = () => {
    searchContact(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      setContactList([{ label: "All Contact", value: "" }, ...newResult])
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

  const handleGetProspectData = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/prospect/list", {
        params: {
          startDate: startDate,
          endDate: endDate,
          contact: selectedContact,
        },
      })
      const { data } = response

      const prospectList = data.data.data
      setProspect(prospectList)

      const totalActivty = prospectList.reduce(
        (acc, curr) => acc + Number(curr.activity_total),
        0
      )
      setTotalActivity(totalActivty)
    } catch (error) {
      console.error("Error fetching prospect data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetProspectStatus = async () => {
    try {
      const response = await axios.get("/api/prospect/status", {
        params: {
          startDate: startDate,
          endDate: endDate,
          contact: selectedContact,
        },
      })
      const { data } = response
      const statusList = data.data
      setProspectStatus(statusList)
    } catch (error) {
      console.error("Error fetching prospect status:", error)
    }
  }
  const handleGetProspectTags = async () => {
    try {
      const response = await axios.get("/api/prospect/tags", {
        params: {
          startDate: startDate,
          endDate: endDate,
          contact: selectedContact,
        },
      })
      const { data } = response
      const tagList = data.data
      setProspectTags(tagList)
    } catch (error) {
      console.error("Error fetching prospect tags:", error)
    }
  }

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      .post(`/api/genie-order/export/`) // url perlu di ganti
      .then((res) => {
        const { data } = res.data
        window.open(data)
        setLoadingExport(false)
      })
      .catch((err) => console.log("error export :", err))
      .finally(() => setLoadingExport(false))
  }

  useEffect(() => {
    handleGetContact()
  }, [])
  useEffect(() => {
    handleGetProspectData()
    handleGetProspectTags()
    handleGetProspectStatus()
  }, [startDate, endDate, selectedContact])

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <div className="mr-2">Filter by Contact CS</div>
          <DebounceSelect
            value={selectedContact}
            showSearch
            placeholder="Choose Contact"
            fetchOptions={handleSearchContact}
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? "").includes(input.toLowerCase())
            }
            defaultOptions={contactList}
            className="w-"
            onChange={(val) => {
              setSelectedContact(val?.value)
            }}
          />
        </div>

        <div className="flex items-center">
          <div className="mr-2">Filter</div>

          <DatePicker.RangePicker
            format={"YYYY-MM-DD"}
            onChange={(e, dateString) => {
              console.log(dateString, "dateString")
              setStartDate(dateString[0])
              setEndDate(dateString[1])
            }}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-10 gap-5">
        <div className="grid col-span-2 gap-4">
          <div className="h-full w-full rounded-md p-2 border shadow-sm">
            <span className="font-medium text-sm">Total Prospect</span>
            <br />
            <div className="border-t my-2" />
            <br />
            <h1 className="text-3xl font-medium text-blueColor">
              {countFormatter(prospect?.length)}
            </h1>
          </div>

          <div className="h-full w-full rounded-md p-2 border shadow-sm">
            <span className="font-medium text-sm">Total Activity</span>
            <br />
            <div className="border-t my-2" />
            <br />
            <h1 className="text-3xl font-medium text-orangeOrder">
              {countFormatter(totalActivity)}
            </h1>
          </div>
        </div>

        <div className="col-span-4 h-full w-full rounded-md p-2 border shadow-sm">
          <span className="font-medium text-sm">Prospect Status</span>
          <br />
          <div className="border-t my-2" />
          <div className="mt-4">
            {[...prospectStatus].map((value, index) => {
              return (
                <div
                  className="flex justify-between items-center border-b mb-2.5 pb-2.5"
                  key={index}
                >
                  {value.name}
                  <Badge
                    showZero
                    style={{ color: "black" }}
                    overflowCount={999}
                    color="#E5F9FF"
                    count={countFormatter(value.count)}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-4 h-full w-full rounded-md p-2 border shadow-sm">
          <span className="font-medium text-sm">Prospect Tag</span>
          <br />
          <div className="border-t my-2" />

          <div className="mt-4">
            {[
              ...prospectTags,
              { name: "Loyal Customer", tag: "loyal", count: 0 },
            ].map((value, index) => {
              return (
                <div
                  className="flex justify-between items-center border-b mb-2.5 pb-2.5"
                  key={index}
                >
                  {value.name}
                  <Badge
                    showZero
                    style={{ color: "black" }}
                    overflowCount={999}
                    color="#E5F9FF"
                    count={countFormatter(value.count)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center py-4 mt-4">
          <div className="text-base font-medium">List Data Prospect</div>

          <Button
            className="text-black font-medium rounded-lg text-sm text-center inline-flex items-center"
            onClick={handleExportContent}
          >
            {loadingExport && <LoadingOutlined />}
            Export by Excel
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={prospect}
          rowSelection
          scroll={{ x: "max-content" }}
          tableLayout="auto"
        />
      </div>
    </div>
  )
}
