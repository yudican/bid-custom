const levelListColumn = [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Level Name",
    dataIndex: "name",
    key: "name",
  },
];

export { levelListColumn };
