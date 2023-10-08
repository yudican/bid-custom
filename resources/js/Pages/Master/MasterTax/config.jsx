const packageListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Tax Code",
    dataIndex: "tax_code",
    key: "tax_code",
  },
  {
    title: "Tax Percentage",
    dataIndex: "tax_percentage",
    key: "tax_percentage",
  },
];

export { packageListColumn };
