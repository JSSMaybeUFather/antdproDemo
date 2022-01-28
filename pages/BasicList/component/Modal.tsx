import { Modal as AntdModal, Form, Input, message, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useRequest } from 'umi';
import actionBuilder from '../builder/ActionBuilder';
import formBuilder from '../builder/FormBuilder';
import { BaseUrl } from '../constant';
import { setFieldsAdaptor, submitFieldsAdaptor } from './helper';
interface ModalPropsType {
    modalVisible: any;
    setModalVisibleFalse: (reload?: boolean) => any;
    modalUri: any;
}

//自定义组件Modal
const Modal = ({ modalVisible, setModalVisibleFalse, modalUri }: ModalPropsType) => {
    //获取表单对象（ref）
    const [form] = Form.useForm();

    //两个请求 初始化Modal 以及 发送请求
    const init = useRequest<{ data: BasicListApi.PageData }>(`${modalUri}`, {
        manual: true,
        onError: () => {
            setModalVisibleFalse();
        },
    });
    const request = useRequest(
        (values: any) => {
            console.log(values);
            values.update_time = moment();
            message.loading({ content: 'Processing...', key: 'process', duration: 0 });
            const { uri, method, ...formValues } = values;
            return {
                url: `${BaseUrl}${uri}`,
                method: method,
                // body: JSON.stringify(formValues),
                data: {
                    ...submitFieldsAdaptor(formValues),
                    'X-API-KEY': 'antd',
                },
            };
        },
        {
            manual: true,
            onSuccess: (data: any) => {
                message.success({
                    content: data.message,
                    key: 'process',
                });
                setModalVisibleFalse(true);
            },
            formatResult: (response: any) => {
                return response;
            },
        },
    );

    //监控modal的状态，当modal显示的时候重置表单值，然后动态获取数据
    useEffect(() => {
        if (modalVisible) {
            form.resetFields();
            init.run();
        }
    }, [modalVisible]); //eslint-disable-line

    //监控init.data的值，当init.data不为空时，设置表单的内容
    useEffect(() => {
        if (init.data) {
            form.setFieldsValue(setFieldsAdaptor(init.data));
        }
    }, [init.data]); //eslint-disable-line

    /**
     *
     * @param action
     * actionHandler 定义了指定action，按钮进行的操作，这里当action.action为submit的时候，
     * 做的操作是向表单域添加两个值（uri，method），然后提交表单
     */
    const actionHandler = (action: BasicListApi.Action) => {
        switch (action.action) {
            case 'submit':
                form.setFieldsValue({ uri: action.uri, method: action.method });
                form.submit();
                break;
            case 'reset':
                form.resetFields();
                break;
            case 'cancel':
                setModalVisibleFalse();
            default:
                break;
        }
    };

    const layout = { labelCol: { span: 5 }, wrapperCol: { offset: 1, span: 16 } };
    return (
        <AntdModal
            title={init?.data?.page?.title}
            visible={modalVisible}
            // onOk={}
            onCancel={() => {
                setModalVisibleFalse();
            }}
            maskClosable={false}
            footer={
                
                <div style={{ position: 'relative' }}>
                    <Tag style={{ position: 'absolute', top: '2px', left: 0 }}>
                        {`UpdateTime:  ${moment(init?.data?.dataSource?.update_time).format(
                            'YYYY-MM-DD hh:mm:ss',
                        )}`}
                    </Tag>
                    {actionBuilder(
                        init.data?.layout.actions[0].data || [],
                        actionHandler,
                        request.loading,
                    )}
                </div>
            }
        >
            <Form
                {...layout}
                form={form}
                onFinish={(_values: any) => {
                    request.run(_values);
                }}
                initialValues={{
                    create_time: moment(),
                    update_time: moment(),
                    status: true,
                }}
            >
                <Form.Item name="uri" key="uri" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="method" key="method" hidden>
                    <Input />
                </Form.Item>
                {formBuilder(init.data?.layout?.tabs[0]?.data || [])}
            </Form>
        </AntdModal>
    );
};

export default Modal;
