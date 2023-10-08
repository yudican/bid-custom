import {
  CloseCircleFilled,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import { Input, Pagination, Switch, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import FilterModal from "./Components/FilterModal"
import LogisticRateModal from "./Components/LogisticRateModal"
import { logisticListColumn } from "./config"

const LogisticList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})

  const loadData = (
    url = "/api/master/shipping-method/logistic",
    perpage = 10,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axios
      .post(url, { perpage, logistic_type: "online", ...params })
      .then((res) => {
        const { data, total, current_page } = res.data.data
        setTotal(total)
        setCurrentPage(current_page)
        setDatas(data)
        setLoading(false)
      })
      .catch((e) => setLoading(false))
  }
  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadData(`/api/master/shipping-method/logistic/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadData(`/api/master/shipping-method/logistic`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadData(`/api/master/shipping-method/logistic`, 10, data)
  }

  const updateStatus = (record) => {
    axios
      .post(`/api/master/shipping-method/logistic/update`, {
        logistic_id: record.id,
        field: "logistic_status",
        value: record.status,
      })
      .then((res) => {
        toast.success("Status Berhasil Di update")
        loadData()
      })
      .catch((err) => {
        toast.error("Status gagal Di update")
      })
  }

  const handleUpdateLogistic = () => {
    axios
      .post(`/api/master/shipping-method/logistic/sync/logistic`)
      .then((res) => {
        toast.success("Update Berhasil")
        loadData()
      })
      .catch((err) => {
        toast.error("Update gagal")
      })
  }

  const rightContent = (
    <div className="flex justify-between items-center">
      <FilterModal handleOk={handleFilter} />
      <button
        onClick={() => handleUpdateLogistic()}
        className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        <SyncOutlined />
        <span className="ml-2">Update Logistic</span>
      </button>
    </div>
  )

  return (
    <Layout rightContent={rightContent} title="List Logistic">
      <div className="row mb-4">
        <div className="col-md-12"></div>
        <div className="col-md-4 col-sm-6 col-12">
          <Input
            placeholder="Cari disini"
            size={"large"}
            className="rounded"
            onPressEnter={() => handleChangeSearch()}
            suffix={
              isSearch ? (
                <CloseCircleFilled
                  onClick={() => {
                    loadData()
                    setSearch(null)
                    setIsSearch(false)
                  }}
                />
              ) : (
                <SearchOutlined onClick={() => handleChangeSearch()} />
              )
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-8">
          <strong className="float-right mt-3 text-red-400">
            Total Data: {total}
          </strong>
        </div>
      </div>
      <Table
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
        dataSource={datas}
        columns={[
          ...logisticListColumn,
          {
            title: "Status",
            key: "logistic_status",
            dataIndex: "logistic_status",
            render: (text, record) => {
              return (
                <Switch
                  checked={text > 0}
                  onChange={(e) =>
                    updateStatus({ ...record, status: e ? "1" : "0" })
                  }
                />
              )
            },
          },

          {
            title: "Service",
            key: "logistic_original_id",
            dataIndex: "logistic_original_id",
            render: (text, record) => {
              return <LogisticRateModal logisticId={record.id} />
            },
          },
        ]}
        loading={loading}
        pagination={false}
        rowKey="id"
      />
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        total={total}
        className="mt-4 text-center"
        onChange={handleChange}
      />
    </Layout>
  )
}

export default LogisticList
