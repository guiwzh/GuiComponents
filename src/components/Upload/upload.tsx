import react, {ChangeEvent, FC,useRef, useState } from 'react'
import axios from 'axios'

import Button from '../Button/button'

export interface UploadProps {
  action: string;
  onprogress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  // beforeUpload?: (file: File) => boolean | Promise<File>;
  // onChange?: (info: UploadChangeParam) => void;
  // children: React.ReactNode;
  
}

export const Upload:FC<UploadProps> = (props) => {
  const {action, onprogress, onSuccess, onError} = props

  const fileInput = useRef<HTMLInputElement>(null)
  const handleClick = () => {fileInput.current?.click()}

  const uploadFiles = (files: FileList) => {
    let postFiles =Array.from(files)
    postFiles.forEach(file => {
      const formData = new FormData()
      formData.append(file.name, file)
      axios.post(action, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total! || 0)
          if(percentage < 100){
              onprogress?.(percentage, file)
          }
      }}).then(res => {
          onSuccess?.(res.data, file)
      }).catch(err => {
          onError?.(err, file)
      })
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