import React, { useState } from "react";
import { Form, Upload, Button, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const VideoUploader = ({ name, label, rules }) => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length && newFileList[0].originFileObj) {
      const url = URL.createObjectURL(newFileList[0].originFileObj);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
        rules={rules}
      >
        <Upload
          listType="picture"
          accept="video/*"
          onChange={handleChange}
          beforeUpload={(file) => {
            const isVideo = file.type.startsWith("video/");
            if (!isVideo) {
              alert("You can only upload video files!");
            }
            return isVideo || Upload.LIST_IGNORE;
          }}
          fileList={fileList}
        >
          <Button icon={<UploadOutlined />}>Upload Video</Button>
        </Upload>
      </Form.Item>

      {previewUrl && (
        <div className="mt-4">
          <Button type="link" onClick={handlePreview}>
            Preview Video
          </Button>
        </div>
      )}

      <Modal
        open={previewVisible}
        title="Video Preview"
        footer={null}
        onCancel={handleCancel}
      >
        <video
          src={previewUrl}
          controls
          className="w-full"
          style={{ maxHeight: "400px" }}
        />
      </Modal>
    </>
  );
};

export default VideoUploader;
