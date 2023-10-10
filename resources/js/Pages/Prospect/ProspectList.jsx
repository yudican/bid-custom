import {
  CloseCircleFilled,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Input, Pagination, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/layout"
import { getItem } from "../../helpers"
import FilterModal from "./Components/FilterModal"
import { prospectListColumn } from "./config"

const ProspectList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uidLoading, setUidLoading] = useState(false)
  const [prospectList, setProspectList] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})
  const [loadingExport, setLoadingExport] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [readyToSubmit, setReadyToSubmit] = useState(false)

  const loadContact = (
    url = "/api/prospect/list",
    perpage = 10,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axios
      .post(url, {
        perpage,
        account_id: getItem("account_id"),
        type: "admin",
        ...params,
      })
      .then((res) => {
        const { data, total, current_page } = res.data.data
        setTotal(total)
        setCurrentPage(current_page)
        // setProspectList(newData)
        setProspectList(data)
        setLoading(false)
      })
  }
  useEffect(() => {
    loadContact()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadContact(`/api/prospect/list/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadContact(`/api/prospect/list`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadContact(`/api/prospect/list`, 10, data)
  }

  // const handleExportContent = () => {
  //   setLoadingExport(true)
  //   axios
  //     // .post(`/api/prospect/list/export/`)
  //     .post(`/api/prospect/list/export/detail/1`)
  //     .then((res) => {
  //       const { data } = res.data
  //       window.open(data)
  //       setLoadingExport(false)
  //     })
  //     .catch((e) => setLoadingExport(false))
  // }

  // selected row handler
  const rowSelection = {
    selectedRowKeys,
    onChange: (e) => setSelectedRowKeys(e),
    getCheckboxProps: (record) => ({
      disabled: record.status !== "Closed", // Column configuration not to be checked
    }),
  }

  const rightContent = (
    <div className="flex justify-between items-center">
      {/* {selectedRowKeys.length > 0 && (
        <ModalTax handleSubmit={(e) => handleSubmitGp(e)} />
      )} */}
      {/* <button
        onClick={() => {
          if (readyToSubmit) {
            setSelectedRowKeys([])
            return setReadyToSubmit(false)
          }
          return setReadyToSubmit(true)
        }}
        className={`text-white bg-${
          !readyToSubmit ? "blue" : "red"
        }-700 hover:bg-${
          !readyToSubmit ? "blue" : "red"
        }-800 focus:ring-4 focus:outline-none focus:ring-${
          !readyToSubmit ? "blue" : "red"
        }-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2`}
      >
        <span className="ml-2">
          {readyToSubmit ? "Cancel Submit" : "Ready To Submit"}
        </span>
      </button> */}

      <FilterModal handleOk={handleFilter} />
      {/* <button
        className="ml-3 text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2"
        onClick={() => handleExportContent()}
      >
        {loadingExport ? <LoadingOutlined /> : <FileExcelOutlined />}
        <span className="ml-2">Export</span>
      </button> */}
      <button
        // onClick={() => handleGetUid()}
        onClick={() => navigate("form")}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        {uidLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <span className="ml-2">Tambah Prospect</span>
      </button>
    </div>
  )

  return (
    <Layout rightContent={rightContent} title="List Prospect">
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
                    loadContact()
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
        dataSource={prospectList}
        columns={prospectListColumn}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
        rowSelection={readyToSubmit ? rowSelection : null}
      />
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        total={total}
        className="mt-4 text-center"
        onChange={handleChange}
        pageSizeOptions={["10", "20", "50", "100", "200", "500"]}
      />
    </Layout>
  )
}

export default ProspectList
