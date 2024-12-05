import React, { useMemo, useState } from 'react';
import { useFetch } from '../../netwrork/network';
import { List, Modal } from 'antd';
import { PixMark, IAnnotation } from 'pixmark/dist';

const WarningModal = () => {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      title="Warning"
      closable
      footer={null}
      onCancel={() => setOpen(false)}
      open={open}
    >
      <div style={{ color: 'red' }}>
        This is just a DEMO. It is not connected to any OCR service. The annotations are hardcoded to give you example of what you are going to get. For a real use case, you need to connect to an OCR service. And for that you need to contact with me.
      </div>
    </Modal>
  );
}

const baseUrl = 'http://localhost:5000';

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
  const { data: fileList, loading: fileListLoading, error: fileListError } = useFetch<string[]>(`${baseUrl}/list`);
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
  const onFileSeletect = (file: string) => {
    setSelectedFile(file);
  }

  const selectedFileUrl = useMemo(() => {
    return `${baseUrl}/download/${selectedFile}`
  }, [selectedFile]);
  const selectedFileAnnotationsUrl = useMemo(() => {
    return `${baseUrl}/get?filename=${selectedFile}`
  }, [selectedFile]);
  const { data: annotations } = useFetch<IAnnotation[]>(selectedFileAnnotationsUrl);


  return (
    <div style={{ display: 'flex' }}>
      <WarningModal />
      <FileList fileList={fileList} loading={fileListLoading} error={fileListError} onFileSeletect={onFileSeletect} />
      <PixMark annotations={annotations || []} src={selectedFileUrl} />
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Landing;
