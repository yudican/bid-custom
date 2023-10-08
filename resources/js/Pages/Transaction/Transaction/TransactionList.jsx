import {
  CloseCircleFilled,
  CloseOutlined,
  EyeOutlined,
  LinkOutlined,
  LoadingOutlined,
  PrinterTwoTone,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import {
  Dropdown,
  Input,
  Menu,
  Pagination,
  Popconfirm,
  Switch,
  Table,
} from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import { inArray } from "../../../helpers"
import AddTransaction from "./Components/AddTransaction"
import FilterModal from "./Components/FilterModal"
import { transactionListColumn } from "./config"

const TransactionList = ({ type = "customer", stage = null }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const loadData = (
    url = "/api/transaction/list",
    perpage = 10,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axios
      .post(url, { perpage, ...params, type, stage })
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
    loadData(`/api/transaction/list/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadData(`/api/transaction/list`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadData(`/api/transaction/list`, 10, data)
  }

  // selected row handler
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    getCheckboxProps: (record) => ({
      disabled: record.status < 3, // Column configuration not to be checked
    }),
  }

  const handleAction = (url) => {
    setLoadingSubmit(true)
    axios
      .post(url, { transaction_id: selectedRowKeys, type, stage })
      .then((res) => {
        const { data, message } = res.data
        setLoadingSubmit(false)
        toast.success(message)
        data.forEach((element) => {
          window.open(element)
        })
      })
      .catch((e) => {
        const { message } = e.response.data
        setLoadingSubmit(false)
        toast.error(message)
      })
  }

  const disabled = selectedRowKeys.length < 1
  const rightContent = (
    <div className="flex justify-between items-center">
      <Dropdown.Button
        style={{ borderRadius: 10 }}
        icon={<PrinterTwoTone />}
        disabled={disabled}
        trigger="click"
        className="rounded-lg mr-2"
        loading={loadingSubmit}
        overlay={
          <Menu>
            <Menu.Item className="flex justify-between items-center">
              <PrinterTwoTone />{" "}
              <a
                href={"#"}
                onClick={(e) => {
                  e.preventDefault()
                  handleAction("/api/transaction/bulk/print/label")
                }}
              >
                <span>Cetak Label</span>
              </a>
            </Menu.Item>
            <Menu.Item className="flex justify-between items-center">
              <PrinterTwoTone />{" "}
              <a
                href={"#"}
                onClick={(e) => {
                  e.preventDefault()
                  handleAction("/api/transaction/bulk/print/invoice")
                }}
              >
                <span>Cetak Invoice</span>
              </a>
            </Menu.Item>
          </Menu>
        }
      ></Dropdown.Button>
      {inArray(stage, ["on-process"]) && (
        <button
          onClick={(e) => {
            if (disabled) {
              return null
            }
            return handleAction("/api/transaction/bulk/ready-to-ship")
          }}
          className={`text-white bg-${
            disabled ? "gray" : "blue"
          }-700 hover:bg-${
            disabled ? "gray" : "blue"
          }-800 focus:ring-4 focus:outline-none focus:ring-${
            disabled ? "gray" : "blue"
          }-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2`}
          disabled={disabled}
        >
          {loadingSubmit ? (
            <LoadingOutlined />
          ) : (
            <span className="ml-2">Siap Dikirim</span>
          )}
        </button>
      )}

      <FilterModal handleOk={handleFilter} />
      {inArray(stage, ["new-order"]) && (
        <AddTransaction refetch={() => loadData()} />
      )}
    </div>
  )

  const updateStatus = (data) => {
    axios
      .post("/api/transaction/new-order/status", data)
      .then((res) => {
        const { data, message } = res.data
        toast.success(message)
        loadData()
      })
      .catch((e) => {
        const { message } = e.response.data
        toast.error(message)
      })
  }

  const toogleStatus = []
  if (stage === "new-order") {
    toogleStatus.push({
      title: "Status",
      key: "status_link",
      dataIndex: "status_link",
      render: (text, record) => {
        return (
          <Switch
            checked={text > 0}
            onChange={(e) =>
              updateStatus({
                id_transaksi: record.id,
                status_link: e ? "1" : "0",
              })
            }
          />
        )
      },
    })
  }

  return (
    <Layout rightContent={rightContent} title="List Transaction">
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
        rowSelection={rowSelection}
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
        dataSource={datas}
        columns={[
          ...transactionListColumn,
          ...toogleStatus,
          {
            title: "Action",
            key: "id",
            align: "center",
            fixed: "right",
            width: 100,
            render: (text, record) => {
              return (
                <Dropdown.Button
                  style={{
                    left: -16,
                  }}
                  // icon={<MoreOutlined />}
                  overlay={
                    <Menu itemIcon={<RightOutlined />}>
                      <Menu.Item
                        icon={<EyeOutlined />}
                        onClick={() => {
                          const params =
                            type === "agent" ? "detail/agent" : "detail"
                          const path =
                            stage === "new-order" ? "detail/new-order" : params
                          navigate(`/transaction/${path}/${text.id}`)
                        }}
                      >
                        Detail
                      </Menu.Item>
                      {stage === "new-order" && (
                        <Menu.Item
                          icon={<LinkOutlined />}
                          onClick={() => {
                            // copy link
                            const url = record?.transaction_url
                            navigator.clipboard.writeText(url)
                            toast.success("Link berhasil disalin")
                          }}
                        >
                          Copy Link
                        </Menu.Item>
                      )}
                      {stage === "new-order" && (
                        <Popconfirm
                          title="Batalkan Transaksi ini?"
                          onConfirm={() =>
                            updateStatus({
                              id_transaksi: record.id,
                              status_link: 0,
                            })
                          }
                          // onCancel={cancel}
                          okText="Ya, Batal"
                          cancelText="Tidak"
                        >
                          <Menu.Item color="red" icon={<CloseOutlined />}>
                            Cancel
                          </Menu.Item>
                        </Popconfirm>
                      )}
                    </Menu>
                  }
                ></Dropdown.Button>
              )
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

export default TransactionList
