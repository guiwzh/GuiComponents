import react, {ChangeEvent, FC,useRef, useState } from 'react'
import axios from 'axios'

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
  onprogress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onChange?: (file : File ) => void;
  onRemove?: (file: UploadFile) => void;
  // children: React.ReactNode;
  
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
    onRemove
  } = props
  
  const fileInput = useRef<HTMLInputElement>(null)

  const [fileList, setFileList] = useState<UploadFile[]>([])
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
      uid: Date.now() + 'file', 
      size: file.size, 
      name: file.name,
      percent : 0,
      status: 'ready', 
      raw: file
    }
    setFileList([_file, ...fileList])


    const formData = new FormData()
    formData.append(file.name, file)
    axios.post(action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total! || 0)
        if(percentage < 100){
          updateFileList(_file, {percent: percentage, status: 'uploading'})
          onprogress?.(percentage, file)
        }
    }}).then(res => {
        updateFileList(_file, {status: 'success', response: res.data})
        onSuccess?.(res.data, file)
        onChange?.(file)
    }).catch(err => {
        updateFileList(_file, {status: 'error', error: err})
        onError?.(err, file)
        onChange?.(file)
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
        />
    </div>
  )
}

export default Upload