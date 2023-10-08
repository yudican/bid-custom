import React from "react";
import { Link } from "react-router-dom";

const HeaderCard = ({
    href,
    title = "Lable",
    rightContent = null,
    onClick,
}) => {
    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title text-capitalize flex justify-content-between align-items-center">
                        <Link to={href} onClick={onClick}>
                            <span>
                                <i className="fas fa-arrow-left mr-3"></i>
                                {title}
                            </span>
                        </Link>
                        <span>{rightContent}</span>
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default HeaderCard;
