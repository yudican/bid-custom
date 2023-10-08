const pointListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Point",
    dataIndex: "point",
    key: "point",
  },
  {
    title: "Minimum Transaction",
    dataIndex: "min_trans",
    key: "min_trans",
  },
  {
    title: "Max Transaction",
    dataIndex: "max_trans",
    key: "max_trans",
  },
  {
    title: "Brand",
    dataIndex: "brand_name",
    key: "brand_name",
  },
];

export { pointListColumn };
