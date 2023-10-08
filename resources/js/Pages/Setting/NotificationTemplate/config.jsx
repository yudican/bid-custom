import { Tag } from "antd"

const notificationTemplateListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Code",
    dataIndex: "notification_code",
    key: "notification_code",
  },
  {
    title: "Title",
    dataIndex: "notification_title",
    key: "notification_title",
  },
  {
    title: "Type",
    dataIndex: "notification_type",
    key: "notification_type",
    render: (text, record) => {
      return text ? text.replace("amail", "email").replace("-", " & ") : "-"
    },
  },
  {
    title: "Role",
    dataIndex: "role_name",
    key: "role_name",
    render: (text, record) => {
      return (
        <div>
          {record.role_name?.map((item, index) => (
            <Tag color="blue" key={index}>
              {item}
            </Tag>
          ))}
        </div>
      )
    },
  },
]

export { notificationTemplateListColumn }
