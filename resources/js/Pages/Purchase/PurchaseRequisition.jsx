import {
  CloseCircleFilled,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Dropdown, Input, Menu, Pagination, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import "react-circular-progressbar/dist/styles.css"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"
import FilterModal from "./Components/FilterModal"
import { purchaseRequisitionListColumn } from "./config"

const PurchaseRequisition = () => {
  // hooks
  const navigate = useNavigate()
  // state
  const [loading, setLoading] = useState(false)
  const [purchaseOrderList, setPurchaseOrderList] = useState([])
  const [searchPurchaseOrderList, setSearchPurchaseOrderList] = useState(null)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})

  const SearchResult = () => {
    return purchaseOrderList.filter((value) => value.po_number.includes(search))
  }

  const loadData = (
    url = "/api/purchase/purchase-requitition",
    perpage = 10,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axios.post(url, { perpage, ...params }).then((res) => {
      const { data, total, current_page } = res.data.data
      setTotal(total)
      setCurrentPage(current_page)
      const newData = data.map((item) => {
        return {
          ...item,
        }
      })

      setPurchaseOrderList(
        newData.sort((a, b) => {
          if (a.status == "2") {
            return a - b
          }
          return -1
        })
      )
      setLoading(false)
    })
  }
  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadData(`/api/purchase/purchase-requitition/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadData(`/api/purchase/purchase-requitition`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadData(`/api/purchase/purchase-requitition`, 10, data)
  }

  const handleCancel = (po_id) => {
    axios
      .post(`/api/purchase/purchase-requitition/cancel/${po_id}`)
      .then((res) => {
        toast.success("Purchase order berhasil dibatalkan")
        loadData()
      })
      .catch((err) => {
        toast.error("Purchase order gagal dibatalkan")
      })
  }

  const listActions = [
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
            overlay={
              <Menu itemIcon={<RightOutlined />}>
                {record.request_status == 5 && (
                  <Menu.Item
                    icon={<EditOutlined />}
                    onClick={() => navigate(`form/${record.uid_requitition}`)}
                  >
                    Ubah
                  </Menu.Item>
                )}

                <Menu.Item
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`detail/${record.uid_requitition}`)}
                >
                  Detail
                </Menu.Item>

                {/* {inArray(record.request_status, ["0", "5"]) && (
                  <Popconfirm
                    title="Yakin Batalkan Po ini?"
                    onConfirm={() => handleCancel(record.uid_requitition)}
                    // onCancel={cancel}
                    okText="Ya, Cancel"
                    cancelText="Batal"
                  >
                    <Menu.Item icon={<CloseOutlined />}>
                      <span>Cancel</span>
                    </Menu.Item>
                  </Popconfirm>
                )} */}
              </Menu>
            }
          ></Dropdown.Button>
        )
      },
    },
  ]

  const rightContent = (
    <div className="flex justify-between items-center">
      <FilterModal handleOk={handleFilter} />
      <button
        onClick={() => navigate("form")}
        className="text-white bg-blue-700 hover:bg-blue-700/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-3"
      >
        <PlusOutlined />
        <span className="ml-2">Tambah Data</span>
      </button>
    </div>
  )

  return (
    <Layout title="List Purchase Requisition" rightContent={rightContent}>
      <div className="row mb-4">
        <div className="col-md-12"></div>
        <div className="col-md-4 col-sm-6 col-12">
          <Input
            placeholder="Cari disini"
            size={"large"}
            className="rounded"
            onPressEnter={() => {
              // handleChangeSearch()
              setSearchPurchaseOrderList(SearchResult())
            }}
            suffix={
              isSearch ? (
                <CloseCircleFilled
                  onClick={() => {
                    // loadData()
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
          <strong className="float-right text-blue-400">
            Total Data: {total}
          </strong>
        </div>
      </div>
      <Table
        rowSelection
        dataSource={searchPurchaseOrderList || purchaseOrderList}
        columns={[...purchaseRequisitionListColumn, ...listActions]}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
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

export default PurchaseRequisition
