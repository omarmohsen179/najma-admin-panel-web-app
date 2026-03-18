import { memo, useState } from "react";
import YesOrNoPopUp from "../YesOrNoPopUp/YesOrNoPopUp";

const CrudCard = ({ res, onEdit, Key, OnDelete, CardComponent }) => {
  const [YesOrNo, setYesOrNo] = useState({ id: 0, state: false });
  return (
    <div className="row Home-benefits-card">
      <div onClick={() => onEdit(res)} className="col">
        <CardComponent res={res} />
        <div className="step-card-title">
          <i
            className="fas fa-lightbulb"
            style={{ color: res.Active ? "green" : "red" }}
          ></i>
        </div>
      </div>

      <div
        className="col-lg-2 col-md-2 col-sm-2 delete-icon-crud"
        onClick={() => setYesOrNo({ id: res[Key], state: true })}
      >
        <i className=" fas fa-trash-alt"></i>
        <YesOrNoPopUp
          dailog={YesOrNo}
          setdialog={(e) => setYesOrNo({ id: 0, state: e })}
          OnDelete={OnDelete}
        />
      </div>
    </div>
  );
};
export default memo(CrudCard);
