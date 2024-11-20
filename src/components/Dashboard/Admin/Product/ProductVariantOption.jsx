import {
  findNonMatchingItems,
  formatProductData,
} from "@/utilities/lib/variant";
import { Button, Form, Input, InputNumber, Table } from "antd";
import { useCallback, useEffect, useState } from "react";

// Editable Cell component
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber controls={false} changeOnWheel={false} width={"full"} />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// Main component
const ProductVariantOption = ({
  combination,
  onCustomSubmit,
  data: editData,
  reset,
}) => {
  const [variantForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 330,
      editable: true,
      render: (name) => (
        <span className="text-dark   text-xs md:text-sm">{name}</span>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      editable: true,
      width: 130,
      render: (sku) => <span className="text-xs md:text-sm">{sku}</span>,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      editable: true,
      width: 100,
      render: (stock) => <span className="text-xs md:text-sm">{stock}</span>,
    },
    {
      title: "Buying Price",
      dataIndex: "buyingPrice",
      key: "buyingPrice",
      align: "right",
      editable: true,
      width: 150,
      render: (buyingPrice) => (
        <span className="text-xs md:text-sm">{buyingPrice}</span>
      ),
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      align: "right",
      width: 150,
      editable: true,
      render: (sellingPrice) => (
        <span className="text-xs md:text-sm">{sellingPrice}</span>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "right",
      width: 150,
      editable: true,
    },

    {
      title: "Action",
      dataIndex: "action",
      width: 130,
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        {
          return editable ? (
            <span className="flex items-center gap-2 justify-center font-bold">
              <Button size="small" onClick={cancel}>
                Cancel
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => save(record.key)}
              >
                Save
              </Button>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Button size="small" onClick={() => edit(record)}>
                Edit
              </Button>
            </span>
          );
        }
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "sellingPrice" ||
          col.dataIndex === "buyingPrice" ||
          col.dataIndex === "stock"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    if (!editData) {
      const variantDataSource =
        combination?.map((item) => {
          return {
            key: item.key,
            name: item.name,
            sku: item.sku,
            stock: item.stock,
            sellingPrice: item.sellingPrice,
            buyingPrice: item.buyingPrice,
            image: item.image,
            attributeCombination: item.variant_attribute_ids,
          };
        }) ?? [];

      setData(variantDataSource);

      const initialSelectedKeys = variantDataSource.map((item) => item.key);
      setIsSelected(initialSelectedKeys);
      setSelectedRowData(variantDataSource);
    } else {
      const formattedData = formatProductData(
        editData?.variants,
        editData?.name,
        editData?.sku
      );

      const variantDataSource =
        combination?.map((item) => {
          return {
            key: item.key,
            name: item.name,
            sku: item.sku,
            stock: item.stock,
            price: item.price,
            buyingPrice: item.buyingPrice,
            attributeCombination: item.variant_attribute_ids,
          };
        }) ?? [];

      const nonMatchingItems = findNonMatchingItems(
        formattedData,
        variantDataSource
      );

      let newData = [];
      if (reset) {
        newData = [...variantDataSource];
      } else {
        newData = [
          ...(Array.isArray(formattedData) ? formattedData : []),
          ...nonMatchingItems,
        ];
      }

      setData(newData);

      if (reset) {
        const initialSelectedKeys = variantDataSource?.map((item) => item.key);

        setIsSelected(initialSelectedKeys);
        setSelectedRowData(newData);
      } else {
        const initialSelectedKeys = formattedData?.map((item) => item.key);

        setIsSelected(initialSelectedKeys);
        setSelectedRowData(newData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combination, editData, reset]);

  // Editing handlers
  const edit = (record) => {
    variantForm.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      variantForm.validateFields(["name", "sku"]).then(() => {
        const row = variantForm.getFieldsValue();
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          setData(newData);
          setSelectedRowData(newData);
          setEditingKey("");
        } else {
          newData.push(row);
          setData(newData);
          setEditingKey("");
        }
      });
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
    }
  };

  const [selectedRowData, setSelectedRowData] = useState([]);
  const [isSelected, setIsSelected] = useState([]);

  const rowSelection = {
    selectedRowKeys: isSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setIsSelected(selectedRowKeys);
      setSelectedRowData(selectedRows);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
      sku: record.sku,
      price: record.price,
      buyingPrice: record.buyingPrice,
    }),
  };

  const handleCustomSubmit = useCallback(() => {
    return { selectedRowData };
  }, [selectedRowData]);

  onCustomSubmit(handleCustomSubmit);

  if (combination.length) {
    return (
      <Form form={variantForm} component={false}>
        <Table
          className="mb-5"
          components={{ body: { cell: EditableCell } }}
          title={() => <>Product Variant Options</>}
          size="small"
          pagination={false}
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          rowSelection={rowSelection}
          scroll={{
            x: "max-content",
          }}
        />
      </Form>
    );
  } else return null;
};

export default ProductVariantOption;
