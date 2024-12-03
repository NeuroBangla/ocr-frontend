import React, { useMemo, useState } from 'react';
import { useFetch } from '../../netwrork/network';
import { List } from 'antd';
import { PixMark, IAnnotation } from 'pixmark/dist';

const BaseUrl = 'http://localhost:5000';

interface IFileList {
  loading: boolean;
  error?: string;
  fileList?: string[];
  onFileSeletect: (file: string) => void;
}

const FileList = ({ fileList, loading, onFileSeletect }: IFileList) => {
  return (
    <List
      loading={loading}
      header={<div>Files</div>}
      bordered
      dataSource={fileList}
      renderItem={item => (
        <List.Item onClick={() => { onFileSeletect(item) }}>
          {item}
        </List.Item>
      )}
    />
  );
}

const Landing = () => {
  const { data: fileList, loading: fileListLoading, error: fileListError } = useFetch<string[]>(`${BaseUrl}/list`);
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
  const onFileSeletect = (file: string) => {
    setSelectedFile(file);
  }

  const selectedFileUrl = useMemo(() => {
    return `${BaseUrl}/download/${selectedFile}`
  }, [selectedFile]);
  const selectedFileAnnotationsUrl = useMemo(() => {
    return `${BaseUrl}/get?filename=${selectedFile}`
  }, [selectedFile]);
  const { data: annotations } = useFetch<IAnnotation[]>(selectedFileAnnotationsUrl);


  return (
    <div style={{ display: 'flex' }}>
      <FileList fileList={fileList} loading={fileListLoading} error={fileListError} onFileSeletect={onFileSeletect} />
      <PixMark annotations={annotations || []} src={selectedFileUrl} />
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Landing;
