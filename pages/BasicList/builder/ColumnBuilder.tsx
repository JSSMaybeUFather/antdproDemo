import moment from 'moment';
import { Space, Tag } from 'antd';
import { Green, Red } from '../constant';
import actionBuilder from './ActionBuilder';
const columnBuilder = (_columns: any[], actionHandler: BasicListApi.ActionHandler) => {
    //先在原来的_columns基础上添加id的字段,然后再排除掉column上有hideInColumn字段的项
    let newColumns: BasicListApi.Field[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
    ]
        .concat(_columns ? _columns : [])
        .filter((obj: any) => {
            return !obj.hideInColumn;
        });
    //根据_columns中的column项的type属性来生成对应的render方法，需要特殊处理的有datetime，actions和switch
    newColumns = newColumns.map((_column) => {
        switch (_column.type) {
            case 'datetime':
                _column.render = (text: string) => {
                    return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
                };
                break;
            case 'actions':
                //component: "button", text: "Edit", type: "primary", action: "modal", uri: "/api/admins/:id"
                _column.render = (_: any, record: any) => {
                    return (
                        <Space>
                            {actionBuilder(_column.actions || [], actionHandler, false, record)}
                        </Space>
                    );
                };
                break;
            case 'switch':
                _column.render = (text: string) => {
                    return (
                        <Tag color={text ? Green : Red}>
                            {(_column.data || []).find((v: any) => v.value === text)?.title}
                        </Tag>
                    );
                };
                break;
            default:
                break;
        }
        _column.width = '20%';
        return _column;
    });
    return newColumns;
};
export default columnBuilder;
