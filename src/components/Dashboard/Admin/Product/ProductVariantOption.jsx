import { UploadOutlined } from "@ant-design/icons";
import {
  findNonMatchingItems,
  formatProductData,
} from "@/utilities/lib/variant";
import { Button, Form, Input, InputNumber, Table, Upload } from "antd";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  record,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber
        controls={false}
        changeOnWheel={false}
        width={"full"}
        value={record[dataIndex]}
        onChange={(value) => {
          record[dataIndex] = value;
        }}
      />
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

const ProductVariantOption = ({
  combination,
  onCustomSubmit,
  data: editData,
  reset,
}) => {
  const [variantForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  const handleFileUpload = (file, record) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = e.target.result;
      setData((prevState) =>
        prevState.map((item) =>
          item.key === record.key
            ? {
                ...item,
                image: file,
                fileData,
                preview: file.type.startsWith("image/")
                  ? URL.createObjectURL(file)
                  : null,
              }
            : item
        )
      );
    };
    reader.readAsDataURL(file);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 330,
      editable: true,
      render: (name) => (
        <span className="text-dark text-xs md:text-sm">{name}</span>
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
      title: "Upload File",
      key: "upload",
      render: (_, record) => (
        <div>
          <Upload
            beforeUpload={(file) => {
              handleFileUpload(file, record);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          {record.preview || record.image ? (
            <div style={{ marginTop: "10px" }}>
              <Image
                src={record.preview || record.image}
                alt="preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                width={100}
                height={100}
              />
            </div>
          ) : null}
          {!record.preview && record.image && (
            <p style={{ marginTop: "10px", fontSize: "12px" }}>
              {record.image.name}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 130,
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
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
    const mapCombinationToData = () => {
      if (!editData) {
        const variantDataSource =
          combination
            ?.filter((item) => item.name)
            .map((item) => ({
              key: item.key,
              name: item.name,
              sku: item.sku,
              stock: item.stock || 0,
              sellingPrice: item.sellingPrice || 0,
              buyingPrice: item.buyingPrice || 0,
              attributeCombination: item.variant_attribute_ids,
            })) ?? [];
        setData(variantDataSource);
        setSelectedRowKeys(variantDataSource.map((item) => item.key));
      } else {
        const formattedData = formatProductData(
          editData?.variants,
          editData?.name,
          editData?.sku
        );
        const variantDataSource =
          combination
            ?.filter((item) => item.name)
            .map((item) => ({
              key: item.key,
              name: item.name,
              sku: item.sku,
              stock: item.stock || 0,
              sellingPrice: item.sellingPrice || 0,
              buyingPrice: item.buyingPrice || 0,
              attributeCombination: item.variant_attribute_ids,
            })) ?? [];
        const nonMatchingItems = findNonMatchingItems(
          formattedData,
          variantDataSource
        );
        const newData = [
          ...(Array.isArray(formattedData) ? formattedData : []),
          ...nonMatchingItems,
        ];
        setData(newData);
        setSelectedRowKeys(newData.map((item) => item.key));
      }
    };
    mapCombinationToData();
  }, [combination, editData, reset]);

  const edit = (record) => {
    variantForm.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await variantForm.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        if (typeof row.stock === "string" || row.stock === "") {
          row.stock = parseFloat(row.stock) || 0;
        }
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      }
    } catch (err) {
      console.error("Error saving row:", err);
    }
  };

  const handleCustomSubmit = useCallback(
    () => ({
      selectedRowData: data.filter((item) =>
        selectedRowKeys.includes(item.key)
      ),
    }),
    [data, selectedRowKeys]
  );
  onCustomSubmit(handleCustomSubmit);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  };

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
          scroll={{ x: "max-content" }}
          rowSelection={rowSelection}
        />
      </Form>
    );
  }
  return null;
};

export default ProductVariantOption;
