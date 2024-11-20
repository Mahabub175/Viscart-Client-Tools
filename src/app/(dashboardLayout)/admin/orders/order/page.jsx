"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
} from "@/redux/services/order/orderApi";
import {
  Button,
  Dropdown,
  Menu,
  Modal,
  Pagination,
  Progress,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { toast } from "sonner";

const Orders = () => {
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: userOrders, isFetching } = useGetOrdersQuery({
    page: currentPage,
    limit: pageSize,
  });

  const { data: userOrder } = useGetSingleOrderQuery(itemId, {
    skip: !itemId,
  });

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleMenuClick = (key, id) => {
    setItemId(id);
    switch (key) {
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "tranId",
      key: "tranId",
      align: "center",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      align: "center",
    },
    {
      title: "Shipping Fee",
      dataIndex: "shippingFee",
      key: "shippingFee",
      align: "center",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "center",
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      align: "center",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (item, record) => {
        let color;
        let text;

        switch (item) {
          case "SUCCESS":
            color = "green";
            text = "Success";
            break;
          case "PENDING":
            color = "orange";
            text = "Pending";
            break;
          case "FAILED":
            color = "red";
            text = "Failed";
            break;
          default:
            color = "gray";
            text = "Unknown";
            break;
        }

        return (
          <Tag
            color={color}
            className="capitalize font-semibold cursor-pointer"
            onClick={() => {
              setItemId(record.key);
              setPaymentModalOpen(true);
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      align: "center",
      render: (item, record) => {
        let color;
        let text;

        switch (item) {
          case "delivered":
            color = "green";
            text = "Delivered";
            break;
          case "pending":
            color = "blue";
            text = "Pending";
            break;
          case "shipped":
            color = "orange";
            text = "Shipped";
            break;
          case "returned":
            color = "red";
            text = "Returned";
            break;
          default:
            color = "gray";
            text = "Unknown";
            break;
        }

        return (
          <Tag
            color={color}
            className="capitalize font-semibold cursor-pointer"
            onClick={() => {
              setItemId(record.key);
              setDeliveryModalOpen(true);
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Fraud Detection",
      dataIndex: "fraudDetection",
      key: "fraudDetection",
      align: "center",
      render: () => (
        <div
          onClick={() => {
            toast.info("Fraud Detection is not available in demo version.");
          }}
        >
          <Progress type="circle" percent={30} size={40} />
        </div>
      ),
    },
    {
      title: "Auto Delivery",
      dataIndex: "autoDelivery",
      key: "autoDelivery",
      align: "center",
      render: () => (
        <Button
          className="capitalize font-semibold cursor-pointer"
          type="primary"
          onClick={() => {
            toast.info("Auto Delivery is not available in demo version.");
          }}
        >
          Auto Delivery
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (item) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleMenuClick(key, item.key)}
            className="w-full flex flex-col gap-2"
          >
            <Menu.Item key="delete">
              <Tooltip placement="top" title={"Delete"}>
                <button className="bg-red-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <MdDelete />
                </button>
              </Tooltip>
            </Menu.Item>
          </Menu>
        );

        return (
          <Space size="middle">
            <Tooltip placement="top" title={"Details"}>
              <button
                onClick={() => {
                  setItemId(item.key);
                  setDetailsModalOpen(true);
                }}
                className="bg-blue-600 p-2 rounded-xl text-white hover:scale-110 duration-300"
              >
                <TbListDetails />
              </button>
            </Tooltip>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottom">
              <Tooltip placement="top" title={"More"}>
                <button className="bg-blue-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <BsThreeDotsVertical />
                </button>
              </Tooltip>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const tableData = userOrders?.results?.map((item) => ({
    key: item._id,
    tranId: item.tranId,
    products: item?.products
      ?.map((product) => product?.product?.name)
      .join(" , "),
    quantity: item?.products?.map((product) => product?.quantity).join(" , "),
    subTotal: item?.subTotal,
    shippingFee: item?.shippingFee,
    discount: item?.discount ?? 0,
    grandTotal: item?.grandTotal,
    paymentStatus: item?.paymentStatus,
    deliveryStatus: item?.deliveryStatus,
    paymentMethod: item?.paymentMethod,
  }));

  const handleOrderStatus = async (values) => {
    const toastId = toast.loading("Updating Order Status...");
    try {
      const updatedData = {
        id: itemId,
        data: values,
      };

      const res = await updateOrder(updatedData);

      if (res.data.success) {
        toast.success("Order Status Updated", { id: toastId });
        setDeliveryModalOpen(false);
        setPaymentModalOpen(false);
      } else {
        toast.error("An error occurred while updating the Order Status.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error updating Brand:", error);
      toast.error("An error occurred while updating the Order Status.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="px-5">
      <Table
        columns={columns}
        pagination={false}
        dataSource={tableData}
        className="mt-10"
        loading={isFetching}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={userOrders?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Order"}
        details={userOrder}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"order"}
        func={deleteOrder}
      />
      <Modal
        open={deliveryModalOpen}
        onCancel={() => setDeliveryModalOpen(false)}
        footer={null}
        centered
      >
        <CustomForm onSubmit={handleOrderStatus}>
          <CustomSelect
            name={"deliveryStatus"}
            label={"Deliver Status"}
            options={[
              { label: "Pending", value: "pending" },
              { label: "Shipped", value: "shipped" },
              { label: "Delivered", value: "delivered" },
              { label: "Returned", value: "returned" },
            ]}
          />
          <SubmitButton fullWidth text={"Update"} loading={isLoading} />
        </CustomForm>
      </Modal>
      <Modal
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={null}
        centered
      >
        <CustomForm onSubmit={handleOrderStatus}>
          <CustomSelect
            name={"paymentStatus"}
            label={"Payment Status"}
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Success", value: "SUCCESS" },
              { label: "Failed", value: "FAILED" },
            ]}
          />
          <SubmitButton fullWidth text={"Update"} loading={isLoading} />
        </CustomForm>
      </Modal>
    </div>
  );
};

export default Orders;
