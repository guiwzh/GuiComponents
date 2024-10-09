import { ChangeEvent, FC, ReactNode, useRef, useState } from "react";
import axios, { CancelTokenSource } from "axios";

import UploadList from "../Upload/uploadList";
import Button from "../Button/button";
import Dragger from "./dragger";

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: "ready" | "error" | "success" | "uploading";
  raw?: File;
  response?: any;
  percent?: number;
  error?: any;
}
export interface sourceDict {
  [key: string]: CancelTokenSource;
}
export interface UploadProps {
  action: string;
  beforeUpload?: (file: File) => boolean | Promise<File>;
  onprogress?: (percentage: number, file: UploadFile) => void;
  onSuccess?: (data: any, file: UploadFile) => void;
  onError?: (err: any, file: UploadFile) => void;
  onChange?: (file: UploadFile) => void;
  onRemove?: (file: UploadFile) => void;
  headers?: { [key: string]: any };
  name?: string;
  data?: { [key: string]: any };
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
  drag?: boolean;
  maxsize?: number;
  maxnum?: number;
  failednums?: number;
  styleDrag?: React.CSSProperties;
  styleButton?: React.CSSProperties;
  styleUploadList?: React.CSSProperties;
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    beforeUpload,
    onprogress,
    onSuccess,
    onError,
    onChange,
    onRemove,
    name = "file",
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    drag,
    maxsize,
    maxnum,
    styleButton,
    styleDrag,
    styleUploadList,
    failednums = 0,
  } = props;

  const fileInput = useRef<HTMLInputElement>(null);
  const sourceRecord = useRef<sourceDict>({});

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleClick = () => {
    fileInput.current?.click();
  };

  const uploadFiles = (files: FileList) => {
    if (maxnum && files.length > maxnum) {
      alert(`文件数量不能超过${maxnum}`);
      return;
    }
    let postFiles = Array.from(files);
    postFiles.forEach((file) => {
      if (maxsize && file.size > maxsize * 1024 * 1024) {
        alert(`文件大小不能超过${maxsize}Mb`);
        return;
      }
      if (!beforeUpload) {
        post(file, 0);
      } else {
        const result = beforeUpload(file);
        if (result && result instanceof Promise) {
          result.then((processedFile) => {
            post(processedFile, 0);
          });
        } else if (result) {
          post(file, 0);
        }
      }
    });
  };
  const updateFileList = (
    updateFile: UploadFile,
    uploadobj: Partial<UploadFile>
  ) => {
    setFileList((prevList) => {
      return prevList.map((file) =>
        file.uid === updateFile.uid ? { ...file, ...uploadobj } : file
      );
    });
  };

  const post = (file: File, try_nums: number) => {
    let _file: UploadFile = {
      uid: Date.now() + "upload-file",
      size: file.size,
      name: file.name,
      percent: 0,
      status: "ready",
      raw: file,
    };
    setFileList((prevList) => {
      let isSame = false;
      for (let i = 0; i < prevList.length; i++) {
        if (prevList[i].name === _file.name) {
          //判断FileList中是否存在该上传文件， 若存在则更新该文件
          prevList[i] = _file;
          isSame = true;
        }
      }
      if (isSame) return prevList;
      return [_file, ...prevList];
    });

    const formData = new FormData();
    formData.append(name || "file", file);
    data && Object.keys(data).forEach((key) => formData.append(key, data[key]));
    const source = axios.CancelToken.source();
    sourceRecord.current = { ...sourceRecord.current, [_file.uid]: source }; //构建uid与source的键值对的对象
    axios
      .post(action, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        withCredentials,
        cancelToken: source.token,
        onUploadProgress: (e) => {
          let percentage = Math.floor((e.loaded * 100) / e.total! || 0);
          if (percentage < 100) {
            updateFileList(_file, { percent: percentage, status: "uploading" });
            _file.status = "uploading";
            _file.percent = percentage;
            onprogress?.(percentage, _file);
          }
        },
      })
      .then((res) => {
        updateFileList(_file, { status: "success", response: res.data });
        _file.status = "success";
        _file.response = res.data;
        onSuccess?.(res.data, _file);
        onChange?.(_file);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log(`${_file.name}${err.message}`);
        } else {
          if (try_nums < failednums) {
            post(file, try_nums + 1);
          }
          updateFileList(_file, { status: "error", error: err }); //若上一个判断条件执行了post，则此次updateFileList会失效，因为不存在相同的uid
          _file.status = "error";
          _file.error = err;
          onError?.(err, _file);
          onChange?.(_file);
        }
      });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadFiles(files);
      if (fileInput.current) {
        fileInput.current.value = ""; //上传完清空文件
      }
    }
  };
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter((item) => item.uid !== file.uid);
    });
    sourceRecord.current[file.uid]?.cancel("取消上传");
    onRemove?.(file);
  };
  return (
    <div className="viking-upload-component">
      {drag ? (
        <Dragger
          style={styleDrag}
          onFile={(files) => {
            uploadFiles(files);
          }}
        >
          {children}
        </Dragger>
      ) : (
        <Button btnType="default" onClick={handleClick} style={styleButton}>
          {children}
        </Button>
      )}
      <input
        type="file"
        className="viking-file-input"
        style={{ display: "none" }}
        ref={fileInput}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
      />
      <UploadList
        style={styleUploadList}
        fileList={fileList}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default Upload;
