import { Badge, Menu } from "antd"
import Sider from "antd/lib/layout/Sider"
import axios from "axios"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

function getItem(label, key, url, icon, children, badge) {
  return {
    key,
    icon,
    badge,
    children,
    label,
    url,
  }
}

const Sidebar = () => {
  const [active, setActive] = useState(1)
  const [activeChildren, setActiveChildren] = useState(1)
  const [collapse, setCollapsed] = useState(false)
  // console.log(
  //   "active :",
  //   active,
  //   "\nactiveChildren :",
  //   activeChildren,
  //   "\ncollapse :",
  //   collapse,
  //   "\n ---------------------FROM STATE------------------------"
  // )
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const itemsSidebar = menus?.map((value) => {
    return getItem(
      `${value.menu_label}`,
      `${value.id}`,
      `${value.menu_url}`,
      value.menu_icon,
      // <QuestionCircleOutlined />,
      value?.children?.length > 0 &&
        value.children
          .map((value) => {
            if (value?.show_menu === "1") {
              return getItem(
                `${value.menu_label}`,
                `${value.id}`,
                `${value.menu_url}`,
                null,
                null,
                value.badge_count
              )
            } else {
              return null
            }
          })
          .filter((value) => value),
      value.badge_count
    )
  })
  // console.log("itemsSidebar: ", itemsSidebar)

  const currentUrl = new URL(window.location.href)
  const pathName = currentUrl?.pathname
  const parts = pathName?.split("/").filter(Boolean)
  const MainUrl = parts[0]
  // console.log("MainUrl: ", MainUrl)
  const ChildUrl = parts[1] || ""
  // console.log("ChildUrl: ", ChildUrl)
  const activeUrl =
    itemsSidebar &&
    [...itemsSidebar]?.find((value) =>
      value.label
        .replace(/-/g, " ")
        .toLowerCase()
        .includes(MainUrl.split("-")[1] || MainUrl.replace(/-/g, " "))
    )
  // console.log("activeUrl: ", activeUrl)
  const includesChildStr = (str) => {
    console.log(str, "str")
    // console.log(str.replace(/-/g, " ") === ChildUrl.replace(/-/g, " "))
    if (str === ChildUrl.replace(/-/g, " ")) {
      console.log("includes true")
      return ChildUrl.replace(/-/g, " ")
    } else {
      console.log("includes false")
      return ChildUrl.split("-")[1] || ChildUrl.split("-")[0]
    }
  }

  const activeUrlChildren =
    activeUrl?.children &&
    activeUrl?.children?.find((value) =>
      value.label
        .replace(/-/g, " ")
        .toLowerCase()
        .includes(includesChildStr(ChildUrl))
    )
  // console.log("activeUrlChildren", activeUrlChildren)
  // setter variable for active sidebar
  const ActiveSidebarId = activeUrlChildren?.key || activeUrl?.key
  const ActiveSidebarKeyPath =
    activeUrlChildren?.key === undefined
      ? [activeUrl?.key].toString()
      : [activeUrlChildren?.key, activeUrl?.key].toString()
  const ActiveSidebarOpenKey = activeUrl?.key

  // console.log(
  //   "activeSidebarId :",
  //   ActiveSidebarId,
  //   "\nactiveSidebarKeyPath :",
  //   ActiveSidebarKeyPath,
  //   "\nactiveSidebarOpenKeys :",
  //   ActiveSidebarOpenKey,
  //   "\n ---------------------MODIFIED--------------------------"
  // )

  const loadUserLogin = () => {
    setLoading(true)
    axios
      .get("/api/general/load-user")
      .then((res) => {
        const { data } = res.data
        setIsSuccess(true)
        setLoading(false)
        localStorage.setItem("account_id", data.account_id)
        localStorage.setItem("user_data", JSON.stringify(data))
        localStorage.setItem("menu_data", JSON.stringify(data?.menu_data))
        localStorage.setItem("role", data?.role?.role_type)
        localStorage.setItem("service_ginee_url", data?.service_ginee_url)
        setMenus(data?.menu_data || [])
      })
      .catch(() => setLoading(false))
  }

  const loadSetting = () => {
    axios
      .post("/api/general/load-setting", { key: "REFRESH_MENU" })
      .then((res) => {
        const { data } = res.data
        if (data) {
          loadUserLogin()
          axios.post("/api/general/delete-setting", {
            key: "REFRESH_MENU",
          })
        }
      })
  }

  const menu_id = localStorage.getItem("menu_id") || 1
  const children_id = localStorage.getItem("children") || 1

  const activeSidebarId = localStorage.getItem("activeSidebarId")
  const activeSidebarKeyPath = [localStorage.getItem("activeSidebarKeyPath")]
  const activeSidebarOpenKeys = [localStorage.getItem("activeSidebarOpenKeys")]
  // console.log(
  //   "activeSidebarId :",
  //   activeSidebarId,
  //   "\nactiveSidebarKeyPath :",
  //   activeSidebarKeyPath,
  //   "\nactiveSidebarOpenKeys :",
  //   activeSidebarOpenKeys,
  //   "\n -----------------LOCAL STORAGE-------------------------"
  // )

  useEffect(() => {
    loadSetting()
    loadUserLogin()
  }, [])

  useEffect(() => {
    const checkIfOpenedFromNewTab = () => {
      const performanceEntries = performance.getEntriesByType("navigation")
      if (performanceEntries.length > 0) {
        const { type } = performanceEntries[0]
        if (type === "reload" || type === "back_forward") {
          console.log("Opened from a new tab")
          // Perform your desired actions here
          return true
        }
      }
    }

    if (isSuccess && checkIfOpenedFromNewTab()) {
      localStorage.setItem("activeSidebarId", ActiveSidebarId)
      localStorage.setItem("activeSidebarKeyPath", ActiveSidebarKeyPath)
      localStorage.setItem("activeSidebarOpenKeys", ActiveSidebarOpenKey)
    }
  }, [isSuccess])

  useEffect(() => {
    if (menu_id) {
      setActive(parseInt(menu_id))
    }
    if (children_id) {
      setActiveChildren(parseInt(children_id))
      setCollapsed(true)
    }
    const menu = JSON.parse(localStorage.getItem("menu_data"))
    if (menu) {
      setMenus(menu)
    }
  }, [menu_id, children_id])

  if (loading) {
    return (
      <ul className="nav nav-primary">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
          <li key={index} className={`nav-item mb-2`}>
            <Skeleton height={40} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="nav nav-primary">
      <Sider width={"100%"}>
        <Menu
          theme="light"
          selectedKeys={activeSidebarId}
          defaultSelectedKeys={activeSidebarKeyPath}
          defaultOpenKeys={activeSidebarOpenKeys}
          mode="inline"
          // items={itemsSidebar}
          onClick={(params) => {
            // console.log(params, "params")
            // console.log(params?.key, "key")
            // console.log(params?.keyPath, "path")
            //
            localStorage.setItem("activeSidebarId", params?.key)
            localStorage.setItem("activeSidebarKeyPath", params?.keyPath)
            localStorage.setItem(
              "activeSidebarOpenKeys",
              params?.keyPath.slice(-1)[0]
            )
            //
            // window.location.href = params.item.props.url
          }}
        >
          {itemsSidebar &&
            itemsSidebar.map((value) => {
              // console.log(value.key, "item sidebar")
              if (value?.children?.length > 0) {
                return (
                  <Menu.SubMenu
                    icon={
                      <i className={value?.icon || "fas fa-layer-group"}></i>
                    }
                    key={value?.key}
                    title={<span className="font-normal">{value?.label}</span>}
                  >
                    {value.children.map((children) => {
                      return (
                        <Menu.Item className="w-fit" key={children?.key}>
                          <Badge
                            key={children?.key}
                            overflowCount={999}
                            count={children?.badge}
                            offset={children?.badge > 99 ? null : [16, 0]}
                          >
                            <a className="font-normal" href={children?.url}>
                              {children?.label}
                            </a>
                          </Badge>
                        </Menu.Item>
                      )
                    })}
                  </Menu.SubMenu>
                )
              }
              return (
                <Menu.Item key={value?.key}>
                  <Badge count={value?.badge} offset={[16, 0]}>
                    <a href={value.url}>
                      <i className={value?.icon || "fas fa-layer-group"}></i>
                      <span className="ml-2 font-normal">{value?.label}</span>
                    </a>
                  </Badge>
                </Menu.Item>
              )
            })}

          <div className="text-center text-[#D4D4D4] mt-4 text-sm font-light">
            <p>Version 2.1.0</p>
          </div>
        </Menu>
      </Sider>
    </div>
  )
}

const sidebarRoot = ReactDOM.createRoot(
  document.getElementById("sidebar-react")
)
sidebarRoot.render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>
)
