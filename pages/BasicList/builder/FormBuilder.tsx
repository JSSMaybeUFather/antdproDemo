import { Form, Input, DatePicker, Switch, TreeSelect } from 'antd';
const formBuilder = (data: BasicListApi.Field[]) => {
    return data.map((field) => {
        switch (field.type) {
            case 'text':
                return (
                    <Form.Item key={field.key} label={field.title} name={field.key}>
                        <Input type={field.text} disabled={field.disabled} />
                    </Form.Item>
                );
            case 'datetime':
                return (
                    <Form.Item
                        key={field.key}
                        label={field.title}
                        name={field.key}
                        hidden={field.key === 'update_time'}
                    >
                        <DatePicker showTime disabled={field.disabled} />
                    </Form.Item>
                );
            case 'tree':
                return (
                    <Form.Item key={field.key} label={field.title} name={field.key}>
                        <TreeSelect treeData={field.data} disabled={field.disabled} treeCheckable />
                    </Form.Item>
                );
            case 'switch':
                return (
                    <Form.Item
                        key={field.key}
                        label={field.title}
                        name={field.key}
                        valuePropName={'checked'}
                    >
                        <Switch disabled={field.disabled} />
                    </Form.Item>
                );
            default:
                return null;
        }
    });
};
export default formBuilder;
