import { pages } from "app/navigations";
import DisplayText from "../components/DisplayText/DisplayText";
import ImagesDisplay from "../components/ImagesDisplay/ImagesDisplay";
import { get_element_name, get_name } from "../store/DataReducer";
export function createQueryString(params) {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}
export const seasonData = [
  {
    Id: 0,
    Name: "كلاهما",
    NameEn: "Both",
  },
  {
    Id: 1,
    Name: "الشتاء",
    NameEn: "winter",
  },
  {
    Id: 2,
    Name: "الصيف",
    NameEn: "summer",
  },
];

export const paymentTypes = [
  {
    Id: -1,
    Name: "كل",
    NameEn: "All",
  },
  {
    Id: 0,
    Name: "Cash",
    NameEn: "Cash",
  },
  {
    Id: 1,
    Name: "Visa",
    NameEn: "Visa",
  },
];
export const Estate = [
  {
    Id: 3,
    Name: "كل",
    NameEn: "All",
  },
  {
    Id: 0,
    Name: "معلق",
    NameEn: "Pending",
  },
  {
    Id: 1,
    Name: "وافقت",
    NameEn: "Accepted",
  },
  {
    Id: 2,
    Name: "مرفوض",
    NameEn: "Rejected",
  },
];

export const EInvoiceType = [
  {
    Id: 0,
    Name: "المورد",
    NameEn: "Supplier",
  },
  {
    Id: 1,
    Name: "العميل",
    NameEn: "Customer",
  },
];
export function isDateBeforeToday(date) {
  return new Date(date.toDateString()) < new Date(new Date().toDateString());
}
export function groupByOrders(arr, property, lookups, items = []) {
  var res = arr?.reduce(function (memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
  var resObj = Object.keys(res).map((e, i) => {
    const resx = res[e];
    var resxx = items.filter(
      (e) => e.Main && e.RecipeModelNumber == resx[0].RecipeModelNumber
    );

    var factory = "";
    if (resxx.length > 0) {
      // factory = resxx[0].FactoryCode;
    }
    const delimiter = ", ";

    const result = resx
      .map(
        (obj) => get_name(lookups.Colors, obj.ColorId) + " (" + factory + ")"
      )
      .join(delimiter);
    return {
      Title: get_name(lookups.Colors, resx[0].ColorId) + " (" + factory + ")",
      ColorId: resx[0].ColorId,
      RecipeModelNumber: resx[0].RecipeModelNumber,
      data: resx.sort((a, b) =>
        parseInt(
          lookups.Sizes.filter((ex) => ex.Id == a.SizeId)[0].SizeName,
          10
        ) >
        parseInt(
          lookups.Sizes.filter((ex) => ex.Id == b.SizeId)[0].SizeName,
          10
        )
          ? 1
          : -1
      ),
    };
  });
  return resObj;
}
export function unGroupByOrders(arr) {
  return arr.flatMap((e) => e.data);
}
export const calculateRemain = (
  ele,
  original,
  quantities,
  quantitiesValue = "In",
  originalValue = "Out",
  res = "Out"
) => {
  return {
    ...ele,
    data: ele.data?.map((e, indx) => {
      var used = quantities.find((ex) => elementFilterModel(e, ex))[
        quantitiesValue
      ];
      var org = original.find((ex) => elementFilterModel(e, ex))[originalValue];
      return {
        ...e,
        [res]: used ? org - used : org,
      };
    }),
  };
};
export const elements = [
  {
    Id: 0,
    Name: "الجميع",
    NameEn: "All",
  },
  {
    Id: 1,
    Name: "عناصر",
    NameEn: "Items",
  },
];
export const RecipeTypes = [
  {
    Id: 0,
    Name: "غير معروف",
    NameEn: "None",
  },
  {
    Id: 1,
    Name: "تاطريز",
    NameEn: "Embroidery",
  },
  {
    Id: 2,
    Name: "HandMade",
    NameEn: "HandMade",
  },
  {
    Id: 3,
    Name: "تشغيل خرجي ",
    NameEn: "Out",
  },
];
export const ActionType = [
  {
    Id: true,
    Name: "دخول",
    NameEn: "In",
  },
  {
    Id: false,
    Name: "خارج",
    NameEn: "Out",
  },
];
export const ModelGroupStates = [
  {
    Id: 0,
    Name: "طبيعي",
    NameEn: "Normal",
  },
  {
    Id: 1,
    Name: "لاستكمال",
    NameEn: "ToContinue",
  },
  {
    Id: 2,
    Name: "استرداد",
    NameEn: "Refund",
  },
  {
    Id: 3,
    Name: "متأخر",
    NameEn: "Delay",
  },
  {
    Id: 4,
    Name: "تم ألغيت",
    NameEn: "Canceled",
  },
];
export function getUniqueListBy(arr, key) {
  return arr.filter(
    (v, i, a) => a.findLastIndex((v2) => v2[key] === v[key]) === i
  );
}
export function mapArrayToForm(array, formData, name) {
  return array.forEach((item, index) =>
    formData.append(name + "[" + index + "]", item)
  );
}
function isObjectWithKeys(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  );
}
export const itemFormat = (lookups, cartProduct) => {
  return (
    getCategoryId(lookups, cartProduct.ElementId, 0).CategoryName +
    " " +
    get_element_name(lookups, 2, cartProduct.ElementId) +
    " " +
    (cartProduct.ItemName ? cartProduct.ItemName : "") +
    " " +
    get_name(lookups.Configurations, cartProduct.ConfigurationId) +
    " " +
    (cartProduct.SeasonYear > 0 ? cartProduct.SeasonYear : "")
  );
};
export const itemCols = [
  {
    caption: "Description",
    field: "Item",
    captionEn: "Description",
  },
  {
    caption: "Unit Cost",
    field: "SellPrice",
    captionEn: "Unit Cost",
  },
  {
    caption: "Quantity",
    field: "CurrentQuantity",
    captionEn: "Quantity",
  },
];
export const mapArrayObject = (arrayName, array) => {
  let data = new FormData();

  const ifObject = (name, values) => {
    for (let [key, value] of Object.entries(values)) {
      let propName = (name.length > 0 ? name + "." : "") + key;
      if (Array.isArray(value) && !(value instanceof File)) {
        ifArray(propName, value);
      } else if (isObjectWithKeys(value) && !(value instanceof File)) {
        ifObject(propName, value);
      } else {
        data.append(propName, value);
      }
    }
  };
  const ifArray = (name, values) => {
    values.forEach((property, index) => {
      let propName = name + "[" + index + "]";
      if (typeof property == "number") {
        data.append(propName, property.toString());
      } else if (isObjectWithKeys(array) && !(property instanceof File)) {
        ifObject(propName, property);
      } else data.append(propName, property);
    });
  };
  if (isObjectWithKeys(array)) {
    ifObject(arrayName, array);
  } else {
    ifArray(arrayName, array);
  }
  return data;
};

export const stagesDataQuantities = (values, lookups) => {
  var grouped = values.Groups ? values.Groups.flatMap((e) => e.Quantities) : [];
  // var ungrouped = values?.UnGrouped?.map((e, i) => {
  //   if (grouped.length > 0)
  //     return {
  //       ...e,
  //       Value: e.Value - grouped.find((ex, ind) => ind == i).Value,
  //     };
  //   else return e;
  // });

  return [
    {
      Title:
        "Actual Quantity " +
        " : " +
        (values.ActualQuantities
          ? values?.ActualQuantities?.map((e) => e.Value).reduce(
              (partialSum, a) => partialSum + a,
              0
            )
          : 0),
      data: groupByOrders(
        values?.ActualQuantities ? values?.ActualQuantities : [],
        "RecipeModelNumber",
        lookups
      ),
    },

    {
      Title:
        "Groups Quantity " +
        " : " +
        grouped
          ?.map((e) => e.Value)
          ?.reduce((partialSum, a) => partialSum + a, 0),
      data: groupByOrders(grouped, "RecipeModelNumber", lookups),
    },
    // {
    //   Title:
    //     "unGrouped Quantity " +
    //     " : " +
    //     values?.UnGrouped.map((e) => e.Value)?.reduce(
    //       (partialSum, a) => partialSum + a,
    //       0
    //     ),
    //   data: groupByOrders(values?.UnGrouped, "RecipeModelNumber", lookups),
    // },
  ];
};
export const displayValueTable = (col, row, i18n) => {
  try {
    if (col.data != null) {
      return col.data?.find((e) => e[col.value] == row[col.field])[
        i18n.language == "en" && col.displayEn ? col.displayEn : col.display
      ];
    } else if (col?.function != null) {
      return col.function(row);
    } else {
      return row[col.field]?.toFixed(2);
    }
  } catch {
    return "";
  }
};
export const checkForAccounting = (lookups) => {
  return lookups?.Roles?.find((role) => role == "Accounting") != null;
};
export const generateElementCode = (lookups, obj) => {
  if (obj.Type == 0 || obj.Type == 1) {
    var res = "";
    const category = getCategoryId(lookups, obj.ElementId, obj.Type);
    if (category?.Id) {
      res += category.Id;
    }
    const ele = getElementId(lookups, obj.ElementId, obj.Type);
    if (ele?.Number) {
      res += ele?.Number?.toString();
    }
    if (obj.SupplierId) {
      var co = lookups.Suppliers.find((e) => e.Id == obj.SupplierId)?.Number;
      res += co ? co?.toString() : "";
    }
    // if (obj.ColorId) {
    //   var co = lookups.Colors.find((e) => e.Id == obj.ColorId)?.Number;
    //   res += co ? co?.toString() : "";
    // }
    // if (obj.DescriptionColorId) {
    //   var co = lookups.DescriptionColors.find(
    //     (e) => e.Id == obj.DescriptionColorId
    //   )?.Number;

    //   res += co ? co?.toString() : "";
    // }

    // if (obj.SizeId) {
    //   var co = lookups.Sizes.find((e) => e.Id == obj.SizeId)?.Number;
    //   res += co ? co?.toString() : "";
    // }
    // if (obj.Season != -1) {
    //   //  res += obj.Season.toString();
    // }
    return res;
  } else {
    var res = "";
    const ele = getElementId(lookups, obj.ElementId, obj.Type);
    if (ele?.Number) {
      res += ele?.Number?.toString();
    }
    if (obj.ColorId) {
      var co = lookups.Colors.find((e) => e.Id == obj.ColorId)?.Number;
      res += co ? co?.toString() : "";
    }
    return res;
  }
};
export const allElements = (lookups) => {
  return lookups.Items.map((e) => {
    e = { ...e, Type: 1 };
    return e;
  });
  // return lookups.Models.map((e) => {
  //   e = { ...e, Type: 2 };
  //   return e;
  // }).concat(
  //   lookups.Items.map((e) => {
  //     e = { ...e, Type: 1 };
  //     return e;
  //   }),
  //   lookups.Accessories.map((e) => {
  //     e = { ...e, Type: 0 };
  //     return e;
  //   })
  // );
};
export const columnPayments = [
  {
    caption: "الرقم",
    field: "Id",
    captionEn: "Id",
    disable: true,
  },
  {
    caption: "رقم الفاتورة",
    field: "StoreLogInvoiceId",
    captionEn: "InvoiceId",
    // customizeText: (data) => {
    //   return (
    //     <div>
    //       {data.value}
    //       <IconButton onClick={() => {}}>
    //         <ListIcon />
    //       </IconButton>
    //     </div>
    //   );
    // },
  },
  {
    caption: "الوقت",
    field: "Date",
    captionEn: "Date",
    type: "date",
  },

  {
    caption: "التكلفة",
    field: "Payment",
    captionEn: "Cost",
  },
  {
    caption: "نوع",
    captionEn: "Type",
    field: "Type",
    widthRatio: 100,
    display: "Name",
    value: "Id",
    data: paymentTypes.filter((e) => e.Id != -1),
  },
  {
    caption: "ملحوظة",
    field: "Note",
    captionEn: "Note",
  },
];
export const columnAttributesElements = (lookups, i18n) => [
  // {
  //   caption: "صورة",
  //   field: "ImagePath",
  //   captionEn: "Image",
  //   customizeText: (data) => {
  //     return (
  //       <div>
  //         {data.value ? (
  //           <ImagesDisplay height="50px" data={[data.value]} />
  //         ) : (
  //           ""
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   caption: "Id",
  //   field: "Id",
  //   captionEn: "Id",
  //   disable: true,
  //   widthRatio: 100,
  // },
  {
    caption: "Barcode",
    field: "FactoryCode",
    captionEn: "Barcode",
    type: "number",
  },
  {
    caption: "رقم القطعة",
    field: "PartNumber",
    captionEn: "Part Number",
    type: "number",
  },
  {
    caption: "التصنيف",
    field: "CategoryId",
    captionEn: "Category",
    display: "CategoryName",
    value: "Id",
    data: lookups.Categories,
    setCellValue: function (rowData, value) {
      rowData.ElementId = null;
      this.defaultSetCellValue(rowData, value);
    },

    required: true,
  },
  {
    caption: "الطراز",
    field: "ElementId",
    display: "ElementName",
    data: (options) => {
      console.log(options);
      return {
        store: lookups.Items,
        filter: options.data
          ? ["CategoryId", "=", options.data.CategoryId]
          : null,
      };
    },

    captionEn: "Sub-category",
    value: "Id",
    required: true,
  },
  {
    caption: "اسم العنصر",
    field: "ItemName",
    captionEn: "Item Name",
    required: true,
  },
  {
    caption: "أصل",
    field: "ConfigurationId",
    captionEn: "Origin",
    display: "ColorName",
    value: "Id",
    data: [
      {
        Id: 0,
        ColorName: i18n.language == "en" ? "None" : "غير معروف",
      },
      ...lookups.Configurations,
    ],
  },
  {
    caption: "المورد",
    field: "SupplierId",
    captionEn: "Supplier",
    display: "MemberName",
    value: "Id",
    data: [
      {
        Id: 0,
        MemberName: i18n.language == "en" ? "None" : "غير معروف",
      },
      ...lookups.Suppliers,
    ],
  },
  {
    caption: "سنة الصنع",
    field: "SeasonYear",
    captionEn: "Model Year",
  },
];
function removeSubstringFromLetterToEnd(str, x) {
  let index = str.indexOf(x);
  return index !== -1 ? str.substring(0, index) : str;
}
export const getPageInfo = () =>
  pages[0].children.filter(
    (e) =>
      "#" + e.path == removeSubstringFromLetterToEnd(window.location.hash, "?")
  )[0];
export const getCategoryId = (lookups, id, type) => {
  // const elementsx = lookups.Models.map((e) => {
  //   e = { ...e, Type: 2 };
  //   return e;
  // }).concat(
  //   lookups.Items.map((e) => {
  //     e = { ...e, Type: 1 };
  //     return e;
  //   }),
  //   lookups.Accessories.map((e) => {
  //     e = { ...e, Type: 0 };
  //     return e;
  //   })
  // );
  type = 1;
  const elementsx = lookups.Items.map((e) => {
    e = { ...e, Type: 1 };
    return e;
  });
  const categoryId = elementsx.find(
    (e) => e.Id == id && type == e.Type
  )?.CategoryId;
  return lookups.Categories.find((e) => e.Id == categoryId);
};
const getElementId = (lookups, id, type) => {
  // const elementsx = lookups.Models.map((e) => {
  //   e = { ...e, Type: 2 };
  //   return e;
  // }).concat(
  //   lookups.Items.map((e) => {
  //     e = { ...e, Type: 1 };
  //     return e;
  //   }),
  //   lookups.Accessories.map((e) => {
  //     e = { ...e, Type: 0 };
  //     return e;
  //   })
  // );
  const elementsx = lookups.Items.map((e) => {
    e = { ...e, Type: 1 };
    return e;
  });
  const elem = elementsx.find((e) => e.Id == id && type == e.Type);
  return elem;
};
export const elementFilter = (e, itemValues) => {
  return (
    e.ColorId == itemValues.ColorId && e.ElementId == itemValues.ElementId

    // &&
    // e.Season == itemValues.Season &&
    // e?.DescriptionColorId == itemValues?.DescriptionColorId &&
    // e.SizeId == itemValues.SizeId
  );
};
export const elementFilterModel = (e, itemValues) => {
  return (
    e.ColorId == itemValues.ColorId &&
    e?.DescriptionColorId == itemValues?.DescriptionColorId &&
    e.SizeId == itemValues.SizeId &&
    e.RecipeModelNumber == itemValues.RecipeModelNumber
  );
};
export const columnAttributesRecipe = (lookups, i18n) => [
  {
    caption: "Main",
    field: "Main",
    captionEn: "Main",
    customizeText: (data) => {
      return (
        <div>
          <i
            style={{ color: data.value ? "green" : "red" }}
            className="fas fa-circle"
          ></i>
        </div>
      );
    },
  },
  {
    caption: "صورة",
    field: "ImagePath",
    captionEn: "Image",

    customizeText: (data) => {
      return (
        <div>
          {data.value ? (
            <ImagesDisplay height="50px" data={[data.value]} />
          ) : (
            ""
          )}
        </div>
      );
    },
  },
  {
    caption: "التصنيف",
    field: "CategoryId",
    captionEn: "Category",
    customizeText: (data) => {
      return (
        <div>
          {
            getCategoryId(lookups, data.data.ElementId, data.data.Type)
              ?.CategoryName
          }
        </div>
      );
    },
    // display: "CategoryName",
    // value: "Id",
    // groupIndex: 0,
    // data: lookups.Categories,
  },
  // {
  //   caption: "نوع",
  //   field: "Type",
  //   display: "Name",
  //   displayEn: "NameEn",
  //   captionEn: "Type",
  //   value: "Id",
  //   data: elements,
  //   // groupIndex: 1,
  // },
  {
    caption: "عنصر",
    field: "ElementId",
    display: "ElementName",
    value: "Id",
    captionEn: "Element",
    data: lookups.Models.map((e) => {
      e = { ...e, Type: 2 };
      return e;
    }).concat(
      lookups.Items.map((e) => {
        e = { ...e, Type: 1 };
        return e;
      }),
      lookups.Accessories.map((e) => {
        e = { ...e, Type: 0 };
        return e;
      })
    ),
  },
  {
    caption: "المورد",
    field: "SupplierId",
    captionEn: "Supplier",
    display: "SupplierName",
    value: "Id",
    data: lookups.Suppliers,
    // groupIndex: 2,
  },
  // {
  //   caption: " شفرة مصنع",
  //   field: "FactoryCode",
  //   captionEn: "Factor Code",
  //   customizeText: (data) => {
  //     return (
  //       <div>
  //         {data.value ? <DisplayText type={"number"} value={data.value} /> : ""}
  //       </div>
  //     );
  //   },
  // },
  {
    caption: "شفرة",
    field: "Code",
    captionEn: "Code",
    customizeText: (data) => {
      return <div>{generateElementCode(lookups, data.data)}</div>;
    },
  },
  {
    caption: "اللون",
    field: "ColorId",
    captionEn: "Color",
    display: "ColorName",
    value: "Id",
    data: lookups.Colors,
    // groupIndex: 2,
  },
  {
    caption: "description",
    field: "DescriptionColorId",
    // groupIndex: 2,
    captionEn: "description",
    display: "ColorName",
    value: "Id",
    data: lookups.DescriptionColors,
  },
  {
    caption: "مقاس",
    field: "SizeId",
    // groupIndex: 2,
    captionEn: "Size",
    display: "SizeName",
    value: "Id",
    data: lookups.Sizes,
  },
  {
    caption: "الموسم",
    field: "Season",
    captionEn: "Season",
    displayEn: "NameEn",
    display: "Name",
    value: "Id",
    data: lookups.seasonData,
  },

  {
    caption: "قِطَع",
    field: "Pieces",
    captionEn: "Pieces",
  },

  {
    caption: "لكل قطعة",
    field: "Quantity",
    captionEn: "Per Piece",
  },
  {
    caption: "الكمية المستخدمة",
    field: "TotalQuantity",
    captionEn: "Total Needed",
  },
  {
    caption: "محجوز",
    field: "ReservedQuantity",
    captionEn: "Reserved",
  },
  {
    caption: "الرصيد الحالي",
    field: "CurrentQuantity",
    captionEn: "Current Quantity",
  },
  {
    caption: "الرصيد بعد",
    field: "Remain",
    captionEn: "Balance After",
  },
  {
    caption: "القيمة",
    field: "Cost",
    captionEn: "Unit Cost",
  },
  {
    caption: "القيمة",
    field: "Cost",
    captionEn: "Per Piece Cost",
  },
  {
    caption: "التكلفة الإجمالية",
    field: "TotalCost",
    captionEn: "Total Cost",
  },
];

export const ConfigColumns = (lookups, i18n) => [
  // {
  //   caption: "التصنيف",
  //   field: "CategoryId",
  //   captionEn: "Category",
  //   function: (data) =>
  //     getCategoryId(lookups, data.ElementId, data.Type)?.CategoryName,
  //   customizeText: (data) => {
  //     return (
  //       <div>
  //         {
  //           getCategoryId(lookups, data.data.ElementId, data.data.Type)
  //             ?.CategoryName
  //         }
  //       </div>
  //     );
  //   },
  // },
  {
    caption: "عنصر",
    field: "ElementId",
    display: "ElementName",
    value: "Id",
    captionEn: "Element",
    data: allElements(lookups),
  },
  {
    caption: "المورد",
    field: "SupplierId",
    captionEn: "Supplier",
    display: "SupplierName",
    value: "Id",
    data: lookups.Suppliers,
  },
  {
    caption: "اللون",
    field: "ColorId",
    captionEn: "Color",
    display: "ColorName",
    value: "Id",
    data: lookups.Colors,
  },

  {
    caption: "الرصيد الحالي",
    field: "CurrentQuantity",
    captionEn: "Current Quantity",
  },
  {
    caption: " الكمية",
    field: "Quantity",
    captionEn: " Quantity",
  },
  {
    caption: "بعد",
    field: "DoneQuantity",
    captionEn: "After",
  },
  {
    caption: "الكمية المطلوبة",
    field: "TotalNeedQuantity",
    captionEn: "Required quantity",
  },
  {
    caption: "سعر",
    field: "Cost",
    captionEn: "Price",
  },
  {
    caption: "السعر الكلي",
    field: "TotalNeedCost",
    captionEn: "Total Price",
  },
];
export const AllFunction = (displayName, All = false, i18n, data) => {
  try {
    return [
      {
        Id: 0,
        [displayName]: !All
          ? i18n.language == "en"
            ? "None"
            : "غير معروف"
          : i18n.language == "en"
          ? "All"
          : "الكل",
        // CategoryId: values.CategoryId,
      },
      ...data,
    ];
  } catch (err) {
    console.log(err);
  }

  return [];
};
