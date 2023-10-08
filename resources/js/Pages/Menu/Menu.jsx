import { CloseOutlined } from "@ant-design/icons"
import { Popconfirm, Switch, Table } from "antd"
import { arrayMoveImmutable } from "array-move"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { SortableContainer, SortableElement } from "react-sortable-hoc"
import { toast } from "react-toastify"
import Layout from "../../components/layout"
import MenuForm from "./Components/MenuForm"
import RoleModal from "./Components/RoleModal"
import SubmenuModal from "./Components/SubmenuModal"
import { menuColumns } from "./config"

const SortableItem = SortableElement((props) => <tr {...props} />)
const SortableBody = SortableContainer((props) => <tbody {...props} />)
const MenuPages = () => {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(false)
  const loadMenu = () => {
    setLoading(true)
    axios
      .get("/api/menu/list")
      .then((res) => {
        const { data } = res.data
        setLoading(false)
        const newData = data.map((item, index) => {
          return {
            ...item,
            index,
          }
        })
        setMenus(newData)
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  const updateMenu = (menu) => {
    axios
      .post(`/api/menu/update/${menu.id}`, menu)
      .then((res) => {
        const { message } = res.data
        loadMenu()
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const updateRole = (item, value) => {
    axios
      .post(`/api/menu/role/update/${item.menu_id}`, {
        role_id: item.id,
        value,
      })
      .then((res) => {
        const { message } = res.data
        loadMenu()
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const deleteMenu = (menu_id) => {
    axios
      .post(`/api/menu/delete/${menu_id}`, {
        _method: "DELETE",
      })
      .then((res) => {
        const { message } = res.data
        loadMenu()
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
      .catch((err) => {
        const { message } = err.response.data
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  useEffect(() => {
    loadMenu()

    return () => {}
  }, [])

  const showMenu = [
    {
      title: "Show Menu",
      key: "show_menu",
      dataIndex: "show_menu",
      render: (text, record) => {
        return (
          <Switch
            checked={text > 0}
            onChange={(e) =>
              updateMenu({ ...record, show_menu: e ? "1" : "0" })
            }
          />
        )
      },
    },
  ]
  const asyncRole = [
    {
      title: "Permission",
      key: "status",
      dataIndex: "status",
      render: (text, record) => {
        return <Switch checked={text} onChange={(e) => updateRole(record, e)} />
      },
    },
  ]
  const rolesColumns = [
    {
      title: "Permission Role",
      key: "role",
      dataIndex: "role",
      render: (text, record) => {
        return (
          <RoleModal
            actionColumns={asyncRole}
            dataSource={record.roles}
            loading={loading}
            hasChildren={record?.roles?.length > 0}
            title={`Permission Role of ${record.menu_label}`}
          />
        )
      },
    },
  ]
  const actions = [
    {
      title: "Actions",
      key: "action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex justify-between items-center">
            <MenuForm
              refetch={() => loadMenu()}
              initialValues={record}
              update
              parents={menus}
              url={`/api/menu/update/${record.id}`}
            />
            <Popconfirm
              title="Yakin Hapus Data ini?"
              onConfirm={() => deleteMenu(record.id)}
              // onCancel={cancel}
              okText="Ya, Hapus"
              cancelText="Batal"
            >
              <button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center">
                <CloseOutlined />
              </button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  const actionColumns = [
    ...showMenu,
    {
      title: "Submenu",
      key: "submenu",
      dataIndex: "submenu",
      render: (text, record) => {
        const childrens = record.childrens.map((item, index) => {
          return {
            ...item,
            index,
          }
        })
        return (
          <SubmenuModal
            actionColumns={[...showMenu, ...rolesColumns, ...actions]}
            dataSource={childrens}
            loading={loading}
            hasChildren={childrens.length > 0}
            title={`Submenu of ${record.menu_label}`}
            refetch={() => loadMenu()}
          />
        )
      },
    },
    ...rolesColumns,
    ...actions,
  ]

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        menus.slice(),
        oldIndex,
        newIndex
      ).filter((el) => !!el)

      const sorted = newData.map((item, index) => {
        return {
          value: index + 1,
          id: item.id,
        }
      })
      // console.log("Sorted items: ", newData);
      // setMenus(newData);
      //   setDataSource(newData);
      axios.post("/api/menu/order", { menus: sorted }).then((res) => {
        const { message } = res.data
        loadMenu()
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
    }
  }

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = menus.findIndex((x) => x.index === restProps["data-row-key"])
    return <SortableItem index={index} {...restProps} />
  }

  return (
    <Layout
      title="Menu"
      rightContent={
        <MenuForm
          refetch={() => loadMenu()}
          parents={menus}
          url={`/api/menu/create`}
        />
      }
    >
      <Table
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        dataSource={menus}
        columns={[...menuColumns, ...actionColumns]}
        loading={loading}
        pagination={false}
        rowKey="index"
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
      />
    </Layout>
  )
}

export default MenuPages
