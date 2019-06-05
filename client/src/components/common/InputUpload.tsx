import React from 'react';
import { Form, Message } from 'semantic-ui-react';

interface InputUploadProps {
    id: string;
    placeholder: string;
    onFileChange: (file: File) => void;
}

const InputUpload: React.FC<InputUploadProps> = (props) => {
    const [fileName, changeFileName] = React.useState('');

    const handleFileChange = (event: any) => {
        const files = event.target.files;

        if (files.length === 1) {
            const file = files[0];
            changeFileName(file.name);

            props.onFileChange(file);
        }
    }

    return (
        <Form>
            <Form.Input
                value={fileName}
                placeholder={props.placeholder}
                readOnly
                onClick={() => {
                    document.getElementById(props.id)!.click()
                }}
                fluid
                input={{
                    style: {
                        cursor: 'pointer',
                    },
                }}
                style={{
                    marginBottom: 10
                }}
                action={{
                    color: 'blue',
                    labelPosition: 'right',
                    icon: 'upload',
                    content: 'Browse',
                    as: 'label',
                    htmlFor: props.id,
                }}
            />
            <input
                hidden
                id={props.id}
                multiple
                type='file'
                onChange={handleFileChange}
            />
        </Form>
    );
}

export default InputUpload;
