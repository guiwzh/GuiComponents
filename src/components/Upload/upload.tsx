import react, {ChangeEvent, FC,useRef, useState } from 'react'
import axios from 'axios'

import UploadList from '../Upload/uploadList'
import Button from '../Button/button'

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: 'ready' | 'error' | 'success' | 'uploading';
  raw?: File;
  response?: any;
  percent?: number;
  error?: any;
}

export interface UploadProps {
  action: string;

  defaultFileList?: UploadFile[];
  beforeUpload?: (file: File) => boolean | Promise<File>;
  onprogress?: (percentage: number, file: UploadFile) => void;
  onSuccess?: (data: any, file: UploadFile) => void;
  onError?: (err: any, file: UploadFile) => void;
  onChange?: (file : UploadFile) => void;
  onRemove?: (file: UploadFile) => void;
  headers?: {[key: string]: any };
  name?: string;
  data?: {[key: string]: any };
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  
}

export const Upload:FC<UploadProps> = (props) => {
  const {
    action,
    defaultFileList,
    beforeUpload,
    onprogress, 
    onSuccess, 
    onError,
    onChange,
    onRemove,
    headers,
    name='file',
    data,
    withCredentials,
    accept,
    multiple
  } = props
  
  const fileInput = useRef<HTMLInputElement>(null)

  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || [])
  const handleClick = () => {fileInput.current?.click()}

  const updateFileList = (updateFile: UploadFile,uploadobj:Partial<UploadFile>) =>{
    setFileList(prevList =>{
      return prevList.map(file => file.uid === updateFile.uid ? {...file,...uploadobj} : file)
    })
  } 

  const uploadFiles = (files: FileList) => {
    let postFiles =Array.from(files)
    postFiles.forEach(file => {
      if(!beforeUpload){
        post(file)
      }else{
        const result = beforeUpload(file)
        if(result && result instanceof Promise){
          result.then(processedFile => {
            post(processedFile)
          })
        }else if (result){
          post(file)
        }
      }
     
    })
  }
  const post = (file:File) => {
    let _file: UploadFile = {
      uid: Date.now() + 'upload-file', 
      size: file.size, 
      name: file.name,
      percent : 0,
      status: 'ready', 
      raw: file
    }
    setFileList(prevList => {
      return [_file, ...prevList]
    })

    const formData = new FormData()
    formData.append(name || 'file', file)
    data && Object.keys(data).forEach(key => formData.append(key, data[key]))
    axios.post(action, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials,
      onUploadProgress: (e) => {
        let percentage = Math.floor((e.loaded * 100) / e.total! || 0)
        if(percentage < 100){
          updateFileList(_file, {percent: percentage, status: 'uploading'})
          _file.status = 'uploading'
          _file.percent = percentage
          onprogress?.(percentage, _file)
        }
    }}).then(res => {
        updateFileList(_file, {status: 'success', response: res.data})
        _file.status = 'success'
        _file.response = res.data
        onSuccess?.(res.data, _file)
        onChange?.(_file)
    }).catch(err => {
        updateFileList(_file, {status: 'error', error: err})
        _file.status = 'error'
        _file.error = err
        onError?.(err, _file)
        onChange?.(_file)
    })
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(files) {
      uploadFiles(files)
      if(fileInput.current) {
        fileInput.current.value = ''//上传完清空文件
      }
    }
  }
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter(item => item.uid !== file.uid)
    })
    onRemove?.(file)
    
  }
  return(
    <div 
      className="viking-upload-component"
    >
        <Button 
          btnType='primary'
          onClick={handleClick}
        >
          上传文件
        </Button>
        <input 
          type="file" 
          className="viking-file-input"
          style={{display: 'none'}} 
          ref={fileInput}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />
       <UploadList 
        fileList={fileList}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Upload