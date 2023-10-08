import React from "react";
import HeaderCard from "./atoms/HeaderCard";

const Layout = ({
  children,
  href = "#",
  title = "Lable",
  rightContent,
  onClick,
}) => {
  return (
    <div className="row">
      <HeaderCard
        href={href}
        title={title}
        rightContent={rightContent}
        onClick={onClick}
      />
      <div className="col-md-12">
        <div className="card ">
          <div className="card-body ">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
